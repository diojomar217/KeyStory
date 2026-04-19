'use server';

import { NextResponse } from 'next/server';
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import { getBusinessContactSettings, upsertBusinessContactSettings } from '@/lib/business-contact-settings';

// Simple in-memory cache for admin business settings to reduce DB reads in dev/edge server
const ADMIN_SETTINGS_CACHE_TTL = parseInt(process.env.ADMIN_SETTINGS_CACHE_TTL || '60', 10); // seconds

let cachedAdminSettings: { data: any | null; expiresAt: number } = { data: null, expiresAt: 0 };

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

  // Return cached value when still valid
  try {
    if (cachedAdminSettings.data && Date.now() < cachedAdminSettings.expiresAt) {
      return NextResponse.json(cachedAdminSettings.data);
    }

    const settings = await getBusinessContactSettings();
    cachedAdminSettings = { data: settings, expiresAt: Date.now() + ADMIN_SETTINGS_CACHE_TTL * 1000 };
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch business settings', error);
    return NextResponse.json({ error: 'Unable to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = await request.json();
    const updated = await upsertBusinessContactSettings(body);
    // update cache so subsequent GETs return fresh data
    cachedAdminSettings = { data: updated, expiresAt: Date.now() + ADMIN_SETTINGS_CACHE_TTL * 1000 };
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to save business settings', error);
    // on error, clear cache to avoid serving stale/partial data
    cachedAdminSettings = { data: null, expiresAt: 0 };
    return NextResponse.json({ error: 'Unable to save settings', details: (error as Error).message || 'unknown' }, { status: 500 });
  }
}
