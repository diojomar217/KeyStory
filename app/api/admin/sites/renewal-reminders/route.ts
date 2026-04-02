import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const getDaysRemaining = (expiresAt: string): number => {
  const now = new Date();
  const then = new Date(expiresAt);
  const ms = then.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const windowDays = Math.max(1, Math.min(90, Number(url.searchParams.get('windowDays') || '30')));
    const limit = Math.max(1, Math.min(500, Number(url.searchParams.get('limit') || '200')));

    const nowIso = new Date().toISOString();
    const until = new Date(Date.now() + windowDays * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('sites')
      .select('id, website_name, slug, status, expires_at, customer_name, partner_name, updated_at')
      .eq('status', 'active')
      .not('expires_at', 'is', null)
      .gte('expires_at', nowIso)
      .lte('expires_at', until)
      .order('expires_at', { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const reminders = (data || []).map((site) => ({
      ...site,
      days_remaining: site.expires_at ? getDaysRemaining(site.expires_at) : null,
      renewal_endpoint: `/api/admin/sites/${site.id}/renew`,
      public_site_url: `/site/${site.website_name}`,
      qr_redirect_url: `/r/${site.website_name}`,
    }));

    return NextResponse.json({
      success: true,
      window_days: windowDays,
      total: reminders.length,
      reminders,
    });
  } catch (error) {
    console.error('renewal-reminders route error:', error);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
