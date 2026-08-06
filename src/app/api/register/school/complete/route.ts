import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/notifications';
import { readDb, writeDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      registrationId,
      detailedAddress,
      streetLandmark,
      pincode,
      state,
      alternateNumber,
      expectedJoiningDate,
      workingDays,
      workingHours,
      termsAccepted
    } = body;

    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
    }

    const updates = {
      detailed_address: detailedAddress || '',
      street_landmark: streetLandmark || '',
      pincode: pincode || '',
      state: state || '',
      alternate_number: alternateNumber || '',
      expected_joining_date: expectedJoiningDate || '',
      working_days: workingDays || '',
      working_hours: workingHours || '',
      terms_accepted: Boolean(termsAccepted),
      terms_accepted_at: termsAccepted ? new Date().toISOString() : undefined,
      status: 'Profiles Shared' as const
    };

    let record: any = null;

    try {
      const { data, error } = await supabase
        .from('school_requests')
        .update(updates)
        .eq('registration_id', registrationId)
        .select()
        .maybeSingle();

      if (data) record = data;
    } catch (err) {
      console.warn('Supabase update failed for school registration completion:', err);
    }

    // Fallback to local db.json
    const localDb = readDb();
    if (localDb.school_requests) {
      const index = localDb.school_requests.findIndex((s: any) => s.registration_id === registrationId);
      if (index !== -1) {
        localDb.school_requests[index] = { ...localDb.school_requests[index], ...updates };
        writeDb(localDb);
        if (!record) record = localDb.school_requests[index];
      }
    }

    const schoolEmail = record?.email || '';
    const schoolName = record?.school_name || record?.schoolName || 'School';
    const contactName = record?.contact_name || record?.contactName || 'Representative';

    if (schoolEmail) {
      await Promise.allSettled([
        sendEmail({
          to: schoolEmail,
          subject: `Registration Form Completed - The Shadow Bridge [${registrationId}]`,
          type: 'registration',
          bodyHtml: `
            <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${contactName},</h2>
            <p style="margin: 0 0 16px 0;">Thank you for completing the detailed registration form for <strong>${schoolName}</strong>.</p>

            <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
              <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> ${registrationId}</p>
              <p style="margin: 0 0 8px 0;"><strong>Expected Joining Date:</strong> ${expectedJoiningDate || 'As agreed'}</p>
              <p style="margin: 0 0 8px 0;"><strong>Working Schedule:</strong> ${workingDays} (${workingHours})</p>
              <p style="margin: 0;"><strong>Terms Agreement:</strong> Accepted (50% First Month Salary Commission)</p>
            </div>

            <p style="margin: 0 0 16px 0;">Our placement team is currently matching suitable candidate profiles with your classroom parameters and will schedule educator interviews shortly.</p>
            
            <p style="margin: 24px 0 0 0; font-size: 14px;">Warm regards,<br /><strong>The Shadow Bridge Team</strong></p>
          `
        }).catch(err => console.error('Failed to send registration completion email:', err))
      ]);
    }

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error('API Register School Complete Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
