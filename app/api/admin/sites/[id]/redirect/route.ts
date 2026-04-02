import { NextRequest, NextResponse } from 'next/server';
import { getWebsiteByIdWithConfig, updateWebsite } from '@/lib/db/websites';

const normalizeTarget = (target: unknown): string | null => {
  if (typeof target !== 'string') return null;
  const trimmed = target.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const isAllowedTarget = (target: string): boolean => {
  if (target.startsWith('/')) return true;

  try {
    const url = new URL(target);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });
    }

    const site = await getWebsiteByIdWithConfig(id);
    const config = (site?.config || {}) as Record<string, unknown>;
    const qrDataUrl = typeof config.qr_data_url === 'string' ? config.qr_data_url : null;

    return NextResponse.json({
      success: true,
      site_id: id,
      website_name: site.website_name,
      redirect_target: qrDataUrl,
      fallback_target: `/site/${site.website_name}`,
    });
  } catch (error) {
    console.error('Get redirect target error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch redirect target' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const normalized = normalizeTarget(body?.redirect_target);

    if (normalized && !isAllowedTarget(normalized)) {
      return NextResponse.json(
        { success: false, message: 'redirect_target must be an absolute http(s) URL or a relative path' },
        { status: 400 }
      );
    }

    const site = await getWebsiteByIdWithConfig(id);
    const currentConfig = (site?.config || {}) as Record<string, unknown>;
    const nextConfig: Record<string, unknown> = { ...currentConfig };

    if (normalized) {
      nextConfig.qr_data_url = normalized;
    } else {
      delete nextConfig.qr_data_url;
    }

    const updated = await updateWebsite({ id, config: nextConfig as any });

    return NextResponse.json({
      success: true,
      site_id: id,
      website_name: updated.website_name,
      redirect_target: (updated.config as any)?.qr_data_url || null,
      fallback_target: `/site/${updated.website_name}`,
    });
  } catch (error) {
    console.error('Update redirect target error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update redirect target' }, { status: 500 });
  }
}
