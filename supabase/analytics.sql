-- Create analytics table
DROP TABLE IF EXISTS analytics CASCADE;
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL CHECK (page_type IN ('profile', 'service')),
  resource_id UUID, -- Can be service_id or NULL for profile
  viewer_hash TEXT NOT NULL, -- Anonymized hash of IP+UA+Date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_page_type ON analytics(page_type);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Policies

-- Guides can view their own analytics
CREATE POLICY "Guides can view own analytics"
ON analytics FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can insert analytics (for tracking)
-- We use a function or just allow insert for anon if we want client-side tracking,
-- but for server-side tracking (which we will use), we bypass RLS with service role.
-- However, if we use client-side invocation, we might need this.
-- For now, we will rely on Server Actions using Service Role to insert, 
-- so we don't strictly need an INSERT policy for public.
-- But let's add one just in case we switch to client-side RLS insert later.
CREATE POLICY "Public can insert analytics"
ON analytics FOR INSERT
WITH CHECK (true);
