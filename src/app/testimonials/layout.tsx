import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parent & Educator Testimonials | Reviews & Stories | The Shadow Bridge',
  description: 'Read verified reviews and success stories from parents and educators who have transformed learning journeys with The Shadow Bridge.',
  keywords: ['parent reviews shadow teacher', 'special education testimonials', 'shadow bridge reviews'],
  alternates: {
    canonical: 'https://theshadowbridge.com/testimonials',
  },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
