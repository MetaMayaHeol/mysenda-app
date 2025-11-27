import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AvailabilityForm } from '@/components/dashboard/AvailabilityForm'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default async function AvailabilityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch existing availability
  const { data: weekdays } = await supabase
    .from('availability')
    .select('weekday, active')
    .eq('user_id', user.id)

  const { data: timeslots } = await supabase
    .from('timeslots')
    .select('time, active')
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Disponibilidad" />

      <div className="p-5 max-w-md mx-auto">
        <AvailabilityForm 
          initialWeekdays={weekdays || []}
          initialTimeslots={timeslots || []}
        />
      </div>
    </div>
  )
}
