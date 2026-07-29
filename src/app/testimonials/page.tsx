'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MessageSquare, Heart, MapPin, Sparkles, ChevronRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Review {
  id: string;
  parent_name: string;
  child_first_name?: string;
  rating: number;
  review_text: string;
  city: string;
  service_type: 'Shadow Teacher' | 'Home Tutor';
  status: 'approved';
  submitted_at: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews || []);
        }
      })
      .catch((err) => console.error('Failed to fetch reviews:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews = selectedCity === 'All' 
    ? reviews 
    : reviews.filter(r => r.city === selectedCity);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 bg-brand-light border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>Parent Stories</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-primary mb-4">
            Real Stories. Real Impact.
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto font-medium mb-6">
            Read comprehensive feedback and testimonials from parents about their child's developmental breakthroughs.
          </p>

          <div className="pt-2">
            <Link
              href="/leave-review"
              className="btn-gradient px-6 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Quote size={16} />
              <span>Leave a Review / Share Your Experience →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews directory */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            /* Invite empty state placeholder */
            <div className="bg-brand-light border border-brand-border rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm my-6 space-y-6 animate-fade-in-up">
              <div className="w-16 h-16 bg-accent/15 text-primary rounded-full flex items-center justify-center mx-auto">
                <Quote size={28} className="text-primary fill-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-primary">Be Among Our First Reviews</h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-sm mx-auto font-medium">
                  We'd love to hear about your experience with The Shadow Bridge. Submit your honest review for administration approval.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/leave-review"
                  className="btn-gradient px-6 py-3 rounded-full font-bold text-xs inline-flex items-center gap-2 shadow hover:scale-105 transition-all cursor-pointer"
                >
                  <Quote size={14} />
                  <span>Share Your Experience &amp; Leave a Review →</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex justify-center gap-3 mb-12 flex-wrap">
                {['All', 'Delhi NCR', 'Ahmedabad', 'Hyderabad', 'Bangalore', 'Pune'].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all border cursor-pointer ${
                      selectedCity === city
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-brand-dark border-brand-border hover:bg-brand-light'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredReviews.map((review) => {
                  const isShadowTeacher = review.service_type === 'Shadow Teacher';
                  return (
                    <motion.div
                      key={review.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-brand-light/20 p-8 rounded-2xl border border-brand-border flex flex-col justify-between hover:shadow-md transition-shadow text-left"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-1 text-amber-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={16} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-accent px-2.5 py-1 bg-white border border-brand-border rounded-full flex items-center gap-1 select-none">
                            <MapPin size={12} />
                            {review.city}
                          </span>
                        </div>
                        <p className="text-brand-muted text-sm sm:text-base italic leading-relaxed mb-6 font-sans">
                          "{review.review_text}"
                        </p>
                      </div>

                      <div className="border-t border-brand-border/60 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl border border-brand-border select-none">
                            {isShadowTeacher ? '👩‍👦' : '👨‍👧'}
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-primary text-base">
                              {review.parent_name}
                              {review.child_first_name && <span className="text-[11px] font-normal text-brand-muted block font-sans">Parent of {review.child_first_name}</span>}
                            </h4>
                            <p className="text-xs text-brand-muted font-sans font-medium">{review.service_type}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredReviews.length === 0 && (
                <p className="text-center text-brand-muted py-12 font-medium">No reviews available in this location.</p>
              )}
            </>
          )}

        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-brand-light border-t border-brand-border text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-primary">Join Our Circle of Support</h2>
          <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto font-medium">
            Book a private evaluation consultation with our Lead Mentor to construct a customized development strategy for your child.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="btn-gradient px-8 py-3.5 rounded-full font-bold shadow hover:scale-105 transition-all inline-block cursor-pointer"
            >
              Book Consultation – ₹99
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
