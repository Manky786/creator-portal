-- Create invite_activities table for tracking invite activity
CREATE TABLE IF NOT EXISTS invite_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID REFERENCES creator_invites(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_invite_activities_invite_id ON invite_activities(invite_id);
CREATE INDEX IF NOT EXISTS idx_invite_activities_created_at ON invite_activities(created_at DESC);

-- Allow all operations for now (you can restrict later)
ALTER TABLE invite_activities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations on invite_activities" ON invite_activities
  FOR ALL USING (true) WITH CHECK (true);
