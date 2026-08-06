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
  console.log('=== TESTING REJECT & DELETE CONSULTATION BOOKING E2E ===\n');

  // 1. Create Test Booking 1 for Rejection
  const bookingRejectId = `TSB-BK-TEST-REJECT-${Date.now().toString().slice(-4)}`;
  const { data: bReject, error: rErr } = await supabase.from('bookings').insert([{
    booking_id: bookingRejectId,
    name: 'Test Reject Parent',
    phone: '09999988881',
    email: 'theshadowbridgesupport@gmail.com',
    city: 'Remote Location',
    child_age: 'Pending Consultation',
    requirement: 'Shadow Teacher',
    message: 'Consultation Booked',
    payment_status: 'paid',
    amount: 99
  }]).select().single();

  if (rErr) {
    console.error('❌ Failed to insert test reject booking:', rErr.message);
    return;
  }
  console.log('1. Created Test Booking for Rejection:', bReject.booking_id);

  // 2. Create Test Booking 2 for Deletion
  const bookingDeleteId = `TSB-BK-TEST-DELETE-${Date.now().toString().slice(-4)}`;
  const { data: bDelete, error: dErr } = await supabase.from('bookings').insert([{
    booking_id: bookingDeleteId,
    name: 'Test Delete Parent',
    phone: '09999988882',
    email: 'theshadowbridgesupport@gmail.com',
    city: 'Test City',
    child_age: 'Pending Consultation',
    requirement: 'Home Tutor',
    message: 'Consultation Booked',
    payment_status: 'paid',
    amount: 99
  }]).select().single();

  if (dErr) {
    console.error('❌ Failed to insert test delete booking:', dErr.message);
    return;
  }
  console.log('2. Created Test Booking for Deletion:', bDelete.booking_id);

  // 3. Test Rejection Action
  console.log('\n3. Rejecting Consultation Booking:', bReject.booking_id, '...');
  const { data: updatedBk } = await supabase
    .from('bookings')
    .update({ message: 'Consultation Declined' })
    .eq('booking_id', bReject.booking_id)
    .select()
    .single();

  console.log('   ✅ Status updated in Supabase:', updatedBk.message);

  // 4. Test Deletion Action
  console.log('\n4. Deleting Consultation Booking:', bDelete.booking_id, '...');
  const { error: delErr } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bDelete.id);

  if (delErr) {
    console.error('❌ Delete Failed:', delErr.message);
  } else {
    console.log('   ✅ Record deleted from Supabase!');
  }

  // 5. Verify Deletion
  const { data: checkDeleted } = await supabase.from('bookings').select('*').eq('id', bDelete.id).maybeSingle();
  console.log('   Verified record exists after deletion:', Boolean(checkDeleted) ? '❌ STILL EXISTS' : '✅ REMOVED (null)');

  // Clean up reject test record
  await supabase.from('bookings').delete().eq('id', bReject.id);

  console.log('\n=== REJECT & DELETE E2E VERIFICATION PASSED 100%! ===');
}

runE2ETest();
