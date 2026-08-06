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

async function testGatedCheckLogic(query) {
  const cleanRegId = query.trim().toUpperCase();
  const cleanContact = query.trim().toLowerCase();
  const cleanPhoneDigits = query.replace(/\D/g, '');

  let record = null;
  let serviceType = 'Shadow Teacher';
  let subType = 'shadow';

  // 1. Search in parent_shadow_requests
  if (cleanRegId) {
    const { data: ps } = await supabase
      .from('parent_shadow_requests')
      .select('*')
      .ilike('registration_id', `%${cleanRegId}%`)
      .maybeSingle();
    if (ps) { record = ps; serviceType = 'Shadow Teacher'; subType = 'shadow'; }
  }

  // 2. Search in parent_tutor_requests
  if (!record && cleanRegId) {
    const { data: pt } = await supabase
      .from('parent_tutor_requests')
      .select('*')
      .ilike('registration_id', `%${cleanRegId}%`)
      .maybeSingle();
    if (pt) { record = pt; serviceType = 'Home Tutor'; subType = 'tutor'; }
  }

  // 3. Search in bookings
  if (!record && cleanRegId) {
    const { data: bk } = await supabase
      .from('bookings')
      .select('*')
      .ilike('booking_id', `%${cleanRegId}%`)
      .maybeSingle();
    if (bk) {
      record = bk;
      serviceType = bk.requirement?.toLowerCase().includes('tutor') ? 'Home Tutor' : 'Shadow Teacher';
      subType = bk.requirement?.toLowerCase().includes('tutor') ? 'tutor' : 'shadow';
    }
  }

  // 4. Contact lookup
  if (!record && cleanContact) {
    const { data: ps } = await supabase
      .from('parent_shadow_requests')
      .select('*')
      .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (ps) {
      record = ps;
    } else {
      const { data: pt } = await supabase
        .from('parent_tutor_requests')
        .select('*')
        .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pt) {
        record = pt;
      } else {
        const { data: bk } = await supabase
          .from('bookings')
          .select('*')
          .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (bk) {
          record = bk;
        }
      }
    }
  }

  if (!record) return { success: false, error: 'Not found' };

  // OUR FIXED LOGIC:
  const currentStatus = record.status || record.message || 'Consultation Booked';
  const isConsultationPaid = Boolean(record.consultation_paid || record.payment_status === 'paid');

  const getStatusIndex = (st) => {
    const sLower = (st || '').toLowerCase();
    if (sLower.includes('completed') || sLower.includes('analysis') || sLower.includes('unlocked')) return 1;
    if (sLower.includes('submitted')) return 2;
    if (sLower.includes('paid') || sLower.includes('matching')) return 3;
    if (sLower.includes('proposed')) return 4;
    if (sLower.includes('booked')) return 0;
    return 0;
  };

  const statusIdx = getStatusIndex(currentStatus);

  return {
    success: true,
    matchedId: record.booking_id || record.registration_id,
    currentStatus,
    statusIdx,
    isConsultationCompleted: statusIdx >= 1
  };
}

async function runTest() {
  console.log('=== TESTING FIXED GATED CHECK LOGIC ===\n');

  console.log('1. Lookup by Booking ID: TSB-BK-2026-61102...');
  const res1 = await testGatedCheckLogic('TSB-BK-2026-61102');
  console.log('   Matched ID:', res1.matchedId);
  console.log('   Evaluated Current Status:', res1.currentStatus);
  console.log('   Is Consultation Completed:', res1.isConsultationCompleted ? '🔓 TRUE (FORM UNLOCKED)' : '🔒 FALSE');

  console.log('\n2. Lookup by Email: aryanbeltharia1419@gmail.com...');
  const res2 = await testGatedCheckLogic('aryanbeltharia1419@gmail.com');
  console.log('   Matched ID:', res2.matchedId);
  console.log('   Evaluated Current Status:', res2.currentStatus);
  console.log('   Is Consultation Completed:', res2.isConsultationCompleted ? '🔓 TRUE (FORM UNLOCKED)' : '🔒 FALSE');

  console.log('\n3. Lookup by Phone: 6396309989...');
  const res3 = await testGatedCheckLogic('6396309989');
  console.log('   Matched ID:', res3.matchedId);
  console.log('   Evaluated Current Status:', res3.currentStatus);
  console.log('   Is Consultation Completed:', res3.isConsultationCompleted ? '🔓 TRUE (FORM UNLOCKED)' : '🔒 FALSE');
}

runTest();
