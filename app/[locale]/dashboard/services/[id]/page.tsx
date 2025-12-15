import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ServiceForm } from '@/components/dashboard/ServiceForm'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteService } from '@/app/actions/services'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

import { getAllCitiesResults } from '@/lib/seo/cities-db'

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const citiesData = await getAllCitiesResults()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch service (excluding soft-deleted)
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  if (!service) {
    redirect('/dashboard')
  }

  // Fetch photos
  const { data: photos } = await supabase
    .from('service_photos')
    .select('url')
    .eq('service_id', id)
    .order('order', { ascending: true })

  const photoUrls = photos?.map((p) => p.url) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Editar servicio">
        <form action={async () => {
          'use server'
          await deleteService(id)
          redirect('/dashboard')
        }}>
          <Button type="submit" variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 size={24} />
          </Button>
        </form>
      </DashboardHeader>

      <div className="p-5 max-w-md mx-auto">
        <ServiceForm 
          userId={user.id}
          serviceId={service.id}
          cities={citiesData}
          initialData={{
            title: service.title,
            subtitle: service.subtitle || '',
            description: service.description || '',
            price: service.price,
            duration: service.duration,
            active: service.active,
            photos: photoUrls,
            locations: service.locations || [],
            categories: service.categories || [],
            itinerary: service.itinerary || [],
            includes: service.includes || [],
            excludes: service.excludes || [],
            requirements: service.requirements || [],
            meeting_point: service.meeting_point || '',
            cancellation_policy: service.cancellation_policy || 'flexible',
            max_pax: service.max_pax,
            languages: service.languages || [],
          }}
        />
      </div>
    </div>
  )
}
