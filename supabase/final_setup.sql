-- FINAL SETUP SQL - Run this in Supabase SQL Editor
-- This enables all necessary tables and policies

-- 1. Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Enable RLS on activity_log table
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on activity_log" ON activity_log;
CREATE POLICY "Allow all operations on activity_log" ON activity_log
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on profiles" ON profiles;
CREATE POLICY "Allow all operations on profiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Make sure creator_invites has all columns
ALTER TABLE creator_invites ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE creator_invites ADD COLUMN IF NOT EXISTS subject TEXT;

-- 5. Enable RLS on creator_invites
DROP POLICY IF EXISTS "Allow all operations on creator_invites" ON creator_invites;
CREATE POLICY "Allow all operations on creator_invites" ON creator_invites
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Create invite_activities table if not exists
CREATE TABLE IF NOT EXISTS invite_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID REFERENCES creator_invites(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE invite_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on invite_activities" ON invite_activities;
CREATE POLICY "Allow all operations on invite_activities" ON invite_activities
  FOR ALL USING (true) WITH CHECK (true);

-- Done! All tables are now accessible.
SELECT 'Setup Complete!' as status;
