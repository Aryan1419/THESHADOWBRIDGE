const http = require('http');

async function main() {
  console.log('=== END-TO-END SHADOW TEACHER TEXT REGISTRATION TEST ===\n');

  const payload = JSON.stringify({
    type: 'shadow',
    name: 'E2E Test Candidate',
    dob: '1998-04-12',
    gender: 'Female',
    phone: '9876543210',
    email: 'e2etest.shadow@example.com',
    city: 'Delhi NCR',
    address: 'Sector 62, Noida',
    preferredLocations: 'Noida, Greater Noida',
    qualification: 'B.Ed Special Education',
    specialization: 'Autism Spectrum Support',
    experience: '2-5 Years',
    certificates: 'RCI Certified',
    specialNeedsExp: 'Yes',
    comfortableAreas: 'ASD, ADHD',
    otherComfortable: '',
    openToTravel: 'Yes',
    preferredWorkType: 'Full-time',
    aadharCardName: '',
    qualificationCertName: '',
    experienceCertName: '',
    profilePhotoName: '',
    aadharCardUrl: '',
    qualificationCertUrl: '',
    experienceCertUrl: '',
    profilePhotoUrl: ''
  });

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('HTTP Status Code:', res.statusCode);
      console.log('API Response Body:', data);
    });
  });

  req.on('error', (err) => {
    console.error('Request Error:', err.message);
  });

  req.write(payload);
  req.end();
}

main();
