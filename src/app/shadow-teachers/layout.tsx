import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Education Shadow Teachers | Delhi NCR, Mumbai, Hyderabad, Bangalore, Pune',
  description: 'Join India\'s leading network of trained Shadow Teachers. Get placed in inclusive schools across Delhi NCR, Mumbai, Hyderabad, Bangalore & Pune.',
  keywords: ['shadow teacher jobs', 'special education jobs', 'inclusive teacher vacancy', 'shadow teacher registration', 'autism shadow educator', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Bangalore', 'Ahmedabad', 'Pune'],
  alternates: {
    canonical: 'https://www.theshadowbridge.com/shadow-teachers',
  },
  openGraph: {
    title: 'Shadow Teacher Careers & Placement | The Shadow Bridge',
    description: 'Empowering special educators with professional placement, mentorship, and career growth in top inclusive schools.',
    url: 'https://www.theshadowbridge.com/shadow-teachers',
  },
};

export default function ShadowTeachersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
