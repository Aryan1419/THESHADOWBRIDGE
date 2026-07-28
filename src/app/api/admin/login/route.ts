import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword, signAdminToken } from '@/lib/auth';

// Known admin fallback accounts with bcrypt hashed password ("ShadowBridge@2026")
const DEFAULT_ADMIN_HASH = '$2b$10$3fvCPp4VHgvDMwFQ15lEDemPQXxSM8wINxfjH.5F9D/OYG.LTyP8G';

const DEFAULT_ADMINS = [
  { email: 'pratibha@theshadowbridge.com', passwordHash: DEFAULT_ADMIN_HASH },
  { email: 'theshadowbridgesupport@gmail.com', passwordHash: DEFAULT_ADMIN_HASH },
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
      const realJwtToken = signAdminToken(cleanEmail);

      return NextResponse.json({ 
        success: true, 
        token: realJwtToken, 
        email: cleanEmail 
      });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error: any) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}


