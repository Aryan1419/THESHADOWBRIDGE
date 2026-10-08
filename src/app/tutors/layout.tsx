import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Needs Home Tutors | Delhi NCR, Mumbai, Hyderabad, Bangalore, Pune',
  description: 'Join The Shadow Bridge as a Special Needs Home Tutor. Verified student placements across Delhi NCR, Mumbai, Hyderabad, Bangalore & Pune.',
  keywords: ['home tutor jobs', 'special needs home tutor', 'academic tutor vacancy', 'private tutor registration', 'Delhi NCR home tutor', 'Mumbai home tutor', 'Hyderabad home tutor', 'Bangalore tutor', 'Ahmedabad tutor', 'Pune tutor'],
  alternates: {
    canonical: 'https://www.theshadowbridge.com/tutors',
  },
  openGraph: {
    title: 'Home Tutor Careers & Matching | The Shadow Bridge',
    description: 'Connect with families seeking dedicated home tutors for academic and special education assistance.',
    url: 'https://www.theshadowbridge.com/tutors',
  },
};

export default function TutorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
