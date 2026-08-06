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

async function setupBookingsColumns() {
  console.log('=== CHECKING AND ENSURING BOOKINGS COLUMNS IN SUPABASE ===\n');

  // Query existing columns
  const { data: sample, error } = await supabase.from('bookings').select('*').limit(1);
  if (error) {
    console.error('Error selecting from bookings:', error);
    return;
  }

  const existingRow = sample && sample[0] ? sample[0] : {};
  console.log('Existing columns on bookings table:', Object.keys(existingRow));

  // Check if status exists, if not update sample row or run column alter via RPC if enabled
  const hasStatus = 'status' in existingRow;
  const hasServiceType = 'service_type' in existingRow;
  const hasPlacementPaid = 'placement_paid' in existingRow;

  console.log(`Column check: status=${hasStatus}, service_type=${hasServiceType}, placement_paid=${hasPlacementPaid}`);
}

setupBookingsColumns();
