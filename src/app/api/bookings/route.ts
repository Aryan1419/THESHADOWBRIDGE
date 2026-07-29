import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase, isSupabaseConfigured } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, phone, email, city, preferredLocation, childAge, requirement, message,
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

    const newBooking: any = {
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

    if (preferredLocation) {
      newBooking.preferred_location = preferredLocation;
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bookings')
        .insert(newBooking)
        .select();

      if (error) {
        console.error('❌ Supabase booking insert error:', error);
        // Try inserting without preferred_location if schema column doesn't exist yet
        delete newBooking.preferred_location;
        const { error: retryErr } = await supabase.from('bookings').insert(newBooking);
        if (retryErr) {
          throw retryErr;
        }
      } else {
        console.log('✅ Supabase booking created successfully! ID:', data?.[0]?.booking_id || bookingId);
      }
    }

    const bookingDateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Send Parent Consultation Payment Confirmation Email
    sendEmail({
      to: email,
      subject: `Consultation Booking Confirmed - The Shadow Bridge (${bookingId})`,
      type: 'payment_receipt',
      bodyHtml: `
        <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Consultation Booking Confirmed</h2>
        <p style="margin: 0 0 16px 0;">Dear ${name},</p>
        <p style="margin: 0 0 16px 0;">Thank you for booking a 1-on-1 consultation session with Founder & Lead Mentor Pratibha Mishra at The Shadow Bridge. We have successfully received your payment of <strong>₹99</strong>.</p>
        
        <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #3B2A6B;">
            <strong>Booking Reference ID:</strong> ${bookingId}<br />
            <strong>Amount Paid:</strong> ₹99.00 (Non-refundable)<br />
            <strong>Payment Transaction ID:</strong> ${razorpayPaymentId}<br />
            <strong>Date & Time:</strong> ${bookingDateStr} IST<br />
            <strong>City:</strong> ${city}${preferredLocation ? ` (${preferredLocation})` : ''}
          </p>
        </div>

        <h3 style="color: #3B2A6B; font-size: 15px; margin: 24px 0 10px 0;">What Happens Next?</h3>
        <p style="margin: 0 0 20px 0;">Our administrative team will reach out to you via WhatsApp / phone call within 24 hours to schedule the exact video consultation date and time slot with Pratibha Mishra.</p>
      `
    }).catch(err => console.error('Booking parent email fail:', err));

    // 2. Send Admin Notification Email
    sendEmail({
      to: 'theshadowbridgesupport@gmail.com',
      subject: `New Consultation Booked: ${name} (₹99 Paid)`,
      type: 'contact_alert',
      bodyHtml: `
        <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Consultation Booking Received</h2>
        <p style="margin: 0 0 16px 0;">A new parent has successfully booked a ₹99 consultation session through The Shadow Bridge website.</p>

        <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #3B2A6B;"><strong>Parent Name:</strong> ${name}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #3B2A6B;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #3B2A6B;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #3B2A6B;"><strong>City:</strong> ${city}</p>
          ${preferredLocation ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #3B2A6B;"><strong>Preferred Locality:</strong> ${preferredLocation}</p>` : ''}
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #3B2A6B;"><strong>Child's Age:</strong> ${childAge}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #3B2A6B;"><strong>Requirement:</strong> ${requirement}</p>
          ${message ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #3B2A6B;"><strong>Message / Notes:</strong> ${message}</p>` : ''}
        </div>

        <div style="background-color: #EFEBF4; border: 1px solid #D4CCE3; padding: 14px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; font-size: 13px; color: #3B2A6B;">
            <strong>Booking Reference:</strong> ${bookingId}<br />
            <strong>Payment Status:</strong> ₹99.00 Paid (Razorpay Payment ID: ${razorpayPaymentId})<br />
            <strong>Booking Date/Time:</strong> ${bookingDateStr} IST
          </p>
        </div>
      `
    }).catch(err => console.error('Booking admin email fail:', err));

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error('API Bookings Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
