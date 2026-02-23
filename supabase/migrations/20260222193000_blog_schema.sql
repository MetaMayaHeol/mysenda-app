-- Migration file for Blog DB Schema (AI-SEO)
-- Creates categories and articles tables

CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    structured_data JSONB,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    published_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Public can view blog categories" ON public.blog_categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog categories" ON public.blog_categories
    FOR ALL USING (auth.uid() IS NOT NULL); -- Assuming all authenticated users can manage for this MVP, could restrict to specific roles later.

-- Articles Policies
CREATE POLICY "Public can view published blog articles" ON public.blog_articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view all blog articles" ON public.blog_articles
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage blog articles" ON public.blog_articles
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = EXCLUDED.updated_at; -- default behavior
    -- Or just enforce now()
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_categories_modtime ON public.blog_categories;
CREATE TRIGGER update_blog_categories_modtime
    BEFORE UPDATE ON public.blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_blog_articles_modtime ON public.blog_articles;
CREATE TRIGGER update_blog_articles_modtime
    BEFORE UPDATE ON public.blog_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
