import { createHash } from 'crypto';
import { NextRequest } from 'next/server';
import { insertAuditLog } from '@/lib/db/auditLogs';

const getIpHash = (req: NextRequest): string | null => {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || '';
  return ip ? createHash('sha256').update(ip).digest('hex') : null;
};

const getAdminEmail = (req: NextRequest): string | null => {
  const headerEmail = req.headers.get('x-admin-email')?.trim();
  if (headerEmail) return headerEmail;
  return null;
};

export const recordAdminAudit = async (
  req: NextRequest,
  input: {
    action: string;
    targetType?: string;
    targetId?: string;
    success: boolean;
    details?: Record<string, unknown>;
  },
) => {
  await insertAuditLog({
    action: input.action,
    admin_email: getAdminEmail(req),
    target_type: input.targetType || null,
    target_id: input.targetId || null,
    success: input.success,
    details: input.details,
    ip_hash: getIpHash(req),
    user_agent: req.headers.get('user-agent') || null,
  });
};
