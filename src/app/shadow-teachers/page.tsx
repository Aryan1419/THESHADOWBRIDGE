'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, Heart, GraduationCap, Users, 
  ArrowRight, ShieldCheck, Star, Calendar, Smile, Award
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForShadowTeachers() {
  const benefits = [
    {
      title: "Meaningful Impact",
      desc: "Work closely with one student to build their confidence, enable classroom inclusion, and change their developmental trajectory."
    },
    {
      title: "Professional Guidance",
      desc: "Get supervised regularly by Founder Pratibha Mishra and senior child psychologists to navigate complex classroom situations."
    },
    {
      title: "Continuous Training",
      desc: "Gain free access to our monthly specialized workshops covering behavioral therapy techniques, ADHD support, and sensory care."
    },
    {
      title: "Growth Opportunities",
      desc: "Advance through our tiered network into Lead Shadow, Mentor, or remedial therapy positions with superior earnings."
    },
    {
      title: "Flexible Work Options",
      desc: "Choose between full-day integration contracts, half-day preschool support, or remedial home-schooling assistance."
    }
  ];

  const roles = [
    "Academic Integration: Assist the student with classwork modifications, visual schedule updates, and task breakdowns.",
    "Behavioral Supervision: Implement behavior modification strategies to manage hyperactivity, triggers, and sensory overload.",
    "Social Integration: Coach the student during recess, group activities, and peer discussions to form active friendships.",
    "Communication Link: Log daily behavioral charts and school updates for parents and school special-ed coordinators."
  ];

  const qualifications = [
    "Degrees or Diplomas in Special Education, Child Development, Psychology, or Humanities.",
    "Excellent active listening, deep empathy, and emotional resilience.",
    "Good verbal English/Hindi communication to sync with school faculty.",
    "Prior tutoring or volunteering experience with children is highly preferred."
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
            <span>Join Our Educator Network</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-primary leading-tight max-w-4xl mx-auto">
            Empower. Support. Make a Difference.
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto mt-4 font-sans">
            Become a professional Shadow Teacher. Help kids with special needs adapt, learn, and grow independently inside mainstream schools.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content Area (8 Columns) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Career Path Description */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">
                  The Role of a Shadow Teacher
                </h2>
                <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                  As a Shadow Teacher at The Shadow Bridge, you act as the critical connection between a child with special needs, their peers, and the school ecosystem. You are not there to take tests for the child, but to guide them toward independent navigation of classroom rules, developmental milestones, and social relationships.
                </p>
              </div>

              {/* Roles & Responsibilities */}
              <div className="bg-brand-light/30 border border-brand-border rounded-3xl p-8 space-y-6">
                <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
                  <Award className="text-secondary" size={22} />
                  <span>Key Responsibilities</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {roles.map((role, idx) => {
                    const [title, desc] = role.split(': ');
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

              {/* Who We Look For */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Who Can Apply?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {qualifications.map((qual, idx) => (
                    <div key={idx} className="bg-white border border-brand-border p-6 rounded-2xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                      <GraduationCap className="text-secondary mt-0.5 flex-shrink-0" size={20} />
                      <p className="text-brand-dark text-sm font-semibold leading-relaxed">{qual}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Callout */}
              <div className="border border-brand-border rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-brand-light to-white">
                <div className="p-4 bg-primary text-white rounded-2xl flex-shrink-0">
                  <Calendar size={32} className="text-accent" />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-serif font-bold text-primary text-lg">Continuous Upskilling & Mentoring</h4>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    Even if you don't have extensive experience, our Lead Mentors provide initial onboarding training, curriculum adaptation resources, and ongoing behavior therapy classes to ensure you feel supported in the classroom.
                  </p>
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
                  <p className="text-brand-muted text-xs mt-1">Unlock your potential in special education careers.</p>
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
            Ready to Begin Your Placement Journey?
          </h2>
          <p className="text-brand-muted text-base max-w-xl mx-auto leading-relaxed">
            Submit your application details today. Our academic matching team will check your qualifications and invite you to our next screening cohort.
          </p>
          <div className="pt-2">
            <Link
              href="/register/shadow"
              className="px-10 py-4 btn-gradient text-white font-bold text-lg rounded-full inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Register as Shadow Teacher
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
