import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Education Shadow Teachers | Apply & Find Placement in Delhi NCR, Hyderabad, Bangalore, Ahmedabad, Pune',
  description: 'Join India\'s leading network of trained Shadow Teachers. Get placed in inclusive schools across Delhi NCR, Hyderabad, Bangalore, Ahmedabad & Pune.',
  keywords: ['shadow teacher jobs', 'special education jobs', 'inclusive teacher vacancy', 'shadow teacher registration', 'autism shadow educator', 'Delhi NCR', 'Hyderabad', 'Bangalore', 'Ahmedabad', 'Pune'],
  alternates: {
    canonical: 'https://theshadowbridge.com/shadow-teachers',
  },
  openGraph: {
    title: 'Shadow Teacher Careers & Placement | The Shadow Bridge',
    description: 'Empowering special educators with professional placement, mentorship, and career growth in top inclusive schools.',
    url: 'https://theshadowbridge.com/shadow-teachers',
  },
};

export default function ShadowTeachersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
