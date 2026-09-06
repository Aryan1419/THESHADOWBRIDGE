import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase, isSupabaseConfigured } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/lib/notifications';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // Webhook secret resolution: check RAZORPAY_WEBHOOK_SECRET, fallback to RAZORPAY_KEY_SECRET
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || '';

    if (!webhookSecret) {
      console.warn('⚠️ Razorpay webhook received but no webhook secret or key secret is configured.');
    } else {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      // If webhook secret check fails, also attempt verification with key secret as fallback
      let isValid = (signature === expectedSignature);
      if (!isValid && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== webhookSecret) {
        const altSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(rawBody)
          .digest('hex');
        if (signature === altSignature) {
          isValid = true;
        }
      }

      if (!isValid && signature) {
        console.error('❌ Razorpay webhook signature verification failed.');
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`🔔 Razorpay Webhook Event Received: [${event}]`);

    // ─── 1. HANDLE PAYMENT CAPTURED OR ORDER PAID ──────────────────
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity || {};
      const orderEntity = payload.payload?.order?.entity || {};

      const paymentId = paymentEntity.id;
      const orderId = paymentEntity.order_id || orderEntity.id;
      const amountPaise = paymentEntity.amount || orderEntity.amount || 0;
      const amountInRupees = Math.round(amountPaise / 100);
      const userEmail = (paymentEntity.email || '').toLowerCase().trim();
      const userPhone = (paymentEntity.contact || '').trim();
      const notes = { ...(orderEntity.notes || {}), ...(paymentEntity.notes || {}) };

      const regId = notes.regId || notes.registrationId || notes.registration_id || '';
      const parentName = notes.parentName || notes.name || notes.contactName || paymentEntity.notes?.parentName || 'Parent';
      const city = notes.city || '';
      const serviceNeeded = notes.serviceNeeded || notes.serviceType || notes.requirement || 'Shadow Teacher';
      const purpose = notes.purpose || '';

      console.log(`💳 Processing payment ${paymentId} for ₹${amountInRupees} (Order: ${orderId}, RegId: ${regId}, Email: ${userEmail})`);

      const isConsultation = amountInRupees <= 200 || purpose.toLowerCase().includes('consultation') || notes.type === 'consultation';
      const isPlacement = amountInRupees >= 1000 || purpose.toLowerCase().includes('placement') || notes.type === 'placement';

      // ─── A. CONSULTATION FEE (₹99 / ₹199) ─────────────────────────
      if (isConsultation) {
        let bookingExists = false;
        let existingBookingId = '';

        if (isSupabaseConfigured) {
          // Check if already in bookings table
          const { data: bMatch } = await supabase
            .from('bookings')
            .select('*')
            .or(`razorpay_payment_id.eq.${paymentId},razorpay_order_id.eq.${orderId}${regId ? `,booking_id.eq.${regId}` : ''}`)
            .limit(1);

          if (bMatch && bMatch.length > 0) {
            bookingExists = true;
            existingBookingId = bMatch[0].booking_id;
            // Ensure record has exact payment id and status
            await supabase
              .from('bookings')
              .update({
                payment_status: 'paid',
                amount: amountInRupees,
                razorpay_payment_id: paymentId,
                razorpay_order_id: orderId
              })
              .eq('id', bMatch[0].id);
          } else {
            // Standalone booking backup creation (if browser closed before frontend API fired)
            const generatedBookingId = regId || `TSB-BK-2026-${Math.floor(Math.random() * 89999 + 10000)}`;
            existingBookingId = generatedBookingId;

            const newBookingRecord: any = {
              booking_id: generatedBookingId,
              name: parentName,
              phone: userPhone,
              email: userEmail,
              city: city || 'Online',
              child_age: notes.childAge || 'N/A',
              requirement: serviceNeeded,
              message: notes.message || `[Captured via Razorpay Webhook ${event}]`,
              payment_status: 'paid',
              amount: amountInRupees,
              razorpay_payment_id: paymentId,
              razorpay_order_id: orderId,
              razorpay_signature: 'webhook_captured'
            };
            if (notes.preferredLocation) {
              newBookingRecord.preferred_location = notes.preferredLocation;
            }

            const { error: insErr } = await supabase.from('bookings').insert(newBookingRecord);
            if (insErr) {
              console.warn('Booking insert warning in webhook:', insErr.message);
              // Retry without preferred_location if schema mismatch
              delete newBookingRecord.preferred_location;
              await supabase.from('bookings').insert(newBookingRecord);
            } else {
              console.log(`✅ Backup booking created by webhook: ${generatedBookingId}`);
            }

            // Send confirmation email to parent if fresh capture
            if (userEmail) {
              sendEmail({
                to: userEmail,
                subject: `Consultation Booking Confirmed - The Shadow Bridge (${generatedBookingId})`,
                type: 'payment_receipt',
                bodyHtml: `
                  <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Consultation Booking Confirmed</h2>
                  <p style="margin: 0 0 16px 0;">Dear ${parentName},</p>
                  <p style="margin: 0 0 16px 0;">Thank you for booking a 1-on-1 consultation session with Founder Pratibha Mishra at The Shadow Bridge. We have successfully received your payment of <strong>₹${amountInRupees}</strong>.</p>
                  <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 4px 12px;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #3B2A6B;">
                      <strong>Booking Reference ID:</strong> ${generatedBookingId}<br />
                      <strong>Amount Paid:</strong> ₹${amountInRupees}.00<br />
                      <strong>Payment Transaction ID:</strong> ${paymentId}<br />
                      <strong>Order ID:</strong> ${orderId}<br />
                      <strong>City:</strong> ${city || 'Online'}
                    </p>
                  </div>
                  <p style="margin: 0 0 20px 0;">Our team will reach out to you within 24 hours to schedule the exact consultation date and time slot.</p>
                `
              }).catch(e => console.error('Webhook parent email error:', e));

              // Admin notification
              sendEmail({
                to: 'theshadowbridgesupport@gmail.com',
                subject: `[Webhook Captured] New Consultation: ${parentName} (₹${amountInRupees} Paid)`,
                type: 'contact_alert',
                bodyHtml: `
                  <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Consultation Booking Received via Webhook</h2>
                  <p><strong>Parent:</strong> ${parentName}</p>
                  <p><strong>Phone:</strong> ${userPhone}</p>
                  <p><strong>Email:</strong> ${userEmail}</p>
                  <p><strong>Booking ID:</strong> ${generatedBookingId}</p>
                  <p><strong>Payment ID:</strong> ${paymentId}</p>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                `
              }).catch(e => console.error('Webhook admin alert error:', e));
            }
          }

          // Also cross-update parent_shadow_requests / parent_tutor_requests / parent_therapy_requests if parent registered
          const tables = ['parent_shadow_requests', 'parent_tutor_requests', 'parent_therapy_requests'];
          for (const tbl of tables) {
            let query = supabase.from(tbl).select('id, registration_id');
            if (regId) {
              query = query.eq('registration_id', regId);
            } else if (userEmail) {
              query = query.eq('email', userEmail);
            } else if (userPhone) {
              query = query.eq('phone', userPhone);
            } else {
              continue;
            }

            const { data: matchedParents } = await query.limit(1);
            if (matchedParents && matchedParents.length > 0) {
              await supabase
                .from(tbl)
                .update({
                  consultation_paid: true,
                  razorpay_payment_id: paymentId,
                  razorpay_order_id: orderId
                })
                .eq('id', matchedParents[0].id);
              console.log(`✅ Updated ${tbl} for parent ${matchedParents[0].registration_id}`);
            }
          }
        }
      }

      // ─── B. PLACEMENT FEE (₹5,000 / ₹3,000) ───────────────────────
      if (isPlacement) {
        if (isSupabaseConfigured) {
          const placementTables = ['parent_shadow_requests', 'parent_tutor_requests', 'school_requests'];
          let updated = false;

          for (const tbl of placementTables) {
            let query = supabase.from(tbl).select('*');
            if (regId) {
              query = query.eq('registration_id', regId);
            } else if (userEmail) {
              query = query.eq('email', userEmail);
            } else if (userPhone) {
              query = query.eq('phone', userPhone);
            } else {
              continue;
            }

            const { data: matchedRecords } = await query.limit(1);
            if (matchedRecords && matchedRecords.length > 0) {
              const rec = matchedRecords[0];
              const wasAlreadyPaid = rec.placement_paid === true;

              await supabase
                .from(tbl)
                .update({
                  placement_paid: true,
                  placement_payment_id: paymentId,
                  placement_order_id: orderId,
                  placement_amount: amountInRupees,
                  status: 'Support Started'
                })
                .eq('id', rec.id);

              console.log(`✅ Updated placement status for ${tbl} (${rec.registration_id})`);
              updated = true;

              // If fresh webhook capture, dispatch confirmation emails
              if (!wasAlreadyPaid && (rec.email || userEmail)) {
                const targetEmail = rec.email || userEmail;
                const recName = rec.parent_name || rec.parentName || rec.school_name || parentName;
                const child = rec.child_name || rec.childName || 'your child';

                sendEmail({
                  to: targetEmail,
                  subject: `Placement Fee Confirmed - The Shadow Bridge [${rec.registration_id}]`,
                  type: 'placement_confirmed',
                  bodyHtml: `
                    <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Placement Fee Confirmed</h2>
                    <p style="margin: 0 0 16px 0;">Dear ${recName},</p>
                    <p style="margin: 0 0 16px 0;">We are pleased to confirm receipt of the program placement fee of <strong>₹${amountInRupees}</strong> for ${child}'s customized support program.</p>
                    <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 4px 12px;">
                      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6A5B7C;">
                        <strong>Registration ID:</strong> ${rec.registration_id}<br />
                        <strong>Razorpay Payment ID:</strong> ${paymentId}<br />
                        <strong>Amount Paid:</strong> ₹${amountInRupees}<br />
                        <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </p>
                    </div>
                    <p style="margin: 0 0 16px 0;">Our local placement coordinators will contact you within 24 hours to align educator schedules and finalize trial details.</p>
                  `
                }).catch(e => console.error('Webhook placement email error:', e));

                sendEmail({
                  to: 'theshadowbridgesupport@gmail.com',
                  subject: `[Webhook Alert] Placement Fee Paid: ${recName} (₹${amountInRupees}) [${rec.registration_id}]`,
                  type: 'contact_alert',
                  bodyHtml: `
                    <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Placement Fee Captured via Webhook</h2>
                    <p><strong>Name:</strong> ${recName}</p>
                    <p><strong>Registration ID:</strong> ${rec.registration_id}</p>
                    <p><strong>Amount:</strong> ₹${amountInRupees}</p>
                    <p><strong>Payment ID:</strong> ${paymentId}</p>
                    <p><strong>Order ID:</strong> ${orderId}</p>
                  `
                }).catch(e => console.error('Webhook admin placement alert error:', e));
              }
            }
          }
        }
      }

      // Update local db fallback
      try {
        const localDb = readDb();
        if (localDb.bookings) {
          const bIdx = localDb.bookings.findIndex((b: any) => b.razorpay_payment_id === paymentId || b.razorpay_order_id === orderId);
          if (bIdx !== -1) {
            localDb.bookings[bIdx].payment_status = 'paid';
            localDb.bookings[bIdx].razorpay_payment_id = paymentId;
          }
        }
        writeDb(localDb);
      } catch (e) {}

      return NextResponse.json({
        status: 'ok',
        event,
        paymentId,
        orderId,
        amount: amountInRupees,
        processed: true
      });
    }

    // ─── 2. HANDLE PAYMENT FAILED ──────────────────────────────────
    if (event === 'payment.failed') {
      const paymentEntity = payload.payload?.payment?.entity || {};
      const paymentId = paymentEntity.id;
      const errorDesc = paymentEntity.error_description || 'Payment Failed';
      console.warn(`⚠️ Payment failed: ${paymentId} - ${errorDesc}`);

      // Log to notifications_log if configured
      if (isSupabaseConfigured) {
        try {
          await supabase.from('notifications_log').insert({
            type: 'payment_failed',
            recipient: paymentEntity.email || paymentEntity.contact || 'User',
            status: 'failed',
            message: `Payment failed for ₹${Math.round((paymentEntity.amount || 0) / 100)} (ID: ${paymentId}): ${errorDesc}`,
            created_at: new Date().toISOString()
          });
        } catch (e) {}
      }

      return NextResponse.json({
        status: 'ok',
        event,
        paymentId,
        recorded: true
      });
    }

    return NextResponse.json({
      status: 'ok',
      event,
      received: true
    });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json(
      { error: err.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
