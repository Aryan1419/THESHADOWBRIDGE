import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shadow Teacher Registration — Apply Now',
  description: 'Register as a Shadow Teacher with The Shadow Bridge. Join our network of trained educators supporting children with special needs in schools.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/register/shadow-teacher',
  },
};

export default function ShadowTeacherRegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
