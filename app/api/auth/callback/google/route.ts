import { NextRequest } from 'next/server';
import { GET as adminGoogleCallback } from '@/app/api/admin/auth/google/callback/route';

export async function GET(req: NextRequest) {
  return adminGoogleCallback(req);
}
