// app/api/admin.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase, Order } from '@/lib/supabase';

// GET - Fetch all orders or single order by id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ order: data });
  }

  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

// POST - Create new order (legacy, for backwards compatibility)
export async function POST(req: NextRequest) {
  const { id, status } = await req.json();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// PUT - Update existing order
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    // Build update object with config fields flattened
    const updateObj: Partial<Order> = {
      website_name: updates.website_name,
      customer_name: updates.customer_name,
      partner_name: updates.partner_name,
      anniversary_date: updates.anniversary_date,
      message: updates.message,
      song_link: updates.song_link,
      photos: updates.photos,
      config: updates.config,
    };

    // Also update individual config columns
    if (updates.config) {
      updateObj.theme = updates.config.theme;
      updateObj.sections = updates.config.sections;
      updateObj.home_template = updates.config.home_template;
      updateObj.gallery_template = updates.config.gallery_template;
      updateObj.timeline_template = updates.config.timeline_template;
      updateObj.timeline_events = updates.config.timeline_events;
    }

    const { data, error } = await supabase
      .from('orders')
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

    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}
