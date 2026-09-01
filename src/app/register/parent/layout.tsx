import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parent Registration — Book Consultation',
  description: 'Register as a parent at The Shadow Bridge. Book a ₹99 consultation to discuss your child\'s Shadow Teacher, Home Tutor, or Therapy needs.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/register/parent',
  },
};

export default function ParentRegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
