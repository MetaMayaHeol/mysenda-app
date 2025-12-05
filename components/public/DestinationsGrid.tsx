import Link from 'next/link'
import Image from 'next/image'
import { cities } from '@/lib/seo/cities'
import { MapPin } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { getTranslations } from 'next-intl/server'

export async function DestinationsGrid() {
  const t = await getTranslations('destinations')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch guide counts for all cities in parallel
  const citiesWithCounts = await Promise.all(
    cities.map(async (city) => {
      // Count unique guides who have active services in this city AND active public profile
      const { data, error } = await supabase
        .from('services')
        .select(`
          user_id,
          user:users!inner (
            public_links!inner (
              active
            )
          )
        `)
        .contains('locations', [city.name])
        .eq('active', true)
        .eq('user.public_links.active', true)
      
      // Get unique user IDs
      const uniqueGuides = new Set(data?.map(s => s.user_id))
      return { ...city, guideCount: uniqueGuides.size }
    })
  )

  // Filter cities with at least 1 guide and sort by count (descending)
  const displayCities = citiesWithCounts
    .filter(c => c.guideCount > 0)
    .sort((a, b) => b.guideCount - a.guideCount)
    .slice(0, 8)

  if (displayCities.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayCities.map((city) => (
            <Link
              key={city.slug}
              href={`/ciudad/${city.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/5] relative">
                {/* Background Image or Gradient */}
                {city.heroImage ? (
                  <Image
                    src={city.heroImage}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100" />
                )}
                
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Guide Count Badge */}
                {city.guideCount > 0 && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
                    {city.guideCount} guide{city.guideCount > 1 ? 's' : ''}
                  </div>
                )}

                {/* Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin size={20} className="text-green-600" />
                </div>

                {/* Content - positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-300 transition-colors">
                    {city.name}
                  </h3>
                  <p className="text-sm text-white/80 font-medium">
                    {city.state}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/explorar"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg group"
          >
            {t('viewAll')}
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
