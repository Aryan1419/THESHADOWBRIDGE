const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

function toSnakeCase(obj) {
  const newObj = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    newObj[snakeKey] = obj[key];
  }
  return newObj;
}

async function main() {
  console.log('=== DIRECT DATABASE INSERT TEST FOR SHADOW TEACHER REGISTRATION ===\n');

  const randomId = () => Math.random().toString(36).substring(2, 9);
  const randomNumericId = () => Math.floor(1000 + Math.random() * 9000).toString();
  const year = new Date().getFullYear();
  const createdAt = new Date().toISOString();
  const generatedId = `TSB-${year}-${randomNumericId()}`;

  const record = {
    id: 'shadow-' + randomId(),
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
    status: 'Interview Awaiting',
    aadharCardName: '',
    qualificationCertName: '',
    experienceCertName: '',
    profilePhotoName: '',
    registration_id: generatedId,
    created_at: createdAt,
    notes: ''
  };

  const { data, error } = await supabase
    .from('shadow_teachers')
    .insert([toSnakeCase(record)])
    .select();

  if (error) {
    console.error('❌ Insert Error:', error);
  } else {
    console.log('✅ Direct Database Insert SUCCESSFUL!');
    console.log('Inserted Record Registration ID:', generatedId);
    
    // Clean up test entry
    await supabase.from('shadow_teachers').delete().eq('id', record.id);
    console.log('Cleaned up test record.');
  }
}

main();
