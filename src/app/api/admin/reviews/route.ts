import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase, isSupabaseConfigured } from '@/lib/supabase';
import { readDb, writeDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  return handleReviewModeration(request);
}

export async function POST(request: Request) {
  return handleReviewModeration(request);
}

async function handleReviewModeration(request: Request) {
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
      updates.rejection_note = rejectionNote ? rejectionNote.trim() : 'Rejected by administrator';
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
    let dbErrorMsg: string | null = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .update(updates)
          .eq('id', reviewId)
          .select()
          .single();

        if (!error && data) {
          console.log(`✅ Supabase review ${reviewId} updated action: ${action}`);
          updatedReview = data;
        } else if (error) {
          console.error(`❌ Supabase review update error for ${reviewId}:`, error);
          dbErrorMsg = error.message;
        }
      } catch (err: any) {
        console.error('Supabase review update exception:', err);
        dbErrorMsg = err.message;
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
      if (isSupabaseConfigured && dbErrorMsg) {
        return NextResponse.json({ error: `Database error updating review: ${dbErrorMsg}` }, { status: 500 });
      }
      return NextResponse.json({ error: 'Review record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Review successfully processed with action: ${action}`,
      review: updatedReview
    });
  } catch (error: any) {
    console.error('API Admin Reviews PUT/POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
