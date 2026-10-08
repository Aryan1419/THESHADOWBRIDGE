import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shadow Teacher Cost in Delhi NCR, Mumbai, Bangalore, Hyderabad & Pune | The Shadow Bridge',
  description: 'Understand the exact consultation and placement-based fee structure for Shadow Teachers across Delhi NCR, Mumbai, Hyderabad, Bangalore, Ahmedabad & Pune.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/shadow-teacher-cost-by-city',
  },
  openGraph: {
    title: 'How Much Does a Shadow Teacher Cost in Delhi NCR, Mumbai, Bangalore, Hyderabad & Pune?',
    description: 'A complete breakdown of shadow teacher fees, explaining the placement-based structure vs hourly tutoring across Delhi NCR, Mumbai, Bangalore & Pune.',
    url: 'https://www.theshadowbridge.com/resources/shadow-teacher-cost-by-city',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
