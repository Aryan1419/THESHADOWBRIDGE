import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Education & Child Support Resources | The Shadow Bridge',
  description: 'Comprehensive guides and resources on Shadow Teaching, Special Education Home Tutoring, ABA Therapy, Parent Training, and Child Support across India.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/resources',
  },
  openGraph: {
    title: 'Special Education & Child Support Resources | The Shadow Bridge',
    description: 'Practical guides and clinical insights on Shadow Teachers, Home Tutors, ABA Therapy, and Inclusive Education in India.',
    url: 'https://www.theshadowbridge.com/resources',
    type: 'website',
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
