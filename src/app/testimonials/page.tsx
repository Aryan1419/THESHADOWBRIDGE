import React from 'react';
import Link from 'next/link';
import { Sparkles, Quote } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialsClient from '@/components/TestimonialsClient';
import { getApprovedReviews } from '@/lib/reviews';
import { buildBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

export const revalidate = 3600;

export default async function Testimonials() {
  const reviews = await getApprovedReviews();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Testimonials', path: '/testimonials' },
  ]);

  const avgRating =
    reviews.length > 0
      ? Number((reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1))
      : null;

  const reviewSchema =
    reviews.length > 0 && avgRating
      ? {
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating,
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
          review: reviews.slice(0, 10).map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.parent_name },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.rating || 5,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: r.review_text,
            datePublished: r.submitted_at ? r.submitted_at.split('T')[0] : undefined,
          })),
        }
      : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}

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
            Read verified feedback and testimonials from parents across Delhi NCR, Mumbai, Bangalore, Hyderabad, Ahmedabad, and Pune about their child&apos;s developmental breakthroughs with The Shadow Bridge.
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
      <main className="py-20 bg-white flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsClient initialReviews={reviews} />
        </div>
      </main>

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
