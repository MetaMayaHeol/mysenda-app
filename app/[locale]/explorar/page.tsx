import { createClient } from '@supabase/supabase-js'
import { DirectoryClient } from '@/components/directory/DirectoryClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explorar Guías Turísticos | MySenda',
  description: 'Encuentra y conecta con guías turísticos locales verificados en México. Tours auténticos y experiencias únicas.',
}

// Force dynamic to ensure we see the latest data (and avoid caching issues during testing)
export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  // Use Service Role Key to bypass RLS policies for the public directory
  // This ensures we can read user profiles even if RLS is set to private
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch guides with public profiles
  const { data: guides, error } = await supabase
    .from('public_links')
    .select(`
      slug,
      user:users (
        id,
        name,
        bio,
        photo_url,
        languages,
        city,
        country,
        is_verified
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching guides:', error)
  }

  // Transform data for the client component
  const formattedGuides = await Promise.all((guides || []).map(async (item) => {
    // @ts-ignore
    const userId = item.user?.id
    
    // Calculate average rating for this guide
    let averageRating = 0
    let reviewCount = 0
    
    if (userId) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('guide_id', userId)
        .eq('approved', true)
      
      if (reviews && reviews.length > 0) {
        reviewCount = reviews.length
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
        averageRating = totalRating / reviewCount
      }
    }

    return {
      slug: item.slug,
      // @ts-ignore - Supabase types join handling
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
      // Only include rating fields if there are reviews
      ...(reviewCount > 0 && {
        averageRating,
        reviewCount,
      }),
    }
  }))

  return <DirectoryClient initialGuides={formattedGuides} />
}
