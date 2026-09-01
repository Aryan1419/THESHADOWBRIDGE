import type { Metadata } from 'next';

const THERAPY_TITLES: Record<string, { title: string; description: string }> = {
  'aba-online-therapy': {
    title: 'ABA Online Therapy (PAN India) | 1-on-1 Video Sessions',
    description: 'Live 1-on-1 video ABA therapy & behavioral coaching for children across all states of India. Certified therapists, individualized goals, and parent coaching.'
  },
  'online-parent-training': {
    title: 'Online Parent Training (PAN India) | Professional ABA Coaching',
    description: 'Live 1-on-1 professional coaching empowering parents with practical ABA and behavioral tools at home across India.'
  },
  'aba-therapy': {
    title: 'In-Home ABA Therapy (Delhi NCR) | Certified Behavior Analysts',
    description: 'Evidence-based Applied Behavior Analysis therapy delivered at your home in Delhi NCR. Supporting children with Autism and developmental delays.'
  },
  'speech-therapy': {
    title: 'In-Home Speech Therapy (Delhi NCR) | Communication & Articulation',
    description: 'Specialized speech and language therapy at home in Delhi NCR. Verbal articulation, fluency, phonology, and social communication support.'
  },
  'occupational-therapy': {
    title: 'In-Home Occupational Therapy (Delhi NCR) | Sensory & Motor Skills',
    description: 'Pediatric occupational therapy for sensory integration, fine motor coordination, posture, and daily living independence in Delhi NCR.'
  },
  'special-education': {
    title: 'Special Education Tutoring (Delhi NCR) | Remedial & IEP Support',
    description: 'Structured special education and remedial teaching tailored to Individualized Education Plans (IEPs) for neurodivergent children in Delhi NCR.'
  },
  'behavior-therapy': {
    title: 'Behavior Therapy (Delhi NCR) | Positive Behavior Support',
    description: 'Targeted behavioral intervention to manage meltdowns, aggression, attention deficits, and encourage positive social interactions.'
  },
  'physical-therapy': {
    title: 'Pediatric Physical Therapy (Delhi NCR) | Gross Motor & Mobility',
    description: 'Pediatric physiotherapy addressing gross motor milestones, muscle tone, balance, posture, and physical coordination at home.'
  },
  'play-therapy': {
    title: 'Play & Social Skills Therapy (Delhi NCR) | Developmental Growth',
    description: 'Child-centered play therapy fostering emotional expression, peer interaction, turn-taking, and imaginative social play.'
  },
  'counseling-psychological-support': {
    title: 'Child & Parent Counseling (Delhi NCR) | Psychological Support',
    description: 'Compassionate psychological guidance and counseling for neurodivergent children and their families navigating developmental journeys.'
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = THERAPY_TITLES[slug] || {
    title: 'Specialized Therapy Program',
    description: 'Evidence-based therapy and intervention programs for children with special needs across India and Delhi NCR.'
  };

  const canonicalUrl = `https://www.theshadowbridge.com/therapies/${slug}`;

  return {
    title: info.title,
    description: info.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${info.title} | The Shadow Bridge`,
      description: info.description,
      url: canonicalUrl,
      siteName: 'The Shadow Bridge',
      type: 'website',
    },
  };
}

export default function TherapyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
