-- Supabase orders table schema
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  website_name text unique,
  customer_name text not null,
  partner_name text not null,
  anniversary_date date not null,
  message text not null,
  photos text[],
  song_link text,
  qr_code_url text,
  -- configuration columns for easier querying
  theme text,
  sections text[],
  home_template text,
  gallery_template text,
  timeline_template text,
  timeline_events jsonb,
  config jsonb,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
