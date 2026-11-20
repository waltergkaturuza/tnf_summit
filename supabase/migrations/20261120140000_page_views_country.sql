-- Country is resolved from the visitor IP at request time. The IP itself is not stored.
ALTER TABLE tnf_summit.page_views
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT '';
