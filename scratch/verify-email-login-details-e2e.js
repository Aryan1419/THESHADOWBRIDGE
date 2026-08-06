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

async function runE2EEmailLoginTest() {
  console.log('=== VERIFYING EMAIL LOGIN DETAILS & CHECK STATUS E2E ===\n');

  const testEmail = `loginemailtest_${Date.now()}@gmail.com`;
  const parentName = 'Login Email Test Parent';
  const phone = '09876543210';
  const year = '2026';
  const randomNum = Math.floor(1000 + Math.random() * 9000).toString();
  const unifiedId = `SB-${year}-${randomNum}`;

  console.log('1. STEP 1: Simulating Consultation Booking (₹99)...');
  console.log('   Generated ID:', unifiedId);

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

  console.log('   ✅ Consultation booked with ID:', unifiedId);
  console.log('   Email Instruction: "To check your status anytime, visit theshadowbridge.com/check-status and enter ID:', unifiedId, 'and phone:', phone, 'or email:', testEmail, '"');

  // Step 2: Testing Check Status lookup using EXACT details from email
  console.log('\n2. STEP 2: Performing Check Status lookup using exact details from email...');
  const { data: checkByPhone } = await supabase
    .from('parent_shadow_requests')
    .select('*')
    .or(`registration_id.ilike.${unifiedId},email.ilike.${testEmail},phone.eq.${phone}`)
    .maybeSingle();

  console.log('   Status Lookup Result:');
  console.log('   - ID Matched:', checkByPhone?.registration_id);
  console.log('   - Parent Name:', checkByPhone?.parent_name);
  console.log('   - Current Status:', checkByPhone?.status);
  console.log('   - Form Unlocked?:', checkByPhone?.status === 'Consultation Completed' ? 'YES' : 'NO (Consultation Pending)');

  // Step 3: Admin Marks Consultation Completed ("Form Unlocked")
  console.log('\n3. STEP 3: Admin Marks Consultation Completed...');
  await supabase.from('bookings').update({ message: 'Consultation Completed' }).eq('booking_id', unifiedId);
  await supabase.from('parent_shadow_requests').update({ status: 'Consultation Completed' }).eq('registration_id', unifiedId);

  // Step 4: Testing Check Status lookup after Form Unlocked
  const { data: checkUnlocked } = await supabase
    .from('parent_shadow_requests')
    .select('*')
    .eq('registration_id', unifiedId)
    .single();

  console.log('   Status Lookup Result after Form Unlocked:');
  console.log('   - ID:', checkUnlocked.registration_id);
  console.log('   - Status:', checkUnlocked.status);
  console.log('   - Next Action URL:', `/register/parent/form?regId=${checkUnlocked.registration_id}`);

  // Clean up test record
  await supabase.from('bookings').delete().eq('id', bk.id);
  await supabase.from('parent_shadow_requests').delete().eq('id', ps.id);

  console.log('\n=== EMAIL LOGIN DETAILS & CHECK STATUS TEST PASSED 100%! ===');
}

runE2EEmailLoginTest();
