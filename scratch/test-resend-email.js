const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const apiKey = env.RESEND_API_KEY;
const senderEmail = env.SENDER_EMAIL || 'onboarding@resend.dev';

async function testResend() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: `The Shadow Bridge <${senderEmail}>`,
      to: ['aryanbeltharia1419@gmail.com'],
      subject: 'Diagnostic Test Email (Resend Verified Owner)',
      html: '<p>Testing Resend API delivery to verified account email.</p>'
    })
  });

  const resData = await res.json();
  console.log('Resend Response Status:', res.status);
  console.log('Resend Response Body:', JSON.stringify(resData, null, 2));
}

testResend();
