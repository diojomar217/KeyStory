import { NextRequest, NextResponse } from 'next/server';

const STATE_COOKIE = 'admin_google_state';

function randomState(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
}

function getGoogleRedirectUri(req: NextRequest): string {
  const override = process.env.GOOGLE_REDIRECT_URI?.trim();
  return override || `${req.nextUrl.origin}/api/auth/callback/google`;
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(new URL('/admin/login?oauth=error&reason=google_not_configured', req.nextUrl.origin));
  }

  const redirectUri = getGoogleRedirectUri(req);
  const state = randomState();

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  const response = NextResponse.redirect(googleAuthUrl);
  response.cookies.set({
    name: STATE_COOKIE,
    value: state,
    maxAge: 10 * 60,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
