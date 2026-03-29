import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const cleanText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('id')
    .eq('website_name', slug)
    .maybeSingle();

  if (siteError || !site) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const { data: messages, error: messagesError } = await supabase
    .from('guest_messages')
    .select('id, site_id, name, message, status, created_at')
    .eq('site_id', site.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (messagesError) {
    return NextResponse.json({ error: 'Unable to load guest messages' }, { status: 500 });
  }

  return NextResponse.json({ messages: messages || [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = cleanText(body.slug);
    const name = cleanText(body.name);
    const message = cleanText(body.message);

    if (!slug || !name || !message) {
      return NextResponse.json({ error: 'slug, name, message are required' }, { status: 400 });
    }

    if (name.length > 50) {
      return NextResponse.json({ error: 'Name must be 50 characters or less' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message must be 500 characters or less' }, { status: 400 });
    }

    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('website_name', slug)
      .maybeSingle();

    if (siteError || !site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Simple duplicate prevention for spam (same name + message within 30 sec)
    const { data: recent, error: recentError } = await supabase
      .from('guest_messages')
      .select('id')
      .eq('site_id', site.id)
      .eq('name', name)
      .eq('message', message)
      .gte('created_at', new Date(Date.now() - 30 * 1000).toISOString());

    if (recentError) {
      console.warn('Guest message dedupe lookup failed', recentError);
    }

    if (recent && recent.length > 0) {
      return NextResponse.json({ error: 'Please wait before sending the same message again.' }, { status: 429 });
    }


    try {
      await (await import('@/lib/db/guestMessages')).insertGuestMessage({
        site_id: site.id,
        name,
        message,
      });
    } catch (insertError) {
      console.error('Insert guest message error', insertError);
      return NextResponse.json({ error: 'Could not submit message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Guest messages POST error', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
