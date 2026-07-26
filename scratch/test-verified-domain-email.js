const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const apiKey = env.RESEND_API_KEY;
const senderEmail = env.SENDER_EMAIL || 'noreply@theshadowbridge.com';

console.log('=== RESEND VERIFIED DOMAIN SENDER DIAGNOSTIC ===');
console.log('Resend API Key:', apiKey ? (apiKey.substring(0, 8) + '...') : 'MISSING');
console.log('Sender Email:', senderEmail);
console.log('From Header:', `The Shadow Bridge <${senderEmail}>`);

async function testResendVerifiedSender() {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: `The Shadow Bridge <${senderEmail}>`,
        to: ['theshadowbridgesupport@gmail.com'],
        subject: 'Verified Domain Sender Test',
        html: '<p>Testing delivery from <strong>The Shadow Bridge &lt;noreply@theshadowbridge.com&gt;</strong>.</p>'
      })
    });

    const resData = await res.json();
    console.log('Resend Status Code:', res.status);
    console.log('Resend Response Body:', JSON.stringify(resData, null, 2));
  } catch (err) {
    console.error('Test Exception:', err);
  }
}

testResendVerifiedSender();
