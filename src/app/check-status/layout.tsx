import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Check Application Status',
  description: 'Track your parent consultation, child registration, school collaboration, or educator application status in real time using your Registration ID.',
  path: '/check-status',
});

export default function CheckStatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
