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
  console.log('=== AUDITING ALL SHADOW TEACHER REGISTRATIONS & DOCUMENTS ===\n');
  
  // 1. Fetch all shadow teachers from DB
  const { data: candidates, error: dbErr } = await supabase
    .from('shadow_teachers')
    .select('*')
    .order('created_at', { ascending: false });

  if (dbErr) {
    console.error('Database query error:', dbErr.message);
    return;
  }

  console.log(`Found ${candidates.length} total Shadow Teacher registration(s) in Database:\n`);

  // 2. Fetch all files currently in Supabase Storage 'documents' bucket under shadow-teachers/
  const { data: storageFiles, error: storageErr } = await supabase.storage
    .from('documents')
    .list('shadow-teachers', { limit: 1000 });

  const storageFileNames = new Set((storageFiles || []).map(f => f.name));
  console.log(`Files currently in Supabase Storage ('documents/shadow-teachers/'):`);
  storageFiles.forEach(f => console.log(`  - ${f.name} (${f.metadata ? f.metadata.size : 0} bytes)`));
  console.log('\n--------------------------------------------------------------\n');

  // 3. Check each candidate's documents
  const auditResults = [];

  for (const c of candidates) {
    const candidateAudit = {
      id: c.id,
      regId: c.registration_id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.created_at,
      documents: []
    };

    const docFields = [
      { key: 'aadhar_card_name', label: 'Aadhar Card' },
      { key: 'qualification_cert_name', label: 'Degree / Qualification' },
      { key: 'experience_cert_name', label: 'Experience Cert' },
      { key: 'profile_photo_name', label: 'Profile Photo' }
    ];

    for (const doc of docFields) {
      const filename = c[doc.key];
      if (filename) {
        // Check if notes contains a direct URL for this document
        const notesStr = c.notes || '';
        let urlInNotes = null;
        if (doc.label.includes('Aadhar')) {
          const match = notesStr.match(/Aadhar[^:]*:\s*(https:\/\/[^\s|]+)/i);
          if (match) urlInNotes = match[1];
        } else if (doc.label.includes('Degree')) {
          const match = notesStr.match(/Qualificat[^\s|:]*:\s*(https:\/\/[^\s|]+)/i) || notesStr.match(/Degree[^\s|:]*:\s*(https:\/\/[^\s|]+)/i);
          if (match) urlInNotes = match[1];
        } else if (doc.label.includes('Experience')) {
          const match = notesStr.match(/Experience[^:]*:\s*(https:\/\/[^\s|]+)/i);
          if (match) urlInNotes = match[1];
        } else if (doc.label.includes('Photo')) {
          const match = notesStr.match(/Profile Photo[^:]*:\s*(https:\/\/[^\s|]+)/i) || notesStr.match(/Photo[^:]*:\s*(https:\/\/[^\s|]+)/i);
          if (match) urlInNotes = match[1];
        }

        // Check if file exists directly in storage
        const existsDirectlyInStorage = storageFileNames.has(filename);

        candidateAudit.documents.push({
          label: doc.label,
          filename,
          urlInNotes,
          existsDirectlyInStorage,
          status: (urlInNotes || existsDirectlyInStorage) ? 'VALID' : 'BROKEN/MISSING'
        });
      }
    }

    auditResults.push(candidateAudit);
  }

  // Print Summary Table
  console.log('=== CANDIDATE AUDIT REPORT ===\n');
  for (const item of auditResults) {
    console.log(`Candidate: ${item.name} (${item.regId})`);
    console.log(`Email: ${item.email} | Phone: ${item.phone} | Created: ${item.createdAt}`);
    if (item.documents.length === 0) {
      console.log('  No documents attached.');
    } else {
      for (const d of item.documents) {
        const icon = d.status === 'VALID' ? '✅' : '❌';
        console.log(`  ${icon} [${d.label}] ${d.filename} -> Status: ${d.status}`);
        if (d.urlInNotes) console.log(`      URL in Notes: ${d.urlInNotes}`);
      }
    }
    console.log('');
  }
}

main();
