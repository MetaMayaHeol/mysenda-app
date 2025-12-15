import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { activities, getActivityBySlug } from '@/lib/seo/activities'
import { getAllCitiesResults } from '@/lib/seo/cities-db'


import { ActivityHero } from '@/components/seo/ActivityHero'
import { TourCard } from '@/components/directory/TourCard'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateTouristAttractionSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/structured-data'
import { FAQSection } from '@/components/seo/FAQSection'

export const revalidate = 60 // Revalidate every minute

// Types for Supabase service query response
interface ServicePhoto {
  url: string
  order: number
}

interface ServiceResponse {
  id: string
  title: string
  description: string | null
  price: number
  duration: number
  service_photos: ServicePhoto[]
  user: {
    name: string | null
    photo_url: string | null
    is_verified: boolean
    public_links: { slug: string; active: boolean }[]
  }
}

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

// Generate static params for all activities and locales
export async function generateStaticParams() {
  const locales = ['es', 'fr']
  const params: { slug: string; locale: string }[] = []
  
  for (const locale of locales) {
    for (const activity of activities) {
      params.push({ slug: activity.slug, locale })
    }
  }
  
  return params
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const activity = getActivityBySlug(slug)
  const t = await getTranslations({ locale, namespace: 'activityPage' })
  
  if (!activity) {
    return {
      title: t('notFound'),
    }
  }

  // Get activity translations
  const tActivity = await getTranslations({ locale, namespace: `activities.${activity.slug}` })
  const activityName = tActivity('name')
  const activityDescription = tActivity('description')
  const activityMetaDescription = tActivity('metaDescription')
  const activityKeywords = tActivity('keywords').split('|')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'

  return {
    title: t('metaTitle', { activity: activityName }),
    description: activityMetaDescription,
    keywords: [...activityKeywords, activityName, 'tours', 'guías', 'Yucatán'],
    openGraph: {
      title: t('metaTitle', { activity: activityName }),
      description: activityMetaDescription,
      url: `${baseUrl}/${locale}/actividad/${slug}`,
      siteName: 'MySenda',
      locale: locale === 'fr' ? 'fr_FR' : 'es_MX',
      type: 'website',
      images: activity.heroImage ? [
        {
          url: `${baseUrl}${activity.heroImage}`,
          width: 1200,
          height: 630,
          alt: t('metaTitle', { activity: activityName }),
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle', { activity: activityName }),
      description: activityMetaDescription,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/actividad/${slug}`,
      languages: {
        'es': `${baseUrl}/es/actividad/${slug}`,
        'fr': `${baseUrl}/fr/actividad/${slug}`,
      },
    },
  }
}

export default async function ActivityPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  
  const activity = getActivityBySlug(slug)
  const t = await getTranslations('activityPage')
  
  if (!activity) {
    notFound()
  }

  // Get activity translations
  const tActivity = await getTranslations(`activities.${activity.slug}`)
  const activityName = tActivity('name')
  const activityDescription = tActivity('description')
  const activityKeywords = tActivity('keywords').split('|')

  const localizedActivity = {
    ...activity,
    name: activityName,
    description: activityDescription,
    keywords: activityKeywords
  }

  // Fetch tours (services) for this activity
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: services } = await supabase
    .from('services')
    .select(`
      id,
      title,
      description,
      price,
      duration,
      service_photos (
        url,
        order
      ),
      user:users!inner (
        name,
        photo_url,
        is_verified,
        public_links!inner (
          slug,
          active
        )
      )
    `)
    .contains('categories', [activity.name]) // Using original Spanish name for DB query consistency
    .eq('active', true)
    .eq('user.public_links.active', true)
    .limit(50)

  // Format tours for display
  const typedServices = services as ServiceResponse[] | null
  const tours = typedServices?.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    duration: service.duration,
    cover_image: service.service_photos?.sort((a, b) => a.order - b.order)[0]?.url || null,
    guide: {
      name: service.user.name || 'Guía MySenda',
      photo_url: service.user.photo_url,
      slug: service.user.public_links[0].slug,
      is_verified: service.user.is_verified,
    }
  })) || []

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
  const activityUrl = `${baseUrl}/${locale}/actividad/${slug}`

  // Get FAQ translations
  const tFaq = await getTranslations('activityFaq')
  const localizedFaqs = [
    { question: tFaq('bestPlaces', { activity: activityName.toLowerCase() }), answer: tFaq('bestPlacesAnswer', { activity: activityName.toLowerCase() }) },
    { question: tFaq('needExperience', { activity: activityName.toLowerCase() }), answer: tFaq('needExperienceAnswer', { activity: activityName.toLowerCase() }) },
    { question: tFaq('whatToBring', { activity: activityName.toLowerCase() }), answer: tFaq('whatToBringAnswer', { activity: activityName.toLowerCase() }) },
    { question: tFaq('isSafe', { activity: activityName.toLowerCase() }), answer: tFaq('isSafeAnswer', { activity: activityName.toLowerCase() }) },
    { question: tFaq('cost', { activity: activityName.toLowerCase() }), answer: tFaq('costAnswer', { activity: activityName.toLowerCase() }) },
  ]
  const faqSchema = generateFAQSchema(localizedFaqs)

  // Generate structured data
  const attractionSchema = generateTouristAttractionSchema({
    name: `Tours de ${activityName}`,
    description: activityDescription,
    url: activityUrl,
    image: activity.heroImage ? `${baseUrl}${activity.heroImage}` : undefined,
    city: 'Yucatán'
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t('breadcrumbHome'), url: `${baseUrl}/${locale}` },
    { name: t('breadcrumbExplore'), url: `${baseUrl}/${locale}/explorar` },
    { name: activityName, url: activityUrl }
  ])

  // Get cities translations for linking
  const tCities = await getTranslations('cities')
  const citiesData = await getAllCitiesResults()

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={attractionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      
      {/* Hero Section */}
      <ActivityHero 
        activity={localizedActivity} 
        guideCount={tours.length}
        translations={{
          heroTitle: t('heroTitle'),
          authenticExperiences: t('authenticExperiences'),
          specializedGuides: t('specializedGuides'),
          availableDestinations: t('availableDestinations')
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
            <span className="text-gray-900 font-medium">{activityName}</span>
          </div>
        </div>
      </div>

      {/* Tours Section */}
      <div className="py-16">
        <div className="container mx-auto px-5">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('guidesSpecializedIn', { activity: activityName })}
              {/* Consider updating translation key to reflect 'Tours' context */}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('connectWithExperts', { activity: activityName.toLowerCase() })}
            </p>
          </div>

          {tours.length > 0 ? (
            <>
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                {tours.map((tour: any) => (
                  <div key={tour.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] max-w-md h-full">
                     <TourCard tour={tour} />
                  </div>
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
                {t('comingSoon', { activity: activityName.toLowerCase() })}
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
            <h2>{t('seoTitle', { activity: activityName })}</h2>
            <p className="text-gray-700 leading-relaxed">
              {activityDescription} {t('seoDesc', { description: '' })}
            </p>

            <h3>{t('whatInclude', { activity: activityName })}</h3>
            <ul>
              {activityKeywords.map((keyword: string, index: number) => (
                <li key={index}>
                  <strong className="capitalize">{keyword}</strong>: {t('whatIncludeDesc')}
                </li>
              ))}
            </ul>

            <h3>{t('whyChoose', { activity: activityName })}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('whyChooseDesc')}
            </p>

            <h3>{t('popularDestinations', { activity: activityName })}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('popularDestinationsDesc', { activity: activityName.toLowerCase() })}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection title={t('faqTitle', { activity: activityName })} faqs={localizedFaqs} />

      {/* Popular Destinations Internal Linking */}
      <div className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('bestDestinations', { activity: activityName.toLowerCase() })}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {citiesData.slice(0, 8).map((city) => (
              <Link 
                key={city.slug} 
                href={`/${locale}/ciudad/${city.slug}`}
                className="group p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors border border-gray-100 hover:border-green-200"
              >
                <h3 className="font-medium text-gray-900 group-hover:text-green-700 text-center">
                  {/* Try translation first (for static cities), else use DB name */}
                  {['merida','valladolid','izamal','rio-lagartos','mani','uxmal','celestun','sisal','playa-del-carmen','tulum','bacalar','isla-mujeres','campeche','calakmul','isla-aguada'].includes(city.slug) 
                    ? tCities(`${city.slug}.name`) 
                    : city.name}
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
            {t('offerTours', { activity: activityName })}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('joinCta')}
          </p>
          <Link href={`/${locale}/auth/login`}>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 text-lg rounded-full">
              {t('createProfileCta')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
