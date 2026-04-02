import { supabase } from '@/lib/supabase';
import { featureFlags } from '@/lib/reliability/feature-flags';

export type AuditLogInput = {
  action: string;
  admin_email?: string | null;
  target_type?: string | null;
  target_id?: string | null;
  success: boolean;
  details?: Record<string, unknown>;
  ip_hash?: string | null;
  user_agent?: string | null;
};

export async function insertAuditLog(input: AuditLogInput): Promise<void> {
  if (!featureFlags.auditLogs()) return;

  const payload = {
    action: input.action,
    admin_email: input.admin_email || null,
    target_type: input.target_type || null,
    target_id: input.target_id || null,
    success: input.success,
    details: input.details || {},
    ip_hash: input.ip_hash || null,
    user_agent: input.user_agent || null,
  };

  const { error } = await supabase.from('admin_audit_logs').insert(payload);
  if (error) {
    console.warn('Audit log insert failed:', error.message);
  }
}
