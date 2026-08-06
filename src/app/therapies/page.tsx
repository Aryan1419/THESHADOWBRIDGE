'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, Check, ArrowRight, MapPin, PhoneCall, ShieldCheck, HeartHandshake,
  Activity, MessageSquare, Brain, GraduationCap, Smile, Dumbbell, Puzzle, HeartPulse
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const THERAPY_TYPES = [
  {
    slug: 'aba-therapy',
    name: 'ABA Therapy',
    icon: Brain,
    shortDesc: 'Applied Behavior Analysis focusing on communication, social skills, play, and positive behavior management.',
    color: 'from-purple-500/10 to-indigo-500/10 border-purple-200 text-purple-900',
    badge: 'Popular'
  },
  {
    slug: 'speech-therapy',
    name: 'Speech Therapy',
    icon: MessageSquare,
    shortDesc: 'Enhancing articulation, language expression, comprehension, stuttering support, and functional communication.',
    color: 'from-blue-500/10 to-cyan-500/10 border-blue-200 text-blue-900',
    badge: 'In Demand'
  },
  {
    slug: 'occupational-therapy',
    name: 'Occupational Therapy',
    icon: Activity,
    shortDesc: 'Improving fine & gross motor skills, sensory processing, handwriting, body coordination, and daily independence.',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-900',
    badge: 'Core Therapy'
  },
  {
    slug: 'special-education',
    name: 'Special Education',
    icon: GraduationCap,
    shortDesc: 'Customized individualized learning plans (IEP), academic adaptation, reading, writing, and math support.',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-900',
    badge: 'Academic'
  },
  {
    slug: 'behavior-therapy',
    name: 'Behavior Therapy',
    icon: Puzzle,
    shortDesc: 'Addressing tantrums, aggression, emotional regulation, anxiety, and reinforcing positive behavioral habits.',
    color: 'from-rose-500/10 to-pink-500/10 border-rose-200 text-rose-900',
    badge: 'Behavioral'
  },
  {
    slug: 'physical-therapy',
    name: 'Physical Therapy',
    icon: Dumbbell,
    shortDesc: 'Developing muscle strength, posture, balance, gait training, and physical mobility for growing children.',
    color: 'from-sky-500/10 to-blue-500/10 border-sky-200 text-sky-900',
    badge: 'Physical'
  },
  {
    slug: 'play-therapy',
    name: 'Play Therapy',
    icon: Smile,
    shortDesc: 'Therapeutic play interventions promoting emotional expression, social bonding, self-esteem, and cognitive growth.',
    color: 'from-yellow-500/10 to-amber-500/10 border-yellow-200 text-yellow-900',
    badge: 'Child-Centered'
  },
  {
    slug: 'counseling-psychological-support',
    name: 'Counseling & Psychological Support',
    icon: HeartPulse,
    shortDesc: 'Clinical psychological guidance, emotional support, stress management, and parent counseling.',
    color: 'from-violet-500/10 to-purple-500/10 border-violet-200 text-violet-900',
    badge: 'Clinical'
  }
];

export default function TherapiesLandingPage() {
  return (
    <div className="min-h-screen bg-brand-light/30 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-12 bg-gradient-to-b from-white via-purple-50/40 to-white border-b border-brand-border/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-950 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles size={13} className="text-secondary" />
                <span>Therapies – Home Sessions</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-[9px] font-black">DELHI NCR ONLY</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-primary leading-tight tracking-tight">
                Home Therapy Sessions For Delhi NCR Parents
              </h1>

              <p className="text-base sm:text-lg text-purple-950 font-extrabold leading-snug">
                All Therapies. Expert Care. At Your Doorstep.
              </p>

              <p className="text-xs sm:text-sm text-brand-dark/80 font-medium leading-relaxed max-w-2xl">
                We bring certified pediatric therapists directly to your home for personalized 1-on-1 sessions. Convenient, comfortable, and tailored to your child&apos;s unique developmental goals.
              </p>

              {/* 4 Feature Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Expert & Certified Therapists',
                  'Personalized Therapy Plans',
                  'One-on-One Home Sessions',
                  'Convenient & Safe Environment'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-primary">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/book?service=therapy"
                  className="btn-gradient inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <PhoneCall size={18} />
                  <span>Book a Consultation (₹99)</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#services-grid"
                  className="px-6 py-3.5 rounded-2xl font-bold text-xs border border-brand-border bg-white text-primary hover:bg-brand-light flex items-center justify-center gap-2"
                >
                  Explore All 8 Therapies
                </a>
              </div>
            </div>

            {/* Right Card / Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white p-6 space-y-4 text-left">
                <div className="flex items-center gap-3 border-b border-brand-border/60 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl shrink-0">
                    🧩
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider">Home Therapy Care</span>
                    <h3 className="font-serif text-lg font-bold text-primary">Delhi NCR Specialized Care</h3>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-brand-dark/80 leading-relaxed font-medium">
                  <p>• <strong>1-on-1 In-Home Convenience:</strong> No commuting stress for your child. Therapy happens in their most natural, comfortable space.</p>
                  <p>• <strong>Customized Assessments:</strong> Detailed evaluation and monthly progress reports delivered directly to parents.</p>
                  <p>• <strong>Multi-Disciplinary Team:</strong> ABA, Speech, OT, Special Education, Behavior & Psychological experts under one platform.</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl text-center text-xs font-bold text-purple-900 border border-purple-200">
                  📍 Exclusively Available in Delhi, Noida, Greater Noida, Ghaziabad, Gurugram & Faridabad.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Regional Location Banner */}
      <section className="bg-gradient-to-r from-primary via-[#2A1D4E] to-primary text-white py-4 border-y border-accent/40 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-bold">
          <MapPin size={16} className="text-accent shrink-0 animate-bounce" />
          <span>Only for Delhi NCR — Our therapists are available across Delhi, Noida, Greater Noida, Ghaziabad, Gurugram, Faridabad &amp; surrounding areas</span>
        </div>
      </section>

      {/* Our Therapy Services Grid (8 Types) */}
      <section id="services-grid" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
              Specialized Care Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-primary">
              Our 8 Home Therapy Services
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Select any therapy service below to view detailed coverage, targets, and FAQs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {THERAPY_TYPES.map((t) => {
              const IconComp = t.icon;
              return (
                <div 
                  key={t.slug}
                  className="bg-white border border-brand-border rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-primary/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-brand-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                        <IconComp size={22} />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-primary text-[10px] font-extrabold uppercase border border-brand-border">
                        {t.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                        {t.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-border/40 mt-6 flex items-center justify-between">
                    <Link
                      href={`/therapies/${t.slug}`}
                      className="text-xs font-bold text-primary group-hover:text-secondary flex items-center gap-1 transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      href={`/book?service=therapy&type=${t.slug}`}
                      className="px-3 py-1.5 bg-primary text-white rounded-xl font-bold text-[11px] hover:bg-primary/90 transition-all"
                    >
                      Book ₹99
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Home Therapy */}
      <section className="py-14 bg-white border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-brand-light/30 border border-brand-border p-6 rounded-3xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 font-bold">
                🏡
              </div>
              <h3 className="font-serif text-base font-bold text-primary">In-Home Comfort</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Children learn best where they feel safest. Home sessions eliminate travel fatigue and allow therapy in natural daily routines.
              </p>
            </div>

            <div className="bg-brand-light/30 border border-brand-border p-6 rounded-3xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 font-bold">
                🎯
              </div>
              <h3 className="font-serif text-base font-bold text-primary">1-on-1 Dedicated Focus</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                100% undivided attention from certified therapists without classroom distractions or waiting room delays.
              </p>
            </div>

            <div className="bg-brand-light/30 border border-brand-border p-6 rounded-3xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 font-bold">
                📈
              </div>
              <h3 className="font-serif text-base font-bold text-primary">Transparent Parent Involvement</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Parents observe sessions directly, learn strategy reinforcement, and receive monthly documented progress metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
