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

async function testUpdate() {
  console.log('=== TESTING SUPABASE CONTACTS UPDATE ===');

  const { data, error } = await supabase
    .from('contacts')
    .update({
      status: 'responded',
      admin_reply: 'Test response message from script',
      replied_at: new Date().toISOString()
    })
    .eq('id', 'contact-kr5mvk6')
    .select();

  if (error) {
    console.error('❌ Supabase Contacts Update Error:', error);
  } else {
    console.log('✅ Supabase Contacts Update SUCCESS:', data);
  }
}

testUpdate();
