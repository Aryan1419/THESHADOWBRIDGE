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

async function main() {
  console.log('=== AUDITING CONTACTS TABLE IN SUPABASE ===\n');

  const { data: contacts, error } = await supabase.from('contacts').select('*');

  if (error) {
    console.error('❌ Error fetching contacts:', error);
    return;
  }

  console.log(`Found ${contacts.length} records in 'contacts' table:`);
  contacts.forEach((c, idx) => {
    console.log(`\nRecord #${idx + 1}:`);
    console.log(`  ID: "${c.id}"`);
    console.log(`  Name: "${c.name}"`);
    console.log(`  Email: "${c.email}"`);
    console.log(`  Status: "${c.status}"`);
    console.log(`  Admin Reply: "${c.admin_reply || ''}"`);
    console.log(`  Replied At: "${c.replied_at || ''}"`);
  });
}

main();
