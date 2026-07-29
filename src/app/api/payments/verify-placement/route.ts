import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      registrationId, subType, amount,
      razorpayPaymentId, razorpayOrderId, razorpaySignature 
    } = body;

    // Validation
    if (!registrationId || !subType || !amount || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing required placement payment parameters' },
        { status: 400 }
      );
    }

    // Verify transaction signature
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
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

    const table = subType === 'shadow' ? 'parent_shadow_requests' : 'parent_tutor_requests';

    // 1. Fetch the parent request record to get their email and details
    const { data: record, error: fetchErr } = await supabase
      .from(table)
      .select('*')
      .eq('registration_id', registrationId)
      .maybeSingle();

    if (fetchErr || !record) {
      return NextResponse.json(
        { error: 'Parent request record not found for this ID' },
        { status: 404 }
      );
    }

    // 2. Update record in DB (placement details, status to Support Started)
    const updates = {
      placement_paid: true,
      status: 'Support Started',
      placement_payment_id: razorpayPaymentId,
      placement_order_id: razorpayOrderId,
      placement_signature: razorpaySignature,
      placement_amount: Number(amount)
    };

    const { error: updateErr } = await supabase
      .from(table)
      .update(updates)
      .eq('registration_id', registrationId);

    if (updateErr) {
      throw updateErr;
    }

    // 3. Dispatch placement payment confirmation email & admin alert concurrently and await completion
    const parentEmail = record.email;
    const parentName = record.parent_name || record.parentName || 'Parent';
    const childName = record.child_name || record.childName || 'your child';
    
    await Promise.allSettled([
      sendEmail({
        to: parentEmail,
        subject: `Placement Fee Confirmed - The Shadow Bridge [${registrationId}]`,
        type: 'placement_confirmed',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
          <p style="margin: 0 0 16px 0;">We are pleased to confirm receipt of the program placement fee of <strong>₹${amount}</strong> for <strong>${childName}</strong>'s customized support program.</p>
          
          <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
            <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 14px;">Payment Summary</h4>
            <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6A5B7C;">
              <strong>Registration ID:</strong> ${registrationId}<br />
              <strong>Razorpay Payment ID:</strong> ${razorpayPaymentId}<br />
              <strong>Amount Paid:</strong> ₹${amount}<br />
              <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>

          <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">What Happens Next?</h3>
          <p style="margin: 0 0 16px 0;">Our local placement coordinators will call you within 24 hours to align schedules, exchange school approvals documentation, and finalize the educator trial details. Tutors will begin posting daily progression sheets, and lead clinical panels will review monthly development metrics on your dashboard.</p>

          <p style="margin: 24px 0 0 0; font-size: 14px;">If you have any questions, please reach out to our helpdesk at email <strong>theshadowbridgesupport@gmail.com</strong>.</p>
        `
      }).catch(err => console.error('Failed to send placement fee confirmation email:', err)),

      sendEmail({
        to: 'theshadowbridgesupport@gmail.com',
        subject: `Placement Fee Paid: ${parentName} (₹${amount}) [${registrationId}]`,
        type: 'contact_alert',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Placement Fee Received</h2>
          <p style="margin: 0 0 16px 0;">A parent has successfully paid the placement fee for their request.</p>

          <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
            <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${registrationId}</p>
            <p style="margin: 0 0 8px 0;"><strong>Parent Name:</strong> ${parentName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Child Name:</strong> ${childName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Amount Paid:</strong> ₹${amount}</p>
            <p style="margin: 0 0 8px 0;"><strong>Razorpay Payment ID:</strong> ${razorpayPaymentId}</p>
            <p style="margin: 0;"><strong>Service Type:</strong> ${subType === 'shadow' ? 'Shadow Teacher' : 'Home Tutor'}</p>
          </div>

          <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to finalize educator deployment.</p>
        `
      }).catch(err => console.error('Failed to send placement admin alert email:', err))
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Verify Placement Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
