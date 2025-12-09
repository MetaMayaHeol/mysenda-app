import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cities, getCityBySlug } from '@/lib/seo/cities'
import { activities } from '@/lib/seo/activities'
import { CityHero } from '@/components/seo/CityHero'
import { GuideCard } from '@/components/directory/GuideCard'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateTouristDestinationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/structured-data'
import { generateCityFAQs } from '@/lib/seo/faq-generator'
import { FAQSection } from '@/components/seo/FAQSection'

export const revalidate = 60 // Revalidate every minute

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

// Generate static params for all cities and locales
export async function generateStaticParams() {
  const locales = ['es', 'fr']
  const params: { slug: string; locale: string }[] = []
  
  for (const locale of locales) {
    for (const city of cities) {
      params.push({ slug: city.slug, locale })
    }
  }
  
  return params
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const city = getCityBySlug(slug)
  const t = await getTranslations({ locale, namespace: 'cityPage' })
  
  if (!city) {
    return {
      title: t('notFound'),
    }
  }

  // Get city translations
  const tCity = await getTranslations({ locale, namespace: `cities.${city.slug}` })
  const cityName = tCity('name')
  const cityDescription = tCity('description')
  const cityMetaDescription = tCity('metaDescription')
  const cityHighlights = tCity('highlights').split('|')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'

  return {
    title: t('metaTitle', { city: cityName }),
    description: cityMetaDescription,
    keywords: [...cityHighlights, cityName, city.state, 'guías turísticos', 'tours'],
    openGraph: {
      title: t('metaTitle', { city: cityName }),
      description: cityMetaDescription,
      url: `${baseUrl}/${locale}/ciudad/${slug}`,
      siteName: 'MySenda',
      locale: locale === 'fr' ? 'fr_FR' : 'es_MX',
      type: 'website',
      images: city.heroImage ? [
        {
          url: `${baseUrl}${city.heroImage}`,
          width: 1200,
          height: 630,
          alt: `${cityName}, ${city.state}`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('localGuides', { city: cityName }),
      description: cityMetaDescription,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/ciudad/${slug}`,
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  
  const city = getCityBySlug(slug)
  const t = await getTranslations('cityPage')
  
  if (!city) {
    notFound()
  }

  // Get city translations
  const tCity = await getTranslations(`cities.${city.slug}`)
  const cityName = tCity('name')
  const cityDescription = tCity('description')
  const cityHighlights = tCity('highlights').split('|')
  
  // Get activities translations
  const tActivities = await getTranslations('activities')

  // Fetch guides who have active services in this city
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Query services that include this city in their locations
  const { data: services } = await supabase
    .from('services')
    .select(`
      user:users!inner (
        name,
        bio,
        photo_url,
        languages,
        city,
        country,
        is_verified,
        public_links!inner (
          slug,
          active
        )
      )
    `)
    .contains('locations', [city.name]) // Keep using canonical name for DB query
    .eq('active', true)
    .eq('user.public_links.active', true)
    .limit(50)

  // Deduplicate guides
  const uniqueGuidesMap = new Map()
  
  services?.forEach((service: any) => {
    if (service.user?.public_links?.[0]) {
      const guide = {
        slug: service.user.public_links[0].slug,
        name: service.user.name || 'Guía MySenda',
        bio: service.user.bio,
        photo_url: service.user.photo_url,
        languages: service.user.languages,
        city: service.user.city,
        country: service.user.country,
        is_verified: service.user.is_verified,
      }
      if (!uniqueGuidesMap.has(guide.slug)) {
        uniqueGuidesMap.set(guide.slug, guide)
      }
    }
  })

  const formattedGuides = Array.from(uniqueGuidesMap.values())

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
  const cityUrl = `${baseUrl}/${locale}/ciudad/${slug}`

  // Generate FAQs
  const faqs = generateCityFAQs(cityName)
  const faqSchema = generateFAQSchema(faqs)

  // Generate structured data
  const destinationSchema = generateTouristDestinationSchema({
    name: cityName,
    description: cityDescription,
    url: cityUrl,
    image: city.heroImage ? `${baseUrl}${city.heroImage}` : undefined,
    address: {
      addressLocality: cityName,
      addressRegion: city.state,
      addressCountry: 'MX'
    }
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t('breadcrumbHome'), url: `${baseUrl}/${locale}` },
    { name: t('breadcrumbExplore'), url: `${baseUrl}/${locale}/explorar` },
    { name: cityName, url: cityUrl }
  ])

  // Get FAQ translations
  const tFaq = await getTranslations('cityFaq')
  const localizedFaqs = [
    { question: tFaq('bestTime', { city: cityName }), answer: tFaq('bestTimeAnswer', { city: cityName }) },
    { question: tFaq('needGuide', { city: cityName }), answer: tFaq('needGuideAnswer', { city: cityName }) },
    { question: tFaq('mustDo', { city: cityName }), answer: tFaq('mustDoAnswer', { city: cityName }) },
    { question: tFaq('isSafe', { city: cityName }), answer: tFaq('isSafeAnswer', { city: cityName }) },
    { question: tFaq('findGuides', { city: cityName }), answer: tFaq('findGuidesAnswer', { city: cityName }) },
  ]

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={destinationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      
      {/* Hero Section */}
      <CityHero 
        city={{...city, name: cityName, description: cityDescription, highlights: cityHighlights}}
        guideCount={formattedGuides.length}
        activityCount={cityHighlights.length}
        translations={{
          heroTitle: t('heroTitle'),
          localGuidesCount: t('localGuidesCount'),
          tourTypesCount: t('tourTypesCount'),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-green-600">{t('breadcrumbHome')}</Link>
            <span>/</span>
            <Link href={`/${locale}/explorar`} className="hover:text-green-600">{t('breadcrumbExplore')}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{cityName}</span>
          </div>
        </div>
      </div>

      {/* Guides Section */}
      <div className="py-16">
        <div className="container mx-auto px-5">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('localGuides', { city: cityName })}
            </h2>
            <p className="text-xl text-gray-600">
              {t('localGuidesDesc', { city: cityName })}
            </p>
          </div>

          {formattedGuides.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {formattedGuides.map((guide) => (
                  <GuideCard key={guide.slug} guide={guide} />
                ))}
              </div>

              <div className="text-center">
                <Link href={`/${locale}/explorar`}>
                  <Button variant="outline" className="gap-2">
                    {t('viewAllGuides')}
                    <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-600 mb-4">
                {t('noGuidesYet', { city: cityName })}
              </p>
              <Link href={`/${locale}/auth/login`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  {t('registerAsGuide')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-5">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>{t('whyVisit', { city: cityName })}</h2>
            <p className="text-gray-700 leading-relaxed">
              {cityDescription} {t('withRutaLink', { city: cityName })}
            </p>

            <h3>{t('featuredExperiences')}</h3>
            <ul>
              {cityHighlights.map((highlight, index) => (
                <li key={index}><strong>{highlight}</strong>: {t('discoverWith', { highlight: highlight.toLowerCase() })}</li>
              ))}
            </ul>

            <h3>{t('toursAndActivities', { city: cityName })}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('toursDesc', { city: cityName })}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection title={t('faqTitle', { city: cityName })} faqs={localizedFaqs} />

      {/* Popular Activities Internal Linking */}
      <div className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('popularActivities')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activities.map((activity) => (
              <Link 
                key={activity.slug} 
                href={`/${locale}/actividad/${activity.slug}`}
                className="group p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors border border-gray-100 hover:border-green-200"
              >
                <h3 className="font-medium text-gray-900 group-hover:text-green-700 text-center">
                  {tActivities(`${activity.slug}.name`)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('areYouGuide', { city: cityName })}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('joinRutaLink')}
          </p>
          <Link href={`/${locale}/auth/login`}>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 text-lg rounded-full">
              {t('createProfileFree')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
