'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, Award, Users, BookOpen, Compass, 
  MapPin, Send, HelpCircle, ArrowRight, Star, Heart, GraduationCap, ShieldCheck, Clock
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import FaqAccordion from '@/components/FaqAccordion';

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormSubmitted(true);
        setFormData({ name: '', phone: '', email: '', city: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 5 Feature Cards
  const features = [
    {
      icon: <Heart className="text-secondary" size={24} />,
      title: "Personalized Consultation",
      desc: "Our lead mentors assess your child's specific academic, psychological, and behavioral needs to construct an individualized support blueprint."
    },
    {
      icon: <ShieldCheck className="text-primary" size={24} />,
      title: "Trained & Verified Professionals",
      desc: "Every shadow teacher and home tutor is carefully vetted, background-verified, and selected for their pedagogical expertise and empathy."
    },
    {
      icon: <GraduationCap className="text-secondary" size={24} />,
      title: "Continuous Training & Support",
      desc: "We provide regular upskilling sessions, behavioral therapy training, and mentor supervision to ensure our teachers deliver top-quality assistance."
    },
    {
      icon: <Compass className="text-primary" size={24} />,
      title: "Child-Centered Approach",
      desc: "We prioritize your child's pace, emotional well-being, and individual strengths, focusing on building long-term learning autonomy."
    },
    {
      icon: <CheckCircle2 className="text-secondary" size={24} />,
      title: "Transparent & Reliable Service",
      desc: "Expect detailed weekly developmental tracking reports, direct lines of communication, and prompt support updates."
    }
  ];

  // Cities Section
  const cities = [
    {
      name: "Delhi NCR",
      skyline: "🕌🏛️🏙️",
      desc: "Trusted Support for Your Child's Growth in Delhi NCR.",
      color: "from-secondary/10 to-secondary/30"
    },
    {
      name: "Ahmedabad",
      skyline: "🏛️🕌🏢",
      desc: "Trusted Support for Your Child's Growth in Ahmedabad.",
      color: "from-accent/10 to-accent/30"
    },
    {
      name: "Hyderabad",
      skyline: "🏰🏢🏬",
      desc: "Experienced & Verified Shadow Teachers in Hyderabad.",
      color: "from-secondary/10 to-secondary/30"
    },
    {
      name: "Bangalore",
      skyline: "🌳🏢🏫",
      desc: "Experienced & Verified Shadow Teachers and Tutors in Bangalore.",
      color: "from-accent/10 to-accent/30"
    },
    {
      name: "Pune",
      skyline: "🏰🏢🌳",
      desc: "Trusted Support for Your Child's Growth in Pune.",
      color: "from-secondary/10 to-secondary/30"
    }
  ];

  // Timeline Step (How It Works)
  const steps = [
    {
      number: "01",
      title: "Book Consultation (₹99)",
      desc: "Schedule a comprehensive initial assessment video or phone session with our Lead Mentor to discuss your child's requirements."
    },
    {
      number: "02",
      title: "Register",
      desc: "Submit detailed child history, academic challenges, and school environment details through our secure portal."
    },
    {
      number: "03",
      title: "We Find the Right Match",
      desc: "Our screening algorithm and experts shortlist 2-3 trained educators best suited for your child's personality and requirements."
    },
    {
      number: "04",
      title: "Training & Onboarding",
      desc: "We customize our educator's training to align with your child's school guidelines, routine, and individualized program."
    },
    {
      number: "05",
      title: "Ongoing Support",
      desc: "Benefit from continuous progress reviews, founder mentoring check-ins, and flexible substitutes when needed."
    }
  ];

  // Services Cards
  const services = [
    {
      title: "For Parents & Students",
      desc: "Find experienced, compassionate Shadow Teachers and Home Tutors specialized in special needs support and individual tutoring plans.",
      link: "/register/parent",
      btnText: "Register Now"
    },
    {
      title: "For Shadow Teachers",
      desc: "Join our verified professional network, receive continuous training, and connect with families needing classroom integration support.",
      link: "/register/shadow",
      btnText: "Register Now"
    },
    {
      title: "For Home Tutors",
      desc: "Become a part of our trusted, premium educator community. Teach students with personalized focus and make a meaningful impact.",
      link: "/register/tutor",
      btnText: "Register Now"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F7F5FC] to-white">
        {/* Soft Background shapes */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Sparkles size={16} className="text-secondary" />
                <span>Empowering Children to Blossom</span>
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-primary leading-tight">
                Exceptional Support. <br className="hidden sm:inline" />
                <span className="text-gradient">Empowered Learning.</span> <br />
                Independent Futures.
              </h1>
              
              <p className="text-brand-muted text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Connecting families with professionally trained Shadow Teachers and Home Tutors who provide the right support, guidance, and care every child deserves.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/book"
                  className="btn-gradient px-8 py-4 rounded-full text-base font-bold text-center shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Book a Consultation – Just ₹99
                </Link>
                <Link
                  href="/register/parent"
                  className="px-8 py-4 rounded-full border-2 border-primary text-primary hover:bg-brand-light font-bold text-center transition-all flex items-center justify-center gap-2"
                >
                  I Need a Shadow / Tutor
                </Link>
              </div>
            </div>

            {/* Right Column Image */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] h-[400px] sm:h-[500px]">
                {/* Visual Frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-3xl transform rotate-3 scale-[1.02] opacity-20"></div>
                <div className="absolute inset-0 bg-white rounded-3xl overflow-hidden shadow-2xl border border-brand-border">
                  <Image
                    src="/images/teacher_child.png"
                    alt="Special Needs Home Tutor assisting student with inclusive learning in home setting"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Floating Experience Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -bottom-4 left-2 sm:-bottom-6 sm:left-[-30px] bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xl flex items-center gap-3 sm:gap-3.5 max-w-[250px] sm:max-w-[280px]"
                >
                  <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl text-white">
                    <Award size={24} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-primary text-lg leading-none">11+ Years</h3>
                    <p className="text-xs text-brand-muted font-medium mt-1">Experience in Special Education & Child Support.</p>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 sm:py-8 bg-brand-light border-y border-brand-border text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="text-primary font-serif text-lg sm:text-xl font-bold flex flex-wrap items-center justify-center gap-2">
            <span className="text-secondary font-black">✓</span> Trusted by Parents in Delhi NCR, Ahmedabad, Hyderabad, Bangalore &amp; Pune
          </p>
          <p className="text-primary font-serif text-base sm:text-lg font-bold flex flex-wrap items-center justify-center gap-2">
            <span className="text-secondary font-black">✓</span> 1000+ Consultations &amp; Placements
          </p>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Why Parents Trust The Shadow Bridge
            </h2>
            <p className="text-brand-muted text-base sm:text-lg">
              We go beyond matching teachers. We design inclusive futures with qualified, continuous supervision and deep educational expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-brand-light/40 border border-brand-border p-8 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="p-3.5 bg-white rounded-xl w-fit shadow-sm border border-brand-border group-hover:scale-110 transition-transform mb-6">
                  {feat.icon}
                </div>
                <h3 className="font-serif font-bold text-primary text-xl mb-3">
                  {feat.title}
                </h3>
                <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-black mb-4">
              We Serve in Major Cities
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Our verified special needs educators and academic home tutors are active locally, working in partnership with top schools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {cities.map((city, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[200px] hover:bg-white/15 transition-all group animate-fade-in"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform select-none">
                  {city.skyline}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">{city.name}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{city.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Founder Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] h-[450px]">
                <div className="absolute inset-0 border-2 border-accent rounded-3xl transform -rotate-3 translate-x-2 translate-y-2"></div>
                <div className="absolute inset-0 bg-brand-light rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/founder_pratibha.jpg"
                    alt="Pratibha Mishra - Founder & Lead Educational Mentor at The Shadow Bridge"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Floating Card */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-xl border border-brand-border shadow-lg text-center w-[90%]">
                  <h4 className="font-serif font-black text-primary text-base">Pratibha Mishra</h4>
                  <p className="text-xs text-accent font-bold mb-1">Founder & Lead Mentor</p>
                  <p className="text-[10px] text-brand-muted font-medium">11+ Years in Special Education & Shadow Teacher Support</p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold">
                <Heart size={16} className="text-secondary" />
                <span>Our Leadership</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                Guided by Experience. <br />
                Driven by Compassion.
              </h2>
              <p className="text-brand-muted text-base sm:text-lg leading-relaxed font-sans">
                At The Shadow Bridge, our mission is built on the belief that every child can learn and grow when given the correct support system. Founded and led by <strong>Pratibha Mishra</strong> (Founder & Lead Mentor), who brings 11+ years of experience along with diplomas in <strong>Child Psychology</strong>, <strong>School Counselling</strong>, and <strong>Special Education</strong>, we align educators, parents, and school ecosystems together to construct an optimal developmental pathway.
              </p>
              
              {/* Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Diploma in Child Psychology",
                  "Diploma in School Counselling",
                  "Diploma in Special Education",
                  "11+ Years of Hands-on Experience",
                  "Vetted & Professionally Trained Shadows",
                  "Individualized Child Support Blueprints"
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-brand-dark text-sm sm:text-base font-semibold">{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
                >
                  <span>Learn more about our journey</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-brand-light/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              How It Works
            </h2>
            <p className="text-brand-muted text-base sm:text-lg">
              Our 5-step process ensures a seamless journey from the initial consultation to continuous classroom support.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline center line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-brand-border/80 transform -translate-x-1/2 z-0"></div>

            <div className="space-y-12 lg:space-y-16">
              {steps.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className={`relative flex flex-col lg:flex-row items-center z-10 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Empty block for layout spacer in desktop */}
                    <div className="hidden lg:block lg:w-1/2"></div>
                    
                    {/* Circle Node indicator */}
                    <div className="absolute left-1/2 top-0 lg:top-1/2 w-10 h-10 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold text-sm transform -translate-x-1/2 lg:-translate-y-1/2 shadow-md z-20">
                      {step.number}
                    </div>

                    {/* Content Box */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="w-full lg:w-[45%] bg-white p-8 rounded-2xl border border-brand-border shadow-sm mt-8 lg:mt-0 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-serif font-black text-primary text-xl mb-3 flex items-center gap-2">
                        {step.title}
                      </h3>
                      <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                        {step.desc}
                      </p>
                      {idx === 0 && (
                        <div className="mt-4">
                          <Link
                            href="/book"
                            className="inline-flex items-center gap-1.5 text-secondary text-sm font-bold hover:underline"
                          >
                            <span>Book Consultation now</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Services Tailored for Every Need
            </h2>
            <p className="text-brand-muted text-base sm:text-lg">
              We connect parents with trained professionals, and provide educators with rewarding community placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((srv, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.01 }}
                className="bg-white rounded-2xl border border-brand-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-8">
                  <div className="p-3 bg-brand-light rounded-2xl w-fit mb-6 text-primary">
                    {idx === 0 ? <Users size={28} className="text-secondary" /> : idx === 1 ? <GraduationCap size={28} className="text-primary" /> : <BookOpen size={28} className="text-secondary" />}
                  </div>
                  <h3 className="font-serif font-extrabold text-primary text-2xl mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-6">
                    {srv.desc}
                  </p>
                </div>
                <div className="p-8 pt-0 mt-auto">
                  <Link
                    href={srv.link}
                    className="w-full inline-block text-center py-3 bg-brand-light hover:bg-primary hover:text-white font-bold text-primary rounded-xl transition-all"
                  >
                    {srv.btnText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#F7F5FC] border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Real Stories. Real Impact.
            </h2>
            <p className="text-brand-muted text-base sm:text-lg">
              Read how parents have experienced measurable developmental progress and inclusion in classrooms.
            </p>
          </div>

          <TestimonialCarousel />

          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/testimonials"
              className="px-8 py-3.5 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all shadow-sm"
            >
              Read More Reviews
            </Link>
            <Link
              href="/leave-review"
              className="px-8 py-3.5 rounded-full bg-brand-light border-2 border-brand-border text-secondary hover:border-secondary font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <span>⭐ Leave a Review</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-primary via-[#7A256B] to-secondary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black">
            Book Your Consultation Today – Just ₹99
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Take the first step towards understanding your child's needs. Let's plan their inclusive pathway together.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="px-10 py-4 bg-white text-primary hover:bg-brand-light font-bold text-lg rounded-full inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary mb-4">
                  Get In Touch
                </h2>
                <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                  Have questions about special education tutors, shadow teacher pricing, or registrations? Send a query and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="p-3 bg-brand-light rounded-xl text-primary flex-shrink-0 flex items-center justify-center w-12 h-12">
                    <Send size={22} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark text-base">Email Support</h4>
                    <p className="text-brand-muted text-sm font-semibold">
                      <a href="mailto:theshadowbridgesupport@gmail.com" className="hover:text-accent transition-colors">
                        theshadowbridgesupport@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Query Form Column */}
            <div className="lg:col-span-7 bg-brand-light/30 border border-brand-border p-8 sm:p-10 rounded-3xl shadow-sm">
              <h3 className="font-serif font-extrabold text-primary text-2xl mb-6">Send Us a Message</h3>
              
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-3"
                >
                  <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
                  <h4 className="font-bold text-lg">Thank You!</h4>
                  <p className="text-sm">Your message was sent successfully. Our support desk will call you back shortly.</p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-primary font-bold text-sm underline hover:text-secondary pt-2"
                  >
                    Send another query
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-brand-dark uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Meera Sharma"
                        className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-brand-dark uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-brand-dark uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. meera@gmail.com"
                        className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="city" className="text-xs font-bold text-brand-dark uppercase tracking-wider">Preferred City</label>
                      <select
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                      >
                        <option value="">Select City</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-brand-dark uppercase tracking-wider">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe how we can support your child..."
                      className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-brand-light/30 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary mb-4 flex items-center justify-center gap-2">
              <HelpCircle className="text-secondary" /> Frequently Asked Questions
            </h2>
            <p className="text-brand-muted text-base sm:text-lg">
              Here are answers to some of the common inquiries we receive from parents.
            </p>
          </div>

          <FaqAccordion />

          <div className="text-center mt-12 text-sm text-brand-muted">
            Have more questions? <Link href="/faqs" className="text-primary font-bold hover:underline">Read the full FAQ directory</Link> or <Link href="/contact" className="text-primary font-bold hover:underline">Contact Support</Link>.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
