'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Compass, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Services() {
  const serviceDetails = [
    {
      id: "shadows",
      icon: <Users size={32} className="text-accent" />,
      title: "Special Needs Shadow Teacher",
      subtitle: "Full-Time or Part-Time Classroom Assistance",
      description: "Our Shadow Teachers attend school with your child to support their learning environment. They assist with academic focus, manage behavioral tantrums, facilitate school peer interactions, and act as a professional bridge between teachers, parents, and therapists.",
      features: [
        "ADHD, Autism Spectrum (ASD) & Down Syndrome support",
        "Sensory and behavioral regulation inside the classroom",
        "Social integration coaching for peer groups",
        "Custom school curriculum adaptations",
        "Weekly progress charts and supervisor assessments"
      ],
      ctaLink: "/register/parent",
      ctaText: "Find a Shadow Teacher"
    },
    {
      id: "tutors",
      icon: <GraduationCap size={32} className="text-secondary" />,
      title: "Inclusive Home Tutoring",
      subtitle: "Tailored Academic Guidance at Home",
      description: "For children who face challenges in standard classroom pacing or have learning disabilities (e.g., Dyslexia, Dysgraphia, Dyscalculia), our specialized Home Tutors provide custom lessons in the comfort of your home.",
      features: [
        "Multisensory teaching methods tailored to learning styles",
        "Remedial reading, writing, and mathematics focus",
        "Patience-driven academic scaffolding and test prep",
        "Flexible hourly plans (1-2 hours per session)",
        "Frequent updates and cooperation with school counselors"
      ],
      ctaLink: "/register/parent",
      ctaText: "Find a Home Tutor"
    },
    {
      id: "behavioral",
      icon: <BookOpen size={32} className="text-primary" />,
      title: "Behavioral & Learning Assessment",
      subtitle: "Professional Consultations and Custom Support Plans",
      description: "We don't match educators blindly. We begin with a complete child behavior analysis, mapping cognitive abilities, classroom challenges, and social skills to draft a structured, child-centered development plan.",
      features: [
        "Pre-shadow consultation session (₹99)",
        "Goal setting (social, behavioral, and academic checklists)",
        "On-site school evaluation (with school permission)",
        "Personalized training for assigned educators",
        "Founder-led clinical supervision review calls"
      ],
      ctaLink: "/book",
      ctaText: "Book Assessment Plan"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#F8F5FB] to-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>Empowered Education</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-primary mb-4">
            Our Supportive Services
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto">
            Providing qualified classroom shadow teachers and empathetic home tutors to support special education and inclusive learning challenges.
          </p>
        </div>
      </section>

      {/* Detail Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {serviceDetails.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col lg:flex-row items-center gap-12 p-8 sm:p-12 rounded-3xl border border-brand-border bg-brand-light/20 ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Block */}
                <div className="w-full lg:w-1/2 bg-white border border-brand-border rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
                  <div className="p-4 bg-brand-light rounded-2xl w-fit mb-6">
                    {service.icon}
                  </div>
                  <h3 className="font-serif font-black text-primary text-2xl mb-1">{service.title}</h3>
                  <p className="text-accent font-bold text-sm mb-4">{service.subtitle}</p>
                  <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link
                    href={service.ctaLink}
                    className="btn-gradient w-fit px-6 py-3 rounded-full text-sm font-bold shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>{service.ctaText}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Features Block */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <h4 className="font-serif font-bold text-primary text-xl">What this service includes:</h4>
                  <ul className="space-y-4">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-brand-dark text-sm sm:text-base font-semibold leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="p-5 bg-white border border-brand-border rounded-xl mt-6">
                    <p className="text-xs text-brand-muted">
                      *Note: All matches are preceded by our Lead Mentor consultation assessment to formulate an optimal, customized goal plan.
                    </p>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Pricing / Plan consultation Hook */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <h2 className="font-serif text-3xl font-black">Consultation & Matching Process</h2>
          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We operate with transparency. The initial assessment call is ₹99. Following the call, our subscription pricing depends on the hours of school shadowing or home tutoring requested. No placement fees, no surprises.
          </p>
          <div className="pt-3">
            <Link
              href="/book"
              className="px-8 py-3.5 bg-white text-primary hover:bg-brand-light font-bold rounded-full inline-block shadow transition-all hover:scale-105"
            >
              Book ₹99 Consultation
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
