'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, ArrowRight, ArrowLeft, User, Phone, Mail, MapPin, 
  Sparkles, Smile, HelpCircle, GraduationCap, Edit3, ShieldAlert,
  Heart, CreditCard, School, Home, ClipboardList, Info, InfoIcon
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

export default function ParentRegister() {
  const [path, setPath] = useState<'select' | 'shadow' | 'tutor'>('select');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState('');
  const [regDate, setRegDate] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Parent Info
    parentName: '',
    relationship: '', // Mother / Father / Other
    phone: '',
    email: '',

    // Step 2: About Child
    childName: '',
    childDob: '',
    childGender: '',
    childGrade: '',

    // Step 3 (Shadow Path): Child's Needs
    hasDiagnosis: '', // Yes / No
    diagnosis: '',
    difficulties: [] as string[], // Attention/Focus, Communication, Behavior, Learning, Social Interaction, Others
    otherDifficulty: '',

    // Step 3 (Tutor Path): Tutoring Requirements
    tutorType: '', // Academic Tuition/Subjects, Concept Clarity/Homework Help, Exam Preparation, Other
    otherTutorType: '',
    subjects: [] as string[], // All Subjects, Science, Social Science, Hindi, Other Languages, Other Subjects

    // Step 4: Location
    city: '',
    schoolLocation: '', // School address (Shadow path)
    homeLocation: '', // Home address (Both paths)

    // Step 5 (Shadow Path): Therapies
    takesTherapy: '', // Yes / No
    therapies: [] as string[], // Speech Therapy, Occupational Therapy, Behavior Therapy, Physiotherapy, Special Education, Others
    otherTherapy: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: 'difficulties' | 'subjects' | 'therapies', value: string) => {
    setFormData(prev => {
      const list = prev[category] as string[];
      if (list.includes(value)) {
        return { ...prev, [category]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...list, value] };
      }
    });
  };

  // Step Validation check
  const isStepValid = (stepIndex: number) => {
    if (path === 'shadow') {
      switch (stepIndex) {
        case 1:
          return !!(formData.parentName && formData.relationship && formData.phone && formData.email);
        case 2:
          return !!(formData.childName && formData.childDob && formData.childGender && formData.childGrade);
        case 3:
          return !!(
            formData.hasDiagnosis && 
            formData.difficulties.length > 0 &&
            (formData.hasDiagnosis !== 'Yes' || formData.diagnosis) &&
            (!formData.difficulties.includes('Others') || formData.otherDifficulty)
          );
        case 4:
          return !!(formData.city && formData.schoolLocation && formData.homeLocation);
        case 5:
          return !!(
            formData.takesTherapy && 
            (formData.takesTherapy !== 'Yes' || formData.therapies.length > 0) &&
            (!formData.therapies.includes('Others') || formData.otherTherapy)
          );
        case 6:
          return confirmSubmit && agreeTerms; // Review step
        default:
          return true;
      }
    } else if (path === 'tutor') {
      switch (stepIndex) {
        case 1:
          return !!(formData.parentName && formData.relationship && formData.phone && formData.email);
        case 2:
          return !!(formData.childName && formData.childDob && formData.childGender && formData.childGrade);
        case 3:
          return !!(
            formData.tutorType && 
            formData.subjects.length > 0 &&
            (formData.tutorType !== 'Other' || formData.otherTutorType)
          );
        case 4:
          return !!(formData.city && formData.homeLocation);
        case 5:
          return confirmSubmit && agreeTerms; // Review step
        default:
          return true;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (isStepValid(step)) {
      setShowErrors(false);
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setShowErrors(true);
    }
  };

  const handleBack = () => {
    setShowErrors(false);
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleJumpToStep = (targetStep: number) => {
    setShowErrors(false);
    setStep(targetStep);
    window.scrollTo(0, 0);
  };

  const handlePathSelect = (selectedPath: 'shadow' | 'tutor') => {
    setPath(selectedPath);
    setStep(1);
    setShowErrors(false);
    window.scrollTo(0, 0);
  };

  const handleResetPath = () => {
    setPath('select');
    setStep(1);
    setShowErrors(false);
  };

  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentError(null);

    // Calculate age from Child Dob
    const birthYear = formData.childDob ? new Date(formData.childDob).getFullYear() : 2019;
    const currentYear = new Date().getFullYear();
    const calculatedAge = Math.max(1, currentYear - birthYear).toString();

    // Map challenges text
    let challengesText = '';
    if (path === 'shadow') {
      challengesText = `Diagnosis: ${formData.hasDiagnosis === 'Yes' ? formData.diagnosis : 'None'} | Difficulty Areas: ${formData.difficulties.join(', ')}`;
      if (formData.difficulties.includes('Others')) {
        challengesText += ` (${formData.otherDifficulty})`;
      }
      if (formData.takesTherapy === 'Yes') {
        challengesText += ` | Therapies: ${formData.therapies.join(', ')}`;
        if (formData.therapies.includes('Others')) {
          challengesText += ` (${formData.otherTherapy})`;
        }
      }
    } else {
      challengesText = `Tutoring: ${formData.tutorType}`;
      if (formData.tutorType === 'Other') {
        challengesText += ` (${formData.otherTutorType})`;
      }
      challengesText += ` | Subjects: ${formData.subjects.join(', ')}`;
    }

    const payload = {
      type: 'parent',
      parentName: formData.parentName,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      childName: formData.childName,
      childAge: calculatedAge,
      childGrade: formData.childGrade,
      challenges: challengesText,
      supportNeeded: path === 'shadow' ? 'School Shadow Teacher Support' : 'Home Tutor Support',

      // Extra fields for JSON
      relationship: formData.relationship,
      childDob: formData.childDob,
      childGender: formData.childGender,
      address: formData.homeLocation,
      schoolLocation: formData.schoolLocation,
      homeLocation: formData.homeLocation,
      amountPaid: 99,
      paymentStatus: 'paid'
    };

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

      // 3. Trigger Razorpay Checkout Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The Shadow Bridge',
        description: 'Diagnostic Child Assessment Consultation Fee',
        order_id: orderId,
        handler: async function (response: any) {
          // Callback is executed on successful payment!
          setLoading(true);
          try {
            const res = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...payload,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (res.ok) {
              const result = await res.json();
              const generatedId = result.registration_id;
              
              setRegId(generatedId);
              setRegDate(new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }));

              setSubmitted(true);
              confetti({
                particleCount: 180,
                spread: 80,
                origin: { y: 0.5 }
              });
            } else {
              const registerErr = await res.json();
              setPaymentError(registerErr.error || 'Registration failed after payment. Please contact admin.');
            }
          } catch (err) {
            console.error('Registration submission failed:', err);
            setPaymentError('Failed to sync details after payment. Please contact support@theshadowbridge.com.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            // User closed Razorpay Checkout popup without completing payment
            setLoading(false);
            setPaymentError('Payment was cancelled or closed. You can retry clicking "Proceed to Pay".');
          }
        },
        prefill: {
          name: formData.parentName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#B0206B' // Parent accent brand theme color
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

  const shadowSteps = [
    "Parent Details",
    "About Your Child",
    "Child's Needs",
    "Location Details",
    "Therapies",
    "Review & Pay",
    "Confirmation"
  ];

  const tutorSteps = [
    "Parent Details",
    "About Your Child",
    "Tutoring Requirements",
    "Location Details",
    "Review & Pay",
    "Confirmation"
  ];

  const activeStepsList = path === 'shadow' ? shadowSteps : tutorSteps;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-b from-[#F7F5FC] to-white flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {path === 'select' ? (
            /* SELECTION HOME SCREEN */
            <div className="max-w-3xl mx-auto text-center space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} className="text-secondary" />
                  <span>Onboarding Portal</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-black text-primary leading-tight">
                  How Can We Support Your Family?
                </h1>
                <p className="text-brand-muted text-base sm:text-lg max-w-xl mx-auto font-sans">
                  Select the specialized learning and behavioral program route matching your child's educational setup.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {/* Need a Shadow Teacher Card */}
                <button
                  onClick={() => handlePathSelect('shadow')}
                  className="bg-white border-2 border-brand-border hover:border-primary/60 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[280px] group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-light rounded-2xl w-fit text-primary group-hover:scale-110 transition-transform">
                      <School size={28} className="text-secondary" />
                    </div>
                    <h3 className="font-serif font-black text-primary text-xl">Need a Shadow Teacher?</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      For mainstream school integration support, classroom focus coaching, behavior management, and peer relationship building.
                    </p>
                  </div>
                  <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mt-auto group-hover:gap-2.5 transition-all">
                    <span>Start Application</span>
                    <ArrowRight size={14} />
                  </div>
                </button>

                {/* Searching for a Home Tutor Card */}
                <button
                  onClick={() => handlePathSelect('tutor')}
                  className="bg-white border-2 border-brand-border hover:border-secondary/60 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[280px] group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-light rounded-2xl w-fit text-primary group-hover:scale-110 transition-transform">
                      <Home size={28} className="text-primary" />
                    </div>
                    <h3 className="font-serif font-black text-primary text-xl">Searching for a Home Tutor?</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      For customized subject tutoring, conceptual explanation, remedial teaching, and homework help at home.
                    </p>
                  </div>
                  <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mt-auto group-hover:gap-2.5 transition-all">
                    <span>Start Application</span>
                    <ArrowRight size={14} />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* DUAL PATH WIZARD FLOW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
              
              {/* Main Form Area (8 Columns) */}
              <div className="lg:col-span-8 bg-white border border-brand-border rounded-3xl shadow-xl overflow-hidden">
                
                {/* Stepper Progress Indicator */}
                {!submitted && (
                  <div className="bg-brand-light border-b border-brand-border px-6 py-5 sm:px-8">
                    <div className="flex justify-between items-center relative">
                      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-brand-border -translate-y-1/2 z-0"></div>
                      <div 
                        className="absolute left-0 top-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 transition-all duration-300 z-0"
                        style={{ width: `${((step - 1) / (activeStepsList.length - 2)) * 100}%` }}
                      ></div>

                      {activeStepsList.slice(0, -1).map((stepName, idx) => {
                        const stepNum = idx + 1;
                        const isCompleted = step > stepNum;
                        const isActive = step === stepNum;
                        return (
                          <button
                            key={idx}
                            onClick={() => stepNum < step && handleJumpToStep(stepNum)}
                            disabled={stepNum >= step}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs relative z-10 transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-secondary border-secondary text-white shadow-sm'
                                : isActive
                                ? 'bg-white border-primary text-primary scale-110 shadow-md'
                                : 'bg-white border-brand-border text-brand-muted'
                            }`}
                            title={stepName}
                          >
                            {isCompleted ? '✓' : stepNum}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <button 
                        type="button" 
                        onClick={handleResetPath}
                        className="text-[10px] text-secondary font-bold hover:underline cursor-pointer uppercase tracking-wider"
                      >
                        ← Change Service
                      </button>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Step {step} of {activeStepsList.length - 1}: {activeStepsList[step - 1]}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-8 sm:p-10">
                  {submitted ? (
                    /* PATH 1 & 2 STEP 7/6 SUCCESS SCREEN */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-6 py-6"
                    >
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
                        <Heart className="text-emerald-600 fill-emerald-600/10 animate-pulse" size={44} />
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-serif font-black text-primary text-3xl">Thank You!</h2>
                        <p className="text-brand-muted text-base max-w-md mx-auto font-sans">
                          Your assessment consultation payment has been processed securely. We look forward to connecting with your family!
                        </p>
                      </div>

                      <div className="bg-brand-light border border-brand-border rounded-2xl p-6 max-w-sm mx-auto text-left space-y-3">
                        <div className="flex justify-between border-b border-brand-border/60 pb-2">
                          <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Registration ID</span>
                          <span className="text-sm font-black text-secondary">{regId}</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-border/60 pb-2">
                          <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Requested Support</span>
                          <span className="text-sm font-bold text-brand-dark">
                            {path === 'shadow' ? 'Shadow Teacher Program' : 'Home Tutor Program'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-brand-border/60 pb-2">
                          <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Consultation Fee</span>
                          <span className="text-sm font-bold text-emerald-600">₹99 (Paid Securely)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Applied Date</span>
                          <span className="text-sm font-semibold text-brand-dark">{regDate}</span>
                        </div>
                      </div>

                      <div className="bg-[#F7F5FC] border border-brand-border p-4 rounded-xl max-w-md mx-auto text-center flex gap-2 items-center text-xs text-brand-muted">
                        <InfoIcon size={16} className="text-secondary flex-shrink-0" />
                        <p className="text-left font-medium">Founder & Lead Mentor Pratibha Mishra will contact you personally within 24 hours to schedule the video consultation session.</p>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          href="/"
                          className="px-6 py-3.5 border border-brand-border hover:bg-brand-light rounded-xl font-bold text-sm text-brand-dark transition-all"
                        >
                          Back to Home
                        </Link>
                        <Link
                          href={`/dashboard?role=parent&regId=${regId}`}
                          className="px-6 py-3.5 bg-primary text-white font-bold rounded-xl text-sm transition-all hover:bg-primary/95 shadow-md flex items-center justify-center gap-1.5"
                        >
                          Go to My Dashboard
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    /* WIZARD FORM */
                    <form onSubmit={handlePayAndSubmit} className="space-y-6">
                      {showErrors && !isStepValid(step) && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2.5 text-sm">
                          <ShieldAlert size={20} className="text-rose-600 flex-shrink-0" />
                          <span>Please fill all required (*) fields before proceeding.</span>
                        </div>
                      )}

                      <AnimatePresence mode="wait">
                        
                        {/* STEP 1: Parent Details (Shared) */}
                        {step === 1 && (
                          <motion.div
                            key="step-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">Parent / Guardian Details</h3>
                            
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Parent/Guardian Full Name *</label>
                              <input
                                type="text"
                                name="parentName"
                                required
                                value={formData.parentName}
                                onChange={handleInputChange}
                                placeholder="e.g. Meera Sharma"
                                className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Relationship to Child *</label>
                              <select
                                name="relationship"
                                required
                                value={formData.relationship}
                                onChange={handleInputChange}
                                className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                              >
                                <option value="">Select Relationship</option>
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Guardian/Other">Other</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Mobile Number *</label>
                                <input
                                  type="tel"
                                  name="phone"
                                  required
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="e.g. 9876543210"
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Email ID *</label>
                                <input
                                  type="email"
                                  name="email"
                                  required
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="e.g. meera@gmail.com"
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 2: About Your Child (Shared) */}
                        {step === 2 && (
                          <motion.div
                            key="step-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">About Your Child</h3>
                            
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Child's Full Name *</label>
                              <input
                                type="text"
                                name="childName"
                                required
                                value={formData.childName}
                                onChange={handleInputChange}
                                placeholder="e.g. Aarav Sharma"
                                className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Date of Birth *</label>
                                <input
                                  type="date"
                                  name="childDob"
                                  required
                                  value={formData.childDob}
                                  onChange={handleInputChange}
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Gender *</label>
                                <select
                                  name="childGender"
                                  required
                                  value={formData.childGender}
                                  onChange={handleInputChange}
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Boy">Boy</option>
                                  <option value="Girl">Girl</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Grade / Standard *</label>
                              <select
                                name="childGrade"
                                required
                                value={formData.childGrade}
                                onChange={handleInputChange}
                                className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                              >
                                <option value="">Select Grade</option>
                                <option value="Early Years / Pre-School">Early Years / Pre-School</option>
                                <option value="Kindergarten">Kindergarten</option>
                                <option value="1st Grade">1st Grade</option>
                                <option value="2nd Grade">2nd Grade</option>
                                <option value="3rd Grade">3rd Grade</option>
                                <option value="4th Grade">4th Grade</option>
                                <option value="5th Grade">5th Grade</option>
                                <option value="Middle School (6th-8th)">Middle School (6th-8th)</option>
                                <option value="High School (9th-10th)">High School (9th-10th)</option>
                                <option value="Senior Secondary (11th-12th)">Senior Secondary (11th-12th)</option>
                              </select>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 3 (Shadow Path): Child's Needs */}
                        {path === 'shadow' && step === 3 && (
                          <motion.div
                            key="step-3-shadow"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4 font-sans">Child's Needs</h3>
                            
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Does the child have any diagnosis/special need? *</label>
                              <div className="flex gap-6">
                                <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                  <input
                                    type="radio"
                                    name="hasDiagnosis"
                                    value="Yes"
                                    checked={formData.hasDiagnosis === "Yes"}
                                    onChange={handleInputChange}
                                    className="accent-primary w-4 h-4"
                                  /> Yes
                                </label>
                                <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                  <input
                                    type="radio"
                                    name="hasDiagnosis"
                                    value="No"
                                    checked={formData.hasDiagnosis === "No"}
                                    onChange={handleInputChange}
                                    className="accent-primary w-4 h-4"
                                  /> No
                                </label>
                              </div>
                            </div>

                            {formData.hasDiagnosis === 'Yes' && (
                              <div className="flex flex-col gap-1.5 pt-1 animate-fade-in-up">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Please specify diagnosis *</label>
                                <input
                                  type="text"
                                  name="diagnosis"
                                  required
                                  value={formData.diagnosis}
                                  onChange={handleInputChange}
                                  placeholder="e.g. Autism Spectrum Disorder, ADHD, Speech delay"
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                />
                              </div>
                            )}

                            <div className="space-y-2 pt-2">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Main Areas of Difficulty *</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                  "Attention/Focus",
                                  "Communication",
                                  "Behavior",
                                  "Learning",
                                  "Social Interaction",
                                  "Others"
                                ].map((diff) => (
                                  <label key={diff} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.difficulties.includes(diff)}
                                      onChange={() => handleCheckboxChange('difficulties', diff)}
                                      className="accent-primary rounded w-4 h-4"
                                    /> {diff}
                                  </label>
                                ))}
                              </div>
                            </div>

                            {formData.difficulties.includes('Others') && (
                              <div className="flex flex-col gap-1.5 pt-2 animate-fade-in-up">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Please specify other difficulties *</label>
                                <input
                                  type="text"
                                  name="otherDifficulty"
                                  required
                                  value={formData.otherDifficulty}
                                  onChange={handleInputChange}
                                  placeholder="e.g. Sensory issues, gross motor coordination"
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                />
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* STEP 3 (Tutor Path): Tutoring Requirements */}
                        {path === 'tutor' && step === 3 && (
                          <motion.div
                            key="step-3-tutor"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">Tutoring Requirements</h3>
                            
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">What type of tutoring is needed? *</label>
                              <div className="grid grid-cols-1 gap-2">
                                {[
                                  "Academic Tuition/Subjects",
                                  "Concept Clarity/Homework Help",
                                  "Exam Preparation",
                                  "Other"
                                ].map((type) => (
                                  <label key={type} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                    <input
                                      type="radio"
                                      name="tutorType"
                                      value={type}
                                      checked={formData.tutorType === type}
                                      onChange={handleInputChange}
                                      className="accent-primary w-4 h-4"
                                    /> {type}
                                  </label>
                                ))}
                              </div>
                            </div>

                            {formData.tutorType === 'Other' && (
                              <div className="flex flex-col gap-1.5 pt-1 animate-fade-in-up">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Please specify tutoring requirements *</label>
                                <input
                                  type="text"
                                  name="otherTutorType"
                                  required
                                  value={formData.otherTutorType}
                                  onChange={handleInputChange}
                                  placeholder="e.g. Dysgraphia writing remediation, slow learner focus"
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                />
                              </div>
                            )}

                            <div className="space-y-2 pt-2">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Subjects Required *</label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  "All Subjects",
                                  "Science",
                                  "Social Science",
                                  "Hindi",
                                  "Other Languages",
                                  "Other Subjects"
                                ].map((sub) => (
                                  <label key={sub} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.subjects.includes(sub)}
                                      onChange={() => handleCheckboxChange('subjects', sub)}
                                      className="accent-primary rounded w-4 h-4"
                                    /> {sub}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 4 (Both Paths): Location Details */}
                        {step === 4 && (
                          <motion.div
                            key="step-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4 font-sans">Location Details</h3>
                            
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">City *</label>
                              <select
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleInputChange}
                                className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                              >
                                <option value="">Select City</option>
                                <option value="Ahmedabad">Ahmedabad</option>
                                <option value="Hyderabad">Hyderabad</option>
                              </select>
                            </div>

                            {path === 'shadow' && (
                              <div className="flex flex-col gap-1.5 animate-fade-in-up">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Child's School Location *</label>
                                <input
                                  type="text"
                                  name="schoolLocation"
                                  required
                                  value={formData.schoolLocation}
                                  onChange={handleInputChange}
                                  placeholder="e.g. Satellite, Ahmedabad (School Area)"
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                />
                              </div>
                            )}

                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Child's Home Location *</label>
                              <input
                                type="text"
                                name="homeLocation"
                                required
                                value={formData.homeLocation}
                                onChange={handleInputChange}
                                placeholder="e.g. Green Heights, Sector 120 (Home Locality)"
                                className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 5 (Shadow Path only): Therapies */}
                        {path === 'shadow' && step === 5 && (
                          <motion.div
                            key="step-5-shadow"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4 font-sans">Therapies History</h3>
                            
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Is your child currently taking any therapy? *</label>
                              <div className="flex gap-6">
                                <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                  <input
                                    type="radio"
                                    name="takesTherapy"
                                    value="Yes"
                                    checked={formData.takesTherapy === "Yes"}
                                    onChange={handleInputChange}
                                    className="accent-primary w-4 h-4"
                                  /> Yes
                                </label>
                                <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                  <input
                                    type="radio"
                                    name="takesTherapy"
                                    value="No"
                                    checked={formData.takesTherapy === "No"}
                                    onChange={handleInputChange}
                                    className="accent-primary w-4 h-4"
                                  /> No
                                </label>
                              </div>
                            </div>

                            {formData.takesTherapy === 'Yes' && (
                              <div className="space-y-2 pt-2 animate-fade-in-up">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Select therapies *</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {[
                                    "Speech Therapy",
                                    "Occupational Therapy",
                                    "Behavior Therapy",
                                    "Physiotherapy",
                                    "Special Education",
                                    "Others"
                                  ].map((ther) => (
                                    <label key={ther} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={formData.therapies.includes(ther)}
                                        onChange={() => handleCheckboxChange('therapies', ther)}
                                        className="accent-primary rounded w-4 h-4"
                                      /> {ther}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                            {formData.takesTherapy === 'Yes' && formData.therapies.includes('Others') && (
                              <div className="flex flex-col gap-1.5 pt-2 animate-fade-in-up">
                                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Please specify other therapies *</label>
                                <input
                                  type="text"
                                  name="otherTherapy"
                                  required
                                  value={formData.otherTherapy}
                                  onChange={handleInputChange}
                                  placeholder="e.g. Sensory integration, vision therapy"
                                  className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                                />
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* STEP 6 (Shadow) / STEP 5 (Tutor): Review & Pay */}
                        {((path === 'shadow' && step === 6) || (path === 'tutor' && step === 5)) && (
                          <motion.div
                            key="step-review-pay"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2">Review Details & Proceed to Pay</h3>
                            
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                              
                              {/* 1. Parent Details */}
                              <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative text-left">
                                <button 
                                  type="button" 
                                  onClick={() => handleJumpToStep(1)}
                                  className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <Edit3 size={12} /> Edit
                                </button>
                                <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">1. Parent Details</h4>
                                <div className="grid grid-cols-2 gap-y-1 text-xs text-brand-dark">
                                  <div><strong>Name:</strong> {formData.parentName}</div>
                                  <div><strong>Relationship:</strong> {formData.relationship}</div>
                                  <div><strong>Mobile:</strong> {formData.phone}</div>
                                  <div><strong>Email:</strong> {formData.email}</div>
                                </div>
                              </div>

                              {/* 2. Child Details */}
                              <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative text-left">
                                <button 
                                  type="button" 
                                  onClick={() => handleJumpToStep(2)}
                                  className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <Edit3 size={12} /> Edit
                                </button>
                                <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">2. About Your Child</h4>
                                <div className="grid grid-cols-2 gap-y-1 text-xs text-brand-dark">
                                  <div><strong>Name:</strong> {formData.childName}</div>
                                  <div><strong>DOB:</strong> {formData.childDob}</div>
                                  <div><strong>Gender:</strong> {formData.childGender}</div>
                                  <div><strong>Grade:</strong> {formData.childGrade}</div>
                                </div>
                              </div>

                              {/* 3. Needs / Tutoring */}
                              <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative text-left">
                                <button 
                                  type="button" 
                                  onClick={() => handleJumpToStep(3)}
                                  className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <Edit3 size={12} /> Edit
                                </button>
                                {path === 'shadow' ? (
                                  <>
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">3. Child's Needs & Diagnosis</h4>
                                    <div className="space-y-1 text-xs text-brand-dark">
                                      <div><strong>Has Diagnosis:</strong> {formData.hasDiagnosis}</div>
                                      {formData.hasDiagnosis === 'Yes' && <div><strong>Diagnosis:</strong> {formData.diagnosis}</div>}
                                      <div><strong>Areas of Difficulty:</strong> {formData.difficulties.join(', ')}</div>
                                      {formData.difficulties.includes('Others') && <div><strong>Other Difficulty:</strong> {formData.otherDifficulty}</div>}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">3. Tutoring Requirements</h4>
                                    <div className="space-y-1 text-xs text-brand-dark">
                                      <div><strong>Tutor Need:</strong> {formData.tutorType}</div>
                                      {formData.tutorType === 'Other' && <div><strong>Details:</strong> {formData.otherTutorType}</div>}
                                      <div><strong>Subjects:</strong> {formData.subjects.join(', ')}</div>
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* 4. Location */}
                              <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative text-left">
                                <button 
                                  type="button" 
                                  onClick={() => handleJumpToStep(4)}
                                  className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <Edit3 size={12} /> Edit
                                </button>
                                <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">4. Location</h4>
                                <div className="space-y-1 text-xs text-brand-dark">
                                  <div><strong>Preferred City:</strong> {formData.city}</div>
                                  {path === 'shadow' && <div><strong>School Area:</strong> {formData.schoolLocation}</div>}
                                  <div><strong>Home Area:</strong> {formData.homeLocation}</div>
                                </div>
                              </div>

                              {/* 5. Therapies (Shadow Only) */}
                              {path === 'shadow' && (
                                <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative text-left">
                                  <button 
                                    type="button" 
                                    onClick={() => handleJumpToStep(5)}
                                    className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                                  >
                                    <Edit3 size={12} /> Edit
                                  </button>
                                  <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">5. Therapy History</h4>
                                  <div className="space-y-1 text-xs text-brand-dark">
                                    <div><strong>Takes Therapy:</strong> {formData.takesTherapy}</div>
                                    {formData.takesTherapy === 'Yes' && <div><strong>Therapies:</strong> {formData.therapies.join(', ')}</div>}
                                    {formData.takesTherapy === 'Yes' && formData.therapies.includes('Others') && <div><strong>Other Details:</strong> {formData.otherTherapy}</div>}
                                  </div>
                                </div>
                              )}

                            </div>

                            {/* Terms and Privacy Checkbox */}
                            <div className="border-t border-brand-border pt-4 pb-2 text-left space-y-3">
                              <label className="flex items-start gap-2.5 text-xs text-brand-dark font-bold cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={confirmSubmit}
                                  onChange={(e) => setConfirmSubmit(e.target.checked)}
                                  className="accent-primary rounded w-4 h-4 mt-0.5 flex-shrink-0"
                                />
                                <span>
                                  I confirm that all the information provided by me is true and correct *
                                </span>
                              </label>

                              <label className="flex items-start gap-2.5 text-xs text-brand-dark font-bold cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={agreeTerms}
                                  onChange={(e) => setAgreeTerms(e.target.checked)}
                                  className="accent-primary rounded w-4 h-4 mt-0.5 flex-shrink-0"
                                />
                                <span>
                                  I have read and agree to the{' '}
                                  <Link href="/terms" target="_blank" className="text-accent underline hover:text-primary transition-colors">
                                    Terms &amp; Conditions
                                  </Link>{' '}
                                  and{' '}
                                  <Link href="/privacy" target="_blank" className="text-accent underline hover:text-primary transition-colors">
                                    Privacy Policy
                                  </Link>
                                  . *
                                </span>
                              </label>
                            </div>

                            {/* Billing details */}
                            <div className="border-t-2 border-dashed border-brand-border pt-4 text-left">
                              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Initial Assessment consultation</h4>
                              <div className="bg-brand-light/60 p-4 rounded-2xl flex justify-between items-center border border-brand-border">
                                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                  <CreditCard size={18} className="text-secondary" />
                                  <span>Consultation Booking Fee</span>
                                </div>
                                <span className="text-2xl font-black text-secondary">₹99</span>
                              </div>
                              <p className="text-[10px] text-brand-muted mt-2 leading-relaxed flex gap-1">
                                <Info size={12} className="text-secondary flex-shrink-0 mt-0.5" />
                                <span>The placement fee of {path === 'shadow' ? '₹5,000' : '₹3,000'} applies only after a match is successfully made.</span>
                              </p>
                              {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test') && (
                                <div className="mt-3.5 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-1.5">
                                  <Info size={12} className="text-amber-600 shrink-0" />
                                  <span>TEST MODE — No real payments are being processed</span>
                                </div>
                              )}
                              {paymentError && (
                                <div className="mt-3.5 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-1.5">
                                  <ShieldAlert size={12} className="text-rose-600 shrink-0" />
                                  <span>{paymentError}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between items-center border-t border-brand-border/60 pt-6 mt-6">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-5 py-3 border border-brand-border text-brand-dark hover:bg-brand-light rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft size={16} /> Back
                        </button>

                        {((path === 'shadow' && step < 6) || (path === 'tutor' && step < 5)) ? (
                          <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-3.5 bg-primary text-white font-bold rounded-xl text-sm transition-all hover:bg-primary/95 shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            Next <ArrowRight size={16} />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={loading || !confirmSubmit || !agreeTerms}
                            className="btn-gradient px-8 py-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {loading ? 'Processing...' : 'Proceed to Pay (₹99)'}
                            <CreditCard size={16} />
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>

              </div>

              {/* Sidebar Area (4 Columns) */}
              <div className="lg:col-span-4 space-y-6">
                {/* One Time Placement Fees Card */}
                <div className="bg-gradient-to-br from-primary to-[#502C6E] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                  <h3 className="font-serif text-lg font-bold border-b border-white/20 pb-2.5 mb-4">One Time Placement Fees</h3>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center bg-white/10 p-3.5 border border-white/10 rounded-2xl">
                      <span className="text-xs font-semibold text-gray-200">Shadow Teacher</span>
                      <span className="text-lg font-black text-accent">₹5,000</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-3.5 border border-white/10 rounded-2xl">
                      <span className="text-xs font-semibold text-gray-200">Home Tutor</span>
                      <span className="text-lg font-black text-accent">₹3,000</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-300 mt-5 leading-relaxed">
                    *Placement fees are separate from the initial ₹99 consultation and are **only** charged after a final match and successful trials.
                  </p>
                </div>

                {/* Important Notes Card */}
                <div className="bg-white border border-brand-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-4 text-left">
                  <h3 className="font-serif text-base font-bold text-primary border-b border-brand-border pb-2">Important Notes</h3>
                  <ul className="space-y-3 text-xs text-brand-muted list-disc pl-4 leading-relaxed font-semibold">
                    <li>The initial ₹99 consultation fee is required to schedule the detailed child assessment and is non-refundable.</li>
                    <li>Placement fees apply only after final candidate trials and parent confirmation.</li>
                    <li>Salaries are negotiated hourly or monthly and paid directly to the tutor/shadow.</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
