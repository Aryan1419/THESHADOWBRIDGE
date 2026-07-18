'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-primary border-b border-brand-border pb-4 mb-8">
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-brand-muted text-sm sm:text-base leading-relaxed">
            <p><strong>Effective Date: July 4, 2026</strong></p>
            <p>
              At <strong>The Shadow Bridge</strong>, we understand that you trust us with sensitive information about your child and family. Protecting your privacy and maintaining the confidentiality of your data is our highest priority.
            </p>
            
            <h2 className="font-serif text-xl font-bold text-primary mt-6">1. Information We Collect</h2>
            <p>
              We collect information provided directly by you when you use our services, register on our portal, or book an assessment consultation. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Parent/Educator Contact Details:</strong> Full name, phone number, email address, and physical location city.</li>
              <li><strong>Child Assessment Details:</strong> Name, age, grade level, educational challenges (such as ADHD, autism, or learning difficulties), and specific support needs.</li>
              <li><strong>Educator Professional Info:</strong> Educational degrees, special needs qualifications, tutoring experience, certificates, and resumes.</li>
              <li><strong>Consultation Transaction Logs:</strong> Booking dates, payment status, and mock receipts. We do not store credit card details or net banking credentials.</li>
            </ul>

            <h2 className="font-serif text-xl font-bold text-primary mt-6">2. How We Use Your Information</h2>
            <p>
              We process data solely to deliver, improve, and coordinate specialized educational assistance:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To evaluate your child's developmental requirements and customize support strategies.</li>
              <li>To match parent requests with qualified shadow teachers or academic tutors.</li>
              <li>To schedule consultation calls and process ₹99 booking checkout requests.</li>
              <li>To verify the credentials of shadow teachers and home tutors in our database.</li>
            </ul>

            <h2 className="font-serif text-xl font-bold text-primary mt-6">3. Data Security & Storage</h2>
            <p>
              All registration and booking submissions are stored securely. We enforce access control policies, ensuring only authorized case managers and lead mentors (under founder Pratibha Mishra) inspect family developmental dossiers. We do not sell or share your data with third-party advertising companies.
            </p>

            <h2 className="font-serif text-xl font-bold text-primary mt-6">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or wish to modify or request deletion of your information, please contact us at <span className="font-bold text-primary">aryanbeltharia1419@gmail.com</span>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
