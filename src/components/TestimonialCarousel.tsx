'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "The Shadow Bridge found a wonderful shadow teacher for my son who has autism. She helped him transition into school smoothly and build peer relationships.",
    name: "Rashmi Nair",
    role: "Mother of 7-year-old",
    city: "Ahmedabad",
    rating: 5,
    avatar: "👩‍👦"
  },
  {
    id: 2,
    text: "Unmatched professionalism. The home tutor they recommended for my daughter has specialized training in teaching students with dyslexia. Her grades and reading have improved significantly.",
    name: "Amit Mehta",
    role: "Father of 9-year-old",
    city: "Ahmedabad",
    rating: 5,
    avatar: "👨‍👧"
  },
  {
    id: 3,
    text: "Our experience with The Shadow Bridge has been life-changing. My child is now more independent, participates in classroom activities, and looks forward to going to school.",
    name: "Priya Reddy",
    role: "Mother of 6-year-old",
    city: "Hyderabad",
    rating: 5,
    avatar: "👩‍👧"
  },
  {
    id: 4,
    text: "The founder, Pratibha Mishra, guided us personally through the initial consultation. The child-centered support plan was exactly what we needed. Highly recommend their services.",
    name: "Sonal Shah",
    role: "Mother of 8-year-old",
    city: "Ahmedabad",
    rating: 5,
    avatar: "👩‍👦"
  },
  {
    id: 5,
    text: "Professional, compassionate, and highly cooperative. The daily progress tracking and continuous mentoring provided by the organization give us complete peace of mind.",
    name: "Rajesh Goel",
    role: "Father of 10-year-old",
    city: "Hyderabad",
    rating: 5,
    avatar: "👨‍👦"
  },
  {
    id: 6,
    text: "We are extremely grateful for the support. The shadow teacher was patient, kind, and integrated perfectly with the school staff. The transition was seamless.",
    name: "Kavitha Iyer",
    role: "Mother of 5-year-old",
    city: "Hyderabad",
    rating: 5,
    avatar: "👩‍👧"
  }
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextSlide = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

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
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(testimonials[(index + i) % testimonials.length]);
    }
    return items;
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      {/* Desktop view (3 columns) */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
        {getVisibleTestimonials().map((t, idx) => (
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
              <p className="text-brand-muted text-sm italic leading-relaxed mb-6 relative z-10">
                "{t.text}"
              </p>
            </div>
            
            <div className="flex items-center gap-3 border-t border-brand-border/60 pt-4 mt-auto">
              <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-2xl border border-brand-border shadow-inner">
                {t.avatar}
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary text-base">{t.name}</h4>
                <p className="text-[12px] text-brand-muted">{t.role} • <span className="font-semibold text-accent">{t.city}</span></p>
              </div>
            </div>
          </motion.div>
        ))}
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
              <p className="text-brand-muted text-sm italic leading-relaxed mb-6">
                "{testimonials[index].text}"
              </p>
            </div>
            
            <div className="flex items-center gap-3 border-t border-brand-border/60 pt-4 mt-auto">
              <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-2xl border border-brand-border">
                {testimonials[index].avatar}
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary text-base">{testimonials[index].name}</h4>
                <p className="text-[12px] text-brand-muted">
                  {testimonials[index].role} • <span className="font-semibold text-accent">{testimonials[index].city}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={prevSlide}
          className="p-2.5 rounded-full border border-brand-border bg-white text-primary hover:bg-brand-light hover:scale-105 active:scale-95 transition-all shadow-sm"
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
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === index ? 'bg-primary w-6' : 'bg-brand-border'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2.5 rounded-full border border-brand-border bg-white text-primary hover:bg-brand-light hover:scale-105 active:scale-95 transition-all shadow-sm"
          aria-label="Next review"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
