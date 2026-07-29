import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Educational Advisory & Support | The Shadow Bridge',
  description: 'Reach out to The Shadow Bridge advisory team. Submit your query or call us for guidance on Shadow Teacher and Special Needs Home Tutor placements.',
  keywords: ['Contact The Shadow Bridge', 'special education helpdesk', 'shadow teacher contact', 'educational advisory India'],
  alternates: {
    canonical: 'https://theshadowbridge.com/contact',
  },
  openGraph: {
    title: 'Contact The Shadow Bridge Advisory Team',
    description: 'Get in touch for questions, partnership inquiries, or guidance on educator matching.',
    url: 'https://theshadowbridge.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
