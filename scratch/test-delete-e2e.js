const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== STEP 1: Inserting a temporary junk contact entry ===');
  const tempId = `junk-test-${Date.now()}`;
  const junkContact = {
    id: tempId,
    name: 'Diagnostic Tester (Junk)',
    phone: '+91 0000000000',
    email: 'junktest@example.com',
    city: 'Test City',
    message: 'This is a junk test message to test deletion.',
    status: 'new'
  };

  const { error: insertErr } = await supabase.from('contacts').insert(junkContact);
  if (insertErr) {
    console.error('Insert error:', insertErr);
    return;
  }
  console.log('Successfully inserted junk contact record:', tempId);

  console.log('\n=== STEP 2: Calling Backend delete_record Action ===');
  // Perform backend Supabase delete
  const { error: delErr } = await supabase.from('contacts').delete().eq('id', tempId);
  if (delErr) {
    console.error('Delete error:', delErr);
    return;
  }
  console.log('Supabase deletion completed with 0 errors.');

  console.log('\n=== STEP 3: Verifying row is gone from Supabase contacts table ===');
  const { data } = await supabase.from('contacts').select('*').eq('id', tempId).maybeSingle();
  console.log('Fetch deleted row result (should be null):', data);
}

main();
