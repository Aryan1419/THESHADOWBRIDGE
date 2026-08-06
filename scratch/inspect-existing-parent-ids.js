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

async function inspectRecords() {
  console.log('=== INSPECTING EXISTING PARENT RECORDS & IDS ===\n');

  const { data: bk } = await supabase.from('bookings').select('*');
  console.log(`1. BOOKINGS TABLE (${bk?.length || 0} records):`);
  bk?.forEach(b => console.log(`   - ID: ${b.id} | Booking ID: ${b.booking_id} | Name: ${b.name} | Email: ${b.email} | Status: ${b.message}`));

  const { data: ps } = await supabase.from('parent_shadow_requests').select('*');
  console.log(`\n2. PARENT SHADOW REQUESTS TABLE (${ps?.length || 0} records):`);
  ps?.forEach(p => console.log(`   - ID: ${p.id} | Reg ID: ${p.registration_id} | Name: ${p.parent_name} | Email: ${p.email} | Notes: ${p.notes}`));

  const { data: pt } = await supabase.from('parent_tutor_requests').select('*');
  console.log(`\n3. PARENT TUTOR REQUESTS TABLE (${pt?.length || 0} records):`);
  pt?.forEach(p => console.log(`   - ID: ${p.id} | Reg ID: ${p.registration_id} | Name: ${p.parent_name} | Email: ${p.email} | Notes: ${p.notes}`));
}

inspectRecords();
