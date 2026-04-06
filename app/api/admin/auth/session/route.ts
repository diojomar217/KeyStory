import { NextRequest, NextResponse } from 'next/server';
import { createAdminSessionToken, isAdminRequestAuthorized } from '@/lib/api/admin-auth';

export async function GET(req: NextRequest) {
  if (!isAdminRequestAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    token: createAdminSessionToken(),
    email: process.env.ADMIN_EMAIL || 'admin',
  });
}
