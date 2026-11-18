import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Shadow Teacher Support & Careers',
  description: 'Trained, background-verified Shadow Teachers for ASD, ADHD, and Down Syndrome in Delhi NCR, Mumbai, Bangalore, Hyderabad, Ahmedabad & Pune.',
  path: '/shadow-teachers',
});

export default function ShadowTeachersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
