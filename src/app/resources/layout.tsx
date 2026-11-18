import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Special Education Guides & Resources',
  description: 'Expert guides for Indian parents on Shadow Teachers, city-wise placement costs, ABA therapy, IEP planning, educator vetting, and home tutoring.',
  path: '/resources',
});

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
