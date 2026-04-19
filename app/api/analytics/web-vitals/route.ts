import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { webVitalOverBudget } from '@/config/performanceBudget';
import { captureWarning } from '@/lib/reliability/monitoring';
import { enforceRateLimit } from '@/lib/reliability/rate-limit';
import { getBusinessContactSettings } from '@/lib/business-contact-settings';
import { getPublicSiteBySlugNoCache } from '@/lib/site-data';

type WebVitalInput = {
  id?: string;
  name?: string;
  value?: number;
  delta?: number;
  rating?: string;
  path?: string;
  user_agent?: string;
};

const allowedNames = new Set(['LCP', 'INP', 'CLS', 'TTFB', 'FCP']);

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, { keyPrefix: 'api:web-vitals', limit: 80, windowMs: 60 * 1000 });
  if (limited) return limited;

  try {
    const body = (await req.json()) as WebVitalInput;

    // Respect global analytics toggle from business settings (no-op success when disabled)
    try {
      const biz = await getBusinessContactSettings();
      if (biz && typeof biz.analyticsEnabled !== 'undefined' && biz.analyticsEnabled === false) {
        return NextResponse.json({ success: true });
      }
    } catch (e) {
      // ignore and continue — best-effort
    }

    // If path looks like /site/:slug or /host/:slug, check site-level analytics setting
    try {
      const path = (body.path || '').toString();
      const segs = path.split('/').filter(Boolean);
      const [first, second] = segs;
      if ((first === 'site' || first === 'host') && second) {
        const site = await getPublicSiteBySlugNoCache(second);
        if (site && site.config && typeof (site.config as any).analytics_enabled !== 'undefined' && (site.config as any).analytics_enabled === false) {
          return NextResponse.json({ success: true });
        }
      }
    } catch (e) {
      // ignore and continue
    }
    const name = (body.name || '').toString().toUpperCase();
    const value = Number(body.value);

    if (!allowedNames.has(name) || !Number.isFinite(value)) {
      return NextResponse.json({ error: 'Invalid web vital payload' }, { status: 400 });
    }

    const metric = {
      metric_id: (body.id || '').slice(0, 120),
      metric_name: name,
      value,
      delta: Number(body.delta || 0),
      rating: (body.rating || '').slice(0, 32),
      path: (body.path || '').slice(0, 300),
      user_agent: (body.user_agent || req.headers.get('user-agent') || '').slice(0, 512),
      over_budget: webVitalOverBudget(name, value),
    };

    const { error } = await supabase.from('web_vitals_events').insert(metric);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (metric.over_budget) {
      await captureWarning('web-vitals', `${name} exceeded budget`, {
        value,
        path: metric.path,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
