import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import { Clock } from 'lucide-react'
import { formatPrice, formatDuration } from '@/lib/utils/formatters'
import { BookingSection } from '@/components/public/BookingSection'
import { BackButton } from '@/components/public/BackButton'
import { ImageLightbox } from '@/components/public/ImageLightbox'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data'
import { ViewTracker } from '@/components/analytics/ViewTracker'

// Revalidate every hour
export const revalidate = 3600

interface ServicePageProps {
  params: Promise<{ serviceId: string }>
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: services } = await supabase.from('services').select('id')
  
  return services?.map(({ id }) => ({ serviceId: id })) || []
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { serviceId } = await params
  const supabase = createStaticClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'
  
  const { data: service } = await supabase
    .from('services')
    .select('title, description, price')
    .eq('id', serviceId)
    .single()

  if (!service) return { title: 'Servicio no encontrado' }

  const { data: photos } = await supabase
    .from('service_photos')
    .select('url')
    .eq('service_id', serviceId)
    .order('order')
    .limit(1)
    .single()

  const title = `${service.title} - Tour en México | RutaLink`
  const description = service.description || `Reserva ${service.title} al mejor precio. Experiencia auténtica con guía local.`
  const imageUrl = photos?.url || `${baseUrl}/og-default.png`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/s/${serviceId}`,
      siteName: 'RutaLink',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: service.title,
      }],
      locale: 'es_MX',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceId } = await params
  const supabase = createStaticClient()

  // 1. Fetch service details
  const { data: service } = await supabase
    .from('services')
    .select('id, title, description, price, duration, user_id')
    .eq('id', serviceId)
    .single()

  if (!service) {
    notFound()
  }

  // 2. Fetch service photos
  const { data: photos } = await supabase
    .from('service_photos')
    .select('url')
    .eq('service_id', serviceId)
    .order('order')

  // 3. Fetch guide info (for availability and contact)
  const { data: guide } = await supabase
    .from('users')
    .select('id, name, whatsapp')
    .eq('id', service.user_id)
    .single()

  if (!guide) {
    notFound()
  }

  // 4. Fetch availability
  const { data: weekdays } = await supabase
    .from('availability')
    .select('weekday')
    .eq('user_id', guide.id)
    .eq('active', true)

  const { data: timeslots } = await supabase
    .from('timeslots')
    .select('time')
    .eq('user_id', guide.id)
    .eq('active', true)
    .order('time')

  const availableWeekdays = weekdays?.map(w => w.weekday) || []
  const availableTimeslots = timeslots?.map(t => t.time) || []

  // Prepare images for lightbox
  const lightboxImages = photos?.map((photo, i) => ({
    url: photo.url,
    alt: `${service.title} - Photo ${i + 1}`
  })) || []

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'
  const serviceUrl = `${baseUrl}/s/${serviceId}`
  
  // Fetch guide slug for breadcrumb
  const { data: guideLink } = await supabase
    .from('public_links')
    .select('slug')
    .eq('user_id', guide.id)
    .single()

  // Generate structured data
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description || undefined,
    image: photos?.[0]?.url || undefined,
    provider: {
      name: guide.name || 'Guía RutaLink',
      url: guideLink ? `${baseUrl}/g/${guideLink.slug}` : baseUrl,
    },
    offers: {
      price: service.price,
      priceCurrency: 'MXN',
    },
  })

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Inicio', url: baseUrl },
    { name: 'Explorar', url: `${baseUrl}/explorar` },
    ...(guideLink ? [{ name: guide.name || 'Guía', url: `${baseUrl}/g/${guideLink.slug}` }] : []),
    { name: service.title, url: serviceUrl },
  ])

  return (
    <>
      <ViewTracker type="service" guideId={guide.id} resourceId={serviceId} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbData} />
      <div className="min-h-screen bg-white pb-24">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton />
      </div>

      <div className="p-5 max-w-3xl mx-auto pt-16">
        {/* Title & Price */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{service.title}</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <span className="text-3xl font-bold text-green-600">
            {formatPrice(service.price)}
          </span>
          <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            <Clock size={18} />
            {formatDuration(service.duration)}
          </span>
        </div>

        {/* Photos Gallery with Lightbox */}
        {lightboxImages.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-xl mb-4">Photos</h3>
            <ImageLightbox images={lightboxImages} />
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-bold text-xl mb-3">Acerca de la actividad</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {service.description}
          </p>
        </div>

        {/* Booking Section */}
        {guide.whatsapp ? (
          <BookingSection
            serviceName={service.title}
            whatsapp={guide.whatsapp}
            availableWeekdays={availableWeekdays}
            availableTimeslots={availableTimeslots}
          />
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-center">
            El guía no ha configurado su WhatsApp para recibir reservas.
          </div>
        )}
      </div>
    </div>
    </>
  )
}
