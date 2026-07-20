import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL || 
  process.env.Supabase_key_URL || 
  '';

const supabaseServiceKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.Supabase_key_ANON || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseServiceKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseServiceKey.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn('Supabase URL or Key is missing in environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

