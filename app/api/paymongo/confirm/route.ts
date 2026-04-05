import { NextRequest, NextResponse } from 'next/server';
import { getWebsiteById as getSiteById } from '@/lib/db/websites';
import {
  fetchPaymongoCheckoutSession,
  isCheckoutSessionPaid,
  markOrderPaid,
} from '@/lib/paymongo-order-sync';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.PAYMONGO_SECRET_KEY?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Missing PAYMONGO_SECRET_KEY environment variable' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const orderId = String(body?.orderId || '').trim();
    const checkoutSessionId = String(body?.checkoutSessionId || '').trim();

    if (!orderId || !checkoutSessionId) {
      return NextResponse.json(
        { success: false, message: 'orderId and checkoutSessionId are required' },
        { status: 400 }
      );
    }

    const order = await getSiteById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const existingSessionId = String(order?.config?.payment?.checkoutSessionId || '').trim();
    if (existingSessionId && existingSessionId !== checkoutSessionId) {
      return NextResponse.json({ success: false, message: 'Checkout session mismatch' }, { status: 400 });
    }

    const paymongoData = await fetchPaymongoCheckoutSession(checkoutSessionId);
    const { isPaid, paidAt } = isCheckoutSessionPaid(paymongoData);

    if (!isPaid) {
      return NextResponse.json({ success: false, message: 'Payment is not completed yet' }, { status: 400 });
    }

    await markOrderPaid(order, checkoutSessionId, paidAt);

    return NextResponse.json({
      success: true,
      orderId,
      transactionId: checkoutSessionId,
      status: 'ship',
    });
  } catch (error: unknown) {
    console.error('PayMongo payment confirmation failed:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unexpected error',
    }, { status: 500 });
  }
}
