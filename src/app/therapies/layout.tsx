import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Child Therapy Programs India',
  description: 'Book 1-on-1 ABA Online Therapy & Parent Training PAN-India, plus in-home Speech, Occupational, Special Ed & Behavior Therapy in Delhi NCR.',
  path: '/therapies',
});

export default function TherapiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
