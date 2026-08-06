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
  console.log('=== Checking shadow_teachers columns ===');
  
  // Test insert without terms_accepted_at first
  const testId = 'shadow-col-test-' + Date.now();
  const testRecord = {
    id: testId,
    name: 'Col Test',
    phone: '1234567890',
    email: 'test@example.com',
    city: 'Delhi NCR',
    qualification: 'B.Ed',
    experience: '1 year',
    registration_id: 'TSB-TEST-' + Math.floor(Math.random() * 1000)
  };

  const { data, error } = await supabase.from('shadow_teachers').insert([testRecord]).select().single();
  if (error) {
    console.error('Basic Insert Error:', error);
  } else {
    console.log('Basic Insert Succeeded! Available columns on returned row:');
    console.log(Object.keys(data));
    await supabase.from('shadow_teachers').delete().eq('id', testId);
  }
}

main();
