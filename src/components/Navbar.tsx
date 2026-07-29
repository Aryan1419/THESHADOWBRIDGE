'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PhoneCall, ChevronDown, Sparkles, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change or Escape key
  useEffect(() => {
    setIsOpen(false);
    setExpandedSection(null);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', badge: null },
    { name: 'About Us', path: '/about', badge: null },
    { 
      name: 'Parents & Students', 
      path: '/parents',
      badge: 'Parent Portal',
      dropdown: [
        { name: 'Parent Overview', path: '/parents' },
        { name: 'Need a Shadow Teacher?', path: '/parents#shadow-teacher' },
        { name: 'Searching for a Home Tutor?', path: '/parents#home-tutor' },
        { name: 'Register as Parent', path: '/register/parent' },
      ]
    },
    { 
      name: 'Shadow Teachers & Tutors', 
      path: '/shadow-teachers',
      badge: 'Careers',
      dropdown: [
        { name: 'Shadow Teacher Careers', path: '/shadow-teachers' },
        { name: 'Home Tutor Careers', path: '/tutors' },
        { name: 'Register as Shadow Teacher', path: '/register/shadow-teacher' },
        { name: 'Register as Home Tutor', path: '/register/tutor' },
      ]
    },
    { name: 'Services', path: '/services', badge: null },
    { name: 'Check Status', path: '/check-status', badge: 'Status Lookup', highlight: true },
    { name: 'Testimonials', path: '/testimonials', badge: null },
    { name: 'FAQs', path: '/faqs', badge: null },
    { name: 'Contact Us', path: '/contact', badge: null },
  ];

  const toggleSection = (name: string) => {
    setExpandedSection(expandedSection === name ? null : name);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-brand-border py-2.5'
            : 'bg-white/80 backdrop-blur-sm py-4 border-b border-brand-border/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* 1. Logo & Brand Wordmark (Visible on Left on Desktop & Mobile) */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
                <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden border border-brand-border p-1 flex-shrink-0">
                  <img src="/favicon-192.png" alt="The Shadow Bridge Logo" className="w-full h-full object-contain" />
                </span>
                <div className="flex flex-col">
                  <span className="font-serif text-lg sm:text-2xl font-black text-primary tracking-tight leading-none">
                    The Shadow Bridge
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-accent font-bold tracking-widest uppercase mt-0.5 sm:mt-1">
                    by Pratibha Mishra
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Right Side: Book Consultation CTA + Unified Hamburger Icon */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Primary CTA Button - Visible on both Desktop & Mobile */}
              <Link
                href="/book"
                className="btn-gradient px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md whitespace-nowrap cursor-pointer"
              >
                <PhoneCall size={14} className="shrink-0" />
                <span>Book Consultation</span>
                <span className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-extrabold ml-1">₹99</span>
              </Link>

              {/* Unified Hamburger Menu Button (☰ Icon) - Visible on BOTH Desktop & Mobile */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                  isOpen
                    ? 'bg-primary text-white border-primary shadow-indigo-100'
                    : 'bg-brand-light/90 text-primary border-brand-border hover:bg-brand-light hover:border-primary/40'
                }`}
                aria-label="Toggle Navigation Menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
                <span className="hidden md:inline-block text-xs font-extrabold uppercase tracking-wider pr-1">
                  {isOpen ? 'Close' : 'Menu'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Clean Slide-Out / Dropdown Navigation Panel (Works seamlessly on Desktop & Mobile) */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop Blur Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 top-[65px] sm:top-[73px]"
                onClick={() => setIsOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute top-full left-0 w-full bg-white border-b border-brand-border shadow-2xl z-50 overflow-hidden"
              >
                {/* Brand Accent Top Stripe */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-h-[82vh] overflow-y-auto">
                  {/* Grid Layout for Desktop, Single Column for Mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    
                    {/* Column 1: Main Pages & Check Status */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
                        <Sparkles size={12} /> Main Navigation
                      </div>
                      
                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                          pathname === '/'
                            ? 'bg-brand-light text-primary border border-brand-border/60'
                            : 'text-brand-dark hover:bg-brand-light/60 hover:text-primary'
                        }`}
                      >
                        <span>Home</span>
                        <ArrowRight size={14} className="text-brand-muted opacity-60" />
                      </Link>

                      <Link
                        href="/about"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                          pathname === '/about'
                            ? 'bg-brand-light text-primary border border-brand-border/60'
                            : 'text-brand-dark hover:bg-brand-light/60 hover:text-primary'
                        }`}
                      >
                        <span>About Us</span>
                        <ArrowRight size={14} className="text-brand-muted opacity-60" />
                      </Link>

                      <Link
                        href="/services"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                          pathname === '/services'
                            ? 'bg-brand-light text-primary border border-brand-border/60'
                            : 'text-brand-dark hover:bg-brand-light/60 hover:text-primary'
                        }`}
                      >
                        <span>Services</span>
                        <ArrowRight size={14} className="text-brand-muted opacity-60" />
                      </Link>

                      {/* Check Status - Highlighted Card */}
                      <Link
                        href="/check-status"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all border shadow-sm ${
                          pathname === '/check-status'
                            ? 'bg-secondary/10 text-secondary border-secondary/40'
                            : 'bg-gradient-to-r from-brand-light to-white text-secondary border-secondary/20 hover:border-secondary/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-secondary" />
                          <span>Check Status</span>
                        </div>
                        <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                          Lookup
                        </span>
                      </Link>
                    </div>

                    {/* Column 2: Program Sections (Parents & Shadow Teachers Dropdowns) */}
                    <div className="space-y-4 md:col-span-1">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
                        <Sparkles size={12} /> Programs &amp; Registration
                      </div>

                      {/* Parents & Students Accordion / Dropdown */}
                      <div className="bg-brand-light/30 border border-brand-border/60 rounded-2xl p-1.5">
                        <button
                          onClick={() => toggleSection('Parents & Students')}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm text-primary hover:bg-brand-light/80 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>Parents &amp; Students</span>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 text-brand-muted ${
                              expandedSection === 'Parents & Students' ? 'rotate-180 text-primary' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {(expandedSection === 'Parents & Students' || expandedSection === null) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-3 pr-2 py-1 space-y-1"
                            >
                              {navLinks.find(l => l.name === 'Parents & Students')?.dropdown?.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.path}
                                  onClick={() => setIsOpen(false)}
                                  className={`block px-3 py-2 text-xs font-semibold rounded-lg transition-all border-l-2 ${
                                    pathname === sub.path
                                      ? 'text-secondary border-secondary bg-white shadow-xs font-bold'
                                      : 'text-brand-muted border-transparent hover:text-primary hover:border-primary/40 hover:bg-white/60'
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Shadow Teachers & Tutors Accordion / Dropdown */}
                      <div className="bg-brand-light/30 border border-brand-border/60 rounded-2xl p-1.5">
                        <button
                          onClick={() => toggleSection('Shadow Teachers & Tutors')}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm text-primary hover:bg-brand-light/80 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>Shadow Teachers &amp; Tutors</span>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 text-brand-muted ${
                              expandedSection === 'Shadow Teachers & Tutors' ? 'rotate-180 text-primary' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {(expandedSection === 'Shadow Teachers & Tutors' || expandedSection === null) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-3 pr-2 py-1 space-y-1"
                            >
                              {navLinks.find(l => l.name === 'Shadow Teachers & Tutors')?.dropdown?.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.path}
                                  onClick={() => setIsOpen(false)}
                                  className={`block px-3 py-2 text-xs font-semibold rounded-lg transition-all border-l-2 ${
                                    pathname === sub.path
                                      ? 'text-secondary border-secondary bg-white shadow-xs font-bold'
                                      : 'text-brand-muted border-transparent hover:text-primary hover:border-primary/40 hover:bg-white/60'
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Column 3: Trust & Information + Consultation Action Card */}
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
                        <Sparkles size={12} /> Support &amp; Community
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/testimonials"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                            pathname === '/testimonials'
                              ? 'bg-brand-light text-primary border border-brand-border/60'
                              : 'text-brand-dark hover:bg-brand-light/60 hover:text-primary'
                          }`}
                        >
                          <span>Testimonials</span>
                          <ArrowRight size={14} className="text-brand-muted opacity-60" />
                        </Link>

                        <Link
                          href="/leave-review"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                            pathname === '/leave-review'
                              ? 'bg-brand-light text-secondary border border-brand-border/60 font-bold'
                              : 'text-secondary hover:bg-brand-light/60 font-bold'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">⭐ Leave a Review</span>
                          <ArrowRight size={14} className="text-secondary opacity-60" />
                        </Link>

                        <Link
                          href="/faqs"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                            pathname === '/faqs'
                              ? 'bg-brand-light text-primary border border-brand-border/60'
                              : 'text-brand-dark hover:bg-brand-light/60 hover:text-primary'
                          }`}
                        >
                          <span>FAQs</span>
                          <ArrowRight size={14} className="text-brand-muted opacity-60" />
                        </Link>

                        <Link
                          href="/contact"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                            pathname === '/contact'
                              ? 'bg-brand-light text-primary border border-brand-border/60'
                              : 'text-brand-dark hover:bg-brand-light/60 hover:text-primary'
                          }`}
                        >
                          <span>Contact Us</span>
                          <ArrowRight size={14} className="text-brand-muted opacity-60" />
                        </Link>
                      </div>

                      {/* Featured Consultation Action Card */}
                      <div className="bg-gradient-to-br from-primary to-[#2A1D4E] text-white p-5 rounded-2xl shadow-lg border border-primary/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Assessment Call</span>
                          <span className="px-2.5 py-0.5 bg-secondary text-white text-[11px] font-black rounded-full">₹99 Only</span>
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-bold text-white leading-tight">
                            Book 1-on-1 Consultation Call
                          </h4>
                          <p className="text-xs text-brand-muted/90 mt-1 leading-relaxed">
                            Speak directly with Founder Pratibha Mishra to assess your child's educational needs.
                          </p>
                        </div>
                        <Link
                          href="/book"
                          onClick={() => setIsOpen(false)}
                          className="btn-gradient w-full py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <PhoneCall size={14} />
                          Schedule Session Now
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
