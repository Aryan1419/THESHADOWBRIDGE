import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/auth';

// Known admin fallback accounts with PBKDF2 hashed password ("ShadowBridge2026!Admin")
const DEFAULT_ADMIN_HASH = '5eac110af3de36a20c7ba019b939b507:87b28409ebbe38584aec6551b584b80873eeaa0a0312cec75e4d01e70e462bca555eeb5e52cc9c1de210e16b8e7bdbbb016807aa809ed5b544e3567fd992bc41';

const DEFAULT_ADMINS = [
  { email: 'theshadowbridgesupport@gmail.com', passwordHash: DEFAULT_ADMIN_HASH },
  { email: 'pratibha@theshadowbridge.com', passwordHash: DEFAULT_ADMIN_HASH },
  { email: 'aryanbeltharia1419@gmail.com', passwordHash: DEFAULT_ADMIN_HASH },
  { email: 'admin@shadowbridge.in', passwordHash: DEFAULT_ADMIN_HASH }
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try checking Supabase database if configured
    let adminRecord: { email: string; password?: string } | null = null;
    const isSupabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    );

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (!error && data) {
          adminRecord = data;
        }
      } catch (dbErr) {
        console.warn('Supabase admin_users query failed, falling back to local verification:', dbErr);
      }
    }

    // 2. Validate password against Supabase record using cryptographic PBKDF2 hash check
    let isAuthenticated = false;

    if (adminRecord && adminRecord.password) {
      if (verifyPassword(password, adminRecord.password)) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      // Check fallback admin list with hash verification
      const fallback = DEFAULT_ADMINS.find(
        (a) => a.email.toLowerCase() === cleanEmail
      );

      if (fallback && verifyPassword(password, fallback.passwordHash)) {
        isAuthenticated = true;
      }
    }

    if (isAuthenticated) {
      return NextResponse.json({ 
        success: true, 
        token: 'mock-admin-token-sb-2026', 
        email: cleanEmail 
      });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error: any) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}


