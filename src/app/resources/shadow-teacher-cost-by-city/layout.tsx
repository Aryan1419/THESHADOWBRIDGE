import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Shadow Teacher Cost by City in India',
  description: 'Transparent guide to Shadow Teacher, Home Tutor, and Therapy fees across Delhi NCR, Mumbai, Bangalore, Hyderabad, Ahmedabad, and Pune.',
  path: '/resources/shadow-teacher-cost-by-city',
  type: 'article',
});

export default function ShadowTeacherCostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
