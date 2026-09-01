import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leave a Review',
  description: 'Share your experience with The Shadow Bridge. Leave a review about our Shadow Teachers, Home Tutors, or Therapy services.',
  alternates: {
    canonical: 'https://www.theshadowbridge.com/leave-review',
  },
};

export default function LeaveReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
