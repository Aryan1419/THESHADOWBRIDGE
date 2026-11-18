import { MetadataRoute } from 'next';

const DISALLOWED_PATHS = [
  '/admin',
  '/admin/*',
  '/api/*',
  '/dashboard',
  '/dashboard/*',
  '/register/parent/form',
  '/register/parent/placement-fee',
  '/register/parent/therapy-fee',
  '/schools/form',
  '/schools/placement-fee',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot', 'Claude-User', 'GPTBot', 'ClaudeBot'],
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: 'https://www.theshadowbridge.com/sitemap.xml',
  };
}
