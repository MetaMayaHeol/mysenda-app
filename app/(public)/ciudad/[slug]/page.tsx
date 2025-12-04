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

export const revalidate = 60 // Revalidate every minute


// Generate static params for all cities
export async function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const city = getCityBySlug(slug)

  if (!city) {
    return {
      title: 'Ciudad no encontrada',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'

  return {
    title: `Guías Turísticos en ${city.name} | RutaLink`,
    description: city.metaDescription,
    keywords: [...city.highlights, city.name, city.state, 'guías turísticos', 'tours'],
    openGraph: {
      title: `Guías Turísticos en ${city.name}, ${city.state}`,
      description: city.metaDescription,
      url: `${baseUrl}/ciudad/${slug}`,
      siteName: 'RutaLink',
      locale: 'es_MX',
      type: 'website',
      images: city.heroImage ? [
        {
          url: `${baseUrl}${city.heroImage}`,
          width: 1200,
          height: 630,
          alt: `${city.name}, ${city.state}`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Guías en ${city.name}`,
      description: city.metaDescription,
    },
    alternates: {
      canonical: `${baseUrl}/ciudad/${slug}`,
    },
  }
}

import { JsonLd } from '@/components/seo/JsonLd'
import { generateTouristDestinationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/structured-data'
import { generateCityFAQs } from '@/lib/seo/faq-generator'
import { FAQSection } from '@/components/seo/FAQSection'

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const city = getCityBySlug(slug)

  if (!city) {
    notFound()
  }

  if (!city) {
    notFound()
  }

  // Fetch guides for this city
  // Fetch guides who have active services in this city
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Query services that include this city in their locations
  const { data: services, error } = await supabase
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
    .contains('locations', [city.name])
    .eq('active', true)
    .eq('user.public_links.active', true)
    .limit(50)

  // Deduplicate guides (a guide might have multiple services in the same city)
  const uniqueGuidesMap = new Map()
  
  services?.forEach((service: any) => {
    if (service.user?.public_links?.[0]) {
      const guide = {
        slug: service.user.public_links[0].slug,
        name: service.user.name || 'Guía RutaLink',
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'
  const cityUrl = `${baseUrl}/ciudad/${slug}`

  // Generate FAQs
  const faqs = generateCityFAQs(city.name)
  const faqSchema = generateFAQSchema(faqs)

  // Generate structured data
  const destinationSchema = generateTouristDestinationSchema({
    name: city.name,
    description: city.description,
    url: cityUrl,
    image: city.heroImage ? `${baseUrl}${city.heroImage}` : undefined,
    address: {
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: 'MX'
    }
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: baseUrl },
    { name: 'Explorar', url: `${baseUrl}/explorar` },
    { name: city.name, url: cityUrl }
  ])

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={destinationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      {/* Hero Section */}
      {/* Hero Section */}
      <CityHero 
        city={city} 
        guideCount={formattedGuides.length}
        activityCount={city.highlights.length}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Inicio</Link>
            <span>/</span>
            <Link href="/explorar" className="hover:text-green-600">Explorar</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{city.name}</span>
          </div>
        </div>
      </div>

      {/* Guides Section */}
      <div className="py-16">
        <div className="container mx-auto px-5">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Guías Locales en {city.name}
            </h2>
            <p className="text-xl text-gray-600">
              Conecta con expertos locales que conocen cada rincón de {city.name}
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
                Aún no tenemos guías registrados en {city.name}
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
            <h2>¿Por qué visitar {city.name}?</h2>
            <p className="text-gray-700 leading-relaxed">
              {city.description} Con RutaLink, puedes conectar directamente con guías 
              locales verificados que te mostrarán lo mejor de {city.name}.
            </p>

            <h3>Experiencias destacadas</h3>
            <ul>
              {city.highlights.map((highlight, index) => (
                <li key={index}><strong>{highlight}</strong>: Descubre {highlight.toLowerCase()} con un experto local</li>
              ))}
            </ul>

            <h3>Tours y actividades en {city.name}</h3>
            <p className="text-gray-700 leading-relaxed">
              Nuestros guías en {city.name} ofrecen una amplia variedad de experiencias: 
              tours gastronómicos, recorridos culturales, aventuras en la naturaleza, 
              visitas arqueológicas y mucho más. Contacta directamente por WhatsApp 
              para personalizar tu experiencia.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection title={`Preguntas frecuentes sobre ${city.name}`} faqs={faqs} />

      {/* Popular Activities Internal Linking */}
      <div className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Actividades populares en la Península de Yucatán
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activities.map((activity) => (
              <Link 
                key={activity.slug} 
                href={`/actividad/${activity.slug}`}
                className="group p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors border border-gray-100 hover:border-green-200"
              >
                <h3 className="font-medium text-gray-900 group-hover:text-green-700 text-center">
                  {activity.name}
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
            ¿Eres guía turístico en {city.name}?
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
