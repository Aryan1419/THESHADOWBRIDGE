import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Shadow Teacher Application Form',
  description: 'Apply to join The Shadow Bridge verified Shadow Teacher network across Delhi NCR, Mumbai, Bangalore, Hyderabad, Ahmedabad, and Pune.',
  path: '/register/shadow-teacher',
});

export default function RegisterShadowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
