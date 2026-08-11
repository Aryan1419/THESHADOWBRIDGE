import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/dashboard',
          '/dashboard/*',
          '/register/parent/form',
          '/register/parent/placement-fee',
          '/schools/form',
          '/schools/placement-fee',
        ],
      },
    ],
    sitemap: 'https://theshadowbridge.com/sitemap.xml',
  };
}

