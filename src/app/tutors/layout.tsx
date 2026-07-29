import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Needs Home Tutors | Academic & Behavioral Tutoring in Delhi NCR, Hyderabad, Bangalore, Ahmedabad, Pune',
  description: 'Apply as a Home Tutor for academic subjects and special needs support. Verified home tutoring placements in Delhi NCR, Hyderabad, Bangalore, Ahmedabad & Pune.',
  keywords: ['home tutor jobs', 'special needs home tutor', 'academic tutor vacancy', 'private tutor registration', 'Delhi NCR home tutor', 'Hyderabad home tutor', 'Bangalore tutor', 'Ahmedabad tutor', 'Pune tutor'],
  alternates: {
    canonical: 'https://theshadowbridge.com/tutors',
  },
  openGraph: {
    title: 'Home Tutor Careers & Matching | The Shadow Bridge',
    description: 'Connect with families seeking dedicated home tutors for academic and special education assistance.',
    url: 'https://theshadowbridge.com/tutors',
  },
};

export default function TutorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
