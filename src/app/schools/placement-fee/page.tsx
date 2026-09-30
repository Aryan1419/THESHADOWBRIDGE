'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { 
  Building2, CheckCircle2, Lock, ShieldCheck, AlertCircle, ArrowRight, Sparkles, CreditCard
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    if (typeof document !== 'undefined') {
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        if ((window as any).Razorpay) {
          resolve(true);
          return;
        }
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    } else {
      resolve(false);
    }
  });
};

function SchoolPlacementFeeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regId = searchParams.get('regId') || '';

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    // Preload Razorpay SDK as soon as page mounts
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (!regId) {
      setErrorMsg('Missing Registration ID. Please check your link or look up your requirement status.');
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        const res = await fetch(`/api/register?regId=${encodeURIComponent(regId)}`);
        const data = await res.json();
        if (!res.ok || !data.success || !data.record) {
          throw new Error(data.error || 'School registration record not found.');
        }
        setRecord(data.record);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to fetch registration record.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [regId]);

  const handlePayPlacementFee = async () => {
    if (!record) return;
    setPaying(true);
    setErrorMsg(null);

    const teachersCount = Math.max(1, Number(record.teachersCount || record.teachers_count || 1));
    const placementAmount = 5000 * teachersCount;

    try {
      // 1. Ensure Razorpay SDK is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.');
      }

      // 2. Create Razorpay order for dynamic placement fee (₹5,000 * teachers_count)
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: placementAmount,
          regId: record.registration_id,
          parentName: record.school_name || record.contact_name,
          phone: record.phone,
          email: record.email,
          serviceNeeded: `School Shadow Teacher Placement (${teachersCount} teachers)`,
          type: 'school_placement'
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      const razorpayKey = orderData.keyId || orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TGX30c7BZKYQ6t';
      const orderAmount = orderData.order?.amount || orderData.amount;
      const orderId = orderData.order?.id || orderData.orderId;

      if (!razorpayKey || !orderAmount || !orderId) {
        throw new Error('Incomplete Razorpay order parameters returned by server.');
      }

      const options = {
        key: razorpayKey,
        amount: orderAmount,
        currency: orderData.currency || 'INR',
        name: 'The Shadow Bridge',
        description: `School One-time Placement Fee (₹${placementAmount.toLocaleString('en-IN')}) [${regId}]`,
        image: '/favicon-512.png',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payments/verify-school-placement', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registrationId: regId,
                amount: placementAmount,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Placement payment verification failed.');
            }

            // Redirect to unlocked registration form
            router.push(`/schools/form?regId=${encodeURIComponent(regId)}`);
          } catch (err: any) {
            console.error('Placement Verification Error:', err);
            setErrorMsg(err.message || 'Verification failed. Please contact support.');
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: record.contactName || record.contact_name || '',
          email: record.email || '',
          contact: record.phone || ''
        },
        theme: {
          color: '#3B2A6B'
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          }
        }
      };

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          console.error('Razorpay Payment Failed:', resp.error);
          setErrorMsg(resp.error?.description || 'Payment was cancelled or failed.');
          setPaying(false);
        });
        rzp.open();
      } else {
        throw new Error('Razorpay SDK failed to load. Please refresh the page.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to initiate placement fee payment.');
      setPaying(false);
    }
  };

  const teachersCount = Math.max(1, Number(record?.teachersCount || record?.teachers_count || 1));
  const placementAmount = record?.placement_amount || record?.placementAmount || (5000 * teachersCount);

  return (
    <div className="min-h-screen bg-brand-light/30 flex flex-col font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />

      <main className="flex-grow pt-28 sm:pt-36 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="bg-white border border-brand-border rounded-3xl p-12 text-center shadow-lg">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-primary">Loading Registration Record...</p>
            </div>
          ) : errorMsg && !record ? (
            <div className="bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-lg space-y-4">
              <AlertCircle size={40} className="text-rose-500 mx-auto" />
              <h2 className="font-serif text-xl font-bold text-rose-950">Record Not Found</h2>
              <p className="text-xs text-rose-800">{errorMsg}</p>
              <Link href="/check-status" className="btn-gradient inline-flex px-6 py-2.5 rounded-xl font-bold text-xs">
                Look Up Requirement Status
              </Link>
            </div>
          ) : record?.placementPaid || record?.placement_paid ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 text-center shadow-xl space-y-4">
              <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
              <h2 className="font-serif text-2xl font-black text-emerald-950">Placement Fee Already Paid!</h2>
              <p className="text-xs text-emerald-900">
                Your one-time placement fee of ₹{placementAmount.toLocaleString('en-IN')} for <strong>{record.schoolName || record.school_name}</strong> ({teachersCount} Shadow Teacher{teachersCount > 1 ? 's' : ''}) is verified.
              </p>
              <Link
                href={`/schools/form?regId=${encodeURIComponent(regId)}`}
                className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs shadow-lg"
              >
                <span>Proceed to Registration Form</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Section C: AFTER CONSULTATION - REGISTRATION UNLOCK & PAYMENT */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-xl text-left space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Lock size={24} />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-xs font-black uppercase tracking-wider">
                      Registration Unlocked!
                    </span>
                    <h2 className="font-serif text-2xl font-black text-emerald-950 mt-1">
                      One-time Placement Fee
                    </h2>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Thank you for your time during our consultation call for <strong>{record.schoolName || record.school_name}</strong>. Please complete the registration by paying the one-time placement fee.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">One-time Placement Fee</p>
                      <p className="text-3xl font-black text-primary mt-1">₹ {placementAmount.toLocaleString('en-IN')}/-</p>
                      <span className="text-xs text-brand-muted font-bold block mt-0.5">
                        ₹5,000 × {teachersCount} {teachersCount === 1 ? 'Shadow Teacher' : 'Shadow Teachers'}
                      </span>
                    </div>
                    <span className="text-xs text-brand-muted font-semibold bg-brand-light px-2.5 py-1 rounded-md border border-brand-border">
                      Non-refundable
                    </span>
                  </div>

                  <div className="border-t border-brand-border/40 pt-3 text-xs text-brand-dark/80 space-y-1.5 font-medium">
                    <p>• <strong>School:</strong> {record.schoolName || record.school_name}</p>
                    <p>• <strong>Registration ID:</strong> <span className="font-mono font-bold text-secondary">{regId}</span></p>
                    <p>• <strong>Shadow Teachers Count:</strong> {teachersCount}</p>
                    <p>• <strong>Fee Breakdown:</strong> ₹5,000 × {teachersCount} = ₹{placementAmount.toLocaleString('en-IN')}</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={14} className="text-rose-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    onClick={handlePayPlacementFee}
                    disabled={paying}
                    className="btn-gradient w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {paying ? (
                      <span>Processing Payment Gateway...</span>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Proceed to Pay ₹{placementAmount.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 flex items-center justify-center gap-4 text-xs text-brand-muted font-medium">
                    <span>Payment Methods:</span>
                    <span className="font-bold text-primary">UPI</span> •
                    <span className="font-bold text-primary">Card</span> •
                    <span className="font-bold text-primary">Net Banking</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-900 font-bold justify-center pt-1">
                  <ShieldCheck size={16} className="text-emerald-700" />
                  <span>Once payment is successful, the full registration form will open automatically.</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SchoolPlacementFeePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-light/30 flex items-center justify-center text-xs font-bold text-primary">Loading Placement Fee Portal...</div>}>
      <SchoolPlacementFeeContent />
    </Suspense>
  );
}
