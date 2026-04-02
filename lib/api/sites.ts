// Shared API utility for site CRUD operations
import { Site } from '@/lib/supabase';

const API_BASE = '/api/admin';
const SITE_CACHE_TTL_MS = 5000;
const inFlightSiteRequests = new Map<string, Promise<Site | null>>();
const siteResponseCache = new Map<string, { site: Site | null; expiresAt: number }>();

const clearSiteCache = (id?: string) => {
  if (id) {
    siteResponseCache.delete(id);
    inFlightSiteRequests.delete(id);
    return;
  }

  siteResponseCache.clear();
  inFlightSiteRequests.clear();
};

export async function getSite(id: string): Promise<Site | null> {
  const cached = siteResponseCache.get(id);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.site;
  }

  const inFlight = inFlightSiteRequests.get(id);
  if (inFlight) {
    return inFlight;
  }

  const request = (async () => {
    const res = await fetch(`${API_BASE}?id=${id}`);
    if (!res.ok) throw new Error('Failed to fetch site');
    const data = await res.json();
    const site = data.site || null;

    siteResponseCache.set(id, {
      site,
      expiresAt: Date.now() + SITE_CACHE_TTL_MS,
    });

    return site;
  })();

  inFlightSiteRequests.set(id, request);

  try {
    return await request;
  } finally {
    inFlightSiteRequests.delete(id);
  }
}

export async function updateSite(payload: any): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update site');
  const response = await res.json();
  if (payload?.id) {
    clearSiteCache(payload.id);
  } else {
    clearSiteCache();
  }
  return response;
}

export async function createSite(payload: any): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create site');
  const response = await res.json();
  clearSiteCache();
  return response;
}

export async function deleteSite(id: string): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete site');
  const response = await res.json();
  clearSiteCache(id);
  return response;
}

export async function getSiteRedirectTarget(id: string): Promise<{
  success: boolean;
  site_id: string;
  website_name: string;
  redirect_target: string | null;
  fallback_target: string;
}> {
  const res = await fetch(`${API_BASE}/sites/${id}/redirect`, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch redirect target');
  return res.json();
}

export async function updateSiteRedirectTarget(id: string, redirectTarget: string | null): Promise<{
  success: boolean;
  site_id: string;
  website_name: string;
  redirect_target: string | null;
  fallback_target: string;
}> {
  const res = await fetch(`${API_BASE}/sites/${id}/redirect`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ redirect_target: redirectTarget }),
  });

  if (!res.ok) throw new Error('Failed to update redirect target');
  return res.json();
}

export async function getSiteFulfillment(id: string): Promise<{
  success: boolean;
  site_id: string;
  website_name: string;
  fulfillment: {
    status: 'draft' | 'paid' | 'in_production' | 'shipped' | 'delivered' | 'activated';
    note: string | null;
    tracking_number: string | null;
    courier: string | null;
    updated_at: string | null;
  };
}> {
  const res = await fetch(`${API_BASE}/sites/${id}/fulfillment`, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch fulfillment');
  return res.json();
}

export async function updateSiteFulfillment(
  id: string,
  payload: Partial<{
    status: 'draft' | 'paid' | 'in_production' | 'shipped' | 'delivered' | 'activated';
    note: string;
    tracking_number: string;
    courier: string;
  }>
): Promise<{
  success: boolean;
  site_id: string;
  website_name: string;
  fulfillment: {
    status: 'draft' | 'paid' | 'in_production' | 'shipped' | 'delivered' | 'activated';
    note?: string | null;
    tracking_number?: string | null;
    courier?: string | null;
    updated_at?: string | null;
  };
}> {
  const res = await fetch(`${API_BASE}/sites/${id}/fulfillment`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to update fulfillment');
  return res.json();
}

// Add getSiteBySlug if needed for public view
