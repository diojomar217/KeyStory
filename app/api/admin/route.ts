import { NextRequest, NextResponse } from 'next/server';
import { supabase, Site } from '@/lib/supabase';

// GET - Fetch all orders or single order by id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase.from('sites').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ site: data });
  }

  const { data, error } = await supabase.from('sites').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

// POST - Create new order (legacy, for backwards compatibility)
export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const { error } = await supabase.from('sites').update({ status }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// PUT - Update existing order
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    // Build update object with normalized config in JSONB
    const updateObj: Partial<Site> = {
      website_name: updates.website_name,
      site_type: updates.site_type || updates.occasion,
      status: updates.status,
      config: {
        ...updates.config,
        people: {
          primary: updates.customer_name || updates.config?.people?.primary,
          secondary: updates.partner_name || updates.config?.people?.secondary,
        },
        dates: {
          special_date: updates.specialDate || updates.anniversary_date || updates.config?.dates?.special_date,
        },
        occasion: updates.occasion || updates.site_type || updates.config?.occasion || undefined,
        theme: updates.config?.theme || updates.theme || 'romantic_classic',
        sections: updates.config?.sections || updates.sections || [],
        templates: {
          home: updates.config?.home_template || updates.home_template,
          gallery: updates.config?.gallery_template || updates.gallery_template,
          timeline: updates.config?.timeline_template || updates.timeline_template,
        },
        media: {
          photos: updates.photos || updates.config?.media?.photos || [],
          song_link: updates.song_link || updates.config?.media?.song_link || '',
        },
        timeline: updates.config?.timeline || updates.config?.timeline_events || updates.timeline_events || [],
        content: updates.config?.content || updates.config?.section_content || {},
        message: updates.message || updates.config?.message || '',
        tagline: updates.tagline || updates.config?.tagline || '',
      },
    };

    // We keep only config JSONB here. Avoid top-level legacy fields unless explicitly required by your schema.
    // This prevents schema-cache issues when columns like theme/sections/home_template don't exist.
    // (If your DB actually has these columns, re-enable carefully.)

    // const configUpdates = updates.config as any;
    // if (configUpdates) {
    //   updateObj.theme = configUpdates.theme;
    // }

    const { data, error } = await supabase
      .from('sites')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}

// DELETE - Delete an order
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('sites').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}

