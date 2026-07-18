import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== 'Bearer mock-admin-token-sb-2026') {
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

    // 2. Fetch databases
    const db = readDb();
    const reviewIdx = db.reviews.findIndex(r => r.id === reviewId);

    if (reviewIdx === -1) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const review = db.reviews[reviewIdx];

    // 3. Process action
    if (action === 'approve') {
      review.status = 'approved';
      review.approved_at = new Date().toISOString();
    } else if (action === 'reject') {
      review.status = 'rejected';
      review.rejection_note = rejectionNote ? rejectionNote.trim() : '';
    } else if (action === 'edit') {
      if (!reviewText || reviewText.trim().length < 10) {
        return NextResponse.json({ error: 'Review text must be at least 10 characters long' }, { status: 400 });
      }
      if (reviewText.trim().length > 1000) {
        return NextResponse.json({ error: 'Review text cannot exceed 1000 characters' }, { status: 400 });
      }
      review.review_text = reviewText.trim();
    }

    // Save changes
    db.reviews[reviewIdx] = review;
    writeDb(db);

    return NextResponse.json({ success: true, message: `Review successfully processed with action: ${action}`, review });
  } catch (error: any) {
    console.error('API Admin Reviews PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
