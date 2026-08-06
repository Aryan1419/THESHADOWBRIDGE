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
  console.log('=== STEP 1: Testing Shadow Teacher Registration API Submission ===');
  
  const testPayload = {
    type: 'shadow',
    name: 'Pratibha Mishra (Shadow Test)',
    phone: '+91 9876543210',
    email: 'theshadowbridgesupport@gmail.com',
    city: 'Delhi NCR',
    qualification: 'M.Ed. Special Education',
    experience: '5+ Years',
    skills: 'Autism Spectrum, ADHD, Behavior Management',
    dob: '1992-05-15',
    gender: 'Female',
    address: 'DLF Phase 4, Gurgaon',
    preferredLocations: 'Gurgaon - DLF Phase 1-5, South Delhi - Vasant Kunj & Saket',
    specialization: 'Special Needs Shadow Support',
    certificates: 'RCI Certified Special Educator',
    specialNeedsExp: 'Yes',
    openToTravel: 'Yes',
    preferredWorkType: 'Full-time',
    aadharCardName: 'aadhar_sample.pdf',
    qualificationCertName: 'med_degree.pdf',
    experienceCertName: 'experience_letter.pdf',
    profilePhotoName: 'photo.jpg',
    aadharCardUrl: 'https://oggzposjudhbpnasymzn.supabase.co/storage/v1/object/public/documents/shadow-teachers/sample_aadhar.pdf',
    qualificationCertUrl: 'https://oggzposjudhbpnasymzn.supabase.co/storage/v1/object/public/documents/shadow-teachers/sample_degree.pdf'
  };

  const randomNumericId = Math.floor(1000 + Math.random() * 9000).toString();
  const year = new Date().getFullYear();
  const generatedId = `TSB-${year}-${randomNumericId}`;

  // Build document links text for notes / certificates
  let docNotes = [];
  if (testPayload.aadharCardUrl) docNotes.push(`Aadhar ID: ${testPayload.aadharCardUrl}`);
  if (testPayload.qualificationCertUrl) docNotes.push(`Qualification Cert: ${testPayload.qualificationCertUrl}`);

  const record = {
    id: 'shadow-test-' + Date.now(),
    name: testPayload.name,
    dob: testPayload.dob,
    gender: testPayload.gender,
    phone: testPayload.phone,
    email: testPayload.email,
    city: testPayload.city,
    address: testPayload.address,
    preferred_locations: testPayload.preferredLocations,
    qualification: testPayload.qualification,
    specialization: testPayload.specialization,
    experience: testPayload.experience,
    certificates: testPayload.certificates,
    special_needs_exp: testPayload.specialNeedsExp,
    comfortable_areas: testPayload.skills,
    open_to_travel: testPayload.openToTravel,
    preferred_work_type: testPayload.preferredWorkType,
    status: 'Interview Awaiting',
    aadhar_card_name: testPayload.aadharCardName,
    qualification_cert_name: testPayload.qualificationCertName,
    experience_cert_name: testPayload.experienceCertName,
    profile_photo_name: testPayload.profilePhotoName,
    registration_id: generatedId,
    created_at: new Date().toISOString(),
    notes: docNotes.join(' | ')
  };

  console.log('Inserting test record into Supabase shadow_teachers table...');
  const { data, error } = await supabase.from('shadow_teachers').insert([record]).select().single();

  if (error) {
    console.error('Supabase Insert Error:', error);
  } else {
    console.log('SUCCESS! Registration ID generated:', data.registration_id);
    console.log('Record ID:', data.id);
    console.log('Stored Notes with Doc URLs:', data.notes);
  }

  // Clean up test entry
  console.log('\nCleaning up test record from Supabase...');
  await supabase.from('shadow_teachers').delete().eq('id', record.id);
  console.log('Cleaned up test record.');
}

main();
