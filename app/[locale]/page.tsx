import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MapPin, Globe, Shield, MessageCircle, Star, ArrowRight, Mail } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { GuideCard } from '@/components/directory/GuideCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data'
import { TestimonialsSection } from '@/components/public/TestimonialsSection'
import { BusinessModelSection } from '@/components/public/BusinessModelSection'
import { DestinationsGrid } from '@/components/public/DestinationsGrid'
import { ActivitiesGrid } from '@/components/public/ActivitiesGrid'
import type { Metadata } from 'next'

// Force dynamic to ensure we see the latest featured guides
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'RutaLink - Conecta con Guías Turísticos Locales en México',
  description: 'Descubre experiencias auténticas con guías locales verificados. Sin intermediarios, sin comisiones. Contacto directo por WhatsApp. Tours personalizados en México.',
  keywords: ['guías turísticos', 'tours México', 'guías locales', 'experiencias auténticas', 'turismo México', 'tours privados'],
  openGraph: {
    title: 'RutaLink - Guías Turísticos Locales en México',
    description: 'Conecta directamente con guías locales expertos. Sin intermediarios, sin comisiones ocultas.',
    url: 'https://rutalink.com',
    siteName: 'RutaLink',
    locale: 'es_MX',
    type: 'website',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'RutaLink - Guías Turísticos Locales',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RutaLink - Guías Turísticos Locales',
    description: 'Conecta con guías locales verificados en México',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

async function getFeaturedGuides() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: guides } = await supabase
    .from('public_links')
    .select(`
      slug,
      user:users (
        name,
        bio,
        photo_url,
        languages,
        city,
        country,
        is_verified
      )
    `)
    .eq('active', true)
    .limit(3)
    .order('created_at', { ascending: false })

  return guides?.map(item => ({
    slug: item.slug,
    // @ts-ignore
    name: item.user?.name || 'Guía RutaLink',
    // @ts-ignore
    bio: item.user?.bio,
    // @ts-ignore
    photo_url: item.user?.photo_url,
    // @ts-ignore
    languages: item.user?.languages,
    // @ts-ignore
    city: item.user?.city,
    // @ts-ignore
    country: item.user?.country,
    // @ts-ignore
    is_verified: item.user?.is_verified,
  })) || []
}

export default async function HomePage() {
  const featuredGuides = await getFeaturedGuides()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'

  return (
    <>
      <JsonLd data={generateOrganizationSchema(baseUrl)} />
      <JsonLd data={generateWebSiteSchema(baseUrl)} />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero-yucatan.webp"
            alt="Península de Yucatán"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90" />
        
        <div className="relative container mx-auto px-5 py-32 md:py-48 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-300 text-sm font-medium">La nueva forma de viajar</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
              Reserva Guías Locales Verificados — <span className="text-green-400">Pago Seguro</span> o Contacto Directo
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Encuentra tu guía perfecto en minutos. Comunicación directa, experiencias auténticas.
              <br className="hidden md:block" /> Sin comisiones para ti, 100% del pago para el guía.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explorar">
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 text-lg w-full sm:w-auto rounded-full shadow-lg shadow-green-500/20 transition-all hover:scale-105">
                  Buscar Mi Guía Ahora
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                  Soy Guía Turístico
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-5 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="text-green-600 mb-2" size={32} />
              <h3 className="font-bold text-gray-900">Guías Verificados</h3>
              <p className="text-sm text-gray-500">Perfiles revisados</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MessageCircle className="text-blue-600 mb-2" size={32} />
              <h3 className="font-bold text-gray-900">Trato Directo</h3>
              <p className="text-sm text-gray-500">Chat por WhatsApp</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Star className="text-yellow-500 mb-2" size={32} />
              <h3 className="font-bold text-gray-900">Sin Comisiones</h3>
              <p className="text-sm text-gray-500">100% para el guía</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Globe className="text-purple-600 mb-2" size={32} />
              <h3 className="font-bold text-gray-900">Global</h3>
              <p className="text-sm text-gray-500">Guías en múltiples idiomas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Section - NEW */}
      <DestinationsGrid />

      {/* Activities Section - NEW */}
      <ActivitiesGrid />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Business Model Section */}
      <BusinessModelSection />

      {/* Featured Guides Section */}
      {featuredGuides.length > 0 && (
        <div className="py-24 bg-white">
          <div className="container mx-auto px-5">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Guías Destacados</h2>
                <p className="text-xl text-gray-600">Conoce a algunos de nuestros expertos locales</p>
              </div>
              <Link href="/explorar" className="hidden md:flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors">
                Ver todos <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link href="/explorar">
                <Button variant="outline" className="w-full">
                  Ver todos los guías
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* How it Works */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Cómo funciona RutaLink</h2>
            <p className="text-xl text-gray-600">
              Simplificamos la conexión entre viajeros y guías locales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* For Travelers */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="inline-block bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-sm mb-6">
                Para Viajeros
              </div>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Explora perfiles</h4>
                    <p className="text-gray-600">Encuentra guías por destino, idioma y especialidad.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Elige tu aventura</h4>
                    <p className="text-gray-600">Revisa los tours y servicios que ofrecen.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Contacta directo</h4>
                    <p className="text-gray-600">Habla por WhatsApp para reservar. Sin intermediarios.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Guides */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="inline-block bg-blue-100 text-blue-700 font-bold px-4 py-1 rounded-full text-sm mb-6">
                Para Guías
              </div>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Crea tu perfil</h4>
                    <p className="text-gray-600">Regístrate gratis y configura tu página profesional.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Publica tus servicios</h4>
                    <p className="text-gray-600">Añade fotos, precios y horarios de tus tours.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Recibe reservas</h4>
                    <p className="text-gray-600">Los clientes te escriben directo a tu WhatsApp.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-600/10" />
        <div className="container mx-auto px-5 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo para empezar?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Únete a la comunidad de guías y viajeros que están cambiando la forma de hacer turismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 text-lg rounded-full">
                Crear mi página gratis
              </Button>
            </Link>
            <Link href="/explorar">
              <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-white bg-transparent text-white hover:bg-white/10 hover:text-white">
                Buscar un guía
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-900">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-bold">R</span>
              </div>
              <p className="max-w-xs text-gray-500 mb-6">
                RutaLink conecta viajeros con guías locales para experiencias auténticas y sin intermediarios.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-green-500" />
                <a href="mailto:support@rutalink.com" className="text-gray-400 hover:text-green-400">
                  support@rutalink.com
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2">
                <li><Link href="/explorar" className="hover:text-green-400 transition-colors">Explorar Guías</Link></li>
                <li><Link href="/auth/login" className="hover:text-green-400 transition-colors">Acceso Guías</Link></li>
                <li><Link href="/faq" className="hover:text-green-400 transition-colors">Preguntas Frecuentes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><Link href="/support" className="hover:text-green-400 transition-colors">Centro de Ayuda</Link></li>
                <li><Link href="/cancellation-policy" className="hover:text-green-400 transition-colors">Política de Cancelación</Link></li>
                <li><Link href="/faq" className="hover:text-green-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-green-400 transition-colors">Términos de Servicio</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Política de Privacidad</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-900">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p>© {new Date().getFullYear()} RutaLink. Todos los derechos reservados.</p>
              <p className="text-gray-500">Hecho con ❤️ para viajeros y guías</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
