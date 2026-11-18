import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'How Our 5-Step Matching Works',
  description: 'Step-by-step walkthrough of how The Shadow Bridge assesses your child, shortlists vetted educators, and supervises Shadow Teacher placements.',
  path: '/resources/how-matching-works',
  type: 'article',
});

export default function HowMatchingWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
