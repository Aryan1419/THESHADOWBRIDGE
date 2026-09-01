import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School Collaboration — Shadow Teacher Program',
  description: 'Partner with The Shadow Bridge for Shadow Teacher placements in your school. Inclusive education support program for students with special needs.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/schools',
  },
};

export default function CollaborationSchoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
