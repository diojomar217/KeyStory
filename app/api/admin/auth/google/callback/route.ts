import { NextRequest, NextResponse } from 'next/server';
import { createAdminSessionToken, getAllowedAdminEmails } from '@/lib/api/admin-auth';

const STATE_COOKIE = 'admin_google_state';
const SESSION_COOKIE = 'admin_session';

type GoogleTokenResponse = {
  id_token?: string;
  access_token?: string;
};

type GoogleTokenInfo = {
  email?: string;
  email_verified?: string;
  aud?: string;
  iss?: string;
};

const loginErrorRedirect = (req: NextRequest, reason: string) =>
  NextResponse.redirect(new URL(`/admin/login?oauth=error&reason=${encodeURIComponent(reason)}`, req.nextUrl.origin));

function getGoogleRedirectUri(req: NextRequest): string {
  const override = process.env.GOOGLE_REDIRECT_URI?.trim();
  return override || `${req.nextUrl.origin}/api/auth/callback/google`;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || '';
  const state = req.nextUrl.searchParams.get('state') || '';

  if (!code || !state) {
    return loginErrorRedirect(req, 'missing_google_params');
  }

  const storedState = req.cookies.get(STATE_COOKIE)?.value || '';
  if (!storedState || storedState !== state) {
    return loginErrorRedirect(req, 'invalid_state');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const allowedAdminEmails = getAllowedAdminEmails();

  if (!clientId || !clientSecret || allowedAdminEmails.length === 0) {
    return loginErrorRedirect(req, 'google_not_configured');
  }

  const redirectUri = getGoogleRedirectUri(req);

  let tokenData: GoogleTokenResponse;
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      return loginErrorRedirect(req, 'google_token_exchange_failed');
    }

    tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
  } catch {
    return loginErrorRedirect(req, 'google_token_exchange_failed');
  }

  if (!tokenData.id_token) {
    return loginErrorRedirect(req, 'missing_id_token');
  }

  let tokenInfo: GoogleTokenInfo;
  try {
    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenData.id_token)}`,
      { cache: 'no-store' }
    );

    if (!tokenInfoResponse.ok) {
      return loginErrorRedirect(req, 'google_token_validation_failed');
    }

    tokenInfo = (await tokenInfoResponse.json()) as GoogleTokenInfo;
  } catch {
    return loginErrorRedirect(req, 'google_token_validation_failed');
  }

  const email = (tokenInfo.email || '').trim().toLowerCase();
  const emailVerified = (tokenInfo.email_verified || '').toLowerCase() === 'true';
  const audienceValid = (tokenInfo.aud || '') === clientId;
  const issuerValid = ['accounts.google.com', 'https://accounts.google.com'].includes((tokenInfo.iss || '').trim());
  const allowedEmail = allowedAdminEmails.includes(email);

  if (!email || !emailVerified || !audienceValid || !issuerValid || !allowedEmail) {
    return loginErrorRedirect(req, 'google_account_not_allowed');
  }

  const token = createAdminSessionToken();
  const redirect = NextResponse.redirect(
    new URL(`/admin/login?oauth=success&email=${encodeURIComponent(email)}`, req.nextUrl.origin)
  );

  redirect.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    maxAge: 24 * 60 * 60,
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  redirect.cookies.set({
    name: STATE_COOKIE,
    value: '',
    maxAge: 0,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return redirect;
}
