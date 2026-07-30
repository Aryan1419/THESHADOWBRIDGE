'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Quote, 
  ShieldCheck, 
  Users, 
  GraduationCap
} from 'lucide-react';

const timelineSteps = [
  {
    stepNumber: "01",
    emoji: "🌱",
    title: "Where it began",
    tagline: "Observing the Classroom Gap",
    description: "Working with children in classrooms made me realize that many families struggled to find trained Shadow Teachers they could truly trust.",
    color: "from-emerald-500/20 to-teal-500/10",
    borderColor: "border-emerald-500/30",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconBg: "bg-emerald-500 text-white"
  },
  {
    stepNumber: "02",
    emoji: "❤️",
    title: "The Challenge",
    tagline: "Overcoming Isolation & Uncertainty",
    description: "Parents often felt overwhelmed, while talented educators lacked the right guidance and opportunities.",
    color: "from-rose-500/20 to-pink-500/10",
    borderColor: "border-rose-500/30",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
    iconBg: "bg-rose-500 text-white"
  },
  {
    stepNumber: "03",
    emoji: "🌉",
    title: "The Solution",
    tagline: "Creating The Shadow Bridge",
    description: "That's why I created The Shadow Bridge—to bring families and trained educators together through a transparent, professional, and child-centered process.",
    color: "from-primary/20 to-purple-500/10",
    borderColor: "border-primary/30",
    badgeBg: "bg-purple-100 text-primary border-purple-200",
    iconBg: "bg-primary text-white"
  },
  {
    stepNumber: "04",
    emoji: "✨",
    title: "Our Vision",
    tagline: "Thriving Confidently Together",
    description: "Every child deserves the right support to learn, participate, and thrive confidently.",
    color: "from-amber-500/20 to-yellow-500/10",
    borderColor: "border-amber-500/30",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-200",
    iconBg: "bg-amber-500 text-white"
  }
];

export default function FounderStoryPage() {
  return (
    <main className="min-h-screen bg-brand-light flex flex-col font-sans text-brand-dark overflow-hidden">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 shadow-sm"
          >
            <Sparkles size={14} className="text-secondary animate-pulse" />
            Founder's Journey • Pratibha Mishra
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight"
          >
            Why I Started <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              The Shadow Bridge?
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            A personal mission born out of classroom observations, family struggles, and a deep passion for inclusive education.
          </motion.p>
        </div>

        {/* Founder Bio Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

          {/* Founder Image */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shrink-0 shadow-lg border-2 border-primary/20">
            <Image 
              src="/images/founder_pratibha.jpg"
              alt="Pratibha Mishra - Founder of The Shadow Bridge"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Quote & Bio Details */}
          <div className="space-y-4 text-center md:text-left flex-grow">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-light text-primary rounded-full text-xs font-bold border border-brand-border">
              <Quote size={14} className="text-secondary" />
              <span>Message from Founder</span>
            </div>

            <p className="font-serif text-lg sm:text-xl text-primary font-bold italic leading-snug">
              "No child should ever feel invisible or left behind in a classroom simply because they learn differently."
            </p>

            <div>
              <h3 className="font-serif text-lg font-bold text-primary">Pratibha Mishra</h3>
              <p className="text-xs text-brand-muted font-medium">Founder &amp; Lead Educational Mentor • The Shadow Bridge</p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-brand-dark">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-primary border border-purple-100">
                <ShieldCheck size={14} className="text-emerald-600" /> Verified Process
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-primary border border-purple-100">
                <Users size={14} className="text-secondary" /> 500+ Families Supported
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-primary border border-purple-100">
                <GraduationCap size={14} className="text-accent" /> Special Needs Advocates
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Our Founding Timeline</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">The Journey Behind Our Mission</h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-lg mx-auto">Follow the four milestone steps that inspired the creation of India's trusted shadow teaching network.</p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative">
          {/* Central Vertical Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-emerald-400 via-primary to-amber-400 rounded-full opacity-30" />

          {/* Left Vertical Line (Mobile) */}
          <div className="block md:hidden absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-primary to-amber-400 rounded-full opacity-30" />

          <div className="space-y-12 sm:space-y-16">
            {timelineSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Icon Node Center */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center z-20 text-xl">
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${step.iconBg} shadow-inner`}>
                      <span className="text-lg">{step.emoji}</span>
                    </div>
                  </div>

                  {/* Card Container */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8">
                    <div className={`bg-white rounded-3xl p-6 sm:p-8 border ${step.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 relative group overflow-hidden`}>
                      {/* Ambient Gradient Corner Accent */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${step.color} rounded-bl-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

                      {/* Header Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${step.badgeBg}`}>
                          Step {step.stepNumber}
                        </span>
                        <span className="text-xs font-bold text-brand-muted tracking-wide font-mono uppercase">{step.tagline}</span>
                      </div>

                      {/* Step Title */}
                      <h3 className="font-serif text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                        <span>{step.emoji}</span>
                        <span>{step.title}</span>
                      </h3>

                      {/* Step Description */}
                      <p className="text-brand-dark text-sm sm:text-base leading-relaxed font-medium bg-brand-light/50 p-4 rounded-2xl border border-brand-border/60">
                        "{step.description}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Summary Card */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary via-[#4A154B] to-primary text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 bg-white/10 text-amber-300 rounded-2xl flex items-center justify-center mx-auto border border-white/20 shadow-inner">
            <Heart size={32} />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Every Child Deserves to Thrive Confidently
            </h3>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              We bridge the gap between classroom challenges and personalized learning success through compassion, structured IEPs, and background-verified mentorship.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/parent"
              className="px-6 py-3.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Parent Consultation (₹99)</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/shadow-teachers"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Shadow Teacher Services</span>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
