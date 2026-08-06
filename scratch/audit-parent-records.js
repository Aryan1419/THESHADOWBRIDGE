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

async function auditParentTables() {
  console.log('=== AUDITING PARENT REGISTRATIONS IN SUPABASE ===\n');

  // 1. Parent Shadow Requests
  const { data: parentShadow, error: err1 } = await supabase
    .from('parent_shadow_requests')
    .select('*');

  console.log(`1. PARENT SHADOW REQUESTS (${parentShadow ? parentShadow.length : 0} records):`);
  if (err1) console.error('   Error:', err1.message);
  else if (parentShadow) {
    parentShadow.forEach((r, idx) => {
      console.log(`   [${idx + 1}] ID: ${r.id} | RegID: ${r.registration_id} | Parent: ${r.parent_name} | Child: ${r.child_name} | Email: ${r.email} | Phone: ${r.phone} | Status: ${r.status} | Created: ${r.created_at}`);
    });
  }

  // 2. Parent Tutor Requests
  console.log('\n2. PARENT TUTOR REQUESTS:');
  const { data: parentTutor, error: err2 } = await supabase
    .from('parent_tutor_requests')
    .select('*');

  if (err2) console.error('   Error:', err2.message);
  else if (parentTutor) {
    console.log(`   (${parentTutor.length} records):`);
    parentTutor.forEach((r, idx) => {
      console.log(`   [${idx + 1}] ID: ${r.id} | RegID: ${r.registration_id} | Parent: ${r.parent_name} | Child: ${r.child_name} | Email: ${r.email} | Phone: ${r.phone} | Status: ${r.status} | Created: ${r.created_at}`);
    });
  }

  // 3. Bookings
  console.log('\n3. BOOKINGS TABLE:');
  const { data: bookings, error: err3 } = await supabase
    .from('bookings')
    .select('*');

  if (err3) console.error('   Error:', err3.message);
  else if (bookings) {
    console.log(`   (${bookings.length} records):`);
    bookings.forEach((r, idx) => {
      console.log(`   [${idx + 1}] ID: ${r.id} | BookingID: ${r.booking_id} | Name: ${r.name} | Requirement: ${r.requirement} | Email: ${r.email} | Phone: ${r.phone} | Created: ${r.created_at}`);
    });
  }
}

auditParentTables();
