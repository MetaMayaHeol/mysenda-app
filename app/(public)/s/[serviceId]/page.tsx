import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDuration } from '@/lib/utils/formatters'
import { BookingSection } from '@/components/public/BookingSection'

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
  
  const { data: service } = await supabase
    .from('services')
    .select('title, description')
    .eq('id', serviceId)
    .single()

  return {
    title: `${service?.title} | RutaLink`,
    description: service?.description,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceId } = await params
  const supabase = createStaticClient()

  // 1. Fetch service details
  const { data: service } = await supabase
    .from('services')
    .select('*')
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

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        {photos && photos.length > 0 ? (
          <Image
            src={photos[0].url}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            Sin foto
          </div>
        )}
        
        <button 
          onClick={() => window.history.back()} 
          className="absolute top-4 left-4 z-10"
        >
          <Button variant="secondary" size="icon" className="rounded-full shadow-md">
            <ChevronLeft size={24} />
          </Button>
        </button>
      </div>

      <div className="p-5 max-w-lg mx-auto">
        {/* Title & Price */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(service.price)}
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <Clock size={18} />
            {formatDuration(service.duration)}
          </span>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-2">Acerca de la actividad</h3>
          <p className="text-gray-700 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Gallery (Remaining photos) */}
        {photos && photos.length > 1 && (
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-3">Galería</h3>
            <div className="grid grid-cols-2 gap-3">
              {photos.slice(1).map((photo, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={photo.url}
                    alt={`${service.title} ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
  )
}
