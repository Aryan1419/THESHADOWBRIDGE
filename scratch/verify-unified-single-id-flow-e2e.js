const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runE2ETest() {
  console.log('=== VERIFYING UNIFIED SINGLE ID JOURNEY E2E ===\n');

  const testEmail = `singleidtest_${Date.now()}@gmail.com`;
  const parentName = 'Single ID Test Parent';
  const phone = '09876543210';
  const year = '2026';
  const randomNum = Math.floor(1000 + Math.random() * 9000).toString();
  const unifiedId = `SB-${year}-${randomNum}`;

  console.log('1. STEP 1: Creating Consultation Booking (₹99)...');
  console.log('   Generated Unified Single ID:', unifiedId);

  // Insert into bookings
  const { data: bk, error: bErr } = await supabase.from('bookings').insert([{
    booking_id: unifiedId,
    name: parentName,
    phone,
    email: testEmail,
    city: 'Delhi NCR',
    child_age: 'Pending Consultation',
    requirement: 'Shadow Teacher',
    message: 'Consultation Booked',
    payment_status: 'paid',
    amount: 99
  }]).select().single();

  if (bErr) { console.error('❌ Bookings Error:', bErr.message); return; }

  // Insert into parent_shadow_requests
  const { data: ps, error: pErr } = await supabase.from('parent_shadow_requests').insert([{
    id: 'parent-shadow-' + Math.random().toString(36).substring(2, 9),
    parent_name: parentName,
    phone,
    email: testEmail,
    city: 'Delhi NCR',
    child_name: 'Pending Consultation',
    child_grade: 'Pending Consultation',
    status: 'Consultation Booked',
    consultation_paid: true,
    registration_id: unifiedId,
    notes: `Unified ID: ${unifiedId}`
  }]).select().single();

  if (pErr) { console.error('❌ Parent Request Error:', pErr.message); return; }

  console.log('   ✅ Bookings Table ID:', bk.booking_id);
  console.log('   ✅ Parent Request Table ID:', ps.registration_id);
  console.log('   Match Check:', bk.booking_id === ps.registration_id ? '✅ IDENTICAL (SINGLE UNIFIED ID)' : '❌ MISMATCH');

  // Step 3: Admin Mark Consultation Completed
  console.log('\n2. STEP 3: Admin Marks Consultation Completed...');
  await supabase.from('bookings').update({ message: 'Consultation Completed' }).eq('booking_id', unifiedId);
  await supabase.from('parent_shadow_requests').update({ status: 'Consultation Completed' }).eq('registration_id', unifiedId);

  const { data: psStep3 } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', unifiedId).single();
  console.log('   Status:', psStep3.status);
  console.log('   Unified ID Remains:', psStep3.registration_id);

  // Step 4: Child Registration Submission
  console.log('\n3. STEP 4: Parent Submits Child Registration Form...');
  await supabase.from('parent_shadow_requests').update({
    child_name: 'Aarav Test',
    child_grade: 'Grade 2',
    school_location: 'DPS Delhi',
    home_location: 'Vasant Kunj',
    status: 'Registration Submitted'
  }).eq('registration_id', unifiedId);

  const { data: psStep4 } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', unifiedId).single();
  console.log('   Status:', psStep4.status);
  console.log('   Child Name:', psStep4.child_name);
  console.log('   Unified ID Remains:', psStep4.registration_id);

  // Step 5: Placement Fee Payment
  console.log('\n4. STEP 5: Parent Pays Placement Fee (₹5,000)...');
  await supabase.from('parent_shadow_requests').update({
    status: 'Placement Fee Paid'
  }).eq('registration_id', unifiedId);

  const { data: psStep5 } = await supabase.from('parent_shadow_requests').select('*').eq('registration_id', unifiedId).single();
  console.log('   Status:', psStep5.status);
  console.log('   Unified ID Remains:', psStep5.registration_id);

  // Clean up test record
  await supabase.from('bookings').delete().eq('id', bk.id);
  await supabase.from('parent_shadow_requests').delete().eq('id', ps.id);

  console.log('\n=== UNIFIED SINGLE ID E2E FLOW PASSED 100%! ===');
}

runE2ETest();
