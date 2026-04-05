import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId')?.trim();

    if (!transactionId) {
      return NextResponse.json({ success: false, message: 'transactionId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sites')
      .select('id, slug, website_name, status, created_at, config')
      .contains('config', { payment: { transactionId } })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: data.id,
        slug: data.slug,
        websiteName: data.website_name,
        status: data.status,
        createdAt: data.created_at,
        transactionId,
      },
    });
  } catch (error: any) {
    console.error('Failed to track order:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to track order' }, { status: 500 });
  }
}
