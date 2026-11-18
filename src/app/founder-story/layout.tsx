import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Why I Started — Pratibha Mishra',
  description: 'The personal journey of Founder Pratibha Mishra building The Shadow Bridge to support neurodivergent children with trained Shadow Teachers and Tutors.',
  path: '/founder-story',
  image: {
    url: '/images/founder_pratibha.jpg',
    width: 800,
    height: 800,
    alt: 'Pratibha Mishra — Founder of The Shadow Bridge',
  },
});

export default function FounderStoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
