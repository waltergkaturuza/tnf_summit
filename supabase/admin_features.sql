-- ============================================================
--  TNF Global Summit 2026 — Admin Features
--  Run AFTER schema.sql and additions.sql
--  Tables: admin_users, audit_trail, invoices
-- ============================================================

SET search_path TO tnf_summit, public;

-- ============================================================
-- 1. ADMIN USERS (roles on top of Supabase Auth)
-- ============================================================

CREATE TYPE tnf_summit.admin_role AS ENUM (
  'super_admin', 'admin', 'editor', 'viewer'
);

CREATE TABLE IF NOT EXISTS tnf_summit.admin_users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,           -- links to auth.users.id
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  email        TEXT NOT NULL UNIQUE,
  full_name    TEXT NOT NULL DEFAULT '',
  role         tnf_summit.admin_role NOT NULL DEFAULT 'viewer',
  department   TEXT DEFAULT '',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  last_seen_at TIMESTAMPTZ,

  CONSTRAINT admin_users_email_not_empty CHECK (email <> '')
);

CREATE INDEX idx_admin_users_email ON tnf_summit.admin_users (email);
CREATE INDEX idx_admin_users_role  ON tnf_summit.admin_users (role);

CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON tnf_summit.admin_users
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

-- Seed the first super admin (update email to match your Supabase auth user)
INSERT INTO tnf_summit.admin_users (email, full_name, role, department)
VALUES ('admin@tnfsummit.com', 'TNF Administrator', 'super_admin', 'ICT & Systems')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- 2. AUDIT TRAIL
-- ============================================================

CREATE TYPE tnf_summit.audit_action AS ENUM (
  'login', 'logout',
  'registration_created', 'registration_updated', 'registration_deleted',
  'speaker_created',      'speaker_updated',       'speaker_deleted',
  'sponsor_created',      'sponsor_updated',        'sponsor_deleted',
  'message_replied',      'message_deleted',
  'subscriber_added',     'subscriber_removed',
  'media_uploaded',       'media_deleted',
  'invoice_generated',    'invoice_marked_paid',    'payment_updated',
  'settings_updated',     'user_created',            'user_updated',    'user_deleted'
);

CREATE TABLE IF NOT EXISTS tnf_summit.audit_trail (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  action       tnf_summit.audit_action NOT NULL,
  entity_type  TEXT DEFAULT '',          -- e.g. registration, speaker, etc.
  entity_id    TEXT DEFAULT '',          -- UUID of affected record
  entity_label TEXT DEFAULT '',          -- Human-readable label, e.g. "John Doe"

  performed_by TEXT NOT NULL DEFAULT 'system',  -- admin email
  ip_address   TEXT DEFAULT '',
  details      JSONB DEFAULT '{}'
);

CREATE INDEX idx_audit_created    ON tnf_summit.audit_trail (created_at DESC);
CREATE INDEX idx_audit_action     ON tnf_summit.audit_trail (action);
CREATE INDEX idx_audit_performed  ON tnf_summit.audit_trail (performed_by);
CREATE INDEX idx_audit_entity     ON tnf_summit.audit_trail (entity_type, entity_id);

-- ============================================================
-- 3. INVOICES
-- ============================================================

CREATE TYPE tnf_summit.invoice_status AS ENUM (
  'draft', 'sent', 'paid', 'overdue', 'cancelled'
);

CREATE TABLE IF NOT EXISTS tnf_summit.invoices (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  invoice_number   TEXT NOT NULL UNIQUE,          -- INV-2026-0001
  registration_id  UUID REFERENCES tnf_summit.registrations(id) ON DELETE SET NULL,

  -- Payee info
  payee_name       TEXT NOT NULL DEFAULT '',
  payee_email      TEXT NOT NULL DEFAULT '',
  payee_org        TEXT DEFAULT '',
  payee_address    TEXT DEFAULT '',
  payee_country    TEXT DEFAULT '',

  -- Line items stored as JSONB array
  -- [{description, quantity, unit_price, total}]
  line_items       JSONB NOT NULL DEFAULT '[]',

  -- Totals
  subtotal_usd     INTEGER NOT NULL DEFAULT 0,    -- cents
  discount_usd     INTEGER NOT NULL DEFAULT 0,
  tax_usd          INTEGER NOT NULL DEFAULT 0,
  total_usd        INTEGER NOT NULL DEFAULT 0,    -- cents

  currency         TEXT NOT NULL DEFAULT 'USD',
  status           tnf_summit.invoice_status NOT NULL DEFAULT 'draft',

  due_date         DATE,
  paid_at          TIMESTAMPTZ,
  payment_method   TEXT DEFAULT '',
  payment_ref      TEXT DEFAULT '',               -- bank transfer ref, etc.

  notes            TEXT DEFAULT '',
  pdf_url          TEXT DEFAULT '',

  CONSTRAINT invoices_number_not_empty CHECK (invoice_number <> '')
);

CREATE INDEX idx_invoices_status      ON tnf_summit.invoices (status);
CREATE INDEX idx_invoices_reg         ON tnf_summit.invoices (registration_id);
CREATE INDEX idx_invoices_email       ON tnf_summit.invoices (payee_email);
CREATE INDEX idx_invoices_created     ON tnf_summit.invoices (created_at DESC);

CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON tnf_summit.invoices
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

-- Auto-generate invoice numbers
CREATE SEQUENCE IF NOT EXISTS tnf_summit.invoice_seq START 1;

CREATE OR REPLACE FUNCTION tnf_summit.next_invoice_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'INV-2026-' || LPAD(nextval('tnf_summit.invoice_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 4. SITE SETTINGS — extend with new keys
-- ============================================================

INSERT INTO tnf_summit.site_settings (key, value) VALUES
  -- Conference info
  ('conference_name',        'TNF Global Summit on Inclusive Growth, Decent Work & Investment Promotion'),
  ('conference_theme',       'Inclusive Growth, Decent Work & Investment Promotion'),
  ('conference_start_date',  '2026-09-20'),
  ('conference_end_date',    '2026-09-26'),
  ('conference_year',        '2026'),
  ('conference_edition',     '11th'),

  -- Venue
  ('venue_name',     'Elephant Hills Resort'),
  ('venue_city',     'Victoria Falls'),
  ('venue_country',  'Zimbabwe'),
  ('venue_address',  'Elephant Hills Drive, Victoria Falls, Zimbabwe'),

  -- Contact
  ('contact_email',   'info@tnfzim.com'),
  ('contact_phone',   '+263 242 783 030'),
  ('contact_website', 'https://tnfzim.com'),

  -- Registration
  ('early_bird_deadline',    '2026-06-30'),
  ('registration_deadline',  '2026-09-10'),
  ('registration_open',      'true'),
  ('max_delegates',          '2000'),
  ('registration_note',      ''),

  -- Payment
  ('payment_bank_name',      'First Capital Bank Zimbabwe'),
  ('payment_account_name',   'Tripartite Negotiating Forum'),
  ('payment_account_number', ''),
  ('payment_branch_code',    ''),
  ('payment_swift',          ''),
  ('payment_currency',       'USD'),
  ('invoice_prefix',         'INV-2026'),
  ('invoice_footer_note',    'Thank you for supporting the TNF Global Summit 2026.'),
  ('vat_rate',               '0'),

  -- Social
  ('social_twitter',  'https://twitter.com/tnfzim'),
  ('social_facebook', 'https://facebook.com/tnfzim'),
  ('social_linkedin', 'https://linkedin.com/company/tnfzim'),
  ('social_youtube',  'https://youtube.com/@tnfzim'),

  -- Toggles
  ('show_speakers_page',    'true'),
  ('show_program_page',     'true'),
  ('show_sponsors_page',    'true'),
  ('show_gallery_page',     'true'),
  ('maintenance_mode',      'false'),
  ('announcement_banner',   '')

ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE tnf_summit.admin_users  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.audit_trail  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.invoices     ENABLE ROW LEVEL SECURITY;

-- Admin users: authenticated only
CREATE POLICY "admin_all_admin_users"
  ON tnf_summit.admin_users FOR ALL
  TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Audit trail: authenticated can insert + read
CREATE POLICY "admin_all_audit"
  ON tnf_summit.audit_trail FOR ALL
  TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "system_insert_audit"
  ON tnf_summit.audit_trail FOR INSERT
  TO anon WITH CHECK (TRUE);

-- Invoices: authenticated only
CREATE POLICY "admin_all_invoices"
  ON tnf_summit.invoices FOR ALL
  TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- 6. VIEWS
-- ============================================================

-- Payment summary across registrations
CREATE OR REPLACE VIEW tnf_summit.v_payment_summary AS
SELECT
  COUNT(*)                                                       AS total_registrations,
  COUNT(*) FILTER (WHERE payment_status = 'paid')                AS paid,
  COUNT(*) FILTER (WHERE payment_status = 'unpaid')              AS unpaid,
  COUNT(*) FILTER (WHERE payment_status = 'partial')             AS partial,
  COALESCE(SUM(fee_amount), 0)                                   AS total_expected_usd,
  COALESCE(SUM(fee_amount) FILTER (WHERE payment_status='paid'), 0) AS total_collected_usd,
  COALESCE(SUM(fee_amount) FILTER (WHERE payment_status='unpaid'), 0) AS total_outstanding_usd
FROM tnf_summit.registrations
WHERE status <> 'cancelled';

-- Invoice summary
CREATE OR REPLACE VIEW tnf_summit.v_invoice_summary AS
SELECT
  COUNT(*)                                          AS total_invoices,
  COUNT(*) FILTER (WHERE status = 'paid')           AS paid,
  COUNT(*) FILTER (WHERE status = 'sent')           AS sent,
  COUNT(*) FILTER (WHERE status = 'overdue')        AS overdue,
  COUNT(*) FILTER (WHERE status = 'draft')          AS draft,
  COALESCE(SUM(total_usd) FILTER (WHERE status = 'paid'), 0)    AS collected_cents,
  COALESCE(SUM(total_usd) FILTER (WHERE status IN ('sent','overdue')), 0) AS outstanding_cents
FROM tnf_summit.invoices;

-- ============================================================
-- DONE ✓
-- Tables: admin_users, audit_trail, invoices
-- New settings keys: 30+ site settings
-- Views: v_payment_summary, v_invoice_summary
-- ============================================================
