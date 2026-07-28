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

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        purpose: reqAmount === 99 
          ? 'The Shadow Bridge Diagnostic Child Assessment Consultation Fee' 
          : 'The Shadow Bridge Program Placement Vetting Fee'
      }
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
