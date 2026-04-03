// Simple in-memory cache (per server instance)
const ordersCache: Record<string, { data: any; cachedAt: number }> = {};
const CACHE_TTL = 10 * 1000; // 10 seconds
import { NextRequest, NextResponse } from 'next/server';
import { listWebsites as getSites, getWebsiteById as getSiteById, createWebsite as insertSite, updateWebsite as updateSite, deleteWebsite as deleteSite } from '@/lib/db/websites';

const ALLOWED_SORT_COLUMNS = new Set([
  'created_at',
  'updated_at',
  'website_name',
  'slug',
  'status',
  'expires_at',
]);

const clearOrdersCache = () => {
  Object.keys(ordersCache).forEach((key) => {
    delete ordersCache[key];
  });
};

// POST - Create a new site
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const created = await insertSite(data);
    clearOrdersCache();
    return NextResponse.json({ success: true, site: created });
  } catch (error: any) {
    console.error('Failed to create site:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Edit an existing site
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ success: false, message: 'Missing site id' }, { status: 400 });
    }

    const updated = await updateSite({ ...data, id: data.id });
    clearOrdersCache();
    return NextResponse.json({ success: true, site: updated });
  } catch (error: any) {
    console.error('Failed to update site:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete a site
export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ success: false, message: 'Missing site id' }, { status: 400 });
    }
    await deleteSite(data.id);
    clearOrdersCache();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete site:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// GET - Fetch all sites from Supabase
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // If an ID is provided, fetch a single site
    if (id) {
      try {
        const data = await getSiteById(id);
        return NextResponse.json({ success: true, order: data });
      } catch (error: any) {
        console.error('Failed to fetch order:', error);
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 500 }
        );
      }
    }

    // Otherwise, fetch all sites (optionally filtered by status), with pagination and column selection
    const status = searchParams.get('status')?.toLowerCase();
    const parsedLimit = parseInt(searchParams.get('limit') || '20', 10);
    const parsedOffset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = Number.isNaN(parsedLimit) ? 20 : Math.min(Math.max(parsedLimit, 1), 100);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);
    const search = searchParams.get('search')?.trim();
    const requestedSortBy = searchParams.get('sortBy') || 'created_at';
    const sortBy = ALLOWED_SORT_COLUMNS.has(requestedSortBy) ? requestedSortBy : 'created_at';
    const sortDirection = (searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc');
    const guestMessageFilter = searchParams.get('guestMessageFilter') === 'pending' ? 'pending' : 'all';

    // Build cache key from query params (after all are defined)
    const cacheKey = JSON.stringify({ limit, offset, status, search, sortBy, sortDirection, guestMessageFilter });
    const now = Date.now();
    if (ordersCache[cacheKey] && now - ordersCache[cacheKey].cachedAt < CACHE_TTL) {
      return NextResponse.json(ordersCache[cacheKey].data);
    }

    // Efficient DB-level filtering, searching, sorting, and pagination
    try {
      const { data: orders, total } = await getSites({
        limit,
        offset,
        status,
        search,
        sortBy,
        sortDirection,
        guestMessageFilter,
      });
      // Flatten theme to top-level for each order (for admin table display)
      const ordersWithTheme = (orders || []).map((order: any) => {
        let theme = undefined;
        if (order.config && typeof order.config === 'object' && order.config.theme) {
          theme = order.config.theme;
        }
        return { ...order, theme };
      });
      const responseData = { success: true, orders: ordersWithTheme, total };
      ordersCache[cacheKey] = { data: responseData, cachedAt: now };
      return NextResponse.json(responseData);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('orders route exception:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}


