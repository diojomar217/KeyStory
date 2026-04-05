import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import {
  fetchPaymongoCheckoutSession,
  isCheckoutSessionPaid,
  markOrderPaid,
  markPendingOrderState,
} from '@/lib/paymongo-order-sync';
import { supabase, Site } from '@/lib/supabase';

export const runtime = 'nodejs';

function isCleanupSecretAuthorized(req: NextRequest): boolean {
  const expectedSecret = (process.env.ORDER_CLEANUP_SECRET || process.env.CRON_SECRET || '').trim();
  if (!expectedSecret) {
    return false;
  }

  const url = new URL(req.url);
  const providedSecret = (
    req.headers.get('x-order-cleanup-secret') ||
    req.headers.get('x-job-secret') ||
    url.searchParams.get('token') ||
    ''
  ).trim();

  if (!providedSecret || providedSecret.length !== expectedSecret.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(providedSecret), Buffer.from(expectedSecret));
}

function isAuthorized(req: NextRequest) {
  return isAdminRequestAuthorized(req) || isCleanupSecretAuthorized(req);
}

function isPendingPaymentOrder(order: Site) {
  const workflowStatus = String(order.config?.fulfillment?.status || '').toLowerCase();
  const paymentStatus = String(order.config?.payment?.status || '').toLowerCase();
  return order.status === 'pending' &&
    (workflowStatus === 'pending_payment' || workflowStatus === '') &&
    !['paid', 'abandoned', 'failed', 'cancelled', 'expired'].includes(paymentStatus);
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = await req.json().catch(() => ({}));
    const staleMinutes = Number(
      body?.staleMinutes ||
      process.env.PENDING_ORDER_ABANDON_MINUTES ||
      '120',
    );
    const cutoffIso = new Date(Date.now() - staleMinutes * 60 * 1000).toISOString();

    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .eq('status', 'pending')
      .lte('created_at', cutoffIso)
      .order('created_at', { ascending: true })
      .limit(250);

    if (error) {
      console.error('stale order cleanup fetch error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const candidates = ((sites || []) as Site[]).filter(isPendingPaymentOrder);
    const results = [];

    for (const order of candidates) {
      const checkoutSessionId = String(order.config?.payment?.checkoutSessionId || '').trim();

      try {
        if (checkoutSessionId) {
          const sessionPayload = await fetchPaymongoCheckoutSession(checkoutSessionId);
          const { isPaid, paidAt } = isCheckoutSessionPaid(sessionPayload);

          if (isPaid) {
            await markOrderPaid(order, checkoutSessionId, paidAt);
            results.push({ id: order.id, action: 'paid', checkoutSessionId });
            continue;
          }
        }

        await markPendingOrderState(order, checkoutSessionId, 'abandoned', {
          fulfillmentStatus: 'abandoned',
          note: `Automatically marked abandoned after ${staleMinutes} minutes without payment completion.`,
        });

        results.push({ id: order.id, action: 'abandoned', checkoutSessionId: checkoutSessionId || null });
      } catch (cleanupError: unknown) {
        console.error('stale order cleanup failed for order', order.id, cleanupError);
        results.push({
          id: order.id,
          action: 'failed',
          checkoutSessionId: checkoutSessionId || null,
          error: cleanupError instanceof Error ? cleanupError.message : 'Unexpected error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      staleMinutes,
      cutoffIso,
      total: candidates.length,
      results,
    });
  } catch (error: unknown) {
    console.error('stale order cleanup error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Invalid request',
    }, { status: 400 });
  }
}