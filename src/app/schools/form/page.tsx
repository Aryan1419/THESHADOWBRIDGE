'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight, Sparkles, FileText, Check, Plus, Minus
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SchoolFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regId = searchParams.get('regId') || '';

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // Form Fields
  const [schoolName, setSchoolName] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [streetLandmark, setStreetLandmark] = useState('');
  const [city, setCity] = useState('');
  const [locationArea, setLocationArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('Delhi');

  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('Principal');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');

  const [teachersCount, setTeachersCount] = useState<number>(1);
  const [expectedJoiningDate, setExpectedJoiningDate] = useState('');
  const [workingDays, setWorkingDays] = useState('Mon - Fri');
  const [workingHoursFrom, setWorkingHoursFrom] = useState('08:00 AM');
  const [workingHoursTo, setWorkingHoursTo] = useState('02:00 PM');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (!regId) {
      setErrorMsg('Missing Registration ID.');
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

        const r = data.record;
        setRecord(r);

        // Pre-fill existing data
        setSchoolName(r.schoolName || r.school_name || '');
        setContactName(r.contactName || r.contact_name || '');
        setDesignation(r.designation || 'Principal');
        setEmail(r.email || '');
        setPhone(r.phone || '');
        setCity(r.city || '');
        setLocationArea(r.preferredLocation || r.preferred_location || '');
        setTeachersCount(Number(r.teachersCount || r.teachers_count || 1));
        if (r.detailedAddress || r.detailed_address) setDetailedAddress(r.detailedAddress || r.detailed_address);
        if (r.pincode) setPincode(r.pincode);
        if (r.termsAccepted || r.terms_accepted) setTermsAccepted(true);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to fetch registration record.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [regId]);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMsg('Please read and accept the terms & conditions before completing registration.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/register/school/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: regId,
          detailedAddress,
          streetLandmark,
          pincode,
          state,
          alternateNumber,
          expectedJoiningDate,
          workingDays,
          workingHours: `${workingHoursFrom} - ${workingHoursTo}`,
          termsAccepted: true
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit registration details.');
      }

      setCompleted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit registration form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light/30 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 sm:pt-36 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="bg-white border border-brand-border rounded-3xl p-12 text-center shadow-lg">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-primary">Loading School Registration Form...</p>
            </div>
          ) : completed ? (
            <div className="bg-white border border-brand-border rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="font-serif text-3xl font-black text-primary">
                School Registration Complete!
              </h2>
              <p className="text-sm text-brand-dark/80 max-w-lg mx-auto leading-relaxed">
                Thank you! Your school details and hiring parameters for <strong>{schoolName}</strong> have been recorded under Registration ID <strong className="font-mono text-secondary">{regId}</strong>.
              </p>
              <div className="p-4 bg-brand-light/60 border border-brand-border rounded-2xl text-xs text-brand-muted max-w-md mx-auto space-y-1 text-left">
                <p>• <strong>Status:</strong> Candidate Profiles Being Shortlisted</p>
                <p>• Our placement coordinators will contact you to schedule educator interviews at your convenience.</p>
              </div>
              <div className="pt-3">
                <Link href={`/check-status?regId=${encodeURIComponent(regId)}`} className="btn-gradient inline-flex px-6 py-3 rounded-2xl font-bold text-xs shadow-lg">
                  Track Requirement Status
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-10 shadow-xl text-left space-y-8">
              
              {/* Header */}
              <div className="border-b border-brand-border/60 pb-5">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                  Unlocked Registration Form
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-primary mt-2">
                  School Detailed Registration & Terms Agreement
                </h1>
                <p className="text-xs text-brand-muted mt-1">
                  Registration ID: <span className="font-mono font-bold text-secondary">{regId}</span>
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitRegistration} className="space-y-8">
                
                {/* Section D: SCHOOL REGISTRATION FORM */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-primary border-b border-brand-border/40 pb-2">
                    Section D: School & Address Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">School Name *</label>
                      <input
                        type="text"
                        required
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Detailed School Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="Flat / Building / Block No. / Campus"
                        value={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Street / Landmark *</label>
                      <input
                        type="text"
                        placeholder="Street / Road Name / Landmark"
                        value={streetLandmark}
                        onChange={(e) => setStreetLandmark(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Location / Area *</label>
                      <input
                        type="text"
                        required
                        placeholder="Location / Sector / Area"
                        value={locationArea}
                        onChange={(e) => setLocationArea(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Pincode *</label>
                      <input
                        type="text"
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">State *</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Person Details */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-primary border-b border-brand-border/40 pb-2">
                    Contact Person Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Contact Person Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Designation *</label>
                      <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
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
                      <label className="block text-xs font-bold text-primary mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Alternate Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="Enter Alternate Phone"
                        value={alternateNumber}
                        onChange={(e) => setAlternateNumber(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Section E: REQUIREMENTS & TERMS AGREEMENT */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-primary border-b border-brand-border/40 pb-2">
                    Section E: Hiring Details & Schedule
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Number of Shadow Teachers *</label>
                      <div className="flex items-center gap-3 bg-brand-light/50 border border-brand-border rounded-xl p-1.5 w-fit">
                        <button
                          type="button"
                          onClick={() => setTeachersCount(Math.max(1, teachersCount - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-brand-border flex items-center justify-center font-bold text-primary"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-extrabold text-sm text-primary px-2">{teachersCount}</span>
                        <button
                          type="button"
                          onClick={() => setTeachersCount(teachersCount + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-brand-border flex items-center justify-center font-bold text-primary"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Expected Joining Date *</label>
                      <input
                        type="date"
                        required
                        value={expectedJoiningDate}
                        onChange={(e) => setExpectedJoiningDate(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Working Days *</label>
                      <select
                        value={workingDays}
                        onChange={(e) => setWorkingDays(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      >
                        <option value="Mon - Fri">Mon - Fri (5 Days)</option>
                        <option value="Mon - Sat">Mon - Sat (6 Days)</option>
                        <option value="Flexible">Flexible Schedule</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Working Hours (From) *</label>
                      <input
                        type="text"
                        placeholder="e.g. 08:00 AM"
                        value={workingHoursFrom}
                        onChange={(e) => setWorkingHoursFrom(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Working Hours (To) *</label>
                      <input
                        type="text"
                        placeholder="e.g. 02:00 PM"
                        value={workingHoursTo}
                        onChange={(e) => setWorkingHoursTo(e.target.value)}
                        className="w-full p-3 border border-brand-border rounded-xl text-xs bg-white text-brand-dark font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions Block */}
                <div className="p-6 bg-brand-light/60 border border-brand-border rounded-3xl space-y-3 text-left">
                  <h4 className="font-serif font-bold text-sm text-primary">Terms & Conditions</h4>
                  <ul className="text-xs text-brand-dark/80 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>We will shortlist and send suitable profiles.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Interviews will be conducted at the school's convenience.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Replacement will be provided in case of unsatisfactory performance.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>
                        <strong>Paying Hiring Fee:</strong> One-time Placement Fee: ₹5,000 (Non-refundable) + Our Commission: <strong>50% of the first month's salary</strong> (One-time). No monthly recurring charges after this.
                      </span>
                    </li>
                  </ul>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-primary">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 text-primary rounded border-brand-border focus:ring-primary"
                      />
                      <span>I agree to the terms & conditions.</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting || !termsAccepted}
                    className="btn-gradient w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Saving Registration Details...</span>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Submit & Complete</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SchoolFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-light/30 flex items-center justify-center text-xs font-bold text-primary">Loading School Form...</div>}>
      <SchoolFormContent />
    </Suspense>
  );
}
