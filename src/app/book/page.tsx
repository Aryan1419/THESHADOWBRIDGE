'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, CreditCard, ShieldCheck, CheckCircle, ArrowRight, User, Phone, Mail, MapPin, Smile, MessageCircle, ShieldAlert, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CITY_LOCALITIES } from '@/lib/constants';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookConsultation() {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    preferredLocation: '',
    otherLocation: '',
    childAge: '',
    requirement: '',
    message: ''
  });

  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [receiptCode, setReceiptCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'city') {
      // Reset dependent location fields when city changes
      setFormData(prev => ({
        ...prev,
        city: value,
        preferredLocation: '',
        otherLocation: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4B1363', '#8A2BE2', '#C2185B']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4B1363', '#8A2BE2', '#C2185B']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const finalLocation = formData.preferredLocation === 'Other (please specify)'
    ? (formData.otherLocation.trim() ? `Other: ${formData.otherLocation.trim()}` : 'Other')
    : formData.preferredLocation;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentError(null);

    try {
      // 1. Create Order via Backend API
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!orderRes.ok) {
        const orderErr = await orderRes.json();
        throw new Error(orderErr.error || 'Failed to initiate payment transaction');
      }

      const orderData = await orderRes.json();
      const { orderId } = orderData;

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay payment SDK failed to load. Please check your internet connection.');
      }

      // 3. Trigger Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The Shadow Bridge',
        description: 'Diagnostic Child Assessment Consultation Fee',
        order_id: orderId,
        handler: async function (response: any) {
          setLoading(true);
          try {
            const res = await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...formData,
                preferredLocation: finalLocation,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (res.ok) {
              const result = await res.json();
              setReceiptCode(result.booking.booking_id);
              setStep(3);
              triggerConfetti();
            } else {
              const errData = await res.json();
              setPaymentError(errData.error || 'Booking registration failed. Please contact admin.');
            }
          } catch (err) {
            console.error(err);
            setPaymentError('Failed to record details after payment. Please contact support@theshadowbridge.com.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPaymentError('Payment was cancelled or closed. You can retry clicking "Pay ₹99 & Complete Booking".');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#4B1363'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-b from-[#F8F5FB] to-white flex-grow flex items-center">
        <div className="max-w-4xl mx-auto px-4 w-full">
          
          {/* Progress Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-primary mb-3">
              Book Assessment Consultation
            </h1>
            <p className="text-brand-muted text-sm sm:text-base max-w-md mx-auto">
              Evaluate your child's behavior, academic hurdles, and special needs programs with our expert mentors.
            </p>

            {/* Stepper Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8 max-w-sm mx-auto">
              <div className={`h-2.5 rounded-full flex-grow transition-all duration-300 ${step >= 1 ? 'bg-primary' : 'bg-brand-border'}`} />
              <div className={`h-2.5 rounded-full flex-grow transition-all duration-300 ${step >= 2 ? 'bg-primary' : 'bg-brand-border'}`} />
              <div className={`h-2.5 rounded-full flex-grow transition-all duration-300 ${step >= 3 ? 'bg-accent' : 'bg-brand-border'}`} />
            </div>
          </div>

          <div className="bg-white border border-brand-border rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Details */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-10"
                >
                  <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-6">
                    <span className="font-serif font-black text-primary text-xl flex items-center gap-2">
                      <Calendar className="text-accent animate-pulse" size={22} />
                      1. Child &amp; Parent Details
                    </span>
                    <span className="text-sm font-bold text-accent px-3 py-1 bg-accent/10 rounded-full">₹99 Only</span>
                  </div>

                  <form onSubmit={handleDetailsSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                          <User size={12} /> Parent Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Sona Sen"
                          className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                          <Phone size={12} /> Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 9812345678"
                          className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                          <Mail size={12} /> Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. sona@gmail.com"
                          className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                          <MapPin size={12} /> Preferred City
                        </label>
                        <select
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                        >
                          <option value="">Select City</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Pune">Pune</option>
                        </select>
                      </div>
                    </div>

                    {/* DEPENDENT LOCATION DROPDOWN (Appears after City is selected) */}
                    {formData.city && CITY_LOCALITIES[formData.city] && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-1"
                      >
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                            <MapPin size={12} className="text-secondary" /> Preferred Locality / Area in {formData.city}
                          </label>
                          <select
                            name="preferredLocation"
                            required
                            value={formData.preferredLocation}
                            onChange={handleInputChange}
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          >
                            <option value="">Select Preferred Location in {formData.city}</option>
                            {CITY_LOCALITIES[formData.city].map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Fallback custom location input when "Other" is selected */}
                        {formData.preferredLocation === 'Other (please specify)' && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-1.5"
                          >
                            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                              Specify Locality / Sector Name
                            </label>
                            <input
                              type="text"
                              name="otherLocation"
                              required
                              value={formData.otherLocation}
                              onChange={handleInputChange}
                              placeholder="e.g. Hitec City Extension, Sector 50"
                              className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                          <Smile size={12} /> Child's Age
                        </label>
                        <input
                          type="number"
                          name="childAge"
                          required
                          value={formData.childAge}
                          onChange={handleInputChange}
                          placeholder="e.g. 7"
                          className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                          <Sparkles size={12} /> Primary Requirement
                        </label>
                        <select
                          name="requirement"
                          required
                          value={formData.requirement}
                          onChange={handleInputChange}
                          className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                        >
                          <option value="">Select Option</option>
                          <option value="Classroom Shadow Teacher">Classroom Shadow Teacher</option>
                          <option value="Academic Home Tutor">Academic Home Tutor</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                        <MessageCircle size={12} /> Additional Information / Child Challenges
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please describe your child's milestones or any learning setbacks..."
                        className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-gradient w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Proceed to Secure Checkout
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: Secure Payment */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-10"
                >
                  <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-6">
                    <span className="font-serif font-black text-primary text-xl flex items-center gap-2">
                      <CreditCard className="text-accent" size={22} />
                      2. Secure Checkout
                    </span>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-brand-muted hover:text-primary font-bold underline cursor-pointer"
                    >
                      Edit details
                    </button>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 bg-brand-light/40 border border-brand-border rounded-2xl mb-6 space-y-3.5">
                    <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                      <span className="font-bold text-primary text-xs uppercase tracking-wider">Booking Description</span>
                      <span className="font-bold text-primary text-xs uppercase tracking-wider">Amount</span>
                    </div>
                    <div className="flex justify-between items-start text-xs text-brand-dark gap-4">
                      <div className="space-y-1">
                        <p className="font-bold text-primary text-sm">Assessment Consultation Fee</p>
                        <p><strong>Parent:</strong> {formData.name}</p>
                        <p><strong>Contact:</strong> {formData.phone} • {formData.email}</p>
                        <p><strong>Requirement:</strong> {formData.requirement}</p>
                        <p><strong>City Branch:</strong> {formData.city}</p>
                        {finalLocation && <p><strong>Preferred Area:</strong> {finalLocation}</p>}
                      </div>
                      <span className="font-black text-secondary text-lg shrink-0">₹99</span>
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test') && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-1.5">
                        <Info size={12} className="text-amber-600 shrink-0" />
                        <span>TEST MODE — No real payments are being processed</span>
                      </div>
                    )}

                    {paymentError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-1.5">
                        <ShieldAlert size={12} className="text-rose-600 shrink-0" />
                        <span>{paymentError}</span>
                      </div>
                    )}

                    {/* Trust indicator */}
                    <div className="flex items-center gap-2 text-xs text-brand-muted justify-center border-t border-brand-border/60 pt-4">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span>Secured 256-bit encrypted checkout gateway.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gradient w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Processing transaction...' : 'Pay ₹99 & Complete Booking'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: Success Receipt */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-10 text-center space-y-6"
                >
                  <CheckCircle className="mx-auto text-emerald-600 animate-bounce" size={56} />
                  <div className="space-y-2">
                    <h2 className="font-serif font-black text-primary text-2xl">Consultation Confirmed!</h2>
                    <p className="text-sm text-brand-muted">
                      Your payment of ₹99 was processed successfully. Receipt code: <span className="font-mono font-bold text-accent">{receiptCode}</span>
                    </p>
                  </div>

                  <div className="bg-brand-light/30 border border-brand-border p-5 rounded-2xl max-w-sm mx-auto text-left space-y-3 text-sm">
                    <p className="border-b border-brand-border/60 pb-2 font-bold text-primary">Assessment Details</p>
                    <p className="text-brand-dark"><strong>Parent Name:</strong> {formData.name}</p>
                    <p className="text-brand-dark"><strong>Phone Number:</strong> {formData.phone}</p>
                    <p className="text-brand-dark"><strong>City Branch:</strong> {formData.city}</p>
                    {finalLocation && <p className="text-brand-dark"><strong>Preferred Area:</strong> {finalLocation}</p>}
                    <p className="text-brand-dark"><strong>Requirement:</strong> {formData.requirement}</p>
                  </div>

                  <p className="text-xs text-brand-muted max-w-md mx-auto">
                    A call slot will be assigned and our Lead Mentor Pratibha Mishra will phone you on the registered contact details within 12 hours.
                  </p>

                  <div className="pt-4 flex justify-center">
                    <Link
                      href="/"
                      className="px-8 py-3.5 bg-primary text-white hover:bg-primary/95 rounded-xl font-bold text-sm transition-all shadow-md"
                    >
                      Back to Homepage
                    </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
