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

async function investigate() {
  console.log('=== INVESTIGATING CONSULTATION PAID STATUS ACROSS TABLES ===\n');

  const { data: ps } = await supabase.from('parent_shadow_requests').select('*');
  console.log('1. PARENT SHADOW REQUESTS:');
  ps?.forEach(p => console.log(`   - Reg ID: ${p.registration_id} | Name: ${p.parent_name} | consultation_paid: ${p.consultation_paid} (${typeof p.consultation_paid}) | Status: ${p.status}`));

  const { data: pt } = await supabase.from('parent_tutor_requests').select('*');
  console.log('\n2. PARENT TUTOR REQUESTS:');
  pt?.forEach(p => console.log(`   - Reg ID: ${p.registration_id} | Name: ${p.parent_name} | consultation_paid: ${p.consultation_paid} (${typeof p.consultation_paid}) | Status: ${p.status}`));

  const { data: bk } = await supabase.from('bookings').select('*');
  console.log('\n3. BOOKINGS TABLE:');
  bk?.forEach(b => console.log(`   - Booking ID: ${b.booking_id} | Name: ${b.name} | payment_status: ${b.payment_status} | amount: ${b.amount}`));
}

investigate();
