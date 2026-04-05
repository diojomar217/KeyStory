import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/reliability/rate-limit';
import { captureError } from '@/lib/reliability/monitoring';
import { recordAdminAudit } from '@/lib/reliability/audit';
import { createAdminSessionToken, getAllowedAdminEmails, isPasswordFallbackEnabled } from '@/lib/api/admin-auth';

export async function GET() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
  const passwordConfigured = Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD?.trim());
  const passwordEnabled = isPasswordFallbackEnabled() && passwordConfigured;

  return NextResponse.json({
    success: true,
    providers: {
      google: googleEnabled,
      password: passwordEnabled,
    },
    allowedAdminsCount: getAllowedAdminEmails().length,
  });
}

// Simple token-based auth (in production, use proper JWT/sessions)
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, {
    keyPrefix: 'api:admin:auth',
    limit: 8,
    windowMs: 5 * 60 * 1000,
  });
  if (limited) return limited;

  if (!isPasswordFallbackEnabled()) {
    return NextResponse.json(
      { success: false, message: 'Password login is disabled. Use Google sign-in.' },
      { status: 403 }
    );
  }

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

    if ((email || '').trim().toLowerCase() === adminEmail.trim().toLowerCase() && password === adminPassword) {
      const token = createAdminSessionToken();

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

