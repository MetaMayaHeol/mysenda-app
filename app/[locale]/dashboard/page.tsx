import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QRCodeCard } from '@/components/dashboard/QRCodeCard'
import { PublicLinkDisplay } from '@/components/dashboard/PublicLinkDisplay'
import { EmptyState } from '@/components/ui/EmptyState'
import { isAdmin } from '@/lib/auth/admin'
import { Share2 } from 'lucide-react'
import { ShareButton } from '@/components/public/ShareButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch user's public link
  const { data: publicLink } = await supabase
    .from('public_links')
    .select('slug')
    .eq('user_id', user.id)
    .single()

  // Fetch user's services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Check if user is admin
  const userIsAdmin = await isAdmin()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Preview */}
      <div className="bg-white border-b border-gray-200 p-5 relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-16 h-16 bg-gray-300 rounded-xl flex items-center justify-center">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.name || 'Profile'}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900">Mi página</h2>
            <p className="text-sm text-gray-600">
              <PublicLinkDisplay slug={publicLink?.slug || null} />
            </p>
          </div>
        </div>
        {publicLink?.slug && (
          <div className="flex gap-2 w-full mt-3">
            <Link href={`/g/${publicLink.slug}`} className="flex-1">
              <Button variant="outline" className="w-full">
                👁️ Ver mi página
              </Button>
            </Link>
            <ShareButton 
              title={`Perfil de ${profile?.name || 'Guía'}`}
              text={`Hola! Echa un vistazo a mi perfil de guía turístico en MySenda: `}
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'}/g/${publicLink.slug}`}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white border-0"
              variant="default"
            >
              <Share2 size={16} className="mr-2" /> Compartir
            </ShareButton>
          </div>
        )}
      </div>

      {/* Growth/Marketing Section */}
      <div className="mx-5 mt-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Share2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-blue-900">¡Invita a otros guías!</h3>
            <p className="text-sm text-blue-700 mb-3">
              Ayuda a crecer la comunidad. Comparte MySenda con otros guías.
            </p>
            <ShareButton
              title="Únete a MySenda"
              text="Hola! Te invito a unirte a MySenda, la plataforma para guías turísticos locales. Es gratis y conectas directo con viajeros: "
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'}/auth/login`}
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-sm w-full sm:w-auto"
              variant="default"
            >
              Invitar Colegas
            </ShareButton>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Mis servicios</h3>
        </div>

        {services && services.length > 0 ? (
          <div className="space-y-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/dashboard/services/${service.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between hover:border-green-500 transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{service.title}</h4>
                    <p className="text-sm text-gray-600">${service.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        service.active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🎯"
            title="¡Crea tu primer servicio!"
            description="Comparte tus tours y experiencias con viajeros de todo el mundo"
            actionLabel="Agregar un servicio"
            actionHref="/dashboard/services/new"
          />
        )}

        {/* Add Service Button */}
        <Link href="/dashboard/services/new">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold mt-4 h-12">
            ➕ Agregar un servicio
          </Button>
        </Link>

        {/* Quick Actions */}
        <div className={`grid ${userIsAdmin ? 'grid-cols-2' : 'grid-cols-2'} gap-3 mt-4`}>
          <Link href="/dashboard/availability">
            <Button variant="outline" className="w-full h-12">
              📅 Disponibilidades
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="w-full h-12">
              👤 Mi perfil
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button variant="outline" className="w-full h-12">
              📊 Analytics
            </Button>
          </Link>
          <Link href="/dashboard/verification">
            <Button variant="outline" className="w-full h-12 text-green-700 border-green-200 bg-green-50 hover:bg-green-100">
              🛡️ Verificación
            </Button>
          </Link>
          {userIsAdmin && (
            <Link href="/dashboard/admin/reviews" className="col-span-2">
              <Button variant="outline" className="w-full h-12 text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100">
                👑 Panel de administración
              </Button>
            </Link>
          )}
        </div>

        {/* QR Code */}
        {publicLink?.slug ? (
          <div className="mt-6">
            <QRCodeCard slug={publicLink.slug} />
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              icon="📱"
              title="Tu código QR te espera"
              description="Completa tu perfil con un nombre para generar tu código QR y enlace público"
              actionLabel="Configurar perfil"
              actionHref="/dashboard/profile"
            />
          </div>
        )}
      </div>
    </div>
  )
}
