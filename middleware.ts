import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of user agents to allow even if site might be restricted
const allowedUserAgents = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
];

// Paths that should always be publicly accessible
const publicPaths = [
  '/site',
  '/robots.txt',
  '/sitemap.xml',
  '/opengraph-image',
  '/api/og',
  '/_next',
  '/favicon.ico',
];

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const pathname = req.nextUrl.pathname;

  // Allow crawlers and public paths
  const isAllowedUserAgent = allowedUserAgents.some(ua => userAgent.includes(ua));
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isAllowedUserAgent || isPublicPath) {
    // For crawlers and public paths, allow with normal caching
    return NextResponse.next();
  }

  // Disable browser caching for the host index page (e.g. /host/anyas-baptism)
  const res = NextResponse.next();
  res.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0'
  );
  res.headers.set('Pragma', 'no-cache');
  res.headers.set('Expires', '0');
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
