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

async function testUnifiedRecord() {
  console.log('=== TESTING UNIFIED RECORD INSERT ACROSS BOOKINGS & PARENT REQUESTS ===\n');

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `TSB-BK-2026-${randomNum}`;
  const regId = `SB-2026-${randomNum}`;

  // 1. Insert into bookings
  const bookingRecord = {
    booking_id: bookingId,
    name: 'Test Parent',
    phone: '9876543210',
    email: 'testparent@example.com',
    city: 'Delhi NCR',
    child_age: 'Not specified yet',
    requirement: 'Shadow Teacher',
    message: JSON.stringify({
      flowStatus: 'Consultation Booked',
      serviceType: 'Shadow Teacher',
      regId: regId
    }),
    payment_status: 'paid',
    amount: 99,
    razorpay_payment_id: 'pay_test_99'
  };

  const { data: bData, error: bErr } = await supabase.from('bookings').insert([bookingRecord]).select().single();
  if (bErr) {
    console.error('❌ Bookings Insert Error:', bErr.message);
    return;
  }
  console.log('✅ Bookings Record Inserted:', bData.booking_id);

  // 2. Insert into parent_shadow_requests
  const shadowReqRecord = {
    id: 'parent-shadow-' + Math.random().toString(36).substring(2, 9),
    parent_name: 'Test Parent',
    relationship: 'Mother',
    phone: '9876543210',
    email: 'testparent@example.com',
    child_name: 'Pending Consultation',
    child_dob: '',
    child_gender: 'Boy',
    child_grade: 'Pending Consultation',
    city: 'Delhi NCR',
    status: 'Consultation Booked',
    consultation_paid: true,
    registration_id: regId,
    notes: `Linked Booking ID: ${bookingId}`
  };

  const { data: sData, error: sErr } = await supabase.from('parent_shadow_requests').insert([shadowReqRecord]).select().single();
  if (sErr) {
    console.error('❌ Parent Shadow Request Insert Error:', sErr.message);
  } else {
    console.log('✅ Parent Shadow Request Inserted:', sData.registration_id);
  }

  // Cleanup test data
  if (bData) await supabase.from('bookings').delete().eq('id', bData.id);
  if (sData) await supabase.from('parent_shadow_requests').delete().eq('id', sData.id);
}

testUnifiedRecord();
