import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Book 1-on-1 Consultation (₹99)',
  description: 'Book a ₹99 diagnostic consultation with Founder Pratibha Mishra for personalized Shadow Teacher, Home Tutor, or Therapy guidance across India.',
  path: '/book',
});

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
