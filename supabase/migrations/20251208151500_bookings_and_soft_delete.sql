-- Migration: Create bookings table and soft deletes
-- Run this in Supabase SQL Editor

-- 1. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, -- The Guide who owns the service
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'pending_confirmation' CHECK (status IN ('pending_confirmation', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Indexes for performance and logic
-- Index for finding bookings by service and date (for availability check)
CREATE INDEX IF NOT EXISTS idx_bookings_service_date ON bookings(service_id, date, time) WHERE deleted_at IS NULL;

-- Index for guide dashboard
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);

-- 3. RLS Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Guides can see their own bookings
CREATE POLICY "Guides can view incoming bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Guides can update their bookings (confirm/cancel)
CREATE POLICY "Guides can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Public/System can insert bookings (Rate limiting handled in application layer)
-- We allow public insert, but they can't see them afterwards (blind insert)
CREATE POLICY "Public can insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- 4. Add soft delete column to other tables (as per plan)
ALTER TABLE services ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Update RLS for soft deletes (Existing policies need to Key Filter)
-- Note: Modifying existing policies is complex in SQL script without dropping them first.
-- For now, we will just rely on the application queries filtering `deleted_at IS NULL`
-- and update the 'Select' policies to be safe.

-- Update Service View Policy to exclude deleted
DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (active = true AND deleted_at IS NULL);

-- Update Service View Policy for Owners
DROP POLICY IF EXISTS "Users can manage own services" ON services;
CREATE POLICY "Users can manage own services" ON services
  FOR ALL USING (auth.uid() = user_id);
-- Note: Owners still see their deleted services? Or not? Usually yes, in a "Trash" view.
-- Keeping owner policy broad for now.
