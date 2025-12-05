import Link from 'next/link'
import { activities } from '@/lib/seo/activities'
import { createClient } from '@supabase/supabase-js'
import { getTranslations } from 'next-intl/server'
import { 
  UtensilsCrossed, 
  Landmark, 
  TreePine, 
  ShoppingBag, 
  Camera, 
  Palmtree,
  Waves,
  Sparkles
} from 'lucide-react'

// Map activity slugs to Lucide icons
const activityIcons: Record<string, any> = {
  'gastronomia': UtensilsCrossed,
  'cultura-historia': Landmark,
  'naturaleza-aventura': TreePine,
  'compras-artesanias': ShoppingBag,
  'fotografia': Camera,
  'playas-cenotes': Waves,
  'arqueologia': Palmtree,
  'experiencias-locales': Sparkles,
}

export async function ActivitiesGrid() {
  const t = await getTranslations('activities')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch service counts for all activities in parallel
  const activitiesWithCounts = await Promise.all(
    activities.map(async (activity) => {
      // Count active services with this category
      const { count } = await supabase
        .from('services')
        .select(`
          id,
          user:users!inner (
            public_links!inner (
              active
            )
          )
        `, { count: 'exact', head: true })
        .contains('categories', [activity.name])
        .eq('active', true)
        .eq('user.public_links.active', true)
      
      return { ...activity, serviceCount: count || 0 }
    })
  )

  // Filter activities with at least 1 service and sort by count
  const displayActivities = activitiesWithCounts
    .filter(a => a.serviceCount > 0)
    .sort((a, b) => b.serviceCount - a.serviceCount)
    .slice(0, 8)

  if (displayActivities.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
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
          {displayActivities.map((activity) => {
            const Icon = activityIcons[activity.slug] || Sparkles

            return (
              <Link
                key={activity.slug}
                href={`/actividad/${activity.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 hover:border-green-200"
              >
                <div className="aspect-[4/5] p-6 flex flex-col items-center justify-center text-center">
                  {/* Service Count Badge */}
                  {activity.serviceCount > 0 && (
                    <div className="absolute top-4 right-4 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold">
                      {activity.serviceCount}
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-16 h-16 mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon size={32} className="text-white" strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                      {activity.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {activity.description.split('.')[0]}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold text-green-600">
                      Découvrir →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
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
