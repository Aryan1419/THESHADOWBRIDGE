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
  console.log('SQL to run in Supabase SQL Editor if needed:');
  console.log('ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS admin_reply TEXT;');
  console.log('ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;\n');

  // Let's test if we can update a row or if we get column error
  const { data: selectSample } = await supabase.from('contacts').select('id').limit(1);
  if (selectSample && selectSample.length > 0) {
    const testId = selectSample[0].id;
    const { error } = await supabase.from('contacts').update({
      admin_reply: null
    }).eq('id', testId);

    console.log('Update test result:', error ? error.message : 'Columns already exist!');
  }
}

main();
