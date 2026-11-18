import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'ABA Therapy for Autism — India Guide',
  description: 'A clinical and practical guide to Applied Behavior Analysis (ABA) therapy for children with Autism Spectrum Disorder in India, in-home and online.',
  path: '/resources/aba-therapy-for-autism',
  type: 'article',
});

export default function AbaTherapyAutismLayout({ children }: { children: React.ReactNode }) {
  return children;
}
