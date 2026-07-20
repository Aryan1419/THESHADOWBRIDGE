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
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== DIAGNOSTIC START ===');
console.log('Supabase URL:', supabaseUrl);

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function runDiagnostics() {
  console.log('\n--- 1. Testing SELECT on contacts table ---');
  const selectRes = await supabaseAdmin.from('contacts').select('*');
  console.log('Select Result Error:', selectRes.error);
  console.log('Select Result Data:', selectRes.data);

  console.log('\n--- 2. Testing INSERT on contacts table ---');
  const testId = 'test-' + Date.now();
  const insertRes = await supabaseAdmin.from('contacts').insert([{
    id: testId,
    name: 'Diagnostic Tester',
    phone: '9999988888',
    email: 'diagnostic.test@example.com',
    city: 'Delhi NCR',
    message: 'Systematic verification message from automated script.',
    status: 'new',
    created_at: new Date().toISOString()
  }]).select();

  console.log('Insert Result Error:', insertRes.error);
  console.log('Insert Result Data:', insertRes.data);
}

runDiagnostics();
