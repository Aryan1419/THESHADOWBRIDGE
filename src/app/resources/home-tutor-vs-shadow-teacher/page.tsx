'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowRight, Sparkles, 
  HelpCircle, Clock, ChevronRight, BookOpen, Home, School
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomeTutorVsShadowTeacherPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Home Tutor vs. Shadow Teacher — Which Does My Child Need?',
    description: 'A comparison between home-based academic tutoring and in-classroom shadow support for special needs and neurodivergent children.',
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
      '@id': 'https://www.theshadowbridge.com/resources/home-tutor-vs-shadow-teacher'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'When should I choose a Home Tutor over a Shadow Teacher?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If your child can manage the social and behavioral routines of school but struggles to grasp curriculum concepts at the classroom pace, a specialized Home Tutor is the ideal solution.'
        }
      },
      {
        '@type': 'Question',
        name: 'When is a Shadow Teacher necessary?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A Shadow Teacher is necessary when the primary hurdle is functioning within the classroom setting itself — maintaining focus, following multi-step teacher prompts, and managing sensory triggers during school hours.'
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
          <span className="text-secondary font-bold">Decision Guide</span>
        </nav>
      </div>

      {/* Article Body */}
      <article className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pb-20 flex-1 space-y-8">
        
        {/* Title Header */}
        <header className="space-y-4 border-b border-brand-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider border border-amber-200">
            <Sparkles size={13} />
            Support Decision Framework
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            Home Tutor vs. Shadow Teacher — Which Does My Child Need?
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1 font-medium"><Clock size={14} /> 5 min read</span>
            <span>•</span>
            <span>Parent Decision Guide</span>
            <span>•</span>
            <span>Published by The Shadow Bridge</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-primary/15 shadow-xs text-gray-700 leading-relaxed space-y-4">
          <p className="font-medium text-primary text-base sm:text-lg">
            A <strong>Home Tutor</strong> at The Shadow Bridge focuses on individualized academic support — reinforcing what's taught in school, building subject confidence, and adapting teaching pace to how your child learns best, usually delivered one-on-one at home.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            A <strong>Shadow Teacher's</strong> role is different: they accompany your child inside the classroom during school hours, not to teach new academic content, but to help your child participate, focus, and follow along with what's already being taught.
          </p>
        </div>

        {/* The Two Roles Compared */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Home size={20} />
            </div>
            <h2 className="font-serif text-xl font-bold text-primary">Special Needs Home Tutor</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Ideal when the child needs personalized explanation, homework support, multisensory concept building, and paced exam preparation at home.
            </p>
            <ul className="text-xs text-gray-700 space-y-2 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>One-on-one distraction-free home environment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Subject reinforcement (Math, Science, Languages)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Customized pacing for learning disabilities (Dyslexia, Dyscalculia)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <School size={20} />
            </div>
            <h2 className="font-serif text-xl font-bold text-primary">Classroom Shadow Teacher</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Ideal when the child needs in-situ emotional regulation, prompt fading, peer interaction facilitation, and instruction tracking in school.
            </p>
            <ul className="text-xs text-gray-700 space-y-2 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Assists inside mainstream school classrooms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Real-time sensory and behavioral regulation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Prompts social interaction and independence building</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Decision Rule Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-4">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <HelpCircle className="text-secondary" size={24} />
            How to Make the Right Choice
          </h2>
          <div className="p-5 rounded-xl bg-gray-50 border border-brand-border space-y-3">
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              <strong>The Rule of Thumb:</strong> If your child's main challenge is keeping up with classroom content and needs extra academic reinforcement, a <strong>Home Tutor</strong> is usually the right fit. If the challenge is functioning within the classroom environment itself — staying regulated, following multi-step instructions, engaging with peers — a <strong>Shadow Teacher</strong> is typically more appropriate.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Some families use both, based on guidance from their child's school or therapist.
            </p>
          </div>
        </section>

        {/* Internal Links Box */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-brand-border/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Related Pages &amp; Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/tutors"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Explore Home Tutor Services</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/shadow-teachers"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Explore Shadow Teacher Services</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/resources/what-is-a-shadow-teacher"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>What is a Shadow Teacher?</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/register/parent"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Register Your Child's Request</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold">Need Help Deciding for Your Child?</h3>
            <p className="text-gray-300 text-sm">
              Book an intake discussion with our mentor to analyze your child's developmental profile and choose the right educator match.
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
