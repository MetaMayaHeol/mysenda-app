import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Clock, MapPin, Users, Globe, Info, CheckCircle2, XCircle, AlertCircle, CircleDot } from 'lucide-react'
import { formatPrice, formatDuration } from '@/lib/utils/formatters'
import { BookingSection } from '@/components/public/BookingSection'
import { BackButton } from '@/components/public/BackButton'
import { ImageLightbox } from '@/components/public/ImageLightbox'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data'
import { ViewTracker } from '@/components/analytics/ViewTracker'
import { Badge } from '@/components/ui/badge'
import { LANGUAGE_NAMES, type Language } from '@/lib/utils/constants'
import { getOpenGraphLocale } from '@/lib/utils/locale-utils'

// Revalidate every hour
export const revalidate = 3600

interface ServicePageProps {
  params: Promise<{ locale: string; serviceId: string }>
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: services } = await supabase
    .from('services')
    .select('id')
    .is('deleted_at', null) // Exclude soft-deleted services
  
  return services?.map(({ id }) => ({ serviceId: id })) || []
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { serviceId } = await params
  const supabase = createStaticClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
  
  const { data: service } = await supabase
    .from('services')
    .select('title, subtitle, description, price')
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

  const title = `${service.title} - Tour en México | MySenda`
  const description = service.subtitle || service.description?.slice(0, 160) || `Reserva ${service.title} al mejor precio.`
  const imageUrl = photos?.url || `${baseUrl}/og-default.png`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/s/${serviceId}`,
      siteName: 'MySenda',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: service.title,
      }],
      locale: getOpenGraphLocale((await params).locale),
      type: 'website',
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceId, locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  const supabase = createStaticClient()

  // 1. Fetch service details
  // Handling potential missing columns gracefully is harder with specific selects, 
  // but we assume migration is run.
  let result = await supabase
    .from('services')
    .select('*') // Select all to get new columns
    .eq('id', serviceId)
    .is('deleted_at', null)
    .single()

  // Fallback for deleted_at column missing
  if (result.error && result.error.code === '42703') {
    result = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single()
  }

  const { data: service, error } = result

  if (error || !service) {
    if (error && error.code !== 'PGRST116') console.error('Service Fetch Error:', error)
    notFound()
  }

  // 2. Fetch service photos
  const { data: photos } = await supabase
    .from('service_photos')
    .select('url')
    .eq('service_id', serviceId)
    .order('order')

  // 3. Fetch guide info
  const { data: guide } = await supabase
    .from('users')
    .select('id, name, whatsapp, photo_url, bio')
    .eq('id', service.user_id)
    .single()

  if (!guide) notFound()

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

  // Data processing
  const lightboxImages = photos?.map((photo, i) => ({
    url: photo.url,
    alt: `${service.title} - Photo ${i + 1}`
  })) || []

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
  const serviceUrl = `${baseUrl}/s/${serviceId}`
  
  const { data: guideLink } = await supabase
    .from('public_links')
    .select('slug')
    .eq('user_id', guide.id)
    .single()

  // Schema
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description || undefined,
    image: photos?.[0]?.url || undefined,
    provider: {
      name: guide.name || 'Guía MySenda',
      url: guideLink ? `${baseUrl}/g/${guideLink.slug}` : baseUrl,
    },
    offers: {
      price: service.price,
      priceCurrency: 'MXN',
    },
  })

  // Format Helpers
  const formatLanguage = (lang: string) => LANGUAGE_NAMES[lang as Language] || lang.toUpperCase()
  const cancellations = {
    flexible: { label: t('cancellation.flexible'), desc: t('cancellation.flexibleDesc') },
    moderate: { label: t('cancellation.moderate'), desc: t('cancellation.moderateDesc') },
    strict: { label: t('cancellation.strict'), desc: t('cancellation.strictDesc') }
  }
  const cancelPolicy = cancellations[service.cancellation_policy as keyof typeof cancellations] || cancellations.flexible

  return (
    <>
      <ViewTracker type="service" guideId={guide.id} resourceId={serviceId} />
      <JsonLd data={serviceSchema} />
      
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
           <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <BackButton />
              <div className="font-semibold text-gray-900 truncate max-w-[200px] md:max-w-md">
                {service.title}
              </div>
              <div className="w-10"></div>{/* Spacer */}
           </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {service.title}
                </h1>
                {service.subtitle && (
                  <p className="text-xl text-gray-600 font-medium">
                    {service.subtitle}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-3 mt-4">
                   <Badge variant="secondary" className="flex gap-1.5 px-3 py-1.5 text-sm">
                      <Clock size={16} /> {formatDuration(service.duration)}
                   </Badge>
                   {service.max_pax && (
                     <Badge variant="secondary" className="flex gap-1.5 px-3 py-1.5 text-sm">
                        <Users size={16} /> Max {service.max_pax} pax
                     </Badge>
                   )}
                   {service.languages && service.languages.length > 0 && (
                      <Badge variant="secondary" className="flex gap-1.5 px-3 py-1.5 text-sm">
                        <Globe size={16} /> {service.languages.map(formatLanguage).join(', ')}
                      </Badge>
                   )}
                </div>
              </div>

              {/* Photos */}
              {lightboxImages.length > 0 && (
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <ImageLightbox images={lightboxImages} />
                </div>
              )}

              {/* Description */}
              <div className="prose prose-lg max-w-none text-gray-700 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900">Sobre esta experiencia</h3>
                <p className="whitespace-pre-line">{service.description}</p>
              </div>

              {/* Itinerary */}
              {service.itinerary && service.itinerary.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Info className="text-green-600" /> Itinerario
                  </h3>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                     {service.itinerary.map((item: any, i: number) => (
                       <div key={i} className="relative flex items-start group">
                          <div className="absolute left-0 mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-green-100 border-4 border-white ring-1 ring-green-200">
                            <CircleDot size={14} className="text-green-700" />
                          </div>
                          <div className="ml-10 w-full">
                            <h4 className="text-lg font-bold text-gray-900">
                              {item.title}
                            </h4>
                            {item.duration && (
                              <span className="text-sm font-medium text-green-600 mb-1 block">
                                {item.duration}
                              </span>
                            )}
                            {item.description && (
                              <p className="text-gray-600 mt-2 text-base leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              {(service.includes?.length > 0 || service.excludes?.length > 0) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {service.includes?.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <CheckCircle2 className="text-green-600" /> Lo que incluye
                      </h3>
                      <ul className="space-y-3">
                        {service.includes.map((item: string, i: number) => (
                          <li key={i} className="flex gap-3 text-gray-700">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {service.excludes?.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <XCircle className="text-red-500" /> No incluye
                      </h3>
                      <ul className="space-y-3">
                        {service.excludes.map((item: string, i: number) => (
                          <li key={i} className="flex gap-3 text-gray-700">
                            <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

               {/* Logistics & Requirements */}
               <div className="grid md:grid-cols-2 gap-6">
                 {service.meeting_point && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <MapPin className="text-blue-600" /> Punto de Encuentro
                      </h3>
                      <p className="text-gray-700">{service.meeting_point}</p>
                    </div>
                 )}
                 {service.requirements?.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <AlertCircle className="text-amber-500" /> Qué llevar / Requisitos
                      </h3>
                       <ul className="space-y-2 list-disc list-inside text-gray-700">
                        {service.requirements.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                 )}
               </div>

            </div>

            {/* Right Sidebar (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Price Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                       {formatPrice(service.price)}
                    </span>
                    <span className="text-gray-500 mb-1 font-medium">MXN {t('perPerson')}</span>
                  </div>

                  {guide.whatsapp ? (
                    <BookingSection
                      serviceName={service.title}
                      whatsapp={guide.whatsapp}
                      availableWeekdays={availableWeekdays}
                      availableTimeslots={availableTimeslots}
                      guideId={guide.id}
                      serviceId={service.id}
                      locale={locale}
                    />
                  ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-center text-sm">
                      El guía no ha configurado su WhatsApp.
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="bg-green-100 p-2 rounded-full text-green-700">
                          <CheckCircle2 size={16} />
                       </div>
                        <div>
                           <p className="font-bold text-sm text-gray-900">{t('cancellation.title')} {cancelPolicy.label}</p>
                           <p className="text-xs text-gray-500">{cancelPolicy.desc}</p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Guide Info */}
                {guideLink && (
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" >
                    {/* Add Link wrapper later if needed, BookingSection handles messages though */}
                     <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative">
                         {guide.photo_url ? (
                           <img src={guide.photo_url} alt={guide.name} className="object-cover w-full h-full" />
                         ) : (
                           <div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-bold">{guide.name?.[0]}</div>
                         )}
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{t('organizedBy')}</p>
                        <p className="font-bold text-gray-900 text-lg">{guide.name}</p>
                     </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}
