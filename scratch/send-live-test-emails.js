const fs = require('fs');
const path = require('path');
const https = require('https');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const resendApiKey = env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error('❌ RESEND_API_KEY missing in .env.local');
  process.exit(1);
}

const testEmail = 'aryanbeltharia1419@gmail.com';
const testRegId = `SB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
const parentName = 'Pratibha Mishra';
const phone = '9974390725';

function sendResendEmail(to, subject, html) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      from: 'The Shadow Bridge <onboarding@resend.dev>',
      to: [to],
      subject,
      html
    });

    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

// Standard Brand Email Wrapper
function wrapTemplate(title, bodyContent) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
    </head>
    <body style="background-color: #F8F5FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E6E2EB; box-shadow: 0 4px 20px rgba(59, 42, 107, 0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3B2A6B 0%, #2A1D4E 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-family: Georgia, serif; font-size: 24px; margin: 0; font-weight: normal; letter-spacing: 0.5px;">The Shadow Bridge</h1>
          <p style="color: #E2D9F3; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Empowering Inclusive Education</p>
        </div>
        <!-- Body Content -->
        <div style="padding: 32px 24px; color: #2D253A; font-size: 14px; line-height: 1.6;">
          ${bodyContent}
        </div>
        <!-- Footer -->
        <div style="background-color: #F3EEF8; padding: 20px 24px; text-align: center; border-top: 1px solid #E6E2EB; font-size: 12px; color: #6A5B7C;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #3B2A6B;">The Shadow Bridge Team</p>
          <p style="margin: 0;">Need assistance? Reply directly to this email or reach us at <a href="mailto:theshadowbridgesupport@gmail.com" style="color: #B0206B; text-decoration: none;">theshadowbridgesupport@gmail.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendTestEmails() {
  console.log('=== SENDING LIVE TEST EMAILS TO:', testEmail, '===\n');

  // 1. Consultation Booking Confirmation Email
  console.log('1. Sending Test Email #1: Consultation Booking Receipt...');
  const html1 = wrapTemplate('Consultation Booked', `
    <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
    <p style="margin: 0 0 16px 0;">Thank you for booking a 1-on-1 consultation session for <strong>Shadow Teacher</strong> support with Founder Pratibha Mishra.</p>
    <p style="margin: 0 0 16px 0;">We have received your consultation fee payment of <strong>₹99</strong>.</p>
    
    <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 20px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #3B2A6B; font-family: Georgia, serif;">Your Login &amp; Consultation Details</h3>
      <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: #3B2A6B;">Your Unique ID: <span style="font-family: monospace; color: #B0206B; font-size: 16px;">${testRegId}</span></p>
      <p style="margin: 0 0 8px 0;"><strong>Service Selected:</strong> Shadow Teacher</p>
      <p style="margin: 0;"><strong>Status:</strong> Consultation Booked (Call Pending)</p>
    </div>

    <div style="margin: 20px 0; background-color: #FFF9EB; border-left: 4px solid #C89B3C; padding: 16px 20px; border-radius: 4px; font-size: 13px; color: #5C4300; line-height: 1.6;">
      <strong>How to Check Your Status:</strong><br />
      To check your consultation status or access your child registration form anytime, visit <a href="https://theshadowbridge.com/check-status" style="color: #B0206B; font-weight: bold; text-decoration: underline;">theshadowbridge.com/check-status</a> and enter your <strong>ID (${testRegId})</strong> along with the phone number (<strong>${phone}</strong>) or email (<strong>${testEmail}</strong>) you registered with.
    </div>

    <p style="margin: 0 0 20px 0;">Founder Pratibha Mishra will call you directly within 24 hours to conduct your assessment consultation.</p>

    <div style="margin: 24px 0; text-align: center;">
      <a href="https://theshadowbridge.com/check-status?regId=${testRegId}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">Check Status &amp; Access Registration Form →</a>
    </div>
  `);

  const res1 = await sendResendEmail(testEmail, `TEST #1: Consultation Booked - The Shadow Bridge [${testRegId}]`, html1);
  console.log('   ✅ Email #1 Sent Result:', JSON.stringify(res1));

  // 2. Consultation Completed / Form Unlocked Email
  console.log('\n2. Sending Test Email #2: Form Unlocked Email...');
  const html2 = wrapTemplate('Consultation Completed', `
    <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
    <p style="margin: 0 0 16px 0;">Thank you for taking the time to complete your 1-on-1 assessment consultation call with Founder Pratibha Mishra!</p>
    <p style="margin: 0 0 16px 0;">We have marked your consultation as <strong>Completed</strong>. Your detailed Child Registration Form is now fully unlocked.</p>
    
    <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 20px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
      <h3 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 16px; font-family: Georgia, serif;">Next Step: Fill Child Registration Form</h3>
      <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #3B2A6B;">Your Unique ID: <span style="font-family: monospace; color: #B0206B; font-size: 16px;">${testRegId}</span></p>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #6A5B7C;">Please provide your child's specific developmental and school details to proceed with educator matching.</p>
      <div style="text-align: center;">
        <a href="https://theshadowbridge.com/register/parent/form?regId=${testRegId}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">Open Child Registration Form →</a>
      </div>
    </div>

    <div style="margin: 20px 0; background-color: #FFF9EB; border-left: 4px solid #C89B3C; padding: 16px 20px; border-radius: 4px; font-size: 13px; color: #5C4300; line-height: 1.6;">
      <strong>How to Access or Check Status Anytime:</strong><br />
      You can access your registration form or check application progress anytime at <a href="https://theshadowbridge.com/check-status" style="color: #B0206B; font-weight: bold; text-decoration: underline;">theshadowbridge.com/check-status</a> by entering your <strong>ID (${testRegId})</strong> along with your registered phone number or email address.
    </div>
  `);

  const res2 = await sendResendEmail(testEmail, `TEST #2: Consultation Completed - Registration Form Unlocked [${testRegId}]`, html2);
  console.log('   ✅ Email #2 Sent Result:', JSON.stringify(res2));

  // 3. Custom Candidate Message Email
  console.log('\n3. Sending Test Email #3: Candidate Message with Check Status Reminder...');
  const html3 = wrapTemplate('Application Status Update', `
    <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${parentName},</h2>
    <p style="margin: 0 0 16px 0;">This is an update regarding your request under Registration ID <strong>${testRegId}</strong>.</p>
    
    <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6A5B7C; font-weight: bold;">New Application Status</p>
      <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 18px; font-weight: bold;">Requirement Analysis</h4>
      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #2D253A;">Our clinical team is currently analyzing your child's profile and preparing educator profiles.</p>
    </div>

    <div style="background-color: #F3EEF8; border-left: 4px solid #B0206B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #B0206B; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Message from Administration</p>
      <div style="margin: 0; font-size: 14px; line-height: 1.6; color: #2D253A; font-weight: 500;">
        Hello Pratibha, we have shortlisted 2 specialized shadow educators in your locality and will share their profile previews by tomorrow afternoon.
      </div>
    </div>

    <div style="margin: 20px 0; background-color: #FFF9EB; border-left: 4px solid #C89B3C; padding: 14px 18px; border-radius: 4px; font-size: 13px; color: #5C4300; line-height: 1.6;">
      <strong>Check Status Reminder:</strong> You can view real-time program updates anytime by visiting <a href="https://theshadowbridge.com/check-status" style="color: #B0206B; font-weight: bold; text-decoration: underline;">theshadowbridge.com/check-status</a> and entering your <strong>ID (${testRegId})</strong> along with your registered phone number or email address.
    </div>

    <div style="margin: 20px 0; text-align: center;">
      <a href="https://theshadowbridge.com/check-status?regId=${testRegId}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 13px; box-shadow: 0 4px 6px rgba(176, 32, 107, 0.15);">View Status Dashboard →</a>
    </div>
  `);

  const res3 = await sendResendEmail(testEmail, `TEST #3: Status Update with Custom Admin Message [${testRegId}]`, html3);
  console.log('   ✅ Email #3 Sent Result:', JSON.stringify(res3));

  console.log('\n=== ALL 3 LIVE TEST EMAILS SENT SUCCESSFULLY TO', testEmail, '! ===');
}

sendTestEmails();
