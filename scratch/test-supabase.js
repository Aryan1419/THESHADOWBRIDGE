const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
}

console.log('URL:', supabaseUrl);
console.log('Connecting...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const { data, error } = await supabase.from('tutors').select('*').limit(1);
    if (error) {
      console.log('Database tables do not exist or error returned:', error.message);
    } else {
      console.log('Database table tutors exists. Found rows:', data);
    }
  } catch (e) {
    console.error('Unexpected error:', e.message);
  }
}

test();
