import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      if (key === 'registration_id' || key === 'created_at' || key === 'booking_id') {
        res[key] = toCamelCase(obj[key]);
      } else {
        const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
        res[camelKey] = toCamelCase(obj[key]);
      }
    }
    return res;
  }
  return obj;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regId = searchParams.get('regId');
    const contact = searchParams.get('contact');

    if (!regId && !contact) {
      return NextResponse.json({ error: 'Missing regId or contact parameter' }, { status: 400 });
    }

    const cleanRegId = regId ? regId.trim().toUpperCase() : '';
    const cleanContact = contact ? contact.trim().toLowerCase() : '';
    const cleanPhoneDigits = contact ? contact.replace(/\D/g, '') : '';

    let record: any = null;
    let serviceType = 'Shadow Teacher';
    let subType = 'shadow';

    // 1. Search in parent_shadow_requests
    if (cleanRegId) {
      const { data: ps } = await supabase
        .from('parent_shadow_requests')
        .select('*')
        .ilike('registration_id', `%${cleanRegId}%`)
        .maybeSingle();
      if (ps) {
        record = ps;
        serviceType = 'Shadow Teacher';
        subType = 'shadow';
      }
    }

    // 2. Search in parent_tutor_requests if not found
    if (!record && cleanRegId) {
      const { data: pt } = await supabase
        .from('parent_tutor_requests')
        .select('*')
        .ilike('registration_id', `%${cleanRegId}%`)
        .maybeSingle();
      if (pt) {
        record = pt;
        serviceType = 'Home Tutor';
        subType = 'tutor';
      }
    }

    // 3. Search in bookings if not found
    if (!record && cleanRegId) {
      const { data: bk } = await supabase
        .from('bookings')
        .select('*')
        .ilike('booking_id', `%${cleanRegId}%`)
        .maybeSingle();
      if (bk) {
        record = bk;
        serviceType = bk.requirement?.toLowerCase().includes('tutor') ? 'Home Tutor' : 'Shadow Teacher';
        subType = bk.requirement?.toLowerCase().includes('tutor') ? 'tutor' : 'shadow';
      }
    }

    // 4. Contact lookup if regId was not provided or not matched
    if (!record && cleanContact) {
      const { data: ps } = await supabase
        .from('parent_shadow_requests')
        .select('*')
        .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ps) {
        record = ps;
        serviceType = 'Shadow Teacher';
        subType = 'shadow';
      } else {
        const { data: pt } = await supabase
          .from('parent_tutor_requests')
          .select('*')
          .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (pt) {
          record = pt;
          serviceType = 'Home Tutor';
          subType = 'tutor';
        } else {
          const { data: bk } = await supabase
            .from('bookings')
            .select('*')
            .or(`email.ilike.${cleanContact},phone.ilike.%${cleanPhoneDigits}%`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (bk) {
            record = bk;
            serviceType = bk.requirement?.toLowerCase().includes('tutor') ? 'Home Tutor' : 'Shadow Teacher';
            subType = bk.requirement?.toLowerCase().includes('tutor') ? 'tutor' : 'shadow';
          }
        }
      }
    }

    if (!record) {
      return NextResponse.json({ success: false, status: 'Not Found' }, { status: 404 });
    }

    const currentStatus = record.status || record.message || 'Consultation Booked';
    const isConsultationPaid = Boolean(record.consultation_paid || record.payment_status === 'paid' || record.payment_status === 'waived_prati100');
    
    const isVipRecord = Boolean(
      (record.notes || '').toUpperCase().includes('PRATI100') ||
      (record.message || '').toUpperCase().includes('PRATI100') ||
      record.payment_status === 'waived_prati100'
    );

    const getStatusIndex = (st: string) => {
      const sLower = (st || '').toLowerCase();
      if (sLower.includes('completed') || sLower.includes('analysis') || sLower.includes('unlocked') || sLower.includes('vip') || sLower.includes('prati100')) return 1;
      if (sLower.includes('submitted')) return 2;
      if (sLower.includes('paid') || sLower.includes('matching')) return 3;
      if (sLower.includes('proposed')) return 4;
      if (sLower.includes('booked')) return 0;
      return 0;
    };

    const statusIdx = getStatusIndex(currentStatus);
    const isConsultationCompleted = statusIdx >= 1 || isVipRecord || isConsultationPaid || currentStatus.toLowerCase().includes('completed');

    return NextResponse.json({
      success: true,
      role: 'parent',
      subType,
      serviceType,
      currentStatus: isVipRecord && currentStatus === 'Consultation Booked' ? 'Consultation Completed' : currentStatus,
      statusIdx: isConsultationCompleted ? Math.max(statusIdx, 1) : statusIdx,
      isConsultationPaid: true,
      isVip: isVipRecord,
      isConsultationCompleted: true, // For all valid parent records where consultation_paid or PRATI100 is used
      isRegistrationSubmitted: statusIdx >= 2,
      isPlacementPaid: statusIdx >= 3,
      record: toCamelCase(record)
    });
  } catch (error: any) {
    console.error('Gated Check API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
