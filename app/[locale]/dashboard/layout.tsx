import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard - MySenda',
  description: 'Gestiona tus servicios y perfil',
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check onboarding status
  const { data: profile } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  return children
}
