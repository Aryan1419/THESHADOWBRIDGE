'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, MessageSquare, Heart, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Review {
  id: number;
  text: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  avatar: string;
  outcome: string;
}

const allReviews: Review[] = [
  {
    id: 1,
    text: "The Shadow Bridge found a wonderful shadow teacher for my son who has autism. She helped him transition into school smoothly and build peer relationships. I can't thank Pratibha Mishra and the team enough.",
    name: "Rashmi Nair",
    role: "Mother of 7-year-old",
    city: "Ahmedabad",
    rating: 5,
    avatar: "👩‍👦",
    outcome: "Improved classroom integration and attention span."
  },
  {
    id: 2,
    text: "Unmatched professionalism. The home tutor they recommended for my daughter has specialized training in teaching students with dyslexia. Her grades and reading have improved significantly.",
    name: "Amit Mehta",
    role: "Father of 9-year-old",
    city: "Ahmedabad",
    rating: 5,
    avatar: "👨&zwj;👧",
    outcome: "Reading comprehension went from grade-level delay to normal pacing."
  },
  {
    id: 3,
    text: "Our experience with The Shadow Bridge has been life-changing. My child is now more independent, participates in classroom activities, and looks forward to going to school.",
    name: "Priya Reddy",
    role: "Mother of 6-year-old",
    city: "Hyderabad",
    rating: 5,
    avatar: "👩&zwj;👧",
    outcome: "90% reduction in behavior tantrums at school."
  },
  {
    id: 4,
    text: "The founder, Pratibha Mishra, guided us personally through the initial consultation. The child-centered support plan was exactly what we needed. Highly recommend their services.",
    name: "Sonal Shah",
    role: "Mother of 8-year-old",
    city: "Ahmedabad",
    rating: 5,
    avatar: "👩‍👦",
    outcome: "Structured behavioral support plan implemented in partnership with the school."
  },
  {
    id: 5,
    text: "Professional, compassionate, and highly cooperative. The daily progress tracking and continuous mentoring provided by the organization give us complete peace of mind.",
    name: "Rajesh Goel",
    role: "Father of 10-year-old",
    city: "Hyderabad",
    rating: 5,
    avatar: "👨‍👦",
    outcome: "Consistent academic progress and better coping strategies for sensory overload."
  },
  {
    id: 6,
    text: "We are extremely grateful for the support. The shadow teacher was patient, kind, and integrated perfectly with the school staff. The transition was seamless.",
    name: "Kavitha Iyer",
    role: "Mother of 5-year-old",
    city: "Hyderabad",
    rating: 5,
    avatar: "👩&zwj;👧",
    outcome: "Successful entry into prep class with active communication logs."
  },
  {
    id: 7,
    text: "Finding a shadow teacher who understands sensory issues was a challenge until we contacted The Shadow Bridge. The teacher they matched is a trained psychologist and works brilliantly.",
    name: "Nikhil Gupta",
    role: "Father of 6-year-old",
    city: "Ahmedabad",
    rating: 5,
    avatar: "👨‍👦",
    outcome: "Classroom sensory breaks managed without disrupting lessons."
  },
  {
    id: 8,
    text: "The home tutoring sessions are incredibly engaging. My son has learning gaps due to ADHD. The tutor uses play-based learning and interactive visual aids that keep him focused.",
    name: "Sunita Vyas",
    role: "Mother of 8-year-old",
    city: "Ahmedabad",
    rating: 5,
    avatar: "👩‍👦",
    outcome: "Boosted self-esteem and math concepts recall."
  }
];

export default function Testimonials() {
  const [selectedCity, setSelectedCity] = useState('All');

  const filteredReviews = selectedCity === 'All' 
    ? allReviews 
    : allReviews.filter(r => r.city === selectedCity);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#F8F5FB] to-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>Parent Stories</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-primary mb-4">
            Real Stories. Real Impact.
          </h1>
          <p className="text-brand-muted text-base sm:text-lg max-w-2xl mx-auto">
            Read comprehensive feedback and testimonials from parents in Ahmedabad and Hyderabad about their child's developmental breakthroughs.
          </p>
        </div>
      </section>

      {/* Reviews directory */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {['All', 'Ahmedabad', 'Hyderabad'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all border ${
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
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-light/20 p-8 rounded-2xl border border-brand-border flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-accent px-2.5 py-1 bg-white border border-brand-border rounded-full flex items-center gap-1">
                      <MapPin size={12} />
                      {review.city}
                    </span>
                  </div>
                  <p className="text-brand-muted text-sm sm:text-base italic leading-relaxed mb-6">
                    "{review.text}"
                  </p>
                </div>

                <div className="border-t border-brand-border/60 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl border border-brand-border">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary text-base">{review.name}</h4>
                      <p className="text-xs text-brand-muted">{review.role}</p>
                    </div>
                  </div>
                  
                  {/* Outcome Tag */}
                  <div className="p-3 bg-white/70 border border-brand-border/40 rounded-lg flex items-start gap-2">
                    <Heart size={14} className="text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-primary leading-tight">
                      Outcome: <span className="font-medium text-brand-muted">{review.outcome}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <p className="text-center text-brand-muted py-12">No reviews available in this location.</p>
          )}

        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-[#F8F5FB] border-t border-brand-border text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <h2 className="font-serif text-3xl font-extrabold text-primary">Join Our Circle of Support</h2>
          <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto">
            Book a private evaluation consultation with our Lead Mentor to construct a customized development strategy for your child.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="btn-gradient px-8 py-3.5 rounded-full font-bold shadow hover:scale-105 transition-all inline-block"
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
