'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, ArrowRight, User, Phone, Mail, MapPin, 
  Sparkles, CreditCard, ShieldCheck, Heart, Info, AlertCircle, HelpCircle, Ticket
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

export default function ParentConsultationStep1() {
  const router = useRouter();
  const [serviceNeeded, setServiceNeeded] = useState<'Shadow Teacher' | 'Home Tutor'>('Shadow Teacher');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [promoCode, setPromoCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  const cleanPromoCode = promoCode.trim().toUpperCase();
  const isVipCode = cleanPromoCode === 'SHADOW100';
  const isTherapyCodeEntered = cleanPromoCode === 'THERAPY99';

  const handleConsultationPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim() || !email.trim() || !city.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (isTherapyCodeEntered) {
      setErrorMsg('This code is not valid for Shadow Teacher or Home Tutor requests.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // IF VIP PROMO CODE SHADOW100 IS APPLIED -> BYPASS RAZORPAY & REDIRECT DIRECTLY
      if (isVipCode) {
        const registerRes = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'parent_consultation',
            parentName: parentName.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            city: city.trim(),
            serviceNeeded,
            promoCode: 'SHADOW100'
          })
        });

        const regData = await registerRes.json();
        if (!registerRes.ok || !regData.success) {
          throw new Error(regData.error || 'Failed to apply coupon/access code.');
        }

        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        const redirectTarget = regData.redirectUrl || `/register/parent/form?regId=${encodeURIComponent(regData.registration_id)}`;
        
        setTimeout(() => {
          router.push(redirectTarget);
        }, 1200);

        setBookingSuccess({ ...regData, isVipRedirect: true });
        return;
      }

      // 1. Create Razorpay order for ₹99
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 99 })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize consultation payment order.');
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay Payment SDK failed to load. Please check internet connection.');
      }

      // 3. Launch Razorpay Checkout
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
        description: `₹99 Consultation Booking (${serviceNeeded})`,
        image: '/favicon-192.png',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Save consultation booking to database
            const registerRes = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'parent_consultation',
                parentName: parentName.trim(),
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                city: city.trim(),
                serviceNeeded,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const regData = await registerRes.json();
            if (!registerRes.ok || !regData.success) {
              throw new Error(regData.error || 'Failed to save consultation booking.');
            }

            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setBookingSuccess(regData);
          } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || 'Payment completed but saving booking failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setErrorMsg('⚠️ Payment Cancelled: The payment window was closed before completion. No money was deducted. You can try again whenever you are ready.');
          }
        },
        prefill: {
          name: parentName,
          email: email,
          contact: phone
        },
        theme: {
          color: '#3B2A6B'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response: any) {
        setLoading(false);
        setErrorMsg(`⚠️ Payment Not Completed: ${response.error?.description || response.error?.reason || 'Transaction was cancelled or declined by your bank.'}`);
      });

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during consultation booking.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-light flex flex-col font-sans text-brand-dark">
      <Navbar />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-grow">
        
        {/* Step Indicator Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-4 border border-primary/20">
            <Sparkles size={14} className="text-secondary" />
            Step 1 of 5 • Parent Consultation Booking
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3">
            Book Your 1-on-1 Parent Consultation
          </h1>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            Begin your journey with Founder & Lead Mentor Pratibha Mishra to discuss your child's needs and receive tailored guidance before placement.
          </p>
        </div>

        {/* BOOKING SUCCESS SCREEN */}
        {bookingSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 border border-brand-border shadow-xl text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={36} />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-primary">Consultation Booking Confirmed!</h2>
              <p className="text-sm text-brand-muted mt-2">
                Thank you, {parentName}. We have received your ₹99 consultation booking fee.
              </p>
            </div>

            <div className="bg-brand-light p-6 rounded-2xl border border-brand-border text-left space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-brand-border pb-2">
                <span className="text-brand-muted font-bold">Registration ID:</span>
                <span className="font-mono font-bold text-primary">{bookingSuccess.registration_id}</span>
              </div>
              <div className="flex justify-between border-b border-brand-border pb-2">
                <span className="text-brand-muted font-bold">Booking ID:</span>
                <span className="font-mono font-bold text-primary">{bookingSuccess.booking_id}</span>
              </div>
              <div className="flex justify-between border-b border-brand-border pb-2">
                <span className="text-brand-muted font-bold">Selected Service:</span>
                <span className="font-bold text-brand-dark">{serviceNeeded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted font-bold">Consultation Status:</span>
                <span className="font-bold text-emerald-600">Consultation Booked (Pending Call)</span>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-left text-xs sm:text-sm leading-relaxed space-y-2">
              <p className="font-bold text-primary flex items-center gap-1.5">
                <Info size={16} />
                Next Steps Guidelines:
              </p>
              <p>1. Founder Pratibha Mishra will personally call you on <strong>{phone}</strong> within 24 hours to conduct your assessment consultation.</p>
              <p>2. Once your consultation is completed, Pratibha will mark it as completed in the system, unlocking your detailed Child Registration Form (Step 4).</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href={`/check-status`}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Track Application Status</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* STEP 1 CONSULTATION FORM CARD */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-brand-border max-w-2xl mx-auto"
          >
            <form onSubmit={handleConsultationPayment} className="space-y-6">

              {/* Service Selection Radio Cards */}
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-3">
                  Select Required Support Service <span className="text-rose-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setServiceNeeded('Shadow Teacher')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      serviceNeeded === 'Shadow Teacher'
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                        : 'border-brand-border bg-white hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-primary">Shadow Teacher</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        serviceNeeded === 'Shadow Teacher' ? 'border-primary bg-primary text-white' : 'border-brand-border'
                      }`}>
                        {serviceNeeded === 'Shadow Teacher' && <CheckCircle size={12} />}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      1-on-1 special education classroom shadow support for neurodivergent children in school settings.
                    </p>
                  </div>

                  <div
                    onClick={() => setServiceNeeded('Home Tutor')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      serviceNeeded === 'Home Tutor'
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                        : 'border-brand-border bg-white hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-primary">Home Tutor</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        serviceNeeded === 'Home Tutor' ? 'border-primary bg-primary text-white' : 'border-brand-border'
                      }`}>
                        {serviceNeeded === 'Home Tutor' && <CheckCircle size={12} />}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Personalized academic home tutoring for concept clarity, homework assistance, and exam preparation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Parent Contact Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    Parent Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Meera Sharma"
                      className="w-full pl-10 pr-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-10 pr-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. meera.sharma@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>City / Location <span className="text-rose-500">*</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                      <MapPin size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Delhi NCR, Noida, Gurgaon, Mumbai"
                      className="w-full pl-10 pr-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* VIP Access Code / Referral Code Field */}
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Ticket size={14} className="text-accent" />
                      Have a VIP Access Code / Referral Code?
                    </span>
                    <span className="text-[10px] text-brand-muted font-normal">Optional</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter VIP / Referral Code"
                      className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-mono font-bold text-primary placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-accent/40 uppercase"
                    />
                  </div>
                  <p className="text-[11px] text-brand-muted mt-1 font-medium">Please enter your code in <strong>ALL CAPS</strong>.</p>
                  {isVipCode && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                      <Sparkles size={16} className="text-emerald-600 flex-shrink-0" />
                      <span>✨ VIP Access Code Applied! ₹99 Consultation Fee Waived (100% OFF).</span>
                    </motion.div>
                  )}
                  {isTherapyCodeEntered && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2"
                    >
                      <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                      <span>This code is not valid for Shadow Teacher or Home Tutor requests.</span>
                    </motion.div>
                  )}
                  {cleanPromoCode && !isVipCode && !isTherapyCodeEntered && (
                    <p className="text-[11px] text-amber-700 font-semibold mt-1">
                      Invalid or unrecognized code. Please check and try again.
                    </p>
                  )}
                </div>
              </div>

              {/* Consultation Fee Card Notice */}
              <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                isVipCode ? 'bg-emerald-50/70 border-emerald-300' : 'bg-brand-light border-brand-border'
              }`}>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">
                    {isVipCode ? 'VIP Access Unlocked' : 'Consultation Fee'}
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {isVipCode 
                      ? 'Direct registration access granted by Founder Pratibha Mishra' 
                      : 'Charged ONCE per parent • Includes 1-on-1 call with Founder'}
                  </p>
                </div>
                <div className="text-right">
                  {isVipCode ? (
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-extrabold text-emerald-600 font-serif">FREE</span>
                      <span className="text-[10px] text-emerald-700 font-bold line-through">₹99</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl font-extrabold text-primary font-serif">₹99</span>
                      <span className="text-[10px] text-brand-muted block font-bold">One-time fee</span>
                    </>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs font-medium leading-relaxed flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Pay Consultation Fee or Submit VIP Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>{isVipCode ? 'Unlocking Registration Form...' : 'Processing Payment Order...'}</span>
                ) : isVipCode ? (
                  <>
                    <Sparkles size={18} />
                    <span>Unlock &amp; Go to Registration Form (VIP Access)</span>
                    <ArrowRight size={18} />
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Pay ₹99 &amp; Book Consultation</span>
                  </>
                )}
              </button>

            </form>
          </motion.div>
        )}

      </section>

      <Footer />
    </main>
  );
}
