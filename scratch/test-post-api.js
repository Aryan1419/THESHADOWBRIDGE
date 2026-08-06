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

async function main() {
  console.log('=== Testing Registration DB Insert directly ===');

  const randomId = () => Math.random().toString(36).substring(2, 9);
  const randomNumericId = () => Math.floor(1000 + Math.random() * 9000).toString();
  const year = new Date().getFullYear();
  const createdAt = new Date().toISOString();
  const generatedId = `TSB-${year}-${randomNumericId()}`;

  const aadharCardUrl = 'https://oggzposjudhbpnasymzn.supabase.co/storage/v1/object/public/documents/shadow-teachers/test_aadhar.pdf';
  const qualificationCertUrl = 'https://oggzposjudhbpnasymzn.supabase.co/storage/v1/object/public/documents/shadow-teachers/test_qual.pdf';

  let docNotes = [];
  if (aadharCardUrl) docNotes.push(`Aadhar Proof: ${aadharCardUrl}`);
  if (qualificationCertUrl) docNotes.push(`Qualification Cert: ${qualificationCertUrl}`);

  const record = {
    id: 'shadow-' + randomId(),
    name: 'Test Shadow Teacher',
    dob: '1995-08-20',
    gender: 'Female',
    phone: '+91 9999888877',
    email: 'theshadowbridgesupport@gmail.com',
    city: 'Delhi NCR',
    address: 'Vasant Kunj, New Delhi',
    preferred_locations: 'South Delhi - Vasant Kunj & Saket',
    qualification: 'B.Ed. Special Education',
    specialization: 'Learning Disabilities',
    experience: '3-5 Years',
    certificates: 'RCI Registration No. A12345',
    special_needs_exp: 'Yes',
    comfortable_areas: 'Autism Spectrum (ASD)',
    other_comfortable: '',
    open_to_travel: 'Yes',
    preferred_work_type: 'Full-time',
    status: 'Interview Awaiting',
    aadhar_card_name: 'test_aadhar.pdf',
    qualification_cert_name: 'test_qual.pdf',
    experience_cert_name: '',
    profile_photo_name: '',
    registration_id: generatedId,
    created_at: createdAt,
    notes: docNotes.join(' | ')
  };

  const { data, error } = await supabase.from('shadow_teachers').insert([record]).select().single();

  if (error) {
    console.error('API Simulation Insert Error:', error);
  } else {
    console.log('API Simulation SUCCESS!');
    console.log('Registration ID:', data.registration_id);
    console.log('Doc URLs stored in notes:', data.notes);

    // Clean up
    await supabase.from('shadow_teachers').delete().eq('id', record.id);
    console.log('Cleaned up test record.');
  }
}

main();
