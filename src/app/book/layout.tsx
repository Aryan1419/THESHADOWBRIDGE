import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book 1-on-1 Consultation (₹99) | Founder & Lead Mentor Pratibha Mishra',
  description: 'Book a ₹99 diagnostic consultation session with Founder & Lead Mentor Pratibha Mishra. Get personalized guidance for Shadow Teacher and Home Tutor support.',
  keywords: ['book consultation', 'Pratibha Mishra consultation', 'special education assessment', 'shadow teacher consultation', 'child assessment ₹99'],
  alternates: {
    canonical: 'https://www.theshadowbridge.com/book',
  },
  openGraph: {
    title: 'Book 1-on-1 Consultation Session | The Shadow Bridge',
    description: 'Schedule a direct assessment consultation with Founder Pratibha Mishra to discuss your child\'s unique learning needs.',
    url: 'https://www.theshadowbridge.com/book',
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
