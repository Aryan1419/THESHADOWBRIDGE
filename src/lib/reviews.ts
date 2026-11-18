import { readDb, ReviewRecord } from '@/lib/db';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export interface ApprovedReview {
  id: string;
  parent_name: string;
  child_first_name?: string;
  rating: number;
  review_text: string;
  city: string;
  service_type: string;
  status: 'approved';
  submitted_at: string;
}

export async function getApprovedReviews(): Promise<ApprovedReview[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('submitted_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data as ApprovedReview[];
      }
    } catch (err) {
      console.warn('getApprovedReviews Supabase fallback:', err);
    }
  }

  try {
    const db = readDb();
    return ((db.reviews || []) as ReviewRecord[])
      .filter((r) => r.status === 'approved')
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()) as ApprovedReview[];
  } catch {
    return [];
  }
}
