'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle, ArrowRight, Lock, Sparkles, User, Phone, Mail, MapPin, 
  School, Home, Heart, ShieldAlert, AlertCircle, Info, FileText
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function GatedRegistrationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [lookupQuery, setLookupQuery] = useState('');
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [gatedStatus, setGatedStatus] = useState<any | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Form inputs
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childGender, setChildGender] = useState('Boy');
  const [childGrade, setChildGrade] = useState('');
  const [schoolLocation, setSchoolLocation] = useState('');
  const [homeLocation, setHomeLocation] = useState('');
  const [hasDiagnosis, setHasDiagnosis] = useState('No');
  const [diagnosis, setDiagnosis] = useState('');
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchGatedStatus = async (queryVal: string) => {
    if (!queryVal.trim()) return;
    setLoadingCheck(true);
    setCheckError(null);

    try {
      const res = await fetch(`/api/parent/gated-check?regId=${encodeURIComponent(queryVal)}&contact=${encodeURIComponent(queryVal)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'We could not locate your consultation record. Please verify your Registration ID or Phone/Email.');
      }

      setGatedStatus(data);
      if (data.record) {
        if (data.record.childName && data.record.childName !== 'Pending Consultation') {
          setChildName(data.record.childName);
        }
        if (data.record.childGrade && data.record.childGrade !== 'Pending Consultation') {
          setChildGrade(data.record.childGrade);
        }
        if (data.record.schoolLocation) setSchoolLocation(data.record.schoolLocation);
        if (data.record.homeLocation) setHomeLocation(data.record.homeLocation);
      }
    } catch (err: any) {
      console.error(err);
      setCheckError(err.message);
      setGatedStatus(null);
    } finally {
      setLoadingCheck(false);
    }
  };

  useEffect(() => {
    const regId = searchParams.get('regId');
    const contact = searchParams.get('contact');
    if (regId) {
      setLookupQuery(regId);
      fetchGatedStatus(regId);
    } else if (contact) {
      setLookupQuery(contact);
      fetchGatedStatus(contact);
    }
  }, [searchParams]);

  const handleDifficultyToggle = (item: string) => {
    if (difficulties.includes(item)) {
      setDifficulties(difficulties.filter(d => d !== item));
    } else {
      setDifficulties([...difficulties, item]);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gatedStatus || !gatedStatus.record) return;

    const missing: string[] = [];
    if (!childName.trim()) missing.push("Child's Name");
    if (!childGrade.trim()) missing.push("Class / Grade");

    if (missing.length > 0) {
      setFormError(`Please fill in required fields: ${missing.join(', ')}.`);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const rec = gatedStatus.record;
      const regId = rec.registrationId || rec.registration_id || rec.bookingId || rec.booking_id;
      
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'parent_registration_submit',
          regId,
          email: rec.email,
          phone: rec.phone,
          childName: childName.trim(),
          childAge: childAge.trim(),
          childGender,
          childGrade: childGrade.trim(),
          schoolLocation: schoolLocation.trim(),
          homeLocation: homeLocation.trim(),
          hasDiagnosis,
          diagnosis: diagnosis.trim(),
          difficulties,
          additionalNotes: additionalNotes.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit registration form.');
      }

      // Route to Step 5 Placement Fee Payment
      const finalRegId = data.registration_id || regId;
      router.push(`/register/parent/placement-fee?regId=${encodeURIComponent(finalRegId)}`);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message);
      setSubmitting(false);
    }
  };

  const isConsultationCompleted = gatedStatus?.isConsultationCompleted;
  const isShadow = gatedStatus?.subType === 'shadow';

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-grow">
      
      {/* Header Indicator */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-4 border border-primary/20">
          <Sparkles size={14} className="text-secondary" />
          Step 4 of 5 • Parent Registration Form (Gated)
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3">
          Detailed Child Registration Form
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Provide your child's specific developmental, academic, and school placement requirements.
        </p>
      </div>

      {/* LOOKUP SEARCH IF NO RECORD LOADED */}
      {!gatedStatus && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-border"
        >
          <div className="text-center mb-6">
            <h3 className="font-serif text-xl font-bold text-primary">Verify Your Consultation Access</h3>
            <p className="text-xs text-brand-muted mt-1">Enter your Registration ID or Phone/Email to unlock your registration form.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); fetchGatedStatus(lookupQuery); }} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="Registration ID (e.g. SB-2026-8849) or Phone / Email"
                className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {checkError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs flex gap-2 items-center font-medium">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span>{checkError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingCheck}
              className="w-full btn-gradient py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {loadingCheck ? 'Verifying Consultation Access...' : 'Unlock Registration Form'}
            </button>
          </form>
        </motion.div>
      )}

      {/* GATED LOCKED SCREEN IF CONSULTATION NOT COMPLETED */}
      {gatedStatus && !isConsultationCompleted && (
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
              Consultation Required First
            </span>
            <h2 className="font-serif text-2xl font-bold text-primary">Registration Form Locked</h2>
            <p className="text-sm text-brand-muted mt-3 leading-relaxed">
              Please complete your 1-on-1 assessment consultation with Founder Pratibha Mishra first. Once your consultation is completed, this registration form will be available automatically.
            </p>
          </div>

          <div className="bg-brand-light p-4 rounded-2xl border border-brand-border text-xs space-y-2 text-left">
            <p className="font-bold text-primary">Current Status: <span className="text-amber-700">{gatedStatus.currentStatus}</span></p>
            <p className="text-brand-muted">Registration ID: <span className="font-mono font-bold text-brand-dark">{gatedStatus.record?.registrationId || gatedStatus.record?.registration_id}</span></p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register/parent"
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Book Consultation (₹99)</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* UNLOCKED FULL REGISTRATION FORM */}
      {gatedStatus && isConsultationCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-brand-border max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-6">
            <CheckCircle size={14} className="text-emerald-600" />
            <span>Consultation Completed • Form Unlocked</span>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">

            {/* Child Basic Details */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-primary border-b border-brand-border pb-2">
                Child's General Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    Child Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    Class / Grade <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={childGrade}
                    onChange={(e) => setChildGrade(e.target.value)}
                    placeholder="e.g. Grade 3 / Kindergarten"
                    className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    Child Age / Date of Birth
                  </label>
                  <input
                    type="text"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="e.g. 7 years old or YYYY-MM-DD"
                    className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={childGender}
                    onChange={(e) => setChildGender(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location & School Info */}
            <div className="space-y-4 pt-2">
              <h3 className="font-serif text-lg font-bold text-primary border-b border-brand-border pb-2">
                Location Details
              </h3>

              {isShadow && (
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    School Name & Location
                  </label>
                  <input
                    type="text"
                    value={schoolLocation}
                    onChange={(e) => setSchoolLocation(e.target.value)}
                    placeholder="e.g. DPS Sector 62, Noida"
                    className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                  Home Address / Locality
                </label>
                <input
                  type="text"
                  value={homeLocation}
                  onChange={(e) => setHomeLocation(e.target.value)}
                  placeholder="e.g. Royal Residency, Sector 62, Noida"
                  className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Diagnosis & Support Needs (For Shadow Teacher Path) */}
            {isShadow && (
              <div className="space-y-4 pt-2">
                <h3 className="font-serif text-lg font-bold text-primary border-b border-brand-border pb-2">
                  Diagnostic & Special Support Details
                </h3>

                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                    Does your child have a formal diagnosis?
                  </label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-xs font-bold text-brand-dark cursor-pointer">
                        <input
                          type="radio"
                          name="hasDiagnosis"
                          value={opt}
                          checked={hasDiagnosis === opt}
                          onChange={(e) => setHasDiagnosis(e.target.value)}
                          className="accent-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {hasDiagnosis === 'Yes' && (
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                      Diagnosis Details
                    </label>
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Autism Spectrum (Mild), ADHD, Dyslexia"
                      className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                    Primary Areas Needing Support (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {['Attention/Focus', 'Social Interaction', 'Speech & Communication', 'Behavioral Guidance', 'Classroom Learning', 'Emotional Regulation'].map((d) => (
                      <label key={d} className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        difficulties.includes(d) ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-brand-light/30 border-brand-border text-brand-dark'
                      }`}>
                        <input
                          type="checkbox"
                          checked={difficulties.includes(d)}
                          onChange={() => handleDifficultyToggle(d)}
                          className="hidden"
                        />
                        <span>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                  Additional Notes / Specific Preferences
                </label>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Mention any specific requirements, timing preferences, or notes discussed during your consultation..."
                  className="w-full px-4 py-3 bg-brand-light/50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs flex gap-2 items-center font-medium">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gradient py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Submitting Registration Form...</span>
              ) : (
                <>
                  <span>Proceed to Placement Fee Payment</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>
        </motion.div>
      )}

    </section>
  );
}

export default function GatedRegistrationPage() {
  return (
    <main className="min-h-screen bg-brand-light flex flex-col font-sans text-brand-dark">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-sm font-bold text-primary">Loading Registration Page...</div>}>
        <GatedRegistrationContent />
      </Suspense>
      <Footer />
    </main>
  );
}
