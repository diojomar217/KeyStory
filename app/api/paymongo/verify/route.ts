import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchPaymongoCheckoutSession, isCheckoutSessionPaid } from '@/lib/paymongo-order-sync';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const websiteName = String(body?.websiteName || '').trim();
    const orderId = String(body?.orderId || '').trim();

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (orderId && !uuidRegex.test(orderId)) {
      console.log('[VERIFY] invalid orderId format', orderId);
      return NextResponse.json({ success: false, message: 'invalid orderId format' }, { status: 400 });
    }

    console.log('[VERIFY] Incoming POST', { websiteName, orderId, body });

    if (!websiteName && !orderId) {
      console.log('[VERIFY] Missing websiteName or orderId');
      return NextResponse.json({ success: false, message: 'websiteName or orderId required' }, { status: 400 });
    }

    let site: any = null;

    if (orderId) {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (error) throw error;
      site = data || null;
    } else if (websiteName) {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('website_name', websiteName)
        .maybeSingle();

      if (error) throw error;
      site = data || null;
    }

    console.log('[VERIFY] site lookup result', {
      websiteName,
      found: !!site,
      siteId: site?.id,
      siteSlug: site?.slug,
      dbWebsiteName: site?.website_name,
      status: site?.status,
    });

    if (!site) {
      console.log('[VERIFY] No site/order found');
      return NextResponse.json({ success: false });
    }

    const payment = site.config?.payment || {};
    const paymentStatus = String(payment?.status || '').toLowerCase();

    if (site.status === 'active' || paymentStatus === 'paid') {
      console.log('[VERIFY] site found (paid)', { id: site?.id, websiteName: site?.website_name });

      return NextResponse.json({
        success: true,
        payment: {
          orderId: site.id || null,
          websiteName: site.website_name || null,
          status: payment?.status || null,
          provider: payment?.provider || null,
          transactionId: String(payment?.transactionId || payment?.checkoutSessionId || '').trim() || null,
          checkoutSessionId: String(payment?.checkoutSessionId || payment?.transactionId || '').trim() || null,
          paidAt: payment?.paidAt || payment?.paid_at || null,
          lastSyncAt: payment?.lastSyncAt || payment?.last_sync_at || null,
          raw: payment || {},
        },
      });
    }

    const checkoutSessionId = String(payment?.checkoutSessionId || payment?.transactionId || '').trim();

    if (!checkoutSessionId) {
      console.log('[VERIFY] site found but no checkout session available', {
        id: site?.id,
        websiteName: site?.website_name,
      });
      return NextResponse.json({ success: false });
    }

    try {
      const sessionPayload = await fetchPaymongoCheckoutSession(checkoutSessionId);
      const { isPaid, paidAt } = isCheckoutSessionPaid(sessionPayload);

      if (!isPaid) {
        console.log('[VERIFY] session not paid yet', { checkoutSessionId });
        return NextResponse.json({ success: false });
      }

      const attrs = (sessionPayload as any)?.data?.attributes || {};
      const sessionMetadata = attrs?.metadata || attrs?.data?.attributes?.metadata || {};

      console.log('[VERIFY] session indicates paid but DB not updated yet', {
        checkoutSessionId,
        websiteName: site.website_name,
      });

      return NextResponse.json({
        success: false,
        pending: true,
        payment: {
          orderId: sessionMetadata?.orderId || sessionMetadata?.order_id || site.id || null,
          websiteName: sessionMetadata?.websiteName || site.website_name || null,
          transactionId: checkoutSessionId,
          checkoutSessionId,
          paidAt: paidAt || attrs?.paid_at || null,
        },
      });
    } catch (e) {
      console.warn('[VERIFY] failed to fetch PayMongo session', e);
      return NextResponse.json({ success: false });
    }
  } catch (err) {
    console.error('[VERIFY] error', err);
    const message =
      err instanceof Error ? err.message : typeof err === 'object' ? JSON.stringify(err) : String(err);

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}