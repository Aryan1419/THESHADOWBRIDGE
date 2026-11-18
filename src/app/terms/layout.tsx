import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Terms & Conditions',
  description: 'Review The Shadow Bridge Terms and Conditions covering consultation fees, one-time placement fees, refund guarantees, and school collaboration policies.',
  path: '/terms',
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
