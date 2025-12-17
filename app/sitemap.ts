import { MetadataRoute } from 'next'
import { getAllCitiesResults } from '@/lib/seo/cities-db'
import { activities } from '@/lib/seo/activities'
import { createStaticClient } from '@/lib/supabase/static'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
const locales = ['es', 'fr', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient()

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/explorar',
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

  // 2. Cities
  const citiesData = await getAllCitiesResults()
  
  citiesData.forEach(city => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/ciudad/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  })

  // 3. Activities
  activities.forEach(act => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/actividad/${act.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  // 4. Dynamic Services
  const { data: services } = await supabase
    .from('services')
    .select('id, updated_at')
    .is('deleted_at', null)
    .limit(1000)

  services?.forEach(service => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/s/${service.id}`,
        lastModified: new Date(service.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  })

  // 5. Dynamic Guides
  const { data: guides } = await supabase
    .from('public_links')
    .select('slug, updated_at')
    .eq('active', true)
    
  guides?.forEach(guide => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/g/${guide.slug}`,
        lastModified: new Date(guide.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  return sitemapEntries
}
