import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy & Data Protection',
  description: 'Read The Shadow Bridge Privacy Policy detailing how we protect parent records, child IEP details, and educator verification data.',
  path: '/privacy',
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
