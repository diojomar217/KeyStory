-- DB hardening for CRUD safety/performance (sites, guest_messages, site_analytics_events)
-- Safe to run multiple times.

-- 1) guest_messages: enforce valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'guest_messages_status_check'
  ) THEN
    ALTER TABLE public.guest_messages
      ADD CONSTRAINT guest_messages_status_check
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'guest_messages_name_not_blank_check'
  ) THEN
    ALTER TABLE public.guest_messages
      ADD CONSTRAINT guest_messages_name_not_blank_check
      CHECK (length(btrim(name)) > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'guest_messages_message_not_blank_check'
  ) THEN
    ALTER TABLE public.guest_messages
      ADD CONSTRAINT guest_messages_message_not_blank_check
      CHECK (length(btrim(message)) > 0);
  END IF;
END $$;

-- 2) site_analytics_events: enforce allowed event types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'site_analytics_events_event_type_check'
  ) THEN
    ALTER TABLE public.site_analytics_events
      ADD CONSTRAINT site_analytics_events_event_type_check
      CHECK (event_type IN ('page_view', 'qr_scan'));
  END IF;
END $$;

-- 3) sites: normalize status values used by API
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'sites_status_check'
  ) THEN
    ALTER TABLE public.sites
      ADD CONSTRAINT sites_status_check
      CHECK (status IN ('pending', 'active', 'expired', 'archived'));
  END IF;
END $$;

-- 4) API query performance indexes
CREATE INDEX IF NOT EXISTS idx_sites_status_created_at
  ON public.sites(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sites_website_name_lower
  ON public.sites (LOWER(website_name));

CREATE INDEX IF NOT EXISTS idx_sites_slug_lower
  ON public.sites (LOWER(slug));

CREATE INDEX IF NOT EXISTS idx_guest_messages_site_status_created_at
  ON public.guest_messages(site_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_site_event_created_at
  ON public.site_analytics_events(site_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_dedupe_lookup
  ON public.site_analytics_events(site_id, event_type, source, ip_hash, created_at DESC);

-- 5) idempotency support for write APIs
CREATE TABLE IF NOT EXISTS public.api_idempotency_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL,
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  status_code integer NOT NULL,
  response_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(scope, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_api_idempotency_created_at
  ON public.api_idempotency_keys(created_at DESC);

ANALYZE public.sites;
ANALYZE public.guest_messages;
ANALYZE public.site_analytics_events;
ANALYZE public.api_idempotency_keys;
