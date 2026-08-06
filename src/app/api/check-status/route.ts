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

      const isPlacementPaid = Boolean(
        parentShadow.placement_paid === true ||
        Boolean(parentShadow.placement_payment_id) ||
        (parentShadow.notes || '').includes('Placement Fee Paid') ||
        (parentShadow.message || '').includes('Placement Fee Paid')
      );

      const isRegistrationSubmitted = Boolean(
        (parentShadow.child_name && parentShadow.child_name !== 'Pending Registration Form') ||
        (parentShadow.child_grade && parentShadow.child_grade !== 'Pending Registration Form') ||
        (parentShadow.notes || '').includes('Registration Form') ||
        isPlacementPaid
      );

      return NextResponse.json({
        success: true,
        role: 'parent',
        subType: 'shadow',
        isPlacementPaid,
        isRegistrationSubmitted,
        record: toCamelCase({
          ...parentShadow,
          placement_paid: isPlacementPaid,
          placementPaid: isPlacementPaid
        }),
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

      const isPlacementPaid = Boolean(
        parentTutor.placement_paid === true ||
        Boolean(parentTutor.placement_payment_id) ||
        (parentTutor.notes || '').includes('Placement Fee Paid') ||
        (parentTutor.message || '').includes('Placement Fee Paid')
      );

      const isRegistrationSubmitted = Boolean(
        (parentTutor.child_name && parentTutor.child_name !== 'Pending Registration Form') ||
        (parentTutor.child_grade && parentTutor.child_grade !== 'Pending Registration Form') ||
        (parentTutor.notes || '').includes('Registration Form') ||
        isPlacementPaid
      );

      return NextResponse.json({
        success: true,
        role: 'parent',
        subType: 'tutor',
        isPlacementPaid,
        isRegistrationSubmitted,
        record: toCamelCase({
          ...parentTutor,
          placement_paid: isPlacementPaid,
          placementPaid: isPlacementPaid
        }),
        matchedCandidate
      });
    }

    // 4B. Check Parent Therapy Requests table
    let parentTherapy: any = null;
    try {
      const { data: pth } = await supabase
        .from('parent_therapy_requests')
        .select('*')
        .or(`registration_id.ilike.%${cleanRegId}%,notes.ilike.%${cleanRegId}%`)
        .maybeSingle();
      parentTherapy = pth;
    } catch (e) {
      console.warn('Supabase query failed for parent_therapy_requests in check-status:', e);
    }

    if (!parentTherapy) {
      const { readDb } = await import('@/lib/db');
      const localDb = readDb();
      if (localDb.parent_therapy_requests) {
        parentTherapy = localDb.parent_therapy_requests.find((s: any) => 
          (s.registration_id || '').toUpperCase() === cleanRegId
        );
      }
    }

    if (parentTherapy && isContactMatch(parentTherapy.email || parentTherapy.email_address, parentTherapy.phone)) {
      const isPlacementPaid = Boolean(
        parentTherapy.placement_paid === true ||
        Boolean(parentTherapy.placement_payment_id) ||
        (parentTherapy.notes || '').includes('Placement Fee Paid')
      );

      const isRegistrationSubmitted = Boolean(
        (parentTherapy.childName && parentTherapy.childName !== 'Pending Registration Form') ||
        (parentTherapy.child_name && parentTherapy.child_name !== 'Pending Registration Form') ||
        isPlacementPaid
      );

      return NextResponse.json({
        success: true,
        role: 'parent',
        subType: 'therapy',
        isPlacementPaid,
        isRegistrationSubmitted,
        record: toCamelCase({
          ...parentTherapy,
          placement_paid: isPlacementPaid,
          placementPaid: isPlacementPaid
        })
      });
    }

    // 5. Check School Requests table (by registration_id: SCH-2026-XXXX)
    try {
      const { data: schoolReq } = await supabase
        .from('school_requests')
        .select('*')
        .ilike('registration_id', cleanRegId)
        .maybeSingle();

      if (schoolReq && isContactMatch(schoolReq.email, schoolReq.phone)) {
        return NextResponse.json({
          success: true,
          role: 'school',
          isPlacementPaid: Boolean(schoolReq.placement_paid),
          record: toCamelCase(schoolReq)
        });
      }
    } catch (err) {
      console.warn('Supabase lookup failed for school_requests in check-status, checking local DB:', err);
    }

    // 6. Check Bookings table (for standalone consultation bookings)
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

    // 7. Check local db.json fallback
    const { readDb } = await import('@/lib/db');
    const localDb = readDb();
    if (localDb.school_requests) {
      const sch = localDb.school_requests.find((s: any) => 
        (s.registration_id || '').toUpperCase() === cleanRegId && isContactMatch(s.email, s.phone)
      );
      if (sch) {
        return NextResponse.json({
          success: true,
          role: 'school',
          isPlacementPaid: Boolean(sch.placement_paid),
          record: toCamelCase(sch)
        });
      }
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
