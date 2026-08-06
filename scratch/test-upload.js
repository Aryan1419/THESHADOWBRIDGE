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
  console.log('=== Testing Supabase Storage Upload & Public URL ===');
  const dummyBuffer = Buffer.from('Dummy document content for testing');
  const fileName = `test-doc-${Date.now()}.txt`;
  
  const { data, error } = await supabase.storage.from('documents').upload(`shadow-teachers/${fileName}`, dummyBuffer, {
    contentType: 'text/plain',
    upsert: true
  });

  if (error) {
    console.error('Upload error:', error);
  } else {
    console.log('Upload success:', data);
    const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(`shadow-teachers/${fileName}`);
    console.log('Public URL:', publicUrlData.publicUrl);
  }
}

main();
