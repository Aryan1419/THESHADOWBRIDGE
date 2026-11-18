import { SITE_URL, SITE_NAME } from './seo';

export const FOUNDER_PERSON_SCHEMA = {
  '@type': 'Person',
  '@id': `${SITE_URL}/founder-story#pratibha-mishra`,
  name: 'Pratibha Mishra',
  jobTitle: 'Founder & Lead Educational Mentor',
  url: `${SITE_URL}/founder-story`,
  image: `${SITE_URL}/images/founder_pratibha.jpg`,
  sameAs: ['https://www.linkedin.com/in/pratibha-mishra-3992042ab/'],
  knowsAbout: [
    'Special Education',
    'Child Psychology',
    'School Counselling',
    'Shadow Teacher Mentorship',
    'Autism Spectrum Disorder (ASD) Classroom Support',
    'ADHD & Individualized Education Programs (IEP)',
  ],
};

export const PUBLISHER_ORG_SCHEMA = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon-512.png`,
    width: 512,
    height: 512,
  },
};

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.path === '/' ? SITE_URL : `${SITE_URL}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleSchema({
  headline,
  description,
  path,
  datePublished = '2026-09-27',
  dateModified = '2026-11-18',
  image = `${SITE_URL}/og-image.png`,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  const fullUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    },
    datePublished,
    dateModified,
    inLanguage: 'en-IN',
    author: FOUNDER_PERSON_SCHEMA,
    publisher: PUBLISHER_ORG_SCHEMA,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
  };
}

export function buildServiceSchema({
  name,
  description,
  path,
  serviceType,
  priceInr,
  priceNote,
  areaServed = ['Delhi NCR', 'Mumbai', 'Ahmedabad', 'Hyderabad', 'Bangalore', 'Pune'],
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  priceInr: number;
  priceNote?: string;
  areaServed?: string[];
}) {
  const fullUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    url: fullUrl,
    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: areaServed.map((area) =>
      area === 'India'
        ? { '@type': 'Country', name: 'India' }
        : { '@type': 'City', name: area }
    ),
    offers: {
      '@type': 'Offer',
      price: String(priceInr),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/book`,
      ...(priceNote ? { description: priceNote } : {}),
    },
  };
}
