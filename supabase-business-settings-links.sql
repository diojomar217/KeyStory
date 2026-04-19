-- Add storefront/social URL columns used by Admin > Settings and homepage link rendering.
ALTER TABLE IF EXISTS public.business_settings
  ADD COLUMN IF NOT EXISTS shopee_store_url text,
  ADD COLUMN IF NOT EXISTS tiktok_shop_url text,
  ADD COLUMN IF NOT EXISTS lazada_store_url text;

-- Add global analytics toggle
ALTER TABLE IF EXISTS public.business_settings
  ADD COLUMN IF NOT EXISTS analytics_enabled boolean DEFAULT true;
