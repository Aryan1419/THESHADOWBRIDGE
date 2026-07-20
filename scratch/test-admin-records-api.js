const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/records',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer mock-admin-token-sb-2026'
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Admin Records API Status:', res.statusCode);
    try {
      const data = JSON.parse(body);
      console.log('Keys in returned payload:', Object.keys(data));
      console.log('Contacts array length:', data.contacts ? data.contacts.length : 'MISSING');
      if (data.contacts && data.contacts.length > 0) {
        console.log('First contact:', data.contacts[0]);
      }
    } catch (e) {
      console.log('Raw response body:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error (is server running?):', e.message);
});

req.end();
