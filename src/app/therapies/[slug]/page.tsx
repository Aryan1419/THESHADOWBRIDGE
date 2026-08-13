'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronRight, CheckCircle2, PhoneCall, ArrowRight, HelpCircle, 
  Brain, MessageSquare, Activity, GraduationCap, Puzzle, Dumbbell, Smile, HeartPulse, Sparkles, MapPin
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface TherapyDetail {
  slug: string;
  name: string;
  subtitle: string;
  icon: any;
  description: string;
  helpsWith: string[];
  faqs: { question: string; answer: string }[];
}

const THERAPY_DETAILS: Record<string, TherapyDetail> = {
  'aba-online-therapy': {
    slug: 'aba-online-therapy',
    name: 'ABA Online Therapy (PAN India)',
    subtitle: 'Live 1-on-1 video ABA therapy & behavioral coaching for children across all states of India.',
    icon: Brain,
    description: 'ABA Online Therapy brings certified Applied Behavior Analysis experts directly to your home via live 1-on-1 video sessions. Designed for children with Autism Spectrum Disorder (ASD), ADHD, or developmental delays, our online ABA program delivers structured skill acquisition, functional communication training, task compliance, and real-time therapist guidance anywhere in India.',
    helpsWith: [
      'Functional Communication & Verbal Ability',
      'Task Focus, Attention & Instructional Compliance',
      'Behavioral Management & Meltdown Reduction',
      'Social Skills & Tele-Play Guidance',
      'Daily Routine Compliance & Independence',
      'Data-Driven Weekly Progress Tracking',
      'Accessible All Over India (PAN India)'
    ],
    faqs: [
      {
        question: 'Is ABA Online Therapy available all over India (PAN India)?',
        answer: 'Yes! ABA Online Therapy is 100% online and available to families across all states and cities in India (Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, etc.).'
      },
      {
        question: 'How do live online ABA sessions work?',
        answer: 'Sessions are conducted 1-on-1 over secure video calls. Certified therapists guide the child through interactive learning tasks while coaching parents to reinforce positive behaviors in real time.'
      },
      {
        question: 'What equipment is needed at home?',
        answer: 'A smartphone, tablet, or laptop with a stable internet connection, along with basic toys or learning tools recommended by the therapist.'
      },
      {
        question: 'How long is each online session?',
        answer: 'Sessions run for 45 to 60 minutes, scheduled 2 to 4 times per week based on your child\'s requirements.'
      },
      {
        question: 'Will parents receive formal progress reports?',
        answer: 'Yes! Data is logged every session and parents receive documented monthly behavioral & milestone evaluations.'
      }
    ]
  },
  'online-parent-training': {
    slug: 'online-parent-training',
    name: 'Online Parent Training (PAN India)',
    subtitle: 'Live 1-on-1 professional coaching empowering parents with practical ABA & behavioral tools at home.',
    icon: Brain,
    description: 'Online Parent Training is a 1-on-1 coaching program designed for parents across India raising children with Autism, ADHD, speech delays, or behavioral challenges. Guided by senior behavior analysts, parents learn step-by-step how to manage tantrums, build predictable routines, implement positive reinforcement, and support learning independently.',
    helpsWith: [
      'Handling Tantrums, Aggression & Meltdowns at Home',
      'Designing Daily Home Routines & Visual Schedules',
      'Positive Reinforcement & Task Compliance Strategies',
      'Sensory Regulation & Environmental Adaptations',
      'Fostering Independent Play & Self-Care Skills',
      'Navigating School Permissions & IEP Implementation',
      'Available All Over India (PAN India)'
    ],
    faqs: [
      {
        question: 'Is Online Parent Training available all over India (PAN India)?',
        answer: 'Yes! Online Parent Training is conducted via live 1-on-1 video calls and is accessible to parents residing in any city, state, or region of India.'
      },
      {
        question: 'Who should enroll in Online Parent Training?',
        answer: 'Parents who want hands-on, actionable strategies to manage challenging behaviors, establish smooth home routines, and accelerate their child\'s development.'
      },
      {
        question: 'What is the schedule for parent training calls?',
        answer: 'Sessions are scheduled flexibly at mutually convenient times, including evening and weekend options.'
      },
      {
        question: 'Can both parents or caregivers join the call?',
        answer: 'Yes! Both parents, grandparents, or primary home caregivers are welcome to join together.'
      },
      {
        question: 'Do parents get written guides and tracking sheets?',
        answer: 'Yes, customized visual schedules, behavior tracking charts, and strategy checklists are provided.'
      }
    ]
  },
  'aba-therapy': {
    slug: 'aba-therapy',
    name: 'ABA Therapy (Applied Behavior Analysis)',
    subtitle: 'Evidence-based behavioral intervention for Autism Spectrum Disorder & developmental challenges.',
    icon: Brain,
    description: 'Applied Behavior Analysis (ABA) is a scientifically validated framework that focuses on improving specific behaviors such as communication, social skills, play skills, academics, and daily living skills, while reducing problem behaviors. Our home ABA sessions adapt strategies directly to your child\'s home environment.',
    helpsWith: [
      'Communication & Functional Language',
      'Social Skills & Peer Play Interaction',
      'Play Skills & Creative Engagement',
      'Learning Readiness & Attention Building',
      'Academic & Cognitive Concepts',
      'Daily Living Skills (Self-care, Routine Compliance)',
      'Behavior Management (Reducing Tantrums & Aggression)'
    ],
    faqs: [
      {
        question: 'How do home ABA therapy sessions work?',
        answer: 'Our certified ABA therapist visits your home to conduct structured 1-on-1 sessions incorporating discrete trial training (DTT) and natural environment teaching (NET). Sessions are tailored to your child\'s Individualized Therapy Plan.'
      },
      {
        question: 'Who are your ABA therapists?',
        answer: 'All our ABA therapists hold relevant certifications (RBT, BCBA-supervised, or Masters in Special Education/Psychology) with verified hands-on clinical experience.'
      },
      {
        question: 'How long is each home session?',
        answer: 'Standard home ABA sessions run for 45 to 60 minutes per session, scheduled 2 to 5 times per week depending on your child\'s requirement.'
      },
      {
        question: 'Are sessions available on weekends?',
        answer: 'Yes, we offer flexible scheduling including Saturday and Sunday slots across Delhi NCR.'
      },
      {
        question: 'Will parents receive regular progress updates?',
        answer: 'Absolutedly. Our therapists log data after every session and share formal monthly progress evaluations with parents.'
      }
    ]
  },
  'speech-therapy': {
    slug: 'speech-therapy',
    name: 'Speech & Language Therapy',
    subtitle: 'Empowering children to communicate clearly, express thoughts, and build confidence.',
    icon: MessageSquare,
    description: 'Speech & Language Therapy addresses speech delays, articulation issues, stammering/stuttering, receptive/expressive language difficulties, and auditory processing. In-home sessions help children practice communication in their everyday comfort zone.',
    helpsWith: [
      'Speech Sound Articulation & Clarity',
      'Receptive Language (Understanding Instructions)',
      'Expressive Language (Vocabulary & Sentence Building)',
      'Stuttering & Stammering Support',
      'Social Communication & Pragmatics',
      'Oral Motor Exercise & Feeding Support'
    ],
    faqs: [
      {
        question: 'How do home speech therapy sessions work?',
        answer: 'A licensed Speech-Language Pathologist (SLP) brings specialized diagnostic tools and interactive communication games to your home to conduct 1-on-1 therapy.'
      },
      {
        question: 'Who are your speech therapists?',
        answer: 'Our speech therapists hold degree qualifications in Audiology & Speech-Language Pathology (BASLP/MASLP) registered with RCI.'
      },
      {
        question: 'How long is each home session?',
        answer: 'Speech sessions typically last 45 minutes, twice or thrice a week.'
      },
      {
        question: 'Are sessions available on weekends?',
        answer: 'Yes, weekend morning and evening slots are available across Delhi NCR.'
      },
      {
        question: 'Will I get progress updates?',
        answer: 'Yes, speech milestone assessments are updated monthly.'
      }
    ]
  },
  'occupational-therapy': {
    slug: 'occupational-therapy',
    name: 'Occupational Therapy (OT)',
    subtitle: 'Enhancing motor skills, sensory regulation, and daily life independence.',
    icon: Activity,
    description: 'Pediatric Occupational Therapy helps children build essential skills needed for daily play, learning, handwriting, self-care, and sensory processing. Home OT targets real-world home obstacles to foster confidence and self-reliance.',
    helpsWith: [
      'Fine Motor Control (Pencil Grip, Cutting, Buttoning)',
      'Gross Motor Coordination & Balance',
      'Sensory Integration & Processing Regulation',
      'Handwriting & Visual Motor Integration',
      'Self-Care Independence (Feeding, Dressing)',
      'Attention & Postural Stability'
    ],
    faqs: [
      {
        question: 'How do home occupational therapy sessions work?',
        answer: 'Our OT specialist utilizes mobile sensory kits, balance equipment, and fine motor tools to convert your home space into an effective therapeutic environment.'
      },
      {
        question: 'Who are your occupational therapists?',
        answer: 'All OTs hold Bachelor\'s or Master\'s degrees in Occupational Therapy (BOT/MOT) with pediatric specialization.'
      },
      {
        question: 'How long is each home session?',
        answer: 'Home OT sessions run for 45 to 60 minutes.'
      },
      {
        question: 'Are weekend slots available?',
        answer: 'Yes, weekend home visits are available in Delhi NCR.'
      },
      {
        question: 'Will parents get progress updates?',
        answer: 'Yes, sensory profiles and motor milestone charts are provided every month.'
      }
    ]
  },
  'special-education': {
    slug: 'special-education',
    name: 'Special Education Services',
    subtitle: 'Individualized academic strategies for children with learning differences.',
    icon: GraduationCap,
    description: 'Special Education focuses on tailored academic interventions for children with Dyslexia, Dyscalculia, ADHD, or general learning difficulties. Special Educators design Individualized Education Plans (IEPs) aligned with school curricula.',
    helpsWith: [
      'Phonics, Reading & Comprehension Skills',
      'Handwriting, Spelling & Writing Ability',
      'Mathematical Concepts & Numerical Skills',
      'Executive Functioning (Organization, Memory, Focus)',
      'Curriculum Adaptation & Exam Preparation Support',
      'Confidence & Academic Self-Esteem'
    ],
    faqs: [
      {
        question: 'How do home special education sessions work?',
        answer: 'Our Special Educator visits your home to conduct structured multi-sensory learning sessions based on a customized IEP created after initial assessment.'
      },
      {
        question: 'Who are the special educators?',
        answer: 'Certified educators holding B.Ed / M.Ed in Special Education recognized by RCI.'
      },
      {
        question: 'How long is each session?',
        answer: 'Sessions are 60 minutes long, scheduled 3 to 5 days a week.'
      },
      {
        question: 'Are weekend slots available?',
        answer: 'Yes, flexible weekend slots are available.'
      },
      {
        question: 'Will parents get progress reports?',
        answer: 'Yes, IEP goal evaluations are shared with parents on a monthly basis.'
      }
    ]
  },
  'behavior-therapy': {
    slug: 'behavior-therapy',
    name: 'Pediatric Behavior Therapy',
    subtitle: 'Positive behavior support for emotional regulation, focus, and reducing defiance.',
    icon: Puzzle,
    description: 'Behavior Therapy helps children manage emotional outbursts, anxiety, hyperactivity, and social conflicts using positive reinforcement and cognitive-behavioral strategies adapted for children.',
    helpsWith: [
      'Emotional Regulation & Frustration Tolerance',
      'Reducing Tantrums, Aggression & Meltdowns',
      'Hyperactivity & Impulsivity Management (ADHD)',
      'Social Etiquette & Cooperation',
      'Routine Building & Transition Support',
      'Parental Behavioral Guidance'
    ],
    faqs: [
      {
        question: 'How do home behavior therapy sessions work?',
        answer: 'Therapists work directly in the child\'s home setting to observe triggers, implement positive reinforcement systems, and guide parents on managing behaviors effectively.'
      },
      {
        question: 'Who are the behavior therapists?',
        answer: 'Qualified specialists with backgrounds in Clinical Psychology, Child Counseling, or Applied Behavior Therapy.'
      },
      {
        question: 'How long is each session?',
        answer: 'Sessions are 45 to 60 minutes long.'
      },
      {
        question: 'Is weekend therapy available?',
        answer: 'Yes, weekend appointments are available across Delhi NCR.'
      },
      {
        question: 'Do parents receive progress updates?',
        answer: 'Yes, behavioral track sheets are reviewed weekly and monthly.'
      }
    ]
  },
  'physical-therapy': {
    slug: 'physical-therapy',
    name: 'Pediatric Physical Therapy (Physiotherapy)',
    subtitle: 'Strengthening physical movement, balance, posture, and motor milestones.',
    icon: Dumbbell,
    description: 'Pediatric Physical Therapy assists children in overcoming physical limitations, developmental motor delays, muscle weakness, or neurological conditions to achieve optimal mobility and body alignment.',
    helpsWith: [
      'Gross Motor Milestones (Sitting, Crawling, Walking)',
      'Muscle Strength, Posture & Core Stability',
      'Balance, Coordination & Gait Training',
      'Flexibility & Joint Range of Motion',
      'Physical Rehabilitation after Injury/Surgery'
    ],
    faqs: [
      {
        question: 'How do home physical therapy sessions work?',
        answer: 'A licensed pediatric physiotherapist brings specialized exercise equipment to conduct targeted physical exercises in your home.'
      },
      {
        question: 'Who are the physical therapists?',
        answer: 'Registered Physiotherapists (BPT/MPT) with dedicated pediatric experience.'
      },
      {
        question: 'How long is each session?',
        answer: 'Sessions are 45 to 60 minutes long.'
      },
      {
        question: 'Are weekend sessions available?',
        answer: 'Yes, weekend home visits are available in Delhi NCR.'
      },
      {
        question: 'Are progress metrics provided?',
        answer: 'Yes, physical measurement & milestone charts are provided monthly.'
      }
    ]
  },
  'play-therapy': {
    slug: 'play-therapy',
    name: 'Pediatric Play Therapy',
    subtitle: 'Therapeutic play interventions for emotional expression and social growth.',
    icon: Smile,
    description: 'Play Therapy utilizes natural play, storytelling, drawing, and games to help young children process feelings, overcome trauma or anxiety, and build healthy social skills in a non-threatening environment.',
    helpsWith: [
      'Expressing Complex Emotions Through Play',
      'Reducing Anxiety, Fear & Emotional Stress',
      'Building Problem-Solving & Social Skills',
      'Fostering Self-Esteem & Communication',
      'Coping with Family Transitions or Changes'
    ],
    faqs: [
      {
        question: 'How do home play therapy sessions work?',
        answer: 'The play therapist brings therapeutic toys, puppets, art materials, and games to guide 1-on-1 expressive play sessions in your home.'
      },
      {
        question: 'Who are the play therapists?',
        answer: 'Child psychologists and certified play therapy practitioners.'
      },
      {
        question: 'How long is each session?',
        answer: 'Sessions last 45 minutes.'
      },
      {
        question: 'Are weekend slots open?',
        answer: 'Yes, weekend appointments are available in Delhi NCR.'
      },
      {
        question: 'Will parents get feedback?',
        answer: 'Yes, therapists hold monthly parent debriefings.'
      }
    ]
  },
  'counseling-psychological-support': {
    slug: 'counseling-psychological-support',
    name: 'Child Counseling & Psychological Support',
    subtitle: 'Clinical psychological guidance for children, teens, and parents.',
    icon: HeartPulse,
    description: 'Child Counseling & Psychological Support offers professional clinical guidance for stress, anxiety, emotional struggles, trauma, behavioral changes, and parent consultation.',
    helpsWith: [
      'Child & Adolescent Anxiety, Mood & Stress',
      'Self-Esteem & Emotional Wellbeing',
      'School Refusal & Academic Stress',
      'Parenting Guidance & Family Dynamics',
      'Psychological Assessment & Support'
    ],
    faqs: [
      {
        question: 'How do home counseling sessions work?',
        answer: 'A licensed child psychologist conducts confidential 1-on-1 counseling sessions in the quiet comfort of your home.'
      },
      {
        question: 'Who are the counselors?',
        answer: 'M.Phil / Master\'s qualified Clinical or Child Psychologists.'
      },
      {
        question: 'How long is each session?',
        answer: 'Sessions last 50 to 60 minutes.'
      },
      {
        question: 'Are weekend slots available?',
        answer: 'Yes, weekend consultation slots are available across Delhi NCR.'
      },
      {
        question: 'Is confidentiality maintained?',
        answer: 'Strict clinical confidentiality is guaranteed.'
      }
    ]
  }
};

export default function TherapyDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const detail = THERAPY_DETAILS[slug];

  if (!detail) {
    return (
      <div className="min-h-screen bg-brand-light/30 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow pt-32 pb-16 text-center space-y-4">
          <h1 className="font-serif text-2xl font-bold text-primary">Therapy Not Found</h1>
          <p className="text-xs text-brand-muted">The requested therapy page does not exist.</p>
          <Link href="/therapies" className="btn-gradient inline-flex px-6 py-2.5 rounded-xl font-bold text-xs">
            View All 8 Therapies
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComp = detail.icon;

  return (
    <div className="min-h-screen bg-brand-light/30 flex flex-col font-sans">
      <Navbar />

      {/* Header & Breadcrumb */}
      <section className="pt-28 sm:pt-36 pb-12 bg-white border-b border-brand-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={12} />
            <Link href="/therapies" className="hover:text-primary">Therapies</Link>
            <ChevronRight size={12} />
            <span className="text-primary font-bold">{detail.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-950 text-[11px] font-extrabold uppercase">
            <Sparkles size={12} className="text-secondary" />
            <span>{slug.includes('online') ? '🌐 PAN INDIA (ONLINE SERVICE)' : '📍 Delhi NCR Home Session'}</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0 shadow-sm border border-purple-200 mt-1">
              <IconComp size={28} />
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-primary">
                {detail.name}
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 font-medium">
                {detail.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          {/* About Therapy Card */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
            <h2 className="font-serif text-xl font-bold text-primary border-b border-brand-border/60 pb-3">
              What is {detail.name}?
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed font-medium">
              {detail.description}
            </p>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between text-xs text-purple-950 font-bold">
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-secondary" />
                <span>Available for 1-on-1 Home Visits across Delhi NCR (Delhi, Noida, Ghaziabad, Gurugram, Faridabad)</span>
              </span>
            </div>
          </div>

          {/* "This therapy helps with" Checklist */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
            <h2 className="font-serif text-xl font-bold text-primary border-b border-brand-border/60 pb-3">
              This Therapy Helps With
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detail.helpsWith.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-brand-light/40 border border-brand-border rounded-2xl">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-primary via-[#2A1D4E] to-primary text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4 border border-accent/30">
            <h2 className="font-serif text-2xl sm:text-3xl font-black">
              Ready to Book Home {detail.name}?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto font-medium">
              Book a 1-on-1 consultation call (₹99 fee) with our Lead Educational Specialist to discuss your child&apos;s needs and schedule home sessions in Delhi NCR.
            </p>
            <div className="pt-2">
              <Link
                href={`/book?service=therapy&type=${detail.slug}`}
                className="btn-gradient inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all"
              >
                <PhoneCall size={18} />
                <span>Book Consultation (₹99)</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <div className="border-b border-brand-border/60 pb-3 flex items-center gap-2">
              <HelpCircle size={20} className="text-primary" />
              <h2 className="font-serif text-xl font-bold text-primary">
                Frequently Asked Questions ({detail.name})
              </h2>
            </div>

            <div className="space-y-4">
              {detail.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 bg-brand-light/30 border border-brand-border rounded-2xl space-y-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-primary">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
