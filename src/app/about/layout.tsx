import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About Us & Founder Pratibha Mishra',
  description: 'Learn about The Shadow Bridge, led by Founder Pratibha Mishra (11+ years experience), connecting families with verified Shadow Teachers and Tutors across India.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
