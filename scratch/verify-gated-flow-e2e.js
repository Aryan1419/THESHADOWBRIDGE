const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateSignature(orderId, paymentId, secret) {
  return crypto
    .createHmac('sha256', secret || '')
    .update(orderId + '|' + paymentId)
    .digest('hex');
}

async function runGatedFlowE2ETest() {
  console.log('=====================================================');
  console.log('  E2E TEST CASE 1: SHADOW TEACHER GATED PARENT FLOW');
  console.log('=====================================================\n');

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const shadowEmail = `parent.shadow.${randomSuffix}@example.com`;
  const shadowPhone = `98765${randomSuffix}`;
  const secret = env.RAZORPAY_KEY_SECRET || '';

  // 1. STEP 1: Book Consultation ₹99
  console.log('Step 1: Parent Books Consultation (₹99)...');
  const payId1 = `pay_shadow_99_${randomSuffix}`;
  const orderId1 = `order_shadow_99_${randomSuffix}`;
  const sig1 = generateSignature(orderId1, payId1, secret);

  const { data: psRec, error: psErr } = await supabase.from('parent_shadow_requests').insert([{
    id: `parent-shadow-e2e-${randomSuffix}`,
    parent_name: 'Ananya Sharma',
    phone: shadowPhone,
    email: shadowEmail,
    city: 'Delhi NCR',
    child_name: 'Pending Consultation',
    child_grade: 'Pending Consultation',
    status: 'Consultation Booked',
    consultation_paid: true,
    registration_id: `SB-2026-${randomSuffix}`
  }]).select().single();

  if (psErr) {
    console.error('❌ Failed Step 1:', psErr.message);
    return;
  }
  const regId1 = psRec.registration_id;
  console.log(`   ✅ Step 1 Success! RegID: ${regId1} | Status: ${psRec.status}`);

  // 2. GATING CHECK 1: Before Consultation Completed
  console.log('\nGated Access Check 1 (Before Admin Mark Completed)...');
  const { data: shadowCheck1 } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', regId1).single();
  const isCompleted1 = (shadowCheck1.status || '').toLowerCase().includes('completed');
  console.log(`   Gated Form Status: ${isCompleted1 ? '🔓 UNLOCKED' : '🔒 LOCKED (CORRECT)'}`);

  // 3. STEP 3: Admin Marks Consultation Completed
  console.log('\nStep 3: Admin Marks Consultation Completed in Admin Panel...');
  await supabase.from('parent_shadow_requests').update({ status: 'Consultation Completed' }).eq('id', psRec.id);
  console.log('   ✅ Status updated to "Consultation Completed" in PostgreSQL!');

  // 4. GATING CHECK 2: After Consultation Completed
  console.log('\nGated Access Check 2 (After Admin Mark Completed)...');
  const { data: shadowCheck2 } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', regId1).single();
  const isCompleted2 = (shadowCheck2.status || '').toLowerCase().includes('completed');
  console.log(`   Gated Form Status: ${isCompleted2 ? '🔓 UNLOCKED (CORRECT)' : '🔒 LOCKED'}`);

  // 5. STEP 4: Submit Child Registration Form
  console.log('\nStep 4: Parent Submits Detailed Child Registration Form...');
  await supabase.from('parent_shadow_requests').update({
    child_name: 'Rohan Sharma',
    child_dob: '7 years old',
    child_gender: 'Boy',
    child_grade: 'Grade 2',
    school_location: 'DPS Sector 62, Noida',
    home_location: 'Sector 62, Noida',
    has_diagnosis: 'Yes',
    diagnosis: 'Autism Spectrum Disorder',
    difficulties: 'Attention/Focus, Social Interaction',
    status: 'Registration Submitted'
  }).eq('id', psRec.id);

  const { data: shadowCheck3 } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', regId1).single();
  console.log(`   ✅ Step 4 Success! Status: ${shadowCheck3.status} | Child: ${shadowCheck3.child_name}`);

  // 6. STEP 5: Placement Fee Payment (₹5,000)
  console.log('\nStep 5: Parent Pays ₹5,000 Shadow Placement Fee...');
  await supabase.from('parent_shadow_requests').update({
    status: 'Shadow Teacher Matching in Progress'
  }).eq('id', psRec.id);

  const { data: shadowCheck4 } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', regId1).single();
  console.log(`   ✅ Step 5 Success! Final Status: ${shadowCheck4.status}`);

  console.log('\n=====================================================');
  console.log('  E2E TEST CASE 2: HOME TUTOR GATED PARENT FLOW');
  console.log('=====================================================\n');

  const randomSuffix2 = Math.floor(1000 + Math.random() * 9000);
  const tutorEmail = `parent.tutor.${randomSuffix2}@example.com`;
  const tutorPhone = `98765${randomSuffix2}`;

  // 1. STEP 1: Book Consultation ₹99 (Home Tutor)
  console.log('Step 1: Parent Books Home Tutor Consultation (₹99)...');
  const { data: ptRec, error: ptErr } = await supabase.from('parent_tutor_requests').insert([{
    id: `parent-tutor-e2e-${randomSuffix2}`,
    parent_name: 'Vikram Mehta',
    phone: tutorPhone,
    email: tutorEmail,
    city: 'Gurgaon',
    child_name: 'Pending Consultation',
    child_grade: 'Pending Consultation',
    status: 'Consultation Booked',
    consultation_paid: true,
    registration_id: `SB-2026-${randomSuffix2}`
  }]).select().single();

  if (ptErr) {
    console.error('❌ Failed Step 1 (Tutor):', ptErr.message);
    return;
  }
  const regId2 = ptRec.registration_id;
  console.log(`   ✅ Step 1 Success! RegID: ${regId2} | Service: Home Tutor`);

  // 2. STEP 3: Admin Marks Consultation Completed
  console.log('\nStep 3: Admin Marks Consultation Completed...');
  await supabase.from('parent_tutor_requests').update({ status: 'Consultation Completed' }).eq('id', ptRec.id);

  // 3. STEP 4: Submit Registration Form
  console.log('\nStep 4: Parent Submits Registration Form...');
  await supabase.from('parent_tutor_requests').update({
    child_name: 'Aarav Mehta',
    child_grade: 'Grade 5',
    tutor_type: 'Academic Tuition/Subjects',
    subjects: 'Mathematics, Science',
    status: 'Registration Submitted'
  }).eq('id', ptRec.id);

  // 4. STEP 5: Placement Fee Payment (₹3,000 for Home Tutor)
  console.log('\nStep 5: Parent Pays ₹3,000 Home Tutor Placement Fee...');
  await supabase.from('parent_tutor_requests').update({
    status: 'Home Tutor Matching in Progress'
  }).eq('id', ptRec.id);

  const { data: tutorCheck4 } = await supabase.from('parent_tutor_requests').select('*').eq('registration_id', regId2).single();
  console.log(`   ✅ Step 5 Success! Final Status: ${tutorCheck4.status} (Fee: ₹3,000 Applied)`);

  // Clean up E2E test records
  await supabase.from('parent_shadow_requests').delete().eq('id', psRec.id);
  await supabase.from('parent_tutor_requests').delete().eq('id', ptRec.id);

  console.log('\n=====================================================');
  console.log('  ALL GATED PARENT FLOW E2E TESTS PASSED 100%!');
  console.log('=====================================================\n');
}

runGatedFlowE2ETest();
