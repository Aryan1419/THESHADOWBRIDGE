'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowRight, Sparkles, 
  HelpCircle, Clock, ChevronRight, Globe, Users, Heart
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OnlineParentTrainingExplainedPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is Online Parent Training, and Who Is It For?',
    description: 'Online Parent Training equips parents and caregivers directly with practical strategies so families can support their child\'s development consistently at home.',
    author: {
      '@type': 'Organization',
      name: 'The Shadow Bridge',
      url: 'https://www.theshadowbridge.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Shadow Bridge',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.theshadowbridge.com/favicon-512.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.theshadowbridge.com/resources/online-parent-training-explained'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does Online Parent Training work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Conducted via live 1-on-1 video sessions with certified behavioral mentors, parent training guides caregivers on behavior management, daily communication routines, and meltdown mitigation at home.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is Online Parent Training available outside Delhi NCR?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Online Parent Training is delivered entirely virtually and is available PAN-India regardless of your city or state.'
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-brand-light flex flex-col font-sans text-brand-dark">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Header */}
      <div className="pt-28 pb-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/resources" className="hover:text-primary transition-colors">Resources</Link>
          <ChevronRight size={14} />
          <span className="text-secondary font-bold">Parent Training Guide</span>
        </nav>
      </div>

      {/* Article Body */}
      <article className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pb-20 flex-1 space-y-8">
        
        {/* Title Header */}
        <header className="space-y-4 border-b border-brand-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs uppercase tracking-wider border border-indigo-200">
            <Sparkles size={13} />
            Caregiver Empowerment &amp; Home Strategies
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            What is Online Parent Training, and Who Is It For?
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1 font-medium"><Clock size={14} /> 5 min read</span>
            <span>•</span>
            <span>Parent Empowerment</span>
            <span>•</span>
            <span>Published by The Shadow Bridge</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-primary/15 shadow-xs text-gray-700 leading-relaxed space-y-4">
          <p className="font-medium text-primary text-base sm:text-lg">
            <strong>Online Parent Training</strong> equips parents and caregivers directly with practical strategies — rather than placing a professional with the child — so families can support their child's development consistently at home, every day, not just during scheduled sessions.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            This typically covers things like managing meltdowns, encouraging communication, building routines, and reinforcing therapy goals between formal sessions.
          </p>
        </div>

        {/* What Parent Training Covers */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <Users className="text-secondary" size={24} />
            What Does Parent Training Cover?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Meltdown De-escalation
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Understanding sensory triggers, recognizing warning signs, and applying calm-down protocols at home.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Home Visual Schedules
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Structuring predictable morning, study, screen time, and bedtime routines to reduce resistance.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Positive Reinforcement
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Implementing token boards, motivational reward charts, and praise systems that actually work.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Everyday Communication
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Embedding functional language prompts into mealtime, play, and dressing interactions.
              </p>
            </div>
          </div>
        </section>

        {/* PAN-India Accessibility */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <Globe className="text-secondary" size={24} />
            Available PAN-India Regardless of Location
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            It's especially useful for families who don't have easy access to in-person specialists locally, since it's delivered entirely online and available PAN-India, regardless of city.
          </p>
          <div className="p-5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
            <h3 className="font-bold text-sm text-indigo-950">Flexible Virtual Sessions:</h3>
            <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
              Sessions are conducted over secure 1-on-1 video calls at flexible evening or weekend slots, allowing both parents and primary home caregivers to participate together.
            </p>
          </div>
        </section>

        {/* Internal Links Box */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-brand-border/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Related Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/therapies/online-parent-training"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Online Parent Training Program</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/therapies/aba-online-therapy"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>ABA Online Therapy (PAN-India)</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/resources/aba-therapy-for-autism"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>ABA Therapy for Autism Guide</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/therapies"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Explore All 10 Therapies</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold">Start Your Home Coaching Journey</h3>
            <p className="text-gray-300 text-sm">
              Schedule a consultation to discuss your child's home routines and begin customized parent coaching with our behavioral specialist.
            </p>
          </div>
          <Link
            href="/book"
            className="mt-5 sm:mt-0 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-accent text-brand-dark font-bold text-sm shadow-sm hover:bg-amber-300 transition-colors whitespace-nowrap"
          >
            Book Consultation (₹99)
          </Link>
        </div>

      </article>

      <Footer />
    </main>
  );
}
