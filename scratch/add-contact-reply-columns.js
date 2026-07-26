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
  console.log('Testing select on contacts with admin_reply, replied_at...');
  const { data, error } = await supabase.from('contacts').select('id, name, admin_reply, replied_at').limit(1);
  
  if (error) {
    console.log('Columns check error:', error);
  } else {
    console.log('Columns check SUCCESS! Data sample:', data);
  }
}

main();
