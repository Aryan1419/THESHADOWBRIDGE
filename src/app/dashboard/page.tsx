'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Calendar, ShieldAlert, Sparkles, User, Briefcase, 
  MapPin, Clock, ArrowRight, UserCheck, Search, HelpCircle, Check, Info, ClipboardList,
  ShieldCheck, CreditCard, Star, CheckCircle2
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Dynamic script loader for Razorpay Checkout
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Helper component to resolve search params in Suspense
function DashboardContent() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'parent' | 'shadow' | 'tutor'>('parent');
  
  // Real DB state
  const [dbRecord, setDbRecord] = useState<any | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [subType, setSubType] = useState<string>('');
  const [matchedCandidate, setMatchedCandidate] = useState<any | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Review submission states
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewHoverRating, setReviewHoverRating] = useState<number>(0);
  const [childFirstName, setChildFirstName] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [consentPublic, setConsentPublic] = useState<boolean>(false);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbRecord) return;
    
    setSubmittingReview(true);
    setReviewError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: dbRecord.registration_id,
          rating: reviewRating,
          reviewText,
          childFirstName,
          consentPublic
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      if (data.success) {
        setReviewSubmitted(true);
      }
    } catch (err: any) {
      console.error(err);
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'parent' || r === 'shadow' || r === 'tutor') {
      setRole(r);
    }

    const regId = searchParams.get('regId');
    if (regId) {
      setDbLoading(true);
      setDbError(null);
      fetch(`/api/register?regId=${regId}`)
        .then(res => {
          if (!res.ok) throw new Error('Registration ID not found');
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setDbRecord(data.record);
            setRole(data.role);
            if (data.subType) setSubType(data.subType);
            if (data.matchedCandidate) setMatchedCandidate(data.matchedCandidate);
          }
        })
        .catch(err => {
          console.error(err);
          setDbError(err.message);
        })
        .finally(() => {
          setDbLoading(false);
        });

      // Fetch review status
      fetch(`/api/reviews?regId=${regId}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data.success && data.exists) {
            setReviewSubmitted(true);
          }
        })
        .catch(err => console.error('Failed to check review status:', err));
    } else {
      setDbRecord(null);
    }
  }, [searchParams]);

  const handlePlacementPayment = async () => {
    if (!dbRecord) return;
    setPaymentLoading(true);

    try {
      const amount = subType === 'shadow' ? 5000 : 3000;
      
      // 1. Create order on backend
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay payment SDK failed to load.');
      }

      // 3. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The Shadow Bridge',
        description: `Program Placement Fee - ${dbRecord.registrationId}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setPaymentLoading(true);
            const verifyRes = await fetch('/api/payments/verify-placement', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registrationId: dbRecord.registrationId,
                subType,
                amount,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            alert('Placement fee paid successfully! Your learning placement is now active.');
            window.location.reload();
          } catch (err: any) {
            alert(err.message || 'Error verifying payment signature');
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: dbRecord.parentName || '',
          email: dbRecord.email || '',
          contact: dbRecord.phone || ''
        },
        theme: {
          color: '#3B2A6B'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response: any) {
        setPaymentLoading(false);
        alert(`⚠️ Payment Not Completed: ${response.error?.description || 'Transaction was cancelled or declined.'}`);
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'An error occurred during payment checkout setup.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Static Fallback Configuration (Demo Mode)
  const demoConfig = {
    parent: {
      accentColor: 'text-[#B0206B]',
      accentBg: 'bg-[#B0206B]/10',
      accentBorder: 'border-[#B0206B]',
      accentBtn: 'bg-[#B0206B] hover:bg-[#B0206B]/90',
      accentDot: 'bg-[#B0206B]',
      ringColor: 'ring-[#B0206B]/30',
      accentHover: 'hover:text-[#B0206B]',
      welcomeName: 'Meera Sharma',
      welcomeMessage: 'Thank you for scheduling a child assessment with Pratibha Mishra. We are here to support your family\'s inclusive education path.',
      details: {
        id: 'SB-2026-8849',
        date: '14 July 2026',
        status: 'Consultation Scheduled',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      },
      nextStep: {
        title: 'Child Assessment Call',
        description: 'Your ₹99 assessment registration is successful. Founder & Lead Mentor Pratibha Mishra will connect with you via video call on Tuesday, 15th July at 4:30 PM. Please keep your child\'s school reports and clinical logs handy.'
      },
      timeline: [
        { title: 'Registered', desc: 'Successfully filled out requirements and paid the consultation fee.', status: 'completed' },
        { title: 'Consultation Scheduled', desc: '45-minute parent-educator video session with Lead Mentor Pratibha Mishra.', status: 'current' },
        { title: 'Requirement Analysis', desc: 'Defining clear developmental targets, behavior milestones, and schedules.', status: 'upcoming' },
        { title: 'Match Proposed', desc: 'Shortlisting and introducing background-verified shadow teachers / tutors.', status: 'upcoming' },
        { title: 'Introduction Call', desc: 'Direct online/offline trial run between the child, parent, and candidate.', status: 'upcoming' },
        { title: 'Support Started', desc: 'Final placement agreement and commencing the regular learning support sessions.', status: 'upcoming' }
      ]
    },
    shadow: {
      accentColor: 'text-[#C89B3C]',
      accentBg: 'bg-[#C89B3C]/10',
      accentBorder: 'border-[#C89B3C]',
      accentBtn: 'bg-[#C89B3C] hover:bg-[#C89B3C]/90',
      accentDot: 'bg-[#C89B3C]',
      ringColor: 'ring-[#C89B3C]/30',
      accentHover: 'hover:text-[#C89B3C]',
      welcomeName: 'Priya Nair',
      welcomeMessage: 'Thank you for applying to be a part of our inclusive special education team. We appreciate your dedication to supporting child development.',
      details: {
        id: 'TSB-2026-4928',
        date: '14 July 2026',
        status: 'Interview Scheduled',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200'
      },
      nextStep: {
        title: 'Zoom Video Interview',
        description: 'Your special-ed credentials and attached documents have passed preliminary checks. Please check your email inbox for the Zoom link to your interview scheduled on Wednesday, 16th July at 11:30 AM with lead psychologist Pratibha Mishra.'
      },
      timeline: [
        { title: 'Application Submitted', desc: 'Registration details and documents logged in database.', status: 'completed' },
        { title: 'Interview Awaiting', desc: 'Qualifications screening by our clinical mentoring panel.', status: 'completed' },
        { title: 'Interview Scheduled', desc: 'Video assessment call discussing special-ed cases and behavioral techniques.', status: 'current' },
        { title: 'Shortlisted', desc: 'Approved for matching panel based on experience and qualification verification.', status: 'upcoming' },
        { title: 'Onboarding', desc: 'Completing the standard background verification and reference check checks.', status: 'upcoming' },
        { title: 'Active', desc: 'Open for classroom shadow and academic home tutoring placements.', status: 'upcoming' }
      ]
    },
    tutor: {
      accentColor: 'text-[#3B2A6B]',
      accentBg: 'bg-[#3B2A6B]/10',
      accentBorder: 'border-[#3B2A6B]',
      accentBtn: 'bg-[#3B2A6B] hover:bg-[#3B2A6B]/90',
      accentDot: 'bg-[#3B2A6B]',
      ringColor: 'ring-[#3B2A6B]/30',
      accentHover: 'hover:text-[#3B2A6B]',
      welcomeName: 'Rohan Sen',
      welcomeMessage: 'Thank you for applying to join our academic home tutor team. We are excited to help you match with parents looking for structured support.',
      details: {
        id: 'TUT-2026-3829',
        date: '14 July 2026',
        status: 'Interview Awaiting',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200'
      },
      nextStep: {
        title: 'Credentials Screening',
        description: 'Our academic tutoring committee is reviewing your teaching experience, grade levels, and subject specializations. You will receive an SMS and email notification when your panel video interview is scheduled.'
      },
      timeline: [
        { title: 'Application Submitted', desc: 'Academic details, subjects, and credentials logged successfully.', status: 'completed' },
        { title: 'Interview Awaiting', desc: 'Background screening and qualifications mapping underway.', status: 'current' },
        { title: 'Interview Scheduled', desc: 'Interactive subject assessment and tutoring approach discussion.', status: 'upcoming' },
        { title: 'Shortlisted', desc: 'Inducted into active tutoring candidate registry.', status: 'upcoming' },
        { title: 'Onboarding', desc: 'Tutor code of conduct training and background verification checks.', status: 'upcoming' },
        { title: 'Active', desc: 'Ready for match trials and subject coaching assignments.', status: 'upcoming' }
      ]
    }
  };

  const activeConf = demoConfig[role];

  // Resolve dynamic values from database record
  const welcomeName = dbRecord ? (dbRecord.parentName || dbRecord.name) : activeConf.welcomeName;
  const welcomeText = dbRecord
    ? `Welcome back to your Shadow Bridge dashboard. Thank you for your active application.`
    : activeConf.welcomeMessage;
  const regId = dbRecord ? dbRecord.registration_id : activeConf.details.id;
  const regDate = dbRecord 
    ? new Date(dbRecord.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : activeConf.details.date;
  const currentStatus = dbRecord ? dbRecord.status : activeConf.details.status;

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'Consultation Scheduled':
      case 'Interview Scheduled':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Requirement Analysis':
      case 'Onboarding':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Match Proposed':
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Introduction Call':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Support Started':
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Rejected':
      case 'Closed':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // Next steps text mapping
  const getNextStep = () => {
    if (!dbRecord) return activeConf.nextStep;

    if (role === 'parent') {
      switch (currentStatus) {
        case 'Consultation Scheduled':
          return {
            title: 'Initial Assessment Consultation',
            description: 'Your ₹99 payment is complete. Founder & Lead Mentor Pratibha Mishra will connect with you via video call to discuss your child\'s challenges. Please check your email for session timings and keep past clinical logs ready.'
          };
        case 'Requirement Analysis':
          return {
            title: 'Goal Formulation & Diagnostics',
            description: 'Our lead clinical mentors are analyzing your requirements. We are building the target developmental sheet and setting key classroom focus milestones.'
          };
        case 'Match Proposed':
          return {
            title: 'Review Matching Candidates',
            description: 'We have shortlisted background-verified special-education shadow teachers / academic tutors for your child. Admin will schedule brief video introduction calls shortly.'
          };
        case 'Introduction Call':
          return {
            title: 'Educator Child Trial Run',
            description: 'The trial match period is active. We are waiting for feedback regarding the learning chemistry between the educator and your child.'
          };
        case 'Support Started':
          return {
            title: 'Active Learning Support',
            description: 'Congratulations! Your child\'s educational placement is active. Tutors will post daily progression sheets, and lead clinical panels will review monthly development metrics.'
          };
        case 'Closed':
          return {
            title: 'Request Closed',
            description: 'This support request has been archived or marked as closed by the administration.'
          };
        default:
          return { title: 'Pending Review', description: 'Our panel is analyzing your form credentials. We will contact you shortly.' };
      }
    } else {
      switch (currentStatus) {
        case 'Interview Awaiting':
          return {
            title: 'Credentials Verification',
            description: 'Your profile has been submitted successfully. Our panel is screening your academic credentials, teaching experience, and subject matching. You will receive an SMS and email notification when selected.'
          };
        case 'Interview Scheduled':
          return {
            title: 'Video Assessment Panel',
            description: 'Your profile has passed primary vetting! Pratibha Mishra has scheduled your panel assessment interview. Please check your email inbox for the meeting link and cases discussion guidelines.'
          };
        case 'Shortlisted':
          return {
            title: 'Local Client Matchmaking',
            description: 'Congratulations, you are shortlisted! You are inducted into our active match pool. We are mapping your profile against incoming parent requests in your preferred localities.'
          };
        case 'Onboarding':
          return {
            title: 'Background Reference Check',
            description: 'We are completing your reference vetting, address checks, and credentials validation. Vetting team will contact you for Aadhar and certificate originals.'
          };
        case 'Active':
          return {
            title: 'Active Placement Status',
            description: 'You are an Active verified educator in our pool! Tutors/Shadow teachers will receive matchmaking notifications, trial trial schedules, and school trial runs.'
          };
        case 'Rejected':
          return {
            title: 'Application Rejected',
            description: 'Thank you for applying. We are unable to proceed with your onboarding at this time. Your profile will be retained for future openings.'
          };
        default:
          return { title: 'Pending Review', description: 'Our panel is reviewing your documentation.' };
      }
    }
  };

  // Dynamic timeline generator
  const getTimeline = () => {
    if (!dbRecord) return activeConf.timeline;

    const statusIdx = currentStatus;

    if (role === 'parent') {
      const parentStatuses = [
        'Consultation Scheduled',
        'Requirement Analysis',
        'Match Proposed',
        'Introduction Call',
        'Support Started',
        'Closed'
      ];
      const activeIdx = parentStatuses.indexOf(statusIdx);
      
      const parentSteps = [
        { title: 'Registered', desc: 'Successfully filled out requirements and paid the consultation fee.', status: 'completed' },
        { title: 'Consultation Scheduled', desc: '45-minute parent-educator video session with Lead Mentor Pratibha Mishra.', status: 'upcoming' },
        { title: 'Requirement Analysis', desc: 'Defining clear developmental targets, behavior milestones, and schedules.', status: 'upcoming' },
        { title: 'Match Proposed', desc: 'Shortlisting and introducing background-verified shadow teachers / tutors.', status: 'upcoming' },
        { title: 'Introduction Call', desc: 'Direct online/offline trial run between the child, parent, and candidate.', status: 'upcoming' },
        { title: 'Support Started', desc: 'Final placement agreement and commencing the regular learning support sessions.', status: 'upcoming' }
      ];

      for (let i = 1; i < parentSteps.length; i++) {
        const targetStatusIdx = i - 1; // Registered is i=0 (completed)
        if (activeIdx > targetStatusIdx) {
          parentSteps[i].status = 'completed';
        } else if (activeIdx === targetStatusIdx) {
          parentSteps[i].status = 'current';
        } else {
          parentSteps[i].status = 'upcoming';
        }
      }
      return parentSteps;
    } else {
      const educatorStatuses = [
        'Interview Awaiting',
        'Interview Scheduled',
        'Shortlisted',
        'Onboarding',
        'Active',
        'Rejected'
      ];
      const activeIdx = educatorStatuses.indexOf(statusIdx);

      const educatorSteps = [
        { title: 'Application Submitted', desc: 'Registration details and documents logged in database.', status: 'completed' },
        { title: 'Interview Awaiting', desc: 'Qualifications screening by our clinical mentoring panel.', status: 'upcoming' },
        { title: 'Interview Scheduled', desc: 'Video assessment call discussing special-ed cases and behavioral techniques.', status: 'upcoming' },
        { title: 'Shortlisted', desc: 'Approved for matching panel based on experience and qualification verification.', status: 'upcoming' },
        { title: 'Onboarding', desc: 'Completing the standard background verification checks.', status: 'upcoming' },
        { title: 'Active', desc: 'Open for classroom shadow and academic home tutoring placements.', status: 'upcoming' }
      ];

      for (let i = 1; i < educatorSteps.length; i++) {
        const targetStatusIdx = i - 1; // Submitted is i=0 (completed)
        if (activeIdx > targetStatusIdx) {
          educatorSteps[i].status = 'completed';
        } else if (activeIdx === targetStatusIdx) {
          educatorSteps[i].status = 'current';
        } else {
          educatorSteps[i].status = 'upcoming';
        }
      }

      if (statusIdx === 'Rejected') {
        educatorSteps[1] = { title: 'Application Rejected', desc: 'Credentials did not match requirement criteria at this time.', status: 'current' };
        for (let i = 2; i < educatorSteps.length; i++) {
          educatorSteps[i].status = 'upcoming';
        }
      }

      return educatorSteps;
    }
  };

  const timelineSteps = getTimeline();
  const nextStepInfo = getNextStep();

  return (
    <div className="flex flex-col min-h-screen bg-brand-light/30">
      <Navbar />

      {/* Main Dashboard Panel */}
      <section className="pt-32 pb-20 flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* db error message */}
          {dbError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2.5 text-sm max-w-xl mx-auto">
              <ShieldAlert size={20} className="text-rose-600 flex-shrink-0" />
              <span>Could not find active database record for this ID. Showing Demo configuration.</span>
            </div>
          )}

          {/* DEMO MODE SELECTOR SWITCHER (Hide when viewing real DB record to avoid confusion) */}
          {!dbRecord && (
            <div className="bg-white border border-brand-border p-3.5 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-secondary" />
                Viewing Demo Role:
              </span>
              <div className="flex bg-brand-light p-1 rounded-2xl w-full sm:w-auto">
                <button
                  onClick={() => setRole('parent')}
                  className={`flex-grow sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    role === 'parent' 
                      ? 'bg-[#B0206B] text-white shadow-md' 
                      : 'text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  Parent
                </button>
                <button
                  onClick={() => setRole('shadow')}
                  className={`flex-grow sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    role === 'shadow' 
                      ? 'bg-[#C89B3C] text-white shadow-md' 
                      : 'text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  Shadow Teacher
                </button>
                <button
                  onClick={() => setRole('tutor')}
                  className={`flex-grow sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    role === 'tutor' 
                      ? 'bg-[#3B2A6B] text-white shadow-md' 
                      : 'text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  Academic Tutor
                </button>
              </div>
            </div>
          )}

          {/* WELCOME HEADER */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 text-left">
              <h1 className="font-serif text-3xl font-black text-primary">
                Welcome, <span className={activeConf.accentColor}>{welcomeName}</span>!
              </h1>
              <p className="text-brand-muted text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
                {welcomeText}
              </p>
            </div>
            <div className={`p-4 ${activeConf.accentBg} rounded-2xl flex items-center justify-center shrink-0`}>
              <User size={32} className={activeConf.accentColor} />
            </div>
          </div>

          {/* MAIN SECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CARDS COLUMNS (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STATUS & DETAILS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Your Details */}
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm space-y-4 text-left">
                  <h3 className="font-serif text-base font-bold text-primary border-b border-brand-border pb-2 flex items-center gap-1.5">
                    <ClipboardList size={16} className="text-secondary" />
                    Your Details
                  </h3>
                  <div className="space-y-2.5 text-xs text-brand-dark font-medium">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Registration ID:</span>
                      <span className="font-bold">{regId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Registered On:</span>
                      <span>{regDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-brand-muted">Current Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge()}`}>
                        {currentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Info Card */}
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left">
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-primary flex items-center gap-1.5">
                      <Info size={16} className="text-secondary" />
                      Status Info
                    </h3>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                      {dbRecord 
                        ? 'This is a live database record. Any status updates made by Pratibha Mishra\'s panel will update here instantly.'
                        : 'This is a demo layout. Live registration records show verified details and statuses.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-brand-border">
                    <span className="text-[10px] text-brand-muted uppercase font-bold block mb-1">Current Action</span>
                    <span className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusBadge()}`}>
                      {currentStatus}
                    </span>
                  </div>
                </div>

              </div>

              {/* NEXT STEP CARD */}
              <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 text-left relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${activeConf.accentDot}`}></div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${activeConf.accentBg} flex items-center justify-center shrink-0`}>
                    <Clock size={16} className={activeConf.accentColor} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-primary">
                    Next Step: {nextStepInfo.title}
                  </h3>
                </div>
                
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-medium">
                  {nextStepInfo.description}
                </p>

                <div className="pt-2 border-t border-brand-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">
                    *Expect updates via SMS within 24 hours
                  </span>
                  <button className={`px-4 py-2 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all ${activeConf.accentBtn} cursor-pointer shadow-sm`}>
                    Contact Support
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* PROPOSED CANDIDATE MATCH */}
              {role === 'parent' && (matchedCandidate || !dbRecord) && (
                <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                  
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-1.5">
                      <UserCheck size={20} className="text-secondary" />
                      Proposed Candidate Match
                    </h3>
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-100 uppercase">
                      Match Ready
                    </span>
                  </div>

                  <div className="bg-brand-light/30 p-5 rounded-2xl border border-brand-border/60 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center shrink-0 border border-brand-border/80">
                      <User size={24} className="text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold text-brand-dark">
                        {dbRecord ? matchedCandidate?.name : 'Rajesh Kumar'}
                      </h4>
                      <p className="text-xs text-brand-muted font-medium flex items-center gap-3">
                        <span><strong>Exp:</strong> {dbRecord ? matchedCandidate?.experience : '5 Years'}</span>
                        <span>&bull;</span>
                        <span><strong>Qual:</strong> {dbRecord ? matchedCandidate?.qualification : 'B.Ed. in Special Education'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-brand-dark">
                    <div className="bg-white p-3 border border-brand-border rounded-xl">
                      <span className="text-[10px] text-brand-muted uppercase font-bold block mb-1">Specialization</span>
                      {dbRecord ? (matchedCandidate?.specialization || 'Clinical Behavior Support') : 'Autism Spectrum Support & ADHD Classroom Supervision'}
                    </div>
                    <div className="bg-white p-3 border border-brand-border rounded-xl">
                      <span className="text-[10px] text-brand-muted uppercase font-bold block mb-1">Comfortable Areas</span>
                      {dbRecord ? (matchedCandidate?.comfortableAreas || matchedCandidate?.subjects || 'All Locations') : 'Madhapur, Kondapur, Jubilee Hills'}
                    </div>
                  </div>
                </div>
              )}

              {/* PLACEMENT PAYMENT CARD */}
              {role === 'parent' && (matchedCandidate || !dbRecord) && (
                <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-left relative overflow-hidden">
                  {dbRecord?.placementPaid ? (
                    // PAID STATE
                    <>
                      <div className="flex items-center gap-2.5 text-emerald-600">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <ShieldCheck size={18} className="text-emerald-600" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-primary">
                          Placement Fee Paid & Confirmed
                        </h3>
                      </div>
                      <p className="text-xs text-brand-muted leading-relaxed font-medium">
                        Your program onboarding placement fee payment has been successfully received. Our clinical coordinators are aligning scheduling guidelines and setting up the developmental tracker.
                      </p>
                      <div className="bg-emerald-50/40 p-4 border border-emerald-100 rounded-2xl space-y-2 text-xs font-medium text-brand-dark">
                        <div className="flex justify-between">
                          <span className="text-brand-muted">Amount Paid:</span>
                          <span className="font-bold">₹{(dbRecord.placementAmount || (subType === 'shadow' ? 5000 : 3000)).toLocaleString('en-IN')}.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-brand-muted">Payment ID:</span>
                          <span className="font-mono text-[11px] font-bold">{dbRecord.placementPaymentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-brand-muted">Status:</span>
                          <span className="text-emerald-700 font-bold uppercase text-[10px]">Verified Transaction</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    // UNPAID STATE
                    <>
                      <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                        <CreditCard size={20} className="text-secondary" />
                        Program Placement Onboarding Fee
                      </h3>
                      <p className="text-xs text-brand-muted leading-relaxed font-medium">
                        To confirm this educator matching and initiate the daily progression tracking runs, please complete the program onboarding fee. Pratibha Mishra's mentoring panel coordinates this placement.
                      </p>
                      
                      <div className="bg-brand-light/30 p-4 rounded-2xl border border-brand-border/60 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-brand-muted uppercase font-bold block">One-time Fee Amount</span>
                          <span className="font-serif text-2xl font-black text-primary">
                            ₹{dbRecord ? (subType === 'shadow' ? '5,000' : '3,000') : '5,000'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#B0206B] font-bold bg-[#B0206B]/5 px-2.5 py-1 rounded-lg border border-[#B0206B]/15 uppercase">
                          Non-refundable
                        </span>
                      </div>

                      <button
                        onClick={dbRecord ? handlePlacementPayment : () => alert('Demo Mode Simulation: In live mode, this opens the ₹5,000 Razorpay Placement Fee Checkout for Shadow Teachers.')}
                        disabled={paymentLoading}
                        className="btn-gradient w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {paymentLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing Secure Checkout...
                          </>
                        ) : (
                          <>
                            <CreditCard size={14} />
                            Pay Placement Fee via Razorpay
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* FEEDBACK & RATING FORM */}
              {role === 'parent' && (currentStatus === 'Support Started' || currentStatus === 'Active') && (
                <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-accent"></div>
                  
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-1.5">
                      <Star className="text-accent fill-accent" size={20} />
                      Rate Your Experience
                    </h3>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Your child's program has started. Share your honest feedback to help us monitor and improve our inclusive support services.
                    </p>
                  </div>

                  {reviewSubmitted ? (
                    <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-emerald-800">Review Logged</h4>
                        <p className="text-xs text-emerald-700/80 mt-1 font-semibold">
                          Thank you for your feedback! Your review will be published after a quick review.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {reviewError && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-xl font-medium">
                          {reviewError}
                        </div>
                      )}
                      
                      {/* Star Rating Input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-brand-muted uppercase font-bold block">Star Rating</label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setReviewHoverRating(star)}
                              onMouseLeave={() => setReviewHoverRating(0)}
                              className="text-amber-400 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                            >
                              <Star
                                size={28}
                                fill={star <= (reviewHoverRating || reviewRating) ? 'currentColor' : 'none'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional Child First Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-brand-muted uppercase font-bold flex justify-between">
                          <span>Child's First Name (Optional)</span>
                          <span className="text-[9px] lowercase font-normal italic">for privacy</span>
                        </label>
                        <input
                          type="text"
                          value={childFirstName}
                          onChange={(e) => setChildFirstName(e.target.value)}
                          placeholder="e.g. Aarav"
                          className="w-full bg-brand-light border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 font-medium"
                        />
                      </div>

                      {/* Written Review */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-brand-muted uppercase font-bold block">Your Review</label>
                        <textarea
                          rows={4}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="How did the shadow teacher or home tutor support your child? What outcomes have you observed?"
                          className="w-full bg-brand-light border border-brand-border rounded-xl px-4 py-3 text-xs text-brand-dark focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 font-medium resize-none"
                        ></textarea>
                        <span className="text-[9px] text-brand-muted block text-right font-medium">
                          {reviewText.length} / 1000 characters (min 10)
                        </span>
                      </div>

                      {/* Consent Checkbox */}
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={consentPublic}
                          onChange={(e) => setConsentPublic(e.target.checked)}
                          className="mt-0.5 rounded border-brand-border text-accent focus:ring-accent accent-accent"
                        />
                        <span className="text-[11px] text-brand-muted leading-snug font-medium text-left">
                          I agree this review may be displayed publicly on The Shadow Bridge website.
                        </span>
                      </label>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn-gradient w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting Feedback...' : 'Submit Feedback'}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* TIMELINE COLUMN (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm text-left">
              <h3 className="font-serif text-lg font-bold text-primary border-b border-brand-border pb-3 mb-6">
                Program Progression Timeline
              </h3>

              {/* Timeline Tree */}
              <div className="relative pl-6 space-y-8">
                {/* Connected Vertical Line */}
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-brand-border"></div>

                {timelineSteps.map((item, idx) => {
                  const isCompleted = item.status === 'completed';
                  const isCurrent = item.status === 'current';

                  return (
                    <div key={idx} className="relative flex gap-4">
                      {/* Timeline Dot */}
                      <div className="absolute -left-6 transform -translate-x-1/2 flex items-center justify-center">
                        {isCompleted ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center text-white shadow-sm">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className={`w-7 h-7 rounded-full bg-white border-2 ${activeConf.accentBorder} flex items-center justify-center shadow-md relative`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${activeConf.accentDot} animate-ping absolute`}></div>
                            <div className={`w-2.5 h-2.5 rounded-full ${activeConf.accentDot}`}></div>
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white border-2 border-brand-border flex items-center justify-center text-brand-muted text-xs font-bold">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1 pl-2">
                        <h4 className={`text-sm font-bold ${
                          isCompleted ? 'text-primary' : isCurrent ? activeConf.accentColor : 'text-brand-muted'
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-brand-muted leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-light/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-brand-dark">Loading Your Dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
