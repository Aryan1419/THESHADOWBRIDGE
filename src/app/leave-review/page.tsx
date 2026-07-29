'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Send, CheckCircle2, AlertCircle, ArrowLeft, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function LeaveReviewPage() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [serviceType, setServiceType] = useState('Shadow Teacher Support');
  const [childFirstName, setChildFirstName] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [consentPublic, setConsentPublic] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const ratingLabels: Record<number, string> = {
    1: '1 - Poor Experience',
    2: '2 - Needs Improvement',
    3: '3 - Satisfactory',
    4: '4 - Excellent Support',
    5: '5 - Outstanding & Life-Changing'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }
    if (reviewText.trim().length < 10) {
      setError('Please write at least 10 characters in your review.');
      return;
    }
    if (!consentPublic) {
      setError('You must agree to the public display terms to submit your review.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim(),
          serviceType,
          childFirstName: childFirstName.trim(),
          registrationId: registrationId.trim(),
          rating,
          reviewText: reviewText.trim(),
          consentPublic
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light/30 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <Link href="/testimonials" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-primary transition-colors">
            <ArrowLeft size={14} /> Back to Testimonials
          </Link>
        </div>

        <div className="bg-white border border-brand-border rounded-3xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary via-[#2A1D4E] to-secondary text-white p-8 sm:p-10 text-center relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-primary"></div>
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <HeartHandshake size={32} className="text-secondary" />
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">Share Your Experience</h1>
            <p className="text-xs sm:text-sm text-brand-muted/90 mt-2 max-w-xl mx-auto leading-relaxed">
              Your honest review helps parents discover compassionate, background-verified shadow teaching and tutoring support.
            </p>
          </div>

          {submitted ? (
            /* Success State */
            <div className="p-8 sm:p-12 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
                <CheckCircle2 size={44} />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-primary">Thank You for Your Feedback!</h2>
                <p className="text-sm text-brand-dark max-w-md mx-auto leading-relaxed">
                  Your review has been submitted successfully to administration. Once reviewed, it will be published publicly on our website.
                </p>
              </div>

              <div className="bg-brand-light/60 p-4 rounded-2xl max-w-md mx-auto border border-brand-border/60 text-xs text-brand-muted space-y-1">
                <div className="font-bold text-primary flex items-center justify-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" /> Admin Quality Control Active
                </div>
                <p>Submitted by <strong>{name}</strong> • Rating: <strong>{rating} Stars</strong></p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/testimonials"
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all shadow-md text-center"
                >
                  View All Testimonials →
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 border border-brand-border bg-white text-brand-dark font-bold rounded-xl text-xs hover:bg-brand-light transition-all text-center"
                >
                  Return to Home Page
                </Link>
              </div>
            </div>
          ) : (
            /* Review Submission Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Star Rating Selector */}
              <div className="space-y-2 text-center sm:text-left bg-brand-light/40 p-5 rounded-2xl border border-brand-border/60">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Overall Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center justify-center sm:justify-start gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          size={32}
                          fill={active ? '#F59E0B' : 'none'}
                          className={active ? 'text-amber-500' : 'text-gray-300'}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-bold text-secondary">
                  {ratingLabels[hoverRating || rating] || ''}
                </p>
              </div>

              {/* 2. Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pratibha Mishra"
                    className="w-full p-3 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    City / Location <span className="text-brand-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Noida, Delhi NCR"
                    className="w-full p-3 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                  />
                </div>
              </div>

              {/* 3. Service Type & Optional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    Service Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full p-3 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                  >
                    <option value="Shadow Teacher Support">Shadow Teacher Support</option>
                    <option value="Home Tutor Support">Home Tutor Support</option>
                    <option value="General Consultation">General Consultation</option>
                    <option value="Inclusive Education Program">Inclusive Education Program</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    Child's Display Name <span className="text-brand-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={childFirstName}
                    onChange={(e) => setChildFirstName(e.target.value)}
                    placeholder="e.g. Aarav"
                    className="w-full p-3 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    Registration ID <span className="text-brand-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    placeholder="e.g. SB-2026-XXXX"
                    className="w-full p-3 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                  />
                </div>
              </div>

              {/* 4. Written Review */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-brand-dark">
                    Your Review / Experience <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${
                    reviewText.length > 1000 ? 'text-rose-600' : 'text-brand-muted'
                  }`}>
                    {reviewText.length}/1000 chars
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  minLength={10}
                  maxLength={1000}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about your experience with The Shadow Bridge — how our team assisted your child, candidate quality, communication, or overall impact..."
                  className="w-full p-3.5 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium leading-relaxed"
                />
              </div>

              {/* 5. Consent Checkbox */}
              <div className="bg-brand-light/30 p-4 rounded-2xl border border-brand-border/60">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consentPublic}
                    onChange={(e) => setConsentPublic(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-primary rounded border-brand-border focus:ring-primary"
                  />
                  <span className="text-xs text-brand-dark leading-relaxed font-medium">
                    I agree that this review may be displayed publicly on The Shadow Bridge website after review and approval by administration. <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Review...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Review for Moderation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
