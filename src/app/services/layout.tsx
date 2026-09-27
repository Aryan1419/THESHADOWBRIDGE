import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Inclusive Education Support | Delhi NCR, Hyderabad, Bangalore, Ahmedabad, Pune',
  description: 'Special education services: 1-on-1 Shadow Teacher placements, Special Needs Home Tutors, and Therapy support across 5 major cities in India.',
  keywords: ['shadow teacher services', 'special needs home tutor', 'inclusive education support', 'IEP guidance', 'autism shadow teacher', 'ADHD home tutor', 'Delhi NCR', 'Hyderabad', 'Bangalore', 'Ahmedabad', 'Pune'],
  alternates: {
    canonical: 'https://www.theshadowbridge.com/services',
  },
  openGraph: {
    title: 'Services & Support Programs | The Shadow Bridge',
    description: 'Empowering children with specialized Shadow Teachers and Academic Home Tutors. Serving Delhi NCR, Hyderabad, Bangalore, Ahmedabad & Pune.',
    url: 'https://www.theshadowbridge.com/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
