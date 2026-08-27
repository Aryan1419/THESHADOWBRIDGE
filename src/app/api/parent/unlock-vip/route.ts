import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { regId, contact, promoCode } = body;

    const cleanPromoCode = (promoCode || '').trim().toUpperCase();
    const isShadowVip = cleanPromoCode === 'SHADOW100';
    const isTherapyCoupon = cleanPromoCode === 'THERAPY99';
    if (!isShadowVip && !isTherapyCoupon) {
      return NextResponse.json({ error: 'Invalid Promo/Coupon Code. Please check and try again.' }, { status: 400 });
    }

    if (!regId && !contact) {
      return NextResponse.json({ error: 'Missing Registration ID or contact details.' }, { status: 400 });
    }

    const cleanRegId = regId ? regId.trim().toUpperCase() : '';
    const cleanContact = contact ? contact.trim().toLowerCase() : '';
    const cleanPhoneDigits = contact ? contact.replace(/\D/g, '') : '';

    let record: any = null;
    let table = isTherapyCoupon ? 'parent_therapy_requests' : 'parent_shadow_requests';

    if (isTherapyCoupon) {
      // THERAPY99 strictly unlocks ONLY parent_therapy_requests
      if (cleanRegId) {
        const { data: pth } = await supabase
          .from('parent_therapy_requests')
          .select('*')
          .ilike('registration_id', `%${cleanRegId}%`)
          .maybeSingle();
        if (pth) {
          record = pth;
          table = 'parent_therapy_requests';
        }
      }

      if (!record && cleanContact) {
        const { data: pth } = await supabase
          .from('parent_therapy_requests')
          .select('*')
          .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
          .maybeSingle();
        if (pth) {
          record = pth;
          table = 'parent_therapy_requests';
        }
      }

      if (!record) {
        return NextResponse.json({ error: 'No matching therapy consultation record found. Note: Coupon THERAPY99 is strictly for Therapy bookings only.' }, { status: 404 });
      }
    } else {
      // SHADOW100 strictly unlocks ONLY shadow or tutor requests
      if (cleanRegId) {
        const { data: ps } = await supabase
          .from('parent_shadow_requests')
          .select('*')
          .ilike('registration_id', `%${cleanRegId}%`)
          .maybeSingle();
        if (ps) {
          record = ps;
          table = 'parent_shadow_requests';
        } else {
          const { data: pt } = await supabase
            .from('parent_tutor_requests')
            .select('*')
            .ilike('registration_id', `%${cleanRegId}%`)
            .maybeSingle();
          if (pt) {
            record = pt;
            table = 'parent_tutor_requests';
          }
        }
      }

      if (!record && cleanContact) {
        const { data: ps } = await supabase
          .from('parent_shadow_requests')
          .select('*')
          .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
          .maybeSingle();
        if (ps) {
          record = ps;
          table = 'parent_shadow_requests';
        } else {
          const { data: pt } = await supabase
            .from('parent_tutor_requests')
            .select('*')
            .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
            .maybeSingle();
          if (pt) {
            record = pt;
            table = 'parent_tutor_requests';
          }
        }
      }

      if (!record) {
        return NextResponse.json({ error: 'No matching Shadow Teacher or Home Tutor record found. Note: Code SHADOW100 is strictly for Shadow and Tutor bookings.' }, { status: 404 });
      }
    }

    const targetRegId = record.registration_id || record.booking_id;
    const codeNote = isTherapyCoupon ? 'Unlocked via Coupon THERAPY99' : 'Unlocked via VIP Code SHADOW100';

    // Update status to Consultation Completed
    const { error: updateErr } = await supabase
      .from(table)
      .update({
        status: 'Consultation Completed',
        consultation_paid: true,
        notes: (record.notes || '') + ` | ${codeNote}`
      })
      .eq('id', record.id);

    if (updateErr) throw updateErr;

    return NextResponse.json({
      success: true,
      registration_id: targetRegId,
      redirectUrl: `/register/parent/form?regId=${encodeURIComponent(targetRegId)}`,
      message: isTherapyCoupon 
        ? 'Coupon THERAPY99 applied successfully! Child registration form unlocked.' 
        : 'VIP Code SHADOW100 applied successfully! Child registration form unlocked.'
    });

  } catch (error: any) {
    console.error('Unlock VIP API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
