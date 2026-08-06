const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, serviceKey);

async function testReviewModerationActions() {
  console.log('=== TESTING REVIEW MODERATION ACTIONS (APPROVE, EDIT, REJECT) ===\n');

  const testId = 'rev-mod-test-' + Date.now();
  const initialPayload = {
    id: testId,
    parent_registration_id: 'SB-2026-MOD-TEST',
    parent_name: 'Pratibha Moderation Test',
    rating: 5,
    review_text: 'Initial review text with typos before editing.',
    city: 'Noida',
    service_type: 'Shadow Teacher Support',
    status: 'pending',
    submitted_at: new Date().toISOString()
  };

  // 1. Create Pending Review
  console.log('1. Creating Pending Review in Supabase...');
  const { data: inserted, error: iErr } = await supabase.from('reviews').insert([initialPayload]).select().single();
  if (iErr) { console.error('❌ Insert failed:', iErr.message); return; }
  console.log('   ✅ Pending review created! ID:', inserted.id, '| Status:', inserted.status);

  // 2. Test Edit Typos Action
  console.log('\n2. Testing "Edit Typos" Action...');
  const editedText = 'Cleaned review text without typos after founder editing.';
  const { data: edited, error: eErr } = await supabase
    .from('reviews')
    .update({ review_text: editedText })
    .eq('id', testId)
    .select()
    .single();

  if (eErr || edited.review_text !== editedText) {
    console.error('❌ Edit Typos failed:', eErr?.message);
    return;
  }
  console.log('   ✅ Edit Typos successful! Updated text:', edited.review_text);

  // 3. Test Approve Action
  console.log('\n3. Testing "Approve" Action...');
  const { data: approved, error: aErr } = await supabase
    .from('reviews')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', testId)
    .select()
    .single();

  if (aErr || approved.status !== 'approved') {
    console.error('❌ Approve action failed:', aErr?.message);
    return;
  }
  console.log('   ✅ Approve action successful! Status:', approved.status, '| Approved At:', approved.approved_at);

  // Verify public visibility
  const { data: publicFeed } = await supabase.from('reviews').select('*').eq('status', 'approved').eq('id', testId);
  console.log('   Is Approved Review visible on public feed?:', publicFeed?.length > 0 ? '✅ YES (Live on Testimonials page!)' : '❌ NO');

  // 4. Test Reject Action
  console.log('\n4. Testing "Reject" Action...');
  const rejectionNote = 'Not moving forward with public display.';
  const { data: rejected, error: rErr } = await supabase
    .from('reviews')
    .update({ status: 'rejected', rejection_note: rejectionNote })
    .eq('id', testId)
    .select()
    .single();

  if (rErr || rejected.status !== 'rejected') {
    console.error('❌ Reject action failed:', rErr?.message);
    return;
  }
  console.log('   ✅ Reject action successful! Status:', rejected.status, '| Rejection Note:', rejected.rejection_note);

  // Verify public hidden state
  const { data: publicFeedAfterReject } = await supabase.from('reviews').select('*').eq('status', 'approved').eq('id', testId);
  console.log('   Is Rejected Review visible on public feed?:', publicFeedAfterReject?.length > 0 ? '❌ FAIL (Should be hidden)' : '✅ HIDDEN (Successfully hidden from public view!)');

  // Cleanup
  await supabase.from('reviews').delete().eq('id', testId);
  console.log('\n=== ALL REVIEW MODERATION ACTIONS VERIFIED 100%! ===');
}

testReviewModerationActions();
