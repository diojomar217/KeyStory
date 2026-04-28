import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed social crawler user agents (lowercase for comparison)
const ALLOWED_BOTS = [
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
];

// Public path prefixes that should never be blocked
const PUBLIC_PATH_PREFIXES = [
  '/site',
  '/robots.txt',
  '/sitemap.xml',
  '/default-og.png',
  '/_next',
  '/favicon.ico',
  '/api/og',
];

function isImagePath(pathname: string) {
  return /\.(png|jpe?g|webp|avif|gif|svg|ico)(?:$|\?)/i.test(pathname);
}

export function middleware(req: NextRequest) {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  const pathname = req.nextUrl.pathname || '/';

  // 1) Immediately allow known social crawlers
  for (const bot of ALLOWED_BOTS) {
    if (ua.includes(bot)) {
      return NextResponse.next();
    }
  }

  // 2) Allow public path prefixes (startsWith)
  for (const prefix of PUBLIC_PATH_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return NextResponse.next();
    }
  }

  // 3) Allow any image/asset requests (so OG assets and images are reachable)
  if (isImagePath(pathname) || pathname.includes('/opengraph-image')) {
    return NextResponse.next();
  }

  // If request reaches here, it's not a social crawler nor a public asset.
  // Keep existing behavior but add debug logging when blocked to assist troubleshooting.
  // NOTE: This log is temporary for debugging and can be removed later.
  console.log('UA:', req.headers.get('user-agent'));

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
