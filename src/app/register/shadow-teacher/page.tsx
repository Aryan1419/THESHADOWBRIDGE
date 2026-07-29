'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, ArrowRight, ArrowLeft, User, Phone, Mail, MapPin, 
  GraduationCap, Briefcase, Award, Sparkles, Calendar, Edit3, ShieldAlert,
  Plus, X, Upload, FileText, Trash2
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CITY_LOCALITIES } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function ShadowTeacherRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState('');
  const [regDate, setRegDate] = useState('');
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [customLocalityInput, setCustomLocalityInput] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    city: '',
    preferredLocations: [] as string[],
    address: '',

    // Step 2: Education & Experience
    qualification: '',
    specialization: '',
    experience: '', // prior experience dropdown
    certificates: '',

    // Step 3: Professional Details
    specialNeedsExp: '', // Yes/No
    comfortableAreas: [] as string[], // ASD, ADHD, Learning Disabilities, Down Syndrome, Physical Disabilities, Others
    otherComfortable: '',
    openToTravel: '', // Yes/No
    preferredWorkType: '' // Full-time, Part-time, Flexible
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setSelectedLocality('');
      setCustomLocalityInput('');
      setFormData(prev => ({
        ...prev,
        city: value,
        preferredLocations: []
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: 'comfortableAreas', value: string) => {
    setFormData(prev => {
      const list = prev[category] as string[];
      if (list.includes(value)) {
        return { ...prev, [category]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...list, value] };
      }
    });
  };

  // Tag Input Mechanics
  const handleAddTag = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !formData.preferredLocations.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(t => t !== tag)
    }));
  };

  // Step Validation Check
  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        return !!(formData.name && formData.dob && formData.gender && formData.phone && formData.email && formData.city && formData.preferredLocations.length > 0);
      case 2:
        return !!(formData.qualification && formData.experience);
      case 3:
        return !!(formData.specialNeedsExp && formData.comfortableAreas.length > 0 && formData.openToTravel && formData.preferredWorkType && (!formData.comfortableAreas.includes('Others') || formData.otherComfortable));
      case 4:
        return confirmSubmit && agreeTerms;
      default:
        return true;
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!confirmSubmit || !agreeTerms) {
      setShowErrors(true);
      return;
    }

    // Required fields check
    if (!formData.name || !formData.phone || !formData.email || !formData.city || !formData.qualification || !formData.experience) {
      setSubmitError('Please fill out all required fields (Name, Phone, Email, City, Qualification, Experience) before submitting.');
      setShowErrors(true);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: 'shadow',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        qualification: formData.qualification,
        experience: formData.experience,
        skills: formData.comfortableAreas.join(', ') + (formData.comfortableAreas.includes('Others') ? ` (${formData.otherComfortable})` : ''),
        
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        preferredLocations: formData.preferredLocations.join(', '),
        specialization: formData.specialization,
        certificates: formData.certificates,
        specialNeedsExp: formData.specialNeedsExp,
        openToTravel: formData.openToTravel,
        preferredWorkType: formData.preferredWorkType,
        
        aadharCardName: '',
        qualificationCertName: '',
        experienceCertName: '',
        profilePhotoName: '',

        aadharCardUrl: '',
        qualificationCertUrl: '',
        experienceCertUrl: '',
        profilePhotoUrl: ''
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok && result.success) {
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
        const errMsg = result.error || 'Server error submitting registration. Please try again.';
        setSubmitError(errMsg);
      }
    } catch (err: any) {
      console.error('Submit exception:', err);
      setSubmitError(err.message || 'Network error submitting registration. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    "Personal Details",
    "Education & Experience",
    "Professional Details",
    "Review & Submit"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-b from-[#F7F5FC] to-white flex-grow flex items-center">
        <div className="max-w-4xl mx-auto px-4 w-full">
          
          {!submitted && (
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={12} className="text-secondary" />
                <span>Careers Portal</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-primary mb-3">
                Register as Shadow Teacher
              </h1>
              <p className="text-brand-muted text-sm sm:text-base max-w-md mx-auto">
                Join our premium special education placement pool. Complete the 4-step registration.
              </p>
            </div>
          )}

          {/* Form Wizard Container */}
          <div className="bg-white border border-brand-border rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto">
            
            {/* Step Progress Bar */}
            {!submitted && (
              <div className="bg-brand-light border-b border-brand-border px-6 py-5 sm:px-8">
                <div className="flex justify-between items-center relative">
                  {/* Progress Line */}
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-brand-border -translate-y-1/2 z-0"></div>
                  <div 
                    className="absolute left-0 top-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 transition-all duration-300 z-0"
                    style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
                  ></div>

                  {stepsList.map((stepName, idx) => {
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
                <div className="text-center mt-3">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Step {step} of 5: {stepsList[step - 1]}
                  </span>
                </div>
              </div>
            )}

            <div className="p-8 sm:p-10">
              {submitted ? (
                /* SUCCESS SCREEN */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-6"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
                    <CheckCircle className="text-emerald-600 animate-bounce" size={48} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-serif font-black text-primary text-3xl">Congratulations!</h2>
                    <p className="text-brand-muted text-base max-w-md mx-auto">
                      Your Shadow Teacher credentials and file documents have been logged successfully. Welcome aboard!
                    </p>
                  </div>

                  <div className="bg-brand-light border border-brand-border rounded-2xl p-6 max-w-sm mx-auto text-left space-y-3">
                    <div className="flex justify-between border-b border-brand-border/60 pb-2">
                      <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Registration ID</span>
                      <span className="text-sm font-black text-secondary">{regId}</span>
                    </div>
                    <div className="flex justify-between border-b border-brand-border/60 pb-2">
                      <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Applied Position</span>
                      <span className="text-sm font-bold text-brand-dark">Inclusive Shadow Teacher</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Registration Date</span>
                      <span className="text-sm font-semibold text-brand-dark">{regDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-muted max-w-md mx-auto">
                    *Our clinical mentoring panel will verify your special-ed qualifications and contact you to schedule trial school runs.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/"
                      className="px-6 py-3.5 border border-brand-border hover:bg-brand-light rounded-xl font-bold text-sm text-brand-dark transition-all"
                    >
                      Back to Home
                    </Link>
                    <Link
                      href={`/dashboard?role=shadow&regId=${regId}`}
                      className="px-6 py-3.5 bg-primary text-white font-bold rounded-xl text-sm transition-all hover:bg-primary/95 shadow-md flex items-center justify-center gap-1.5"
                    >
                      Go to My Dashboard
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* FORM BODY */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {showErrors && !isStepValid(step) && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2.5 text-sm">
                      <ShieldAlert size={20} className="text-rose-600 flex-shrink-0" />
                      <span>Please fill all required (*) fields before proceeding.</span>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {/* STEP 1: Personal Details */}
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">Personal Details</h3>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Priya Nair"
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Date of Birth *</label>
                            <input
                              type="date"
                              name="dob"
                              required
                              value={formData.dob}
                              onChange={handleInputChange}
                              className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Gender *</label>
                            <select
                              name="gender"
                              required
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                            >
                              <option value="">Select Gender</option>
                              <option value="Female">Female</option>
                              <option value="Male">Male</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
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
                              placeholder="e.g. priya@gmail.com"
                              className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Current Location (City) *</label>
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

                        {/* Preferred Work Locations - Dependent Dropdown */}
                        <div className="flex flex-col gap-1.5 pt-1">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Preferred Work Location(s) *</label>
                          
                          <select
                            disabled={!formData.city}
                            value={selectedLocality}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedLocality(val);
                              if (val !== 'Other (please specify)' && val !== '') {
                                if (!formData.preferredLocations.includes(val)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    preferredLocations: [...prev.preferredLocations, val]
                                  }));
                                }
                                setSelectedLocality('');
                              }
                            }}
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark disabled:bg-gray-100 disabled:text-gray-400"
                          >
                            <option value="">{formData.city ? `Select Preferred Area in ${formData.city}` : 'Select City first'}</option>
                            {formData.city && CITY_LOCALITIES[formData.city]?.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>

                          {/* Free-text input revealed when "Other (please specify)" is selected */}
                          {selectedLocality === 'Other (please specify)' && (
                            <div className="flex gap-2 mt-2 animate-fade-in-up">
                              <input
                                type="text"
                                value={customLocalityInput}
                                onChange={(e) => setCustomLocalityInput(e.target.value)}
                                placeholder="Specify your exact area / locality"
                                className="p-3 flex-grow border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (customLocalityInput.trim()) {
                                    const val = customLocalityInput.trim();
                                    if (!formData.preferredLocations.includes(val)) {
                                      setFormData(prev => ({
                                        ...prev,
                                        preferredLocations: [...prev.preferredLocations, val]
                                      }));
                                    }
                                    setCustomLocalityInput('');
                                    setSelectedLocality('');
                                  }
                                }}
                                className="px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 text-xs flex items-center justify-center cursor-pointer"
                              >
                                Add Area
                              </button>
                            </div>
                          )}

                          {formData.preferredLocations.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2 p-2.5 border border-brand-border bg-brand-light/30 rounded-xl">
                              {formData.preferredLocations.map((tag) => (
                                <span 
                                  key={tag} 
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brand-border text-primary text-xs font-bold rounded-full shadow-sm"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="text-brand-muted hover:text-rose-600 focus:outline-none cursor-pointer"
                                  >
                                    <X size={13} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-brand-muted italic mt-1">*Select one or more localities from the city dropdown above.</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Address (Area/Locality)</label>
                          <textarea
                            name="address"
                            rows={2}
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="e.g. Flat 401, Royal Enclave, Kondapur"
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Education & Experience */}
                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">Education & Experience</h3>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Highest Qualification *</label>
                          <select
                            name="qualification"
                            required
                            value={formData.qualification}
                            onChange={handleInputChange}
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          >
                            <option value="">Select Qualification</option>
                            
                            <optgroup label="Higher Secondary">
                              <option value="12th Pass / Higher Secondary">12th Pass / Higher Secondary</option>
                            </optgroup>

                            <optgroup label="Special Education &amp; Psychology">
                              <option value="B.Ed Special Education">B.Ed Special Education</option>
                              <option value="M.Ed Special Education">M.Ed Special Education</option>
                              <option value="Diploma in Special Education">Diploma in Special Education</option>
                              <option value="B.A. / M.A. in Psychology">B.A. / M.A. in Psychology</option>
                              <option value="Graduate with Special Needs Certifications">Graduate with Special Needs Certifications</option>
                            </optgroup>

                            <optgroup label="Graduation Degrees">
                              <option value="B.A. (Bachelor of Arts)">B.A. (Bachelor of Arts)</option>
                              <option value="B.Sc. (Bachelor of Science)">B.Sc. (Bachelor of Science)</option>
                              <option value="B.Com. (Bachelor of Commerce)">B.Com. (Bachelor of Commerce)</option>
                              <option value="BBA (Bachelor of Business Administration)">BBA (Bachelor of Business Administration)</option>
                              <option value="BCA (Bachelor of Computer Applications)">BCA (Bachelor of Computer Applications)</option>
                              <option value="B.Tech (Bachelor of Technology)">B.Tech (Bachelor of Technology)</option>
                              <option value="B.Ed (General)">B.Ed (General)</option>
                            </optgroup>

                            <optgroup label="Post Graduation Degrees">
                              <option value="M.A. (Master of Arts)">M.A. (Master of Arts)</option>
                              <option value="M.Sc. (Master of Science)">M.Sc. (Master of Science)</option>
                              <option value="M.Com. (Master of Commerce)">M.Com. (Master of Commerce)</option>
                              <option value="MBA (Master of Business Administration)">MBA (Master of Business Administration)</option>
                              <option value="MCA (Master of Computer Applications)">MCA (Master of Computer Applications)</option>
                              <option value="M.Tech (Master of Technology)">M.Tech (Master of Technology)</option>
                              <option value="M.Ed (General)">M.Ed (General)</option>
                            </optgroup>

                            <optgroup label="Others">
                              <option value="Other Qualification">Other Qualification</option>
                            </optgroup>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Specialization (Optional)</label>
                          <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            placeholder="e.g. Autism Spectrum Disorder, Learning Disability support"
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Prior Experience *</label>
                          <select
                            name="experience"
                            required
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          >
                            <option value="">Select Experience</option>
                            <option value="Fresher">Fresher</option>
                            <option value="0-2 Years">0-2 Years</option>
                            <option value="2-5 Years">2-5 Years</option>
                            <option value="More than 5 Years">More than 5 Years</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Relevant Certificates (Optional)</label>
                          <textarea
                            name="certificates"
                            rows={3}
                            value={formData.certificates}
                            onChange={handleInputChange}
                            placeholder="List certifications (e.g. ABA Therapy workshops, dyslexia reading program training, sign language certifications)..."
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Professional Details */}
                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">Professional Details</h3>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Do you have experience working with children with special needs? *</label>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                              <input
                                type="radio"
                                name="specialNeedsExp"
                                value="Yes"
                                checked={formData.specialNeedsExp === "Yes"}
                                onChange={handleInputChange}
                                className="accent-primary w-4 h-4"
                              /> Yes
                            </label>
                            <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                              <input
                                type="radio"
                                name="specialNeedsExp"
                                value="No"
                                checked={formData.specialNeedsExp === "No"}
                                onChange={handleInputChange}
                                className="accent-primary w-4 h-4"
                              /> No
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Areas you are comfortable with *</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                              "Autism Spectrum Disorder ASD",
                              "ADHD",
                              "Learning Disabilities",
                              "Down Syndrome",
                              "Physical Disabilities",
                              "Others"
                            ].map((area) => (
                              <label key={area} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.comfortableAreas.includes(area)}
                                  onChange={() => handleCheckboxChange('comfortableAreas', area)}
                                  className="accent-primary rounded w-4 h-4"
                                /> {area}
                              </label>
                            ))}
                          </div>
                        </div>

                        {formData.comfortableAreas.includes('Others') && (
                          <div className="flex flex-col gap-1.5 pt-2 animate-fade-in-up">
                            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Please specify other areas *</label>
                            <input
                              type="text"
                              name="otherComfortable"
                              required
                              value={formData.otherComfortable}
                              onChange={handleInputChange}
                              placeholder="e.g. Speech delays, sensory processing disorders"
                              className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                            />
                          </div>
                        )}

                        <div className="space-y-2 pt-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Are you open to travel? *</label>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                              <input
                                type="radio"
                                name="openToTravel"
                                value="Yes"
                                checked={formData.openToTravel === "Yes"}
                                onChange={handleInputChange}
                                className="accent-primary w-4 h-4"
                              /> Yes
                            </label>
                            <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                              <input
                                type="radio"
                                name="openToTravel"
                                value="No"
                                checked={formData.openToTravel === "No"}
                                onChange={handleInputChange}
                                className="accent-primary w-4 h-4"
                              /> No
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Preferred Work Type *</label>
                          <div className="flex gap-6 flex-wrap">
                            {["Full-time", "Part-time", "Flexible"].map((wtype) => (
                              <label key={wtype} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                <input
                                  type="radio"
                                  name="preferredWorkType"
                                  value={wtype}
                                  checked={formData.preferredWorkType === wtype}
                                  onChange={handleInputChange}
                                  className="accent-primary w-4 h-4"
                                /> {wtype}
                              </label>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: Review & Submit */}
                    {step === 4 && (
                      <motion.div
                        key="step-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2">Review &amp; Submit</h3>
                        
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                          
                          {/* Summary Card 1: Personal */}
                          <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative">
                            <button 
                              type="button" 
                              onClick={() => handleJumpToStep(1)}
                              className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">1. Personal Details</h4>
                            <div className="grid grid-cols-2 gap-y-1.5 text-xs text-brand-dark">
                              <div><strong>Name:</strong> {formData.name}</div>
                              <div><strong>DOB:</strong> {formData.dob}</div>
                              <div><strong>Gender:</strong> {formData.gender}</div>
                              <div><strong>Mobile:</strong> {formData.phone}</div>
                              <div className="col-span-2"><strong>Email:</strong> {formData.email}</div>
                              <div><strong>City:</strong> {formData.city}</div>
                              <div className="col-span-2"><strong>Preferred Locations:</strong> {formData.preferredLocations.join(', ')}</div>
                              {formData.address && <div className="col-span-2"><strong>Address:</strong> {formData.address}</div>}
                            </div>
                          </div>

                          {/* Summary Card 2: Education */}
                          <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative">
                            <button 
                              type="button" 
                              onClick={() => handleJumpToStep(2)}
                              className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">2. Education &amp; Experience</h4>
                            <div className="space-y-1.5 text-xs text-brand-dark">
                              <div><strong>Highest Qualification:</strong> {formData.qualification}</div>
                              {formData.specialization && <div><strong>Specialization:</strong> {formData.specialization}</div>}
                              <div><strong>Prior Experience:</strong> {formData.experience}</div>
                              {formData.certificates && <div><strong>Certificates:</strong> {formData.certificates}</div>}
                            </div>
                          </div>

                          {/* Summary Card 3: Professional */}
                          <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative">
                            <button 
                              type="button" 
                              onClick={() => handleJumpToStep(3)}
                              className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">3. Professional Details</h4>
                            <div className="space-y-1.5 text-xs text-brand-dark">
                              <div><strong>Special Needs Experience:</strong> {formData.specialNeedsExp}</div>
                              <div><strong>Comfortable Areas:</strong> {formData.comfortableAreas.join(', ')}</div>
                              {formData.comfortableAreas.includes('Others') && <div><strong>Other Areas:</strong> {formData.otherComfortable}</div>}
                              <div><strong>Open to Travel:</strong> {formData.openToTravel}</div>
                              <div><strong>Preferred Work Type:</strong> {formData.preferredWorkType}</div>
                            </div>
                          </div>

                        </div>

                        {submitError && (
                          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900 leading-relaxed font-semibold animate-fade-in-up mb-4">
                            <ShieldAlert size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-rose-900 font-bold mb-0.5">Submission Failed</strong>
                              <span>{submitError}</span>
                            </div>
                          </div>
                        )}

                        <div className="border-t border-brand-border/60 pt-4 space-y-3">
                          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-dark font-semibold cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={confirmSubmit}
                              onChange={(e) => setConfirmSubmit(e.target.checked)}
                              className="accent-primary rounded w-4 h-4 mt-0.5 flex-shrink-0"
                            />
                            <span>I confirm that all the information provided by me is true and correct *</span>
                          </label>                          
                          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-dark font-semibold cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={agreeTerms}
                              onChange={(e) => setAgreeTerms(e.target.checked)}
                              className="accent-primary rounded w-4 h-4 mt-0.5 flex-shrink-0"
                            />
                            <span>
                              I have read and agree to the{' '}
                              <Link href="/terms" target="_blank" className="text-accent underline font-bold hover:text-primary transition-colors">
                                Terms &amp; Conditions
                              </Link>{' '}
                              and{' '}
                              <Link href="/privacy" target="_blank" className="text-accent underline font-bold hover:text-primary transition-colors">
                                Privacy Policy
                              </Link>
                              . *
                            </span>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center border-t border-brand-border/60 pt-6 mt-6">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-3 border border-brand-border text-brand-dark hover:bg-brand-light rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {step < 4 ? (
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
                        className="btn-gradient px-8 py-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Submitting...' : 'Complete Your Registration'}
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
