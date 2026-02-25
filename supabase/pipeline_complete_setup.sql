-- Pipeline Projects Complete Setup
-- Run this in Supabase SQL Editor to fix missing columns

-- Drop and recreate the table with all columns
DROP TABLE IF EXISTS pipeline_projects;

CREATE TABLE pipeline_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  creator TEXT,
  culture TEXT,
  format TEXT,
  total_budget DECIMAL(15,2) DEFAULT 0,
  budget_breakdown JSONB DEFAULT '{}',
  episodes INTEGER,
  duration TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in-production', 'on-hold', 'completed')),
  production_poc TEXT,
  production_poc_phone TEXT,
  production_poc_email TEXT,
  content_poc TEXT,
  content_poc_phone TEXT,
  content_poc_email TEXT,
  production_company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pipeline_projects ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations
DROP POLICY IF EXISTS "Allow all operations on pipeline_projects" ON pipeline_projects;
CREATE POLICY "Allow all operations on pipeline_projects" ON pipeline_projects
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pipeline_status ON pipeline_projects(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_culture ON pipeline_projects(culture);
CREATE INDEX IF NOT EXISTS idx_pipeline_format ON pipeline_projects(format);
CREATE INDEX IF NOT EXISTS idx_pipeline_prod_poc ON pipeline_projects(production_poc);
CREATE INDEX IF NOT EXISTS idx_pipeline_content_poc ON pipeline_projects(content_poc);

-- Notify PostgREST to refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Insert 3 sample projects
INSERT INTO pipeline_projects (project_name, creator, culture, format, total_budget, budget_breakdown, episodes, production_poc, content_poc, status, production_company) VALUES
('Dhakad Chhora', 'Raj Kumar Productions', 'Haryanvi', 'Feature Film', 15000000, '{"celebrity_fee": 5000000, "overhead_cost": 1500000, "production_cost": 4000000, "post_production": 2500000, "marketing": 1500000, "others": 500000}', NULL, 'Mayank', 'Haidar', 'approved', 'Haryana Films'),
('Rajputana Pride', 'Vikram Singh Films', 'Rajasthani', 'Long Series', 25000000, '{"celebrity_fee": 8000000, "overhead_cost": 3000000, "production_cost": 7000000, "post_production": 4000000, "marketing": 2500000, "others": 500000}', 12, 'Haidar', 'Sumeet', 'in-production', 'Royal Productions'),
('Bhojpuri Beats', 'Ravi Kishan Entertainment', 'Bhojpuri', 'Binge Series', 8000000, '{"celebrity_fee": 2500000, "overhead_cost": 800000, "production_cost": 2500000, "post_production": 1200000, "marketing": 800000, "others": 200000}', 8, 'Sumeet', 'Mayank', 'pending', 'Bihar Studios');

SELECT 'Pipeline setup complete with 3 sample projects!' as status;
