import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Therapy Sessions — Delhi NCR',
  description: 'Expert home therapy sessions in Delhi NCR — ABA Therapy, Speech Therapy, Occupational Therapy, and more. Book a ₹99 consultation today.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/therapies',
  },
};

export default function TherapiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
