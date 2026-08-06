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
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.Supabase_key_ANON || env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('=== STEP 1: Updating Storage Bucket Policies (Allow All MIME Types) ===');
  
  // Make sure 'documents' bucket is public with no MIME restrictions
  const { data: bucket, error: bucketErr } = await supabaseAdmin.storage.updateBucket('documents', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: null // Allow all MIME types
  });

  if (bucketErr) {
    console.warn('Update bucket warning:', bucketErr.message);
  } else {
    console.log("Bucket 'documents' updated to public with 10MB limit and ALL MIME types allowed!");
  }

  // Test pdf upload
  console.log('\n=== STEP 2: Testing PDF File Upload (Simulating Candidate Registration) ===');
  const testFileName = `test_resume_${Date.now()}.pdf`;
  const dummyPdfBuffer = Buffer.from('%PDF-1.4 sample pdf document content');

  const { data: uploadData, error: uploadErr } = await supabaseAnon.storage
    .from('documents')
    .upload(`shadow-teachers/${testFileName}`, dummyPdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadErr) {
    console.error('❌ PDF upload failed:', uploadErr);
  } else {
    console.log('✅ PDF upload SUCCESS:', uploadData);
    const { data: pubData } = supabaseAnon.storage.from('documents').getPublicUrl(`shadow-teachers/${testFileName}`);
    console.log('Public URL:', pubData.publicUrl);

    // Clean up
    await supabaseAdmin.storage.from('documents').remove([`shadow-teachers/${testFileName}`]);
    console.log('Cleaned up test PDF upload.');
  }
}

main();
