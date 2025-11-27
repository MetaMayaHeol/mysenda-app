import { createStaticClient } from '@/lib/supabase/static'
import { DirectoryClient } from '@/components/directory/DirectoryClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explorar Guías Turísticos | RutaLink',
  description: 'Encuentra y conecta con guías turísticos locales verificados en México. Tours auténticos y experiencias únicas.',
}

// Revalidate every hour
export const revalidate = 3600

export default async function ExplorePage() {
  const supabase = createStaticClient()

  // Fetch guides with public profiles
  const { data: guides } = await supabase
    .from('public_links')
    .select(`
      slug,
      user:users (
        name,
        bio,
        photo_url,
        location,
        language
      )
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })

  // Transform data for the client component
  const formattedGuides = guides?.map(item => ({
    slug: item.slug,
    // @ts-ignore - Supabase types join handling
    name: item.user?.name || 'Guía RutaLink',
    // @ts-ignore
    bio: item.user?.bio,
    // @ts-ignore
    photo_url: item.user?.photo_url,
    // @ts-ignore
    location: item.user?.location,
    // @ts-ignore
    language: item.user?.language,
  })) || []

  return <DirectoryClient initialGuides={formattedGuides} />
}
