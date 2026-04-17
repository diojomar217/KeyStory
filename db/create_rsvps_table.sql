-- SQL: create rsvps table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS rsvps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id text,
  name text,
  contact_number text,
  attendance text,
  godparent_confirmation text,
  companions int,
  message text,
  created_at timestamp with time zone DEFAULT now()
);
