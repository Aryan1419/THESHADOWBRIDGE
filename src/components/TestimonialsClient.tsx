'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Quote } from 'lucide-react';
import { CITIES } from '@/lib/constants';
import type { ApprovedReview } from '@/lib/reviews';

export default function TestimonialsClient({ initialReviews }: { initialReviews: ApprovedReview[] }) {
  const [selectedCity, setSelectedCity] = useState('All');

  const filteredReviews =
    selectedCity === 'All'
      ? initialReviews
      : initialReviews.filter((r) => r.city === selectedCity);

  if (initialReviews.length === 0) {
    return (
      <div className="bg-brand-light border border-brand-border rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm my-6 space-y-6">
        <div className="w-16 h-16 bg-accent/15 text-primary rounded-full flex items-center justify-center mx-auto">
          <Quote size={28} className="text-primary fill-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-primary">Be Among Our First Reviews</h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-sm mx-auto font-medium">
            We&apos;d love to hear about your experience with The Shadow Bridge. Submit your honest review for administration approval.
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
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {['All', ...CITIES].map((city) => (
          <button
            key={city}
            type="button"
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
            <article
              key={review.id}
              className="bg-brand-light/20 p-8 rounded-2xl border border-brand-border flex flex-col justify-between hover:shadow-md transition-shadow text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(Math.min(5, Math.max(1, review.rating || 5)))].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-accent px-2.5 py-1 bg-white border border-brand-border rounded-full flex items-center gap-1 select-none">
                    <MapPin size={12} />
                    {review.city}
                  </span>
                </div>
                <p className="text-brand-muted text-sm sm:text-base italic leading-relaxed mb-6 font-sans">
                  &ldquo;{review.review_text}&rdquo;
                </p>
              </div>

              <div className="border-t border-brand-border/60 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl border border-brand-border select-none">
                    {isShadowTeacher ? '👩‍👦' : '👨‍👧'}
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-primary text-base">
                      {review.parent_name}
                      {review.child_first_name && (
                        <span className="text-xs font-normal text-brand-muted block font-sans">
                          Parent of {review.child_first_name}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-brand-muted font-sans font-medium">{review.service_type}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredReviews.length === 0 && (
        <p className="text-center text-brand-muted py-12 font-medium">No reviews available in this location yet.</p>
      )}
    </>
  );
}
