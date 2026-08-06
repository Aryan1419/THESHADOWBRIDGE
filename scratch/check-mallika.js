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
  console.log("=== Inspecting Mallika Bhatt's Record in shadow_teachers ===");
  const { data: records, error } = await supabase
    .from('shadow_teachers')
    .select('*')
    .ilike('name', '%Mallika%');

  if (error) {
    console.error('Error fetching Mallika Bhatt:', error);
  } else {
    console.log(`Found ${records.length} record(s):`);
    console.log(JSON.stringify(records, null, 2));
  }
}

main();
