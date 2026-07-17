'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsConditions() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-primary border-b border-brand-border pb-4 mb-8">
            Terms & Conditions
          </h1>
          
          <div className="space-y-6 text-brand-muted text-sm sm:text-base leading-relaxed">
            <p><strong>Effective Date: July 4, 2026</strong></p>
            <p>
              Welcome to <strong>The Shadow Bridge</strong>. By accessing our website, booking assessment consultations, or registering as a parent or educator, you agree to comply with and be bound by the following terms of service.
            </p>
            
            <h2 className="font-serif text-xl font-bold text-primary mt-6">1. Consultation Services & Fees</h2>
            <p>
              The initial consultation booking is priced at ₹99. This consultation is a structural review call with a Lead Mentor to formulate an initial developmental approach. Booking fees are processed through a mockup secure checkout and are non-refundable after the consultation has occurred.
            </p>

            <h2 className="font-serif text-xl font-bold text-primary mt-6">2. Educator Matching & Vetting</h2>
            <p>
              While we perform background verification and professional credential vetting for all Shadow Teachers and Home Tutors, parents are encouraged to actively participate in selection and trial sessions. The Shadow Bridge coordinates the placements but is not responsible for school-specific administrative rules. Mainstream school approval for shadow presence in class is the parent's responsibility.
            </p>

            <h2 className="font-serif text-xl font-bold text-primary mt-6">3. Substitution & Replacements</h2>
            <p>
              In the event that an assigned educator is unavailable due to medical issues, or if the parent requests a replacement due to lack of chemistry, The Shadow Bridge will shortlist and assign a qualified substitute candidate as quickly as possible.
            </p>

            <h2 className="font-serif text-xl font-bold text-primary mt-6">4. Modifications to Terms</h2>
            <p>
              We reserve the right to revise these terms at any time. Any changes will be updated on this page with an updated effective date.
            </p>

            <h2 className="font-serif text-xl font-bold text-primary mt-6">5. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
