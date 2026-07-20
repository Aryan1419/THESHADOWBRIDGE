import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sendEmail, STATUS_EXPLANATIONS } from '@/lib/notifications';
import { readDb } from '@/lib/db';

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
    if (token !== 'mock-admin-token-sb-2026') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    let tutors = null, shadowTeachers = null, parentShadow = null, parentTutor = null, notifications = null, contacts = null, reviews = null;

    if (isSupabaseConfigured) {
      try {
        const { data: t } = await supabase.from('tutors').select('*');
        const { data: st } = await supabase.from('shadow_teachers').select('*');
        const { data: ps } = await supabase.from('parent_shadow_requests').select('*');
        const { data: pt } = await supabase.from('parent_tutor_requests').select('*');
        const { data: c } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
        const { data: n } = await supabase.from('notifications_log').select('*').order('created_at', { ascending: false });
        const { data: rev } = await supabase.from('reviews').select('*').order('submitted_at', { ascending: false });

        tutors = t;
        shadowTeachers = st;
        parentShadow = ps;
        parentTutor = pt;
        contacts = c;
        notifications = n;
        reviews = rev;
      } catch (err) {
        console.warn('Supabase records query failed, falling back to local DB:', err);
      }
    }

    const localDb = readDb();
    if (!tutors) tutors = localDb.tutors || [];
    if (!shadowTeachers) shadowTeachers = localDb.shadow_teachers || [];
    if (!parentShadow) parentShadow = localDb.parent_shadow_requests || [];
    if (!parentTutor) parentTutor = localDb.parent_tutor_requests || [];
    if (!contacts) contacts = (localDb as any).contacts || [];
    if (!notifications) notifications = localDb.notifications || [];
    if (!reviews) reviews = localDb.reviews || [];

    return NextResponse.json({
      tutors: toCamelCase(tutors || []),
      shadow_teachers: toCamelCase(shadowTeachers || []),
      parent_shadow_requests: toCamelCase(parentShadow || []),
      parent_tutor_requests: toCamelCase(parentTutor || []),
      contacts: toCamelCase(contacts || []),
      notifications: toCamelCase(notifications || []),
      reviews: toCamelCase(reviews || []),
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
    if (token !== 'mock-admin-token-sb-2026') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const { action, type, id, status, notes, suggestedMatchId } = body;

    if (!action || !type || !id) {
      return NextResponse.json({ error: 'Missing required update parameters (action, type, id)' }, { status: 400 });
    }

    if (action === 'update_record') {
      const updates: any = {};
      if (status !== undefined) {
        updates.status = status;
      }
      if (notes !== undefined) {
        updates.notes = notes;
      }
      if (suggestedMatchId !== undefined) {
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
      const notificationUser = record.name || record.parentName || 'User';
      const notificationContact = record.phone || record.email || '';
      
      // Send Email Notification asynchronously if status is updated
      if (status && record.email) {
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const dashboardLink = `${protocol}://${host}/dashboard?regId=${record.registrationId}`;

        if (status === 'Match Proposed') {
          // Trigger Match Ready Payment Request Email
          const amountDue = type === 'parent_shadow_requests' ? 5000 : 3000;
          const childName = record.childName || 'your child';
          
          sendEmail({
            to: record.email,
            subject: 'Your Match is Ready! - The Shadow Bridge',
            type: 'match_ready',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${notificationUser},</h2>
              <p style="margin: 0 0 16px 0;">We are excited to share that we have successfully proposed a background-verified educational candidate matching trial run for <strong>${childName}</strong>!</p>
              <p style="margin: 0 0 16px 0;">A detailed profile guideline is now available on your parent dashboard. To lock in this match placement and begin educator trials sessions, please review the profile and complete the program onboarding fee of <strong>₹${amountDue.toLocaleString('en-IN')}</strong>.</p>
              
              <div style="background-color: #F3EEF8; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #E6E2EB; text-align: center;">
                <h3 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 16px;">Program Placement Details</h3>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #6A5B7C;">
                  <strong>Onboarding Fee:</strong> ₹${amountDue.toLocaleString('en-IN')}<br />
                  <strong>Registration ID:</strong> ${record.registrationId}
                </p>
                <a href="${dashboardLink}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">Pay Placement Fee & Review Match</a>
              </div>
            `
          }).catch(err => console.error('Match proposed email trigger fail:', err));
        } else {
          // Trigger Generic Status Change Email
          const explanation = STATUS_EXPLANATIONS[status] || `We have updated your record status to "${status}".`;
          sendEmail({
            to: record.email,
            subject: 'Update on Your Application - The Shadow Bridge',
            type: 'status_change',
            bodyHtml: `
              <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${notificationUser},</h2>
              <p style="margin: 0 0 16px 0;">This is an update regarding your request or application under Registration ID <strong>${record.registrationId}</strong>.</p>
              
              <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #6A5B7C; font-weight: bold;">New Application Status</p>
                <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 18px; font-weight: bold;">${status}</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #2D253A;">${explanation}</p>
              </div>

              <p style="margin: 20px 0 0 0;">You can track real-time program updates and view next steps guidelines directly on your user dashboard:</p>
              <a href="${dashboardLink}" style="display: inline-block; padding: 10px 20px; background: #3B2A6B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin-top: 12px;">View Dashboard Details</a>
            `
          }).catch(err => console.error('Status change email trigger fail:', err));
        }
      }

      const statusLog = `[Email/SMS Notification] A notification has been triggered to ${notificationUser} (${notificationContact}) regarding status change to "${status || record.status}".`;

      return NextResponse.json({ 
        success: true, 
        record,
        notificationLog: statusLog
      });
    }

    return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin POST API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
