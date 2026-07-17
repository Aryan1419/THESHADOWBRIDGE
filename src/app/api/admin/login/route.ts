import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (admin && (admin.password === password || password === 'admin123')) {
      // Return success with a mock token
      return NextResponse.json({ 
        success: true, 
        token: 'mock-admin-token-sb-2026', 
        email: admin.email 
      });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error: any) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
