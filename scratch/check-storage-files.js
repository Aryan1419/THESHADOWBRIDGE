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

async function searchBucket(bucketName, pathPrefix = '') {
  console.log(`\n--- Searching bucket '${bucketName}' (path: '${pathPrefix}') ---`);
  const { data, error } = await supabase.storage.from(bucketName).list(pathPrefix, { limit: 100 });
  if (error) {
    console.error(`Error listing '${bucketName}/${pathPrefix}':`, error.message);
    return;
  }
  console.log(`Found ${data.length} items:`);
  for (const item of data) {
    console.log(` - ${item.name} (${item.id ? 'File' : 'Folder'}, ${item.metadata ? item.metadata.size + ' bytes' : ''})`);
    if (!item.id) {
      // It's a subfolder, list subfolder
      await searchBucket(bucketName, pathPrefix ? `${pathPrefix}/${item.name}` : item.name);
    }
  }
}

async function main() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('List buckets error:', error);
    return;
  }
  console.log('Buckets:', buckets.map(b => b.name));

  for (const b of buckets) {
    await searchBucket(b.name);
  }
}

main();
