-- Add active column to public_links table
ALTER TABLE public_links 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Update existing records to be active by default
UPDATE public_links SET active = true WHERE active IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_public_links_active ON public_links(active);
