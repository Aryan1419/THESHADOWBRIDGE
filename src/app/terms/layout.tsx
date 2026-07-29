import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | The Shadow Bridge',
  description: 'Terms and Conditions governing the use of The Shadow Bridge platform, services, fees, and educator placement policies.',
  alternates: {
    canonical: 'https://theshadowbridge.com/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
