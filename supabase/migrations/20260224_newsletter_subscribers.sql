-- Newsletter Subscribers table
-- Run this migration in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'es',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT DEFAULT 'blog',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon (for the public signup form)
CREATE POLICY "Allow anonymous inserts" ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access (for admin/API operations)
CREATE POLICY "Allow service role all" ON newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to check if email exists (for duplicate detection)
CREATE POLICY "Allow anon select by email" ON newsletter_subscribers
  FOR SELECT
  TO anon
  USING (true);

-- Allow anon to update status (for re-activation)
CREATE POLICY "Allow anon update status" ON newsletter_subscribers
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
