create table if not exists public.web_vitals_events (
  id uuid primary key default gen_random_uuid(),
  metric_id text,
  metric_name text not null,
  value double precision not null,
  delta double precision,
  rating text,
  path text,
  user_agent text,
  over_budget boolean not null default false,
  created_at timestamp without time zone not null default now()
);

create index if not exists web_vitals_events_metric_created_idx
  on public.web_vitals_events(metric_name, created_at desc);

create index if not exists web_vitals_events_over_budget_idx
  on public.web_vitals_events(over_budget, created_at desc);
