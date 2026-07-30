'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, CheckCircle2, Clock, AlertCircle, ArrowRight, 
  User, Phone, Mail, MapPin, Sparkles, ShieldCheck, Info, FileText, ExternalLink, RefreshCw, Ticket
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STATUS_EXPLANATIONS: Record<string, string> = {
  'Interview Awaiting': 'Your educator application has been received. Our clinical team is currently reviewing your resume.',
  'Interview Scheduled': 'Congratulations! You have been invited for a 1-on-1 video screening call with Founder Pratibha Mishra.',
  'Shortlisted': 'You have successfully passed the screening and are now part of our active educator pool for matching.',
  'Onboarding': 'We are performing address, ID, and reference background verification prior to your school placement.',
  'Active': 'You are currently active and matched with a student family.',
  
  'Consultation Booked': 'Your ₹99 consultation fee is received. Founder Pratibha Mishra will call you to assess your child\'s requirements.',
  'Consultation Completed': 'Your 1-on-1 consultation is complete! Your Child Registration Form is now unlocked below.',
  'Registration Submitted': 'Your detailed child profile has been submitted. Please complete the placement fee to initiate educator matching.',
  'Placement Fee Paid': 'Your requirement is locked! Our placement team is actively shortlisting verified educators for your location.',
  'Shadow Teacher Matching in Progress': 'Our team is shortlisting and interviewing shadow teacher candidates tailored to your child\'s needs.',
  'Home Tutor Matching in Progress': 'We are selecting specialized academic tutors suited for your child\'s grade and location.',
  'Match Proposed': 'We have proposed an educator candidate match! You can review their verified profile directly below.',
  'Introduction Call': 'We are scheduling a trial introduction call between the proposed educator, yourself, and your child.',
  'Support Started': 'Congratulations, your educational placement is active and regular learning support sessions have commenced.',
  'Closed': 'This support request has been archived or closed by the administration.'
};

const TEACHER_TIMELINE = [
  { name: 'Interview Awaiting', desc: 'Application Received & Credentials Review' },
  { name: 'Interview Scheduled', desc: 'Panel Video Assessment with Founder' },
  { name: 'Shortlisted', desc: 'Inducted into Active Matching Pool' },
  { name: 'Onboarding', desc: 'Address & Reference Verification' },
  { name: 'Active', desc: 'Matched & Placed with Parents' }
];

const PARENT_TIMELINE = [
  { name: 'Consultation Booked', desc: '₹99 Paid • Assessment Call Scheduled' },
  { name: 'Consultation Completed', desc: 'Consultation Call Done • Form Unlocked' },
  { name: 'Registration Submitted', desc: 'Child Details Provided • Ready for Placement Fee' },
  { name: 'Placement Fee Paid', desc: 'Placement Onboarded • Educator Matching Active' },
  { name: 'Matching in Progress', desc: 'Background-Verified Candidate Trial Match' }
];

export default function CheckStatusPage() {
  const [registrationId, setRegistrationId] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // VIP Code Redeem State
  const [vipCode, setVipCode] = useState('');
  const [vipLoading, setVipLoading] = useState(false);
  const [vipError, setVipError] = useState<string | null>(null);
  const [vipSuccessMsg, setVipSuccessMsg] = useState<string | null>(null);

  // Loaded Record Data
  const [recordData, setRecordData] = useState<any | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationId.trim() || !contactInfo.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: registrationId.trim(),
          contactInfo: contactInfo.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to locate matching registration record.');
      }

      setRecordData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setRecordData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setRecordData(null);
    setErrorMsg(null);
    setVipCode('');
    setVipError(null);
    setVipSuccessMsg(null);
  };

  const handleApplyVipCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipCode.trim()) return;

    setVipLoading(true);
    setVipError(null);
    setVipSuccessMsg(null);

    try {
      const res = await fetch('/api/parent/unlock-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regId: record?.registrationId || record?.registration_id || record?.bookingId || record?.booking_id || registrationId,
          contact: contactInfo || record?.phone || record?.email,
          promoCode: vipCode.trim().toUpperCase()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to apply VIP Access Code.');
      }

      setVipSuccessMsg('✨ VIP Access Code applied successfully! Your Child Registration Form is unlocked below.');
      
      // Update local record status
      setRecordData((prev: any) => ({
        ...prev,
        currentStatus: 'Consultation Completed',
        isConsultationCompleted: true,
        record: {
          ...prev.record,
          status: 'Consultation Completed'
        }
      }));
    } catch (err: any) {
      console.error(err);
      setVipError(err.message || 'Invalid VIP Code.');
    } finally {
      setVipLoading(false);
    }
  };

  const record = recordData?.record;
  const role = recordData?.role;
  const matchedCandidate = recordData?.matchedCandidate;

  const timelineSteps = (role === 'shadow' || role === 'tutor') ? TEACHER_TIMELINE : PARENT_TIMELINE;
  const currentStatus = record?.status || 'Interview Awaiting';

  const getStepStatusIndex = (status: string) => {
    const idx = timelineSteps.findIndex(s => s.name.toLowerCase() === status.toLowerCase());
    return idx !== -1 ? idx : 0;
  };

  const currentStepIndex = record ? getStepStatusIndex(currentStatus) : 0;

  return (
    <main className="min-h-screen bg-brand-light flex flex-col font-sans text-brand-dark">
      <Navbar />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-grow">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-4 border border-primary/20">
            <Sparkles size={14} className="text-secondary" />
            Live Application Status
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3">
            Check Your Application Status
          </h1>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            Enter your Registration ID and the phone number or email address you used during registration to view your real-time status.
          </p>
        </div>

        {/* LOOKUP FORM CARD */}
        {!recordData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-border"
          >
            <form onSubmit={handleLookup} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                  Registration ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted font-bold text-sm">
                    #
                  </span>
                  <input
                    type="text"
                    required
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    placeholder="e.g. SB-2026-8714 or TSB-2026-9942 or TUT-2026-5541"
                    className="w-full pl-9 pr-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
                  />
                </div>
                <p className="text-[11px] text-brand-muted mt-1.5">Found in your consultation or registration confirmation email.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                  Phone Number or Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Enter phone number or email address"
                    className="w-full pl-10 pr-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <p className="text-[11px] text-brand-muted mt-1.5">Must match the phone or email provided during registration.</p>
              </div>

              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs font-medium leading-relaxed flex gap-3 items-start"
                >
                  <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1 text-rose-950">Lookup Verification Failed</p>
                    <p>{errorMsg}</p>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying Registration...</span>
                ) : (
                  <>
                    <span>Check Status Now</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </form>

            <div className="mt-8 pt-6 border-t border-brand-border text-center text-xs text-brand-muted">
              Need assistance? Contact support at{' '}
              <a href="mailto:theshadowbridgesupport@gmail.com" className="text-primary font-bold hover:underline">
                theshadowbridgesupport@gmail.com
              </a>
            </div>
          </motion.div>
        )}

        {/* STATUS DASHBOARD DISPLAY */}
        {recordData && record && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Top Bar Navigation */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-brand-border shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Registration Record</p>
                  <p className="font-mono font-bold text-sm text-primary">{record.registrationId || record.registration_id || 'REGISTERED'}</p>
                </div>
              </div>

              <button
                onClick={handleResetSearch}
                className="px-4 py-2 bg-brand-light hover:bg-brand-border/50 text-brand-dark rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Look Up Another Status
              </button>
            </div>

            {/* Main Application Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-6 mb-6">
                <div>
                  <span className="px-3 py-1 bg-brand-light border border-brand-border text-brand-dark text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-2">
                    {role === 'shadow' ? 'Shadow Teacher Candidate' : role === 'tutor' ? 'Home Tutor Candidate' : 'Parent Inquiry'}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-primary">
                    {record.name || record.parentName || 'Registered User'}
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Submitted on {new Date(record.created_at || record.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 px-5 py-3 rounded-2xl text-center sm:text-right">
                  <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Current Status</p>
                  <p className="text-lg font-extrabold text-primary font-serif mt-0.5">{currentStatus}</p>
                </div>
              </div>

              {/* STATUS EXPLANATION BANNER */}
              <div className="bg-brand-light/60 border border-brand-border rounded-2xl p-5 mb-8 flex items-start gap-3">
                <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Status Overview</h4>
                  <p className="text-xs sm:text-sm text-brand-dark leading-relaxed font-medium">
                    {STATUS_EXPLANATIONS[currentStatus] || `Your application status is currently marked as "${currentStatus}".`}
                  </p>
                </div>
              </div>

              {/* DYNAMIC NEXT ACTION BANNER FOR PARENT FLOW */}
              {role === 'parent' && (
                <>
                  {/* VIP ACCESS CODE REDEEM BOX (If status is Consultation Booked) */}
                  {currentStatus.toLowerCase().includes('booked') && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 mb-8 shadow-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="px-3 py-1 bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider flex items-center gap-1.5 w-max mb-2">
                            <Ticket size={12} className="text-secondary" />
                            Have a VIP Access Code?
                          </span>
                          <h3 className="font-serif text-lg font-bold text-primary">
                            Redeem VIP Access Code
                          </h3>
                          <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                            If our team provided you with a VIP access code, enter it below to bypass consultation wait time and unlock your registration form instantly.
                          </p>
                        </div>

                        <form onSubmit={handleApplyVipCode} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                          <input
                            type="text"
                            value={vipCode}
                            onChange={(e) => setVipCode(e.target.value)}
                            placeholder="Enter VIP Access Code"
                            className="px-4 py-2.5 bg-white border border-purple-300 rounded-xl text-xs font-mono font-bold text-primary uppercase focus:outline-none focus:ring-2 focus:ring-secondary/40"
                          />
                          <button
                            type="submit"
                            disabled={vipLoading || !vipCode.trim()}
                            className="px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {vipLoading ? 'Applying...' : 'Unlock Form'}
                          </button>
                        </form>
                      </div>

                      {vipError && (
                        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
                          <AlertCircle size={14} className="text-rose-600 shrink-0" />
                          <span>{vipError}</span>
                        </div>
                      )}

                      {vipSuccessMsg && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                          <Sparkles size={14} className="text-emerald-600 shrink-0" />
                          <span>{vipSuccessMsg}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* 1. Status: Consultation Completed -> Continue to Registration Form */}
                  {(currentStatus.toLowerCase().includes('consultation completed') || (currentStatus.toLowerCase().includes('completed') && !currentStatus.toLowerCase().includes('submitted'))) && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8 shadow-md">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                            ✓ Step 4 • Consultation Completed
                          </span>
                          <h3 className="font-serif text-lg font-bold text-emerald-950 mt-2">
                            Child Registration Form Unlocked!
                          </h3>
                          <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                            Your 1-on-1 consultation call is complete. Please provide your child's specific developmental and school details to proceed with matching.
                          </p>
                        </div>

                        <a
                          href={`/register/parent/form?regId=${encodeURIComponent(record.registrationId || record.registration_id || record.bookingId || record.booking_id || '')}`}
                          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                          <span>Continue to Registration Form</span>
                          <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 2. Status: Registration Submitted -> Continue to Placement Fee Payment */}
                  {currentStatus.toLowerCase().includes('registration submitted') && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 shadow-md">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                            ⚡ Step 5 • Form Received
                          </span>
                          <h3 className="font-serif text-lg font-bold text-amber-950 mt-2">
                            Ready for Educator Matching!
                          </h3>
                          <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                            Your child details have been saved. Pay the placement fee to lock your requirement and initiate educator shortlisting.
                          </p>
                        </div>

                        <a
                          href={`/register/parent/placement-fee?regId=${encodeURIComponent(record.registrationId || record.registration_id || record.bookingId || record.booking_id || '')}`}
                          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                          <span>Continue to Placement Fee Payment</span>
                          <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* CANDIDATE CUSTOM MESSAGE FROM ADMIN (IF PROVIDED) */}
              {record.candidateMessage && (
                <div className="bg-secondary/10 border-2 border-secondary/30 rounded-2xl p-6 mb-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail size={18} className="text-secondary" />
                    <h4 className="text-xs font-extrabold text-secondary uppercase tracking-wider">
                      Message from Administration
                    </h4>
                  </div>
                  <div className="text-xs sm:text-sm text-brand-dark leading-relaxed font-medium whitespace-pre-wrap bg-white/80 p-4 rounded-xl border border-secondary/20">
                    {record.candidateMessage}
                  </div>
                </div>
              )}

              {/* VISUAL TIMELINE PROGRESS */}
              <div className="mt-8">
                <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-6">
                  Application Progress Timeline
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {timelineSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div 
                        key={step.name}
                        className={`p-4 rounded-2xl border transition-all text-left relative ${
                          isCurrent 
                            ? 'bg-primary text-white border-primary shadow-md scale-[1.02]' 
                            : isCompleted 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                              : 'bg-brand-light/30 border-brand-border text-brand-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-brand-border/40 text-brand-muted'
                          }`}>
                            Step {idx + 1}
                          </span>
                          {isCompleted && (
                            <CheckCircle2 size={16} className={isCurrent ? 'text-white' : 'text-emerald-600'} />
                          )}
                        </div>

                        <h4 className={`text-xs font-bold leading-tight ${isCurrent ? 'text-white' : 'text-brand-dark'}`}>
                          {step.name}
                        </h4>
                        <p className={`text-[11px] mt-1 leading-snug ${isCurrent ? 'text-white/80' : 'text-brand-muted'}`}>
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MATCHED PROPOSED CANDIDATE (FOR PARENT MATCH PROPOSED STATUS) */}
              {matchedCandidate && (
                <div className="mt-10 pt-8 border-t border-brand-border">
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={20} className="text-secondary" />
                      <h3 className="font-serif text-lg font-bold text-primary">Proposed Candidate Profile Match</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-brand-dark">
                      <div className="bg-white p-4 rounded-2xl border border-brand-border">
                        <p className="text-[10px] font-bold text-brand-muted uppercase">Candidate Name</p>
                        <p className="font-bold text-sm text-primary mt-0.5">{matchedCandidate.name}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-brand-border">
                        <p className="text-[10px] font-bold text-brand-muted uppercase">Qualifications</p>
                        <p className="font-bold text-sm text-primary mt-0.5">{matchedCandidate.qualification}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-brand-border">
                        <p className="text-[10px] font-bold text-brand-muted uppercase">Teaching Experience</p>
                        <p className="font-bold text-sm text-primary mt-0.5">{matchedCandidate.experience}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-brand-border">
                        <p className="text-[10px] font-bold text-brand-muted uppercase">Specialization</p>
                        <p className="font-bold text-sm text-primary mt-0.5">{matchedCandidate.specialization || 'Special Education'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </motion.div>
        )}

      </section>

      <Footer />
    </main>
  );
}
