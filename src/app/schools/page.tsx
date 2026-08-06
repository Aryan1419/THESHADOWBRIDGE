'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Building2, PhoneCall, CheckCircle2, Sparkles, ShieldCheck, Clock, Award, 
  HelpCircle, ArrowRight, Layers, FileText, Check, Plus, Minus, Calendar, Users, Briefcase, AlertCircle
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SchoolsPage() {
  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('Principal');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [levelsRequired, setLevelsRequired] = useState<string[]>(['Primary']);
  const [specificGrades, setSpecificGrades] = useState<string[]>(['Grade / Class 1']);
  const [teachersCount, setTeachersCount] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ registrationId: string } | null>(null);

  const levelOptions = ['Pre-Primary', 'Primary', 'Secondary', 'Higher Secondary'];
  const gradeOptions = Array.from({ length: 12 }, (_, i) => `Grade / Class ${i + 1}`);

  const handleLevelToggle = (level: string) => {
    setLevelsRequired(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const handleGradeToggle = (grade: string) => {
    setSpecificGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please fill in all required fields marked with *');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Create Razorpay order for ₹199 school consultation fee
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 199 })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      const options = {
        key: orderData.keyId || orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'The Shadow Bridge',
        description: 'School Requirement Consultation Booking Fee (₹199)',
        image: '/favicon-512.png',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment & save school request
            const verifyRes = await fetch('/api/payments/verify-school-consultation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                formData: {
                  schoolName: schoolName.trim(),
                  contactName: contactName.trim(),
                  designation,
                  email: email.trim(),
                  phone: phone.trim(),
                  city: city.trim(),
                  preferredLocation: preferredLocation.trim(),
                  levelsRequired,
                  specificGrades,
                  teachersCount,
                  startDate,
                  notes
                },
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            setSuccessData({ registrationId: verifyData.registrationId });
          } catch (err: any) {
            console.error('Payment Verification Error:', err);
            setErrorMsg(err.message || 'Verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: contactName,
          email: email,
          contact: phone
        },
        theme: {
          color: '#3B2A6B'
        }
      };

      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK failed to load. Please refresh the page.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to initiate consultation booking.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light/30 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section (Section A) */}
      <section className="pt-28 sm:pt-36 pb-12 bg-gradient-to-b from-white via-brand-light/50 to-white border-b border-brand-border/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-extrabold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Collaboration — Schools</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-[9px] font-black">NEW</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-primary leading-tight tracking-tight">
                Partner with us to provide the right support for your students.
              </h1>

              <p className="text-sm sm:text-base text-brand-dark/80 font-medium leading-relaxed max-w-2xl">
                We empower schools with background-verified, professionally trained Shadow Teachers and Special Education Assistants to ensure every child thrives in inclusive classrooms.
              </p>

              {/* Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  'Expert & Verified Shadow Teachers',
                  'Hassle-free Hiring Process',
                  'One-on-One School Support',
                  'Quick Replacement Guarantee',
                  'Trusted by Leading Schools'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-primary">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <a
                  href="#requirement-form"
                  className="btn-gradient inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Building2 size={18} />
                  <span>Partner With Us</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img 
                  src="/images/teacher_child.png" 
                  alt="School Collaboration - The Shadow Bridge" 
                  className="w-full h-[320px] sm:h-[380px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="font-serif text-lg font-bold">Inclusive School Support</p>
                    <p className="text-xs text-white/90">Personalized 1-on-1 assistance tailored to classroom environments.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Feature Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[
              {
                icon: ShieldCheck,
                title: 'Quality Assured',
                desc: 'All our shadow teachers are verified, trained & experienced.'
              },
              {
                icon: Users,
                title: 'Tailored Support',
                desc: 'We understand each school\'s unique classroom needs.'
              },
              {
                icon: FileText,
                title: 'Transparent Process',
                desc: 'Clear communication and documentation at every step.'
              },
              {
                icon: Clock,
                title: 'Flexible & Reliable',
                desc: 'Ongoing support & quick replacements whenever needed.'
              }
            ].map((card, i) => {
              const IconComp = card.icon;
              return (
                <div key={i} className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between hover:border-primary/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-brand-light text-primary flex items-center justify-center mb-3">
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-primary">{card.title}</h3>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Content Area: Form (Section B) & Process Flow (Section F) */}
      <section id="requirement-form" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Form (Section B) */}
            <div className="lg:col-span-7 bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xl text-left">
              <div className="border-b border-brand-border/60 pb-5 mb-6">
                <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20">
                  Step 1: Requirement Consultation
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-primary mt-2">
                  Tell Us About Your Requirement
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-1">
                  Fill in the details below and book a 1-on-1 consultation call (₹199 fee).
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successData ? (
                <div className="p-8 bg-purple-50 border-2 border-purple-200 rounded-3xl text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 mx-auto flex items-center justify-center border-2 border-purple-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-serif text-2xl font-black text-purple-950">
                    Consultation Booked Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-900 font-medium">
                    Thank you! Your school requirement has been recorded with Registration ID:
                  </p>
                  <div className="inline-block px-4 py-2 bg-white border border-purple-300 rounded-2xl font-mono text-lg font-bold text-secondary shadow-sm">
                    {successData.registrationId}
                  </div>
                  <p className="text-xs text-purple-800 leading-relaxed max-w-md mx-auto">
                    Our Lead Educational Specialist will call you within 24 business hours for a dedicated consultation call. You can track requirement progress anytime at our status lookup portal.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href={`/check-status?regId=${successData.registrationId}`}
                      className="btn-gradient px-6 py-3 rounded-xl font-bold text-xs shadow-md"
                    >
                      Track Status Now
                    </Link>
                    <button
                      onClick={() => setSuccessData(null)}
                      className="px-6 py-3 border border-brand-border bg-white rounded-xl font-bold text-xs text-brand-dark hover:bg-brand-light"
                    >
                      Submit Another Requirement
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitConsultation} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        School Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter School Name"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        Contact Person Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter Full Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        Designation <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                      >
                        <option value="Principal">Principal</option>
                        <option value="Vice Principal">Vice Principal</option>
                        <option value="Special Ed Coordinator">Special Ed Coordinator</option>
                        <option value="Trustee / Management">Trustee / Management</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter Mobile Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                      >
                        <option value="">Select City</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Pune">Pune</option>
                        <option value="Other">Other City</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        Preferred Location / Sector <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sector 62 Noida / Gachibowli"
                        value={preferredLocation}
                        onChange={(e) => setPreferredLocation(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                      />
                    </div>
                  </div>

                  {/* Levels Required Multi-select Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-primary mb-2">
                      Level / Classes Required <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {levelOptions.map((level) => {
                        const checked = levelsRequired.includes(level);
                        return (
                          <button
                            type="button"
                            key={level}
                            onClick={() => handleLevelToggle(level)}
                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              checked 
                                ? 'bg-primary text-white border-primary shadow-xs' 
                                : 'bg-brand-light/40 border-brand-border text-brand-dark hover:border-primary/40'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? 'border-white bg-white text-primary' : 'border-brand-border bg-white'}`}>
                              {checked && <Check size={12} strokeWidth={3} />}
                            </span>
                            <span>{level}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specific Grades Multi-select Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-primary mb-2">
                      Specific Grades (Select one or more)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {gradeOptions.map((grade) => {
                        const checked = specificGrades.includes(grade);
                        return (
                          <button
                            type="button"
                            key={grade}
                            onClick={() => handleGradeToggle(grade)}
                            className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                              checked 
                                ? 'bg-secondary text-white border-secondary shadow-xs font-bold' 
                                : 'bg-white border-brand-border text-brand-dark hover:border-secondary/40'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${checked ? 'border-white bg-white text-secondary' : 'border-brand-border bg-white'}`}>
                              {checked && <Check size={10} strokeWidth={3} />}
                            </span>
                            <span>{grade}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Teachers Count Counter */}
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        Number of Shadow Teachers Required <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-3 bg-brand-light/50 border border-brand-border rounded-xl p-1.5 w-fit">
                        <button
                          type="button"
                          onClick={() => setTeachersCount(Math.max(1, teachersCount - 1))}
                          className="w-9 h-9 rounded-lg bg-white border border-brand-border flex items-center justify-center font-bold text-primary hover:bg-brand-light cursor-pointer shadow-xs"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-extrabold text-base text-primary px-3">{teachersCount}</span>
                        <button
                          type="button"
                          onClick={() => setTeachersCount(teachersCount + 1)}
                          className="w-9 h-9 rounded-lg bg-white border border-brand-border flex items-center justify-center font-bold text-primary hover:bg-brand-light cursor-pointer shadow-xs"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        Requirement Start Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5">
                      Additional Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. student's support needs, timing, special skills required, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none text-brand-dark font-medium"
                    />
                  </div>

                  <div className="p-4 bg-brand-light/60 border border-brand-border rounded-2xl text-[11px] text-brand-muted leading-relaxed">
                    By submitting this form, you agree to be contacted by The Shadow Bridge team for consultation and candidate alignment.
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Processing Consultation Order...</span>
                    ) : (
                      <>
                        <PhoneCall size={18} />
                        <span>Book a Consultation (₹199)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Process Flow (Section F) & Commission (Section G) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Section G: Commission Structure Card */}
              <div className="bg-gradient-to-br from-primary to-[#2A1D4E] text-white rounded-3xl p-6 shadow-xl border border-primary/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-accent uppercase tracking-widest">Pricing Structure</span>
                  <span className="px-2.5 py-0.5 bg-secondary text-white text-[10px] font-black rounded-full uppercase">For Schools</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white">
                  Commission Structure
                </h3>

                <div className="space-y-3 pt-1">
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 space-y-1">
                    <p className="text-[11px] text-accent font-extrabold uppercase">1. Booking Fee</p>
                    <p className="text-xl font-black text-white">₹199/- <span className="text-xs font-normal text-white/70">(Consultation Call)</span></p>
                  </div>

                  <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 space-y-1">
                    <p className="text-[11px] text-accent font-extrabold uppercase">2. One-time Placement Fee</p>
                    <p className="text-2xl font-black text-white">₹5,000/- <span className="text-xs font-normal text-white/70">(Charged once per requirement)</span></p>
                  </div>

                  <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-3.5 space-y-1">
                    <p className="text-[11px] text-emerald-300 font-extrabold uppercase">3. Commission from School</p>
                    <p className="text-xl font-black text-white">50% of First Month's Salary <span className="text-xs font-normal text-white/80">(One-time)</span></p>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl text-center text-xs font-bold text-accent border border-white/10">
                  🚫 No monthly or recurring charges from the school after this.
                </div>
              </div>

              {/* Section F: Process Flow 9 Steps */}
              <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-md space-y-5">
                <div className="border-b border-brand-border/60 pb-3">
                  <h3 className="font-serif text-lg font-black text-primary uppercase tracking-tight">
                    Process Flow — School Collaboration
                  </h3>
                  <p className="text-xs text-brand-muted">Simple 9-step path from requirement to active classroom support.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { step: '1', title: 'School Fills Requirement Form', desc: 'School fills all details about their requirement & submits.' },
                    { step: '2', title: 'Consultation Call', desc: 'We call the school to understand their needs in detail.' },
                    { step: '3', title: 'Proposal & Terms Shared', desc: 'We share the process, terms, fees and available options.' },
                    { step: '4', title: 'One-time Placement Fee Paid', desc: 'School pays the one-time placement fee of ₹5,000.' },
                    { step: '5', title: 'Shortlisting & Interviews', desc: 'We shortlist suitable shadow teachers and schedule interviews with the school.' },
                    { step: '6', title: 'Final Selection', desc: 'School selects the shadow teacher.' },
                    { step: '7', title: 'First Month Commission', desc: 'School pays 50% of the first month\'s salary as our commission.' },
                    { step: '8', title: 'Shadow Teacher Joins', desc: 'Shadow teacher joins the school and ongoing support begins.' },
                    { step: '9', title: 'Ongoing Support', desc: 'We ensure satisfaction, regular follow-ups & quick replacements if required.' }
                  ].map((s) => (
                    <div key={s.step} className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                        {s.step}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-primary">{s.title}</h4>
                        <p className="text-[11px] text-brand-muted leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Information Grid (Section H) */}
      <section className="py-12 bg-white border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-primary">
              Why Partner With The Shadow Bridge?
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Building inclusive educational environments across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-brand-light/30 border border-brand-border p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-sm text-primary">Who Can Benefit?</h3>
              <ul className="text-xs text-brand-muted space-y-1">
                <li>• Pre-Schools & Kindergartens</li>
                <li>• Primary & Elementary Schools</li>
                <li>• Secondary & High Schools</li>
                <li>• International Schools</li>
                <li>• Special Needs Learning Centers</li>
              </ul>
            </div>

            <div className="bg-brand-light/30 border border-brand-border p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-sm text-primary">We Support Students With</h3>
              <ul className="text-xs text-brand-muted space-y-1">
                <li>• ADHD / Attention Challenges</li>
                <li>• Autism Spectrum Disorder (ASD)</li>
                <li>• Learning Disabilities (Dyslexia)</li>
                <li>• Behavioral & Social Challenges</li>
                <li>• Physical & Developmental Support</li>
              </ul>
            </div>

            <div className="bg-brand-light/30 border border-brand-border p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-sm text-primary">What Does a Shadow Teacher Do?</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Provides 1-on-1 support to help students participate, learn and independently engage in classroom activities. Works closely with class teachers to assist in academic, behavioral, and daily routines.
              </p>
            </div>

            <div className="bg-brand-light/30 border border-brand-border p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-sm text-primary">Our Promise</h3>
              <ul className="text-xs text-brand-muted space-y-1">
                <li>• Confidential & Professional</li>
                <li>• Child Safety First & Verified</li>
                <li>• Transparent Hiring Process</li>
                <li>• Quality Assured Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
