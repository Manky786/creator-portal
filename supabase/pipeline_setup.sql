-- Pipeline Projects Setup (Internal Pre-Production Tracking)
-- Run this in Supabase SQL Editor

-- 1. Create pipeline_projects table
CREATE TABLE IF NOT EXISTS pipeline_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  creator TEXT,
  culture TEXT,
  format TEXT,
  genre TEXT,
  total_budget DECIMAL(15,2) DEFAULT 0,
  episodes INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in-production', 'on-hold', 'completed')),
  production_poc TEXT,
  production_poc_phone TEXT,
  production_poc_email TEXT,
  content_poc TEXT,
  content_poc_phone TEXT,
  content_poc_email TEXT,
  logline TEXT,
  synopsis TEXT,
  language TEXT,
  production_company TEXT,
  notes TEXT,
  activity_log JSONB DEFAULT '[]',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE pipeline_projects ENABLE ROW LEVEL SECURITY;

-- 3. Create policy
DROP POLICY IF EXISTS "Allow all operations on pipeline_projects" ON pipeline_projects;
CREATE POLICY "Allow all operations on pipeline_projects" ON pipeline_projects
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_projects_status ON pipeline_projects(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_projects_culture ON pipeline_projects(culture);
CREATE INDEX IF NOT EXISTS idx_pipeline_projects_format ON pipeline_projects(format);

-- 5. Add culture column to projects if not exists
ALTER TABLE projects ADD COLUMN IF NOT EXISTS culture TEXT;

SELECT 'Pipeline setup complete!' as status;
