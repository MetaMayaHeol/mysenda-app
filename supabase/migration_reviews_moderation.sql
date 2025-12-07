-- Add moderation and rate limiting to reviews

-- 1. Add approved column (default false, admin must approve)
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- 2. Add reviewer_identifier for basic rate limiting
-- This stores a hash of IP or similar to prevent duplicate reviews
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS reviewer_identifier TEXT;

-- 3. Update RLS Policy to only show approved reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Approved reviews are viewable by everyone" ON public.reviews;

CREATE POLICY "Approved reviews are viewable by everyone" 
ON public.reviews FOR SELECT 
USING (approved = true);

-- 4. Create index for faster moderation queries
CREATE INDEX IF NOT EXISTS reviews_approved_idx ON public.reviews(approved);
CREATE INDEX IF NOT EXISTS reviews_identifier_guide_idx ON public.reviews(reviewer_identifier, guide_id);

-- Note: To approve reviews, you can run:
-- UPDATE reviews SET approved = true WHERE id = 'review-id-here';
-- Or approve all: UPDATE reviews SET approved = true;
