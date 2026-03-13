-- ============================================================
--  TNF Global Summit 2026 — Additions: Analytics + Media Storage
--  Run this in Supabase SQL Editor AFTER running schema.sql
-- ============================================================

SET search_path TO tnf_summit, public;

-- ============================================================
-- 1. PAGE ANALYTICS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS tnf_summit.page_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  page_path   TEXT NOT NULL,
  referrer    TEXT DEFAULT '',
  session_id  TEXT DEFAULT '',
  device_type TEXT DEFAULT '',   -- desktop | mobile | tablet
  country     TEXT DEFAULT ''
);

CREATE INDEX idx_page_views_created  ON tnf_summit.page_views (created_at DESC);
CREATE INDEX idx_page_views_path     ON tnf_summit.page_views (page_path);
CREATE INDEX idx_page_views_session  ON tnf_summit.page_views (session_id);

-- ============================================================
-- 2. MEDIA / FILE LIBRARY TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS tnf_summit.media_files (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  bucket_name  TEXT NOT NULL,                   -- tnf-gallery | tnf-documents | tnf-speakers | tnf-resources
  file_path    TEXT NOT NULL UNIQUE,            -- full path inside bucket
  file_name    TEXT NOT NULL,
  original_name TEXT NOT NULL DEFAULT '',
  mime_type    TEXT DEFAULT '',
  size_bytes   BIGINT DEFAULT 0,
  media_type   TEXT NOT NULL DEFAULT 'image',  -- image | video | document | audio

  alt_text     TEXT DEFAULT '',
  caption      TEXT DEFAULT '',
  category     TEXT DEFAULT 'gallery',          -- gallery | speakers | documents | resources | sponsors

  public_url   TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',

  is_published BOOLEAN DEFAULT TRUE,
  sort_order   INTEGER DEFAULT 0,
  uploaded_by  TEXT DEFAULT 'admin',

  CONSTRAINT media_files_path_not_empty CHECK (file_path <> '')
);

CREATE INDEX idx_media_category   ON tnf_summit.media_files (category);
CREATE INDEX idx_media_type       ON tnf_summit.media_files (media_type);
CREATE INDEX idx_media_published  ON tnf_summit.media_files (is_published);
CREATE INDEX idx_media_created    ON tnf_summit.media_files (created_at DESC);

CREATE TRIGGER trg_media_updated_at
  BEFORE UPDATE ON tnf_summit.media_files
  FOR EACH ROW EXECUTE FUNCTION tnf_summit.set_updated_at();

-- ============================================================
-- 3. ANALYTICS VIEWS
-- ============================================================

-- Total views today
CREATE OR REPLACE VIEW tnf_summit.v_views_today AS
SELECT COUNT(*) AS total
FROM tnf_summit.page_views
WHERE created_at >= CURRENT_DATE;

-- Views per day (last 30 days)
CREATE OR REPLACE VIEW tnf_summit.v_views_per_day AS
SELECT
  DATE(created_at) AS view_date,
  COUNT(*)          AS total_views,
  COUNT(DISTINCT session_id) FILTER (WHERE session_id <> '') AS unique_sessions
FROM tnf_summit.page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY view_date ASC;

-- Top pages (last 14 days)
CREATE OR REPLACE VIEW tnf_summit.v_top_pages AS
SELECT
  page_path,
  COUNT(*) AS views
FROM tnf_summit.page_views
WHERE created_at >= NOW() - INTERVAL '14 days'
GROUP BY page_path
ORDER BY views DESC
LIMIT 20;

-- Device breakdown
CREATE OR REPLACE VIEW tnf_summit.v_device_breakdown AS
SELECT
  COALESCE(NULLIF(device_type, ''), 'unknown') AS device_type,
  COUNT(*) AS views
FROM tnf_summit.page_views
WHERE created_at >= NOW() - INTERVAL '14 days'
GROUP BY device_type;

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE tnf_summit.page_views  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnf_summit.media_files ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (tracking)
CREATE POLICY "public_insert_page_views"
  ON tnf_summit.page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- Only admins can read analytics
CREATE POLICY "admin_read_page_views"
  ON tnf_summit.page_views FOR SELECT
  TO authenticated
  USING (TRUE);

-- Media: admins full access
CREATE POLICY "admin_all_media"
  ON tnf_summit.media_files FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Public can read published media
CREATE POLICY "public_read_published_media"
  ON tnf_summit.media_files FOR SELECT
  TO anon
  USING (is_published = TRUE);

-- ============================================================
-- 5. STORAGE BUCKETS
--    Supabase creates buckets via the Dashboard or this SQL.
--    Run each INSERT to create the bucket.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('tnf-gallery',   'tnf-gallery',   TRUE, 52428800,  -- 50 MB
   ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm']),
  ('tnf-documents', 'tnf-documents', TRUE, 52428800,
   ARRAY['application/pdf','application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'application/vnd.ms-powerpoint',
         'application/vnd.openxmlformats-officedocument.presentationml.presentation',
         'application/vnd.ms-excel',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('tnf-speakers',  'tnf-speakers',  TRUE, 10485760,  -- 10 MB
   ARRAY['image/jpeg','image/jpg','image/png','image/webp']),
  ('tnf-resources', 'tnf-resources', TRUE, 52428800,
   ARRAY['image/jpeg','image/png','image/webp','application/pdf',
         'video/mp4','video/webm','audio/mpeg','audio/mp3'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public read (buckets are public=true so this is automatic)
-- Authenticated users can upload/delete
CREATE POLICY "admin_upload_gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('tnf-gallery','tnf-documents','tnf-speakers','tnf-resources'));

CREATE POLICY "admin_delete_gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('tnf-gallery','tnf-documents','tnf-speakers','tnf-resources'));

CREATE POLICY "admin_update_gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('tnf-gallery','tnf-documents','tnf-speakers','tnf-resources'));

CREATE POLICY "public_read_gallery"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('tnf-gallery','tnf-documents','tnf-speakers','tnf-resources'));

-- ============================================================
-- DONE ✓
-- New tables: page_views, media_files
-- New views:  v_views_today, v_views_per_day, v_top_pages, v_device_breakdown
-- Storage buckets: tnf-gallery, tnf-documents, tnf-speakers, tnf-resources
-- ============================================================
