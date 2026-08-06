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
  console.log('=== Checking Supabase Storage Buckets ===');
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  if (bucketErr) {
    console.error('List buckets error:', bucketErr);
  } else {
    console.log('Existing buckets:', buckets.map(b => b.name));
  }

  // Ensure 'documents' bucket exists or create it
  const bucketName = 'documents';
  const hasDocumentsBucket = buckets && buckets.some(b => b.name === bucketName);
  if (!hasDocumentsBucket) {
    console.log(`Bucket '${bucketName}' not found. Attempting to create it...`);
    const { data: newBucket, error: createErr } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    });
    if (createErr) {
      console.error('Create bucket error:', createErr);
    } else {
      console.log(`Bucket '${bucketName}' created successfully:`, newBucket);
    }
  }
}

main();
