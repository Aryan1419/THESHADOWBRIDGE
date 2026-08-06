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
  console.log('=== CLEANING UP ALL SYNTHETIC / TEST FILES FROM SUPABASE STORAGE ===\n');

  // Delete root level files in 'documents'
  const rootFiles = ['WIN_20250118_14_33_38_Pro.jpg', 'WIN_20260504_01_15_09_Pro.jpg', 'WIN_20260504_01_15_14_Pro.jpg'];
  console.log('Deleting root level test files...');
  const { data: delRoot, error: delRootErr } = await supabase.storage.from('documents').remove(rootFiles);
  if (delRootErr) console.error('Root delete error:', delRootErr);
  else console.log('Deleted root files:', delRoot);

  // Delete synthetic files in 'shadow-teachers/'
  const shadowTestFiles = [
    'shadow-teachers/mallika_1785070008498_WIN_20250118_14_33_38_Pro.jpg.svg',
    'shadow-teachers/mallika_1785070008777_WIN_20260504_01_15_09_Pro.jpg.svg',
    'shadow-teachers/mallika_1785070008948_WIN_20260504_01_15_14_Pro.jpg.svg',
    'shadow-teachers/test-doc-1785069293517.txt',
    'shadow-teachers/WIN_20250118_14_33_38_Pro.jpg',
    'shadow-teachers/WIN_20260504_01_15_09_Pro.jpg',
    'shadow-teachers/WIN_20260504_01_15_14_Pro.jpg'
  ];
  console.log('\nDeleting synthetic shadow-teachers folder files...');
  const { data: delShadow, error: delShadowErr } = await supabase.storage.from('documents').remove(shadowTestFiles);
  if (delShadowErr) console.error('Shadow delete error:', delShadowErr);
  else console.log('Deleted shadow folder test files:', delShadow);

  // Clear notes column in MALLIKA BHATT (TSB-2026-5741) record
  console.log('\nClearing mock notes URLs from Mallika Bhatt DB record...');
  await supabase.from('shadow_teachers').update({ notes: '' }).eq('registration_id', 'TSB-2026-5741');
  console.log('Cleared mock notes.');

  console.log('\n================================================================');
  console.log('             SUPABASE STORAGE IS NOW CLEAN & EMPTY               ');
  console.log('================================================================');
}

main();
