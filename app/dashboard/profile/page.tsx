import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/dashboard/ProfileForm'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { QRCodeCard } from '@/components/dashboard/QRCodeCard'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  let profile = (await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()).data

  // If profile doesn't exist, create it (fallback if trigger didn't fire)
  if (!profile) {
    const { data: newProfile, error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return <div className="p-5 text-red-600">Error al crear el perfil. Por favor contacta soporte.</div>
    }

    profile = newProfile
  }

  // Fetch user's public link
  const { data: publicLink } = await supabase
    .from('public_links')
    .select('slug')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Mi perfil" />

      <div className="p-5 max-w-md mx-auto">
        <ProfileForm 
          initialData={{
            name: profile.name || '',
            bio: profile.bio || '',
            city: profile.city || '',
            country: profile.country || 'México',
            whatsapp: profile.whatsapp || '',
            languages: profile.languages || ['es'],
            photo_url: profile.photo_url || '',
          }}
          userId={user.id}
        />

        {publicLink?.slug ? (
          <div className="mt-8 border-t pt-8">
            <QRCodeCard slug={publicLink.slug} />
          </div>
        ) : (
          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-gray-500 mb-2">
              ℹ️ Guarda tu perfil con un <strong>Nombre</strong> para generar tu Código QR y enlace público.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
