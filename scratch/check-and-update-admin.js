const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

const NEW_PASSWORD = 'ShadowBridge@2026';

async function main() {
  console.log('\n=== STEP A: Checking admin_users table in Supabase ===');
  const { data: users, error: fetchErr } = await supabase.from('admin_users').select('*');
  
  if (fetchErr) {
    console.error('Fetch admin_users Error:', fetchErr);
  } else {
    console.log('Current rows in admin_users table:', JSON.stringify(users, null, 2));
  }

  console.log('\n=== STEP B: Generating bcrypt hash for new password ===');
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(NEW_PASSWORD, salt);
  console.log('New Password:', NEW_PASSWORD);
  console.log('Bcrypt Hash:', hash);

  console.log('\n=== STEP C: Updating admin_users table in Supabase ===');
  
  // Upsert Pratibha account
  const { error: upsertErr1 } = await supabase.from('admin_users').upsert({
    id: 'admin-1',
    email: 'pratibha@theshadowbridge.com',
    password: hash,
    role: 'admin'
  }, { onConflict: 'email' });

  if (upsertErr1) {
    console.error('Upsert pratibha Error:', upsertErr1);
  } else {
    console.log('Successfully updated pratibha@theshadowbridge.com with bcrypt hash!');
  }

  // Upsert Support account
  const { error: upsertErr2 } = await supabase.from('admin_users').upsert({
    id: 'admin-2',
    email: 'theshadowbridgesupport@gmail.com',
    password: hash,
    role: 'admin'
  }, { onConflict: 'email' });

  if (upsertErr2) {
    console.error('Upsert support Error:', upsertErr2);
  } else {
    console.log('Successfully updated theshadowbridgesupport@gmail.com with bcrypt hash!');
  }

  console.log('\n=== STEP D: Verifying updated records in Supabase ===');
  const { data: updatedUsers } = await supabase.from('admin_users').select('*');
  console.log('Updated rows in admin_users table:', JSON.stringify(updatedUsers, null, 2));
}

main();
