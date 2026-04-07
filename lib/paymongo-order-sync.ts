import { updateWebsite as updateSite } from '@/lib/db/websites';
import { supabase, Site } from '@/lib/supabase';

const toBase64 = (value: string) => Buffer.from(value).toString('base64');

export type PendingPaymentState = 'failed' | 'cancelled' | 'expired' | 'abandoned';
export type PaymongoCheckoutSessionPayload = {
  data?: {
    attributes?: {
      paid_at?: string | null;
      payments?: unknown[];
      payment_intent?: unknown;
    };
  };
};

export async function fetchPaymongoCheckoutSession(checkoutSessionId: string): Promise<PaymongoCheckoutSessionPayload> {
  const secretKey = process.env.PAYMONGO_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new Error('Missing PAYMONGO_SECRET_KEY environment variable');
  }

  const response = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${checkoutSessionId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Basic ${toBase64(`${secretKey}:`)}`,
    },
  });

  const payload = await response.json();
  if (!response.ok) {
    const message =
      payload?.errors?.[0]?.detail ||
      payload?.errors?.[0]?.title ||
      'Failed to verify PayMongo checkout session';
    throw new Error(message);
  }

  return payload;
}

export async function findOrderByCheckoutSessionId(checkoutSessionId: string): Promise<Site | null> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .contains('config', { payment: { checkoutSessionId } })
    .maybeSingle();

  if (!error && data) {
    return data as Site;
  }

  const { data: candidates, error: fallbackError } = await supabase
    .from('sites')
    .select('*')
    .in('status', ['pending', 'active', 'archived'])
    .order('created_at', { ascending: false })
    .limit(250);

  if (fallbackError) {
    throw fallbackError;
  }

  return ((candidates || []) as Site[]).find((site) => {
    const sessionId = String(site.config?.payment?.checkoutSessionId || '').trim();
    return sessionId === checkoutSessionId;
  }) || null;
}

export function isCheckoutSessionPaid(sessionPayload: PaymongoCheckoutSessionPayload): { isPaid: boolean; paidAt: string | null } {
  const attrs = sessionPayload?.data?.attributes || {};
  const paidAt = typeof attrs?.paid_at === 'string' ? attrs.paid_at : null;
  const payments = Array.isArray(attrs?.payments) ? attrs.payments : [];
  const hasPaymentIntent = Boolean(attrs?.payment_intent);
  return {
    isPaid: Boolean(paidAt) || payments.length > 0 || hasPaymentIntent,
    paidAt,
  };
}

export async function markOrderPaid(order: Site, checkoutSessionId: string, paidAt?: string | null) {
  if (!order.id) {
    throw new Error('Order id is required');
  }

  console.log('[MARK_ORDER_PAID] called', { orderId: order.id, checkoutSessionId, paidAt });

  const updatedConfig = {
    ...(order.config || {}),
    fulfillment: {
      ...(order.config?.fulfillment || {}),
      status: 'ship',
      updated_at: new Date().toISOString(),
    },
    payment: {
      ...(order.config?.payment || {}),
      provider: 'paymongo',
      transactionId: checkoutSessionId,
      checkoutSessionId,
      status: 'paid',
      paidAt: paidAt || new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
    },
  };

  const updated = await updateSite({
    id: String(order.id),
    status: 'active',
    config: updatedConfig,
  });

  console.log('[MARK_ORDER_PAID] updated site', { id: updated?.id, status: updated?.status, payment: updated?.config?.payment });

  return updated;
}

export async function markPendingOrderState(
  order: Site,
  checkoutSessionId: string,
  paymentState: PendingPaymentState,
  options?: { fulfillmentStatus?: string; note?: string },
) {
  if (!order.id) {
    throw new Error('Order id is required');
  }

  const nowIso = new Date().toISOString();
  const updatedConfig = {
    ...(order.config || {}),
    fulfillment: {
      ...(order.config?.fulfillment || {}),
      status: options?.fulfillmentStatus || order.config?.fulfillment?.status || 'pending_payment',
      updated_at: nowIso,
      note: options?.note || order.config?.fulfillment?.note || null,
    },
    payment: {
      ...(order.config?.payment || {}),
      provider: 'paymongo',
      transactionId: String(order.config?.payment?.transactionId || checkoutSessionId || '').trim() || undefined,
      checkoutSessionId: String(order.config?.payment?.checkoutSessionId || checkoutSessionId || '').trim() || undefined,
      status: paymentState,
      lastSyncAt: nowIso,
      [`${paymentState}At`]: nowIso,
    },
  };

  const updated = await updateSite({
    id: String(order.id),
    status: 'pending',
    config: updatedConfig,
  });

  return updated;
}