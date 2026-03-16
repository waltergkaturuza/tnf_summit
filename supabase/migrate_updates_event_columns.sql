-- ============================================================
-- TNF Summit — Add event columns to updates table
-- Run this in Supabase SQL Editor if you get "Could not find event_city" errors
-- (for databases created before the event metadata was added)
-- ============================================================
SET search_path TO tnf_summit, public;

ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS event_start_at TIMESTAMPTZ;
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS event_end_at TIMESTAMPTZ;
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS event_venue TEXT;
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS event_city TEXT;
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS event_country TEXT;
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS event_room TEXT;
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS registration_type TEXT DEFAULT 'none';
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS registration_url TEXT DEFAULT '';
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS registration_page_slug TEXT DEFAULT '';

-- Refresh PostgREST schema cache (Supabase does this automatically, but you may need to wait a few seconds or redeploy)
