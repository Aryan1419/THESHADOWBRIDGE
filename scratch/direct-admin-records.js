const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function readDb() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '../data/db.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function testAdminRecordsHandler() {
  let tutors = null, shadowTeachers = null, parentShadow = null, parentTutor = null, notifications = null, contacts = null, reviews = null;

  try {
    const { data: t } = await supabase.from('tutors').select('*');
    const { data: st } = await supabase.from('shadow_teachers').select('*');
    const { data: ps } = await supabase.from('parent_shadow_requests').select('*');
    const { data: pt } = await supabase.from('parent_tutor_requests').select('*');
    const { data: c } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    const { data: n } = await supabase.from('notifications_log').select('*').order('created_at', { ascending: false });
    const { data: rev } = await supabase.from('reviews').select('*').order('submitted_at', { ascending: false });

    tutors = t;
    shadowTeachers = st;
    parentShadow = ps;
    parentTutor = pt;
    contacts = c;
    notifications = n;
    reviews = rev;
  } catch (err) {
    console.warn('Supabase query exception:', err);
  }

  const localDb = readDb();
  if (!tutors) tutors = localDb.tutors || [];
  if (!shadowTeachers) shadowTeachers = localDb.shadow_teachers || [];
  if (!parentShadow) parentShadow = localDb.parent_shadow_requests || [];
  if (!parentTutor) parentTutor = localDb.parent_tutor_requests || [];
  if (!contacts) contacts = (localDb).contacts || [];
  if (!notifications) notifications = localDb.notifications || [];
  if (!reviews) reviews = localDb.reviews || [];

  console.log('=== ADMIN RECORDS PAYLOAD VERIFICATION ===');
  console.log('Contacts fetched count:', contacts ? contacts.length : 0);
  console.log('Contacts array:', JSON.stringify(contacts, null, 2));
}

testAdminRecordsHandler();
