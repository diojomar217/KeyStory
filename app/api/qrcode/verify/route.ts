import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isArchived, isExpired } from '@/lib/site-status';

const safeString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const slug = safeString(url.searchParams.get('slug'));

    if (!slug) {
      return NextResponse.json({ success: false, message: 'slug is required' }, { status: 400 });
    }

    const { data: site, error } = await supabase
      .from('sites')
      .select('id, website_name, status, expires_at, updated_at, config')
      .eq('website_name', slug)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    if (!site) {
      return NextResponse.json({ success: true, exists: false, slug });
    }

    const normalizedStatus = isArchived(site as any)
      ? 'archived'
      : isExpired(site as any)
        ? 'expired'
        : (site.status || 'active').toString().toLowerCase();

    const config = (site.config || {}) as Record<string, unknown>;
    const redirectTarget = typeof config.qr_data_url === 'string' && config.qr_data_url.trim().length > 0
      ? config.qr_data_url
      : `/site/${site.website_name}`;

    return NextResponse.json({
      success: true,
      exists: true,
      slug,
      site_id: site.id,
      status: normalizedStatus,
      expires_at: site.expires_at || null,
      updated_at: site.updated_at || null,
      qr_redirect_url: `/r/${site.website_name}`,
      redirect_target: redirectTarget,
    });
  } catch (error) {
    console.error('qrcode verify route error:', error);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
