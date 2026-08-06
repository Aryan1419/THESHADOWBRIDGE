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
  console.log('=== EXTRACTING ALL DATABASE RECORDS ACROSS ALL TABLES ===\n');

  // 1. Shadow Teachers
  const { data: shadows, error: shadowErr } = await supabase
    .from('shadow_teachers')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. Tutors
  const { data: tutors, error: tutorErr } = await supabase
    .from('tutors')
    .select('*')
    .order('created_at', { ascending: false });

  // 3. Parent Shadow Requests
  const { data: parentShadows, error: parentShadowErr } = await supabase
    .from('parent_shadow_requests')
    .select('*')
    .order('created_at', { ascending: false });

  // 4. Parent Tutor Requests
  const { data: parentTutors, error: parentTutorErr } = await supabase
    .from('parent_tutor_requests')
    .select('*')
    .order('created_at', { ascending: false });

  // 5. Contacts
  const { data: contacts, error: contactErr } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  // 6. Reviews
  const { data: reviews, error: reviewErr } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  const result = {
    shadow_teachers: shadows || [],
    tutors: tutors || [],
    parent_shadow_requests: parentShadows || [],
    parent_tutor_requests: parentTutors || [],
    contacts: contacts || [],
    reviews: reviews || []
  };

  fs.writeFileSync(path.join(__dirname, 'db_audit_export.json'), JSON.stringify(result, null, 2));
  console.log('Exported database snapshot to scratch/db_audit_export.json');
}

main();
