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
  console.log('=== EXECUTING DELETION OF ALL RED ENTRIES ===\n');

  // 1. shadow_teachers to delete: shadow-goq6pdy (TSB-2026-9995), shadow-0qhkjss (TSB-2026-9371), shadow-seed-1 (TSB-2026-4928)
  const shadowIdsToDelete = ['shadow-goq6pdy', 'shadow-0qhkjss', 'shadow-seed-1'];
  console.log('Deleting red shadow_teachers:', shadowIdsToDelete);
  const { data: delShadows, error: err1 } = await supabase.from('shadow_teachers').delete().in('id', shadowIdsToDelete).select();
  if (err1) console.error('Error deleting shadow_teachers:', err1);
  else console.log(`Deleted ${delShadows.length} shadow_teachers records.`);

  // 2. tutors to delete: tutor-seed-1 (TUT-2026-3829)
  const tutorIdsToDelete = ['tutor-seed-1'];
  console.log('\nDeleting red tutors:', tutorIdsToDelete);
  const { data: delTutors, error: err2 } = await supabase.from('tutors').delete().in('id', tutorIdsToDelete).select();
  if (err2) console.error('Error deleting tutors:', err2);
  else console.log(`Deleted ${delTutors.length} tutors records.`);

  // 3. parent_shadow_requests to delete: parent-shadow-a8ywwoi, parent-shadow-155p076, parent-shadow-seed-1
  const parentShadowIdsToDelete = ['parent-shadow-a8ywwoi', 'parent-shadow-155p076', 'parent-shadow-seed-1'];
  console.log('\nDeleting red parent_shadow_requests:', parentShadowIdsToDelete);
  const { data: delParentShadows, error: err3 } = await supabase.from('parent_shadow_requests').delete().in('id', parentShadowIdsToDelete).select();
  if (err3) console.error('Error deleting parent_shadow_requests:', err3);
  else console.log(`Deleted ${delParentShadows.length} parent_shadow_requests records.`);

  // 4. parent_tutor_requests to delete: parent-tutor-67w0dtt, parent-tutor-seed-1
  const parentTutorIdsToDelete = ['parent-tutor-67w0dtt', 'parent-tutor-seed-1'];
  console.log('\nDeleting red parent_tutor_requests:', parentTutorIdsToDelete);
  const { data: delParentTutors, error: err4 } = await supabase.from('parent_tutor_requests').delete().in('id', parentTutorIdsToDelete).select();
  if (err4) console.error('Error deleting parent_tutor_requests:', err4);
  else console.log(`Deleted ${delParentTutors.length} parent_tutor_requests records.`);

  // 5. contacts to delete: contact-05n4zan, contact-kepuchv, contact-1mnm3a7, contact-88dbe71, test-1784577440997, test-1784576572261
  const contactIdsToDelete = [
    'contact-05n4zan',
    'contact-kepuchv',
    'contact-1mnm3a7',
    'contact-88dbe71',
    'test-1784577440997',
    'test-1784576572261'
  ];
  console.log('\nDeleting red contacts:', contactIdsToDelete);
  const { data: delContacts, error: err5 } = await supabase.from('contacts').delete().in('id', contactIdsToDelete).select();
  if (err5) console.error('Error deleting contacts:', err5);
  else console.log(`Deleted ${delContacts.length} contacts records.`);

  console.log('\n================================================================');
  console.log('            ALL RED TEST/DEMO ENTRIES SUCCESSFULLY REMOVED        ');
  console.log('================================================================\n');
}

main();
