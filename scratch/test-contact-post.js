const http = require('http');

const data = JSON.stringify({
  name: 'Test Debugger User',
  phone: '+91 9876543210',
  email: 'test.debugger@example.com',
  city: 'Delhi NCR',
  message: 'This is an end-to-end systematic diagnostic test message.'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/contacts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('API Status Code:', res.statusCode);
    console.log('API Response Body:', body);
  });
});

req.on('error', (e) => {
  console.error('Request error (is dev server running?):', e.message);
});

req.write(data);
req.end();
