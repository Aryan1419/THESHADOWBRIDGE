import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'FAQs — Shadow Teachers & Tutors',
  description: 'Find answers on Shadow Teacher placement fees, educator vetting, school permissions, home tutoring, and therapy support across 6 Indian cities.',
  path: '/faqs',
});

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
