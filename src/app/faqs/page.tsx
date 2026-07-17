'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Search, Filter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FaqRecord {
  category: 'General' | 'Shadow Teaching' | 'Home Tutoring' | 'Pricing & Matching';
  question: string;
  answer: string;
}

const faqData: FaqRecord[] = [
  {
    category: "General",
    question: "What is the mission of The Shadow Bridge?",
    answer: "Our mission is to bridge inclusive educational gaps. We connect families with trained, empathetic educators who facilitate a child's academic, behavioral, and social growth inside mainstream school environments and at home."
  },
  {
    category: "Shadow Teaching",
    question: "What is a Shadow Teacher?",
    answer: "A Shadow Teacher is a professional special educator or behavior facilitator who goes to school with a single child. Their primary goal is to guide the child in classroom tasks, manage behavioral outbursts, promote independent social relations, and slowly fade their support as the child gets independent."
  },
  {
    category: "Shadow Teaching",
    question: "Does the school need to approve having a shadow teacher?",
    answer: "Yes. MAIN mainstream schools must permit shadow teachers in their classrooms. We actively cooperate with school counselors and administrators, providing credentials, school integration logs, and alignment reports."
  },
  {
    category: "Home Tutoring",
    question: "How do Home Tutors differ from standard academic tuition?",
    answer: "Our home tutors are trained in special needs pedagogy and remedial learning. They use play-based and multisensory learning styles specifically designed for children with ADHD, autism, dyslexia, dyscalculia, or slow learning speeds."
  },
  {
    category: "Home Tutoring",
    question: "Can home tutoring support school curriculum?",
    answer: "Yes, absolutely. Our tutors coordinate with the child's school teachers to support current assignments, while focusing on building cognitive fundamentals, reading comprehension, and problem-solving mechanisms."
  },
  {
    category: "Pricing & Matching",
    question: "What does the ₹99 Consultation cover?",
    answer: "The ₹99 consultation covers a structured call with our Lead Mentor Pratibha Mishra. She assesses your child's clinical history, current challenges, school guidelines, and constructs an initial child-centered developmental plan."
  },
  {
    category: "Pricing & Matching",
    question: "How much does a monthly Shadow Teacher subscription cost?",
    answer: "The monthly fee depends on the hours of school shadowing needed (full-day or half-day) and location. We provide transparent billing estimates directly after the lead mentor consultation call, with no upfront placement fee margins."
  },
  {
    category: "Pricing & Matching",
    question: "Can we swap a shadow teacher if they aren't a match for our child?",
    answer: "Yes. If the connection between the educator and the child is not ideal, we organize a qualified replacement. We prioritize the child's comfort and emotional safety."
  }
];

export default function Faqs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = ['All', 'General', 'Shadow Teaching', 'Home Tutoring', 'Pricing & Matching'];

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#F8F5FB] to-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>Support Center</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-primary mb-4">
            Help Directory & FAQs
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto">
            Find immediate answers regarding special education shadows, home tutoring details, matching benchmarks, and billing estimates.
          </p>
        </div>
      </section>

      {/* Main FAQ layout */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search bar & Category filters */}
          <div className="space-y-6 mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search queries (e.g. autism, pricing, schools)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 border border-brand-border bg-brand-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
            </div>

            <div className="flex gap-2 flex-wrap items-center justify-center">
              <span className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1 mr-2">
                <Filter size={14} /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-brand-dark border-brand-border hover:bg-brand-light'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-brand-border rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-primary text-base sm:text-lg hover:bg-brand-light/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="text-accent flex-shrink-0" size={20} />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-accent tracking-widest block mb-0.5">{faq.category}</span>
                        <span>{faq.question}</span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="text-brand-muted flex-shrink-0 ml-2"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 pt-0 text-brand-muted text-sm sm:text-base leading-relaxed border-t border-brand-border/40 bg-brand-light/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 text-brand-muted">
                No matching questions found. Try search keywords like "shadow", "cost", or select another filter.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Support Hook */}
      <section className="py-16 bg-[#F8F5FB] border-t border-brand-border text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">Still Have Unanswered Inquiries?</h2>
          <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto">
            Our support desk is operational 6 days a week to guide you. Send us a message and we will respond.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/contact" className="btn-gradient px-8 py-3 rounded-full font-bold shadow">
              Contact Desk
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
