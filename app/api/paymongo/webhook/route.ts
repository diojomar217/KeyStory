import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getWebsiteById as getSiteById } from '@/lib/db/websites';
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

    const eventType = getEventType(payload);
    const checkoutSessionId = getCheckoutSessionId(payload);

    if (!checkoutSessionId) {
      return NextResponse.json({ success: true, ignored: true, message: 'No checkout session id found' });
    }

    const hintedOrderId = getOrderIdFromPayload(payload);
    let order = hintedOrderId ? await getSiteById(hintedOrderId) : null;

    if (!order || String(order.config?.payment?.checkoutSessionId || '').trim() !== checkoutSessionId) {
      order = await findOrderByCheckoutSessionId(checkoutSessionId);
    }

    if (!order) {
      return NextResponse.json({ success: true, ignored: true, message: 'Order not found' });
    }

    const sessionPayload = await fetchPaymongoCheckoutSession(checkoutSessionId);
    const { isPaid, paidAt } = isCheckoutSessionPaid(sessionPayload);

    if (!isPaid) {
      return NextResponse.json({
        success: true,
        ignored: true,
        orderId: order.id,
        checkoutSessionId,
        eventType,
        message: 'Payment not completed yet',
      });
    }

    await markOrderPaid(order, checkoutSessionId, paidAt);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      checkoutSessionId,
      eventType,
      status: 'ship',
    });
  } catch (error: unknown) {
    console.error('PayMongo webhook processing failed:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unexpected error',
    }, { status: 500 });
  }
}