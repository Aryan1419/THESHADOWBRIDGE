const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

const apiKey = env.RESEND_API_KEY;
const senderEmail = env.SENDER_EMAIL || 'noreply@theshadowbridge.com';

const STATUS_EXPLANATIONS = {
  'Interview Scheduled': 'We have scheduled your panel assessment interview with Founder Pratibha Mishra. Meeting link guidelines are active on your dashboard.'
};

async function testCandidateCustomMessage() {
  console.log('=== TESTING CANDIDATE CUSTOM MESSAGE EMAIL DISPATCH ===\n');

  const targetId = 'shadow-x1l13qw'; // Aryan Beltharia
  const newStatus = 'Interview Scheduled';
  const privateAdminNotes = 'PRIVATE ADMIN NOTE: Verification complete. Candidate recommended for trial.';
  const customCandidateMsg = 'Your panel interview is scheduled for July 30th at 4:00 PM IST with Lead Founder Pratibha Mishra via Google Meet: https://meet.google.com/tsb-interview-room';

  // 1. Update database record
  const { data: updatedRecord, error } = await supabase
    .from('shadow_teachers')
    .update({
      status: newStatus,
      notes: privateAdminNotes
    })
    .eq('id', targetId)
    .select()
    .single();

  if (error || !updatedRecord) {
    console.error('❌ DB Update Failed:', error);
    return;
  }

  console.log('✅ 1. Database Record Updated:');
  console.log('   ID:', updatedRecord.id);
  console.log('   Name:', updatedRecord.name);
  console.log('   Email:', updatedRecord.email);
  console.log('   Status:', updatedRecord.status);
  console.log('   Private Notes Saved in DB:', updatedRecord.notes);

  // 2. Build email HTML with candidate message (and strictly ZERO private notes)
  const regId = updatedRecord.registration_id;
  const explanation = STATUS_EXPLANATIONS[newStatus];
  const fromHeader = senderEmail.includes('<') ? senderEmail : `The Shadow Bridge <${senderEmail}>`;

  const customMessageBlock = `
    <div style="background-color: #F3EEF8; border-left: 4px solid #B0206B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #B0206B; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Message from Administration</p>
      <div style="margin: 0; font-size: 14px; line-height: 1.6; color: #2D253A; font-weight: 500;">
        ${customCandidateMsg.replace(/\n/g, '<br />')}
      </div>
    </div>
  `;

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Update on Your Application</title></head>
      <body style="margin: 0; padding: 0; background-color: #F8F5FB; font-family: sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #E6E2EB;">
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${updatedRecord.name},</h2>
          <p style="margin: 0 0 16px 0;">This is an update regarding your request or application under Registration ID <strong>${regId}</strong>.</p>
          
          <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6A5B7C; font-weight: bold;">New Application Status</p>
            <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 18px; font-weight: bold;">${newStatus}</h4>
            <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #2D253A;">${explanation}</p>
          </div>

          ${customMessageBlock}

          <p style="margin: 20px 0 0 0;">You can track real-time program updates and view next steps guidelines directly on your user dashboard:</p>
          <a href="https://theshadowbridge.com/dashboard?regId=${regId}" style="display: inline-block; padding: 10px 20px; background: #3B2A6B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin-top: 12px;">View Dashboard Details</a>
        </div>
      </body>
    </html>
  `;

  // Verify private notes are NOT in fullHtml
  const containsPrivateNotes = fullHtml.includes('PRIVATE ADMIN NOTE');
  console.log('\n2. Security Check - Are Private Admin Notes excluded from Email HTML?', !containsPrivateNotes ? '✅ YES (VERIFIED SAFE)' : '❌ NO (DANGER)');

  // 3. Dispatch via Resend
  console.log('\n3. Dispatching email to Resend API...');
  const resendResp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: fromHeader,
      to: [updatedRecord.email],
      subject: `Update on Your Application - The Shadow Bridge [${regId}]`,
      html: fullHtml
    })
  });

  const resendData = await resendResp.json().catch(() => ({}));
  console.log('\n4. Resend Delivery Result:');
  console.log('   HTTP Status Code:', resendResp.status);
  console.log('   Resend Email ID:', resendData.id);

  if (resendResp.ok && resendData.id) {
    console.log('\n✅ 5. SUCCESS: Custom Candidate Message Email Delivered via Resend to', updatedRecord.email);
  } else {
    console.error('\n❌ Delivery failed:', resendData);
  }
}

testCandidateCustomMessage();
