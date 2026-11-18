import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Online Parent Training Explained',
  description: 'Discover how live 1-on-1 Online Parent Training across India empowers parents with ABA routines, meltdown strategies, and positive behavior tools.',
  path: '/resources/online-parent-training-explained',
  type: 'article',
});

export default function OnlineParentTrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
