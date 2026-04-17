import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import * as rsvpDb from '@/lib/db/rsvps';
import { sendRsvpNotification } from '@/lib/email';

const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const siteId = url.searchParams.get('site_id');
  const slug = url.searchParams.get('slug');

  try {
    let resolvedSiteId = siteId;
    if (!resolvedSiteId && slug) {
      const { data: site, error: siteError } = await supabase
        .from('sites')
        .select('id')
        .eq('website_name', slug)
        .maybeSingle();
      if (siteError) throw siteError;
      if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
      resolvedSiteId = site.id;
    }

    if (!resolvedSiteId) return NextResponse.json({ error: 'Missing site_id or slug' }, { status: 400 });

    const rsvps = await rsvpDb.getRsvpsBySiteId(resolvedSiteId);
    return NextResponse.json({ rsvps });
  } catch (err) {
    console.error('rsvp-get-error', err);
    return NextResponse.json({ error: 'Unable to load RSVPs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const site_id = clean(body.site_id) || undefined;
    const slug = clean(body.slug) || undefined;
    const name = clean(body.name);
    const attendance = clean(body.attendance);

    if (!name || !attendance) {
      return NextResponse.json({ error: 'name and attendance are required' }, { status: 400 });
    }

    try {
      const result = await rsvpDb.insertRsvp({
        site_id,
        slug,
        name,
        contact_number: clean(body.contact_number) || undefined,
        attendance,
        godparent_confirmation: clean(body.godparent_confirmation) || undefined,
        companions: typeof body.companions === 'number' ? body.companions : Number(body.companions || 0),
        message: clean(body.message) || undefined,
      });

      // Optional email notification (best-effort)
      try {
        await sendRsvpNotification({
          site_id: site_id,
          slug,
          name,
          attendance,
          companions: typeof body.companions === 'number' ? body.companions : Number(body.companions || 0),
          godparent_confirmation: clean(body.godparent_confirmation) || undefined,
          message: clean(body.message) || undefined,
        });
      } catch (emailErr) {
        console.warn('Failed to send RSVP notification', emailErr);
      }

      return NextResponse.json({ success: true, duplicate: (result as any)?.duplicate || false });
    } catch (dbErr) {
      console.error('rsvp-insert-error', dbErr);
      return NextResponse.json({ error: 'Could not submit RSVP' }, { status: 500 });
    }
  } catch (err) {
    console.error('rsvp-post-error', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      // try body
      const body = await req.json().catch(() => ({}));
      if (body && body.id) {
        return await deleteById(body.id);
      }
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    return await deleteById(id);
  } catch (err) {
    console.error('rsvp-delete-error', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

async function deleteById(id: string) {
  try {
    await rsvpDb.deleteRsvp(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('rsvp-delete-failed', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
