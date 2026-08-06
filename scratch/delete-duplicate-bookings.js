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

async function deleteDuplicates() {
  console.log('=== DELETING SPECIFIED DUPLICATE TEST BOOKINGS ===\n');

  const bookingsToDelete = ['TSB-BK-2026-12335', 'TSB-BK-2026-26197'];

  for (const bId of bookingsToDelete) {
    const { data: found } = await supabase.from('bookings').select('*').eq('booking_id', bId).maybeSingle();
    if (found) {
      console.log(`Found ${bId} (${found.city}, ${found.name}). Deleting...`);
      const { error } = await supabase.from('bookings').delete().eq('id', found.id);
      if (error) {
        console.error(`❌ Delete error for ${bId}:`, error.message);
      } else {
        console.log(`✅ Successfully deleted ${bId}`);
      }
    } else {
      console.log(`Record ${bId} not found or already deleted.`);
    }
  }

  // Audit remaining bookings for Aryan Beltharia
  console.log('\n=== AUDITING REMAINING BOOKINGS IN SUPABASE ===');
  const { data: remaining, error: rErr } = await supabase
    .from('bookings')
    .select('*');

  if (remaining) {
    console.log(`Total remaining bookings: ${remaining.length}`);
    remaining.forEach((r, idx) => {
      console.log(` [${idx + 1}] BookingID: ${r.booking_id} | Name: ${r.name} | City: ${r.city} | Email: ${r.email} | Status: ${r.message || r.status || 'Consultation Booked'}`);
    });
  }
}

deleteDuplicates();
