const http = require('http');

const data = JSON.stringify({
  name: 'User Live Test',
  phone: '9988776655',
  email: 'user.livetest@example.com',
  city: 'Delhi NCR',
  message: 'Testing live form submission flow.'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/contacts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Response Body:', body);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
