import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import { getWebsiteByIdWithConfig, updateWebsite } from '@/lib/db/websites';

const allowedStatuses = new Set([
  'draft',
  'paid',
  'in_production',
  'shipped',
  'delivered',
  'activated',
]);

const safeString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequestAuthorized(_req)) {
    return unauthorizedAdminResponse();
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });
    }

    const site = await getWebsiteByIdWithConfig(id);
    const config = (site.config || {}) as Record<string, any>;
    const fulfillment = config.fulfillment || {};

    return NextResponse.json({
      success: true,
      site_id: id,
      website_name: site.website_name,
      fulfillment: {
        status: fulfillment.status || 'draft',
        note: fulfillment.note || null,
        tracking_number: fulfillment.tracking_number || null,
        courier: fulfillment.courier || null,
        updated_at: fulfillment.updated_at || null,
      },
    });
  } catch (error) {
    console.error('Get fulfillment error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch fulfillment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const status = safeString(body?.status)?.toLowerCase() || null;
    const note = safeString(body?.note);
    const trackingNumber = safeString(body?.tracking_number);
    const courier = safeString(body?.courier);

    if (status && !allowedStatuses.has(status)) {
      return NextResponse.json({ success: false, message: 'Invalid fulfillment status' }, { status: 400 });
    }

    const site = await getWebsiteByIdWithConfig(id);
    const currentConfig = (site.config || {}) as Record<string, any>;
    const currentFulfillment = (currentConfig.fulfillment || {}) as Record<string, any>;

    const nextFulfillment = {
      ...currentFulfillment,
      ...(status ? { status } : {}),
      ...(note !== null ? { note } : {}),
      ...(trackingNumber !== null ? { tracking_number: trackingNumber } : {}),
      ...(courier !== null ? { courier } : {}),
      updated_at: new Date().toISOString(),
    };

    const nextConfig = {
      ...currentConfig,
      fulfillment: nextFulfillment,
    };

    const updated = await updateWebsite({ id, config: nextConfig as any });

    return NextResponse.json({
      success: true,
      site_id: id,
      website_name: updated.website_name,
      fulfillment: (updated.config as any)?.fulfillment || null,
    });
  } catch (error) {
    console.error('Update fulfillment error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update fulfillment' }, { status: 500 });
  }
}
