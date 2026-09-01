import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/notifications';
import { readDb, writeDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      registrationId, amount,
      razorpayPaymentId, razorpayOrderId, razorpaySignature 
    } = body;

    if (!registrationId || !amount || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing required placement payment parameters' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    if (secret) {
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

    let record: any = null;

    try {
      const { data, error } = await supabase
        .from('school_requests')
        .select('*')
        .eq('registration_id', registrationId)
        .maybeSingle();

      if (data) record = data;
    } catch (err) {
      console.warn('Supabase lookup failed for school_requests placement verification:', err);
    }

    // Fallback to local db.json if Supabase record not found
    if (!record) {
      const localDb = readDb();
      const match = (localDb.school_requests || []).find((s: any) => s.registration_id === registrationId);
      if (match) record = match;
    }

    if (!record) {
      return NextResponse.json(
        { error: 'School request record not found for this ID' },
        { status: 404 }
      );
    }

    const updates = {
      placement_paid: true,
      status: 'Placement Fee Paid' as const,
      placement_payment_id: razorpayPaymentId,
      placement_order_id: razorpayOrderId,
      placement_amount: Number(amount || 5000)
    };

    // Update Supabase
    try {
      await supabase
        .from('school_requests')
        .update(updates)
        .eq('registration_id', registrationId);
    } catch (err) {
      console.warn('Supabase update failed for school_requests placement verification:', err);
    }

    // Update local DB fallback
    const localDb = readDb();
    if (localDb.school_requests) {
      const index = localDb.school_requests.findIndex((s: any) => s.registration_id === registrationId);
      if (index !== -1) {
        localDb.school_requests[index] = { ...localDb.school_requests[index], ...updates };
        writeDb(localDb);
      }
    }

    const schoolEmail = record.email;
    const schoolName = record.school_name || record.schoolName || 'School';
    const contactName = record.contact_name || record.contactName || 'Representative';

    await Promise.allSettled([
      sendEmail({
        to: schoolEmail,
        subject: `Placement Fee Received - The Shadow Bridge [${registrationId}]`,
        type: 'placement_confirmed',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${contactName},</h2>
          <p style="margin: 0 0 16px 0;">We are pleased to confirm receipt of the one-time placement fee of <strong>₹${amount}</strong> for <strong>${schoolName}</strong>'s shadow teacher requirement.</p>

          <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
            <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 14px;">Payment Summary</h4>
            <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6A5B7C;">
              <strong>Registration ID:</strong> ${registrationId}<br />
              <strong>School Name:</strong> ${schoolName}<br />
              <strong>Razorpay Payment ID:</strong> ${razorpayPaymentId}<br />
              <strong>Amount Paid:</strong> ₹${amount}<br />
              <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>

          <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">Registration Form Unlocked!</h3>
          <p style="margin: 0 0 16px 0;">Your complete School Registration Form is now unlocked. Please complete your detailed address, hiring parameters, and terms agreement at <a href="https://www.theshadowbridge.com/schools/form?regId=${registrationId}" style="color: #E04D74; font-weight: bold; text-decoration: none;">theshadowbridge.com/schools/form?regId=${registrationId}</a>.</p>

          <p style="margin: 24px 0 0 0; font-size: 14px;">Warm regards,<br /><strong>The Shadow Bridge Team</strong></p>
        `
      }).catch(err => console.error('Failed to send school placement email:', err)),

      sendEmail({
        to: 'theshadowbridgesupport@gmail.com',
        subject: `SCHOOL PLACEMENT FEE PAID: ${schoolName} (₹${amount}) [${registrationId}]`,
        type: 'contact_alert',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">School Placement Fee Received</h2>
          <p style="margin: 0 0 16px 0;">A school has successfully paid the ₹${amount} placement fee.</p>

          <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
            <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${registrationId}</p>
            <p style="margin: 0 0 8px 0;"><strong>School Name:</strong> ${schoolName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Contact Person:</strong> ${contactName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Amount Paid:</strong> ₹${amount}</p>
            <p style="margin: 0;"><strong>Razorpay Payment ID:</strong> ${razorpayPaymentId}</p>
          </div>

          <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to begin candidate shortlisting.</p>
        `
      }).catch(err => console.error('Failed to send admin placement alert email:', err))
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Verify School Placement Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
