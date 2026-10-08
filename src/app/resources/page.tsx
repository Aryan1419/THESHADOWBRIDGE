'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, Sparkles, ArrowRight, Search, Clock, 
  ShieldCheck, HelpCircle, Users, GraduationCap, Heart, Compass
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const resourceArticles = [
  {
    slug: 'what-is-a-shadow-teacher',
    title: 'What is a Shadow Teacher, and Does My Child Need One?',
    category: 'Shadow Teaching',
    readTime: '5 min read',
    summary: 'A complete breakdown of what a Shadow Teacher does inside a mainstream classroom, how they foster independence, and when parents should consider one.',
    icon: GraduationCap,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    popular: true,
  },
  {
    slug: 'shadow-teacher-cost-by-city',
    title: 'How Much Does a Shadow Teacher Cost in Delhi NCR, Mumbai, Bangalore, Hyderabad & Pune?',
    category: 'Pricing & Placement',
    readTime: '4 min read',
    summary: 'Clear, transparent breakdown of the consultation and placement-based fee structure across Delhi NCR, Mumbai, Hyderabad, Bangalore, Ahmedabad, and Pune.',
    icon: Compass,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    popular: true,
  },
  {
    slug: 'shadow-teacher-vs-special-educator',
    title: 'Shadow Teacher vs. Special Educator — What\'s the Difference?',
    category: 'Educational Roles',
    readTime: '6 min read',
    summary: 'Understand the distinct roles between classroom integration support (Shadow Teacher) and individualized academic instruction (Special Educator).',
    icon: Users,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    popular: false,
  },
  {
    slug: 'aba-therapy-for-autism',
    title: 'What is ABA Therapy, and How Does It Help Children with Autism?',
    category: 'Therapy & Interventions',
    readTime: '6 min read',
    summary: 'Evidence-based insights into Applied Behavior Analysis (ABA), how structured behavioral intervention develops communication and social skills.',
    icon: Heart,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    popular: true,
  },
  {
    slug: 'home-tutor-vs-shadow-teacher',
    title: 'Home Tutor vs. Shadow Teacher — Which Does My Child Need?',
    category: 'Educational Roles',
    readTime: '5 min read',
    summary: 'Compare home-based academic reinforcement with in-school behavioral assistance to choose the best support model for your child.',
    icon: BookOpen,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    popular: false,
  },
  {
    slug: 'online-parent-training-explained',
    title: 'What is Online Parent Training, and Who Is It For?',
    category: 'Parent Empowerment',
    readTime: '5 min read',
    summary: 'How PAN-India virtual parent training equips families with behavioral routines and emotional regulation tools at home.',
    icon: HelpCircle,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    popular: false,
  },
  {
    slug: 'how-matching-works',
    title: 'How Does The Shadow Bridge\'s Matching Process Actually Work?',
    category: 'How It Works',
    readTime: '4 min read',
    summary: 'Step-by-step walkthrough of our consultation-first matching methodology, from initial intake to in-classroom placement.',
    icon: Sparkles,
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    popular: false,
  },
  {
    slug: 'professional-vetting-process',
    title: 'What Qualifications Do The Shadow Bridge\'s Professionals Have?',
    category: 'Quality & Vetting',
    readTime: '5 min read',
    summary: 'An honest look at our qualification review, experience checks, and manual profile screening for shadow teachers and special tutors.',
    icon: ShieldCheck,
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    popular: true,
  },
];

export default function ResourcesIndexPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Shadow Teaching', 'Pricing & Placement', 'Educational Roles', 'Therapy & Interventions', 'Parent Empowerment', 'How It Works', 'Quality & Vetting'];

  const filteredArticles = resourceArticles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Special Education & Child Support Resources | The Shadow Bridge',
    description: 'Expert articles and practical guidance on Shadow Teaching, Home Tutoring, and Therapy for Special Needs Children in India.',
    url: 'https://www.theshadowbridge.com/resources',
    hasPart: resourceArticles.map(art => ({
      '@type': 'Article',
      headline: art.title,
      description: art.summary,
      url: `https://www.theshadowbridge.com/resources/${art.slug}`
    }))
  };

  return (
    <main className="min-h-screen bg-brand-light flex flex-col font-sans text-brand-dark">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="pt-32 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider border border-primary/20 shadow-xs">
            <Sparkles size={14} className="text-secondary" />
            Knowledge Base &amp; Family Guides
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            Special Education &amp; Child Support Resources
          </h1>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Clear, transparent answers to help parents navigate Shadow Teaching, Home Tutoring, ABA Therapy, and Inclusive Education across India.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics, therapies, costs, or guides..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-brand-border hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-20 flex-1">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-brand-border p-8">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No articles matching your search query.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-4 text-xs text-secondary font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, idx) => {
              const IconComponent = article.icon;
              return (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-brand-border/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-primary/40"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${article.badgeColor}`}>
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                        <IconComponent size={20} />
                      </div>
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                        <Link href={`/resources/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="px-6 py-4 bg-gray-50/70 border-t border-brand-border/60 flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-500 font-medium">The Shadow Bridge Guide</span>
                    <Link
                      href={`/resources/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-secondary group-hover:translate-x-0.5 transition-all"
                    >
                      Read Guide <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary via-[#4E2A7B] to-secondary rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Looking for Personalized Guidance for Your Child?
            </h3>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              Every child's learning journey is unique. Schedule an initial consultation with our educational mentor to discuss tailored Shadow Teaching, Home Tutoring, or Therapy support.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="px-6 py-3 rounded-xl bg-accent text-brand-dark font-bold text-sm shadow-md hover:bg-amber-300 transition-colors"
              >
                Book Consultation (₹99)
              </Link>
              <Link
                href="/shadow-teachers"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                Explore Shadow Teachers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
