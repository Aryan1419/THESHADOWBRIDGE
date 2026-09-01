import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Parents | Find Verified Shadow Teachers & Special Education Tutors',
  description: 'Empowering parents to find background-verified, clinical-trained Shadow Teachers and Home Tutors for children with special needs across Delhi NCR, Hyderabad, Bangalore, Ahmedabad & Pune.',
  keywords: ['hire shadow teacher', 'special needs tutor for child', 'autism support for parents', 'ADHD school mentor', 'inclusive education parent guide', 'Delhi NCR', 'Hyderabad', 'Bangalore', 'Ahmedabad', 'Pune'],
  alternates: {
    canonical: 'https://www.theshadowbridge.com/parents',
  },
  openGraph: {
    title: 'Parent Guide & Educator Matchmaking | The Shadow Bridge',
    description: 'Trusted support for your child\'s learning and development with personalized shadow teachers and tutors.',
    url: 'https://www.theshadowbridge.com/parents',
  },
};

export default function ParentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
