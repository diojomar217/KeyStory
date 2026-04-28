import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Force Next to render metadata inside <head> for bots (facebookexternalhit, Facebot, etc.)
  // This prevents metadata streaming from placing meta tags outside of <head> where crawlers may miss them.
  htmlLimitedBots: /.*/,
  // Silence the multiple-lockfile workspace root warning
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Include commonly used quality values. Cloudinary may produce images
    // with q_auto that result in quality 86 — include it to avoid Next.js warnings.
    qualities: [75, 80, 86],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [], // Add custom image domains here if needed
  },
  async headers() {
    return [
      {
        source: '/site/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=3600',
          },
        ],
      },
      {
        source: '/r/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=120, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
  // Add more config options as needed (rewrites, redirects, i18n, etc.)
};

export default nextConfig;
