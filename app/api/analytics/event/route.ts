import {NextRequest, NextResponse} from 'next/server';
import {supabase} from '@/lib/supabase';
import {createHash} from 'crypto';

const allowedEventTypes = ['page_view', 'qr_scan'] as const;

type EventType = (typeof allowedEventTypes)[number];

const sanitizeText = (value: unknown, max = 512): string | null => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
};

const getIpHash = (req: NextRequest): string | null => {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || '';
  if (!ip) return null;

  return createHash('sha256').update(ip).digest('hex');
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const slug = sanitizeText(data.slug, 100);
    const event_type = sanitizeText(data.event_type, 20) as EventType | null;
    const source = sanitizeText(data.source, 100);

    if (!slug || !event_type || !allowedEventTypes.includes(event_type)) {
      return NextResponse.json({error: 'slug and valid event_type are required'}, {status: 400});
    }

    const {data: site, error: siteError} = await supabase
      .from('sites')
      .select('id')
      .eq('website_name', slug)
      .maybeSingle();

    if (siteError || !site) {
      return NextResponse.json({error: 'Site not found'}, {status: 404});
    }

    const user_agent = sanitizeText(req.headers.get('user-agent') || '', 512);
    const referrer = sanitizeText(req.headers.get('referer') || '', 1024);
    const ip_hash = getIpHash(req);

    const {error: insertError} = await supabase.from('site_analytics_events').insert({
      site_id: site.id,
      event_type,
      source,
      user_agent,
      referrer,
      ip_hash,
    });

    if (insertError) {
      console.error('Analytics insert error:', insertError);
      return NextResponse.json({error: 'Failed to record analytics event'}, {status: 500});
    }

    return NextResponse.json({success: true});
  } catch (err) {
    console.error('Analytics POST error:', err);
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }
}
