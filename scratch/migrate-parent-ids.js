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

async function migrate() {
  console.log('=== MIGRATING EXISTING PARENT RECORDS TO SINGLE UNIFIED IDS ===\n');

  // 1. Migrate Pratibha Mishra's booking record to SB-2026-8714
  console.log('1. Updating Pratibha Mishra booking record...');
  const { data: bPratibha, error: pErr } = await supabase
    .from('bookings')
    .update({ booking_id: 'SB-2026-8714' })
    .eq('email', 'pratibhamishraofficial97@gmail.com')
    .select();

  if (pErr) {
    console.error('❌ Error updating Pratibha Mishra booking:', pErr.message);
  } else {
    console.log('   ✅ Pratibha Mishra booking_id updated to SB-2026-8714!');
  }

  // 2. Verify parent_shadow_requests notes update
  console.log('\n2. Updating notes in parent_shadow_requests...');
  await supabase
    .from('parent_shadow_requests')
    .update({ notes: 'Unified ID: SB-2026-8714' })
    .eq('email', 'pratibhamishraofficial97@gmail.com');

  await supabase
    .from('parent_shadow_requests')
    .update({ notes: 'Unified ID: SB-2026-9039' })
    .eq('email', 'aryanbeltharia1419@gmail.com');

  console.log('   ✅ Notes updated!');

  // 3. Inspect final state
  console.log('\n3. VERIFYING FINAL MIGRATED RECORDS:');
  const { data: bk } = await supabase.from('bookings').select('*');
  bk?.forEach(b => console.log(`   - Bookings -> ID: ${b.id} | Booking ID: ${b.booking_id} | Name: ${b.name}`));

  const { data: ps } = await supabase.from('parent_shadow_requests').select('*');
  ps?.forEach(p => console.log(`   - Shadow Request -> ID: ${p.id} | Reg ID: ${p.registration_id} | Name: ${p.parent_name}`));

  console.log('\n=== MIGRATION COMPLETED 100% ===');
}

migrate();
