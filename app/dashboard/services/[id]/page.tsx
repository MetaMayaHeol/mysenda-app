import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ServiceForm } from '@/components/dashboard/ServiceForm'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteService } from '@/app/dashboard/services/actions'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch service
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
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
      <div className="bg-white border-b border-gray-200 p-5 flex items-center gap-3 sticky top-0 z-10">
        <DashboardHeader title="Editar servicio" showBackButton={false} />
        
        <form action={async () => {
          'use server'
          await deleteService(id)
          redirect('/dashboard')
        }}>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 size={24} />
          </Button>
        </form>
      </div>

      <div className="p-5 max-w-md mx-auto">
        <ServiceForm 
          userId={user.id}
          serviceId={service.id}
          initialData={{
            title: service.title,
            description: service.description || '',
            price: service.price,
            duration: service.duration,
            active: service.active,
            photos: photoUrls,
          }}
        />
      </div>
    </div>
  )
}
