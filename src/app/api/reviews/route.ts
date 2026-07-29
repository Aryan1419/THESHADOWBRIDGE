import { NextResponse } from 'next/server';
import { readDb, writeDb, ReviewRecord } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      parentName, 
      city, 
      rating, 
      reviewText, 
      childFirstName, 
      serviceType, 
      registrationId, 
      consentPublic 
    } = body;

    const reviewerName = (parentName || name || '').trim();

    // 1. Validation
    if (!reviewerName) {
      return NextResponse.json({ error: 'Your name is required to submit a review' }, { status: 400 });
    }
    if (rating === undefined || rating === null || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Please select a star rating between 1 and 5' }, { status: 400 });
    }
    if (!reviewText || reviewText.trim().length < 10) {
      return NextResponse.json({ error: 'Review text must be at least 10 characters long' }, { status: 400 });
    }
    if (reviewText.trim().length > 1000) {
      return NextResponse.json({ error: 'Review text cannot exceed 1000 characters' }, { status: 400 });
    }
    if (consentPublic !== true) {
      return NextResponse.json({ error: 'You must check the agreement box to display your review publicly' }, { status: 400 });
    }

    const isSupabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    );

    const regIdToSave = (registrationId || '').trim() || 'PUBLIC-VISITOR';

    // 2. Build review record
    const newReview: ReviewRecord = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      parent_registration_id: regIdToSave,
      parent_name: reviewerName,
      child_first_name: childFirstName ? childFirstName.trim() : undefined,
      rating: Number(rating),
      review_text: reviewText.trim(),
      city: (city || '').trim() || 'India',
      service_type: (serviceType || '').trim() || 'Inclusive Education Support',
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    let isSaved = false;
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('reviews').insert([{
          id: newReview.id,
          parent_registration_id: newReview.parent_registration_id,
          parent_name: newReview.parent_name,
          child_first_name: newReview.child_first_name || null,
          rating: newReview.rating,
          review_text: newReview.review_text,
          city: newReview.city,
          service_type: newReview.service_type,
          status: newReview.status,
          submitted_at: newReview.submitted_at
        }]);

        if (!error) {
          isSaved = true;
        } else {
          console.error('Supabase review insert error:', error);
        }
      } catch (dbErr) {
        console.error('Supabase review insert exception:', dbErr);
      }
    }

    if (!isSaved) {
      const db = readDb();
      if (!db.reviews) db.reviews = [];
      db.reviews.push(newReview);
      writeDb(db);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for sharing your experience! Your review has been submitted for administration review and will be published on the website upon approval.',
      review: newReview
    });
  } catch (error: any) {
    console.error('API Reviews POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchRegId = url.searchParams.get('regId');
    const authHeader = request.headers.get('Authorization');
    const isAdmin = authHeader === 'Bearer mock-admin-token-sb-2026';

    const isSupabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    );

    let reviews: ReviewRecord[] | null = null;

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('reviews').select('*');
        if (searchRegId) {
          query = query.eq('parent_registration_id', searchRegId);
        } else if (!isAdmin) {
          query = query.eq('status', 'approved');
        }

        const { data, error } = await query.order('submitted_at', { ascending: false });
        if (!error && data) {
          reviews = data as ReviewRecord[];
        }
      } catch (err) {
        console.warn('Supabase fetch reviews exception, falling back to local DB:', err);
      }
    }

    if (!reviews) {
      const db = readDb();
      if (searchRegId) {
        const existing = (db.reviews || []).find(r => r.parent_registration_id === searchRegId);
        return NextResponse.json({ success: true, exists: !!existing, review: existing });
      }

      if (isAdmin) {
        reviews = [...(db.reviews || [])].sort(
          (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
        );
      } else {
        reviews = (db.reviews || [])
          .filter(r => r.status === 'approved')
          .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
      }
    }

    if (searchRegId) {
      const existing = reviews[0] || null;
      return NextResponse.json({ success: true, exists: !!existing, review: existing });
    }

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    console.error('API Reviews GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
