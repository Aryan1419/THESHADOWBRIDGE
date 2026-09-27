'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowRight, Sparkles, 
  HelpCircle, Clock, ChevronRight, Users, BookOpen, Layers
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShadowTeacherVsSpecialEducatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Shadow Teacher vs. Special Educator — What\'s the Difference?',
    description: 'A comparison between the classroom integration role of a Shadow Teacher and the specialized instruction role of a Special Educator.',
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
      '@id': 'https://www.theshadowbridge.com/resources/shadow-teacher-vs-special-educator'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the main difference between a Shadow Teacher and a Special Educator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A Special Educator designs and delivers modified academic instruction outside the regular classroom (in a resource room, therapy center, or at home). A Shadow Teacher sits inside the mainstream classroom during school hours to help the child participate in the mainstream teacher\'s ongoing lessons.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can a child benefit from both a Shadow Teacher and a Special Educator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Many children benefit from a Special Educator for remedial, skill-building sessions alongside a Shadow Teacher for daily classroom participation, social regulation, and instruction following.'
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
          <span className="text-secondary font-bold">Role Comparison</span>
        </nav>
      </div>

      {/* Article Body */}
      <article className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pb-20 flex-1 space-y-8">
        
        {/* Title Header */}
        <header className="space-y-4 border-b border-brand-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider border border-blue-200">
            <Sparkles size={13} />
            Comparative Educational Roles
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            Shadow Teacher vs. Special Educator — What's the Difference?
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1 font-medium"><Clock size={14} /> 6 min read</span>
            <span>•</span>
            <span>Educational Guidance</span>
            <span>•</span>
            <span>Published by The Shadow Bridge</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-primary/15 shadow-xs text-gray-700 leading-relaxed space-y-4">
          <p className="font-medium text-primary text-base sm:text-lg">
            These two roles are often confused, but they serve completely different functions in a child's educational journey.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            A <strong>Special Educator</strong> typically works with a child one-on-one or in small groups, <em>outside the regular classroom</em>, focusing on individualized academic instruction tailored to the child's learning pace and style — this might happen in a resource room, a therapy center, or at home. A <strong>Shadow Teacher</strong>, by contrast, works <em>inside the mainstream classroom</em> alongside the child during actual school hours, helping them stay engaged with the same curriculum as their peers rather than delivering separate instruction.
          </p>
        </div>

        {/* Side-by-Side Comparison Table */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-6">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <Layers className="text-secondary" size={24} />
            Side-by-Side Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-primary/20 bg-gray-50/80">
                  <th className="p-3.5 font-bold text-primary">Dimension</th>
                  <th className="p-3.5 font-bold text-purple-900 bg-purple-50/50">Shadow Teacher</th>
                  <th className="p-3.5 font-bold text-blue-900 bg-blue-50/50">Special Educator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60 text-gray-700">
                <tr>
                  <td className="p-3.5 font-semibold text-gray-900">Primary Location</td>
                  <td className="p-3.5 bg-purple-50/20">Inside the mainstream school classroom</td>
                  <td className="p-3.5 bg-blue-50/20">Resource room, therapy clinic, or home</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-gray-900">Core Mission</td>
                  <td className="p-3.5 bg-purple-50/20">Real-time participation, focus, emotional regulation, peer social skills</td>
                  <td className="p-3.5 bg-blue-50/20">Targeted academic remediation, cognitive development, literacy/math modifications</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-gray-900">Curriculum Delivered</td>
                  <td className="p-3.5 bg-purple-50/20">Supports the class teacher's standard curriculum</td>
                  <td className="p-3.5 bg-blue-50/20">Designs customized IEP lessons and remedial materials</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-gray-900">Session Format</td>
                  <td className="p-3.5 bg-purple-50/20">Full school hours or key class periods daily</td>
                  <td className="p-3.5 bg-blue-50/20">Dedicated 45–60 min 1-on-1 or small group sessions</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-gray-900">Ultimate Goal</td>
                  <td className="p-3.5 bg-purple-50/20">Independent functioning in a regular school environment</td>
                  <td className="p-3.5 bg-blue-50/20">Closing academic skill gaps and mastering foundational concepts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* When Both Are Needed */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border space-y-5">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <Users className="text-secondary" size={24} />
            Why Many Children Benefit from Both
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Many children benefit from both — a Special Educator for targeted academic catch-up, and a Shadow Teacher for classroom integration — depending on what the school and a qualified professional recommend after assessing the child's specific needs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-200/70 space-y-2">
              <h3 className="font-bold text-sm text-purple-900">The Special Educator builds the foundation:</h3>
              <p className="text-xs text-purple-950 leading-relaxed">
                Breaking complex phonics, reading, or math operations into multi-sensory learning steps during private sessions.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-2">
              <h3 className="font-bold text-sm text-blue-900">The Shadow Teacher applies it in real time:</h3>
              <p className="text-xs text-blue-950 leading-relaxed">
                Helping the child recognize instructions and apply those concepts when the school teacher addresses thirty students at once.
              </p>
            </div>
          </div>
        </section>

        {/* Internal Links Box */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-brand-border/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/resources/what-is-a-shadow-teacher"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>What is a Shadow Teacher?</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/resources/home-tutor-vs-shadow-teacher"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Home Tutor vs Shadow Teacher</span>
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
              href="/services"
              className="p-3.5 rounded-xl bg-white border border-brand-border/70 hover:border-primary/50 text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center justify-between"
            >
              <span>Explore All Educational Services</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold">Unsure Which Role Your Child Needs?</h3>
            <p className="text-gray-300 text-sm">
              Book an assessment call with our mentor to analyze school reports and decide between classroom shadow support or home special education.
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
