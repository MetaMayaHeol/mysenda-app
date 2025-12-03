import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { activities, getActivityBySlug } from '@/lib/seo/activities'
import { ActivityHero } from '@/components/seo/ActivityHero'
import { GuideCard } from '@/components/directory/GuideCard'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// Generate static params for all activities
export async function generateStaticParams() {
  return activities.map((activity) => ({
    slug: activity.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const activity = getActivityBySlug(slug)

  if (!activity) {
    return {
      title: 'Actividad no encontrada',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'

  return {
    title: `Tours de ${activity.name} en Yucatán | RutaLink`,
    description: activity.metaDescription,
    keywords: [...activity.keywords, activity.name, 'tours', 'guías', 'Yucatán'],
    openGraph: {
      title: `Tours de ${activity.name} | Guías Locales`,
      description: activity.metaDescription,
      url: `${baseUrl}/actividad/${slug}`,
      siteName: 'RutaLink',
      locale: 'es_MX',
      type: 'website',
      images: activity.heroImage ? [
        {
          url: `${baseUrl}${activity.heroImage}`,
          width: 1200,
          height: 630,
          alt: `Tours de ${activity.name}`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tours de ${activity.name}`,
      description: activity.metaDescription,
    },
    alternates: {
      canonical: `${baseUrl}/actividad/${slug}`,
    },
  }
}

import { JsonLd } from '@/components/seo/JsonLd'
import { generateTouristAttractionSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data'

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const activity = getActivityBySlug(slug)

  if (!activity) {
    notFound()
  }

  // Fetch guides offering this activity type
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Search for guides with services matching activity keywords
  const { data: services } = await supabase
    .from('services')
    .select(`
      user_id,
      title,
      users!inner (
        id,
        name,
        bio,
        photo_url,
        languages,
        city,
        country,
        is_verified
      ),
      public_links!inner (
        slug,
        active
      )
    `)
    .eq('public_links.active', true)
    .limit(12)

  // Filter services by activity keywords and deduplicate by user
  const uniqueGuides = new Map()
  
  services?.forEach(service => {
    const titleLower = service.title.toLowerCase()
    const matchesActivity = activity.keywords.some(keyword => 
      titleLower.includes(keyword.toLowerCase())
    )
    
    if (matchesActivity && service.users) {
      const userId = service.user_id
      if (!uniqueGuides.has(userId)) {
        uniqueGuides.set(userId, {
          // @ts-ignore
          slug: service.public_links?.slug,
          // @ts-ignore
          name: service.users.name || 'Guía RutaLink',
          // @ts-ignore
          bio: service.users.bio,
          // @ts-ignore
          photo_url: service.users.photo_url,
          // @ts-ignore
          languages: service.users.languages,
          // @ts-ignore
          city: service.users.city,
          // @ts-ignore
          country: service.users.country,
          // @ts-ignore
          is_verified: service.users.is_verified,
        })
      }
    }
  })

  const formattedGuides = Array.from(uniqueGuides.values())

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'
  const activityUrl = `${baseUrl}/actividad/${slug}`

  // Generate structured data
  const attractionSchema = generateTouristAttractionSchema({
    name: `Tours de ${activity.name}`,
    description: activity.description,
    url: activityUrl,
    image: activity.heroImage ? `${baseUrl}${activity.heroImage}` : undefined,
    city: 'Yucatán'
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: baseUrl },
    { name: 'Explorar', url: `${baseUrl}/explorar` },
    { name: activity.name, url: activityUrl }
  ])

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={attractionSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* Hero Section */}
      {/* Hero Section */}
      <ActivityHero 
        activity={activity} 
        guideCount={formattedGuides.length}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Inicio</Link>
            <span>/</span>
            <Link href="/explorar" className="hover:text-green-600">Explorar</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{activity.name}</span>
          </div>
        </div>
      </div>

      {/* Guides Section */}
      <div className="py-16">
        <div className="container mx-auto px-5">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Guías Especializados en {activity.name}
            </h2>
            <p className="text-xl text-gray-600">
              Conecta con expertos que ofrecen experiencias auténticas de {activity.name.toLowerCase()}
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
                <Link href="/explorar">
                  <Button variant="outline" className="gap-2">
                    Ver todos los guías
                    <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-600 mb-4">
                Próximamente tendremos guías especializados en {activity.name.toLowerCase()}
              </p>
              <Link href="/auth/login">
                <Button className="bg-green-600 hover:bg-green-700">
                  Regístrate como Guía
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
            <h2>Tours de {activity.name} en la Península de Yucatán</h2>
            <p className="text-gray-700 leading-relaxed">
              {activity.description} Nuestros guías locales te ofrecen experiencias 
              personalizadas que van más allá de los tours tradicionales.
            </p>

            <h3>¿Qué incluyen nuestros tours de {activity.name}?</h3>
            <ul>
              {activity.keywords.map((keyword, index) => (
                <li key={index}>
                  <strong className="capitalize">{keyword}</strong>: Experiencias auténticas con expertos locales
                </li>
              ))}
            </ul>

            <h3>¿Por qué elegir RutaLink para tours de {activity.name}?</h3>
            <p className="text-gray-700 leading-relaxed">
              En RutaLink conectamos viajeros con guías locales verificados que conocen 
              cada detalle de la región. Comunicación directa por WhatsApp, sin comisiones 
              ocultas, y la flexibilidad de personalizar tu experiencia según tus intereses.
            </p>

            <h3>Destinos populares para {activity.name}</h3>
            <p className="text-gray-700 leading-relaxed">
              Nuestros guías ofrecen tours de {activity.name.toLowerCase()} en Mérida, 
              Valladolid, Tulum, Playa del Carmen, Bacalar, Campeche y muchos otros 
              destinos de la Península de Yucatán.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Ofreces tours de {activity.name}?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a RutaLink y conecta con viajeros que buscan experiencias auténticas
          </p>
          <Link href="/auth/login">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 text-lg rounded-full">
              Crear mi perfil gratis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
