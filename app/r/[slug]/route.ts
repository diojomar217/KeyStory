import {NextRequest, NextResponse} from 'next/server';
import {supabase} from '@/lib/supabase';
import {createHash} from 'crypto';

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

export async function GET(req: NextRequest, {params}: {params: Promise<{slug: string}>}) {
  const resolved = await params;
  const slug = safestring(resolved.slug);

  if (!slug) {
    return NextResponse.redirect('/');
  }

  const {data: site, error: siteError} = await supabase
    .from('sites')
    .select('id')
    .eq('website_name', slug)
    .maybeSingle();

  if (siteError || !site) {
    return NextResponse.redirect('/');
  }

  const user_agent = safestring(req.headers.get('user-agent'));
  const referrer = safestring(req.headers.get('referer'));
  const ip_hash = getIpHash(req);

  const {error} = await supabase.from('site_analytics_events').insert({
    site_id: site.id,
    event_type: 'qr_scan',
    source: 'qr',
    user_agent,
    referrer,
    ip_hash,
  });

  if (error) {
    console.warn('QR scan analytics insert failed', error);
  }

  return NextResponse.redirect(`/site/${slug}`);
}
