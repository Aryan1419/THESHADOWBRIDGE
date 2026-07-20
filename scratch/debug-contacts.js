const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('\n=== STEP 1: Querying Supabase contacts table ===');
  const res = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
  
  if (res.error) {
    console.log('Supabase Error:', res.error);
  } else {
    console.log(`Found ${res.data.length} rows in contacts table:`);
    console.log(JSON.stringify(res.data, null, 2));
  }

  console.log('\n=== STEP 2: Checking local data/db.json contacts array ===');
  try {
    const dbFile = fs.readFileSync(path.join(__dirname, '../data/db.json'), 'utf8');
    const db = JSON.parse(dbFile);
    console.log(`Found ${db.contacts ? db.contacts.length : 0} contacts in local db.json:`);
    console.log(JSON.stringify(db.contacts || [], null, 2));
  } catch (err) {
    console.error('Error reading local db.json:', err.message);
  }
}

main();
