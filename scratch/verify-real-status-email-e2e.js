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
  'Interview Awaiting': 'We are currently screening your application credentials and verifying qualifications.',
  'Interview Scheduled': 'We have scheduled your panel assessment interview with Founder Pratibha Mishra. Meeting link guidelines are active on your dashboard.',
  'Shortlisted': 'Congratulations, you have been shortlisted and inducted into our active matching candidate pool.',
  'Onboarding': 'We are completing your reference checks, address validation, and standard onboarding credentials verification.',
  'Active': 'Your profile is now active! Our matchmaking system will pair you with parent requests.',
  'Rejected': 'Thank you for applying. We are unable to proceed with your onboarding at this time. Your profile will be retained for future openings.'
};

async function testStatusChangeEmailTrigger() {
  console.log('=== END-TO-END STATUS CHANGE EMAIL DELIVERABILITY TEST ===\n');

  // Target record: Aryan Beltharia (shadow-x1l13qw)
  const targetId = 'shadow-x1l13qw';
  const targetStatus = 'Rejected';

  // 1. Update status in Supabase
  const { data: updatedRecord, error } = await supabase
    .from('shadow_teachers')
    .update({ status: targetStatus, notes: 'Status set to Rejected during live email verification.' })
    .eq('id', targetId)
    .select()
    .single();

  if (error || !updatedRecord) {
    console.error('❌ Supabase Update Error:', error);
    return;
  }

  console.log('✅ 1. Record Status Updated in Database:');
  console.log('   ID:', updatedRecord.id);
  console.log('   Name:', updatedRecord.name);
  console.log('   Email:', updatedRecord.email);
  console.log('   Status:', updatedRecord.status);
  console.log('   Registration ID:', updatedRecord.registration_id);

  // 2. Trigger synchronous email via Resend
  const fromHeader = senderEmail.includes('<') ? senderEmail : `The Shadow Bridge <${senderEmail}>`;
  const explanation = STATUS_EXPLANATIONS[targetStatus];
  const regId = updatedRecord.registration_id;
  const dashboardLink = `https://theshadowbridge.com/dashboard?regId=${regId}`;

  const bodyHtml = `
    <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${updatedRecord.name},</h2>
    <p style="margin: 0 0 16px 0;">This is an update regarding your request or application under Registration ID <strong>${regId}</strong>.</p>
    
    <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6A5B7C; font-weight: bold;">New Application Status</p>
      <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 18px; font-weight: bold;">${targetStatus}</h4>
      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #2D253A;">${explanation}</p>
    </div>

    <p style="margin: 20px 0 0 0;">You can track real-time program updates and view next steps guidelines directly on your user dashboard:</p>
    <a href="${dashboardLink}" style="display: inline-block; padding: 10px 20px; background: #3B2A6B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin-top: 12px;">View Dashboard Details</a>
  `;

  console.log('\n2. Dispatching email to Resend API...');
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
      html: `<!DOCTYPE html><html><body>${bodyHtml}</body></html>`
    })
  });

  const resendData = await resendResp.json().catch(() => ({}));

  console.log('\n3. Resend Delivery Result:');
  console.log('   HTTP Status Code:', resendResp.status);
  console.log('   Resend Email ID:', resendData.id);

  if (resendResp.ok && resendData.id) {
    console.log('\n✅ 4. SUCCESS: Real Status Change Email Delivered via Resend to', updatedRecord.email);
  } else {
    console.error('\n❌ Resend Delivery Error:', resendData);
  }
}

testStatusChangeEmailTrigger();
