import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Qualifications Do The Shadow Bridge\'s Professionals Have? | The Shadow Bridge',
  description: 'An honest, transparent explanation of our educator qualification review, experience checks, and manual admin verification workflow.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/professional-vetting-process',
  },
  openGraph: {
    title: 'What Qualifications Do The Shadow Bridge\'s Professionals Have?',
    description: 'A transparent overview of how Shadow Teachers, Tutors, and Therapists are reviewed and approved on The Shadow Bridge.',
    url: 'https://www.theshadowbridge.com/resources/professional-vetting-process',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
