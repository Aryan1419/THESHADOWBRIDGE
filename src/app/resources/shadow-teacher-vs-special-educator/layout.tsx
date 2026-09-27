import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shadow Teacher vs. Special Educator — What\'s the Difference? | The Shadow Bridge',
  description: 'Understand the distinct differences between a Shadow Teacher (classroom integration) and a Special Educator (individualized academic instruction).',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/shadow-teacher-vs-special-educator',
  },
  openGraph: {
    title: 'Shadow Teacher vs. Special Educator — What\'s the Difference?',
    description: 'A detailed comparative guide between in-classroom Shadow Teaching and clinical/resource room Special Education.',
    url: 'https://www.theshadowbridge.com/resources/shadow-teacher-vs-special-educator',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
