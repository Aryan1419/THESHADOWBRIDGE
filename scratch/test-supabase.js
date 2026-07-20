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

console.log('Connecting to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('\n--- Checking contacts table ---');
  const contactsRes = await supabase.from('contacts').select('*');
  console.log('Contacts Error:', contactsRes.error);
  console.log('Contacts Data count:', contactsRes.data ? contactsRes.data.length : null);

  console.log('\n--- Checking reviews table ---');
  const reviewsRes = await supabase.from('reviews').select('*');
  console.log('Reviews Error:', reviewsRes.error);
  console.log('Reviews Data count:', reviewsRes.data ? reviewsRes.data.length : null);

  console.log('\n--- Checking parent_shadow_requests table ---');
  const parentRes = await supabase.from('parent_shadow_requests').select('id, parent_name, registration_id').limit(2);
  console.log('Parent shadow requests Error:', parentRes.error);
  console.log('Parent shadow requests Data:', parentRes.data);
}

main();
