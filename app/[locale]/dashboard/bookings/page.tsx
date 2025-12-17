import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, CheckCircle, Archive, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getGuideBookings, type BookingWithService } from '@/app/actions/bookings'
import { BookingCard } from '@/components/dashboard/BookingCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

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
  const historyBookings = bookings?.filter(b => ['completed', 'cancelled'].includes(b.status)) || []

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

      <div className="p-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Empty state (Global) */}
        {!error && (!bookings || bookings.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mt-6">
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

        {bookingWithContent(bookings) && (
           <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                 <Clock size={16} />
                 <span className="hidden sm:inline">Pendientes</span>
                 <span className="sm:hidden">Pend.</span>
                 {pendingBookings.length > 0 && (
                   <span className="ml-1 bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full">
                     {pendingBookings.length}
                   </span>
                 )}
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="flex items-center gap-2">
                 <CheckCircle size={16} />
                 <span className="hidden sm:inline">Confirmadas</span>
                 <span className="sm:hidden">Conf.</span>
                 {confirmedBookings.length > 0 && (
                   <span className="ml-1 bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded-full">
                     {confirmedBookings.length}
                   </span>
                 )}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                 <Archive size={16} />
                 <span className="hidden sm:inline">Historial</span>
                 <span className="sm:hidden">Hist.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
               {pendingBookings.length > 0 ? (
                 pendingBookings.map((booking) => (
                   <BookingCard key={booking.id} booking={booking} />
                 ))
               ) : (
                 <EmptyTab message="No tienes solicitudes pendientes." />
               )}
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4">
               {confirmedBookings.length > 0 ? (
                 confirmedBookings.map((booking) => (
                   <BookingCard key={booking.id} booking={booking} />
                 ))
               ) : (
                 <EmptyTab message="No tienes reservaciones confirmadas." />
               )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
               {historyBookings.length > 0 ? (
                 historyBookings.map((booking) => (
                   <BookingCard key={booking.id} booking={booking} />
                 ))
               ) : (
                 <EmptyTab message="No hay historial de reservaciones." />
               )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

function bookingWithContent(bookings: BookingWithService[] | null) {
  return bookings && bookings.length > 0
}

function EmptyTab({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}
