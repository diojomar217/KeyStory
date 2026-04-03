import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';

function buildAdminSessionToken(): string | null {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    return null;
  }

  return createHash('sha256')
    .update(`${adminEmail}:${adminPassword}:keystory-admin-session`)
    .digest('hex');
}

export function createAdminSessionToken(): string {
  const token = buildAdminSessionToken();

  if (!token) {
    throw new Error('Admin credentials are not configured');
  }

  return token;
}

function getCookieValue(req: Request | NextRequest, cookieName: string): string | null {
  if ('cookies' in req && typeof req.cookies?.get === 'function') {
    return req.cookies.get(cookieName)?.value?.trim() || null;
  }

  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');
  for (const entry of cookies) {
    const [rawName, ...rawValue] = entry.split('=');
    if (rawName?.trim() === cookieName) {
      return rawValue.join('=').trim() || null;
    }
  }

  return null;
}

export function isAdminRequestAuthorized(req: Request | NextRequest): boolean {
  const expectedToken = buildAdminSessionToken();
  const providedToken = getCookieValue(req, SESSION_COOKIE_NAME);

  if (!expectedToken || !providedToken || providedToken.length !== expectedToken.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(providedToken), Buffer.from(expectedToken));
}

export function unauthorizedAdminResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}