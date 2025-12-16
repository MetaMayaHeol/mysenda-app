-- Fix RLS for cities table to allow authenticated users to insert new cities
-- This enables guides to create services in cities that don't exist yet

-- Allow authenticated users to insert new cities
CREATE POLICY "Authenticated users can insert cities"
  ON public.cities FOR INSERT
  TO authenticated
  WITH CHECK (true);
