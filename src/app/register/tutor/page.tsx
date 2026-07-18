'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, ArrowRight, ArrowLeft, User, Phone, Mail, MapPin, 
  GraduationCap, Briefcase, BookOpen, Sparkles, Calendar, Edit3, ShieldAlert
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TutorRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState('');
  const [regDate, setRegDate] = useState('');
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    city: '',
    address: '',

    // Step 2: Education & Experience
    qualification: '',
    addQualification: '',
    experience: '',
    certifications: '',

    // Step 3: Preferences
    teachSpecialNeeds: '', // Yes / No
    preferredStudents: [] as string[], // Special Needs, Regular Tuition, Both
    modeOfTeaching: '', // Online, Offline, Both

    // Step 4: Subjects & Classes
    classes: [] as string[], // Pre-Primary, Primary 1st-5th, Middle 6th-8th, Secondary 9th-10th, Senior Secondary 11th-12th, All Classes
    subjects: [] as string[], // All Subjects, English, Mathematics, Science, Social Science, Hindi, Other Languages, Other
    otherSubjects: '',

    // Step 5: Additional Info
    teachingStyle: '',
    availability: [] as string[], // Weekdays, Weekends, Flexible
    preferredModes: [] as string[], // In Person/Home Tuition, At Tutor's Home, Online
    otherInfo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: 'preferredStudents' | 'classes' | 'subjects' | 'availability' | 'preferredModes', value: string) => {
    setFormData(prev => {
      const list = prev[category] as string[];
      if (list.includes(value)) {
        return { ...prev, [category]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...list, value] };
      }
    });
  };

  // Check step validation
  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        return !!(formData.name && formData.dob && formData.gender && formData.phone && formData.email && formData.city && formData.address);
      case 2:
        return !!(formData.qualification && formData.experience);
      case 3:
        return !!(formData.teachSpecialNeeds && formData.preferredStudents.length > 0 && formData.modeOfTeaching);
      case 4:
        return !!(formData.classes.length > 0 && formData.subjects.length > 0 && (!formData.subjects.includes('Other') || formData.otherSubjects));
      case 5:
        return !!(formData.availability.length > 0 && formData.preferredModes.length > 0);
      case 6:
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
    if (!confirmSubmit || !agreeTerms) {
      setShowErrors(true);
      return;
    }

    setLoading(true);

    // Format subjects & grades for the backend requirements
    const payload = {
      type: 'tutor',
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      subjects: formData.subjects.join(', ') + (formData.subjects.includes('Other') ? ` (${formData.otherSubjects})` : ''),
      grades: formData.classes.join(', '),
      experience: formData.experience,
      qualification: formData.qualification,
      
      // Extra details saved in JSON
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      addQualification: formData.addQualification,
      certifications: formData.certifications,
      teachSpecialNeeds: formData.teachSpecialNeeds,
      preferredStudents: formData.preferredStudents.join(', '),
      modeOfTeaching: formData.modeOfTeaching,
      teachingStyle: formData.teachingStyle,
      availability: formData.availability.join(', '),
      preferredModes: formData.preferredModes.join(', '),
      otherInfo: formData.otherInfo
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
        // Trigger Confetti
        confetti({
          particleCount: 180,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    "Personal Details",
    "Education & Experience",
    "Preferences",
    "Subjects & Classes",
    "Additional Info",
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
                <span>Become a Tutor</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-primary mb-3">
                Register as Home Tutor
              </h1>
              <p className="text-brand-muted text-sm sm:text-base max-w-md mx-auto">
                Join our premium inclusive coaching team and teach in Ahmedabad or Hyderabad.
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
                    Step {step} of 6: {stepsList[step - 1]}
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
                      Your professional tutor profile has been submitted and registered successfully. We are excited to welcome you!
                    </p>
                  </div>

                  <div className="bg-brand-light border border-brand-border rounded-2xl p-6 max-w-sm mx-auto text-left space-y-3">
                    <div className="flex justify-between border-b border-brand-border/60 pb-2">
                      <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Registration ID</span>
                      <span className="text-sm font-black text-secondary">{regId}</span>
                    </div>
                    <div className="flex justify-between border-b border-brand-border/60 pb-2">
                      <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Applied Position</span>
                      <span className="text-sm font-bold text-brand-dark">Inclusive Home Tutor</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Registration Date</span>
                      <span className="text-sm font-semibold text-brand-dark">{regDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-muted max-w-md mx-auto">
                    *Our mentoring panel will review your subjects and coordinate an online teaching assessment within 24-48 hours.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/"
                      className="px-6 py-3.5 border border-brand-border hover:bg-brand-light rounded-xl font-bold text-sm text-brand-dark transition-all"
                    >
                      Back to Home
                    </Link>
                    <Link
                      href={`/dashboard?role=tutor&regId=${regId}`}
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
                            placeholder="e.g. Rohan Malhotra"
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
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-muted font-bold">+91</span>
                              <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="9876543210"
                                className="p-3 pl-12 w-full border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Email ID *</label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="e.g. rohan@gmail.com"
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
                            <option value="Ahmedabad">Ahmedabad</option>
                            <option value="Hyderabad">Hyderabad</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Address (Area/Locality) *</label>
                          <textarea
                            name="address"
                            required
                            rows={2}
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="e.g. Flat 302, Green Avenue, Sector 62"
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
                            <option value="B.Ed">B.Ed / M.Ed</option>
                            <option value="Graduate (B.Sc / B.A / B.Com)">Graduate (B.Sc / B.A / B.Com)</option>
                            <option value="Post Graduate (M.Sc / M.A)">Post Graduate (M.Sc / M.A)</option>
                            <option value="B.Ed Special Education">B.Ed Special Education</option>
                            <option value="Diploma in Special Education">Diploma in Special Education</option>
                            <option value="Other Degree">Other Degree</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Additional Qualification (Optional)</label>
                          <input
                            type="text"
                            name="addQualification"
                            value={formData.addQualification}
                            onChange={handleInputChange}
                            placeholder="e.g. Master's in English Literature"
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Tutoring Experience *</label>
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
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Certification Courses (Optional)</label>
                          <textarea
                            name="certifications"
                            rows={3}
                            value={formData.certifications}
                            onChange={handleInputChange}
                            placeholder="e.g. ADHD Coaching Certification, Dyslexia Remedial Workshop, ABA Basics"
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Teaching Preferences */}
                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">Teaching Preferences</h3>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Do you teach Special Needs Children? *</label>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                              <input
                                type="radio"
                                name="teachSpecialNeeds"
                                value="Yes"
                                checked={formData.teachSpecialNeeds === "Yes"}
                                onChange={handleInputChange}
                                className="accent-primary w-4 h-4"
                              /> Yes
                            </label>
                            <label className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                              <input
                                type="radio"
                                name="teachSpecialNeeds"
                                value="No"
                                checked={formData.teachSpecialNeeds === "No"}
                                onChange={handleInputChange}
                                className="accent-primary w-4 h-4"
                              /> No
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Type of Students you prefer *</label>
                          <div className="grid grid-cols-1 gap-2">
                            {["Special Needs", "Regular Tuition", "Both"].map((type) => (
                              <label key={type} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.preferredStudents.includes(type)}
                                  onChange={() => handleCheckboxChange('preferredStudents', type)}
                                  className="accent-primary rounded w-4 h-4"
                                /> {type}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Mode of Teaching *</label>
                          <div className="flex gap-6">
                            {["Online", "Offline", "Both"].map((mode) => (
                              <label key={mode} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                <input
                                  type="radio"
                                  name="modeOfTeaching"
                                  value={mode}
                                  checked={formData.modeOfTeaching === mode}
                                  onChange={handleInputChange}
                                  className="accent-primary w-4 h-4"
                                /> {mode}
                              </label>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: Subjects & Classes */}
                    {step === 4 && (
                      <motion.div
                        key="step-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">Subjects & Classes</h3>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Classes you can teach *</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                              "Early Years/Pre-Primary",
                              "Primary 1st-5th",
                              "Middle 6th-8th",
                              "Secondary 9th-10th",
                              "Senior Secondary 11th-12th",
                              "All Classes"
                            ].map((cls) => (
                              <label key={cls} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.classes.includes(cls)}
                                  onChange={() => handleCheckboxChange('classes', cls)}
                                  className="accent-primary rounded w-4 h-4"
                                /> {cls}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Subjects you can teach *</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "All Subjects",
                              "English",
                              "Mathematics",
                              "Science",
                              "Social Science",
                              "Hindi",
                              "Other Languages",
                              "Other"
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

                        {formData.subjects.includes('Other') && (
                          <div className="flex flex-col gap-1.5 pt-2 animate-fade-in-up">
                            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Please specify other subjects *</label>
                            <input
                              type="text"
                              name="otherSubjects"
                              required
                              value={formData.otherSubjects}
                              onChange={handleInputChange}
                              placeholder="e.g. French, Coding, Art & Craft"
                              className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* STEP 5: Additional Information */}
                    {step === 5 && (
                      <motion.div
                        key="step-5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2 mb-4">Additional Information</h3>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Teaching Style / Approach</label>
                          <textarea
                            name="teachingStyle"
                            rows={3}
                            value={formData.teachingStyle}
                            onChange={handleInputChange}
                            placeholder="Describe how you engage students, handle learning blocks, or plan multisensory lessons..."
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Availability *</label>
                          <div className="flex gap-6">
                            {["Weekdays", "Weekends", "Flexible"].map((day) => (
                              <label key={day} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.availability.includes(day)}
                                  onChange={() => handleCheckboxChange('availability', day)}
                                  className="accent-primary rounded w-4 h-4"
                                /> {day}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Preferred Mode of Teaching *</label>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              "In Person/Home Tuition",
                              "At Tutor's Home",
                              "Online"
                            ].map((pmode) => (
                              <label key={pmode} className="flex items-center gap-2 text-sm text-brand-dark font-semibold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.preferredModes.includes(pmode)}
                                  onChange={() => handleCheckboxChange('preferredModes', pmode)}
                                  className="accent-primary rounded w-4 h-4"
                                /> {pmode}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 pt-2">
                          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">Any other information</label>
                          <textarea
                            name="otherInfo"
                            rows={2}
                            value={formData.otherInfo}
                            onChange={handleInputChange}
                            placeholder="Specific child support cases handled, physical therapy experience, references details, etc."
                            className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 6: Review & Submit */}
                    {step === 6 && (
                      <motion.div
                        key="step-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="font-serif font-bold text-primary text-lg border-b border-brand-border pb-2">Review & Submit</h3>
                        
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
                              <div className="col-span-2"><strong>Address:</strong> {formData.address}</div>
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
                            <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">2. Education & Experience</h4>
                            <div className="space-y-1.5 text-xs text-brand-dark">
                              <div><strong>Highest Qualification:</strong> {formData.qualification}</div>
                              {formData.addQualification && <div><strong>Additional Details:</strong> {formData.addQualification}</div>}
                              <div><strong>Experience:</strong> {formData.experience}</div>
                              {formData.certifications && <div><strong>Certifications:</strong> {formData.certifications}</div>}
                            </div>
                          </div>

                          {/* Summary Card 3: Preferences */}
                          <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative">
                            <button 
                              type="button" 
                              onClick={() => handleJumpToStep(3)}
                              className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">3. Teaching Preferences</h4>
                            <div className="space-y-1.5 text-xs text-brand-dark">
                              <div><strong>Teaches Special Needs:</strong> {formData.teachSpecialNeeds}</div>
                              <div><strong>Preferred Students:</strong> {formData.preferredStudents.join(', ')}</div>
                              <div><strong>Mode of Teaching:</strong> {formData.modeOfTeaching}</div>
                            </div>
                          </div>

                          {/* Summary Card 4: Subjects */}
                          <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative">
                            <button 
                              type="button" 
                              onClick={() => handleJumpToStep(4)}
                              className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">4. Subjects & Classes</h4>
                            <div className="space-y-1.5 text-xs text-brand-dark">
                              <div><strong>Classes to Teach:</strong> {formData.classes.join(', ')}</div>
                              <div><strong>Subjects to Teach:</strong> {formData.subjects.join(', ')}</div>
                              {formData.subjects.includes('Other') && <div><strong>Other Subjects:</strong> {formData.otherSubjects}</div>}
                            </div>
                          </div>

                          {/* Summary Card 5: Additional */}
                          <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/30 relative">
                            <button 
                              type="button" 
                              onClick={() => handleJumpToStep(5)}
                              className="absolute top-4 right-4 text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">5. Additional Details</h4>
                            <div className="space-y-1.5 text-xs text-brand-dark">
                              {formData.teachingStyle && <div><strong>Teaching Style:</strong> {formData.teachingStyle}</div>}
                              <div><strong>Availability:</strong> {formData.availability.join(', ')}</div>
                              <div><strong>Preferred Tuition Mode:</strong> {formData.preferredModes.join(', ')}</div>
                              {formData.otherInfo && <div><strong>Other Info:</strong> {formData.otherInfo}</div>}
                            </div>
                          </div>

                        </div>

                        <div className="border-t border-brand-border/60 pt-4 space-y-3">
                          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-dark font-semibold cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={confirmSubmit}
                              onChange={(e) => setConfirmSubmit(e.target.checked)}
                              className="accent-primary rounded w-4 h-4 mt-0.5 flex-shrink-0"
                            />
                            <span>I confirm that all the information provided by me is true and correct *</span>
                          </label>                          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-dark font-semibold cursor-pointer select-none">
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
                      <div></div> // layout spacer
                    )}

                    {step < 6 ? (
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
                        {loading ? 'Registering...' : 'Complete Your Registration'}
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
