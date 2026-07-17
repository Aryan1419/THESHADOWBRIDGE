'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, Heart, BookOpen, Users, 
  ArrowRight, ShieldCheck, Star, Calendar, Smile, Award, ClipboardCheck
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForTutors() {
  const benefits = [
    {
      title: "Flexible Teaching Opportunities",
      desc: "Select matching client locations, hours, and days that align perfectly with your teaching availability and schedule."
    },
    {
      title: "Make a Real Impact",
      desc: "Provide custom-tailored academic coaching to help students with learning challenges achieve high-growth classroom outcomes."
    },
    {
      title: "Professional Guidance & Support",
      desc: "Receive customized teaching manuals, lesson plan resources, and behavioral tips from special education supervisors."
    },
    {
      title: "Grow Your Career",
      desc: "Upskill through our certified inclusive pedagogy workshops and add specialized remedial teaching to your resume."
    },
    {
      title: "Safe & Transparent Platform",
      desc: "Enjoy regular and verified payment schedules, standard placement agreements, and pre-vetted local parent locations."
    }
  ];

  const subjects = [
    "Remedial Academic Support: Reading, phonics, basic mathematical reasoning, and writing adaptation.",
    "Mainstream Subjects: Mathematics, Science, English, and Social Studies across CBSE, ICSE, and IB curriculums.",
    "Exam Preparation: Test-taking strategies, speed writing, study organization, and time management coaching.",
    "Executive Function: Assisting kids with organization, notebook preservation, and schedule tracking."
  ];

  const guidelines = [
    "Maintain high levels of patience, child-centric pacing, and active encouragement.",
    "Conduct weekly assessment logs to highlight learning bottlenecks and achievements.",
    "Ensure consistent, scheduled sessions to build routine predictability for students.",
    "Involve parent feedback constructively in alignment with school homework."
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-gradient-to-b from-[#F7F5FC] to-white border-b border-brand-border">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-secondary" />
            <span>Join Our Tutor Community</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-primary leading-tight max-w-4xl mx-auto">
            The Best Opportunity For You!
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto mt-4 font-sans">
            Become a certified Home Tutor. Connect with families looking for targeted, empathetic, and custom academic coaching.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content Area (8 Columns) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Teaching Career Description */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">
                  Premium Home Tutoring Placements
                </h2>
                <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                  Home Tutors at The Shadow Bridge go beyond conventional memorization techniques. We focus on building learning autonomy, structured understanding, and core subject confidence for students, particularly those who find fast-paced classroom settings overwhelming. We provide our tutors with direct placement opportunities and support frameworks to make every session impactful.
                </p>
              </div>

              {/* Subjects & Focus Areas */}
              <div className="bg-brand-light/30 border border-brand-border rounded-3xl p-8 space-y-6">
                <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
                  <BookOpen className="text-secondary" size={22} />
                  <span>Subjects & Support Areas</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {subjects.map((sub, idx) => {
                    const [title, desc] = sub.split(': ');
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-dark text-sm sm:text-base">{title}:</strong>
                          <span className="text-brand-muted text-sm sm:text-base pl-1">{desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tutoring Guidelines */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Our Code of Tutoring Conduct
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guidelines.map((guide, idx) => (
                    <div key={idx} className="bg-white border border-brand-border p-6 rounded-2xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                      <ClipboardCheck className="text-secondary mt-0.5 flex-shrink-0" size={20} />
                      <p className="text-brand-dark text-sm font-semibold leading-relaxed">{guide}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar (4 Columns) */}
            <div className="lg:col-span-4">
              <div className="bg-[#F7F5FC] border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-xl font-black text-primary">
                    Why Register With Us
                  </h3>
                  <p className="text-brand-muted text-xs mt-1">Grow your teaching profile with premium clients.</p>
                </div>

                <div className="space-y-6">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="space-y-1.5 border-b border-brand-border/60 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        <span>{benefit.title}</span>
                      </div>
                      <p className="text-brand-muted text-xs sm:text-sm leading-relaxed pl-3.5">
                        {benefit.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Large CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white to-[#F7F5FC] text-center border-t border-brand-border">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-primary">
            Ready to Accelerate Your Tutoring Career?
          </h2>
          <p className="text-brand-muted text-base max-w-xl mx-auto leading-relaxed">
            Apply as a home tutor today. Standardized schedules, supportive mentorship, and premium placement rates are waiting for you.
          </p>
          <div className="pt-2">
            <Link
              href="/register/tutor"
              className="px-10 py-4 btn-gradient text-white font-bold text-lg rounded-full inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Register as a Tutor
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
