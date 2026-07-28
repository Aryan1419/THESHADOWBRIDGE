import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12 mb-12">
          
          {/* Column 1: Company Info */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-5">
              <span className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-brand-border p-1 flex-shrink-0">
                <img src="/favicon-192.png" alt="The Shadow Bridge Logo" className="w-full h-full object-contain" />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-none animate-pulse">
                  The Shadow Bridge
                </span>
                <span className="text-[9px] text-accent font-semibold tracking-widest uppercase mt-1">
                  by Pratibha Mishra
                </span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed max-w-sm">
              We empower children by bridging the gap in inclusive education. Our professionally trained Shadow Teachers and Home Tutors provide compassionate, child-centered guidance to build confidence, independence, and educational success.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/the_shadow_bridge?igsh=c2xhcjQ1bTU0djcw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 hover:bg-accent rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 text-white" 
                aria-label="Instagram"
                title="Follow us on Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/pratibha-mishra-3992042ab/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 hover:bg-accent rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 text-white" 
                aria-label="LinkedIn"
                title="Connect on LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 border-b border-white/20 pb-2">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="/check-status" className="hover:text-accent transition-colors font-bold text-accent">Check Application Status</Link></li>
              <li><Link href="/testimonials" className="hover:text-accent transition-colors">Testimonials</Link></li>
              <li><Link href="/faqs" className="hover:text-accent transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: For Parents & Students Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 border-b border-white/20 pb-2">For Parents</h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><Link href="/parents" className="hover:text-accent transition-colors">Parent Overview</Link></li>
              <li><Link href="/parents#shadow-teacher" className="hover:text-accent transition-colors">Need a Shadow Teacher?</Link></li>
              <li><Link href="/parents#home-tutor" className="hover:text-accent transition-colors">Searching for a Home Tutor?</Link></li>
              <li><Link href="/register/parent" className="hover:text-accent transition-colors">Register as Parent</Link></li>
              <li><Link href="/book" className="hover:text-accent transition-colors">Book Consultation (₹99)</Link></li>
            </ul>
          </div>

          {/* Column 4: For Shadow Teachers & Tutors Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 border-b border-white/20 pb-2">For Educators</h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><Link href="/shadow-teachers" className="hover:text-accent transition-colors">Shadow Teacher Careers</Link></li>
              <li><Link href="/tutors" className="hover:text-accent transition-colors">Home Tutor Careers</Link></li>
              <li><Link href="/register/shadow-teacher" className="hover:text-accent transition-colors">Register as Shadow Teacher</Link></li>
              <li><Link href="/register/tutor" className="hover:text-accent transition-colors">Register as Home Tutor</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 border-b border-white/20 pb-2">Contact Us</h3>
            <ul className="space-y-3.5 text-sm text-gray-300">
              <li className="flex gap-2">
                <Mail size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <a href="mailto:theshadowbridgesupport@gmail.com" className="hover:text-accent transition-colors break-all">
                  theshadowbridgesupport@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom footer bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} The Shadow Bridge. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
