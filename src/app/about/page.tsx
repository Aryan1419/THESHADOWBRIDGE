'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, Users, BookOpen, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  const values = [
    {
      icon: <Heart className="text-accent" size={24} />,
      title: "Compassion First",
      desc: "Every child is unique. We approach each student with empathy, warm patience, and positive reinforcement to build their confidence."
    },
    {
      icon: <Shield className="text-secondary" size={24} />,
      title: "Safety & Integrity",
      desc: "We perform exhaustive backgrounds check and provide complete transparency in our match processes to ensure your peace of mind."
    },
    {
      icon: <Award className="text-primary" size={24} />,
      title: "High Standards",
      desc: "Our educators are continually upskilled through clinical training workshops and supervised by special education mentors."
    },
    {
      icon: <Users className="text-accent" size={24} />,
      title: "Inclusive Future",
      desc: "We believe in classroom inclusion. We build our shadow programs to help children achieve independent academic and social participation."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#F8F5FB] to-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>Our Journey</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-primary mb-4">
            About The Shadow Bridge
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto">
            We bridge the gap between individual learning challenges and classroom inclusion, nurturing children to become independent learners.
          </p>
        </div>
      </section>

      {/* Core Section: Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Column */}
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-extrabold text-primary">
                Our Mission: Unlocking the Potential of Every Single Child
              </h2>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                The Shadow Bridge was founded with a singular purpose: to ensure that children who require specialized developmental or academic support are not left behind in standard educational environments. We provide the scaffolding — in the form of trained Shadow Teachers and home tutors — to help children navigate school settings, manage behavior, overcome learning disabilities, and thrive.
              </p>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                By working closely with parents, school administrators, and behavioral therapists, we create a unified support system that meets the child where they are. Our goal is always gradual withdrawal: teaching the child coping mechanisms and independence so they eventually no longer require a shadow.
              </p>

              <div className="border-l-4 border-accent pl-4 italic text-primary font-serif py-1">
                "Inclusion is not just about placing a child in a classroom; it is about providing the precise support they need to participate, interact, and learn."
              </div>
            </div>

            {/* Illustration/Image Column */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-[480px] h-[340px] relative rounded-3xl overflow-hidden shadow-lg border border-brand-border bg-brand-light flex items-center justify-center p-8 text-center">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto text-primary">
                    <BookOpen size={40} />
                  </div>
                  <h3 className="font-serif font-bold text-primary text-xl">Our Pillars of Support</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-brand-dark pt-2">
                    <div className="p-3 bg-white border border-brand-border rounded-xl shadow-sm">🏫 School Shadowing</div>
                    <div className="p-3 bg-white border border-brand-border rounded-xl shadow-sm">🏠 Academic Tutors</div>
                    <div className="p-3 bg-white border border-brand-border rounded-xl shadow-sm">🧠 Special Education</div>
                    <div className="p-3 bg-white border border-brand-border rounded-xl shadow-sm">💬 Behavioral Guidance</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-20 bg-brand-light/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Founder Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] h-[400px]">
                <div className="absolute inset-0 border-2 border-accent rounded-2xl transform -rotate-3 translate-x-1.5 translate-y-1.5"></div>
                <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="/images/founder_pratibha.jpg"
                    alt="Pratibha Mishra"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Meet Our Founder</span>
              <h2 className="font-serif text-3xl font-extrabold text-primary">Pratibha Mishra</h2>
              <h4 className="text-accent font-bold -mt-2">Founder | Lead Mentor | Child Integration Specialist</h4>
              
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                With over 11 years of experience in shadow teaching and inclusive education, Pratibha Mishra has supported children, families, and schools in creating meaningful learning experiences. She is a graduate and has completed professional diplomas in Child Psychology and School Counselling, along with advanced studies in leadership and management.
              </p>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                She believes that a shadow teacher's role is not to complete a child's work, but to nurture independence, confidence, emotional well-being, and successful participation in school life.
              </p>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                Through The Shadow Bridge, her mission is to bridge the gap between children, families, schools, and trained shadow teachers, ensuring every child receives the support they need to thrive.
              </p>

              <div className="pt-2">
                <Link
                  href="/book"
                  className="btn-gradient px-6 py-3 rounded-full text-sm font-bold shadow hover:scale-105 transition-all inline-block text-white"
                >
                  Book Assessment Consultation with Pratibha
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-extrabold text-primary mb-4">Our Core Values</h2>
            <p className="text-brand-muted text-sm sm:text-base">
              At The Shadow Bridge, these values govern our day-to-day operations, matching algorithms, and mentor interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div key={i} className="flex gap-4 p-6 border border-brand-border bg-brand-light/20 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                <div className="p-3 bg-white border border-brand-border rounded-xl shadow-sm w-fit h-fit flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-primary text-lg mb-2">{v.title}</h3>
                  <p className="text-brand-muted text-sm sm:text-base leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology / Child Centered Approach */}
      <section className="py-20 bg-primary text-white" id="method">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">Our Child-Centered Support Methodology</h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            We follow a structured 3-phase developmental path for every child. We begin with a comprehensive baseline assessment, followed by an individualized behavioral-curriculum strategy. As the child starts meeting benchmarks, our supervisor coordinates a gradual withdrawal phase, reducing shadow assistance from full-time to part-time, and finally to complete student autonomy.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-brand-dark">
            <div className="bg-white p-6 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">1</div>
              <h4 className="font-serif font-bold text-primary mb-1">Baseline Assessment</h4>
              <p className="text-xs text-brand-muted">Lead mentors define specific child milestones and hurdles.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">2</div>
              <h4 className="font-serif font-bold text-primary mb-1">Guided Integration</h4>
              <p className="text-xs text-brand-muted">Regular teacher supervision with weekly parent feedback loops.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">3</div>
              <h4 className="font-serif font-bold text-primary mb-1">Autonomy Phase</h4>
              <p className="text-xs text-brand-muted">Gradual support reduction as the child achieves learning confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-white border-t border-brand-border text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">Need a Specialized Support Plan for Your Child?</h2>
          <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto">
            Book an assessment consultation with Founder Pratibha Mishra for ₹99 and discover the best path for your child.
          </p>
          <div className="pt-2 flex justify-center">
            <Link href="/book" className="btn-gradient px-8 py-3.5 rounded-full font-bold shadow">
              Book Consultation – ₹99
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
