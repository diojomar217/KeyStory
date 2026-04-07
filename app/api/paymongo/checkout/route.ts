import { NextRequest, NextResponse } from 'next/server';
import { sanitizePath, buildReturnUrl } from '@/lib/paymongo-utils';

type PaymentMethodType = 'gcash' | 'card' | 'grab_pay';
type FlowType = 'create' | 'extension';

const ALLOWED_PAYMENT_METHODS: PaymentMethodType[] = ['gcash', 'card', 'grab_pay'];

const toBase64 = (value: string) => Buffer.from(value).toString('base64');

interface CheckoutBody {
  amount?: number | string;
  websiteName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  preferredMethod?: PaymentMethodType;
  orderId?: string;
  flowType?: FlowType;
  slug?: string;
  successPath?: string;
  cancelPath?: string;
}

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: 'Missing PAYMONGO_SECRET_KEY environment variable' },
        { status: 500 }
      );
    }

    const body = (await req.json()) as CheckoutBody;

    const amount = Number(body?.amount ?? 0);
    const websiteName = String(body?.websiteName ?? 'KeyStory Order');
    const customerName = String(body?.customerName ?? 'Customer');
    const customerEmail = String(body?.customerEmail ?? '').trim();
    const customerPhone = String(body?.customerPhone ?? '').trim();
    const preferredMethod = String(body?.preferredMethod ?? 'gcash') as PaymentMethodType;
    const orderId = String(body?.orderId ?? '').trim();
    const flowType: FlowType = body?.flowType === 'extension' ? 'extension' : 'create';
    const slug = String(body?.slug ?? '').trim();
    const rawSuccessPath = body?.successPath;
    const rawCancelPath = body?.cancelPath;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    if (!customerEmail) {
      return NextResponse.json({ success: false, message: 'Customer email is required' }, { status: 400 });
    }

    if (!ALLOWED_PAYMENT_METHODS.includes(preferredMethod)) {
      return NextResponse.json({ success: false, message: 'Invalid payment method' }, { status: 400 });
    }

    if (flowType === 'extension' && !slug) {
      return NextResponse.json({ success: false, message: 'slug is required for extension flow' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const amountInCentavos = Math.round(amount * 100);

    const successPath = sanitizePath(rawSuccessPath as string | undefined, '/create');
    const cancelPath = sanitizePath(rawCancelPath as string | undefined, '/create');

    const successUrl = buildReturnUrl(baseUrl, successPath, 'success', orderId || undefined);
    const cancelUrl = buildReturnUrl(baseUrl, cancelPath, 'cancelled', orderId || undefined);

    const metadata: Record<string, string> = { flowType };
    if (orderId) metadata.orderId = orderId;
    if (slug) metadata.slug = slug;

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
          description:
            flowType === 'extension'
              ? `KeyStory extension payment for ${websiteName}`
              : `KeyStory order for ${websiteName}`,
          line_items: [
            {
              currency: 'PHP',
              amount: amountInCentavos,
              name: websiteName,
              quantity: 1,
            },
          ],
          payment_method_types: [preferredMethod],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata,
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

      return NextResponse.json({ success: false, message }, { status: paymongoResponse.status || 400 });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: paymongoData?.data?.attributes?.checkout_url || null,
      sessionId: paymongoData?.data?.id || null,
    });
  } catch (error: any) {
    console.error('PayMongo checkout creation failed:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Unexpected error' }, { status: 500 });
  }
}
