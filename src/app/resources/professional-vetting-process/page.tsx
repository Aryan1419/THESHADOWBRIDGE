'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowRight, Sparkles, 
  HelpCircle, Clock, ChevronRight, ShieldCheck, GraduationCap, Briefcase, FileCheck2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfessionalVettingProcessPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What Qualifications Do The Shadow Bridge\'s Professionals Have?',
    description: 'An honest, transparent explanation of the actual qualification review, experience checks, and manual admin verification performed on The Shadow Bridge.',
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
      '@id': 'https://www.theshadowbridge.com/resources/professional-vetting-process'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What qualifications do Shadow Teachers and Tutors submit during registration?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Educators submit their formal educational degrees (such as B.Ed, D.Ed, Masters in Psychology, Special Education diplomas, or RBT credentials), along with documented years of experience with special needs children and certifications.'
        }
      },
      {
        '@type': 'Question',
        name: 'How are educator profiles reviewed by the team?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our administrative and clinical team manually reviews every educator registration, evaluating submitted resumes, qualification documents, specialisation profiles (ASD, ADHD, Speech, etc.), and travel/locality availability before approving the candidate for parent matching.'
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
          <span className="text-secondary font-bold">Vetting &amp; Qualifications</span>
        </nav>
      </div>

      {/* Article Body */}
      <article className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pb-20 flex-1 space-y-8">
        
        {/* Title Header */}
        <header className="space-y-4 border-b border-brand-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs uppercase tracking-wider border border-teal-200">
            <Sparkles size={13} />
            Transparency &amp; Verification Standards
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            What Qualifications Do The Shadow Bridge's Professionals Have?
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1 font-medium"><Clock size={14} /> 5 min read</span>
            <span>•</span>
            <span>Quality Standards</span>
            <span>•</span>
            <span>Published by The Shadow Bridge</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-primary/15 shadow-xs text-gray-700 leading-relaxed space-y-4">
          <p className="font-medium text-primary text-base sm:text-lg">
            When inviting an educator into your child's classroom or home, absolute clarity about their training and experience is essential.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            We believe in complete honesty regarding what is verified on our platform. Rather than making exaggerated claims, this page outlines exactly what qualifications are submitted, how our admin team evaluates applicants, and how we match educators to your child's specific profile.
          </p>
        </div>

        {/* Step 1: Intake Fields & Submissions */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <GraduationCap className="text-secondary" size={24} />
            1. Qualifications &amp; Details Submitted at Registration
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Every Shadow Teacher and Special Needs Tutor registering on The Shadow Bridge is required to complete a multi-step verification form providing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Educational Background
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Highest degree earned (e.g. B.Ed in Special Education, Masters in Child Psychology, Diploma in Early Childhood Care, or Registered Behavior Technician coursework).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Specialization Breakdown
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Documented experience handling specific neurodevelopmental profiles: Autism Spectrum Disorder (ASD), ADHD, Down Syndrome, Dyslexia/Dyscalculia, or Physical Delays.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Experience &amp; Resumes
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Years of hands-on teaching or shadowing experience, detailed career history, and uploaded resume/CV documents.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-brand-border/60 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Geographic Feasibility
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Specific city, locality clusters, and daily commute willingness to ensure prompt and reliable daily school attendance.
              </p>
            </div>
          </div>
        </section>

        {/* Step 2: Admin Manual Review */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <FileCheck2 className="text-secondary" size={24} />
            2. Admin Manual Review &amp; Approval
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Educators do not go live automatically. Our administrative team manually reviews each submission in the admin dashboard:
          </p>
          <div className="space-y-3 pt-1">
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/70 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-teal-700 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-teal-950">Credential &amp; Resume Review</h3>
                <p className="text-xs text-teal-900 pt-0.5">
                  Confirming submitted qualifications match the applicant's stated specializations and past classroom or clinical roles.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/70 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-teal-700 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-teal-950">Intake Profile Approval</h3>
                <p className="text-xs text-teal-900 pt-0.5">
                  Profiles are screened and only marked approved once their experience level meets our minimum benchmark for child placement.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/70 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-teal-700 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-teal-950">Child-Educator Compatibility Check</h3>
                <p className="text-xs text-teal-900 pt-0.5">
                  Cross-referencing parent consultation notes with the educator's specific strengths (e.g. non-verbal communication, sensory calm-down techniques, academic pacing).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Box */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-brand-border/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Related Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/resources/how-matching-works"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>How Matching Works</span>
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
              href="/register/shadow-teacher"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Educator Registration Form</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/shadow-teachers"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Shadow Teacher Careers</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold">Find a Qualified Educator for Your Child</h3>
            <p className="text-gray-300 text-sm">
              Schedule an intake consultation with our lead mentor to share your child's requirements and begin educator matching.
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
