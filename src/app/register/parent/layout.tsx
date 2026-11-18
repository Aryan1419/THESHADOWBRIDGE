import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Register as Parent — Consultation',
  description: 'Start Step 1 of parent registration with a ₹99 assessment consultation to match your child with a verified Shadow Teacher, Home Tutor, or Therapist.',
  path: '/register/parent',
});

export default function RegisterParentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
