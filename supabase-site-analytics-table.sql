-- Supabase site_analytics_events table schema
create table if not exists public.site_analytics_events (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_type text not null,
  source text,
  user_agent text,
  referrer text,
  ip_hash text,
  created_at timestamp without time zone not null default now()
);

create index if not exists site_analytics_events_site_id_idx on public.site_analytics_events(site_id);
create index if not exists site_analytics_events_event_type_idx on public.site_analytics_events(event_type);
create index if not exists site_analytics_events_created_at_idx on public.site_analytics_events(created_at);
