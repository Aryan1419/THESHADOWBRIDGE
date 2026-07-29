import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Shadow Bridge',
  description: 'Privacy Policy for The Shadow Bridge detailing data protection, child record confidentiality, and information handling practices.',
  alternates: {
    canonical: 'https://theshadowbridge.com/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
