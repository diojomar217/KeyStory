// Simple in-memory cache (per server instance)
const ordersCache: Record<string, { data: any; cachedAt: number }> = {};
const CACHE_TTL = 10 * 1000; // 10 seconds
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

    // Otherwise, fetch all sites (optionally filtered by status), with pagination and column selection
    const status = searchParams.get('status')?.toLowerCase();
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const search = searchParams.get('search')?.trim();
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortDirection = (searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc');

    // Build cache key from query params (after all are defined)
    const cacheKey = JSON.stringify({ limit, offset, status, search, sortBy, sortDirection });
    const now = Date.now();
    if (ordersCache[cacheKey] && now - ordersCache[cacheKey].cachedAt < CACHE_TTL) {
      return NextResponse.json(ordersCache[cacheKey].data);
    }

    // Build base query for data
    let dataQuery = supabase
      .from('sites')
      .select('id,slug,website_name,site_type,status,expires_at,created_at,config')
      .order(sortBy, { ascending: sortDirection === 'asc' })
      .range(offset, offset + limit - 1);

    // Build base query for count
    let countQuery = supabase
      .from('sites')
      .select('id', { count: 'exact', head: true });

    if (status) {
      if (status === 'archived') {
        dataQuery = dataQuery.eq('status', 'archived');
        countQuery = countQuery.eq('status', 'archived');
      } else if (status === 'expired') {
        dataQuery = dataQuery.eq('status', 'expired');
        countQuery = countQuery.eq('status', 'expired');
      } else if (status === 'active') {
        dataQuery = dataQuery.not('status', 'in', '(archived,expired)');
        countQuery = countQuery.not('status', 'in', '(archived,expired)');
      }
    }

    // Add search filter (website_name, slug, or customer)
    if (search) {
      // Use ilike for case-insensitive partial match
      dataQuery = dataQuery.or(`website_name.ilike.%${search}%,slug.ilike.%${search}%`);
      countQuery = countQuery.or(`website_name.ilike.%${search}%,slug.ilike.%${search}%`);
      // If you have a customer field, add it here as well:
      // .or(`website_name.ilike.%${search}%,slug.ilike.%${search}%,customer.ilike.%${search}%`)
    }

    // Fetch data and count in parallel
    const [dataRes, countRes] = await Promise.all([
      dataQuery,
      countQuery
    ]);

    console.log('[API /api/orders] Raw data from Supabase:', JSON.stringify(dataRes.data, null, 2));
    if (dataRes.error) {
      console.error('Failed to fetch orders:', dataRes.error);
      return NextResponse.json(
        { success: false, message: dataRes.error.message },
        { status: 500 }
      );
    }
    if (countRes.error) {
      console.error('Failed to fetch orders count:', countRes.error);
      return NextResponse.json(
        { success: false, message: countRes.error.message },
        { status: 500 }
      );
    }

    // Flatten theme to top-level for each order (for admin table display)
    const ordersWithTheme = (dataRes.data || []).map((order: any) => {
      let theme = undefined;
      if (order.config && typeof order.config === 'object' && order.config.theme) {
        theme = order.config.theme;
      }
      return { ...order, theme };
    });
    const responseData = { success: true, orders: ordersWithTheme, total: countRes.count };
    console.log('[API /api/orders] Final responseData:', JSON.stringify(responseData, null, 2));
    ordersCache[cacheKey] = { data: responseData, cachedAt: now };
    return NextResponse.json(responseData);
  } catch (err) {
    console.error('orders route exception:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}


