import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'theshadowbridge.com',
          },
        ],
        destination: 'https://www.theshadowbridge.com/:path*',
        permanent: true,
      },
      {
        source: '/our-story',
        destination: '/founder-story',
        permanent: true,
      },
      {
        source: '/collaboration-schools',
        destination: '/schools',
        permanent: true,
      },
      {
        source: '/register/shadow',
        destination: '/register/shadow-teacher',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

