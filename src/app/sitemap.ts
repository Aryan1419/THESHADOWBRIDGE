import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://theshadowbridge.com';
  const currentDate = new Date();

  const therapySlugs = [
    'aba-therapy',
    'speech-therapy',
    'occupational-therapy',
    'special-education',
    'behavior-therapy',
    'physical-therapy',
    'play-therapy',
    'counseling-psychological-support',
  ];

  const mainRoutes = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/services`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/therapies`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/shadow-teachers`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/tutors`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/schools`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/collaboration-schools`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/parents`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/founder-story`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/our-story`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/book`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/register/parent`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/register/shadow-teacher`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/register/tutor`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/contact`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/faqs`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/testimonials`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/check-status`, priority: 0.6, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/terms`, priority: 0.4, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/privacy`, priority: 0.4, changeFrequency: 'yearly' as const },
  ];

  const therapyRoutes = therapySlugs.map((slug) => ({
    url: `${baseUrl}/therapies/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...mainRoutes.map((route) => ({
      ...route,
      lastModified: currentDate,
    })),
    ...therapyRoutes,
  ];
}

