import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Tutor vs. Shadow Teacher — Which Does My Child Need? | The Shadow Bridge',
  description: 'Understand whether your child needs home-based academic tutoring or in-school shadow teaching support.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/home-tutor-vs-shadow-teacher',
  },
  openGraph: {
    title: 'Home Tutor vs. Shadow Teacher — Which Does My Child Need?',
    description: 'A practical guide for parents evaluating between home special needs tutoring and in-classroom shadow support.',
    url: 'https://www.theshadowbridge.com/resources/home-tutor-vs-shadow-teacher',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
