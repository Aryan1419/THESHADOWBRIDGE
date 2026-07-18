'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
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

  const branches = [
    {
      city: "Ahmedabad Branch",
      address: "Suite 102, S.G. Highway, Bodakdev, Ahmedabad, Gujarat, 380054",
      phone: "+91 99743 90725",
      email: "aryanbeltharia1419@gmail.com"
    },
    {
      city: "Hyderabad Branch",
      address: "Office 203, Madhapur, Hitec City, Hyderabad, Telangana, 500081",
      phone: "+91 99743 90725",
      email: "aryanbeltharia1419@gmail.com"
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
            <span>Operational Hub</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-primary mb-4">
            Contact Our Team
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto">
            Get in touch with our local branches or submit a request for parent registration assessments.
          </p>
        </div>
      </section>

      {/* Form and info split */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="font-serif text-3xl font-extrabold text-primary mb-4">
                  Get Connected Instantly
                </h2>
                <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                  Have questions about our training modules, fees, or matching checklists? Submit a query and a branch representative will call you.
                </p>
              </div>

              {/* Central Contacts */}
              <div className="space-y-6">
                <div className="flex gap-4 p-4 border border-brand-border bg-brand-light/20 rounded-2xl">
                  <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-brand-dark">Central Helpline</h4>
                    <p className="text-brand-muted text-sm font-semibold">+91 99743 90725</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-brand-border bg-brand-light/20 rounded-2xl">
                  <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-brand-dark">Email Support</h4>
                    <p className="text-brand-muted text-sm font-semibold">
                      <a href="mailto:aryanbeltharia1419@gmail.com" className="hover:text-accent transition-colors">
                        aryanbeltharia1419@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Mockup */}
              <div className="border border-brand-border rounded-3xl overflow-hidden h-[240px] bg-brand-light/50 relative flex items-center justify-center text-center p-6 shadow-inner">
                <div className="space-y-2">
                  <MapPin className="text-accent mx-auto animate-bounce" size={32} />
                  <h4 className="font-serif font-bold text-primary">Interactive Map Grid</h4>
                  <p className="text-xs text-brand-muted max-w-xs">
                    Our verified shadow teachers work at primary and secondary schools across Ahmedabad and Hitec City.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Column */}
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
                  <p className="text-sm">Your contact form details were received. A special needs advisor will phone you within 24 hours.</p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-primary font-bold text-sm underline hover:text-accent pt-2"
                  >
                    Submit another query
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
                        placeholder="e.g. Ramesh Patel"
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
                        placeholder="e.g. 9988776655"
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
                        placeholder="e.g. ramesh@gmail.com"
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
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-brand-dark uppercase tracking-wider">Detailed Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please share details about your requirement (e.g. school shadowing, remedial support grade, ADHD support)..."
                      className="p-3 border border-brand-border bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Query'}
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Branches details */}
      <section className="py-20 bg-brand-light/30 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-extrabold text-primary mb-4">Our Local Branches</h2>
            <p className="text-brand-muted text-sm sm:text-base">
              You can contact our branch managers directly for regional assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {branches.map((b, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-block p-2 bg-primary/10 text-primary rounded-lg mb-4 text-xs font-bold uppercase tracking-wider">
                    {b.city}
                  </div>
                  <p className="text-brand-dark text-sm sm:text-base font-semibold leading-relaxed mb-6">
                    {b.address}
                  </p>
                </div>
                <div className="border-t border-brand-border/60 pt-4 space-y-1">
                  <p className="text-xs text-brand-muted">Phone: <span className="font-bold text-brand-dark">{b.phone}</span></p>
                  <p className="text-xs text-brand-muted">Email: <span className="font-bold text-primary break-all">{b.email}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
