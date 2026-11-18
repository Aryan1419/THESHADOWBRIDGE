import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Home Tutor Application Form',
  description: 'Register as a Special Education or Remedial Home Tutor with The Shadow Bridge across Delhi NCR, Mumbai, Bangalore, Hyderabad, Ahmedabad, and Pune.',
  path: '/register/tutor',
});

export default function RegisterTutorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
