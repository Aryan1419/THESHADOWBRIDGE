import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Educator Vetting & Qualifications',
  description: 'See how The Shadow Bridge screens Shadow Teachers and Home Tutors through ID verification, RCI and special education checks, and panel interviews.',
  path: '/resources/professional-vetting-process',
  type: 'article',
});

export default function ProfessionalVettingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
