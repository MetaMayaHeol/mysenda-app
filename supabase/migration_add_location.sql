-- Add location fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'México';

-- Create index for faster location-based searches
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
