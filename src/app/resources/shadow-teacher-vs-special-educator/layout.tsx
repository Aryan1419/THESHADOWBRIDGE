import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Shadow Teacher vs. Special Educator',
  description: 'Understand the key differences between a classroom Shadow Teacher and a Special Educator in India, their qualifications, roles, and which fits your child.',
  path: '/resources/shadow-teacher-vs-special-educator',
  type: 'article',
});

export default function ShadowVsSpecialEdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
