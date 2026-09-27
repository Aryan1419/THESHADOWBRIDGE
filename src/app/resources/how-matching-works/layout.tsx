import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Does The Shadow Bridge\'s Matching Process Actually Work? | The Shadow Bridge',
  description: 'Learn why The Shadow Bridge uses a consultation-first matching methodology for special educators, shadow teachers, and therapists.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/how-matching-works',
  },
  openGraph: {
    title: 'How Does The Shadow Bridge\'s Matching Process Actually Work?',
    description: 'A step-by-step walkthrough of our consultation-first matching process for shadow teachers and home tutors in India.',
    url: 'https://www.theshadowbridge.com/resources/how-matching-works',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
