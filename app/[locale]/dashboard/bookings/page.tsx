import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getGuideBookings, type BookingWithService } from '@/app/actions/bookings'
import { BookingCard } from '@/components/dashboard/BookingCard'

export default async function BookingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: bookings, error } = await getGuideBookings()

  // Group bookings by status
  const pendingBookings = bookings?.filter(b => b.status === 'pending_confirmation') || []
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed') || []
  const completedBookings = bookings?.filter(b => b.status === 'completed') || []
  const cancelledBookings = bookings?.filter(b => b.status === 'cancelled') || []

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Reservaciones</h1>
            <p className="text-sm text-gray-500">
              {bookings?.length || 0} reservación{bookings?.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && (!bookings || bookings.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sin reservaciones</h3>
            <p className="text-sm text-gray-500 mb-4">
              Cuando los viajeros soliciten tus tours, aparecerán aquí.
            </p>
            <Link href="/dashboard">
              <Button variant="outline">Volver al dashboard</Button>
            </Link>
          </div>
        )}

        {/* Pending bookings */}
        {pendingBookings.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-yellow-600" />
              <h2 className="font-semibold text-gray-900">
                Pendientes ({pendingBookings.length})
              </h2>
            </div>
            <div className="space-y-3">
              {pendingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        )}

        {/* Confirmed bookings */}
        {confirmedBookings.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={18} className="text-green-600" />
              <h2 className="font-semibold text-gray-900">
                Confirmadas ({confirmedBookings.length})
              </h2>
            </div>
            <div className="space-y-3">
              {confirmedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        )}

        {/* Completed bookings */}
        {completedBookings.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-blue-600" />
              <h2 className="font-semibold text-gray-900">
                Completadas ({completedBookings.length})
              </h2>
            </div>
            <div className="space-y-3">
              {completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        )}

        {/* Cancelled bookings */}
        {cancelledBookings.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={18} className="text-red-500" />
              <h2 className="font-semibold text-gray-900">
                Canceladas ({cancelledBookings.length})
              </h2>
            </div>
            <div className="space-y-3">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
