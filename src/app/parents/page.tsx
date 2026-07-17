'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, PhoneCall, HelpCircle, ArrowRight, Star, Heart, 
  GraduationCap, ShieldCheck, ClipboardList, UserCheck, MessageSquare, Briefcase, Zap, Info, BookOpen
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForParents() {
  const shadowFeatures = [
    "One-on-one classroom integration support",
    "Behavior management and emotional regulation assistance",
    "Bridging communication between teacher, child, and parents",
    "Encouraging social interactions and classroom participation",
    "Continuous progress mapping and reporting"
  ];

  const tutorFeatures = [
    "Individualized academic focus at home",
    "Specialized support for learning delays or dyslexia",
    "Homework assistance and school preparation plans",
    "Remedial learning and core subjects guidance",
    "Flexible hours customized around child's routine"
  ];

  const parentSteps = [
    { num: "1", title: "Book Consultation Call", desc: "Schedule your 1-on-1 assessment session with Pratibha Mishra for just ₹99." },
    { num: "2", title: "Detailed Intake Evaluation", desc: "Share school policies, clinical logs, and academic guidelines securely." },
    { num: "3", title: "Shortlisting Candidates", desc: "We screen and select the top 2-3 matching profiles from our verified pool." },
    { num: "4", title: "Introductory Meeting", desc: "Conduct a trial call or session to check the chemistry with your child." },
    { num: "5", title: "Educator Onboarding", desc: "We align school routines, goals, and training modules for the educator." },
    { num: "6", title: "Support Kickoff & Tracking", desc: "Support begins with weekly developmental report updates and supervision." },
  ];

  const whyChooseUs = [
    "Qualified special needs educators & psychologists",
    "Rigorous background checks & reference verification",
    "Continuous expert supervision & mentor check-ins",
    "Hassle-free tutor replacements when needed",
    "Standardized weekly tracking of behavior & grades"
  ];

  const afterConsultationWorkflow = [
    { icon: <PhoneCall className="text-secondary" size={24} />, title: "Consultation Call", desc: "Initial ₹99 evaluation" },
    { icon: <ClipboardList className="text-primary" size={24} />, title: "Requirement Analysis", desc: "Mapping child needs" },
    { icon: <UserCheck className="text-secondary" size={24} />, title: "Best Match", desc: "Shortlisting candidates" },
    { icon: <MessageSquare className="text-primary" size={24} />, title: "Introduction Call", desc: "Meet the educator" },
    { icon: <Sparkles className="text-accent animate-pulse" size={24} />, title: "Support Starts", desc: "Weekly tracking & care" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-gradient-to-b from-[#F7F5FC] to-white border-b border-brand-border">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-secondary" />
            <span>Inclusive Student Pathway</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-primary leading-tight max-w-4xl mx-auto">
            Why Do You Wait When You Can Get The Best?
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto mt-4 font-sans">
            Give your child the professional classroom inclusion and dedicated academic coaching they deserve. We connect you with verified, empathy-trained educators.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content Area (8 Columns) */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Option Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Card 1: Shadow Teacher */}
                <div className="bg-white border-2 border-brand-border hover:border-primary/40 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="p-4 bg-[#F7F5FC] rounded-2xl w-fit mb-6 text-primary group-hover:scale-105 transition-transform">
                      <GraduationCap size={32} className="text-secondary" />
                    </div>
                    <h3 className="font-serif font-black text-primary text-2xl mb-3">
                      Need a Shadow Teacher?
                    </h3>
                    <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-6">
                      For children requiring behavioral assistance, focus support, or integration helper inside a mainstream classroom environment.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      {shadowFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-secondary mt-1 flex-shrink-0" />
                          <span className="text-brand-dark text-sm font-semibold">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-brand-border/60">
                    <Link
                      href="/register/parent"
                      className="w-full text-center block py-3.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl transition-all shadow-sm"
                    >
                      Register With Us
                    </Link>
                    <Link
                      href="/book"
                      className="w-full text-center block py-3.5 border-2 border-primary text-primary hover:bg-brand-light font-bold rounded-xl transition-all"
                    >
                      Book a Consultation – ₹99
                    </Link>
                  </div>
                </div>

                {/* Card 2: Home Tutor */}
                <div className="bg-white border-2 border-brand-border hover:border-secondary/40 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="p-4 bg-[#F7F5FC] rounded-2xl w-fit mb-6 text-primary group-hover:scale-105 transition-transform">
                      <BookOpen size={32} className="text-primary" />
                    </div>
                    <h3 className="font-serif font-black text-primary text-2xl mb-3">
                      Searching for a Home Tutor?
                    </h3>
                    <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-6">
                      For academic supervision, customized learning, remedial teaching, and one-on-one subject coaching in the comfort of home.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      {tutorFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-secondary mt-1 flex-shrink-0" />
                          <span className="text-brand-dark text-sm font-semibold">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-brand-border/60">
                    <Link
                      href="/register/parent"
                      className="w-full text-center block py-3.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl transition-all shadow-sm"
                    >
                      Register With Us
                    </Link>
                    <Link
                      href="/book"
                      className="w-full text-center block py-3.5 border-2 border-primary text-primary hover:bg-brand-light font-bold rounded-xl transition-all"
                    >
                      Book a Consultation – ₹99
                    </Link>
                  </div>
                </div>

              </div>

              {/* Placement Fees Section */}
              <div className="bg-gradient-to-br from-primary to-[#502C6E] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
                  <div className="space-y-4 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-accent">
                      <Zap size={12} className="text-accent" />
                      <span>Transparent Pricing</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold">Standard Placement Fees</h3>
                    <p className="text-gray-300 text-sm sm:text-base max-w-lg leading-relaxed">
                      Our one-time placement fee covers background check validation, candidate screening, trial arrangements, onboarding logistics, and replacement guarantees. No hidden commissions.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full sm:w-auto min-w-[200px]">
                    <div className="bg-white/10 border border-white/15 p-4 rounded-2xl text-center">
                      <p className="text-xs uppercase tracking-wider text-gray-300 font-bold">Shadow Teacher Fee</p>
                      <p className="text-3xl font-black text-accent mt-1">₹5,000</p>
                      <p className="text-[10px] text-gray-400 mt-1">One-time placement</p>
                    </div>
                    <div className="bg-white/10 border border-white/15 p-4 rounded-2xl text-center">
                      <p className="text-xs uppercase tracking-wider text-gray-300 font-bold">Home Tutor Fee</p>
                      <p className="text-3xl font-black text-accent mt-1">₹3,000</p>
                      <p className="text-[10px] text-gray-400 mt-1">One-time placement</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-start gap-2 text-xs text-gray-300 border-t border-white/10 pt-4">
                  <Info size={14} className="text-accent flex-shrink-0 mt-0.5" />
                  <p>All monthly salaries are paid directly to the teacher/tutor as per hours. The placement fee is only charged once matched and confirmed.</p>
                </div>
              </div>

              {/* What Happens After Consultation */}
              <div className="space-y-8">
                <div className="text-center md:text-left">
                  <h3 className="font-serif text-2xl font-extrabold text-primary">
                    What Happens After Consultation?
                  </h3>
                  <p className="text-brand-muted text-sm sm:text-base mt-2">
                    A streamlined, child-focused onboarding sequence built around transparency.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4 relative">
                  {afterConsultationWorkflow.map((flow, idx) => (
                    <div key={idx} className="bg-brand-light/40 border border-brand-border p-5 rounded-2xl text-center flex flex-col items-center justify-between min-h-[170px] relative">
                      <div className="p-3 bg-white border border-brand-border rounded-xl shadow-sm mb-3">
                        {flow.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-primary text-sm leading-tight">{flow.title}</h4>
                        <p className="text-[11px] text-brand-muted leading-relaxed">{flow.desc}</p>
                      </div>
                      
                      {/* Connection arrows for larger screens */}
                      {idx < 4 && (
                        <div className="hidden sm:block absolute top-[30px] right-[-10px] z-20 translate-x-1/2">
                          <ArrowRight size={16} className="text-brand-border" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar (4 Columns) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* How It Works List */}
              <div className="bg-[#F7F5FC] border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-black text-primary">
                    Parents – How It Works
                  </h3>
                  <p className="text-brand-muted text-xs mt-1">Our step-by-step roadmap to finding your child's ideal fit.</p>
                </div>

                <div className="space-y-5">
                  {parentSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="text-brand-dark text-sm font-bold">{step.title}</h4>
                        <p className="text-brand-muted text-xs leading-relaxed mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us checklist */}
              <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="font-serif text-xl font-black text-primary">
                  Why Choose Us
                </h3>
                <div className="space-y-4">
                  {whyChooseUs.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-brand-dark text-xs sm:text-sm font-semibold">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
