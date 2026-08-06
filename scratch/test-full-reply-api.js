const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const jwtSecret = env.JWT_SECRET || 'fallback-secret-key-12345';
const token = jwt.sign({ username: 'admin', role: 'admin' }, jwtSecret, { expiresIn: '1h' });

async function testApiReply() {
  console.log('=== TESTING POST /api/admin/records (reply_contact) ===\n');

  const payload = JSON.stringify({
    action: 'reply_contact',
    id: 'contact-kr5mvk6',
    adminReply: 'Hello Aryan! Thank you for reaching out to The Shadow Bridge. Yes, we provide full coverage in Greater Noida for both Shadow Teachers and Home Tutors.'
  });

  const res = await fetch('http://localhost:3000/api/admin/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: payload
  }).catch(err => {
    console.error('Fetch error:', err.message);
    return null;
  });

  if (!res) return;

  const data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
}

testApiReply();
