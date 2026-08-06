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

function toCamelCase(obj) {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === 'object') {
    const res = {};
    for (const key of Object.keys(obj)) {
      if (key === 'registration_id' || key === 'created_at') {
        res[key] = toCamelCase(obj[key]);
      } else {
        const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
        res[camelKey] = toCamelCase(obj[key]);
      }
    }
    return res;
  }
  return obj;
}

async function debugStatusUpdate() {
  console.log('=== DEBUGGING STATUS CHANGE EMAIL TRIGGER ===\n');

  // Fetch record for Aryan Beltharia
  const { data: record, error } = await supabase
    .from('shadow_teachers')
    .select('*')
    .eq('name', 'Aryan Beltharia')
    .single();

  if (error || !record) {
    console.error('Error fetching shadow teacher record:', error);
    return;
  }

  console.log('Raw Postgres Record from DB:', record);
  const camelRecord = toCamelCase(record);
  console.log('\nConverted camelCase Record:', camelRecord);

  console.log('\nField values check:');
  console.log('  record.email:', camelRecord.email);
  console.log('  record.registrationId:', camelRecord.registrationId);
  console.log('  record.registration_id:', camelRecord.registration_id);
  console.log('  record.name:', camelRecord.name);
}

debugStatusUpdate();
