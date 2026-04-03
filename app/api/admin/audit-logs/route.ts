import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import { supabase } from '@/lib/supabase';
import { enforceRateLimit } from '@/lib/reliability/rate-limit';
import { captureError } from '@/lib/reliability/monitoring';

export async function GET(req: NextRequest) {
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  const limited = enforceRateLimit(req, {
    keyPrefix: 'api:admin:audit-logs:get',
    limit: 30,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  try {
    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(200, Number(url.searchParams.get('limit') || '50')));

    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, logs: data || [] });
  } catch (error) {
    await captureError('admin-audit-logs-get', error);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
