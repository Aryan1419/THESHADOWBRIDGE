'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PhoneCall, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { 
      name: 'Parents & Students', 
      path: '/parents',
      dropdown: [
        { name: 'Parent Overview', path: '/parents' },
        { name: 'Need a Shadow Teacher?', path: '/parents#shadow-teacher' },
        { name: 'Searching for a Home Tutor?', path: '/parents#home-tutor' },
        { name: 'Register as Parent', path: '/register/parent' },
      ]
    },
    { 
      name: 'Shadow Teachers', 
      path: '/shadow-teachers',
      dropdown: [
        { name: 'Shadow Teacher Careers', path: '/shadow-teachers' },
        { name: 'Home Tutor Careers', path: '/tutors' },
        { name: 'Register as Shadow Teacher', path: '/register/shadow-teacher' },
        { name: 'Register as Home Tutor', path: '/register/tutor' },
      ]
    },
    { name: 'Services', path: '/services' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleMobileMenuClick = (name: string, hasDropdown: boolean) => {
    if (hasDropdown) {
      setMobileExpandedMenu(mobileExpandedMenu === name ? null : name);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-brand-border py-2'
            : 'bg-white/70 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <span className="w-11 h-11 rounded-xl bg-white shadow-md group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden border border-brand-border p-1 flex-shrink-0">
                  <img src="/favicon-192.png" alt="The Shadow Bridge Logo" className="w-full h-full object-contain" />
                </span>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-black text-primary tracking-tight leading-none">
                    The Shadow Bridge
                  </span>
                  <span className="text-[10px] text-accent font-bold tracking-widest uppercase mt-1">
                    by Pratibha Mishra
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1 xl:gap-1.5">
              {navLinks.map((link) => {
                const hasDropdown = !!link.dropdown;
                const isActive = pathname === link.path || (link.dropdown && link.dropdown.some(item => pathname === item.path));

                return (
                  <div
                    key={link.name}
                    className="relative flex items-center h-16"
                    onMouseEnter={() => hasDropdown && setActiveDropdown(link.name)}
                    onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                  >
                    {hasDropdown ? (
                      <button
                        className={`relative h-9 px-2 xl:px-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'text-primary bg-brand-light'
                            : 'text-brand-muted hover:text-primary hover:bg-brand-light/50'
                        }`}
                      >
                        {link.name}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-2 right-2 h-[2px] bg-secondary rounded-full"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={link.path}
                        className={`relative h-9 px-2 xl:px-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 flex items-center justify-center cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'text-primary bg-brand-light'
                            : 'text-brand-muted hover:text-primary hover:bg-brand-light/50'
                        }`}
                      >
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-2 right-2 h-[2px] bg-secondary rounded-full"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    )}

                    {/* Dropdown Menu */}
                    {hasDropdown && (
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-[52px] w-56 rounded-2xl bg-white border border-brand-border shadow-xl py-2 z-50 overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
                            {link.dropdown?.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.path}
                                onClick={() => setActiveDropdown(null)}
                                className="block px-4 py-2.5 text-sm text-brand-muted hover:text-primary hover:bg-brand-light font-medium transition-all"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden xl:flex items-center flex-shrink-0">
              <Link
                href="/book"
                className="btn-gradient px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md whitespace-nowrap"
              >
                <PhoneCall size={14} />
                Book Consultation
              </Link>
            </div>

            {/* Mobile Menu button */}
            <div className="flex xl:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-brand-dark hover:text-primary hover:bg-brand-light focus:outline-none transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden bg-white border-b border-brand-border"
              id="mobile-menu"
            >
              <div className="px-3 pt-2 pb-4 space-y-1 sm:px-4 shadow-inner max-h-[75vh] overflow-y-auto">
                {navLinks.map((link) => {
                  const hasDropdown = !!link.dropdown;
                  const isActive = pathname === link.path || (link.dropdown && link.dropdown.some(item => pathname === item.path));
                  const isExpanded = mobileExpandedMenu === link.name;

                  return (
                    <div key={link.name} className="border-b border-brand-light last:border-b-0 py-1">
                      {hasDropdown ? (
                        <div>
                          <button
                            onClick={() => handleMobileMenuClick(link.name, true)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-bold transition-all ${
                              isActive
                                ? 'text-primary bg-brand-light'
                                : 'text-brand-muted hover:text-primary'
                            }`}
                          >
                            <span>{link.name}</span>
                            <ChevronDown size={18} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Mobile Dropdown content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-4 pr-2 py-1 space-y-1 bg-brand-light/30 rounded-lg mt-1"
                              >
                                {link.dropdown?.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.path}
                                    onClick={() => {
                                      setIsOpen(false);
                                      setMobileExpandedMenu(null);
                                    }}
                                    className="block px-3 py-2 text-sm text-brand-muted hover:text-primary font-semibold transition-all border-l-2 border-brand-border hover:border-secondary pl-3"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.path}
                          onClick={() => handleMobileMenuClick(link.name, false)}
                          className={`block px-3 py-2.5 rounded-lg text-base font-bold transition-all ${
                            isActive
                              ? 'text-primary bg-brand-light border-l-4 border-secondary'
                              : 'text-brand-muted hover:text-primary'
                          }`}
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
                <div className="pt-4 pb-2">
                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="btn-gradient w-full py-3 rounded-full text-center font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <PhoneCall size={18} />
                    Book Consultation – ₹99
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
