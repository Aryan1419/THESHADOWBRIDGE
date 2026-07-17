'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is a Shadow Teacher?",
    answer: "A Shadow Teacher is a trained professional who works one-on-one with a single child inside a regular classroom. They assist the child with academic guidance, behavioral support, social integration, and developmental challenges, helping them adapt smoothly to the school curriculum and environment independently."
  },
  {
    question: "How do you select and verify your teachers and tutors?",
    answer: "Our verification process is rigorous. We select educators with qualifications in Special Education, Psychology, or relevant pedagogical fields. All candidates undergo strict background verification, professional reference checks, and a comprehensive screening interview to evaluate their patience, empathy, and classroom management capabilities."
  },
  {
    question: "What is the consultation process?",
    answer: "The process begins when you book a consultation for ₹99. During this session, our Lead Mentor and Founder, Pratibha Mishra, evaluates your child's challenges, school scenario, and requirements. We then draft a child-centered support plan and present you with matched candidate profiles for trial sessions."
  },
  {
    question: "Can we choose or replace the assigned Shadow Teacher or Tutor?",
    answer: "Yes, absolutely. We present you with profiles of matched educators and you are involved in selection. If at any point you feel that the chemistry between the teacher and your child is not optimal, we will provide a qualified replacement promptly."
  },
  {
    question: "How much does the service cost?",
    answer: "The initial assessment consultation is priced at ₹99. Monthly subscription plans for Shadow Teachers and Home Tutors depend on the hours, location, and the specific level of support (special needs, behavioral therapy, or standard academic tutoring) required. We provide a transparent, all-inclusive monthly quote during our consultation."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-brand-border rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-primary text-base sm:text-lg hover:bg-brand-light/50 transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="text-accent flex-shrink-0" size={20} />
                <span>{faq.question}</span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
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
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="p-5 pt-0 text-brand-muted text-sm sm:text-base leading-relaxed border-t border-brand-border/40 bg-brand-light/20">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
