import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What is a Shadow Teacher, and Does My Child Need One? | The Shadow Bridge',
  description: 'Learn what a shadow teacher does in a mainstream classroom, how they assist children with ASD, ADHD, or learning differences, and when to consider one.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/what-is-a-shadow-teacher',
  },
  openGraph: {
    title: 'What is a Shadow Teacher, and Does My Child Need One?',
    description: 'A comprehensive guide on the role of a Shadow Teacher in inclusive classrooms, fostering independence and managing sensory overwhelm.',
    url: 'https://www.theshadowbridge.com/resources/what-is-a-shadow-teacher',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
