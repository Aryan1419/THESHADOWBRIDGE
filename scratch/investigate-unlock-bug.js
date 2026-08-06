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
  console.log('=== INVESTIGATING SUPABASE RECORDS & UNLOCK BUG ===\n');

  // 1. Check bookings table
  const { data: bk } = await supabase
    .from('bookings')
    .select('*')
    .or('booking_id.eq.TSB-BK-2026-61102,email.eq.aryanbeltharia1419@gmail.com');

  console.log('1. BOOKINGS TABLE RECORDS:');
  console.log(JSON.stringify(bk, null, 2));

  // 2. Check parent_shadow_requests table
  const { data: ps } = await supabase
    .from('parent_shadow_requests')
    .select('*')
    .or('registration_id.ilike.%61102%,email.eq.aryanbeltharia1419@gmail.com,phone.ilike.%6396309989%');

  console.log('\n2. PARENT SHADOW REQUESTS RECORDS:');
  console.log(JSON.stringify(ps, null, 2));

  // 3. Check parent_tutor_requests table
  const { data: pt } = await supabase
    .from('parent_tutor_requests')
    .select('*')
    .or('registration_id.ilike.%61102%,email.eq.aryanbeltharia1419@gmail.com,phone.ilike.%6396309989%');

  console.log('\n3. PARENT TUTOR REQUESTS RECORDS:');
  console.log(JSON.stringify(pt, null, 2));
}

investigate();
