import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/notifications';
import { readDb, writeDb } from '@/lib/db';

// Helpers to translate between frontend camelCase and Postgres snake_case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj !== null && typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      // Avoid double converting registration_id and created_at
      if (key === 'registration_id' || key === 'created_at') {
        res[key] = toSnakeCase(obj[key]);
      } else {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        res[snakeKey] = toSnakeCase(obj[key]);
      }
    }
    return res;
  }
  return obj;
}

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regId = searchParams.get('regId');

    if (!regId) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
    }

    // Look up in Tutors
    const { data: tutor } = await supabase
      .from('tutors')
      .select('*')
      .eq('registration_id', regId)
      .maybeSingle();
      
    if (tutor) {
      return NextResponse.json({ success: true, role: 'tutor', record: toCamelCase(tutor) });
    }

    // Look up in Shadow Teachers
    const { data: shadow } = await supabase
      .from('shadow_teachers')
      .select('*')
      .eq('registration_id', regId)
      .maybeSingle();

    if (shadow) {
      return NextResponse.json({ success: true, role: 'shadow', record: toCamelCase(shadow) });
    }

    // Look up in Parent Shadow Requests
    const { data: parentShadow } = await supabase
      .from('parent_shadow_requests')
      .select('*')
      .eq('registration_id', regId)
      .maybeSingle();

    if (parentShadow) {
      let matchedCandidate = null;
      if (parentShadow.suggested_match_id) {
        const { data: shadow } = await supabase
          .from('shadow_teachers')
          .select('id, name, experience, qualification, specialization, special_needs_exp, comfortable_areas')
          .eq('id', parentShadow.suggested_match_id)
          .maybeSingle();
        matchedCandidate = shadow ? toCamelCase(shadow) : null;
      }

      return NextResponse.json({ 
        success: true, 
        role: 'parent', 
        subType: 'shadow', 
        record: toCamelCase(parentShadow),
        matchedCandidate
      });
    }

    // Look up in Parent Tutor Requests
    const { data: parentTutor } = await supabase
      .from('parent_tutor_requests')
      .select('*')
      .eq('registration_id', regId)
      .maybeSingle();

    if (parentTutor) {
      let matchedCandidate = null;
      if (parentTutor.suggested_match_id) {
        const { data: tutor } = await supabase
          .from('tutors')
          .select('id, name, experience, qualification, specialization, subjects, grades')
          .eq('id', parentTutor.suggested_match_id)
          .maybeSingle();
        matchedCandidate = tutor ? toCamelCase(tutor) : null;
      }

      return NextResponse.json({ 
        success: true, 
        role: 'parent', 
        subType: 'tutor', 
        record: toCamelCase(parentTutor),
        matchedCandidate
      });
    }

    // Look up in School Requests
    try {
      const { data: schoolReq } = await supabase
        .from('school_requests')
        .select('*')
        .eq('registration_id', regId)
        .maybeSingle();

      if (schoolReq) {
        return NextResponse.json({
          success: true,
          role: 'school',
          record: toCamelCase(schoolReq)
        });
      }
    } catch (err) {
      console.warn('Supabase lookup failed for school_requests, checking local DB:', err);
    }

    // Fallback to local DB
    const { readDb } = await import('@/lib/db');
    const localDb = readDb();
    if (localDb.school_requests) {
      const sch = localDb.school_requests.find((s: any) => s.registration_id === regId);
      if (sch) {
        return NextResponse.json({
          success: true,
          role: 'school',
          record: toCamelCase(sch)
        });
      }
    }

    return NextResponse.json({ error: 'Registration ID not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Registration GET API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing registration type' }, { status: 400 });
    }

    const randomId = () => Math.random().toString(36).substring(2, 9);
    const randomNumericId = () => Math.floor(1000 + Math.random() * 9000).toString();
    const year = new Date().getFullYear();
    const createdAt = new Date().toISOString();

    // =========================================================
    // STEP 1: BOOK CONSULTATION (₹99)
    // =========================================================
    if (type === 'parent_consultation') {
      const { parentName, phone, email, city, serviceNeeded, razorpayPaymentId, razorpayOrderId, razorpaySignature, promoCode, code } = data;

      if (!parentName || !phone || !email || !city || !serviceNeeded) {
        return NextResponse.json({ error: 'Missing required consultation fields (Name, Phone, Email, City, Service Needed).' }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanPhoneDigits = phone.replace(/\D/g, '');
      const cleanPromoCode = (promoCode || code || '').trim().toUpperCase();
      const isVipCode = cleanPromoCode === 'SHADOW100';

      // Check if parent already registered
      const { data: existingShadow } = await supabase
        .from('parent_shadow_requests')
        .select('*')
        .or(`email.ilike.${cleanEmail},phone.ilike.%${cleanPhoneDigits}%`)
        .maybeSingle();

      const { data: existingTutor } = await supabase
        .from('parent_tutor_requests')
        .select('*')
        .or(`email.ilike.${cleanEmail},phone.ilike.%${cleanPhoneDigits}%`)
        .maybeSingle();

      const existingRecord = existingShadow || existingTutor;
      
      // If VIP code SHADOW100 is used on existing record, upgrade status to Consultation Completed
      if (existingRecord && isVipCode && (existingRecord.status === 'Consultation Booked' || !existingRecord.consultation_paid)) {
        const targetTable = existingShadow ? 'parent_shadow_requests' : 'parent_tutor_requests';
        await supabase
          .from(targetTable)
          .update({
            status: 'Consultation Completed',
            consultation_paid: true,
            notes: (existingRecord.notes || '') + ' | Upgraded via VIP Code SHADOW100'
          })
          .eq('id', existingRecord.id);

        const targetRegId = existingRecord.registration_id;
        return NextResponse.json({
          success: true,
          isVip: true,
          registration_id: targetRegId,
          redirectUrl: `/register/parent/form?regId=${encodeURIComponent(targetRegId)}`,
          status: 'Consultation Completed',
          message: 'VIP Access Code applied! Registration form unlocked.'
        });
      }

      if (existingRecord && (existingRecord.consultation_paid || existingRecord.status !== 'Consultation Booked')) {
        return NextResponse.json({
          success: true,
          alreadyPaid: true,
          registration_id: existingRecord.registration_id,
          redirectUrl: `/register/parent/form?regId=${encodeURIComponent(existingRecord.registration_id)}`,
          status: existingRecord.status,
          message: 'Consultation fee has already been paid for this parent account.'
        });
      }

      // Verify Razorpay payment if NOT using VIP promo code
      if (!isVipCode) {
        if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
          return NextResponse.json({ error: 'Missing payment verification credentials.' }, { status: 400 });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
        const shasum = crypto.createHmac('sha256', keySecret);
        shasum.update(razorpayOrderId + '|' + razorpayPaymentId);
        if (shasum.digest('hex') !== razorpaySignature) {
          return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 });
        }
      }

      const generatedId = `SB-${year}-${randomNumericId()}`;
      const bookingId = generatedId; // Single unified ID across all tables
      const isTherapy = serviceNeeded.toLowerCase().includes('therapy');
      const isShadow = !isTherapy && serviceNeeded.toLowerCase().includes('shadow');
      const finalStatus = isVipCode ? 'Consultation Completed' : 'Consultation Booked';
      const therapyTypeSelected = data.therapyType || 'ABA Therapy';

      // Insert into bookings table
      const bookingData = {
        booking_id: generatedId,
        name: parentName,
        phone,
        email: cleanEmail,
        city: isTherapy ? 'Delhi NCR' : city,
        child_age: 'Pending Registration Form',
        requirement: isTherapy ? `Therapy: ${therapyTypeSelected}` : (isShadow ? 'Shadow Teacher' : 'Home Tutor'),
        message: isVipCode ? 'Step 1 VIP Access Unlocked via SHADOW100' : 'Step 1 Consultation Booked',
        payment_status: isVipCode ? 'waived_shadow100' : 'paid',
        amount: isVipCode ? 0 : 99,
        razorpay_payment_id: isVipCode ? 'VIP-SHADOW100' : razorpayPaymentId,
        razorpay_order_id: isVipCode ? 'VIP-SHADOW100' : razorpayOrderId,
        razorpay_signature: isVipCode ? 'VIP-SHADOW100' : razorpaySignature
      };

      const { error: bookingErr } = await supabase.from('bookings').insert([bookingData]);
      if (bookingErr) {
        console.error(`❌ Supabase bookings insert FAILED for ${generatedId} | PaymentID: ${razorpayPaymentId} | OrderID: ${razorpayOrderId}:`, bookingErr);
      } else {
        console.log(`✅ Booking saved: ${generatedId} | PaymentID: ${razorpayPaymentId} | OrderID: ${razorpayOrderId}`);
      }

      // Insert into parent request table
      const parentTable = isTherapy ? 'parent_therapy_requests' : (isShadow ? 'parent_shadow_requests' : 'parent_tutor_requests');
      const parentRecord: any = {
        id: (isTherapy ? 'parent-therapy-' : (isShadow ? 'parent-shadow-' : 'parent-tutor-')) + randomId(),
        parent_name: parentName,
        phone,
        email: cleanEmail,
        city: isTherapy ? 'Delhi NCR' : city,
        child_name: 'Pending Registration Form',
        child_grade: 'Pending Registration Form',
        status: finalStatus,
        consultation_paid: true,
        registration_id: generatedId,
        created_at: createdAt,
        razorpay_payment_id: isVipCode ? 'VIP-SHADOW100' : razorpayPaymentId,
        razorpay_order_id: isVipCode ? 'VIP-SHADOW100' : razorpayOrderId,
        razorpay_signature: isVipCode ? 'VIP-SHADOW100' : razorpaySignature,
        notes: isVipCode ? `VIP Access via Code SHADOW100 | Unified ID: ${generatedId}` : `Unified ID: ${generatedId}`
      };

      if (isTherapy) {
        parentRecord.therapy_type = therapyTypeSelected;
        parentRecord.challenges = 'Pending Registration Form';
        parentRecord.goals = 'Pending Registration Form';
      } else if (isShadow) {
        parentRecord.relationship = 'Mother';
      } else {
        parentRecord.tutor_type = 'Academic Tuition/Subjects';
      }

      const { error: pErr } = await supabase.from(parentTable).insert([parentRecord]);
      if (pErr) {
        console.error(`❌ Supabase ${parentTable} insert FAILED for ${generatedId} | PaymentID: ${razorpayPaymentId}:`, pErr);
      } else {
        console.log(`✅ Parent record saved to ${parentTable}: ${generatedId} | PaymentID: ${razorpayPaymentId}`);
      }

      // Also update local db.json fallback
      const localDb = readDb();
      if (isTherapy) {
        if (!localDb.parent_therapy_requests) localDb.parent_therapy_requests = [];
        localDb.parent_therapy_requests.push({
          id: parentRecord.id,
          parentName,
          phone,
          email: cleanEmail,
          city: 'Delhi NCR',
          childName: 'Pending Registration Form',
          therapyType: therapyTypeSelected,
          challenges: 'Pending Registration Form',
          goals: 'Pending Registration Form',
          status: finalStatus as any,
          consultation_paid: true,
          registration_id: generatedId,
          created_at: createdAt,
          notes: parentRecord.notes
        });
        writeDb(localDb);
      }

      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';

      // Send Parent Receipt & Admin Alert Emails concurrently and await completion
      await Promise.allSettled([
        sendEmail({
          to: cleanEmail,
          subject: `Consultation Booked - The Shadow Bridge [${generatedId}]`,
          type: 'registration',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
            <p style="margin: 0 0 16px 0;">Thank you for booking a 1-on-1 consultation session for <strong>${serviceNeeded}</strong> support with Founder Pratibha Mishra.</p>
            <p style="margin: 0 0 16px 0;">We have received your consultation fee payment of <strong>₹99</strong>.</p>
            
            <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 20px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #3B2A6B; font-family: Georgia, serif;">Your Login &amp; Consultation Details</h3>
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: #3B2A6B;">Your Unique ID: <span style="font-family: monospace; color: #B0206B; font-size: 16px;">${generatedId}</span></p>
              <p style="margin: 0 0 8px 0;"><strong>Service Selected:</strong> ${serviceNeeded}</p>
              <p style="margin: 0;"><strong>Status:</strong> Consultation Booked (Call Pending)</p>
            </div>

            <div style="margin: 20px 0; background-color: #FFF9EB; border-left: 4px solid #C89B3C; padding: 16px 20px; border-radius: 4px; font-size: 13px; color: #5C4300; line-height: 1.6;">
              <strong>How to Check Your Status:</strong><br />
              To check your consultation status or access your child registration form anytime, visit <a href="${protocol}://${host}/check-status" style="color: #B0206B; font-weight: bold; text-decoration: underline;">theshadowbridge.com/check-status</a> and enter your <strong>ID (${generatedId})</strong> along with the phone number (<strong>${phone}</strong>) or email (<strong>${cleanEmail}</strong>) you registered with.
            </div>

            <p style="margin: 0 0 20px 0;">Founder Pratibha Mishra will call you directly within 24 hours to conduct your assessment consultation.</p>

            <div style="margin: 24px 0;">
              <a href="${protocol}://${host}/check-status?regId=${generatedId}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">Check Status &amp; Access Registration Form →</a>
            </div>
          `
        }).catch(err => console.error('Parent consultation email fail:', err)),

        sendEmail({
          to: 'theshadowbridgesupport@gmail.com',
          subject: `New Parent Consultation Booked: ${parentName} [${generatedId}]`,
          type: 'contact_alert',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Parent Consultation Booked</h2>
            <p style="margin: 0 0 16px 0; color: #4A3E5E;">A new parent has booked and paid the ₹99 consultation fee.</p>
            
            <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
              <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${generatedId}</p>
              <p style="margin: 0 0 8px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
              <p style="margin: 0 0 8px 0;"><strong>Parent Name:</strong> ${parentName}</p>
              <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${cleanEmail}</p>
              <p style="margin: 0 0 8px 0;"><strong>City:</strong> ${city}</p>
              <p style="margin: 0;"><strong>Service Requested:</strong> ${serviceNeeded}</p>
            </div>

            <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to mark this consultation as completed after calling the parent.</p>
          `
        }).catch(err => console.error('Admin consultation alert fail:', err))
      ]);

      return NextResponse.json({ 
        success: true, 
        isVip: isVipCode,
        registration_id: generatedId, 
        booking_id: bookingId, 
        redirectUrl: `/register/parent/form?regId=${encodeURIComponent(generatedId)}`,
        record: toCamelCase(parentRecord) 
      });
    }

    // =========================================================
    // STEP 4: GATED PARENT REGISTRATION FORM SUBMISSION
    // =========================================================
    if (type === 'parent_registration_submit') {
      const { regId, email, phone, childName, childAge, childGender, childGrade, schoolLocation, homeLocation, hasDiagnosis, diagnosis, difficulties, tutorType, subjects, additionalNotes } = data;

      const missing: string[] = [];
      if (!regId) missing.push('Registration ID or Booking ID');
      if (!childName || !childName.trim()) missing.push("Child's Name");
      if (!childGrade || !childGrade.trim()) missing.push("Class / Grade");

      if (missing.length > 0) {
        return NextResponse.json({ error: `Please fill in required details: ${missing.join(', ')}.` }, { status: 400 });
      }

      const cleanRegId = regId.trim().toUpperCase();
      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const cleanPhoneDigits = phone ? phone.replace(/\D/g, '') : '';

      // Find record in parent_shadow_requests, parent_tutor_requests, or parent_therapy_requests
      let ps: any = null;
      let pt: any = null;
      let pth: any = null;

      const { data: psData } = await supabase
        .from('parent_shadow_requests')
        .select('*')
        .or(`registration_id.ilike.%${cleanRegId}%,notes.ilike.%${cleanRegId}%`)
        .maybeSingle();
      ps = psData;

      if (!ps) {
        const { data: ptData } = await supabase
          .from('parent_tutor_requests')
          .select('*')
          .or(`registration_id.ilike.%${cleanRegId}%,notes.ilike.%${cleanRegId}%`)
          .maybeSingle();
        pt = ptData;
      }

      if (!ps && !pt) {
        try {
          const { data: pthData } = await supabase
            .from('parent_therapy_requests')
            .select('*')
            .or(`registration_id.ilike.%${cleanRegId}%,notes.ilike.%${cleanRegId}%`)
            .maybeSingle();
          pth = pthData;
        } catch (e) {
          console.warn('Supabase query failed for parent_therapy_requests:', e);
        }
      }

      // Check local db.json fallback for therapy requests
      if (!ps && !pt && !pth) {
        const localDb = readDb();
        if (localDb.parent_therapy_requests) {
          pth = localDb.parent_therapy_requests.find((s: any) => 
            (s.registration_id || '').toUpperCase() === cleanRegId || (s.email || '').toLowerCase() === cleanEmail
          );
        }
      }

      let parentRecord = ps || pt || pth;
      let targetTable = ps ? 'parent_shadow_requests' : (pt ? 'parent_tutor_requests' : 'parent_therapy_requests');

      // If missing, check bookings table and auto-create appropriate request row
      if (!parentRecord) {
        const { data: bk } = await supabase
          .from('bookings')
          .select('*')
          .or(`booking_id.ilike.%${cleanRegId}%,email.ilike.${cleanEmail}`)
          .maybeSingle();

        if (bk) {
          const reqStr = (bk.requirement || '').toLowerCase();
          const isTherapy = reqStr.includes('therapy');
          const isTutor = !isTherapy && reqStr.includes('tutor');
          targetTable = isTherapy ? 'parent_therapy_requests' : (isTutor ? 'parent_tutor_requests' : 'parent_shadow_requests');
          const generatedRegId = bk.booking_id || cleanRegId || `SB-${year}-${randomNumericId()}`;

          const newRecord: any = {
            id: (isTherapy ? 'parent-therapy-' : (isTutor ? 'parent-tutor-' : 'parent-shadow-')) + randomId(),
            parent_name: bk.name || 'Parent',
            phone: bk.phone,
            email: bk.email,
            city: isTherapy ? 'Delhi NCR' : (bk.city || 'Delhi NCR'),
            child_name: childName.trim(),
            child_dob: childAge || '',
            child_gender: childGender || 'Boy',
            child_grade: childGrade ? childGrade.trim() : 'Preschool',
            home_location: homeLocation || bk.city || 'Delhi NCR',
            status: 'Registration Submitted',
            consultation_paid: true,
            registration_id: generatedRegId,
            created_at: createdAt,
            notes: additionalNotes || `Linked Booking ID: ${bk.booking_id}`
          };

          if (isTherapy) {
            newRecord.therapy_type = data.therapyType || 'ABA Therapy';
            newRecord.diagnosis = diagnosis || '';
            newRecord.challenges = difficulties || data.challenges || '';
            newRecord.goals = data.goals || '';
          } else if (isTutor) {
            newRecord.tutor_type = tutorType || 'Academic Tuition/Subjects';
            newRecord.subjects = Array.isArray(subjects) ? subjects.join(', ') : (subjects || '');
          } else {
            newRecord.relationship = 'Mother';
            newRecord.school_location = schoolLocation || '';
            newRecord.has_diagnosis = hasDiagnosis || 'No';
            newRecord.diagnosis = diagnosis || '';
            newRecord.difficulties = Array.isArray(difficulties) ? difficulties.join(', ') : (difficulties || '');
          }

          try {
            const { data: created, error: cErr } = await supabase.from(targetTable).insert([newRecord]).select().single();
            if (!cErr && created) parentRecord = created;
          } catch (e) {
            console.warn(`Supabase insert failed for ${targetTable}:`, e);
          }

          // Fallback to local DB
          if (isTherapy) {
            const localDb = readDb();
            if (!localDb.parent_therapy_requests) localDb.parent_therapy_requests = [];
            localDb.parent_therapy_requests.push({
              id: newRecord.id,
              parentName: newRecord.parent_name,
              phone: newRecord.phone,
              email: newRecord.email,
              city: 'Delhi NCR',
              childName: newRecord.child_name,
              therapyType: newRecord.therapy_type,
              challenges: newRecord.challenges,
              goals: newRecord.goals,
              status: 'Registration Form Submitted',
              consultation_paid: true,
              registration_id: generatedRegId,
              created_at: createdAt
            });
            writeDb(localDb);
          }

          return NextResponse.json({
            success: true,
            registration_id: generatedRegId,
            status: 'Registration Submitted',
            nextStep: 'placement_fee',
            record: toCamelCase(newRecord)
          });
        }

        return NextResponse.json({ error: 'Parent registration record not found for the provided ID.' }, { status: 404 });
      }

      // Check if consultation is completed
      const curStatus = (parentRecord.status || '').toLowerCase();
      if (!curStatus.includes('completed') && !curStatus.includes('submitted') && !curStatus.includes('paid') && !curStatus.includes('matching')) {
        return NextResponse.json({ error: 'Please complete your consultation call first before submitting this form.' }, { status: 403 });
      }

      const updates: any = {
        child_name: childName,
        child_dob: childAge || '',
        child_gender: childGender || 'Boy',
        child_grade: childGrade || 'Preschool',
        home_location: homeLocation || parentRecord.city || 'Delhi NCR',
        status: 'Registration Submitted'
      };

      if (pth || targetTable === 'parent_therapy_requests') {
        updates.diagnosis = diagnosis || '';
        updates.challenges = Array.isArray(difficulties) ? difficulties.join(', ') : (difficulties || data.challenges || '');
        updates.goals = data.goals || '';
        if (data.therapyType) updates.therapy_type = data.therapyType;
        if (data.preferredDays) updates.preferred_days = data.preferredDays;
        if (data.preferredTime) updates.preferred_time = data.preferredTime;
      } else if (ps) {
        updates.school_location = schoolLocation || '';
        updates.has_diagnosis = hasDiagnosis || 'No';
        updates.diagnosis = diagnosis || '';
        updates.difficulties = Array.isArray(difficulties) ? difficulties.join(', ') : (difficulties || '');
      } else if (pt) {
        updates.tutor_type = tutorType || 'Academic Tuition/Subjects';
        updates.subjects = Array.isArray(subjects) ? subjects.join(', ') : (subjects || '');
      }

      if (additionalNotes) {
        updates.notes = additionalNotes;
      }

      try {
        await supabase
          .from(targetTable)
          .update(updates)
          .eq('id', parentRecord.id);
      } catch (e) {
        console.warn(`Supabase update failed for ${targetTable}:`, e);
      }

      // Update local db.json
      if (pth || targetTable === 'parent_therapy_requests') {
        const localDb = readDb();
        if (localDb.parent_therapy_requests) {
          const idx = localDb.parent_therapy_requests.findIndex((s: any) => s.registration_id === cleanRegId || s.id === parentRecord.id);
          if (idx !== -1) {
            localDb.parent_therapy_requests[idx] = {
              ...localDb.parent_therapy_requests[idx],
              childName,
              childAge,
              diagnosis: diagnosis || '',
              challenges: updates.challenges,
              goals: updates.goals,
              preferredDays: data.preferredDays,
              preferredTime: data.preferredTime,
              status: 'Registration Form Submitted'
            };
            writeDb(localDb);
          }
        }
      }

      return NextResponse.json({
        success: true,
        registration_id: cleanRegId,
        status: 'Registration Submitted',
        nextStep: 'placement_fee',
        record: toCamelCase({ ...parentRecord, ...updates })
      });
    }

    // =========================================================
    // STEP 5: PLACEMENT FEE PAYMENT SUBMISSION
    // =========================================================
    if (type === 'parent_placement_payment') {
      const { regId, razorpayPaymentId, razorpayOrderId, razorpaySignature, promoCode } = data;

      const cleanRegId = (regId || '').trim().toUpperCase();
      const cleanPromoCode = (promoCode || '').trim().toUpperCase();
      const isVipHi5000 = cleanPromoCode === 'HI5000';

      if (!isVipHi5000 && (!regId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature)) {
        return NextResponse.json({ error: 'Missing placement payment parameters.' }, { status: 400 });
      }

      if (!isVipHi5000) {
        const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
        const shasum = crypto.createHmac('sha256', keySecret);
        shasum.update(razorpayOrderId + '|' + razorpayPaymentId);
        if (shasum.digest('hex') !== razorpaySignature) {
          return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 });
        }
      }

      // Check shadow vs tutor vs therapy (PARENTS ONLY)
      const { data: ps } = await supabase
        .from('parent_shadow_requests')
        .select('*')
        .eq('registration_id', cleanRegId)
        .maybeSingle();

      const { data: pt } = await supabase
        .from('parent_tutor_requests')
        .select('*')
        .eq('registration_id', cleanRegId)
        .maybeSingle();

      let pth: any = null;
      try {
        const { data: pthData } = await supabase
          .from('parent_therapy_requests')
          .select('*')
          .eq('registration_id', cleanRegId)
          .maybeSingle();
        pth = pthData;
      } catch (e) {
        console.warn('Supabase query failed for parent_therapy_requests in placement payment:', e);
      }

      // Local DB fallback for therapy
      if (!ps && !pt && !pth) {
        const localDb = readDb();
        if (localDb.parent_therapy_requests) {
          pth = localDb.parent_therapy_requests.find((s: any) => s.registration_id === cleanRegId);
        }
      }

      const parentRecord = ps || pt || pth;
      const targetTable = ps ? 'parent_shadow_requests' : (pt ? 'parent_tutor_requests' : 'parent_therapy_requests');

      if (!parentRecord) {
        return NextResponse.json({ 
          error: isVipHi5000 
            ? 'Promo code HI5000 is valid for parent shadow/tutor placement fees only. No matching parent record found.' 
            : 'Parent record not found.' 
        }, { status: 404 });
      }

      // Note: HI5000 code only applies to Shadow/Tutor, NOT Therapy
      if (isVipHi5000 && pth) {
        return NextResponse.json({
          error: 'Promo code HI5000 is valid for parent Shadow/Tutor placement fees only, not for Therapy bookings.'
        }, { status: 400 });
      }

      const newStatus = pth 
        ? 'Therapy Matching in Progress' 
        : (ps ? 'Shadow Teacher Matching in Progress' : 'Home Tutor Matching in Progress');

      const finalPaymentId = isVipHi5000 ? 'N/A (VIP HI5000)' : (razorpayPaymentId || null);
      const finalOrderId = isVipHi5000 ? 'N/A (VIP HI5000)' : (razorpayOrderId || null);
      const noteAppend = isVipHi5000 
        ? ' | Placement Fee Waived via VIP Code HI5000' 
        : ` | Placement Fee Paid (Payment ID: ${razorpayPaymentId})`;

      try {
        await supabase
          .from(targetTable)
          .update({
            placement_paid: true,
            status: newStatus,
            placement_payment_id: finalPaymentId,
            placement_order_id: finalOrderId,
            notes: (parentRecord.notes || '') + noteAppend
          })
          .eq('id', parentRecord.id);
      } catch (e) {
        console.warn(`Supabase update failed for ${targetTable} placement payment:`, e);
      }

      // Update local db.json
      if (pth || targetTable === 'parent_therapy_requests') {
        const localDb = readDb();
        if (localDb.parent_therapy_requests) {
          const idx = localDb.parent_therapy_requests.findIndex((s: any) => s.registration_id === cleanRegId || s.id === parentRecord.id);
          if (idx !== -1) {
            localDb.parent_therapy_requests[idx] = {
              ...localDb.parent_therapy_requests[idx],
              placement_paid: true,
              placement_payment_id: finalPaymentId,
              placement_order_id: finalOrderId,
              status: 'Matching in Progress'
            };
            writeDb(localDb);
          }
        }
      }

      // Send Placement Confirmation Email
      await Promise.allSettled([
        sendEmail({
          to: parentRecord.email,
          subject: `Placement Fee Received - ${newStatus} [${cleanRegId}]`,
          type: 'placement_confirmed',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentRecord.parent_name},</h2>
            <p style="margin: 0 0 16px 0;">We have received your placement fee payment. Our clinical matchmaking team is now actively matching background-verified educators for <strong>${parentRecord.child_name || 'your child'}</strong>!</p>
            
            <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
              <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${cleanRegId}</p>
              <p style="margin: 0 0 8px 0;"><strong>Status:</strong> ${newStatus}</p>
              <p style="margin: 0;"><strong>Payment ID:</strong> ${razorpayPaymentId}</p>
            </div>
          `
        }).catch(err => console.error('Placement payment email fail:', err))
      ]);

      return NextResponse.json({
        success: true,
        registration_id: cleanRegId,
        status: newStatus,
        record: toCamelCase({ ...parentRecord, status: newStatus })
      });
    }

    if (type === 'parent') {
      const { 
        parentName, relationship, phone, email, city, childName, childAge, childGrade, 
        supportNeeded, hasDiagnosis, diagnosis, difficulties, otherDifficulty, schoolLocation, 
        homeLocation, takesTherapy, therapies, otherTherapy, tutorType, otherTutorType, subjects,
        razorpayPaymentId, razorpayOrderId, razorpaySignature
      } = data;

      if (!parentName || !phone || !email || !city || !childName || !childGrade || !supportNeeded) {
        return NextResponse.json({ error: 'Missing parent fields' }, { status: 400 });
      }

      // 1. Verify Razorpay Transaction parameters
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return NextResponse.json({ error: 'Missing Razorpay payment parameters' }, { status: 400 });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
      const shasum = crypto.createHmac('sha256', keySecret);
      shasum.update(razorpayOrderId + '|' + razorpayPaymentId);
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        return NextResponse.json({ error: 'Razorpay payment signature verification failed' }, { status: 400 });
      }

      const generatedId = `SB-${year}-${randomNumericId()}`;

      // Check if it is Shadow or Tutor support
      if (supportNeeded.toLowerCase().includes('shadow')) {
        const record = {
          id: 'parent-shadow-' + randomId(),
          parentName,
          relationship: relationship || 'Mother',
          phone,
          email,
          childName,
          childDob: data.childDob || '',
          childGender: data.childGender || 'Boy',
          childGrade,
          hasDiagnosis: hasDiagnosis || 'No',
          diagnosis: diagnosis || '',
          difficulties: Array.isArray(difficulties) ? difficulties.join(', ') : (difficulties || ''),
          otherDifficulty: otherDifficulty || '',
          city,
          schoolLocation: schoolLocation || '',
          homeLocation: homeLocation || '',
          takesTherapy: takesTherapy || 'No',
          therapies: Array.isArray(therapies) ? therapies.join(', ') : (therapies || ''),
          otherTherapy: otherTherapy || '',
          status: 'Consultation Scheduled',
          consultation_paid: true,
          registration_id: generatedId,
          created_at: createdAt,
          notes: '',
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature
        };

        const { error } = await supabase
          .from('parent_shadow_requests')
          .insert([toSnakeCase(record)]);

        if (error) throw error;

        // Trigger notifications
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const statusLink = `${protocol}://${host}/check-status?regId=${generatedId}`;

        await Promise.allSettled([
          sendEmail({
            to: email,
            subject: 'Welcome to The Shadow Bridge – Shadow Teacher Registration Received',
            type: 'registration',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
              <p style="margin: 0 0 16px 0;">Thank you for registering with The Shadow Bridge.</p>
              <p style="margin: 0 0 16px 0;">We have successfully received your request for a Shadow Teacher for your child.</p>
              
              <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">What Happens Next?</h3>
              <ul style="margin: 0 0 20px 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Our team will review your requirements.</li>
                <li style="margin-bottom: 8px;">Pratibha Mishra, Founder & Lead Mentor, will personally conduct an assessment consultation to understand your child's strengths and support needs.</li>
                <li style="margin-bottom: 8px;">Based on the consultation, we will identify a suitable shadow teacher.</li>
                <li style="margin-bottom: 8px;">Once the profile is finalized, we will share the details with you before placement.</li>
              </ul>

              <p style="margin: 0 0 20px 0;">Our team will contact you within 24 hours to schedule the consultation.</p>
              <p style="margin: 0 0 20px 0; background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 12px 16px; border-radius: 4px; font-size: 13px;">
                You can check your application status anytime at <a href="${protocol}://${host}/check-status" style="color: #3B2A6B; font-weight: bold;">theshadowbridge.com/check-status</a> using your Registration ID: <strong>${generatedId}</strong> and the phone/email you registered with.
              </p>
              <p style="margin: 0 0 20px 0;">Thank you for choosing The Shadow Bridge.</p>
              
              <p style="margin: 20px 0 0 0; font-weight: bold; color: #3B2A6B;">Team The Shadow Bridge</p>
              
              <div style="margin-top: 24px;">
                <a href="${statusLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15); margin-bottom: 10px;">Check Status &amp; Access Portal</a>
              </div>
            `
          }).catch(err => console.error('Parent shadow registration email fail:', err)),

          sendEmail({
            to: email,
            subject: 'Payment Confirmation - The Shadow Bridge',
            type: 'payment_receipt',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Payment Confirmation</h2>
              <p style="margin: 0 0 16px 0;">Thank you for your payment of <strong>₹99</strong> toward the diagnostic consultation assessment fee.</p>
              
              <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6A5B7C;">
                  <strong>Amount Paid:</strong> ₹99.00<br />
                  <strong>Payment ID:</strong> ${razorpayPaymentId}<br />
                  <strong>Registration ID:</strong> ${generatedId}<br />
                  <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}<br />
                  <strong>Policy:</strong> This fee is non-refundable
                </p>
              </div>
            `
          }).catch(err => console.error('Parent shadow payment email fail:', err)),

          sendEmail({
            to: 'theshadowbridgesupport@gmail.com',
            subject: `New Parent Inquiry (Shadow Teacher): ${parentName} [${generatedId}]`,
            type: 'contact_alert',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Parent Inquiry (Shadow Teacher Support)</h2>
              <p style="margin: 0 0 16px 0; color: #4A3E5E;">A new parent has registered and paid the ₹99 consultation fee for Shadow Teacher support.</p>
              
              <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
                <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${generatedId}</p>
                <p style="margin: 0 0 8px 0;"><strong>Parent Name:</strong> ${parentName} (${relationship || 'Parent'})</p>
                <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${phone}</p>
                <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0 0 8px 0;"><strong>City / Location:</strong> ${city} (${homeLocation || 'N/A'})</p>
                <p style="margin: 0 0 8px 0;"><strong>Child Name / Grade:</strong> ${childName} (${childGrade})</p>
                <p style="margin: 0 0 8px 0;"><strong>Diagnosis:</strong> ${hasDiagnosis === 'Yes' ? diagnosis || 'Yes' : 'No'}</p>
                <p style="margin: 0 0 8px 0;"><strong>Difficulties:</strong> ${Array.isArray(difficulties) ? difficulties.join(', ') : (difficulties || 'None')}</p>
                <p style="margin: 0;"><strong>Consultation Status:</strong> Paid ₹99 (Payment ID: ${razorpayPaymentId})</p>
              </div>

              <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to review this inquiry and schedule the consultation.</p>
            `
          }).catch(err => console.error('Admin parent shadow alert email fail:', err))
        ]);

        return NextResponse.json({ success: true, type, registration_id: generatedId, record });
      } else {
        const record = {
          id: 'parent-tutor-' + randomId(),
          parentName,
          relationship: relationship || 'Mother',
          phone,
          email,
          childName,
          childDob: data.childDob || '',
          childGender: data.childGender || 'Boy',
          childGrade,
          tutorType: tutorType || 'Academic Tuition/Subjects',
          otherTutorType: otherTutorType || '',
          subjects: Array.isArray(subjects) ? subjects.join(', ') : (subjects || ''),
          city,
          homeLocation: homeLocation || '',
          status: 'Consultation Scheduled',
          consultation_paid: true,
          registration_id: generatedId,
          created_at: createdAt,
          notes: '',
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature
        };

        const { error } = await supabase
          .from('parent_tutor_requests')
          .insert([toSnakeCase(record)]);

        if (error) throw error;

        // Trigger notifications
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const statusLink = `${protocol}://${host}/check-status?regId=${generatedId}`;

        await Promise.allSettled([
          sendEmail({
            to: email,
            subject: 'Welcome to The Shadow Bridge – Tutor Registration Received',
            type: 'registration',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
              <p style="margin: 0 0 16px 0;">Thank you for registering with The Shadow Bridge.</p>
              <p style="margin: 0 0 16px 0;">We have successfully received your request for a Home Tutor.</p>
              
              <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">What Happens Next?</h3>
              <ul style="margin: 0 0 20px 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Our team will review your child's academic requirements.</li>
                <li style="margin-bottom: 8px;">We will shortlist suitable tutors based on your preferences.</li>
                <li style="margin-bottom: 8px;">Tutor profiles will be shared for your approval.</li>
                <li style="margin-bottom: 8px;">Once confirmed, we will coordinate the tutoring schedule.</li>
              </ul>

              <p style="margin: 0 0 20px 0;">Our team will contact you within 24 hours to begin the matching process.</p>
              <p style="margin: 0 0 20px 0; background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 12px 16px; border-radius: 4px; font-size: 13px;">
                You can check your application status anytime at <a href="${protocol}://${host}/check-status" style="color: #3B2A6B; font-weight: bold;">theshadowbridge.com/check-status</a> using your Registration ID: <strong>${generatedId}</strong> and the phone/email you registered with.
              </p>
              <p style="margin: 0 0 20px 0;">Thank you for choosing The Shadow Bridge.</p>
              
              <p style="margin: 20px 0 0 0; font-weight: bold; color: #3B2A6B;">Team The Shadow Bridge</p>
              
              <div style="margin-top: 24px;">
                <a href="${statusLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15); margin-bottom: 10px;">Check Status &amp; Access Portal</a>
              </div>
            `
          }).catch(err => console.error('Parent tutor registration email fail:', err)),

          sendEmail({
            to: email,
            subject: 'Payment Confirmation - The Shadow Bridge',
            type: 'payment_receipt',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Payment Confirmation</h2>
              <p style="margin: 0 0 16px 0;">Thank you for your payment of <strong>₹99</strong> toward the diagnostic consultation assessment fee.</p>
              
              <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6A5B7C;">
                  <strong>Amount Paid:</strong> ₹99.00<br />
                  <strong>Payment ID:</strong> ${razorpayPaymentId}<br />
                  <strong>Registration ID:</strong> ${generatedId}<br />
                  <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}<br />
                  <strong>Policy:</strong> This fee is non-refundable
                </p>
              </div>
            `
          }).catch(err => console.error('Parent tutor payment email fail:', err)),

          sendEmail({
            to: 'theshadowbridgesupport@gmail.com',
            subject: `New Parent Inquiry (Home Tutor): ${parentName} [${generatedId}]`,
            type: 'contact_alert',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Parent Inquiry (Home Tutor Support)</h2>
              <p style="margin: 0 0 16px 0; color: #4A3E5E;">A new parent has registered and paid the ₹99 consultation fee for Home Tutor support.</p>
              
              <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
                <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${generatedId}</p>
                <p style="margin: 0 0 8px 0;"><strong>Parent Name:</strong> ${parentName} (${relationship || 'Parent'})</p>
                <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${phone}</p>
                <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0 0 8px 0;"><strong>City / Location:</strong> ${city} (${homeLocation || 'N/A'})</p>
                <p style="margin: 0 0 8px 0;"><strong>Child Name / Grade:</strong> ${childName} (${childGrade})</p>
                <p style="margin: 0 0 8px 0;"><strong>Tutor Type Needed:</strong> ${tutorType || 'Academic Tuition'}</p>
                <p style="margin: 0 0 8px 0;"><strong>Subjects Required:</strong> ${Array.isArray(subjects) ? subjects.join(', ') : (subjects || 'All Subjects')}</p>
                <p style="margin: 0;"><strong>Consultation Status:</strong> Paid ₹99 (Payment ID: ${razorpayPaymentId})</p>
              </div>

              <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to review this inquiry and begin tutor matchmaking.</p>
            `
          }).catch(err => console.error('Admin parent tutor alert email fail:', err))
        ]);

        return NextResponse.json({ success: true, type, registration_id: generatedId, record });
      }
    } 
    
    if (type === 'shadow') {
      const { 
        name, dob, gender, phone, email, city, address, preferredLocations, qualification, 
        specialization, experience, certificates, specialNeedsExp, comfortableAreas, otherComfortable,
        openToTravel, preferredWorkType, aadharCardName, qualificationCertName, experienceCertName, profilePhotoName,
        aadharCardUrl, qualificationCertUrl, experienceCertUrl, profilePhotoUrl
      } = data;

      if (!name || !phone || !email || !city || !qualification || !experience) {
        return NextResponse.json({ error: 'Missing shadow teacher required fields (Name, Phone, Email, City, Qualification, Experience).' }, { status: 400 });
      }

      const generatedId = `TSB-${year}-${randomNumericId()}`;

      let docNotes = [];
      if (aadharCardUrl) docNotes.push(`Aadhar Proof: ${aadharCardUrl}`);
      if (qualificationCertUrl) docNotes.push(`Qualification Cert: ${qualificationCertUrl}`);
      if (experienceCertUrl) docNotes.push(`Experience Cert: ${experienceCertUrl}`);
      if (profilePhotoUrl) docNotes.push(`Profile Photo: ${profilePhotoUrl}`);

      const record = {
        id: 'shadow-' + randomId(),
        name,
        dob: dob || '',
        gender: gender || 'Female',
        phone,
        email,
        city,
        address: address || '',
        preferredLocations: preferredLocations || '',
        qualification,
        specialization: specialization || '',
        experience,
        certificates: certificates || '',
        specialNeedsExp: specialNeedsExp || 'No',
        comfortableAreas: comfortableAreas || '',
        otherComfortable: otherComfortable || '',
        openToTravel: openToTravel || 'No',
        preferredWorkType: preferredWorkType || 'Full-time',
        status: 'Interview Awaiting',
        aadharCardName: aadharCardName || '',
        qualificationCertName: qualificationCertName || '',
        experienceCertName: experienceCertName || '',
        profilePhotoName: profilePhotoName || '',
        registration_id: generatedId,
        created_at: createdAt,
        notes: docNotes.join(' | ')
      };

      const { error } = await supabase
        .from('shadow_teachers')
        .insert([toSnakeCase(record)]);

      if (error) throw error;

      // Trigger notification
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const statusLink = `${protocol}://${host}/check-status?regId=${generatedId}`;

      await Promise.allSettled([
        sendEmail({
          to: email,
          subject: `Registration Received - The Shadow Bridge [${generatedId}]`,
          type: 'registration',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${name},</h2>
            <p style="margin: 0 0 16px 0;">Thank you for applying as a Special Education Shadow Teacher with The Shadow Bridge.</p>
            <p style="margin: 0 0 16px 0;">Your registration has been logged successfully under Registration ID <strong>${generatedId}</strong>.</p>
            
            <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">What Happens Next?</h3>
            <p style="margin: 0 0 20px 0;">Our clinical screening panel is vetting your credentials, qualifications, and special-needs experience. Pratibha Mishra's team will call you shortly to schedule a video panel assessment call.</p>
            <p style="margin: 0 0 20px 0; background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 12px 16px; border-radius: 4px; font-size: 13px;">
              You can check your application status anytime at <a href="${protocol}://${host}/check-status" style="color: #3B2A6B; font-weight: bold;">theshadowbridge.com/check-status</a> using your Registration ID: <strong>${generatedId}</strong> and the phone/email you registered with.
            </p>

            <a href="${statusLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-top: 10px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15); margin-bottom: 10px;">Check Status &amp; Access Portal</a>
          `
        }).catch(err => console.error('Shadow teacher registration email fail:', err)),

        sendEmail({
          to: 'theshadowbridgesupport@gmail.com',
          subject: `New Shadow Teacher Registration: ${name} [${generatedId}]`,
          type: 'contact_alert',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Shadow Teacher Candidate Registration</h2>
            <p style="margin: 0 0 16px 0; color: #4A3E5E;">A new educator has registered as a Shadow Teacher.</p>
            
            <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
              <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${generatedId}</p>
              <p style="margin: 0 0 8px 0;"><strong>Candidate Name:</strong> ${name}</p>
              <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0 0 8px 0;"><strong>City / Address:</strong> ${city} (${address || 'N/A'})</p>
              <p style="margin: 0 0 8px 0;"><strong>Preferred Locations:</strong> ${preferredLocations || city}</p>
              <p style="margin: 0 0 8px 0;"><strong>Qualification:</strong> ${qualification} (${specialization || 'General'})</p>
              <p style="margin: 0 0 8px 0;"><strong>Teaching Experience:</strong> ${experience}</p>
              <p style="margin: 0 0 8px 0;"><strong>Special Needs Experience:</strong> ${specialNeedsExp}</p>
              <p style="margin: 0;"><strong>Work Preference:</strong> ${preferredWorkType} | Open to Travel: ${openToTravel}</p>
            </div>

            <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to review this candidate profile and schedule an interview assessment.</p>
          `
        }).catch(err => console.error('Admin shadow alert email fail:', err))
      ]);

      return NextResponse.json({ success: true, type, registration_id: generatedId, record });
    }

    if (type === 'tutor') {
      const { 
        name, dob, gender, phone, email, city, address, qualification, specialization, 
        experience, certificates, subjects, grades, expectedSalary, mode 
      } = data;

      if (!name || !phone || !email || !city || !subjects || !grades || !experience || !qualification) {
        return NextResponse.json({ error: 'Missing tutor fields' }, { status: 400 });
      }

      const generatedId = `TUT-${year}-${randomNumericId()}`;

      const record = {
        id: 'tutor-' + randomId(),
        name,
        dob: dob || '',
        gender: gender || 'Male',
        phone,
        email,
        city,
        address: address || '',
        qualification,
        specialization: specialization || '',
        experience,
        certificates: certificates || '',
        subjects: Array.isArray(subjects) ? subjects.join(', ') : subjects,
        grades: Array.isArray(grades) ? grades.join(', ') : grades,
        expectedSalary: expectedSalary || '',
        mode: mode || 'Offline at Home',
        registration_id: generatedId,
        status: 'Interview Awaiting',
        created_at: createdAt,
        notes: ''
      };

      const { error } = await supabase
        .from('tutors')
        .insert([toSnakeCase(record)]);

      if (error) throw error;

      // Trigger notification
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const statusLink = `${protocol}://${host}/check-status?regId=${generatedId}`;

      await Promise.allSettled([
        sendEmail({
          to: email,
          subject: `Registration Received - The Shadow Bridge [${generatedId}]`,
          type: 'registration',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${name},</h2>
            <p style="margin: 0 0 16px 0;">Thank you for applying to join our academic home tutor team with The Shadow Bridge.</p>
            <p style="margin: 0 0 16px 0;">Your registration has been logged successfully under Registration ID <strong>${generatedId}</strong>.</p>
            
            <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">What Happens Next?</h3>
            <p style="margin: 0 0 20px 0;">Our clinical screening panel is screening your academic credentials, teaching experience, and subject matching. Pratibha Mishra's team will call you shortly to schedule a video panel assessment call.</p>
            <p style="margin: 0 0 20px 0; background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 12px 16px; border-radius: 4px; font-size: 13px;">
              You can check your application status anytime at <a href="${protocol}://${host}/check-status" style="color: #3B2A6B; font-weight: bold;">theshadowbridge.com/check-status</a> using your Registration ID: <strong>${generatedId}</strong> and the phone/email you registered with.
            </p>

            <a href="${statusLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-top: 10px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15); margin-bottom: 10px;">Check Status &amp; Access Portal</a>
          `
        }).catch(err => console.error('Tutor registration email fail:', err)),

        sendEmail({
          to: 'theshadowbridgesupport@gmail.com',
          subject: `New Tutor Registration: ${name} [${generatedId}]`,
          type: 'contact_alert',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Home Tutor Candidate Registration</h2>
            <p style="margin: 0 0 16px 0; color: #4A3E5E;">A new educator has registered as an Academic Home Tutor.</p>
            
            <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
              <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${generatedId}</p>
              <p style="margin: 0 0 8px 0;"><strong>Candidate Name:</strong> ${name}</p>
              <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0 0 8px 0;"><strong>City / Address:</strong> ${city} (${address || 'N/A'})</p>
              <p style="margin: 0 0 8px 0;"><strong>Qualification:</strong> ${qualification} (${specialization || 'General'})</p>
              <p style="margin: 0 0 8px 0;"><strong>Teaching Experience:</strong> ${experience}</p>
              <p style="margin: 0 0 8px 0;"><strong>Subjects Taught:</strong> ${Array.isArray(subjects) ? subjects.join(', ') : subjects}</p>
              <p style="margin: 0 0 8px 0;"><strong>Grades Taught:</strong> ${Array.isArray(grades) ? grades.join(', ') : grades}</p>
              <p style="margin: 0;"><strong>Expected Salary / Mode:</strong> ${expectedSalary || 'N/A'} | ${mode || 'Offline'}</p>
            </div>

            <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to review this tutor profile and schedule an interview assessment.</p>
          `
        }).catch(err => console.error('Admin tutor alert email fail:', err))
      ]);

      return NextResponse.json({ success: true, type, registration_id: generatedId, record });
    }

    return NextResponse.json({ error: 'Invalid registration type' }, { status: 400 });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
