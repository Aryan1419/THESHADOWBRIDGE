const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

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

async function testStatusEmail(toEmail, statusName, candidateName, regId) {
  console.log(`=== TESTING REAL STATUS CHANGE EMAIL TO: ${toEmail} ===`);
  const fromHeader = senderEmail.includes('<') ? senderEmail : `The Shadow Bridge <${senderEmail}>`;
  const explanation = STATUS_EXPLANATIONS[statusName] || `We have updated your record status to "${statusName}".`;

  const bodyHtml = `
    <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${candidateName},</h2>
    <p style="margin: 0 0 16px 0;">This is an update regarding your request or application under Registration ID <strong>${regId}</strong>.</p>
    
    <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6A5B7C; font-weight: bold;">New Application Status</p>
      <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 18px; font-weight: bold;">${statusName}</h4>
      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #2D253A;">${explanation}</p>
    </div>

    <p style="margin: 20px 0 0 0;">You can track real-time program updates and view next steps guidelines directly on your user dashboard:</p>
    <a href="https://theshadowbridge.com/dashboard?regId=${regId}" style="display: inline-block; padding: 10px 20px; background: #3B2A6B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; margin-top: 12px;">View Dashboard Details</a>
  `;

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Update on Your Application</title></head>
      <body style="margin: 0; padding: 0; background-color: #F8F5FB; font-family: sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #E6E2EB;">
          ${bodyHtml}
        </div>
      </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: fromHeader,
      to: [toEmail],
      subject: `Update on Your Application - The Shadow Bridge [${regId}]`,
      html: fullHtml
    })
  });

  const resData = await response.json().catch(() => ({}));
  console.log('HTTP Status Code:', response.status);
  console.log('Resend Response Body:', JSON.stringify(resData, null, 2));
}

testStatusEmail('aryanbeltharia1419@gmail.com', 'Rejected', 'Aryan Beltharia', 'TSB-2026-9942');
