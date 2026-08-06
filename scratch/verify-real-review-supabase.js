const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, serviceKey);

async function verifyRealReviewInSupabase() {
  console.log('=== VERIFYING REAL ROW CREATION IN SUPABASE REVIEWS TABLE ===\n');

  const testId = 'rev-real-test-' + Date.now();
  const payload = {
    id: testId,
    parent_registration_id: 'SB-2026-REAL-TEST',
    parent_name: 'Pratibha Mishra Real Verification',
    child_first_name: 'Aarav',
    rating: 5,
    review_text: 'This is a real test review to independently verify Supabase Table Editor row creation.',
    city: 'Delhi NCR',
    service_type: 'Shadow Teacher Support',
    status: 'pending',
    submitted_at: new Date().toISOString()
  };

  console.log('1. Inserting row into Supabase "reviews" table...');
  const { data: inserted, error: iErr } = await supabase.from('reviews').insert([payload]).select().single();

  if (iErr) {
    console.error('❌ Insert failed:', iErr.message);
    process.exit(1);
  }

  console.log('   ✅ Row created successfully in Supabase!');
  console.log('   Row Data in Supabase Table Editor:');
  console.log('   - ID:', inserted.id);
  console.log('   - parent_name:', inserted.parent_name);
  console.log('   - rating:', inserted.rating);
  console.log('   - status:', inserted.status);
  console.log('   - submitted_at:', inserted.submitted_at);

  console.log('\n2. Fetching inserted row directly from Supabase DB to confirm persistence...');
  const { data: fetched, error: fErr } = await supabase.from('reviews').select('*').eq('id', testId).single();

  if (fErr || !fetched) {
    console.error('❌ Row fetch failed:', fErr?.message);
    process.exit(1);
  }

  console.log('   ✅ Verified! Row exists in Supabase DB with ID:', fetched.id);

  // Clean up
  await supabase.from('reviews').delete().eq('id', testId);
  console.log('\n=== REAL SUPABASE ROW CREATION VERIFIED 100%! ===');
}

verifyRealReviewInSupabase();
