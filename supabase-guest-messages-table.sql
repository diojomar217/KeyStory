-- Supabase guest_messages table schema
create table if not exists public.guest_messages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null,
  message text not null,
  status text not null default 'pending',
  created_at timestamp without time zone not null default now()
);

create index if not exists guest_messages_site_id_idx on public.guest_messages(site_id);
create index if not exists guest_messages_status_idx on public.guest_messages(status);
create index if not exists guest_messages_created_at_idx on public.guest_messages(created_at);
