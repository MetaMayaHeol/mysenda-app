import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ServiceForm } from '@/components/dashboard/ServiceForm'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default async function NewServicePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Nuevo servicio" />

      <div className="p-5 max-w-md mx-auto">
        <ServiceForm userId={user.id} />
      </div>
    </div>
  )
}
