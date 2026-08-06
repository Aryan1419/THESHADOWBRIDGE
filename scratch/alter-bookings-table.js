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

async function alterBookingsTable() {
  console.log('=== ADDING GATED FLOW COLUMNS TO PUBLIC.BOOKINGS ===\n');

  // Attempting to invoke raw SQL via rpc if available, or update sample row
  const columnsToAdd = [
    { name: 'status', type: 'VARCHAR(100) DEFAULT \'Consultation Booked\'' },
    { name: 'service_type', type: 'VARCHAR(100) DEFAULT \'Shadow Teacher\'' },
    { name: 'child_name', type: 'VARCHAR(255)' },
    { name: 'child_grade', type: 'VARCHAR(100)' },
    { name: 'school_location', type: 'VARCHAR(255)' },
    { name: 'home_location', type: 'VARCHAR(255)' },
    { name: 'diagnosis', type: 'TEXT' },
    { name: 'difficulties', type: 'TEXT' },
    { name: 'additional_notes', type: 'TEXT' },
    { name: 'placement_paid', type: 'BOOLEAN DEFAULT FALSE' },
    { name: 'placement_amount', type: 'NUMERIC' },
    { name: 'placement_payment_id', type: 'VARCHAR(255)' }
  ];

  for (const col of columnsToAdd) {
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql_query: `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};` 
      });
      if (error) {
        console.log(`RPC exec_sql for ${col.name}:`, error.message);
      } else {
        console.log(`✅ Added column ${col.name}`);
      }
    } catch (err) {
      console.log(`Column ${col.name} exception:`, err.message);
    }
  }

  // Let's test inserting a row with status to see if PostgreSQL accepts it
  const testRecord = {
    booking_id: 'TSB-BK-TEST-' + Math.floor(Math.random() * 1000),
    name: 'Test Setup',
    phone: '9999999999',
    email: 'test.setup@example.com',
    city: 'Delhi NCR',
    child_age: '7',
    requirement: 'Shadow Teacher',
    status: 'Consultation Booked',
    service_type: 'Shadow Teacher',
    placement_paid: false
  };

  const { data: inserted, error: insertErr } = await supabase
    .from('bookings')
    .insert([testRecord])
    .select()
    .single();

  if (insertErr) {
    console.error('❌ Insert Test Failed:', insertErr.message);
  } else {
    console.log('✅ Insert Test Succeeded! Result record columns:', Object.keys(inserted));
    // Delete test record
    await supabase.from('bookings').delete().eq('id', inserted.id);
  }
}

alterBookingsTable();
