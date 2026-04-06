import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getDaysUntilExpiration, getEffectiveSiteStatus } from '@/lib/site-status';

const safeSlug = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolved = await params;
    const slug = safeSlug(resolved.slug);

    if (!slug) {
      return NextResponse.json({ success: false, message: 'slug is required' }, { status: 400 });
    }

    const lookupByWebsiteName = await supabase
      .from('sites')
      .select('id, website_name, status, expires_at, updated_at, config')
      .eq('website_name', slug)
      .maybeSingle();

    const lookupBySlug =
      lookupByWebsiteName.error || !lookupByWebsiteName.data
        ? await supabase
            .from('sites')
            .select('id, website_name, status, expires_at, updated_at, config')
            .eq('slug', slug)
            .maybeSingle()
        : null;

    const site = lookupByWebsiteName.data || lookupBySlug?.data || null;
    const error = lookupByWebsiteName.error || lookupBySlug?.error || null;

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    if (!site) {
      return NextResponse.json({ success: true, exists: false, slug });
    }

    const status = getEffectiveSiteStatus(site as any);
    const daysRemaining = getDaysUntilExpiration(site.expires_at || null);
    const expiringSoon = typeof daysRemaining === 'number' && daysRemaining >= 0 && daysRemaining <= 7;

    const config = (site.config || {}) as Record<string, any>;
    const fulfillment = (config.fulfillment || {}) as Record<string, any>;

    return NextResponse.json({
      success: true,
      exists: true,
      slug,
      site_id: site.id,
      website_name: site.website_name,
      status,
      expires_at: site.expires_at || null,
      hosting: {
        status,
        days_remaining: daysRemaining,
        expiring_soon: expiringSoon,
      },
      updated_at: site.updated_at || null,
      redirect_url: `/r/${site.website_name}`,
      destination_url:
        typeof config.qr_data_url === 'string' && config.qr_data_url.trim().length > 0
          ? config.qr_data_url
          : `/site/${site.website_name}`,
      fulfillment: {
        status: fulfillment.status || 'draft',
        note: fulfillment.note || null,
        tracking_number: fulfillment.tracking_number || null,
        courier: fulfillment.courier || null,
        updated_at: fulfillment.updated_at || null,
      },
    });
  } catch (error) {
    console.error('site status route error:', error);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
