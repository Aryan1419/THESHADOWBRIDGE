import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay keys are not configured in environment variables' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const body = await request.json().catch(() => ({}));
    const reqAmount = body.amount ? Number(body.amount) : 99;
    const amountInPaise = Math.round(reqAmount * 100);

    const receiptId = `rcpt_${Math.random().toString(36).substring(2, 10)}`;

    const defaultPurpose = reqAmount === 99 
      ? 'The Shadow Bridge Diagnostic Child Assessment Consultation Fee' 
      : 'The Shadow Bridge Program Placement Vetting Fee';

    const orderNotes: Record<string, string> = {
      purpose: (body.purpose || body.notes?.purpose || defaultPurpose).substring(0, 250),
      ...(body.notes || {})
    };

    if (body.regId || body.registrationId || body.registration_id) {
      orderNotes.regId = String(body.regId || body.registrationId || body.registration_id).substring(0, 50);
    }
    if (body.parentName || body.name || body.contactName) {
      orderNotes.parentName = String(body.parentName || body.name || body.contactName).substring(0, 100);
    }
    if (body.phone || body.contact) {
      orderNotes.phone = String(body.phone || body.contact).substring(0, 25);
    }
    if (body.email) {
      orderNotes.email = String(body.email).substring(0, 100);
    }
    if (body.city) {
      orderNotes.city = String(body.city).substring(0, 50);
    }
    if (body.preferredLocation || body.preferred_location) {
      orderNotes.preferredLocation = String(body.preferredLocation || body.preferred_location).substring(0, 100);
    }
    if (body.serviceNeeded || body.serviceType || body.requirement) {
      orderNotes.serviceNeeded = String(body.serviceNeeded || body.serviceType || body.requirement).substring(0, 100);
    }
    if (body.childAge || body.child_age) {
      orderNotes.childAge = String(body.childAge || body.child_age).substring(0, 25);
    }
    if (body.type) {
      orderNotes.type = String(body.type).substring(0, 50);
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: orderNotes
    });

    return NextResponse.json({
      success: true,
      keyId,
      key_id: keyId,
      order,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
