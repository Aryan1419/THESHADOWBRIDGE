import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Schools — Shadow Teacher Collaboration Program',
  description: 'Partner with The Shadow Bridge for Shadow Teacher placements in your school. Inclusive education support for students with special needs.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/schools',
  },
};

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
