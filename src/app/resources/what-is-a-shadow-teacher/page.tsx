'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowRight, BookOpen, Sparkles, 
  HelpCircle, Clock, ChevronRight, UserCheck, ShieldCheck, HeartHandshake
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WhatIsAShadowTeacherPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is a Shadow Teacher, and Does My Child Need One?',
    description: 'A Shadow Teacher is a trained professional who accompanies a child with special needs inside a mainstream classroom, sitting alongside them during school hours to support focus, participation, and emotional regulation.',
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
      '@id': 'https://www.theshadowbridge.com/resources/what-is-a-shadow-teacher'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does a Shadow Teacher do in a mainstream classroom?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A Shadow Teacher sits alongside a child with special needs during school hours to prompt focus, facilitate instruction following, manage sensory overwhelm in real-time, and encourage social interactions with peers.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does a Shadow Teacher replace the classroom teacher?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The classroom teacher leads academic lessons for the entire class. The Shadow Teacher acts as a dedicated bridge to help the child participate in that curriculum.'
        }
      },
      {
        '@type': 'Question',
        name: 'Will my child become dependent on a Shadow Teacher?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The primary goal of professional shadow teaching is gradually building self-advocacy and independence, deliberately fading support as the child gains coping and academic skills.'
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
          <span className="text-secondary font-bold">Shadow Teaching Guide</span>
        </nav>
      </div>

      {/* Article Body */}
      <article className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pb-20 flex-1 space-y-8">
        
        {/* Title Header */}
        <header className="space-y-4 border-b border-brand-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs uppercase tracking-wider border border-purple-200">
            <Sparkles size={13} />
            Classroom Integration &amp; Special Needs
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            What is a Shadow Teacher, and Does My Child Need One?
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1 font-medium"><Clock size={14} /> 5 min read</span>
            <span>•</span>
            <span>Reviewed by Pratibha Mishra &amp; Clinical Team</span>
            <span>•</span>
            <span>Published by The Shadow Bridge</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-primary/15 shadow-xs text-gray-700 leading-relaxed text-base sm:text-lg space-y-4">
          <p className="font-medium text-primary leading-relaxed">
            A <strong>Shadow Teacher</strong> is a trained professional who accompanies a child with special needs inside a mainstream classroom, sitting alongside them during school hours to support focus, participation, and emotional regulation — <em>without replacing the classroom teacher's role</em>.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            Unlike a special educator who typically works one-on-one outside the classroom, a Shadow Teacher's job is to help a child function within a regular classroom setting: prompting them to stay on task, helping them follow instructions, managing sensory overwhelm in real time, and supporting social interaction with peers.
          </p>
        </div>

        {/* Section 1: Core Responsibilities */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <UserCheck className="text-secondary" size={24} />
            What Does a Shadow Teacher Do Every Day?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Mainstream classrooms are fast-paced, noisy, and demand quick multi-step processing. A Shadow Teacher acts as a gentle, continuous anchor for the child by:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Focus &amp; Task Transitions
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Breaking down teacher instructions into digestible steps and redirecting attention when distractions arise.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Sensory Regulation
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Detecting early signs of sensory overload or anxiety and applying discreet calming strategies before meltdowns occur.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Peer Interaction
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Facilitating lunch, group project, and playground social communication without dominating the conversation.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Behavior Management
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Reinforcing positive classroom behaviors and implementing Individualized Education Program (IEP) behavioral goals.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: When to Consider */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <HelpCircle className="text-secondary" size={24} />
            When Should Parents Consider a Shadow Teacher?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            A Shadow Teacher may be worth considering if your child has been recommended one by a school, a pediatrician, or a therapist — commonly for children with <strong>Autism Spectrum Disorder (ASD)</strong>, <strong>ADHD</strong>, <strong>sensory processing differences</strong>, or other learning differences who are capable of mainstream schooling but need consistent in-classroom support to fully participate.
          </p>
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-sm text-purple-900">Common Indicators:</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-purple-950">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                The school asks for an assistant to help the child stay seated or follow class instructions.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                Your child experiences heightened anxiety or behavioral friction during class transitions and noisy periods.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                Academic potential is high, but attention deficits prevent independent classroom task completion.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: The Philosophy of Independence */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <HeartHandshake className="text-secondary" size={24} />
            The Goal is Independence, Not Permanent Dependence
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            A fundamental misconception is that a shadow teacher creates ongoing reliance. In reality, <em>the goal is always gradually increasing independence, not permanent dependence</em> — a good Shadow Teacher works toward reducing their own involvement over time as the child builds coping mechanisms, organizational habits, and social self-efficacy.
          </p>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Support is systematically faded across stages: from hands-on side-by-side prompting, to desk-distance supervision, to eventual autonomous classroom functioning.
          </p>
        </section>

        {/* Internal Links Box */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-brand-border/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Related Guides &amp; Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/shadow-teachers"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Explore Shadow Teacher Services</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/resources/shadow-teacher-vs-special-educator"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Shadow Teacher vs Special Educator</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/resources/shadow-teacher-cost-by-city"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Shadow Teacher Costs &amp; Pricing</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/resources/how-matching-works"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>How Our Matching Process Works</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold">Ready to Discuss Your Child's Classroom Support?</h3>
            <p className="text-gray-300 text-sm">
              Schedule an intake consultation with our lead mentor to assess classroom requirements and begin shadow educator matching.
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
