import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Disable browser caching for the host index page (e.g. /host/anyas-baptism)
export function middleware(_req: NextRequest) {
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
  matcher: ['/host/:slug'],
};
