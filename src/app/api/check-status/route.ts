import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      if (key === 'registration_id' || key === 'created_at') {
        res[key] = toCamelCase(obj[key]);
      } else {
        const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
        res[camelKey] = toCamelCase(obj[key]);
      }
    }
    return res;
  }
  return obj;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationId, contactInfo } = body;

    if (!registrationId || !contactInfo) {
      return NextResponse.json(
        { error: 'Please provide both your Registration ID and Phone Number/Email.' }, 
        { status: 400 }
      );
    }

    const cleanRegId = registrationId.trim().toUpperCase();
    const cleanContact = contactInfo.trim().toLowerCase();
    const cleanPhoneDigits = contactInfo.replace(/\D/g, '');

    const isContactMatch = (recordEmail?: string, recordPhone?: string) => {
      if (!recordEmail && !recordPhone) return false;
      const emailMatches = recordEmail && recordEmail.trim().toLowerCase() === cleanContact;
      const phoneDigits = recordPhone ? recordPhone.replace(/\D/g, '') : '';
      const phoneMatches = cleanPhoneDigits && phoneDigits && (phoneDigits.includes(cleanPhoneDigits) || cleanPhoneDigits.includes(phoneDigits));
      return Boolean(emailMatches || phoneMatches);
    };

    // 1. Check Shadow Teachers table
    const { data: shadow } = await supabase
      .from('shadow_teachers')
      .select('*')
      .ilike('registration_id', cleanRegId)
      .maybeSingle();

    if (shadow && isContactMatch(shadow.email, shadow.phone)) {
      return NextResponse.json({
        success: true,
        role: 'shadow',
        record: toCamelCase(shadow)
      });
    }

    // 2. Check Tutors table
    const { data: tutor } = await supabase
      .from('tutors')
      .select('*')
      .ilike('registration_id', cleanRegId)
      .maybeSingle();

    if (tutor && isContactMatch(tutor.email, tutor.phone)) {
      return NextResponse.json({
        success: true,
        role: 'tutor',
        record: toCamelCase(tutor)
      });
    }

    // 3. Check Parent Shadow Requests table (by registration_id or notes)
    const { data: parentShadow } = await supabase
      .from('parent_shadow_requests')
      .select('*')
      .or(`registration_id.ilike.%${cleanRegId}%,notes.ilike.%${cleanRegId}%`)
      .maybeSingle();

    if (parentShadow && isContactMatch(parentShadow.email, parentShadow.phone)) {
      let matchedCandidate = null;
      if (parentShadow.suggested_match_id) {
        const { data: candidate } = await supabase
          .from('shadow_teachers')
          .select('id, name, experience, qualification, specialization, special_needs_exp, comfortable_areas')
          .eq('id', parentShadow.suggested_match_id)
          .maybeSingle();
        matchedCandidate = candidate ? toCamelCase(candidate) : null;
      }

      return NextResponse.json({
        success: true,
        role: 'parent',
        subType: 'shadow',
        record: toCamelCase(parentShadow),
        matchedCandidate
      });
    }

    // 4. Check Parent Tutor Requests table (by registration_id or notes)
    const { data: parentTutor } = await supabase
      .from('parent_tutor_requests')
      .select('*')
      .or(`registration_id.ilike.%${cleanRegId}%,notes.ilike.%${cleanRegId}%`)
      .maybeSingle();

    if (parentTutor && isContactMatch(parentTutor.email, parentTutor.phone)) {
      let matchedCandidate = null;
      if (parentTutor.suggested_match_id) {
        const { data: candidate } = await supabase
          .from('tutors')
          .select('id, name, experience, qualification, specialization, subjects, grades')
          .eq('id', parentTutor.suggested_match_id)
          .maybeSingle();
        matchedCandidate = candidate ? toCamelCase(candidate) : null;
      }

      return NextResponse.json({
        success: true,
        role: 'parent',
        subType: 'tutor',
        record: toCamelCase(parentTutor),
        matchedCandidate
      });
    }

    // 5. Check Bookings table (for standalone consultation bookings)
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .ilike('booking_id', `%${cleanRegId}%`)
      .maybeSingle();

    if (booking && isContactMatch(booking.email, booking.phone)) {
      const isTutor = booking.requirement?.toLowerCase().includes('tutor');
      const msg = (booking.message || '').toLowerCase();
      const isCompleted = msg.includes('completed') || msg.includes('analysis') || msg.includes('unlocked');
      
      const record = {
        id: booking.id,
        bookingId: booking.booking_id,
        registrationId: booking.booking_id,
        parentName: booking.name,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        city: booking.city,
        serviceNeeded: booking.requirement,
        status: isCompleted ? 'Consultation Completed' : 'Consultation Booked',
        createdAt: booking.created_at
      };

      return NextResponse.json({
        success: true,
        role: 'parent',
        subType: isTutor ? 'tutor' : 'shadow',
        isConsultationBookingOnly: true,
        isCompleted,
        record
      });
    }

    return NextResponse.json(
      { error: "We couldn't find a matching record. Please verify your Registration ID or Booking ID and registered phone/email." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Check Status API Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
