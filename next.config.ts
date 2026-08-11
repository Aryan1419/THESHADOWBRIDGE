import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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

