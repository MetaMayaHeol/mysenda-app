import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/static'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
const locales = ['es', 'fr', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient()

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/blog',
    '/faq',
    '/support',
    '/cancellation-policy',
    '/terms',
    '/privacy',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Generate static pages for all locales
  staticRoutes.forEach(route => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      })
    })
  })

  // 2. Blog Articles
  const { data: articles } = await supabase
    .from('blog_articles')
    .select('slug, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  articles?.forEach(article => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/blog/${article.slug}`,
        lastModified: new Date(article.published_at),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  })

  // Optionally add auth static route
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    })
  })

  return sitemapEntries
}
