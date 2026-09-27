import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What is Online Parent Training, and Who Is It For? | The Shadow Bridge',
  description: 'Learn how virtual parent training equips families PAN-India with behavioral strategies, meltdown management, and home communication routines.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/online-parent-training-explained',
  },
  openGraph: {
    title: 'What is Online Parent Training, and Who Is It For?',
    description: 'A complete overview of online parent training programs for families supporting children with autism, ADHD, and developmental delays across India.',
    url: 'https://www.theshadowbridge.com/resources/online-parent-training-explained',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
