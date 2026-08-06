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

async function performLookup(registrationId, contactInfo) {
  const cleanRegId = registrationId.trim().toUpperCase();
  const cleanContact = contactInfo.trim().toLowerCase();
  const cleanPhoneDigits = contactInfo.replace(/\D/g, '');

  const isContactMatch = (recordEmail, recordPhone) => {
    if (!recordEmail && !recordPhone) return false;
    const emailMatches = recordEmail && recordEmail.trim().toLowerCase() === cleanContact;
    const phoneDigits = recordPhone ? recordPhone.replace(/\D/g, '') : '';
    const phoneMatches = cleanPhoneDigits && phoneDigits && (phoneDigits.includes(cleanPhoneDigits) || cleanPhoneDigits.includes(phoneDigits));
    return Boolean(emailMatches || phoneMatches);
  };

  const { data: shadow } = await supabase
    .from('shadow_teachers')
    .select('*')
    .ilike('registration_id', cleanRegId)
    .maybeSingle();

  if (shadow && isContactMatch(shadow.email, shadow.phone)) {
    return { success: true, role: 'shadow', record: toCamelCase(shadow) };
  }

  const { data: tutor } = await supabase
    .from('tutors')
    .select('*')
    .ilike('registration_id', cleanRegId)
    .maybeSingle();

  if (tutor && isContactMatch(tutor.email, tutor.phone)) {
    return { success: true, role: 'tutor', record: toCamelCase(tutor) };
  }

  const { data: parentShadow } = await supabase
    .from('parent_shadow_requests')
    .select('*')
    .ilike('registration_id', cleanRegId)
    .maybeSingle();

  if (parentShadow && isContactMatch(parentShadow.email, parentShadow.phone)) {
    return { success: true, role: 'parent', subType: 'shadow', record: toCamelCase(parentShadow) };
  }

  const { data: parentTutor } = await supabase
    .from('parent_tutor_requests')
    .select('*')
    .ilike('registration_id', cleanRegId)
    .maybeSingle();

  if (parentTutor && isContactMatch(parentTutor.email, parentTutor.phone)) {
    return { success: true, role: 'parent', subType: 'tutor', record: toCamelCase(parentTutor) };
  }

  return { success: false, error: "We couldn't find a matching registration. Please check your Registration ID and contact details, or reach out to us at theshadowbridgesupport@gmail.com." };
}

async function runTest() {
  console.log('=== TESTING CHECK APPLICATION STATUS LOOKUP ENGINE ===\n');

  // TEST 1: Valid ID + Valid Phone
  console.log('1. Valid Lookup (TSB-2026-9942 + Phone: 6396309989)...');
  const res1 = await performLookup('TSB-2026-9942', '6396309989');
  console.log('   Match Result:', res1.success ? '✅ SUCCESS' : '❌ FAILED');
  if (res1.success) {
    console.log('   Matched Name:', res1.record.name);
    console.log('   Status:', res1.record.status);
    console.log('   Registration ID:', res1.record.registration_id);
  }

  // TEST 2: Valid ID + Valid Email
  console.log('\n2. Valid Lookup (TSB-2026-9942 + Email: aryanbeltharia1419@gmail.com)...');
  const res2 = await performLookup('TSB-2026-9942', 'aryanbeltharia1419@gmail.com');
  console.log('   Match Result:', res2.success ? '✅ SUCCESS' : '❌ FAILED');
  if (res2.success) {
    console.log('   Matched Name:', res2.record.name);
  }

  // TEST 3: Invalid Phone/Email (Security check - must fail)
  console.log('\n3. Security Check: Valid ID + Invalid Email (TSB-2026-9942 + hacker@fake.com)...');
  const res3 = await performLookup('TSB-2026-9942', 'hacker@fake.com');
  console.log('   Security Result:', !res3.success ? '✅ CORRECTLY BLOCKED' : '❌ SECURITY BREACH');
  if (!res3.success) {
    console.log('   Returned Error Message:', res3.error);
  }

  console.log('\n=== CHECK STATUS E2E VERIFICATION COMPLETED ===');
}

runTest();
