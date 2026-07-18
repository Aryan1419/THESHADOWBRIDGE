'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ChevronRight as ArrowIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Review {
  id: string;
  parent_name: string;
  child_first_name?: string;
  rating: number;
  review_text: string;
  city: string;
  service_type: 'Shadow Teacher' | 'Home Tutor';
  status: 'approved';
}

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setTestimonials(data.reviews || []);
        }
      })
      .catch((err) => console.error('Failed to fetch testimonials:', err))
      .finally(() => setLoading(false));
  }, []);

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [testimonials]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0
    })
  };

  // Get current slide and next slide for showing in a grid on larger screens
  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const items = [];
    const count = Math.min(3, testimonials.length);
    for (let i = 0; i < count; i++) {
      items.push(testimonials[(index + i) % testimonials.length]);
    }
    return items;
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Loading reviews...</p>
      </div>
    );
  }

  // Placeholder empty state
  if (testimonials.length === 0) {
    return (
      <div className="bg-brand-light border border-brand-border rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm my-6 space-y-6 animate-fade-in-up">
        <div className="w-16 h-16 bg-accent/15 text-primary rounded-full flex items-center justify-center mx-auto">
          <Quote size={28} className="text-primary fill-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-bold text-primary">Be Among Our First Reviews</h3>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-sm mx-auto font-medium">
            We're just getting started — if The Shadow Bridge has supported your family, we'd love to hear about your experience.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-primary text-white hover:bg-secondary font-bold text-xs rounded-full transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <span>Share Your Experience</span>
            <ArrowIcon size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      {/* Desktop view (up to 3 columns) */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
        {getVisibleTestimonials().map((t, idx) => {
          const isShadowTeacher = t.service_type === 'Shadow Teacher';
          return (
            <motion.div
              key={`${t.id}-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                <div className="absolute top-4 right-6 text-brand-light font-serif text-8xl leading-none pointer-events-none select-none">
                  ”
                </div>
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-brand-muted text-sm italic leading-relaxed mb-6 relative z-10 font-sans">
                  "{t.review_text}"
                </p>
              </div>
              
              <div className="flex items-center gap-3 border-t border-brand-border/60 pt-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-xl border border-brand-border shadow-inner select-none">
                  {isShadowTeacher ? '👩‍👦' : '👨‍👧'}
                </div>
                <div className="text-left">
                  <h4 className="font-serif font-bold text-primary text-base">
                    {t.parent_name}
                    {t.child_first_name && <span className="text-[11px] font-normal text-brand-muted block font-sans">Parent of {t.child_first_name}</span>}
                  </h4>
                  <p className="text-[12px] text-brand-muted font-sans font-medium">
                    {t.service_type} &bull; <span className="font-semibold text-accent">{t.city}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile / Tablet view (Single Item with Slide Animations) */}
      <div className="lg:hidden relative min-h-[300px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-md max-w-md w-full relative flex flex-col justify-between"
          >
            <div>
              <div className="absolute top-4 right-6 text-brand-light font-serif text-8xl leading-none pointer-events-none select-none">
                ”
              </div>
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(testimonials[index].rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-brand-muted text-sm italic leading-relaxed mb-6 font-sans">
                "{testimonials[index].review_text}"
              </p>
            </div>
            
            <div className="flex items-center gap-3 border-t border-brand-border/60 pt-4 mt-auto">
              <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-xl border border-brand-border">
                {testimonials[index].service_type === 'Shadow Teacher' ? '👩‍👦' : '👨‍👧'}
              </div>
              <div className="text-left">
                <h4 className="font-serif font-bold text-primary text-base">
                  {testimonials[index].parent_name}
                  {testimonials[index].child_first_name && <span className="text-[11px] font-normal text-brand-muted block font-sans">Parent of {testimonials[index].child_first_name}</span>}
                </h4>
                <p className="text-[12px] text-brand-muted font-sans font-medium">
                  {testimonials[index].service_type} &bull; <span className="font-semibold text-accent">{testimonials[index].city}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows (only if multiple slides exist) */}
      {testimonials.length > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-full border border-brand-border bg-white text-primary hover:bg-brand-light hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>
          
          {/* Navigation Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === index ? 'bg-primary w-6' : 'bg-brand-border'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2.5 rounded-full border border-brand-border bg-white text-primary hover:bg-brand-light hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
