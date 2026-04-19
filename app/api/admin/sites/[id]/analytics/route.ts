import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import { getWebsiteByIdWithConfig, updateWebsite } from '@/lib/db/websites';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequestAuthorized(_req)) return unauthorizedAdminResponse();

  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });

    const site = await getWebsiteByIdWithConfig(id);
    const cfg = (site?.config || {}) as Record<string, unknown>;
    const enabled = typeof cfg.analytics_enabled === 'undefined' ? true : !!cfg.analytics_enabled;

    return NextResponse.json({ success: true, site_id: id, analytics_enabled: enabled });
  } catch (err) {
    console.error('admin-get-analytics-flag', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch analytics flag' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequestAuthorized(req)) return unauthorizedAdminResponse();

  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const enabled = body && typeof body.enabled === 'boolean' ? body.enabled : null;
    if (enabled === null) {
      return NextResponse.json({ success: false, message: 'enabled (boolean) is required' }, { status: 400 });
    }

    const site = await getWebsiteByIdWithConfig(id);
    const currentConfig = (site?.config || {}) as Record<string, unknown>;
    const nextConfig: Record<string, unknown> = { ...currentConfig, analytics_enabled: enabled };

    const updated = await updateWebsite({ id, config: nextConfig as any });

    return NextResponse.json({ success: true, site_id: id, analytics_enabled: !!(updated.config as any)?.analytics_enabled });
  } catch (err) {
    console.error('admin-patch-analytics-flag', err);
    return NextResponse.json({ success: false, message: 'Failed to update analytics flag' }, { status: 500 });
  }
}
