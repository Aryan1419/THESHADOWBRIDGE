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

async function retestUnlockFlow() {
  console.log('=== RETESTING REGISTRATION UNLOCK FLOW FOR ARYAN BELTHARIA ===\n');

  // Test Lookup by Booking ID TSB-BK-2026-61102
  console.log('1. Lookup by Booking ID: TSB-BK-2026-61102...');
  const { data: bk1 } = await supabase.from('bookings').select('*').eq('booking_id', 'TSB-BK-2026-61102').maybeSingle();
  if (bk1) {
    const isCompleted = (bk1.message || bk1.status || '').toLowerCase().includes('completed');
    console.log('   Booking Record Found:', bk1.name, '(', bk1.city, ')');
    console.log('   Message/Status:', bk1.message || bk1.status);
    console.log('   Unlock Status:', isCompleted ? '🔓 UNLOCKED (Consultation Completed)' : '🔒 LOCKED');
  }

  // Test Lookup by Email
  console.log('\n2. Lookup by Email: aryanbeltharia1419@gmail.com...');
  const { data: bkList } = await supabase.from('bookings').select('*').eq('email', 'aryanbeltharia1419@gmail.com');
  console.log(`   Matches found for aryanbeltharia1419@gmail.com: ${bkList ? bkList.length : 0}`);
  if (bkList && bkList.length === 1) {
    console.log('   ✅ UNAMBIGUOUS SINGLE MATCH CONFIRMED!');
    console.log('   Matched Booking ID:', bkList[0].booking_id);
    console.log('   Matched City:', bkList[0].city);
    console.log('   Status:', bkList[0].message);
  }

  console.log('\n=== RETEST UNLOCK FLOW VERIFICATION COMPLETED ===');
}

retestUnlockFlow();
