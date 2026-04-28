-- create_guest_photos_table.sql
-- Run this in Supabase SQL editor or as part of your migrations

CREATE TABLE IF NOT EXISTS guest_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid,
  slug text NOT NULL,
  image_url text NOT NULL,
  key text NOT NULL,
  guest_name text,
  caption text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guest_photos_slug_idx ON guest_photos(slug);
CREATE INDEX IF NOT EXISTS guest_photos_site_id_idx ON guest_photos(site_id);
