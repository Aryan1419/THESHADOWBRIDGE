'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, ArrowRight, Lock, Sparkles, CreditCard, ShieldCheck, 
  AlertCircle, Info, UserCheck, Heart
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function PlacementFeeContent() {
  const searchParams = useSearchParams();

  const [loadingCheck, setLoadingCheck] = useState(true);
  const [gatedStatus, setGatedStatus] = useState<any | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [placementSuccess, setPlacementSuccess] = useState<any | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);

  const handleApplyPromoCode = async () => {
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;
    if (clean !== 'HI5000') {
      setPaymentError('Invalid Placement Promo Code. Code HI5000 is valid for parent placement fee waiver.');
      return;
    }

    setApplyingPromo(true);
    setPaymentError(null);

    try {
      const regId = record?.registrationId || record?.registration_id;
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'parent_placement_payment',
          regId,
          promoCode: 'HI5000'
        })
      });

      const vData = await res.json();
      if (!res.ok || !vData.success) {
        throw new Error(vData.error || 'Failed to apply promo code HI5000.');
      }

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setPlacementSuccess({
        registration_id: regId,
        status: vData.status || 'Placement Fee Waived (HI5000)',
        isWaived: true
      });
    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'Failed to apply promo code.');
    } finally {
      setApplyingPromo(false);
    }
  };

  useEffect(() => {
    const regId = searchParams.get('regId');
    if (!regId) {
      setCheckError('Missing Registration ID.');
      setLoadingCheck(false);
      return;
    }

    fetch(`/api/parent/gated-check?regId=${encodeURIComponent(regId)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.error || 'Registration record not found.');
        setGatedStatus(data);
      })
      .catch(err => {
        console.error(err);
        setCheckError(err.message);
      })
      .finally(() => {
        setLoadingCheck(false);
      });
  }, [searchParams]);

  const isShadow = gatedStatus?.subType === 'shadow';
  const feeAmount = isShadow ? 5000 : 3000;
  const isRegistrationSubmitted = gatedStatus?.isRegistrationSubmitted;
  const record = gatedStatus?.record;

  const handlePayPlacementFee = async () => {
    if (!record) return;
    setLoadingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create Razorpay order for placement fee
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: feeAmount })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize placement payment order.');
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay Payment SDK failed to load.');
      }

      // 3. Open Razorpay checkout
      const regId = record.registrationId || record.registration_id;
      const razorpayKey = orderData.keyId || orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TGX30c7BZKYQ6t';
      const orderAmount = orderData.order?.amount || orderData.amount;
      const orderId = orderData.order?.id || orderData.orderId;

      if (!razorpayKey || !orderAmount || !orderId) {
        throw new Error('Incomplete Razorpay order parameters returned by server.');
      }

      const options = {
        key: razorpayKey,
        amount: orderAmount,
        currency: 'INR',
        name: 'The Shadow Bridge',
        description: `Placement Fee (₹${feeAmount.toLocaleString('en-IN')}) - ${cleanRegId(regId)}`,
        image: '/favicon-192.png',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'parent_placement_payment',
                regId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const vData = await verifyRes.json();
            if (!verifyRes.ok || !vData.success) {
              throw new Error(vData.error || 'Failed to confirm placement payment.');
            }

            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            setPlacementSuccess(vData);
          } catch (err: any) {
            console.error(err);
            setPaymentError(err.message || 'Payment succeeded but status update failed. Please contact support.');
          } finally {
            setLoadingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPayment(false);
            setPaymentError('⚠️ Payment Cancelled: The placement fee payment window was closed before completion. No money was deducted. You can retry when ready.');
          }
        },
        prefill: {
          name: record.parentName || record.name,
          email: record.email,
          contact: record.phone
        },
        theme: {
          color: '#3B2A6B'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response: any) {
        setLoadingPayment(false);
        setPaymentError(`⚠️ Payment Not Completed: ${response.error?.description || response.error?.reason || 'Transaction was cancelled or declined by your bank.'}`);
      });

    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'An error occurred during placement fee payment.');
      setLoadingPayment(false);
    }
  };

  const cleanRegId = (rId: string) => rId || '';

  if (loadingCheck) {
    return (
      <section className="pt-32 pb-16 text-center text-sm font-bold text-primary flex-grow">
        Verifying Placement Fee Access...
      </section>
    );
  }

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-grow">
      
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-4 border border-primary/20">
          <Sparkles size={14} className="text-secondary" />
          Step 5 of 5 • Onboarding Placement Fee
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3">
          Lock In Your Educator Placement
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Complete the placement onboarding fee to initiate background-verified candidate matchmaking for your child.
        </p>
      </div>

      {/* PLACEMENT PAYMENT SUCCESS SCREEN */}
      {placementSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-brand-border shadow-xl text-center max-w-2xl mx-auto space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <UserCheck size={36} />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-primary">Placement Onboarding Confirmed!</h2>
            <p className="text-sm text-brand-muted mt-2">
              Thank you, {record?.parentName || 'Parent'}. Your placement fee payment has been received successfully.
            </p>
          </div>

          <div className="bg-brand-light p-6 rounded-2xl border border-brand-border text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-brand-border pb-2">
              <span className="text-brand-muted font-bold">Registration ID:</span>
              <span className="font-mono font-bold text-primary">{placementSuccess.registration_id}</span>
            </div>
            <div className="flex justify-between border-b border-brand-border pb-2">
              <span className="text-brand-muted font-bold">Updated Status:</span>
              <span className="font-bold text-emerald-600">{placementSuccess.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted font-bold">Placement Fee Paid:</span>
              <span className="font-bold text-brand-dark">₹{feeAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-left text-xs sm:text-sm leading-relaxed space-y-2">
            <p className="font-bold text-primary flex items-center gap-1.5">
              <Info size={16} />
              Matchmaking Active:
            </p>
            <p>Our clinical mentors are now pairing background-verified candidate profiles for <strong>{record?.childName || 'your child'}</strong>. Candidate profiles will be posted directly to your dashboard.</p>
          </div>

          <div className="flex justify-center pt-2">
            <Link
              href="/check-status"
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>View Live Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      ) : (
        /* GATED LOCK CHECK OR PLACEMENT FEE CHECKOUT CARD */
        <>
          {!isRegistrationSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-brand-border shadow-xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Lock size={32} />
              </div>

              <div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-3">
                  Registration Form Required First
                </span>
                <h2 className="font-serif text-2xl font-bold text-primary">Placement Fee Locked</h2>
                <p className="text-sm text-brand-muted mt-3 leading-relaxed">
                  Please submit Step 4 (Child Registration Form) after your consultation before accessing the placement fee payment.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/register/parent/form?regId=${encodeURIComponent(record?.registrationId || record?.registration_id || '')}`}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/95 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Go to Registration Form</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-brand-border max-w-xl mx-auto space-y-6"
            >
              <div className="flex justify-between items-center border-b border-brand-border pb-4">
                <div>
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2">
                    {isShadow ? 'Shadow Teacher Placement' : 'Home Tutor Placement'}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-primary">{record?.parentName || 'Parent'}</h2>
                  <p className="text-xs text-brand-muted">Child: <strong>{record?.childName || 'Child'}</strong> ({record?.childGrade || 'Grade'})</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-brand-muted font-bold block">Registration ID</span>
                  <span className="font-mono font-bold text-primary text-sm">{record?.registrationId || record?.registration_id}</span>
                </div>
              </div>

              <div className="bg-brand-light p-6 rounded-2xl border border-brand-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-brand-dark">Placement Onboarding Fee</span>
                  <span className="font-serif font-extrabold text-2xl text-primary">₹{feeAmount.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Separate from initial ₹99 consultation fee. Payable after consultation & registration form submission before candidate trial matching begins.
                </p>
              </div>

              {/* VIP / Promo Code Section */}
              <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-2xl space-y-2 text-left">
                <label className="block text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-secondary" />
                  <span>Have a Placement Promo / VIP Code?</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code (e.g. HI5000)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow p-2.5 bg-white border border-purple-200 rounded-xl text-xs font-mono font-bold text-purple-950 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    disabled={applyingPromo || !promoCode.trim()}
                    className="px-4 py-2.5 bg-secondary text-white rounded-xl font-bold text-xs hover:bg-secondary/90 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {applyingPromo ? 'Applying...' : 'Apply Code'}
                  </button>
                </div>
                <p className="text-[11px] text-purple-800">Entering code <strong>HI5000</strong> waives the placement onboarding fee for parents.</p>
              </div>

              {paymentError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              <button
                onClick={handlePayPlacementFee}
                disabled={loadingPayment}
                className="w-full btn-gradient py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {loadingPayment ? (
                  <span>Opening Secure Razorpay Payment...</span>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Pay ₹{feeAmount.toLocaleString('en-IN')} & Lock Placement Match</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </>
      )}

    </section>
  );
}

export default function PlacementFeePage() {
  return (
    <main className="min-h-screen bg-brand-light flex flex-col font-sans text-brand-dark">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-sm font-bold text-primary">Loading Placement Fee Page...</div>}>
        <PlacementFeeContent />
      </Suspense>
      <Footer />
    </main>
  );
}
