import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

const THERAPY_META: Record<string, { title: string; description: string }> = {
  'aba-online-therapy': {
    title: 'ABA Online Therapy (PAN India)',
    description: 'Live 1-on-1 video ABA therapy and behavioral coaching for children with Autism and ADHD across India. Certified analysts and monthly progress reports.',
  },
  'online-parent-training': {
    title: 'Online Parent Training (PAN India)',
    description: 'Live 1-on-1 virtual parent coaching across India teaching practical ABA routines, visual schedules, meltdown de-escalation, and home support skills.',
  },
  'aba-therapy': {
    title: 'In-Home ABA Therapy (Delhi NCR)',
    description: 'Certified Applied Behavior Analysis (ABA) home therapy in Delhi NCR for Autism, ADHD, communication, social skills, and positive behavior growth.',
  },
  'speech-therapy': {
    title: 'In-Home Speech Therapy (Delhi NCR)',
    description: 'Personalized in-home Speech & Language Therapy in Delhi NCR for speech delays, articulation, fluency, stuttering, and functional communication.',
  },
  'occupational-therapy': {
    title: 'Occupational Therapy (Delhi NCR)',
    description: 'In-home Pediatric Occupational Therapy in Delhi NCR improving sensory integration, fine & gross motor skills, handwriting, and daily independence.',
  },
  'special-education': {
    title: 'Special Education Support (Delhi NCR)',
    description: 'Individualized Special Education home tutoring in Delhi NCR for Dyslexia, Dysgraphia, Dyscalculia, IEP implementation, and remedial learning.',
  },
  'behavior-therapy': {
    title: 'Child Behavior Therapy (Delhi NCR)',
    description: 'Compassionate in-home Behavior Therapy in Delhi NCR addressing tantrums, emotional regulation, impulse control, anxiety, and positive habits.',
  },
  'physical-therapy': {
    title: 'Pediatric Physical Therapy (Delhi NCR)',
    description: 'In-home Pediatric Physical Therapy in Delhi NCR strengthening balance, posture, muscle tone, gait training, and gross motor independence.',
  },
  'play-therapy': {
    title: 'Child Play Therapy (Delhi NCR)',
    description: 'Child-centered in-home Play Therapy in Delhi NCR nurturing emotional expression, social turn-taking, peer bonding, and imaginative confidence.',
  },
  'counseling-psychological-support': {
    title: 'Child Counseling Support (Delhi NCR)',
    description: 'Confidential in-home Child Psychology & Parent Counseling in Delhi NCR for anxiety, school stress, emotional resilience, and family guidance.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = THERAPY_META[slug] || {
    title: 'Specialized Child Therapy Program',
    description: 'Evidence-based in-home and online therapy programs for neurodivergent children across Delhi NCR and PAN-India by The Shadow Bridge.',
  };

  return buildPageMetadata({
    title: info.title,
    description: info.description,
    path: `/therapies/${slug}`,
  });
}

export default function TherapyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
