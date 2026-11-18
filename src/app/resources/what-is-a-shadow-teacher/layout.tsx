import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'What Is a Shadow Teacher? Parent Guide',
  description: 'Learn what a Shadow Teacher does in mainstream Indian classrooms, how they support children with Autism, ADHD, or learning differences, and when to hire one.',
  path: '/resources/what-is-a-shadow-teacher',
  type: 'article',
});

export default function WhatIsShadowTeacherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
