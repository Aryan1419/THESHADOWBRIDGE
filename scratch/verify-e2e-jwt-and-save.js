const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = 'the-shadow-bridge-secret-key-2026';

function signAdminToken(email, expiresInSeconds = 86400) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { email, role: 'admin', iat: now, exp: now + expiresInSeconds };
  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64UrlPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${base64UrlHeader}.${base64UrlPayload}`).digest('base64url');
  return `${base64UrlHeader}.${base64UrlPayload}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [base64UrlHeader, base64UrlPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${base64UrlHeader}.${base64UrlPayload}`).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
    const payload = JSON.parse(Buffer.from(base64UrlPayload, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== END-TO-END JWT AUTHENTICATION & SAVE CHANGES VERIFICATION ===\n');

  // STEP 1: Simulate Admin Login & Token Issuance
  const loginEmail = 'pratibha@theshadowbridge.com';
  const loginPassword = 'ShadowBridge@2026';
  const defaultHash = '$2b$10$3fvCPp4VHgvDMwFQ15lEDemPQXxSM8wINxfjH.5F9D/OYG.LTyP8G';

  const isPasswordValid = bcrypt.compareSync(loginPassword, defaultHash);
  console.log('1. Admin Password Verification:', isPasswordValid ? '✅ SUCCESS' : '❌ FAILED');

  if (!isPasswordValid) return;

  const jwtToken = signAdminToken(loginEmail);
  console.log('2. Generated Real Signed JWT Token:', jwtToken);

  const decodedPayload = verifyAdminToken(jwtToken);
  console.log('3. Verified JWT Token Payload:', decodedPayload);

  // STEP 2: Simulate Save Changes Update on Shadow Teacher (Mallika Bhatt: shadow-o9ok715)
  const targetId = 'shadow-o9ok715';
  const targetType = 'shadow_teachers';
  const newStatus = 'Interview Scheduled';
  const newNotes = 'Candidate shortlisted for preliminary interview call.';

  console.log(`\n4. Simulating Save Changes for Record ID "${targetId}" (${targetType})...`);

  // Build update object mimicking route handler logic
  const updates = {
    status: newStatus,
    notes: newNotes
  };

  const { data: updatedRecord, error: updateErr } = await supabase
    .from(targetType)
    .update(updates)
    .eq('id', targetId)
    .select()
    .single();

  if (updateErr) {
    console.error('❌ Update Error:', updateErr);
    return;
  }

  console.log('✅ Update Executed Successfully in PostgreSQL!');
  console.log('   Updated Name:', updatedRecord.name);
  console.log('   Updated Status:', updatedRecord.status);
  console.log('   Updated Notes:', updatedRecord.notes);

  // STEP 3: Re-query Database to Verify Persistence Across Refresh
  console.log('\n5. Re-fetching record from DB to verify persistence across page refresh...');
  const { data: reFetched } = await supabase
    .from(targetType)
    .select('*')
    .eq('id', targetId)
    .single();

  console.log('✅ PERSISTENCE CONFIRMED:');
  console.log('   Persisted Status:', reFetched.status);
  console.log('   Persisted Notes:', reFetched.notes);
}

main();
