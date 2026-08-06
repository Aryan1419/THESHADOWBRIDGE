const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

console.log('=== RESEND & EMAIL ENVIRONMENT AUDIT ===');
console.log('RESEND_API_KEY present:', !!env.RESEND_API_KEY);
if (env.RESEND_API_KEY) {
  console.log('RESEND_API_KEY prefix:', env.RESEND_API_KEY.substring(0, 7) + '...');
}
console.log('SENDER_EMAIL:', env.SENDER_EMAIL || '(not set, defaults to noreply@theshadowbridge.com)');

async function testSend() {
  const apiKey = env.RESEND_API_KEY;
  const senderEmail = env.SENDER_EMAIL || 'noreply@theshadowbridge.com';

  const fromHeader = senderEmail.includes('<') ? senderEmail : `The Shadow Bridge <${senderEmail}>`;
  
  console.log('\nTesting Resend API call with params:');
  console.log('From:', fromHeader);
  console.log('To: aryanbeltharia1419@gmail.com');

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is missing in .env.local!');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: fromHeader,
      to: ['aryanbeltharia1419@gmail.com'],
      subject: 'Test Reply - The Shadow Bridge',
      html: '<h1>Test Contact Reply</h1><p>Testing contact reply email dispatch via Resend.</p>'
    })
  });

  const resData = await response.json().catch(() => ({}));
  console.log('HTTP Status:', response.status);
  console.log('Response Body:', JSON.stringify(resData, null, 2));
}

testSend();
