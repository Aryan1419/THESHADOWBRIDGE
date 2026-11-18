import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'School Shadow Teacher Program',
  description: 'Partner with The Shadow Bridge to deploy trained, verified Shadow Teachers in K-12 classrooms across India. Book a ₹199 school scoping consultation.',
  path: '/schools',
});

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
