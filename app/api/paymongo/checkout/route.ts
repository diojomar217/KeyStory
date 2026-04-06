import { NextRequest, NextResponse } from 'next/server';

type PaymentMethodType = 'gcash' | 'card' | 'grab_pay';

const ALLOWED_PAYMENT_METHODS: PaymentMethodType[] = ['gcash', 'card', 'grab_pay'];

const toBase64 = (value: string) => Buffer.from(value).toString('base64');

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: 'Missing PAYMONGO_SECRET_KEY environment variable' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const amount = Number(body?.amount || 0);
    const websiteName = String(body?.websiteName || 'KeyStory Order');
    const customerName = String(body?.customerName || 'Customer');
    const customerEmail = String(body?.customerEmail || '').trim();
    const customerPhone = String(body?.customerPhone || '').trim();
    const preferredMethod = String(body?.preferredMethod || 'gcash') as PaymentMethodType;
    const orderId = String(body?.orderId || '').trim();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    if (!customerEmail) {
      return NextResponse.json({ success: false, message: 'Customer email is required' }, { status: 400 });
    }

    if (!ALLOWED_PAYMENT_METHODS.includes(preferredMethod)) {
      return NextResponse.json({ success: false, message: 'Invalid payment method' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const amountInCentavos = Math.round(amount * 100);
    const successParams = new URLSearchParams({ payment: 'success' });
    const cancelParams = new URLSearchParams({ payment: 'cancelled' });

    if (orderId) {
      successParams.set('orderId', orderId);
      cancelParams.set('orderId', orderId);
    }

    const paymongoPayload = {
      data: {
        attributes: {
          billing: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone || undefined,
          },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: `KeyStory order for ${websiteName}`,
          line_items: [
            {
              currency: 'PHP',
              amount: amountInCentavos,
              name: websiteName,
              quantity: 1,
            },
          ],
          payment_method_types: [preferredMethod],
          success_url: `${baseUrl}/create?${successParams.toString()}`,
          cancel_url: `${baseUrl}/create?${cancelParams.toString()}`,
        },
      },
    };

    const paymongoResponse = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${toBase64(`${secretKey}:`)}`,
      },
      body: JSON.stringify(paymongoPayload),
    });

    const paymongoData = await paymongoResponse.json();

    if (!paymongoResponse.ok) {
      const message =
        paymongoData?.errors?.[0]?.detail ||
        paymongoData?.errors?.[0]?.title ||
        'Failed to create PayMongo checkout session';

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: paymongoData?.data?.attributes?.checkout_url || null,
      sessionId: paymongoData?.data?.id || null,
    });
  } catch (error: any) {
    console.error('PayMongo checkout creation failed:', error);
    return NextResponse.json({ success: false, message: error.message || 'Unexpected error' }, { status: 500 });
  }
}
