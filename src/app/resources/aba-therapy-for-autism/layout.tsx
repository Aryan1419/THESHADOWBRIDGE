import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What is ABA Therapy, and How Does It Help Children with Autism? | The Shadow Bridge',
  description: 'A clinical and practical guide to Applied Behavior Analysis (ABA) for children with Autism Spectrum Disorder in India.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/aba-therapy-for-autism',
  },
  openGraph: {
    title: 'What is ABA Therapy, and How Does It Help Children with Autism?',
    description: 'Learn how evidence-based ABA therapy breaks down learning into manageable steps, improves functional communication, and reinforces positive behavior.',
    url: 'https://www.theshadowbridge.com/resources/aba-therapy-for-autism',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
