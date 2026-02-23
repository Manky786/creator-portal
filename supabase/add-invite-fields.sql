-- Add subject and message columns to creator_invites table
-- Run this in Supabase SQL Editor

ALTER TABLE creator_invites
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS message TEXT;
