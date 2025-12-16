import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDuration } from '@/lib/utils/formatters'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateLocalBusinessSchema, generateBreadcrumbSchema, generateServiceSchema } from '@/lib/seo/structured-data'
import { ViewTracker } from '@/components/analytics/ViewTracker'
import { getReviews } from '@/app/actions/reviews'
import { ReviewsList } from '@/components/public/ReviewsList'
import { ReviewForm } from '@/components/public/ReviewForm'
import { ShareButton } from '@/components/public/ShareButton'
import { RatingSummary } from '@/components/public/RatingSummary'
import { VerificationBadge } from '@/components/public/VerificationBadge'
import { StickyWhatsAppCTA } from '@/components/public/StickyWhatsAppCTA'

// Revalidate every hour
export const revalidate = 3600

interface ServiceWithPhotosResponse {
  id: string
  title: string
  description: string | null
  price: number
  duration: number
  service_photos: { url: string }[]
}

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
  
  const { data: link } = await supabase
    .from('public_links')
    .select('user_id')
    .eq('slug', slug)
    .single()

  if (!link) return { title: 'Guía no encontrado' }

  const { data: user } = await supabase
    .from('users')
    .select('name, bio, photo_url, whatsapp, city')
    .eq('id', link.user_id)
    .single()

  // Optimize for OpenGraph (Title: 50-60 chars, Description: 110-160 chars)
  const cityShort = user?.city || 'México'
  const title = `${user?.name} | Guía en ${cityShort} - MySenda`.slice(0, 60)
  
  const description = user?.bio && user.bio.length > 50
    ? `${user.bio.slice(0, 105)}... Reserva tours con ${user?.name}. WhatsApp directo.`
    : `Experiencias auténticas con ${user?.name}, guía local en ${cityShort}. Tours personalizados y únicos. Reserva fácil por WhatsApp.`
  
  const imageUrl = user?.photo_url || `${baseUrl}/og-default.png`
  const url = `${baseUrl}/g/${slug}`

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url,
      siteName: 'MySenda',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `${user?.name} - Guía Turístico`,
      }],
      locale: 'es_MX', // TODO: Map locale to full format (e.g. fr_FR)
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
       languages: {
        'es': `${baseUrl}/es/g/${slug}`,
        'fr': `${baseUrl}/fr/g/${slug}`,
      },
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
    .select('id, name, bio, photo_url, whatsapp, city, country, is_verified')
    .eq('id', link.user_id)
    .single()

  // 3. Fetch guide photos
  const { data: photos } = await supabase
    .from('guide_photos')
    .select('url')
    .eq('user_id', link.user_id)
    .order('order')
    .limit(3)

  // 4. Fetch active services (excluding soft-deleted)
  const { data: rawServices } = await supabase
    .from('services')
    .select('id, title, description, price, duration, service_photos(url)')
    .eq('user_id', link.user_id)
    .eq('active', true)
    .is('deleted_at', null) // Exclude soft-deleted services
    .order('price')

  const services = rawServices as ServiceWithPhotosResponse[] | null

  // 5. Fetch reviews
  const reviews = await getReviews(link.user_id)

  if (!guide) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
  const guideUrl = `${baseUrl}/g/${slug}`

  // Calculate rating
  const approvedReviews = reviews.filter(r => r.approved)
  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length
    : 0

  // Generate structured data
  const localBusinessData = generateLocalBusinessSchema({
    name: guide.name || 'Guía MySenda',
    description: guide.bio || undefined,
    image: guide.photo_url || undefined,
    telephone: guide.whatsapp || undefined,
    url: guideUrl,
    address: {
      addressLocality: guide.city || undefined,
      addressCountry: guide.country || 'MX'
    }
  })

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Inicio', url: baseUrl },
    { name: 'Explorar Guías', url: `${baseUrl}/explorar` },
    { name: guide.name || 'Guía', url: guideUrl },
  ])

  const serviceSchemas = services?.map(service => generateServiceSchema({
    name: service.title,
    description: service.description || undefined,
    image: service.service_photos?.[0]?.url || undefined,
    provider: {
      name: guide.name || 'Guía',
      url: guideUrl
    },
    offers: {
      price: service.price,
      priceCurrency: 'MXN'
    }
  })) || []

  return (
    <>
      <ViewTracker type="profile" guideId={guide.id} />
      <JsonLd data={localBusinessData} />
      <JsonLd data={breadcrumbData} />
      {serviceSchemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="relative">
        {/* Cover Background (Blurred) */}
        <div className="absolute inset-0 overflow-hidden h-64 z-0">
           {guide.photo_url && (
            <Image
              src={guide.photo_url}
              alt="Background"
              fill
              className="object-cover blur-xl opacity-20 scale-110"
            />
           )}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="relative z-10 p-5 text-center pt-12">
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
          
          <div className="flex flex-col items-center gap-2 mb-3">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{guide.name}</h1>
              {guide.is_verified && <VerificationBadge size={24} />}
            </div>
            
            <RatingSummary rating={averageRating} count={approvedReviews.length} />
          </div>

          <p className="text-gray-600 flex items-center justify-center gap-1.5 text-sm mb-4">
            <MapPin size={16} className="text-green-600" />
            {guide.city ? `${guide.city}, ${guide.country || 'México'}` : 'Guía Local'}
          </p>

          <div className="flex justify-center gap-2">
            <ShareButton 
              title={`${guide.name} - Guía Turístico`} 
              text={`Echa un vistazo al perfil de ${guide.name} en MySenda.`} 
              url={guideUrl} 
            />
          </div>
        </div>
      </div>
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
      <div className="px-5 max-w-6xl mx-auto">
        <h2 className="font-bold text-lg mb-4">Mis Tours y Actividades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <div key={service.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              {/* Service Image */}
              {service.service_photos && service.service_photos.length > 0 ? (
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image
                    src={service.service_photos[0].url}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

      {/* Reviews Section */}
      <div className="px-5 mt-12">
        <h2 className="font-bold text-lg mb-6">Reseñas</h2>
        
        <div className="mb-8">
          <ReviewsList reviews={reviews} />
        </div>

        <ReviewForm guideId={guide.id} />
      </div>

      {/* Footer */}
      <div className="px-5 pt-8 pb-2 text-center">
        <p className="text-xs text-gray-500">
          Powered by <Link href="/" className="font-semibold hover:underline">MySenda</Link>
        </p>
      </div>

      {/* WhatsApp Sticky Button */}
      {guide.whatsapp && (
        <StickyWhatsAppCTA 
          phoneNumber={guide.whatsapp} 
          guideName={guide.name || undefined}
          guideId={guide.id}
        />
      )}
    </div>
    </>
  )
}
