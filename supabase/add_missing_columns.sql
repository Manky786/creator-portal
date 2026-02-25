-- Add missing columns to pipeline_projects table
-- Run this in Supabase SQL Editor

-- Add budget_breakdown column for storing budget details
ALTER TABLE pipeline_projects ADD COLUMN IF NOT EXISTS budget_breakdown JSONB;

-- Add duration column
ALTER TABLE pipeline_projects ADD COLUMN IF NOT EXISTS duration TEXT;

-- Ensure all POC columns exist
ALTER TABLE pipeline_projects ADD COLUMN IF NOT EXISTS content_poc TEXT;
ALTER TABLE pipeline_projects ADD COLUMN IF NOT EXISTS content_poc_phone TEXT;
ALTER TABLE pipeline_projects ADD COLUMN IF NOT EXISTS content_poc_email TEXT;
ALTER TABLE pipeline_projects ADD COLUMN IF NOT EXISTS production_poc TEXT;
ALTER TABLE pipeline_projects ADD COLUMN IF NOT EXISTS production_poc_phone TEXT;
ALTER TABLE pipeline_projects ADD COLUMN IF NOT EXISTS production_poc_email TEXT;

-- Notify PostgREST to refresh schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Columns added and schema refreshed!' as status;
