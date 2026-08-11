import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Tutor Registration — Apply Now',
  description: 'Register as a Home Tutor with The Shadow Bridge. Teach and support children across Delhi NCR, Ahmedabad, Hyderabad, Bangalore & Pune.',
  alternates: {
    canonical: 'https://theshadowbridge.com/register/tutor',
  },
};

export default function TutorRegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
