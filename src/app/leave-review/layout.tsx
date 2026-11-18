import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Leave a Parent Review',
  description: 'Share your family experience with The Shadow Bridge Shadow Teachers, Home Tutors, and Therapists to help other parents find trusted support.',
  path: '/leave-review',
});

export default function LeaveReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
