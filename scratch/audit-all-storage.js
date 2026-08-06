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
  console.log('================================================================');
  console.log('     SUPABASE STORAGE & REGISTRATION DATABASE COMPLETE AUDIT    ');
  console.log('================================================================\n');

  // 1. List files in root of 'documents' bucket
  const { data: rootFiles, error: rootErr } = await supabase.storage.from('documents').list('', { limit: 100 });
  console.log('📁 Root level items in "documents" bucket:');
  if (rootFiles) {
    for (const f of rootFiles) {
      console.log(`  - Name: ${f.name} | IsFolder: ${!f.id} | Size: ${f.metadata ? f.metadata.size : 0} bytes | Type: ${f.metadata ? f.metadata.mimetype : 'folder'}`);
    }
  }

  // 2. List files in 'shadow-teachers' subfolder
  const { data: shadowFiles, error: shadowErr } = await supabase.storage.from('documents').list('shadow-teachers', { limit: 100 });
  console.log('\n📁 Subfolder "documents/shadow-teachers/" items:');
  if (shadowFiles) {
    for (const f of shadowFiles) {
      console.log(`  - Name: ${f.name} | Size: ${f.metadata ? f.metadata.size : 0} bytes | Type: ${f.metadata ? f.metadata.mimetype : 'unknown'}`);
    }
  }

  // 3. Inspect database records across shadow_teachers, tutors, parent_shadow_requests, parent_tutor_requests
  console.log('\n================================================================');
  console.log('               DATABASE REGISTRATION RECORDS AUDIT               ');
  console.log('================================================================\n');

  const { data: shadows } = await supabase.from('shadow_teachers').select('*').order('created_at', { ascending: false });
  console.log(`--- SHADOW TEACHERS (${shadows ? shadows.length : 0} records) ---`);
  if (shadows) {
    for (const s of shadows) {
      console.log(`\nCandidate: ${s.name} [ID: ${s.registration_id}]`);
      console.log(`  Submitted At: ${s.created_at}`);
      console.log(`  Email: ${s.email} | Phone: ${s.phone}`);
      console.log(`  Aadhar Card Name: "${s.aadhar_card_name || 'N/A'}"`);
      console.log(`  Degree Cert Name: "${s.qualification_cert_name || 'N/A'}"`);
      console.log(`  Experience Cert Name: "${s.experience_cert_name || 'N/A'}"`);
      console.log(`  Profile Photo Name: "${s.profile_photo_name || 'N/A'}"`);
      console.log(`  Notes Column: "${s.notes || 'EMPTY'}"`);
    }
  }

  const { data: tutors } = await supabase.from('tutors').select('*').order('created_at', { ascending: false });
  console.log(`\n--- HOME TUTORS (${tutors ? tutors.length : 0} records) ---`);
  if (tutors) {
    for (const t of tutors) {
      console.log(`\nTutor: ${t.name} [ID: ${t.registration_id}]`);
      console.log(`  Submitted At: ${t.created_at}`);
      console.log(`  Email: ${t.email} | Phone: ${t.phone}`);
    }
  }
}

main();
