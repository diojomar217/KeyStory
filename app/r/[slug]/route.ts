import {NextRequest, NextResponse} from 'next/server';
import {supabase} from '@/lib/supabase';
import {createHash} from 'crypto';
import { insertAnalyticsEvent } from '@/lib/db/analytics';

const safestring = (value: unknown): string | null => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const getIpHash = (req: NextRequest): string | null => {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || '';
  if (!ip) return null;
  return createHash('sha256').update(ip).digest('hex');
};

const getScanSource = (req: NextRequest): string => {
  const utmSource = safestring(req.nextUrl.searchParams.get('utm_source'));
  if (!utmSource) return 'qr';

  // Keep source compact for dashboard grouping while preserving campaign context.
  return `qr:${utmSource.toLowerCase().slice(0, 40)}`;
};

const appendSearchParams = (target: URL, params: URLSearchParams) => {
  params.forEach((value, key) => {
    if (!target.searchParams.has(key)) {
      target.searchParams.set(key, value);
    }
  });
};

const resolveRedirectTarget = (slug: string, config: unknown, req: NextRequest): URL => {
  const fallback = new URL(`/site/${slug}`, req.nextUrl.origin);
  if (!config || typeof config !== 'object') return fallback;

  const raw = (config as { qr_data_url?: unknown }).qr_data_url;
  if (typeof raw !== 'string') return fallback;

  const candidate = raw.trim();
  if (!candidate) return fallback;

  let parsed: URL;
  try {
    parsed = new URL(candidate, req.nextUrl.origin);
  } catch {
    return fallback;
  }

  if (parsed.origin === req.nextUrl.origin && parsed.pathname === `/r/${slug}`) {
    return fallback;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return fallback;
  }

  return parsed;
};

export async function GET(req: NextRequest, {params}: {params: Promise<{slug: string}>}) {
  const resolved = await params;
  const slug = safestring(resolved.slug);
  const homeUrl = new URL('/', req.nextUrl.origin);

  if (!slug) {
    return NextResponse.redirect(homeUrl);
  }

  const {data: site, error: siteError} = await supabase
    .from('sites')
    .select('id, config')
    .eq('website_name', slug)
    .maybeSingle();

  if (siteError || !site) {
    return NextResponse.redirect(homeUrl);
  }

  const user_agent = safestring(req.headers.get('user-agent'));
  const referrer = safestring(req.headers.get('referer'));
  const ip_hash = getIpHash(req);
  const source = getScanSource(req);

  try {
    await insertAnalyticsEvent({
      site_id: site.id,
      event_type: 'qr_scan',
      source,
      user_agent,
      referrer,
      ip_hash,
    });
  } catch (error) {
    console.warn('QR scan analytics insert failed', error);
  }

  const redirectUrl = resolveRedirectTarget(slug, site.config, req);
  appendSearchParams(redirectUrl, req.nextUrl.searchParams);

  return NextResponse.redirect(redirectUrl);
}
