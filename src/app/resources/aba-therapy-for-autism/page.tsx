'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowRight, Sparkles, 
  HelpCircle, Clock, ChevronRight, Brain, Heart, Target
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AbaTherapyForAutismPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is ABA Therapy, and How Does It Help Children with Autism?',
    description: 'Applied Behavior Analysis (ABA) is a structured, evidence-based therapy approach that helps children build communication, social, and daily-living skills.',
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
      '@id': 'https://www.theshadowbridge.com/resources/aba-therapy-for-autism'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the primary methodology of ABA Therapy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ABA breaks down complex behaviors and skills into smaller, discrete steps, using positive reinforcement and systematic data collection to teach communication, self-help, and social interaction.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is ABA Therapy one-size-fits-all?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Effective ABA therapy must be individualized to the specific child\'s motivators, strengths, and environmental needs, rather than applied as a rigid script.'
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
          <span className="text-secondary font-bold">Autism &amp; ABA Guide</span>
        </nav>
      </div>

      {/* Article Body */}
      <article className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pb-20 flex-1 space-y-8">
        
        {/* Title Header */}
        <header className="space-y-4 border-b border-brand-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs uppercase tracking-wider border border-rose-200">
            <Sparkles size={13} />
            Evidence-Based Autism Intervention
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            What is ABA Therapy, and How Does It Help Children with Autism?
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1 font-medium"><Clock size={14} /> 6 min read</span>
            <span>•</span>
            <span>Clinical Insights</span>
            <span>•</span>
            <span>Published by The Shadow Bridge</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-primary/15 shadow-xs text-gray-700 leading-relaxed space-y-4">
          <p className="font-medium text-primary text-base sm:text-lg">
            <strong>Applied Behavior Analysis (ABA)</strong> is a structured, evidence-based therapy approach that helps children — most commonly those with Autism Spectrum Disorder (ASD) — build communication, social, and daily-living skills by breaking them down into small, manageable steps and reinforcing progress positively.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            A trained ABA therapist works with a child (often one-on-one) to reduce challenging behaviors, increase functional communication, and build independence in everyday tasks, using techniques tailored to the individual child rather than a one-size-fits-all script.
          </p>
        </div>

        {/* Core Pillars of ABA */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <Brain className="text-secondary" size={24} />
            Key Skill Areas Developed Through ABA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Functional Communication
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Teaching verbal requests, gestures, or visual PECS communication to replace frustration and behavioral outbursts.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Social &amp; Play Skills
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Turn-taking, joint attention, reciprocal play, and sharing activities with peers and family members.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Daily Living &amp; Self-Help
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dressing, mealtime habits, toileting routines, and organizational steps for school readiness.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Behavior Reduction
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Identifying the antecedents/triggers behind meltdowns or avoidance and introducing positive replacement behaviors.
              </p>
            </div>
          </div>
        </section>

        {/* Personalized Adaptability */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <Target className="text-secondary" size={24} />
            Evidence-Based &amp; Child-Centered Adaptation
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            ABA is one of the most researched intervention approaches for autism, though it's not the only therapy approach, and a good therapist adapts methods to the specific child rather than applying it rigidly.
          </p>
          <div className="p-5 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-2">
            <h3 className="font-bold text-sm text-rose-950">Why Initial Assessment Matters:</h3>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
              If you're considering ABA for your child, a proper initial consultation should assess your child's specific developmental baseline, sensory profile, and home dynamics before any structured therapy plan is proposed.
            </p>
          </div>
        </section>

        {/* Internal Links Box */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-brand-border/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Related Therapies &amp; Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/therapies/aba-therapy"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Home ABA Therapy Services</span>
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
              href="/resources/online-parent-training-explained"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Online Parent Training Explained</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/therapies"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>All 10 Specialized Therapies</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold">Schedule an ABA Therapy Consultation</h3>
            <p className="text-gray-300 text-sm">
              Connect with our clinical therapy coordinator to evaluate your child's behavioral needs and explore home or online ABA therapy.
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
