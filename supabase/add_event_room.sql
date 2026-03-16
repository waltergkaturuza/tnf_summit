-- Add event_room to updates (optional, for multi-room programmes)
ALTER TABLE tnf_summit.updates ADD COLUMN IF NOT EXISTS event_room TEXT;
