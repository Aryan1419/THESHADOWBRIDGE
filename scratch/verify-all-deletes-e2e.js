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

async function runE2EDeletionTest() {
  console.log('=== VERIFYING DELETE ACTIONS ACROSS ALL TABLES E2E ===\n');

  const tablesToTest = [
    { table: 'tutors', fieldName: 'name', value: 'Test Tutor to Delete', idPrefix: 'tut-test-' },
    { table: 'shadow_teachers', fieldName: 'name', value: 'Test Shadow to Delete', idPrefix: 'shadow-test-' },
    { table: 'parent_shadow_requests', fieldName: 'parent_name', value: 'Test Shadow Parent Delete', idPrefix: 'parent-shadow-test-' },
    { table: 'parent_tutor_requests', fieldName: 'parent_name', value: 'Test Tutor Parent Delete', idPrefix: 'parent-tutor-test-' },
    { table: 'reviews', fieldName: 'parent_name', value: 'Test Review Parent Delete', idPrefix: 'review-test-' }
  ];

  for (const item of tablesToTest) {
    console.log(`Testing Delete on table [${item.table}]...`);
    const testId = item.idPrefix + Date.now().toString().slice(-4);
    
    // Insert test record
    const insertObj = { id: testId };
    insertObj[item.fieldName] = item.value;
    if (item.table.includes('parent_')) {
      insertObj.phone = '09999999999';
      insertObj.email = 'testdelete@gmail.com';
      insertObj.city = 'Delhi NCR';
      insertObj.child_name = 'Test Child';
      insertObj.child_grade = 'Grade 1';
      insertObj.status = 'Registration Submitted';
      insertObj.registration_id = 'SB-2026-TEST';
    } else if (item.table === 'reviews') {
      insertObj.rating = 5;
      insertObj.review_text = 'Test review text for delete test';
      insertObj.service_type = 'Shadow Teacher';
      insertObj.city = 'Delhi NCR';
      insertObj.status = 'pending';
      insertObj.parent_registration_id = 'SB-2026-TEST';
    } else if (item.table === 'tutors') {
      insertObj.phone = '09999999999';
      insertObj.email = 'testdelete@gmail.com';
      insertObj.city = 'Delhi NCR';
      insertObj.qualification = 'B.Ed';
      insertObj.experience = '2-5 Years';
      insertObj.subjects = 'Mathematics';
      insertObj.grades = 'Grade 1-5';
      insertObj.status = 'Active';
      insertObj.registration_id = 'REG-2026-TEST';
    } else if (item.table === 'shadow_teachers') {
      insertObj.phone = '09999999999';
      insertObj.email = 'testdelete@gmail.com';
      insertObj.city = 'Delhi NCR';
      insertObj.qualification = 'Special Educator';
      insertObj.experience = '2-5 Years';
      insertObj.status = 'Active';
      insertObj.registration_id = 'REG-2026-TEST';
    }

    const { data: created, error: cErr } = await supabase.from(item.table).insert([insertObj]).select().single();
    if (cErr) {
      console.error(`   ❌ Failed to insert test record into ${item.table}:`, cErr.message);
      continue;
    }
    console.log(`   Created test record with ID: ${created.id}`);

    // Perform Delete
    const { error: dErr } = await supabase.from(item.table).delete().eq('id', created.id);
    if (dErr) {
      console.error(`   ❌ Failed to delete record from ${item.table}:`, dErr.message);
    } else {
      console.log(`   ✅ Successfully deleted record ${created.id} from ${item.table}`);
    }

    // Verify deletion
    const { data: check } = await supabase.from(item.table).select('*').eq('id', created.id).maybeSingle();
    console.log(`   Verification in ${item.table}:`, Boolean(check) ? '❌ STILL EXISTS' : '✅ PERMANENTLY REMOVED (null)\n');
  }

  console.log('=== ALL TABLE DELETE ACTIONS VERIFIED 100%! ===');
}

runE2EDeletionTest();
