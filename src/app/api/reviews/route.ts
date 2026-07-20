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

    const isSupabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    );

    let parentRecord: any = null;
    let isShadow = false;

    // 2. Query registration from Supabase or local DB
    if (isSupabaseConfigured) {
      try {
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

        if (dbShadow) {
          parentRecord = toCamelCase(dbShadow);
          isShadow = true;
        } else if (dbTutor) {
          parentRecord = toCamelCase(dbTutor);
          isShadow = false;
        }
      } catch (err) {
        console.warn('Supabase parent lookup failed, falling back to local DB:', err);
      }
    }

    if (!parentRecord) {
      const localDb = readDb();
      const localShadow = (localDb.parent_shadow_requests || []).find(r => r.registration_id === registrationId);
      const localTutor = (localDb.parent_tutor_requests || []).find(r => r.registration_id === registrationId);

      if (localShadow) {
        parentRecord = localShadow;
        isShadow = true;
      } else if (localTutor) {
        parentRecord = localTutor;
        isShadow = false;
      }
    }

    if (!parentRecord) {
      return NextResponse.json({ error: 'Parent registration record not found for this ID.' }, { status: 404 });
    }

    // 3. Verify status
    if (parentRecord.status !== 'Support Started' && parentRecord.status !== 'Active') {
      return NextResponse.json(
        { error: 'Reviews can only be submitted after your child\'s educational support has successfully started or is active.' },
        { status: 400 }
      );
    }

    // 4. Check for duplicate reviews in Supabase
    let isDuplicate = false;
    if (isSupabaseConfigured) {
      try {
        const { data: existing } = await supabase
          .from('reviews')
          .select('id')
          .eq('parent_registration_id', registrationId)
          .maybeSingle();
        if (existing) isDuplicate = true;
      } catch (e) {
        console.warn('Supabase duplicate review check exception:', e);
      }
    }

    if (!isDuplicate) {
      const db = readDb();
      if ((db.reviews || []).some(r => r.parent_registration_id === registrationId)) {
        isDuplicate = true;
      }
    }

    if (isDuplicate) {
      return NextResponse.json({ error: 'A review has already been submitted for this registration ID.' }, { status: 400 });
    }

    // 5. Create new review
    const newReview: ReviewRecord = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      parent_registration_id: registrationId,
      parent_name: parentRecord.parentName || parentRecord.parent_name,
      child_first_name: childFirstName ? childFirstName.trim() : undefined,
      rating: Number(rating),
      review_text: reviewText.trim(),
      city: parentRecord.city,
      service_type: isShadow ? 'Shadow Teacher' : 'Home Tutor',
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
      db.reviews.push(newReview);
      writeDb(db);
    }

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
