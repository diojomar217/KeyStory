import { NextRequest, NextResponse } from 'next/server';
import { supabase, Site } from '@/lib/supabase';

// GET - Fetch all sites from Supabase
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // If an ID is provided, fetch a single site
    if (id) {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Failed to fetch order:', error);
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, order: data });
    }

    // Otherwise, fetch all sites (optionally filtered by status)
    const status = searchParams.get('status')?.toLowerCase();
    let query = supabase.from('sites').select('*');

    if (status) {
      if (status === 'archived') {
        query = query.eq('status', 'archived');
      } else if (status === 'expired') {
        query = query.eq('status', 'expired');
      } else if (status === 'active') {
        query = query.not('status', 'in', '(archived,expired)');
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch orders:', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orders: data });
  } catch (err) {
    console.error('orders route exception:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

