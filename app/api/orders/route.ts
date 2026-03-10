import { NextRequest, NextResponse } from 'next/server';
import { supabase, Order } from '@/lib/supabase';

// GET - Fetch all orders from Supabase
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // If an ID is provided, fetch a single order
    if (id) {
      const { data, error } = await supabase
        .from('orders')
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

    // Otherwise, fetch all orders
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

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

