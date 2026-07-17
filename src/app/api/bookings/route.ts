import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, phone, email, city, childAge, requirement, message,
      razorpayPaymentId, razorpayOrderId, razorpaySignature 
    } = body;

    // Validation
    if (!name || !phone || !email || !city || !childAge || !requirement) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing payment transaction validation credentials' },
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

    // Auto-generate booking ID (e.g. TSB-BK-2026-XXXX)
    const randomSuffix = Math.floor(Math.random() * 89999 + 10000);
    const bookingId = `TSB-BK-2026-${randomSuffix}`;

    const newBooking = {
      booking_id: bookingId,
      name,
      phone,
      email,
      city,
      child_age: childAge,
      requirement,
      message: message || '',
      payment_status: 'paid',
      amount: 99,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature
    };

    const { error } = await supabase
      .from('bookings')
      .insert(newBooking);

    if (error) {
      throw error;
    }

    // Trigger Notification
    sendEmail({
      to: email,
      subject: 'Payment Confirmation - The Shadow Bridge',
      type: 'payment_receipt',
      bodyHtml: `
        <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Payment Confirmation</h2>
        <p style="margin: 0 0 16px 0;">Dear ${name},</p>
        <p style="margin: 0 0 16px 0;">Thank you for booking a clinical assessment consultation with The Shadow Bridge and completing your payment of <strong>₹99</strong>.</p>
        
        <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6A5B7C;">
            <strong>Amount Paid:</strong> ₹99.00<br />
            <strong>Payment ID:</strong> ${razorpayPaymentId}<br />
            <strong>Booking Reference ID:</strong> ${bookingId}<br />
            <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}<br />
            <strong>Policy:</strong> This fee is non-refundable
          </p>
        </div>

        <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">What Happens Next?</h3>
        <p style="margin: 0 0 20px 0;">Founder & Lead Mentor Pratibha Mishra will connect with you via video call to discuss your child's requirements. Our administrative team will reach out to you within 24 hours to schedule the specific date and timing slot for the call.</p>
      `
    }).catch(err => console.error('Booking payment email fail:', err));

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error('API Bookings Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
