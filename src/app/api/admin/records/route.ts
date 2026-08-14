import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sendEmail, STATUS_EXPLANATIONS } from '@/lib/notifications';
import { readDb, writeDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Helpers to translate between frontend camelCase and Postgres snake_case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj !== null && typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
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
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const adminUser = verifyAdminToken(token);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    let tutors = null, shadowTeachers = null, parentShadow = null, parentTutor = null, schoolRequests = null, notifications = null, contacts = null, reviews = null, bookings = null;

    if (isSupabaseConfigured) {
      try {
        const { data: t } = await supabase.from('tutors').select('*');
        const { data: st } = await supabase.from('shadow_teachers').select('*');
        const { data: ps } = await supabase.from('parent_shadow_requests').select('*');
        const { data: pt } = await supabase.from('parent_tutor_requests').select('*');
        const { data: sch } = await supabase.from('school_requests').select('*');
        const { data: c } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
        const { data: n } = await supabase.from('notifications_log').select('*').order('created_at', { ascending: false });
        const { data: rev } = await supabase.from('reviews').select('*').order('submitted_at', { ascending: false });
        const { data: bk } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });

        tutors = t;
        shadowTeachers = st;
        parentShadow = ps;
        parentTutor = pt;
        schoolRequests = sch;
        contacts = c;
        notifications = n;
        reviews = rev;
        bookings = bk;
      } catch (err) {
        console.warn('Supabase records query failed, falling back to local DB:', err);
      }
    }

    const localDb = readDb();
    if (!tutors) tutors = localDb.tutors || [];
    if (!shadowTeachers) shadowTeachers = localDb.shadow_teachers || [];
    if (!parentShadow) parentShadow = localDb.parent_shadow_requests || [];
    if (!parentTutor) parentTutor = localDb.parent_tutor_requests || [];
    if (!schoolRequests) schoolRequests = localDb.school_requests || [];
    if (!contacts) contacts = (localDb as any).contacts || [];
    if (!notifications) notifications = localDb.notifications || [];
    if (!reviews) reviews = localDb.reviews || [];
    if (!bookings) bookings = (localDb as any).bookings || [];

    return NextResponse.json({
      tutors: toCamelCase(tutors || []),
      shadow_teachers: toCamelCase(shadowTeachers || []),
      parent_shadow_requests: toCamelCase(parentShadow || []),
      parent_tutor_requests: toCamelCase(parentTutor || []),
      school_requests: toCamelCase(schoolRequests || []),
      contacts: toCamelCase(contacts || []),
      notifications: toCamelCase(notifications || []),
      reviews: toCamelCase(reviews || []),
      bookings: toCamelCase(bookings || []),
      admin_users: [] // Excluded for client-side security
    });
  } catch (error: any) {
    console.error('Admin GET API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to retrieve database contents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const adminUser = verifyAdminToken(token);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const { action, type, id, status, notes, candidateMessage, suggestedMatchId } = body;

    if (action === 'delete_record') {
      if (!type || !id) {
        return NextResponse.json({ error: 'Missing required parameters for deletion (type, id)' }, { status: 400 });
      }

      const allowedTypes = [
        'contacts',
        'tutors',
        'shadow_teachers',
        'parent_shadow_requests',
        'parent_tutor_requests',
        'parent_therapy_requests',
        'school_requests',
        'reviews',
        'bookings'
      ];

      if (!allowedTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid record type for deletion' }, { status: 400 });
      }

      if (isSupabaseConfigured) {
        const { error: delErr } = await supabase
          .from(type)
          .delete()
          .eq('id', id);

        if (delErr) {
          console.error(`Supabase deletion error on table ${type} (ID: ${id}):`, delErr);
          return NextResponse.json({ error: `Database deletion failed: ${delErr.message}` }, { status: 500 });
        }
      }

      // Also clean up local db file if present
      try {
        const localDb = readDb();
        if ((localDb as any)[type]) {
          (localDb as any)[type] = (localDb as any)[type].filter((item: any) => item.id !== id);
          writeDb(localDb);
        }
      } catch (fileErr) {
        console.warn('Local file DB sync on delete skipped:', fileErr);
      }

      return NextResponse.json({
        success: true,
        message: `Record ${id} successfully deleted from ${type}`
      });
    }

    if (action === 'reply_contact') {
      const { id, adminReply } = body;
      if (!id || !adminReply || !adminReply.trim()) {
        return NextResponse.json({ error: 'Missing contact ID or reply message' }, { status: 400 });
      }

      const cleanReply = adminReply.trim();
      const nowIso = new Date().toISOString();

      // 1. Fetch target contact record
      let contactRecord: any = null;
      if (isSupabaseConfigured) {
        const { data } = await supabase.from('contacts').select('*').eq('id', id).maybeSingle();
        if (data) contactRecord = toCamelCase(data);
      }

      if (!contactRecord) {
        const localDb = readDb();
        const found = (localDb as any).contacts?.find((c: any) => c.id === id);
        if (found) contactRecord = found;
      }

      if (!contactRecord) {
        return NextResponse.json({ error: 'Contact record not found' }, { status: 404 });
      }

      // 2. Send response email to person's submitted email address via Resend
      const emailResult = await sendEmail({
        to: contactRecord.email,
        subject: 'Re: Your inquiry to The Shadow Bridge',
        type: 'contact_receipt',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${contactRecord.name},</h2>
          <div style="color: #2D253A; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            ${cleanReply.replace(/\n/g, '<br />')}
          </div>

          <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 24px 0; border-radius: 4px 12px 12px 4px;">
            <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Original Inquiry</h4>
            <p style="margin: 0; font-size: 13px; color: #555555; font-style: italic; line-height: 1.5;">"${contactRecord.message}"</p>
          </div>

          <div style="border-top: 1px solid #E6E2EB; padding-top: 16px; margin-top: 24px;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #3B2A6B; font-size: 14px;">The Shadow Bridge Team</p>
            <p style="margin: 0; font-size: 12px; color: #6A5B7C;">Email: theshadowbridgesupport@gmail.com | Web: https://theshadowbridge.com</p>
          </div>
        `
      });

      if (!emailResult.success) {
        console.error('Failed to send contact reply email:', emailResult.error);
        return NextResponse.json({ error: `Email delivery failed: ${emailResult.error}` }, { status: 500 });
      }

      // 3. Save reply text, timestamp, and update status to 'responded' in Supabase
      let updatedRecord: any = null;
      if (isSupabaseConfigured) {
        const { data: up, error: upErr } = await supabase
          .from('contacts')
          .update({
            status: 'responded',
            admin_reply: cleanReply,
            replied_at: nowIso
          })
          .eq('id', id)
          .select()
          .single();

        if (!upErr && up) {
          updatedRecord = toCamelCase(up);
        } else if (upErr) {
          console.warn('Supabase contact reply update warning:', upErr);
        }
      }

      if (!updatedRecord) {
        updatedRecord = {
          ...contactRecord,
          status: 'responded',
          adminReply: cleanReply,
          repliedAt: nowIso
        };
      }

      return NextResponse.json({
        success: true,
        record: updatedRecord,
        notificationLog: `Response email sent to ${contactRecord.email} and status set to Responded.`
      });
    }

    if (action === 'mark_consultation_completed') {
      const { bookingId, regId, email, phone } = body;

      // Find in parent_shadow_requests, parent_tutor_requests, and bookings
      let targetRecord: any = null;
      let targetTable = '';

      if (regId) {
        const { data: ps } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', regId).maybeSingle();
        if (ps) { targetRecord = ps; targetTable = 'parent_shadow_requests'; }
        else {
          const { data: pt } = await supabase.from('parent_tutor_requests').select('*').eq('registration_id', regId).maybeSingle();
          if (pt) { targetRecord = pt; targetTable = 'parent_tutor_requests'; }
        }
      }

      if (!targetRecord && bookingId) {
        const { data: bk } = await supabase.from('bookings').select('*').eq('booking_id', bookingId).maybeSingle();
        if (bk) {
          // find linked parent record by email or phone
          const cleanEmail = bk.email ? bk.email.trim().toLowerCase() : '';
          const { data: ps } = await supabase.from('parent_shadow_requests').select('*').eq('email', cleanEmail).maybeSingle();
          if (ps) { targetRecord = ps; targetTable = 'parent_shadow_requests'; }
          else {
            const { data: pt } = await supabase.from('parent_tutor_requests').select('*').eq('email', cleanEmail).maybeSingle();
            if (pt) { targetRecord = pt; targetTable = 'parent_tutor_requests'; }
          }
        }
      }

      if (targetRecord && targetTable) {
        await supabase.from(targetTable).update({ status: 'Consultation Completed' }).eq('id', targetRecord.id);
      }

      // Also update status in bookings table if present
      if (bookingId) {
        await supabase.from('bookings').update({ message: 'Consultation Completed' }).eq('booking_id', bookingId);
      }

      // If targetRecord is still missing, create a linked parent_shadow_requests record for legacy bookings
      if (!targetRecord && bookingId) {
        const { data: bk } = await supabase.from('bookings').select('*').eq('booking_id', bookingId).maybeSingle();
        if (bk) {
          const genRegId = `SB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const isTutor = bk.requirement?.toLowerCase().includes('tutor');
          const targetTab = isTutor ? 'parent_tutor_requests' : 'parent_shadow_requests';
          
          const newParent: any = {
            id: (isTutor ? 'parent-tutor-' : 'parent-shadow-') + Math.random().toString(36).substring(2, 9),
            parent_name: bk.name || 'Parent',
            phone: bk.phone,
            email: bk.email,
            city: bk.city || 'Delhi NCR',
            child_name: 'Pending Consultation',
            child_grade: 'Pending Consultation',
            status: 'Consultation Completed',
            consultation_paid: true,
            registration_id: genRegId,
            notes: `Linked Booking ID: ${bookingId}`
          };

          const { data: createdP } = await supabase.from(targetTab).insert([newParent]).select().single();
          if (createdP) targetRecord = createdP;
        }
      }

      // Send Email to Parent notifying them their form is unlocked
      const recipientEmail = email || targetRecord?.email;
      const parentName = targetRecord?.parent_name || targetRecord?.parentName || 'Parent';
      const actualRegId = regId || targetRecord?.registration_id || '';

      if (recipientEmail) {
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const formLink = `${protocol}://${host}/register/parent/form?regId=${actualRegId}`;

        sendEmail({
          to: recipientEmail,
          subject: `Consultation Completed - Registration Form Unlocked [${actualRegId}]`,
          type: 'status_change',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
            <p style="margin: 0 0 16px 0;">Thank you for taking the time to complete your 1-on-1 assessment consultation call with Founder Pratibha Mishra!</p>
            <p style="margin: 0 0 16px 0;">We have marked your consultation as <strong>Completed</strong>. Your detailed Child Registration Form is now fully unlocked.</p>
            
            <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 20px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
              <h3 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 16px; font-family: Georgia, serif;">Next Step: Fill Child Registration Form</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #3B2A6B;">Your Unique ID: <span style="font-family: monospace; color: #B0206B; font-size: 16px;">${actualRegId}</span></p>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #6A5B7C;">Please provide your child's specific developmental and school details to proceed with educator matching.</p>
              <a href="${formLink}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">Open Child Registration Form →</a>
            </div>

            <div style="margin: 20px 0; background-color: #FFF9EB; border-left: 4px solid #C89B3C; padding: 16px 20px; border-radius: 4px; font-size: 13px; color: #5C4300; line-height: 1.6;">
              <strong>How to Access or Check Status Anytime:</strong><br />
              You can access your registration form or check application progress anytime at <a href="${protocol}://${host}/check-status" style="color: #B0206B; font-weight: bold; text-decoration: underline;">theshadowbridge.com/check-status</a> by entering your <strong>ID (${actualRegId})</strong> along with your registered phone number or email address.
            </div>
          `
        }).catch(err => console.error('Consultation completed email fail:', err));
      }

      return NextResponse.json({
        success: true,
        message: `Consultation marked completed for ${actualRegId || bookingId}. Registration form unlocked!`
      });
    }

    if (action === 'reject_consultation') {
      const { bookingId, regId, email, phone, reason } = body;

      let targetRecord: any = null;
      let targetTable = '';

      if (regId) {
        const { data: ps } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', regId).maybeSingle();
        if (ps) { targetRecord = ps; targetTable = 'parent_shadow_requests'; }
        else {
          const { data: pt } = await supabase.from('parent_tutor_requests').select('*').eq('registration_id', regId).maybeSingle();
          if (pt) { targetRecord = pt; targetTable = 'parent_tutor_requests'; }
        }
      }

      if (!targetRecord && bookingId) {
        const { data: bk } = await supabase.from('bookings').select('*').eq('booking_id', bookingId).maybeSingle();
        if (bk) {
          const cleanEmail = bk.email ? bk.email.trim().toLowerCase() : '';
          const { data: ps } = await supabase.from('parent_shadow_requests').select('*').eq('email', cleanEmail).maybeSingle();
          if (ps) { targetRecord = ps; targetTable = 'parent_shadow_requests'; }
          else {
            const { data: pt } = await supabase.from('parent_tutor_requests').select('*').eq('email', cleanEmail).maybeSingle();
            if (pt) { targetRecord = pt; targetTable = 'parent_tutor_requests'; }
          }
        }
      }

      if (targetRecord && targetTable) {
        await supabase.from(targetTable).update({
          status: 'Consultation Declined',
          candidate_message: reason ? `Reason: ${reason}` : undefined
        }).eq('id', targetRecord.id);
      }

      if (bookingId) {
        await supabase.from('bookings').update({ message: 'Consultation Declined' }).eq('booking_id', bookingId);
      }

      // Send polite rejection email
      const recipientEmail = email || targetRecord?.email;
      const parentName = targetRecord?.parent_name || targetRecord?.parentName || 'Parent';

      if (recipientEmail) {
        const reasonSnippet = reason && reason.trim()
          ? `<div style="background-color: #FFF9EB; border-left: 4px solid #C89B3C; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #5C4300;"><strong>Context:</strong> ${reason.trim()}</div>`
          : '';

        sendEmail({
          to: recipientEmail,
          subject: `Consultation Update - The Shadow Bridge`,
          type: 'status_change',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
            <p style="margin: 0 0 16px 0;">Thank you for taking the time to speak with Founder Pratibha Mishra for your 1-on-1 assessment consultation call.</p>
            <p style="margin: 0 0 16px 0;">After evaluating our current educator availability and specific scope of service, we have determined that we are unable to move forward with a match at this time.</p>
            ${reasonSnippet}
            <p style="margin: 0 0 16px 0;">We sincerely appreciate your interest in The Shadow Bridge and wish your child the absolute best in their educational journey.</p>
          `
        }).catch(err => console.error('Parent consultation decline email fail:', err));
      }

      return NextResponse.json({
        success: true,
        message: 'Consultation marked as declined and notification email sent.'
      });
    }

    if (action === 'update_record') {
      const updates: any = {};
      if (status !== undefined) {
        updates.status = status;
      }
      if (notes !== undefined) {
        updates.notes = notes;
      }
      if (body.therapistAssigned !== undefined || body.therapist_assigned !== undefined) {
        updates.therapist_assigned = body.therapistAssigned || body.therapist_assigned;
      }
      if (suggestedMatchId !== undefined && (type === 'parent_shadow_requests' || type === 'parent_tutor_requests')) {
        updates.suggested_match_id = suggestedMatchId;
      }

      const { data: updatedRecord, error } = await supabase
        .from(type)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const record = toCamelCase(updatedRecord);
      const regId = updatedRecord.registration_id || record.registrationId || record.id || '';
      const notificationUser = record.name || record.parentName || 'User';
      
      let notificationLog = '';

      // Send Email Notification synchronously via Resend if status is updated
      if (status && record.email) {
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const dashboardLink = `${protocol}://${host}/dashboard?regId=${regId}`;

        if (status === 'Match Proposed') {
          const amountDue = type === 'parent_shadow_requests' ? 5000 : 3000;
          const childName = record.childName || 'your child';
          const alreadyPaid = updatedRecord.placement_paid === true || record.placementPaid === true;
          const cleanCandidateMsg = candidateMessage ? candidateMessage.trim() : '';

          // Fetch matched teacher/tutor details if suggestedMatchId is available
          const matchId = suggestedMatchId || updatedRecord.suggested_match_id || record.suggestedMatchId;
          let matchedTeacher: any = null;
          if (matchId) {
            try {
              const teacherTable = type === 'parent_shadow_requests' ? 'shadow_teachers' : 'tutors';
              const { data: teacher } = await supabase.from(teacherTable).select('*').eq('id', matchId).maybeSingle();
              if (teacher) matchedTeacher = teacher;
            } catch (lookupErr) {
              console.warn('Teacher lookup for match email failed:', lookupErr);
            }
          }

          // Build teacher details block if we have a matched teacher
          let teacherDetailsBlock = '';
          if (matchedTeacher) {
            const teacherName = matchedTeacher.name || 'Our Proposed Educator';
            const teacherExp = matchedTeacher.experience || 'Verified';
            const teacherSpec = matchedTeacher.specialization || matchedTeacher.special_needs_exp || '';
            const teacherCity = matchedTeacher.city || '';

            teacherDetailsBlock = `
              <div style="background-color: #F0FFF4; border: 1px solid #C6F6D5; padding: 20px; border-radius: 12px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #276749; font-size: 16px; font-family: Georgia, serif;">✨ Your Proposed Educator Match</h3>
                <table border="0" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #2D253A; line-height: 1.8;">
                  <tr><td style="padding-right: 12px; font-weight: bold; color: #6A5B7C;">Name:</td><td style="font-weight: bold; color: #3B2A6B; font-size: 15px;">${teacherName}</td></tr>
                  <tr><td style="padding-right: 12px; font-weight: bold; color: #6A5B7C;">Experience:</td><td>${teacherExp}</td></tr>
                  ${teacherSpec ? `<tr><td style="padding-right: 12px; font-weight: bold; color: #6A5B7C;">Specialization:</td><td>${teacherSpec}</td></tr>` : ''}
                  ${teacherCity ? `<tr><td style="padding-right: 12px; font-weight: bold; color: #6A5B7C;">Location:</td><td>${teacherCity}</td></tr>` : ''}
                </table>
                <p style="margin: 14px 0 0 0; font-size: 13px; color: #276749; line-height: 1.5;">We're excited to propose <strong>${teacherName}</strong> as an educator match for <strong>${childName}</strong>. ${teacherName} has <strong>${teacherExp}</strong> of experience${teacherSpec ? ` specializing in ${teacherSpec}` : ''} and has been carefully selected based on your child's specific needs and profile.</p>
              </div>
            `;
          }

          // Build custom admin message block
          let customMessageBlock = '';
          if (cleanCandidateMsg) {
            customMessageBlock = `
              <div style="background-color: #F3EEF8; border-left: 4px solid #B0206B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #B0206B; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Message from Administration</p>
                <div style="margin: 0; font-size: 14px; line-height: 1.6; color: #2D253A; font-weight: 500;">
                  ${cleanCandidateMsg.replace(/\n/g, '<br />')}
                </div>
              </div>
            `;
          }

          // Build email body depending on payment status
          let emailBody = '';
          if (alreadyPaid) {
            // Parent has ALREADY paid — DO NOT ask for payment
            emailBody = `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${notificationUser},</h2>
              <p style="margin: 0 0 16px 0;">Great news! We have successfully identified and proposed a background-verified educator match for <strong>${childName}</strong>!</p>

              ${teacherDetailsBlock}
              ${customMessageBlock}

              <div style="background-color: #F8F5FB; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #E6E2EB; text-align: center;">
                <h3 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 16px;">Next Steps</h3>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #6A5B7C;">
                  Your placement fee is confirmed. ✅<br />
                  <strong>Registration ID:</strong> ${regId}
                </p>
                <a href="${dashboardLink}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">Review Your Match Details →</a>
              </div>
            `;
          } else {
            // Parent has NOT paid yet — include payment CTA (safety fallback)
            emailBody = `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${notificationUser},</h2>
              <p style="margin: 0 0 16px 0;">We are excited to share that we have successfully proposed a background-verified educational candidate match for <strong>${childName}</strong>!</p>

              ${teacherDetailsBlock}
              ${customMessageBlock}

              <p style="margin: 0 0 16px 0;">A detailed profile is now available on your parent dashboard. To lock in this match placement and begin educator trial sessions, please review the profile and complete the program onboarding fee of <strong>₹${amountDue.toLocaleString('en-IN')}</strong>.</p>

              <div style="background-color: #F3EEF8; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #E6E2EB; text-align: center;">
                <h3 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 16px;">Program Placement Details</h3>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #6A5B7C;">
                  <strong>Onboarding Fee:</strong> ₹${amountDue.toLocaleString('en-IN')}<br />
                  <strong>Registration ID:</strong> ${regId}
                </p>
                <a href="${dashboardLink}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">Pay Placement Fee & Review Match</a>
              </div>
            `;
          }

          const emailRes = await sendEmail({
            to: record.email,
            subject: `Your Match is Ready! - The Shadow Bridge [${regId}]`,
            type: 'match_ready',
            bodyHtml: emailBody
          });

          if (emailRes.success) {
            notificationLog = `[Email Sent via Resend] Match notification email${alreadyPaid ? ' (no payment ask — already paid)' : ''} delivered to ${notificationUser} (${record.email}).`;
          } else {
            notificationLog = `[Email Delivery Warning] Record updated, but email delivery to ${record.email} failed: ${emailRes.error}`;
          }
        } else {
          // Trigger Generic Status Change Email with plain-English explanation & optional Candidate Message
          const explanation = STATUS_EXPLANATIONS[status] || `We have updated your application status to "${status}".`;
          const cleanCandidateMsg = candidateMessage ? candidateMessage.trim() : '';

          let customMessageBlock = '';
          if (cleanCandidateMsg) {
            customMessageBlock = `
              <div style="background-color: #F3EEF8; border-left: 4px solid #B0206B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #B0206B; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Message from Administration</p>
                <div style="margin: 0; font-size: 14px; line-height: 1.6; color: #2D253A; font-weight: 500;">
                  ${cleanCandidateMsg.replace(/\n/g, '<br />')}
                </div>
              </div>
            `;
          }

          const emailRes = await sendEmail({
            to: record.email,
            subject: `Update on Your Application - The Shadow Bridge [${regId}]`,
            type: 'status_change',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${notificationUser},</h2>
              <p style="margin: 0 0 16px 0;">This is an update regarding your request or application under Registration ID <strong>${regId}</strong>.</p>
              
              <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #6A5B7C; font-weight: bold;">New Application Status</p>
                <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 18px; font-weight: bold;">${status}</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #2D253A;">${explanation}</p>
              </div>

              ${customMessageBlock}

              <div style="margin: 20px 0; background-color: #FFF9EB; border-left: 4px solid #C89B3C; padding: 14px 18px; border-radius: 4px; font-size: 13px; color: #5C4300; line-height: 1.6;">
                <strong>Check Status Reminder:</strong> You can view real-time program updates anytime by visiting <a href="${dashboardLink}" style="color: #B0206B; font-weight: bold; text-decoration: underline;">theshadowbridge.com/check-status</a> and entering your <strong>ID (${regId})</strong> along with your registered phone number or email address.
              </div>

              <div style="margin: 20px 0;">
                <a href="${dashboardLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 13px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">View Status Dashboard →</a>
              </div>
            `
          });

          if (emailRes.success) {
            notificationLog = `[Email Sent via Resend] Status notification email ${cleanCandidateMsg ? 'with custom message ' : ''}delivered to ${notificationUser} (${record.email}) for status "${status}".`;
          } else {
            notificationLog = `[Email Delivery Warning] Record updated, but status email to ${record.email} failed: ${emailRes.error}`;
          }
        }
      } else {
        notificationLog = `Record status set to "${status || record.status}".`;
      }

      return NextResponse.json({ 
        success: true, 
        record,
        notificationLog
      });
    }

    return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin POST API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
