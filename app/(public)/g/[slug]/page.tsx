import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDuration } from '@/lib/utils/formatters'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data'
import { ViewTracker } from '@/components/analytics/ViewTracker'

// Revalidate every hour
export const revalidate = 3600

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: links } = await supabase.from('public_links').select('slug')
  
  return links?.map(({ slug }) => ({ slug })) || []
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params
  const supabase = createStaticClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'
  
  const { data: link } = await supabase
    .from('public_links')
    .select('user_id')
    .eq('slug', slug)
    .single()

  if (!link) return { title: 'Guía no encontrado' }

  const { data: user } = await supabase
    .from('users')
    .select('name, bio, photo_url, whatsapp')
    .eq('id', link.user_id)
    .single()

  const title = `${user?.name} - Guía Turístico Local | RutaLink`
  const description = user?.bio || `Descubre experiencias auténticas con ${user?.name}, guía turístico local verificado. Reserva tours personalizados directamente por WhatsApp.`
  const imageUrl = user?.photo_url || `${baseUrl}/og-default.png`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/g/${slug}`,
      siteName: 'RutaLink',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `${user?.name} - Guía Turístico`,
      }],
      locale: 'es_MX',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const supabase = createStaticClient()

  // 1. Get user ID from slug
  const { data: link } = await supabase
    .from('public_links')
    .select('user_id')
    .eq('slug', slug)
    .single()

  if (!link) {
    notFound()
  }

  // 2. Fetch guide profile
  const { data: guide } = await supabase
    .from('users')
    .select('id, name, bio, photo_url, whatsapp')
    .eq('id', link.user_id)
    .single()

  // 3. Fetch guide photos
  const { data: photos } = await supabase
    .from('guide_photos')
    .select('url')
    .eq('user_id', link.user_id)
    .order('order')
    .limit(3)

  // 4. Fetch active services
  const { data: services } = await supabase
    .from('services')
    .select('id, title, description, price, duration, service_photos(url)')
    .eq('user_id', link.user_id)
    .eq('active', true)
    .order('price')

  if (!guide) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'
  const guideUrl = `${baseUrl}/g/${slug}`

  // Generate structured data
  const localBusinessData = generateLocalBusinessSchema({
    name: guide.name || 'Guía RutaLink',
    description: guide.bio || undefined,
    image: guide.photo_url || undefined,
    telephone: guide.whatsapp || undefined,
    url: guideUrl,
  })

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Inicio', url: baseUrl },
    { name: 'Explorar Guías', url: `${baseUrl}/explorar` },
    { name: guide.name || 'Guía', url: guideUrl },
  ])

  return (
    <>
      <ViewTracker type="profile" guideId={guide.id} />
      <JsonLd data={localBusinessData} />
      <JsonLd data={breadcrumbData} />
      <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="p-5 text-center bg-gradient-to-b from-gray-50 to-white">
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden relative ring-4 ring-white shadow-xl">
          {guide.photo_url ? (
            <Image
              src={guide.photo_url}
              alt={guide.name || 'Guide'}
              fill
              className="object-cover"
              quality={90}
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 text-white text-4xl font-bold">
              {guide.name?.[0]}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.name}</h1>
        <p className="text-gray-600 flex items-center justify-center gap-1.5 text-sm">
          <MapPin size={16} className="text-green-600" />
          Guía Local
        </p>
      </div>

      {/* Gallery */}
      {photos && photos.length > 0 && (
        <div className="px-5 mb-8">
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 shadow-sm group">
                <Image
                  src={photo.url}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  quality={90}
                  sizes="(max-width: 768px) 33vw, 400px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bio */}
      {guide.bio && (
        <div className="px-5 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">
            {guide.bio}
          </p>
        </div>
      )}

      {/* Services */}
      <div className="px-5">
        <h2 className="font-bold text-lg mb-4">Mis Tours y Actividades</h2>
        <div className="space-y-6">
          {services?.map((service) => (
            <div key={service.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              {/* Service Image */}
              {/* @ts-ignore */}
              {service.service_photos && service.service_photos.length > 0 ? (
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <Image
                    /* @ts-ignore */
                    src={service.service_photos[0].url}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                 <div className="h-2 bg-green-500/10" /> 
              )}
              
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-green-600 transition-colors">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-lg text-green-600">
                    {formatPrice(service.price)}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    <Clock size={14} />
                    {formatDuration(service.duration)}
                  </span>
                </div>
                
                <Link href={`/s/${service.id}`}>
                  <Button className="w-full bg-gray-900 text-white hover:bg-green-600 transition-colors">
                    Ver detalles y reservar
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pt-8 pb-2 text-center">
        <p className="text-xs text-gray-500">
          Powered by <Link href="/" className="font-semibold hover:underline">RutaLink</Link>
        </p>
      </div>

      {/* WhatsApp Sticky Button */}
      {guide.whatsapp && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
          <Link
            href={`https://wa.me/${guide.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 text-lg gap-2">
              <Send size={20} />
              Contacter por WhatsApp
            </Button>
          </Link>
        </div>
      )}
    </div>
    </>
  )
}
