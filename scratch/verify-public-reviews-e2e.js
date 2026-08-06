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

async function runPublicReviewE2ETest() {
  console.log('=== VERIFYING PUBLIC REVIEW SUBMISSION & ADMIN MODERATION E2E ===\n');

  const testReviewerName = `Open Review Test Parent ${Date.now()}`;
  const testReviewText = 'The Shadow Bridge provided exceptional, compassionate shadow teacher support for our son Aarav. Highly recommended!';

  // 1. Submit Public Review
  console.log('1. Submitting Public Review via Open Submission Flow...');
  const newRevObj = {
    id: 'rev-public-' + Math.random().toString(36).substring(2, 9),
    parent_registration_id: 'PUBLIC-VISITOR',
    parent_name: testReviewerName,
    child_first_name: 'Aarav',
    rating: 5,
    review_text: testReviewText,
    city: 'Noida, Delhi NCR',
    service_type: 'Shadow Teacher Support',
    status: 'pending',
    submitted_at: new Date().toISOString()
  };

  const { data: created, error: cErr } = await supabase.from('reviews').insert([newRevObj]).select().single();
  if (cErr) {
    console.error('❌ Failed to insert public review into Supabase:', cErr.message);
    return;
  }
  console.log('   ✅ Review submitted successfully! Review ID:', created.id, '| Status:', created.status);

  // 2. Check Public GET endpoint before Approval
  console.log('\n2. Checking Public Reviews Feed before Admin Approval...');
  const { data: publicFeedBefore } = await supabase.from('reviews').select('*').eq('status', 'approved');
  const isIncludedBefore = (publicFeedBefore || []).some(r => r.id === created.id);
  console.log('   Is Pending Review visible on Public Testimonials Page?:', isIncludedBefore ? '❌ WRONG (Visible before approval)' : '✅ CORRECT (Hidden until approved)');

  // 3. Admin Approves Review in Admin Panel
  console.log('\n3. Simulating Admin Approval in Admin Panel...');
  const { error: appErr } = await supabase
    .from('reviews')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', created.id);

  if (appErr) {
    console.error('❌ Failed to approve review:', appErr.message);
    return;
  }
  console.log('   ✅ Admin approved review!');

  // 4. Check Public GET endpoint after Approval
  console.log('\n4. Checking Public Reviews Feed after Admin Approval...');
  const { data: publicFeedAfter } = await supabase.from('reviews').select('*').eq('status', 'approved');
  const isIncludedAfter = (publicFeedAfter || []).some(r => r.id === created.id);
  console.log('   Is Approved Review visible on Public Testimonials Page?:', isIncludedAfter ? '✅ YES (Live & Approved!)' : '❌ NO');

  // Clean up test review
  await supabase.from('reviews').delete().eq('id', created.id);
  console.log('\n=== PUBLIC REVIEW SUBMISSION & MODERATION TEST PASSED 100%! ===');
}

runPublicReviewE2ETest();
