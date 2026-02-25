-- Invoices and Payment Tranches Setup
-- Run this in Supabase SQL Editor

-- 1. Create invoices table if not exists
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id),
  tranche_number INTEGER NOT NULL DEFAULT 1,
  tranche_name TEXT,
  percentage DECIMAL(5,2),
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  gst_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'paid')),
  invoice_number TEXT,
  invoice_date DATE,
  due_date DATE,
  invoice_file_url TEXT,
  milestone TEXT,
  notes TEXT,
  rejection_reason TEXT,
  payment_reference TEXT,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create project_tranches table for tracking payment milestones
CREATE TABLE IF NOT EXISTS project_tranches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id),
  tranche_number INTEGER NOT NULL,
  tranche_name TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  milestone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invoice_submitted', 'approved', 'paid')),
  invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add locked_at column to projects if not exists
ALTER TABLE projects ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS locked_by UUID REFERENCES profiles(id);

-- 4. Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tranches ENABLE ROW LEVEL SECURITY;

-- 5. Create policies
DROP POLICY IF EXISTS "Allow all operations on invoices" ON invoices;
CREATE POLICY "Allow all operations on invoices" ON invoices
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on project_tranches" ON project_tranches;
CREATE POLICY "Allow all operations on project_tranches" ON project_tranches
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_creator_id ON invoices(creator_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_project_tranches_project_id ON project_tranches(project_id);

-- Done
SELECT 'Invoices setup complete!' as status;
