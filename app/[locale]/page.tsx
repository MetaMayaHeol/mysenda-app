import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Globe, Shield, MessageCircle, Star, ArrowRight, Mail } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { GuideCard } from '@/components/directory/GuideCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data'
import { TestimonialsSection } from '@/components/public/TestimonialsSection'
import { BusinessModelSection } from '@/components/public/BusinessModelSection'
import { DestinationsGrid } from '@/components/public/DestinationsGrid'
import { ActivitiesGrid } from '@/components/public/ActivitiesGrid'
import { getTranslations, setRequestLocale } from 'next-intl/server'

// Force dynamic to ensure we see the latest featured guides
export const dynamic = 'force-dynamic'

interface FeaturedGuideResponse {
  slug: string
  user: {
    name: string | null
    bio: string | null
    photo_url: string | null
    languages: string[] | null
    city: string | null
    country: string | null
    is_verified: boolean | null
  } | null
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

  return (guides as FeaturedGuideResponse[] | null)?.map(item => ({
    slug: item.slug,
    name: item.user?.name || 'Guía MySenda',
    bio: item.user?.bio ?? null,
    photo_url: item.user?.photo_url ?? null,
    languages: item.user?.languages ?? null,
    city: item.user?.city ?? null,
    country: item.user?.country ?? null,
    is_verified: item.user?.is_verified ?? false,
  })) || []
}


type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  
  const t = await getTranslations('home')
  const tFeatured = await getTranslations('featuredGuides')
  const tHow = await getTranslations('howItWorks')
  const tCta = await getTranslations('cta')
  const tFooter = await getTranslations('footer')
  
  const featuredGuides = await getFeaturedGuides()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'

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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90" />
        
        <div className="relative container mx-auto px-5 py-32 md:py-48 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-300 text-sm font-medium">{t('newWay')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
              {t('heroTitle')} — <span className="text-green-400">{t('heroHighlight')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
              <br className="hidden md:block" /> {t('heroSubtitle2')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/explorar`}>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 text-lg w-full sm:w-auto rounded-full shadow-lg shadow-green-500/20 transition-all hover:scale-105">
                  {t('ctaFindGuide')}
                </Button>
              </Link>
              <Link href={`/${locale}/auth/login`}>
                <Button variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                  {t('ctaBecome')}
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
              <h3 className="font-bold text-gray-900">{t('trustVerified')}</h3>
              <p className="text-sm text-gray-500">{t('trustVerifiedDesc')}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MessageCircle className="text-blue-600 mb-2" size={32} />
              <h3 className="font-bold text-gray-900">{t('trustDirect')}</h3>
              <p className="text-sm text-gray-500">{t('trustDirectDesc')}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Star className="text-yellow-500 mb-2" size={32} />
              <h3 className="font-bold text-gray-900">{t('trustNoFees')}</h3>
              <p className="text-sm text-gray-500">{t('trustNoFeesDesc')}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Globe className="text-purple-600 mb-2" size={32} />
              <h3 className="font-bold text-gray-900">{t('trustGlobal')}</h3>
              <p className="text-sm text-gray-500">{t('trustGlobalDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Section */}
      <DestinationsGrid />

      {/* Activities Section */}
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tFeatured('title')}</h2>
                <p className="text-xl text-gray-600">{tFeatured('subtitle')}</p>
              </div>
              <Link href={`/${locale}/explorar`} className="hidden md:flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors">
                {tFeatured('viewAll')} <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link href={`/${locale}/explorar`}>
                <Button variant="outline" className="w-full">
                  {tFeatured('viewAll')}
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{tHow('title')}</h2>
            <p className="text-xl text-gray-600">
              {tHow('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* For Travelers */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="inline-block bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-sm mb-6">
                {tHow('forTravelers')}
              </div>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{tHow('step1Title')}</h4>
                    <p className="text-gray-600">{tHow('step1Desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{tHow('step2Title')}</h4>
                    <p className="text-gray-600">{tHow('step2Desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{tHow('step3Title')}</h4>
                    <p className="text-gray-600">{tHow('step3Desc')}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Guides */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="inline-block bg-blue-100 text-blue-700 font-bold px-4 py-1 rounded-full text-sm mb-6">
                {tHow('forGuides')}
              </div>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{tHow('guideStep1Title')}</h4>
                    <p className="text-gray-600">{tHow('guideStep1Desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{tHow('guideStep2Title')}</h4>
                    <p className="text-gray-600">{tHow('guideStep2Desc')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{tHow('guideStep3Title')}</h4>
                    <p className="text-gray-600">{tHow('guideStep3Desc')}</p>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{tCta('title')}</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {tCta('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/auth/login`}>
              <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 text-lg rounded-full">
                {tCta('createProfile')}
              </Button>
            </Link>
            <Link href={`/${locale}/explorar`}>
              <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-white bg-transparent text-white hover:bg-white/10 hover:text-white">
                {tCta('findGuide')}
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
                {tFooter('description')}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-green-500" />
                <Link href={`/${locale}/support`} className="text-gray-400 hover:text-green-400">
                  {tFooter('contactUs')}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{tFooter('platform')}</h4>
              <ul className="space-y-2">
                <li><Link href={`/${locale}/explorar`} className="hover:text-green-400 transition-colors">{tFooter('exploreGuides')}</Link></li>
                <li><Link href={`/${locale}/auth/login`} className="hover:text-green-400 transition-colors">{tFooter('guideAccess')}</Link></li>
                <li><Link href={`/${locale}/faq`} className="hover:text-green-400 transition-colors">{tFooter('faq')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{tFooter('support')}</h4>
              <ul className="space-y-2">
                <li><Link href={`/${locale}/support`} className="hover:text-green-400 transition-colors">{tFooter('helpCenter')}</Link></li>
                <li><Link href={`/${locale}/cancellation-policy`} className="hover:text-green-400 transition-colors">{tFooter('cancellationPolicy')}</Link></li>
                <li><Link href={`/${locale}/faq`} className="hover:text-green-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{tFooter('legal')}</h4>
              <ul className="space-y-2">
                <li><Link href={`/${locale}/terms`} className="hover:text-green-400 transition-colors">{tFooter('terms')}</Link></li>
                <li><Link href={`/${locale}/privacy`} className="hover:text-green-400 transition-colors">{tFooter('privacy')}</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">{tFooter('cookies')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-900">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p>{tFooter('copyright', { year: new Date().getFullYear() })}</p>
              <p className="text-gray-500">{tFooter('madeWith')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
