create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  admin_email text,
  target_type text,
  target_id text,
  success boolean not null,
  details jsonb not null default '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamp without time zone not null default now()
);

create index if not exists admin_audit_logs_created_at_idx
  on public.admin_audit_logs(created_at desc);

create index if not exists admin_audit_logs_action_idx
  on public.admin_audit_logs(action, created_at desc);
