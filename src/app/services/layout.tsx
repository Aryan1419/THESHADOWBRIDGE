import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Special Education Services India',
  description: 'Explore Shadow Teachers, Inclusive Home Tutoring, ABA Online Therapy, Online Parent Training, and Diagnostic Assessments across 6 metros & PAN-India.',
  path: '/services',
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
