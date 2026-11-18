import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact Us & Parent Support',
  description: 'Reach The Shadow Bridge for inquiries on Shadow Teachers, Special Education Tutors, Therapy Programs, or School Collaborations. Response within 24 hours.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
