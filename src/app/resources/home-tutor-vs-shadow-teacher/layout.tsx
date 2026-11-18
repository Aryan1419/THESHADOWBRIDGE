import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Home Tutor vs. Shadow Teacher Guide',
  description: 'Compare after-school Special Education Home Tutoring and in-classroom Shadow Teaching to decide which support model best matches your child in India.',
  path: '/resources/home-tutor-vs-shadow-teacher',
  type: 'article',
});

export default function HomeTutorVsShadowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
