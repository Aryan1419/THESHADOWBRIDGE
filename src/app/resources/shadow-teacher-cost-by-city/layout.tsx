import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Much Does a Shadow Teacher Cost in Delhi NCR, Hyderabad, Bangalore, Ahmedabad, and Pune? | The Shadow Bridge',
  description: 'Understand the exact consultation and placement-based fee structure for Shadow Teachers across Delhi NCR, Hyderabad, Bangalore, Ahmedabad, and Pune.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources/shadow-teacher-cost-by-city',
  },
  openGraph: {
    title: 'How Much Does a Shadow Teacher Cost in Delhi NCR, Hyderabad, Bangalore, Ahmedabad, and Pune?',
    description: 'A complete breakdown of shadow teacher fees, explaining the placement-based structure vs hourly tutoring.',
    url: 'https://www.theshadowbridge.com/resources/shadow-teacher-cost-by-city',
    type: 'article',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
