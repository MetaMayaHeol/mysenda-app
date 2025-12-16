-- Migration: Add automatic purge function for soft-deleted services
-- Run this in Supabase SQL Editor

-- Create a function to purge old soft-deleted services
CREATE OR REPLACE FUNCTION purge_old_deleted_services(days_threshold INTEGER DEFAULT 30)
RETURNS TABLE(purged_count INTEGER, purged_ids UUID[]) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_ids UUID[];
  count_deleted INTEGER;
BEGIN
  -- Get IDs of services to be purged
  SELECT ARRAY_AGG(id) INTO deleted_ids
  FROM services
  WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - (days_threshold || ' days')::INTERVAL;

  -- If no services to purge, return early
  IF deleted_ids IS NULL OR array_length(deleted_ids, 1) IS NULL THEN
    RETURN QUERY SELECT 0::INTEGER, ARRAY[]::UUID[];
    RETURN;
  END IF;

  -- Delete the services (CASCADE will handle related records)
  DELETE FROM services
  WHERE id = ANY(deleted_ids);

  GET DIAGNOSTICS count_deleted = ROW_COUNT;

  RETURN QUERY SELECT count_deleted, deleted_ids;
END;
$$;

-- Grant execute permission to authenticated users (for admin endpoint)
GRANT EXECUTE ON FUNCTION purge_old_deleted_services TO authenticated;

-- Optional: Create a scheduled job using pg_cron (if extension is enabled)
-- Note: pg_cron might not be available on all Supabase plans
-- Uncomment the following if you have pg_cron enabled:

-- SELECT cron.schedule(
--   'purge-deleted-services',    -- job name
--   '0 3 * * *',                 -- every day at 3 AM UTC
--   $$SELECT purge_old_deleted_services(30)$$
-- );

-- To check if pg_cron is available:
-- SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- To list scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove a scheduled job:
-- SELECT cron.unschedule('purge-deleted-services');
