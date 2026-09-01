import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Founder Pratibha Mishra & Mission | The Shadow Bridge',
  description: 'Learn about The Shadow Bridge, founded by Lead Mentor Pratibha Mishra. Our mission is to transform inclusive education across India with dedicated shadow teachers and special tutors.',
  keywords: ['About The Shadow Bridge', 'Pratibha Mishra special education', 'inclusive education mission', 'shadow teacher platform India'],
  alternates: {
    canonical: 'https://www.theshadowbridge.com/about',
  },
  openGraph: {
    title: 'About Us & Founder Vision | The Shadow Bridge',
    description: 'Pioneering structured shadow teacher training and inclusive educational support across India.',
    url: 'https://www.theshadowbridge.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
