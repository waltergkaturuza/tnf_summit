-- ============================================================
-- TNF Summit — Updates: categories, likes/dislikes, comments
-- Run after updates_table.sql and track_id_and_abstracts.sql
-- ============================================================
SET search_path TO tnf_summit, public;

-- 1) Add category to updates
ALTER TABLE tnf_summit.updates
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'News';

CREATE INDEX IF NOT EXISTS idx_updates_category ON tnf_summit.updates (category);

-- 2) Reactions (like/dislike) — one per update per voter (voter_key = cookie/localStorage)
CREATE TABLE IF NOT EXISTS tnf_summit.update_reactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id  UUID NOT NULL REFERENCES tnf_summit.updates(id) ON DELETE CASCADE,
  voter_key  TEXT NOT NULL,
  is_like    BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(update_id, voter_key)
);

CREATE INDEX IF NOT EXISTS idx_update_reactions_update_id ON tnf_summit.update_reactions (update_id);

ALTER TABLE tnf_summit.update_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reactions" ON tnf_summit.update_reactions;
DROP POLICY IF EXISTS "public_insert_reactions" ON tnf_summit.update_reactions;
DROP POLICY IF EXISTS "public_update_own_reaction" ON tnf_summit.update_reactions;
DROP POLICY IF EXISTS "public_delete_own_reaction" ON tnf_summit.update_reactions;
CREATE POLICY "public_read_reactions"
  ON tnf_summit.update_reactions FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "public_insert_reactions"
  ON tnf_summit.update_reactions FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "public_update_own_reaction"
  ON tnf_summit.update_reactions FOR UPDATE TO anon, authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "public_delete_own_reaction"
  ON tnf_summit.update_reactions FOR DELETE TO anon, authenticated USING (TRUE);

-- 3) Comments — optional author name, anonymous flag
CREATE TABLE IF NOT EXISTS tnf_summit.update_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id   UUID NOT NULL REFERENCES tnf_summit.updates(id) ON DELETE CASCADE,
  author_name TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT update_comments_content_not_empty CHECK (content <> '')
);

CREATE INDEX IF NOT EXISTS idx_update_comments_update_id ON tnf_summit.update_comments (update_id);
CREATE INDEX IF NOT EXISTS idx_update_comments_created ON tnf_summit.update_comments (created_at DESC);

ALTER TABLE tnf_summit.update_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_comments" ON tnf_summit.update_comments;
DROP POLICY IF EXISTS "public_insert_comments" ON tnf_summit.update_comments;
CREATE POLICY "public_read_comments"
  ON tnf_summit.update_comments FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "public_insert_comments"
  ON tnf_summit.update_comments FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
