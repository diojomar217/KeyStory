// Simple in-memory cache (per server instance)
const ordersCache: Record<string, { data: any; cachedAt: number }> = {};
const CACHE_TTL = 10 * 1000; // 10 seconds
import { NextRequest, NextResponse } from 'next/server';
import { listWebsites as getSites, getWebsiteById as getSiteById, createWebsite as insertSite, updateWebsite as updateSite, deleteWebsite as deleteSite } from '@/lib/db/websites';
// POST - Create a new site
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const created = await insertSite(data);
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
    const updated = await updateSite(data.id, data);
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
    // Use shared getSites for now (filters/pagination can be added to utility if needed)
    try {
      const orders = await getSites();
      // Flatten theme to top-level for each order (for admin table display)
      const ordersWithTheme = (orders || []).map((order: any) => {
        let theme = undefined;
        if (order.config && typeof order.config === 'object' && order.config.theme) {
          theme = order.config.theme;
        }
        return { ...order, theme };
      });
      const responseData = { success: true, orders: ordersWithTheme, total: ordersWithTheme.length };
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


