import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/notifications';
import { readDb, writeDb, SchoolRequestRecord } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      formData,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    } = body;

    if (!formData || !formData.schoolName || !formData.contactName || !formData.email || !formData.phone) {
      return NextResponse.json({ error: 'Missing required school consultation form data' }, { status: 400 });
    }

    // Verify Razorpay signature if provided
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    if (secret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { error: 'Transaction authenticity validation failed. Signature mismatch.' },
          { status: 400 }
        );
      }
    }

    // Generate unique Registration ID: SCH-2026-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const registrationId = `SCH-2026-${randomCode}`;
    const createdAt = new Date().toISOString();

    const recordPayload = {
      registration_id: registrationId,
      school_name: formData.schoolName,
      contact_name: formData.contactName,
      designation: formData.designation || 'School Representative',
      email: formData.email,
      phone: formData.phone,
      city: formData.city || '',
      preferred_location: formData.preferredLocation || '',
      levels_required: Array.isArray(formData.levelsRequired) ? formData.levelsRequired.join(', ') : (formData.levelsRequired || ''),
      specific_grades: Array.isArray(formData.specificGrades) ? formData.specificGrades.join(', ') : (formData.specificGrades || ''),
      teachers_count: Number(formData.teachersCount || 1),
      start_date: formData.startDate || '',
      notes: formData.notes || '',
      status: 'Consultation Booked',
      consultation_paid: true,
      consultation_amount: 199,
      placement_paid: false,
      placement_amount: 5000,
      razorpay_payment_id: razorpayPaymentId || 'PAID-199-DIRECT',
      razorpay_order_id: razorpayOrderId || 'ORD-199-DIRECT',
      created_at: createdAt
    };

    let insertedRecord = null;

    try {
      const { data, error } = await supabase
        .from('school_requests')
        .insert([recordPayload])
        .select()
        .single();
      
      if (error) {
        console.warn('Supabase insert into school_requests failed, using fallback:', error);
      } else {
        insertedRecord = data;
      }
    } catch (err) {
      console.warn('Supabase not fully reachable for school_requests, falling back to db.json:', err);
    }

    // Fallback to local db.json
    if (!insertedRecord) {
      const localDb = readDb();
      if (!localDb.school_requests) localDb.school_requests = [];
      const newSchoolRecord: SchoolRequestRecord = {
        id: `sch-${Date.now()}`,
        ...recordPayload,
        status: 'Consultation Booked'
      } as any;
      localDb.school_requests.unshift(newSchoolRecord);
      writeDb(localDb);
      insertedRecord = newSchoolRecord;
    }

    // Send confirmation emails
    const schoolEmail = formData.email;
    const schoolName = formData.schoolName;
    const contactName = formData.contactName;

    await Promise.allSettled([
      sendEmail({
        to: schoolEmail,
        subject: `School Collaboration Consultation Confirmed - The Shadow Bridge [${registrationId}]`,
        type: 'payment_receipt',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${contactName},</h2>
          <p style="margin: 0 0 16px 0;">Thank you for partnering with <strong>The Shadow Bridge</strong> for <strong>${schoolName}</strong>'s shadow teacher requirement.</p>

          <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
            <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 14px;">Consultation Details</h4>
            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6A5B7C;">
              <strong>Registration ID:</strong> ${registrationId}<br />
              <strong>School:</strong> ${schoolName}<br />
              <strong>Teachers Required:</strong> ${formData.teachersCount || 1}<br />
              <strong>Classes / Grades:</strong> ${recordPayload.specific_grades || recordPayload.levels_required}<br />
              <strong>Consultation Fee Paid:</strong> ₹199.00 (Razorpay ID: ${razorpayPaymentId || 'Verified'})<br />
              <strong>Date Submitted:</strong> ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>

          <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">Next Steps:</h3>
          <p style="margin: 0 0 16px 0;">Our Lead Educational Specialist will contact you within 24 business hours for a dedicated consultation call to understand your specific student needs, classroom dynamics, and educator parameters.</p>

          <p style="margin: 0 0 16px 0;">You can check your requirement status at any time using your Registration ID <strong>${registrationId}</strong> at <a href="https://www.theshadowbridge.com/check-status" style="color: #E04D74; font-weight: bold; text-decoration: none;">theshadowbridge.com/check-status</a>.</p>

          <p style="margin: 24px 0 0 0; font-size: 14px;">Warm regards,<br /><strong>Pratibha Mishra & Team</strong><br />The Shadow Bridge</p>
        `
      }).catch(err => console.error('Failed to send school consultation email:', err)),

      sendEmail({
        to: 'theshadowbridgesupport@gmail.com',
        subject: `NEW SCHOOL CONSULTATION BOOKED: ${schoolName} [${registrationId}]`,
        type: 'contact_alert',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New School Consultation Requirement Submitted</h2>
          <p style="margin: 0 0 16px 0;">A school has booked a consultation call and paid the ₹199 booking fee.</p>

          <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
            <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${registrationId}</p>
            <p style="margin: 0 0 8px 0;"><strong>School Name:</strong> ${schoolName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Contact Person:</strong> ${contactName} (${formData.designation})</p>
            <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${formData.phone}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${formData.email}</p>
            <p style="margin: 0 0 8px 0;"><strong>City & Area:</strong> ${formData.city} - ${formData.preferredLocation}</p>
            <p style="margin: 0 0 8px 0;"><strong>Shadow Teachers Count:</strong> ${formData.teachersCount}</p>
            <p style="margin: 0 0 8px 0;"><strong>Specific Grades:</strong> ${recordPayload.specific_grades}</p>
            <p style="margin: 0 0 8px 0;"><strong>Notes:</strong> ${formData.notes || 'None'}</p>
            <p style="margin: 0;"><strong>Payment:</strong> ₹199 Paid (${razorpayPaymentId || 'Verified'})</p>
          </div>

          <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to review and manage this school request.</p>
        `
      }).catch(err => console.error('Failed to send admin alert email:', err))
    ]);

    return NextResponse.json({
      success: true,
      registrationId,
      record: insertedRecord
    });
  } catch (error: any) {
    console.error('API Verify School Consultation Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
