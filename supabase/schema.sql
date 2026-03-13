-- ============================================================
--  TNF Global Summit 2026 — Full Database Schema
--  Run this entire file in your Supabase SQL Editor
--  Project: tnf_summit schema inside your existing Supabase DB
-- ============================================================

-- 0. Create dedicated schema (keeps your DB tidy)
CREATE SCHEMA IF NOT EXISTS tnf_summit;
SET search_path TO tnf_summit, public;

-- ============================================================
-- 1. ENUMS
-- ============================================================

CREATE TYPE tnf_summit.registration_status AS ENUM (
  'pending', 'confirmed', 'cancelled', 'waitlisted'
);

CREATE TYPE tnf_summit.payment_status AS ENUM (
  'unpaid', 'paid', 'partial', 'refunded'
);

CREATE TYPE tnf_summit.attendance_mode AS ENUM (
  'in-person', 'virtual', 'hybrid'
);

CREATE TYPE tnf_summit.speaker_status AS ENUM (
  'confirmed', 'tentative', 'declined'
);

CREATE TYPE tnf_summit.sponsor_tier AS ENUM (
  'platinum', 'gold', 'silver', 'partner'
);

CREATE TYPE tnf_summit.sponsor_status AS ENUM (
  'confirmed', 'pending', 'negotiating'
);

CREATE TYPE tnf_summit.message_status AS ENUM (
  'unread', 'read', 'replied'
);

CREATE TYPE tnf_summit.subscriber_status AS ENUM (
  'active', 'unsubscribed'
);

-- ============================================================
-- 2. UTILITY: auto-update updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION tnf_summit.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. REGISTRATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS tnf_summit.registrations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Status & admin
  status                tnf_summit.registration_status NOT NULL DEFAULT 'pending',
  admin_notes           TEXT DEFAULT '',
  reference_number      TEXT GENERATED ALWAYS AS ('REG-' || UPPER(SUBSTRING(id::TEXT, 1, 8))) STORED,

  -- Personal
  salutation            TEXT NOT NULL DEFAULT '',
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  gender                TEXT DEFAULT '',
  date_of_birth         DATE,
  nationality           TEXT NOT NULL DEFAULT '',
  passport_number       TEXT DEFAULT '',

  -- Professional
  organisation          TEXT NOT NULL,
  department            TEXT DEFAULT '',
  job_title             TEXT NOT NULL,
  sector                TEXT NOT NULL DEFAULT '',
  org_website           TEXT DEFAULT '',

  -- Contact
  email                 TEXT NOT NULL,
  phone                 TEXT NOT NULL DEFAULT '',
  whatsapp              TEXT DEFAULT '',
  country               TEXT NOT NULL DEFAULT '',
  city                  TEXT DEFAULT '',

  -- Attendance
  category              TEXT NOT NULL DEFAULT '',
  attendance_mode       tnf_summit.attendance_mode NOT NULL DEFAULT 'in-person',
  days_attending        TEXT[] DEFAULT '{}',

  -- Accommodation
  requires_accommodation BOOLEAN DEFAULT TRUE,
  arrival_date          DATE DEFAULT '2026-09-20',
  departure_date        DATE DEFAULT '2026-09-26',
  room_type             TEXT DEFAULT '',
  airport_transfer      BOOLEAN DEFAULT TRUE,
  special_needs         TEXT DEFAULT '',

  -- Preferences
  dietary_requirements  TEXT DEFAULT '',
  session_interests     TEXT[] DEFAULT '{}',
  excursion_preference  TEXT DEFAULT '',

  -- Innovation Challenge
  apply_innovation      BOOLEAN DEFAULT FALSE,
  startup_name          TEXT DEFAULT '',
  startup_stage         TEXT DEFAULT '',
  startup_description   TEXT DEFAULT '',

  -- Bilateral meetings
  bilateral_meetings    BOOLEAN DEFAULT FALSE,
  investment_interests  TEXT[] DEFAULT '{}',

  -- Media / Press
  is_media              BOOLEAN DEFAULT FALSE,
  media_organisation    TEXT DEFAULT '',
  media_type            TEXT DEFAULT '',

  -- Payment
  payment_method        TEXT DEFAULT '',
  invoice_required      BOOLEAN DEFAULT TRUE,
  billing_organisation  TEXT DEFAULT '',
  fee_amount            INTEGER NOT NULL DEFAULT 0,
  payment_status        tnf_summit.payment_status NOT NULL DEFAULT 'unpaid',

  -- Consents
  privacy_consent       BOOLEAN NOT NULL DEFAULT FALSE,
  photo_consent         BOOLEAN DEFAULT FALSE,
  newsletter_opt_in     BOOLEAN DEFAULT FALSE,
  terms_accepted        BOOLEAN NOT NULL DEFAULT FALSE,

  CONSTRAINT registrations_email_not_empty CHECK (email <> ''),
  CONSTRAINT registrations_name_not_empty  CHECK (first_name <> '' AND last_name <> '')
);

CREATE INDEX idx_registrations_email    ON tnf_summit.registrations (email);
CREATE INDEX idx_registrations_status   ON tnf_summit.registrations (status);
CREATE INDEX idx_registrations_category ON tnf_summit.registrations (category);
CREATE INDEX idx_registrations_country  ON tnf_summit.registrations (country);
CREATE INDEX idx_registrations_created  ON tnf_summit.registrations (created_at DESC);

CREATE TRIGGER trg_registrations_updated_at
  BEFORE UPDATE ON tnf_summit.registrations
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

-- ============================================================
-- 4. SPEAKERS
-- ============================================================

CREATE TABLE IF NOT EXISTS tnf_summit.speakers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name          TEXT NOT NULL,
  title         TEXT NOT NULL DEFAULT '',
  organisation  TEXT NOT NULL DEFAULT '',
  country       TEXT DEFAULT '',
  bio           TEXT DEFAULT '',
  email         TEXT DEFAULT '',
  photo_url     TEXT DEFAULT '',

  session_title TEXT DEFAULT '',
  session_date  TEXT DEFAULT '',
  session_type  TEXT DEFAULT '',

  status        tnf_summit.speaker_status NOT NULL DEFAULT 'tentative',
  display_order INTEGER DEFAULT 0,

  CONSTRAINT speakers_name_not_empty CHECK (name <> '')
);

CREATE INDEX idx_speakers_status ON tnf_summit.speakers (status);

CREATE TRIGGER trg_speakers_updated_at
  BEFORE UPDATE ON tnf_summit.speakers
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

-- ============================================================
-- 5. SPONSORS
-- ============================================================

CREATE TABLE IF NOT EXISTS tnf_summit.sponsors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name            TEXT NOT NULL,
  tier            tnf_summit.sponsor_tier NOT NULL DEFAULT 'partner',
  status          tnf_summit.sponsor_status NOT NULL DEFAULT 'pending',

  description     TEXT DEFAULT '',
  website         TEXT DEFAULT '',
  logo_url        TEXT DEFAULT '',

  contact_name    TEXT DEFAULT '',
  contact_email   TEXT DEFAULT '',
  deal_value      TEXT DEFAULT '',
  deal_amount_usd INTEGER DEFAULT 0,

  display_order   INTEGER DEFAULT 0,

  CONSTRAINT sponsors_name_not_empty CHECK (name <> '')
);

CREATE INDEX idx_sponsors_tier   ON tnf_summit.sponsors (tier);
CREATE INDEX idx_sponsors_status ON tnf_summit.sponsors (status);

CREATE TRIGGER trg_sponsors_updated_at
  BEFORE UPDATE ON tnf_summit.sponsors
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

-- ============================================================
-- 6. CONTACT MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS tnf_summit.contact_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT DEFAULT '',
  organisation  TEXT DEFAULT '',
  enquiry_type  TEXT NOT NULL DEFAULT 'General Enquiry',
  message       TEXT NOT NULL,

  status        tnf_summit.message_status NOT NULL DEFAULT 'unread',
  admin_reply   TEXT DEFAULT '',
  replied_at    TIMESTAMPTZ,

  CONSTRAINT messages_email_not_empty   CHECK (email <> ''),
  CONSTRAINT messages_message_not_empty CHECK (message <> '')
);

CREATE INDEX idx_messages_status  ON tnf_summit.contact_messages (status);
CREATE INDEX idx_messages_email   ON tnf_summit.contact_messages (email);
CREATE INDEX idx_messages_created ON tnf_summit.contact_messages (created_at DESC);

CREATE TRIGGER trg_messages_updated_at
  BEFORE UPDATE ON tnf_summit.contact_messages
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

-- ============================================================
-- 7. NEWSLETTER SUBSCRIBERS
-- ============================================================

CREATE TABLE IF NOT EXISTS tnf_summit.newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  email           TEXT NOT NULL UNIQUE,
  status          tnf_summit.subscriber_status NOT NULL DEFAULT 'active',
  unsubscribed_at TIMESTAMPTZ,
  source          TEXT DEFAULT 'footer',  -- footer | registration | contact

  CONSTRAINT subscribers_email_not_empty CHECK (email <> '')
);

CREATE INDEX idx_subscribers_email  ON tnf_summit.newsletter_subscribers (email);
CREATE INDEX idx_subscribers_status ON tnf_summit.newsletter_subscribers (status);

-- ============================================================
-- 8. SITE SETTINGS (key-value store for admin config)
-- ============================================================

CREATE TABLE IF NOT EXISTS tnf_summit.site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  TEXT DEFAULT 'system'
);

-- Insert defaults
INSERT INTO tnf_summit.site_settings (key, value) VALUES
  ('registration_open',      'true'),
  ('early_bird_deadline',    '2026-06-30'),
  ('programme_published',    'true'),
  ('speakers_published',     'false'),
  ('maintenance_mode',       'false'),
  ('announcement_banner',    ''),
  ('max_delegates',          '2000')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE tnf_summit.registrations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.speakers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.sponsors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.contact_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.site_settings         ENABLE ROW LEVEL SECURITY;

-- ── REGISTRATIONS ──
-- Public can INSERT (submit registration)
CREATE POLICY "public_insert_registrations"
  ON tnf_summit.registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- Only authenticated admins can SELECT, UPDATE, DELETE
CREATE POLICY "admin_all_registrations"
  ON tnf_summit.registrations FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ── CONTACT MESSAGES ──
CREATE POLICY "public_insert_messages"
  ON tnf_summit.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "admin_all_messages"
  ON tnf_summit.contact_messages FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ── NEWSLETTER ──
CREATE POLICY "public_insert_subscribers"
  ON tnf_summit.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "public_unsubscribe"
  ON tnf_summit.newsletter_subscribers FOR UPDATE
  TO anon, authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "admin_all_subscribers"
  ON tnf_summit.newsletter_subscribers FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ── SPEAKERS (admin only) ──
CREATE POLICY "admin_all_speakers"
  ON tnf_summit.speakers FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Public can read confirmed speakers
CREATE POLICY "public_read_confirmed_speakers"
  ON tnf_summit.speakers FOR SELECT
  TO anon
  USING (status = 'confirmed');

-- ── SPONSORS (admin only write, public read confirmed) ──
CREATE POLICY "admin_all_sponsors"
  ON tnf_summit.sponsors FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "public_read_confirmed_sponsors"
  ON tnf_summit.sponsors FOR SELECT
  TO anon
  USING (status = 'confirmed');

-- ── SITE SETTINGS (admin only write, public read) ──
CREATE POLICY "public_read_settings"
  ON tnf_summit.site_settings FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "admin_write_settings"
  ON tnf_summit.site_settings FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ============================================================
-- 10. USEFUL VIEWS
-- ============================================================

-- Registration summary by category
CREATE OR REPLACE VIEW tnf_summit.v_registrations_by_category AS
SELECT
  category,
  COUNT(*)                                          AS total,
  COUNT(*) FILTER (WHERE status = 'confirmed')      AS confirmed,
  COUNT(*) FILTER (WHERE status = 'pending')        AS pending,
  SUM(fee_amount) FILTER (WHERE payment_status = 'paid') AS revenue_usd
FROM tnf_summit.registrations
GROUP BY category
ORDER BY total DESC;

-- Registration summary by country
CREATE OR REPLACE VIEW tnf_summit.v_registrations_by_country AS
SELECT
  country,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed
FROM tnf_summit.registrations
GROUP BY country
ORDER BY total DESC;

-- Dashboard stats (single-row summary)
CREATE OR REPLACE VIEW tnf_summit.v_dashboard_stats AS
SELECT
  COUNT(*)                                                     AS total_registrations,
  COUNT(*) FILTER (WHERE status = 'confirmed')                 AS confirmed,
  COUNT(*) FILTER (WHERE status = 'pending')                   AS pending,
  COUNT(*) FILTER (WHERE status = 'cancelled')                 AS cancelled,
  COUNT(*) FILTER (WHERE attendance_mode = 'in-person')        AS in_person,
  COUNT(*) FILTER (WHERE attendance_mode = 'virtual')          AS virtual,
  COALESCE(SUM(fee_amount) FILTER (WHERE payment_status='paid'), 0) AS total_revenue_usd,
  COUNT(DISTINCT country)                                      AS countries_represented
FROM tnf_summit.registrations;

-- ============================================================
-- 11. SEED INITIAL SPEAKERS (optional — remove if not needed)
-- ============================================================

INSERT INTO tnf_summit.speakers
  (name, title, organisation, country, session_title, session_date, session_type, status, display_order)
VALUES
  ('H.E. President Emmerson Mnangagwa', 'President of the Republic of Zimbabwe', 'Government of Zimbabwe', 'Zimbabwe', 'Official Opening Keynote Address', 'Wednesday, 23 September 2026', 'Opening Ceremony', 'confirmed', 1),
  ('Gilbert F. Houngbo', 'Director-General', 'International Labour Organization (ILO)', 'Switzerland', 'ILO Address — Future of Work & Decent Employment', 'Wednesday, 23 September 2026', 'Plenary', 'confirmed', 2),
  ('Dr Akinwumi Adesina', 'President', 'African Development Bank Group', 'Côte d''Ivoire', 'Africa''s $3.4 Trillion Investment Frontier', 'Monday, 21 September 2026', 'Keynote', 'tentative', 3),
  ('Dr John Mangudya', 'Governor', 'Reserve Bank of Zimbabwe', 'Zimbabwe', 'Digital Finance & the FinTech Revolution', 'Tuesday, 22 September 2026', 'Special Feature', 'confirmed', 4),
  ('Dr Yvonne Mkwanazi-Twala', 'Director-General', 'Zimbabwe Investment and Development Agency (ZIDA)', 'Zimbabwe', 'Investing in Zimbabwe: Project Pipeline', 'Monday, 21 September 2026', 'Special Session', 'confirmed', 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE ✓
-- Tables: registrations, speakers, sponsors, contact_messages,
--         newsletter_subscribers, site_settings
-- Views:  v_registrations_by_category, v_registrations_by_country,
--         v_dashboard_stats
-- ============================================================
