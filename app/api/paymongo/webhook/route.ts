import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getWebsiteById as getSiteById, updateWebsite } from '@/lib/db/websites';
import { supabase } from '@/lib/supabase';
import { addMonthsToIso } from '@/lib/paymongo-utils';
import {
  findOrderByCheckoutSessionId,
  fetchPaymongoCheckoutSession,
  isCheckoutSessionPaid,
  markOrderPaid,
} from '@/lib/paymongo-order-sync';

export const runtime = 'nodejs';

type PaymongoWebhookPayload = {
  data?: {
    attributes?: {
      type?: string;
      event_type?: string;
      data?: {
        id?: string;
        attributes?: {
          id?: string;
          checkout_session_id?: string;
          reference_number?: string;
          description?: string;
          metadata?: {
            orderId?: string;
            order_id?: string;
          };
        };
      };
    };
  };
  type?: string;
};

function isTokenAuthorized(req: NextRequest): boolean {
  const expectedToken = process.env.PAYMONGO_WEBHOOK_TOKEN?.trim();
  if (!expectedToken) {
    return true;
  }

  const url = new URL(req.url);
  const providedToken = (
    req.headers.get('x-paymongo-webhook-token') ||
    req.headers.get('x-webhook-token') ||
    url.searchParams.get('token') ||
    ''
  ).trim();

  if (!providedToken || providedToken.length !== expectedToken.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(providedToken), Buffer.from(expectedToken));
}

function getEventType(payload: PaymongoWebhookPayload): string {
  return String(
    payload?.data?.attributes?.type ||
    payload?.data?.attributes?.event_type ||
    payload?.type ||
    '',
  )
    .trim()
    .toLowerCase();
}

function getCheckoutSessionId(payload: PaymongoWebhookPayload): string {
  const nestedData = payload?.data?.attributes?.data;
  return String(
    nestedData?.id ||
    nestedData?.attributes?.id ||
    nestedData?.attributes?.checkout_session_id ||
    nestedData?.attributes?.reference_number ||
    '',
  ).trim();
}

function getOrderIdFromPayload(payload: PaymongoWebhookPayload): string {
  const nestedAttrs = payload?.data?.attributes?.data?.attributes;
  return String(
    nestedAttrs?.metadata?.orderId ||
    nestedAttrs?.metadata?.order_id ||
    nestedAttrs?.description?.match(/order\s*#?([a-z0-9-]+)/i)?.[1] ||
    '',
  ).trim();
}

export async function POST(req: NextRequest) {
  if (!isTokenAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized webhook request' }, { status: 401 });
  }

  try {
    const payload = await req.json().catch(() => null);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid JSON payload' }, { status: 400 });
    }

    // Allow a local mock mode for testing, but only when explicitly enabled
    // and not running in production. If PAYMONGO_MOCK is set in production we
    // ignore mock payloads for safety.
    const rawMockEnv = String(process.env.PAYMONGO_MOCK || '').trim().toLowerCase();
    const isMockRequested = rawMockEnv === '1' || rawMockEnv === 'true';
    const isMock = isMockRequested && process.env.NODE_ENV !== 'production';
    if (isMockRequested && process.env.NODE_ENV === 'production') {
      console.warn('[WEBHOOK] PAYMONGO_MOCK is set but running in production; ignoring mock mode for safety');
    }

    // Determine session id from webhook envelope
    const incomingSessionId = getCheckoutSessionId(payload);
    if (!incomingSessionId) {
      return NextResponse.json({ success: true, ignored: true, message: 'No checkout session id found' });
    }

    // Fetch PayMongo checkout session (read-only) to obtain authoritative metadata
    let sessionPayload: any = null;
    if (isMock && (payload?.mockSession || payload?.mock_session)) {
      sessionPayload = payload?.mockSession || payload?.mock_session;
      console.log('[WEBHOOK] using mock PayMongo session payload (PAYMONGO_MOCK enabled)', { incomingSessionId });
    } else {
      try {
        sessionPayload = await fetchPaymongoCheckoutSession(incomingSessionId);
      } catch (e) {
        console.error('[WEBHOOK] Failed to fetch PayMongo session', { checkoutSessionId: incomingSessionId, error: e });
        return NextResponse.json({ success: false, message: 'Failed to fetch checkout session' }, { status: 502 });
      }
    }

    const { isPaid, paidAt } = isCheckoutSessionPaid(sessionPayload);
    if (!isPaid) {
      console.log('[WEBHOOK] session not paid yet', { checkoutSessionId: incomingSessionId });
      return NextResponse.json({ success: true, ignored: true, checkoutSessionId: incomingSessionId, message: 'Payment not completed' });
    }

    // Extract metadata from session payload (support nested shapes)
    const attrs = sessionPayload?.data?.attributes || {};
    const metadata = attrs?.metadata || attrs?.data?.attributes?.metadata || {};

    const flowTypeRaw = String(metadata?.flowType || metadata?.flow_type || metadata?.flow || '').trim().toLowerCase();
    const flowType = flowTypeRaw === 'extension' ? 'extension' : 'create';
    const metadataOrderId = String(metadata?.orderId || metadata?.order_id || '').trim();
    const metadataSlug = String(metadata?.slug || metadata?.siteSlug || metadata?.site_slug || '').trim();
    const checkoutSessionId = String(incomingSessionId).trim();
console.log('[DEBUG] FLOW TYPE:', flowType);
console.log('[DEBUG] METADATA:', {
  flowTypeRaw,
  metadataOrderId,
  metadataSlug,
  checkoutSessionId,
});
    console.log('[WEBHOOK] incoming', { flowType, metadataOrderId, metadataSlug, checkoutSessionId, paidAt });

    // Locate site/order: prefer orderId, then slug, then try to find by checkout session id
    let site: any = null;
    if (metadataOrderId) {
      // Only attempt ID lookup when the provided orderId looks like a UUID.
      const looksLikeUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(metadataOrderId);
      if (looksLikeUuid) {
        try {
          site = await getSiteById(metadataOrderId);
        } catch (e) {
          console.warn('[WEBHOOK] getSiteById failed', { orderId: metadataOrderId, err: e });
          site = null;
        }
      } else {
        console.log('[WEBHOOK] metadata.orderId does not appear to be a uuid, skipping id lookup', { metadataOrderId });
      }
    }

    if (!site && metadataSlug) {
      try {
        const { data, error } = await supabase.from('sites').select('*').eq('slug', metadataSlug).maybeSingle();
        if (error) {
          console.warn('[WEBHOOK] supabase slug lookup failed', { slug: metadataSlug, err: error });
        } else if (data) {
          site = data;
        }
      } catch (e) {
        console.warn('[WEBHOOK] slug lookup exception', e);
      }
    }

    if (!site) {
      // Fallback: try to find by checkoutSessionId in case metadata omitted
      try {
        site = await findOrderByCheckoutSessionId(checkoutSessionId);
      } catch (e) {
        console.warn('[WEBHOOK] findOrderByCheckoutSessionId failed', e);
      }
    }

    if (!site) {
      console.log('[DEBUG] SITE LOOKUP RESULT:', {
  found: !!site,
  siteId: site?.id,
  status: site?.status,
});
      console.log('[WEBHOOK] site/order not found for session, ignoring', { checkoutSessionId, metadataOrderId, metadataSlug });
      return NextResponse.json({ success: true, ignored: true, message: 'Order not found', checkoutSessionId });
    }


    // Safety: ensure we have an id
    const siteId = String(site?.id || '').trim();

    // --- ID empotency checks ---
    const existingPayment = site.config?.payment || {};
    const existingCheckoutId = String(existingPayment?.checkoutSessionId || existingPayment?.transactionId || '').trim();
    const alreadyPaid = String(existingPayment?.status || '').toLowerCase() === 'paid' || site.status === 'active';

    if (existingCheckoutId === checkoutSessionId && alreadyPaid) {
      console.log('[WEBHOOK] duplicate webhook — already processed', { siteId, checkoutSessionId });
      return NextResponse.json({ success: true, ignored: true, message: 'Already processed', siteId, checkoutSessionId });
    }
console.log('[DEBUG] ENTERING FLOW BRANCH', {
  flowType,
  siteId: site?.id,
});
    // Branch by flow type
    if (flowType === 'create') {
      // CREATE FLOW: mark the order/site as paid/active
      try {
        await markOrderPaid(site, checkoutSessionId, paidAt || undefined);
        console.log('[WEBHOOK] create flow processed', { siteId, checkoutSessionId });
        return NextResponse.json({ success: true, siteId, checkoutSessionId, flowType: 'create' });
      } catch (e) {
        console.error('[WEBHOOK] failed to mark order paid (create)', { siteId, err: e });
        return NextResponse.json({ success: false, message: 'Failed to mark order paid' }, { status: 500 });
      }
    }

    // EXTENSION FLOW
    if (flowType === 'extension') {
      console.log('[DEBUG] EXTENSION FLOW TRIGGERED', {
  siteId: site?.id,
  currentStatus: site?.status,
  currentExpiresAt: site?.expires_at,
  checkoutSessionId,
});
      try {
        // If already processed for this session, skip
        const alreadyExtendedFor = String(existingPayment?.extensionAppliedFor || '').trim();
        if (alreadyExtendedFor === checkoutSessionId) {
          console.log('[WEBHOOK] extension already applied for this session — ignoring', { siteId, checkoutSessionId });
          return NextResponse.json({ success: true, ignored: true, siteId, checkoutSessionId });
        }

        console.log('[WEBHOOK][EXTENSION] extension not yet applied — proceeding', { siteId, checkoutSessionId, paidAt });

        // Ensure payment is recorded in DB first
        console.log('[WEBHOOK][EXTENSION] calling markOrderPaid', { siteId, checkoutSessionId });
        const paidSite = await markOrderPaid(site, checkoutSessionId, paidAt || undefined);
        console.log('[WEBHOOK][EXTENSION] markOrderPaid returned', {
          siteId: String(paidSite?.id || ''),
          status: paidSite?.status || null,
          expires_at: paidSite?.expires_at || null,
          payment: paidSite?.config?.payment || null,
        });

        // compute new expiration: extend 6 months from current expires_at if in future, otherwise from now
        const currentExpires = paidSite.expires_at ? new Date(paidSite.expires_at) : null;
        const now = new Date();
        const baseDateIso = currentExpires && currentExpires > now ? paidSite.expires_at : now.toISOString();
        const newExpiresAt = addMonthsToIso(baseDateIso, 6);
        console.log('[WEBHOOK][EXTENSION] computed newExpiresAt', { oldExpiresAt: paidSite.expires_at, baseDateIso, newExpiresAt });
console.log('[DEBUG] EXPIRATION UPDATE', {
  oldExpiresAt: paidSite.expires_at,
  baseDateIso,
  newExpiresAt,
});
        // Persist extension marker + updated expiry and reactivate site
        const updatedConfig = {
          ...(paidSite.config || {}),
          payment: {
            ...(paidSite.config?.payment || {}),
            extensionAppliedFor: checkoutSessionId,
          },
        };

        console.log('[WEBHOOK][EXTENSION] updating website record with extension', { siteId: String(paidSite.id), newExpiresAt, checkoutSessionId });
        const updated = await updateWebsite({
          id: String(paidSite.id),
          status: 'active',
          archived_at: null,
          expires_at: newExpiresAt,
          config: updatedConfig,
        });

        console.log('[DEBUG] FINAL UPDATE RESULT', {
  siteId: updated.id,
  status: updated.status,
  expires_at: updated.expires_at,
});

        console.log('[WEBHOOK][EXTENSION] updateWebsite returned', {
          siteId: updated.id,
          oldExpiresAt: paidSite.expires_at,
          newExpiresAt,
          checkoutSessionId,
        });

        return NextResponse.json({ success: true, siteId: updated.id, expires_at: newExpiresAt, flowType: 'extension' });
      } catch (e) {
        console.error('[WEBHOOK] failed to apply extension', { siteId, err: e });
        return NextResponse.json({ success: false, message: 'Failed to apply extension' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, ignored: true, message: 'Unhandled flowType', flowType });
  } catch (error: unknown) {
    console.error('PayMongo webhook processing failed:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unexpected error',
    }, { status: 500 });
  }
}