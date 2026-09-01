import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check Application & Registration Status | The Shadow Bridge',
  description: 'Check real-time progress for your consultation, child registration, or educator application using your Registration ID.',
  keywords: ['check status', 'shadow teacher status check', 'registration tracker'],
  alternates: {
    canonical: 'https://www.theshadowbridge.com/check-status',
  },
};

export default function CheckStatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
