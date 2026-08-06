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

async function sendTest(toEmail) {
  console.log(`\n--- Sending email to: ${toEmail} ---`);
  const fromHeader = senderEmail.includes('<') ? senderEmail : `The Shadow Bridge <${senderEmail}>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: fromHeader,
      to: [toEmail],
      subject: 'Re: Your inquiry to The Shadow Bridge',
      html: `
        <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear Parent,</h2>
        <div style="color: #2D253A; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
          Thank you for reaching out to The Shadow Bridge. We have received your inquiry and our team is ready to assist you.
        </div>
        <div style="border-top: 1px solid #E6E2EB; padding-top: 16px; margin-top: 24px;">
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #3B2A6B; font-size: 14px;">The Shadow Bridge Team</p>
          <p style="margin: 0; font-size: 12px; color: #6A5B7C;">Email: theshadowbridgesupport@gmail.com | Web: https://theshadowbridge.com</p>
        </div>
      `
    })
  });

  const data = await response.json().catch(() => ({}));
  console.log('Status Code:', response.status);
  console.log('Response Payload:', JSON.stringify(data, null, 2));
}

async function main() {
  await sendTest('aryanbeltharia1419@gmail.com');
}

main();
