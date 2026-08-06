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

async function testColumnError() {
  console.log('=== TESTING UPDATE WITH SUGGESTED_MATCH_ID ON SHADOW_TEACHERS ===\n');

  const { data, error } = await supabase
    .from('shadow_teachers')
    .update({
      status: 'Shortlisted',
      notes: 'Test note',
      suggested_match_id: ''
    })
    .eq('id', 'shadow-g7g98ur')
    .select();

  if (error) {
    console.error('❌ EXACT SUPABASE ERROR THROWN:', error);
  } else {
    console.log('Update result:', data);
  }
}

testColumnError();
