import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Parent & Educator Testimonials',
  description: 'Read verified reviews from parents and educators across India on Shadow Teacher placements, home tutoring progress, and founder mentorship.',
  path: '/testimonials',
});

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
