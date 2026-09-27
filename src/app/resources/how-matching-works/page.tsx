'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowRight, Sparkles, 
  HelpCircle, Clock, ChevronRight, PhoneCall, Lock, FileText, UserCheck, ShieldCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HowMatchingWorksPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How Does The Shadow Bridge\'s Matching Process Actually Work?',
    description: 'Unlike a simple listing or directory, every placement on The Shadow Bridge starts with a real, structured consultation.',
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
      '@id': 'https://www.theshadowbridge.com/resources/how-matching-works'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Why is an initial consultation required before unlocking the registration form?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Matching a special needs child with a shadow educator requires clinical and behavioral understanding. The consultation ensures we understand the child\'s sensory profile, school requirements, and IEP before searching for educators.'
        }
      },
      {
        '@type': 'Question',
        name: 'When is the placement fee paid?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The one-time placement fee (₹5,000) is paid only after our team successfully identifies and confirms a qualified, verified educator match.'
        }
      }
    ]
  };

  const steps = [
    {
      number: '01',
      title: 'Paid Intake Consultation (₹99)',
      description: 'Book your initial consultation online. Our team connects with you for a 1-on-1 assessment call to understand your child\'s unique developmental profile, school dynamics, IEP goals, and preferred locality.',
      icon: PhoneCall,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      number: '02',
      title: 'Consultation Review & Form Unlock',
      description: 'Once the consultation is completed and reviewed from our clinical side, the detailed Child Registration & Preference Form automatically unlocks for your account.',
      icon: Lock,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      number: '03',
      title: 'Curated Educator Matching',
      description: 'We match your child with background-reviewed shadow teachers or special tutors from our verified network who possess the exact experience, timetable availability, and locality fit.',
      icon: UserCheck,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      number: '04',
      title: 'Placement Confirmation & Fee (₹5,000)',
      description: 'After the match is confirmed by both parties, the one-time placement fee is completed, and the educator begins their orientation and in-school or home sessions.',
      icon: ShieldCheck,
      color: 'bg-pink-100 text-pink-800 border-pink-200'
    }
  ];

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
          <span className="text-secondary font-bold">Matching Process</span>
        </nav>
      </div>

      {/* Article Body */}
      <article className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pb-20 flex-1 space-y-8">
        
        {/* Title Header */}
        <header className="space-y-4 border-b border-brand-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-800 font-bold text-xs uppercase tracking-wider border border-pink-200">
            <Sparkles size={13} />
            Consultation-First Methodology
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            How Does The Shadow Bridge's Matching Process Actually Work?
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1 font-medium"><Clock size={14} /> 4 min read</span>
            <span>•</span>
            <span>System Walkthrough</span>
            <span>•</span>
            <span>Published by The Shadow Bridge</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-primary/15 shadow-xs text-gray-700 leading-relaxed space-y-4">
          <p className="font-medium text-primary text-base sm:text-lg">
            Unlike a simple listing or directory, every placement on The Shadow Bridge starts with a real, structured consultation — not just an automated form.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            After a parent books a paid consultation, our team has a personal conversation to understand the child's specific needs before anything else moves forward. Only after that consultation is marked complete does the detailed registration form unlock, followed by a placement fee once a suitable match is found. This structure exists specifically so that no match happens without a genuine understanding of what the child actually needs first.
          </p>
        </div>

        {/* 4 Step Workflow */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-primary">
            The 4-Stage Placement Lifecycle
          </h2>

          <div className="grid grid-cols-1 gap-4 pt-2">
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div key={step.number} className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center flex-shrink-0">
                    <span className="font-serif text-2xl font-bold text-primary opacity-80">{step.number}</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                      <IconComp size={20} />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-primary">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why this matters */}
        <section className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
          <h3 className="font-bold text-base text-purple-950">Why We Don't Use Open Self-Serve Directories:</h3>
          <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
            Children with neurodivergent profiles (such as ASD, ADHD, or sensory processing differences) require educators whose temperament, training, and specialized background match the specific child. An open directory often leads to poor placements, teacher turnover, and school disruption. Our consultation gate ensures high placement longevity and mutual trust.
          </p>
        </section>

        {/* Internal Links Box */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-brand-border/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/resources/professional-vetting-process"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Our Educator Vetting Process</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/resources/shadow-teacher-cost-by-city"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Cost &amp; Pricing Breakdown</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/check-status"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Check Application Status Lookup</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/book"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Book Your Consultation (₹99)</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold">Ready to Start Step 1?</h3>
            <p className="text-gray-300 text-sm">
              Book your intake consultation now to speak directly with our team and unlock your child's placement matching.
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
