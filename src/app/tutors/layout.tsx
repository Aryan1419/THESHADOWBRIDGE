import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Special Needs Home Tutors India',
  description: 'Inclusive 1-on-1 Special Education Home Tutors for Dyslexia, ADHD, and remedial academics in Delhi NCR, Mumbai, Bangalore, Hyderabad, Ahmedabad & Pune.',
  path: '/tutors',
});

export default function TutorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
