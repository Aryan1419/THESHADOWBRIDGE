import { NextResponse } from 'next/server';
import { readDb, writeDb, ReviewRecord } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// Helpers to translate database casing
function toCamelCase(obj: any): any {
  if (obj !== null && typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      if (key === 'registration_id' || key === 'created_at') {
        res[key] = obj[key];
      } else {
        const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
        res[camelKey] = obj[key];
      }
    }
    return res;
  }
  return obj;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationId, rating, reviewText, childFirstName, consentPublic } = body;

    // 1. Basic validation
    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
    }
    if (rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Star rating must be between 1 and 5' }, { status: 400 });
    }
    if (!reviewText || reviewText.trim().length < 10) {
      return NextResponse.json({ error: 'Review text must be at least 10 characters long' }, { status: 400 });
    }
    if (reviewText.trim().length > 1000) {
      return NextResponse.json({ error: 'Review text cannot exceed 1000 characters' }, { status: 400 });
    }
    if (consentPublic !== true) {
      return NextResponse.json({ error: 'You must consent to public display to submit a review' }, { status: 400 });
    }

    // 2. Query registration from Supabase
    const { data: dbShadow } = await supabase
      .from('parent_shadow_requests')
      .select('*')
      .eq('registration_id', registrationId)
      .maybeSingle();

    const { data: dbTutor } = await supabase
      .from('parent_tutor_requests')
      .select('*')
      .eq('registration_id', registrationId)
      .maybeSingle();

    const parentRecordRaw = dbShadow || dbTutor;

    if (!parentRecordRaw) {
      return NextResponse.json({ error: 'Parent registration record not found for this ID.' }, { status: 404 });
    }

    const parentRecord = toCamelCase(parentRecordRaw);

    // 3. Verify status
    if (parentRecord.status !== 'Support Started' && parentRecord.status !== 'Active') {
      return NextResponse.json(
        { error: 'Reviews can only be submitted after your child\'s educational support has successfully started or is active.' },
        { status: 400 }
      );
    }

    const db = readDb();

    // 4. Check for duplicate reviews
    const duplicate = db.reviews.find(r => r.parent_registration_id === registrationId);
    if (duplicate) {
      return NextResponse.json({ error: 'A review has already been submitted for this registration ID.' }, { status: 400 });
    }

    // 5. Create new review
    const newReview: ReviewRecord = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      parent_registration_id: registrationId,
      parent_name: parentRecord.parentName,
      child_first_name: childFirstName ? childFirstName.trim() : undefined,
      rating: Number(rating),
      review_text: reviewText.trim(),
      city: parentRecord.city,
      service_type: dbShadow ? 'Shadow Teacher' : 'Home Tutor',
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    db.reviews.push(newReview);
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! Your review will be published after a quick review.',
      review: newReview
    });
  } catch (error: any) {
    console.error('API Reviews POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const db = readDb();
    
    // Check if searching for a specific parent's review submission status
    const url = new URL(request.url);
    const searchRegId = url.searchParams.get('regId');
    if (searchRegId) {
      const existing = db.reviews.find(r => r.parent_registration_id === searchRegId);
      return NextResponse.json({ success: true, exists: !!existing, review: existing });
    }

    const authHeader = request.headers.get('Authorization');
    const isAdmin = authHeader === 'Bearer mock-admin-token-sb-2026';

    if (isAdmin) {
      // Sort all reviews most recent first for moderation panel
      const allReviews = [...db.reviews].sort(
        (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      );
      return NextResponse.json({ success: true, reviews: allReviews });
    }

    // Public call: return approved reviews only
    const approvedReviews = db.reviews
      .filter(r => r.status === 'approved')
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

    return NextResponse.json({ success: true, reviews: approvedReviews });
  } catch (error: any) {
    console.error('API Reviews GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
