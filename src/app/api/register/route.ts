import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/notifications';

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
        const dashboardLink = `${protocol}://${host}/dashboard?regId=${generatedId}`;

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
              <a href="${dashboardLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15); margin-bottom: 10px;">Go to Parent Dashboard</a>
            </div>
          `
        }).catch(err => console.error('Parent shadow registration email fail:', err));

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
        }).catch(err => console.error('Parent shadow payment email fail:', err));

        // Admin alert email for Parent Shadow Teacher Request
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
        }).catch(err => console.error('Admin parent shadow alert email fail:', err));

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
        const dashboardLink = `${protocol}://${host}/dashboard?regId=${generatedId}`;

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
              <a href="${dashboardLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15); margin-bottom: 10px;">Go to Parent Dashboard</a>
            </div>
          `
        }).catch(err => console.error('Parent tutor registration email fail:', err));

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
        }).catch(err => console.error('Parent tutor payment email fail:', err));

        // Admin alert email for Parent Home Tutor Request
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
        }).catch(err => console.error('Admin parent tutor alert email fail:', err));

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
      const dashboardLink = `${protocol}://${host}/dashboard?regId=${generatedId}`;

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

          <a href="${dashboardLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-top: 10px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15); margin-bottom: 10px;">Go to Educator Dashboard</a>
        `
      }).catch(err => console.error('Shadow teacher registration email fail:', err));

      // Admin alert email for Shadow Teacher Candidate Registration
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
      }).catch(err => console.error('Admin shadow alert email fail:', err));

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
      const dashboardLink = `${protocol}://${host}/dashboard?regId=${generatedId}`;

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

          <a href="${dashboardLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-top: 10px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15); margin-bottom: 10px;">Go to Educator Dashboard</a>
        `
      }).catch(err => console.error('Tutor registration email fail:', err));

      // Admin alert email for Home Tutor Candidate Registration
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
      }).catch(err => console.error('Admin tutor alert email fail:', err));

      return NextResponse.json({ success: true, type, registration_id: generatedId, record });
    }

    return NextResponse.json({ error: 'Invalid registration type' }, { status: 400 });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
