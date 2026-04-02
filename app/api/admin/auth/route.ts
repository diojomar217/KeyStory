import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { enforceRateLimit } from '@/lib/reliability/rate-limit';
import { captureError } from '@/lib/reliability/monitoring';
import { recordAdminAudit } from '@/lib/reliability/audit';

// Simple token-based auth (in production, use proper JWT/sessions)
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, {
    keyPrefix: 'api:admin:auth',
    limit: 8,
    windowMs: 5 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    const { email, password } = await req.json();

    // Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
   
    // Validate credentials
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Admin not configured' },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      // Generate a simple token
      const token = uuidv4();

      await recordAdminAudit(req, {
        action: 'admin.auth.login',
        targetType: 'admin_auth',
        targetId: email,
        success: true,
      });
      
      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful',
      });
    }

    await recordAdminAudit(req, {
      action: 'admin.auth.login',
      targetType: 'admin_auth',
      targetId: email || 'unknown',
      success: false,
    });

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    await captureError('admin-auth-post', error);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

