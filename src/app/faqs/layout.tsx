import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs) | Shadow Teacher & Home Tutor Guide',
  description: 'Answers to common questions about Shadow Teacher hiring, school permissions, fees, candidate qualifications, and special education tutoring.',
  keywords: ['shadow teacher FAQs', 'how shadow teaching works', 'school permission shadow teacher', 'special needs tutor FAQ'],
  alternates: {
    canonical: 'https://www.theshadowbridge.com/faqs',
  },
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
