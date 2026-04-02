create table if not exists public.background_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued', 'processing', 'failed', 'done')),
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  scheduled_at timestamp without time zone,
  last_error text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);

create index if not exists background_jobs_status_scheduled_idx
  on public.background_jobs(status, scheduled_at asc);
