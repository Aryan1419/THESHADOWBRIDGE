import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'For Parents — Shadow Teachers',
  description: 'Find verified Shadow Teachers and Special Education Home Tutors for Autism, ADHD, and learning disabilities across 6 major Indian metros.',
  path: '/parents',
});

export default function ParentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
