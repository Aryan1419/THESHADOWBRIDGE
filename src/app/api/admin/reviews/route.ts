import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readDb, writeDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const adminUser = verifyAdminToken(token);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const { reviewId, action, reviewText, rejectionNote } = body;

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }
    if (!action || !['approve', 'reject', 'edit'].includes(action)) {
      return NextResponse.json({ error: 'Valid action (approve, reject, edit) is required' }, { status: 400 });
    }

    const updates: any = {};
    if (action === 'approve') {
      updates.status = 'approved';
      updates.approved_at = new Date().toISOString();
    } else if (action === 'reject') {
      updates.status = 'rejected';
      updates.rejection_note = rejectionNote ? rejectionNote.trim() : '';
    } else if (action === 'edit') {
      if (!reviewText || reviewText.trim().length < 10) {
        return NextResponse.json({ error: 'Review text must be at least 10 characters long' }, { status: 400 });
      }
      if (reviewText.trim().length > 1000) {
        return NextResponse.json({ error: 'Review text cannot exceed 1000 characters' }, { status: 400 });
      }
      updates.review_text = reviewText.trim();
    }

    let updatedReview: any = null;
    const isSupabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    );

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .update(updates)
          .eq('id', reviewId)
          .select()
          .single();

        if (!error && data) {
          updatedReview = data;
        }
      } catch (err) {
        console.warn('Supabase review update exception:', err);
      }
    }

    // Always keep local DB synced / fallback
    const db = readDb();
    const reviewIdx = (db.reviews || []).findIndex(r => r.id === reviewId);
    if (reviewIdx !== -1) {
      db.reviews[reviewIdx] = {
        ...db.reviews[reviewIdx],
        ...updates
      };
      writeDb(db);
      if (!updatedReview) {
        updatedReview = db.reviews[reviewIdx];
      }
    }

    if (!updatedReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Review successfully processed with action: ${action}`,
      review: updatedReview
    });
  } catch (error: any) {
    console.error('API Admin Reviews PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

