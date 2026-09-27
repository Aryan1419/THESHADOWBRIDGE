'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowRight, Sparkles, 
  HelpCircle, Clock, ChevronRight, MapPin, IndianRupee, ShieldCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShadowTeacherCostByCityPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How Much Does a Shadow Teacher Cost in Delhi NCR, Hyderabad, Bangalore, Ahmedabad, and Pune?',
    description: 'A transparent guide detailing the two-stage placement-based fee structure for Shadow Teachers across Delhi NCR, Hyderabad, Bangalore, Ahmedabad, and Pune.',
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
      '@id': 'https://www.theshadowbridge.com/resources/shadow-teacher-cost-by-city'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Shadow Teacher pricing hourly or placement-based?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At The Shadow Bridge, placement is structured around a one-time placement fee after a qualified, compatible educator is matched with your child, rather than recurring hourly agency markups.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the exact fees charged by The Shadow Bridge?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The platform fee consists of an initial ₹99 Consultation Fee (for clinical assessment and intake), followed by a ₹5,000 Placement Fee once a verified Shadow Teacher or Tutor match is identified and confirmed.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do fees differ between Delhi NCR, Bangalore, Pune, Ahmedabad, or Hyderabad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The Shadow Bridge maintains the exact same transparent fee structure (₹99 consultation + ₹5,000 placement fee) across all 5 operational cities.'
        }
      }
    ]
  };

  const cities = [
    { name: 'Delhi NCR', areas: 'South Delhi, Gurugram, Noida, Greater Noida, Faridabad, Ghaziabad, West & North Delhi' },
    { name: 'Hyderabad', areas: 'Gachibowli, Hitec City, Madhapur, Jubilee Hills, Banjara Hills, Kondapur, Kukatpally' },
    { name: 'Bangalore', areas: 'Whitefield, Indiranagar, Koramangala, HSR Layout, Sarjapur Road, Jayanagar, Electronic City' },
    { name: 'Ahmedabad', areas: 'SG Highway, Bopal, Prahlad Nagar, Satellite, Bodakdev, Thaltej, Navrangpura' },
    { name: 'Pune', areas: 'Koregaon Park, Viman Nagar, Baner, Wakad, Hinjewadi, Aundh, Kothrud' },
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
          <span className="text-secondary font-bold">Pricing &amp; Cost Guide</span>
        </nav>
      </div>

      {/* Article Body */}
      <article className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pb-20 flex-1 space-y-8">
        
        {/* Title Header */}
        <header className="space-y-4 border-b border-brand-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider border border-emerald-200">
            <Sparkles size={13} />
            Transparent Pricing Structure
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            How Much Does a Shadow Teacher Cost in Delhi NCR, Hyderabad, Bangalore, Ahmedabad, and Pune?
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1 font-medium"><Clock size={14} /> 4 min read</span>
            <span>•</span>
            <span>Live Pricing Verified</span>
            <span>•</span>
            <span>Published by The Shadow Bridge</span>
          </div>
        </header>

        {/* Core Pricing Model Summary */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-primary/15 shadow-xs text-gray-700 leading-relaxed space-y-4">
          <p className="font-medium text-primary text-base sm:text-lg">
            Unlike traditional tutoring agencies that charge steep, ongoing hourly middleman commissions, The Shadow Bridge operates on a <strong>transparent placement-based model</strong>.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            You pay a nominal initial fee for a detailed clinical and classroom intake consultation, followed by a one-time placement fee only after a qualified, compatible educator has been matched with your child.
          </p>
        </div>

        {/* Step-by-Step Fee Breakdown Cards */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-primary">
            The Two-Step Fee Structure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Step 1: Consultation */}
            <div className="bg-white rounded-2xl p-6 border-2 border-primary/20 shadow-xs space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Step 1
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-primary flex items-center justify-center font-bold font-serif text-xl">
                  ₹99
                </div>
                <div>
                  <h3 className="font-bold text-base text-primary">Intake Consultation Fee</h3>
                  <p className="text-xs text-gray-500">Paid when booking your initial call</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Covers a dedicated 1-on-1 assessment discussion with our educational mentor to evaluate your child's specific developmental profile, IEP goals, school policies, and locality.
              </p>
              <ul className="text-xs text-gray-700 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  Personal intake discussion with founder/mentor
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  Unlocks detailed child registration &amp; preference form
                </li>
              </ul>
            </div>

            {/* Step 2: Placement */}
            <div className="bg-white rounded-2xl p-6 border-2 border-secondary/30 shadow-xs space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-secondary text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Step 2
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-secondary flex items-center justify-center font-bold font-serif text-xl">
                  ₹5,000
                </div>
                <div>
                  <h3 className="font-bold text-base text-primary">One-Time Placement Fee</h3>
                  <p className="text-xs text-gray-500">Paid once an educator match is found</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                One-time fee upon successful matching of a verified Shadow Teacher or Special Needs Home Tutor based on your requested school schedule, qualifications, and locality.
              </p>
              <ul className="text-xs text-gray-700 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  No recurring agency percentages on monthly salary
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  Direct parent-educator monthly remuneration agreement
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* City Consistency Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <MapPin className="text-secondary" size={24} />
            Same Transparent Fee Across All Five Major Cities
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            The Shadow Bridge maintains the exact same platform fee structure across all operational hubs. We do not inflate placement fees based on city tier:
          </p>

          <div className="space-y-3 pt-2">
            {cities.map((city) => (
              <div key={city.name} className="p-4 rounded-xl bg-gray-50/80 border border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {city.name}
                  </h3>
                  <p className="text-xs text-gray-500 pt-0.5">{city.areas}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-block px-3 py-1 rounded-lg bg-white border border-brand-border font-mono text-xs font-bold text-primary">
                    ₹99 Intake + ₹5,000 Placement
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Educator Monthly Remuneration Note */}
        <section className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
          <h3 className="font-bold text-base text-amber-900 flex items-center gap-2">
            <IndianRupee size={18} />
            Educator Monthly Remuneration
          </h3>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            The ongoing monthly salary for the Shadow Teacher or Tutor is paid directly by the parent to the educator (typically ranging based on hours, qualifications, and school duration). Because our placement fee is one-time, families avoid paying ongoing commission markups month after month.
          </p>
        </section>

        {/* Internal Links */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-brand-border/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/resources/how-matching-works"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>How the Matching Process Works</span>
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
              href="/shadow-teachers"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Shadow Teacher Services</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/book"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Book an Intake Consultation (₹99)</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold">Start with an Intake Consultation</h3>
            <p className="text-gray-300 text-sm">
              Schedule your ₹99 consultation to share your child's requirements and begin educator matching across Delhi NCR, Bangalore, Pune, Ahmedabad, or Hyderabad.
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
