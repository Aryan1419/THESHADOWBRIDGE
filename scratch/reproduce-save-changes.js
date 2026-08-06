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

async function testSaveChanges() {
  console.log('=== REPRODUCING SAVE CHANGES POST /api/admin/records ===\n');

  // Fetch a real shadow teacher record ID
  const { data: records } = await supabase.from('shadow_teachers').select('id, name, status, notes');
  console.log('Current Shadow Teachers in DB:', records);

  if (!records || records.length === 0) {
    console.error('No shadow teachers found in DB');
    return;
  }

  const target = records[0];
  console.log(`\nTesting update on Target Record: ${target.name} (ID: ${target.id})`);

  const payload = {
    action: 'update_record',
    type: 'shadow_teachers',
    id: target.id,
    status: 'Shortlisted',
    notes: 'Test note from reproduction script'
  };

  const response = await fetch('http://localhost:3000/api/admin/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-admin-token-sb-2026'
    },
    body: JSON.stringify(payload)
  }).catch(err => {
    console.error('HTTP Request failed:', err.message);
    return null;
  });

  if (response) {
    console.log('HTTP Status Code:', response.status);
    const bodyText = await response.text();
    console.log('Response Body:', bodyText);
  }
}

testSaveChanges();
