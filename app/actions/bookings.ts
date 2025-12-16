'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Extended booking type with service info
export interface BookingWithService {
  id: string
  service_id: string
  user_id: string
  customer_name: string
  customer_whatsapp: string
  date: string
  time: string
  status: 'pending_confirmation' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  service: {
    title: string
  } | null
}

/**
 * Fetch all bookings for the authenticated guide
 */
export async function getGuideBookings(): Promise<{ 
  data: BookingWithService[] | null
  error: string | null 
}> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: 'No autenticado' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      service_id,
      user_id,
      customer_name,
      customer_whatsapp,
      date,
      time,
      status,
      created_at,
      service:services(title)
    `)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return { data: null, error: 'Error al obtener las reservaciones' }
  }

  // Transform the data to match our type
  const bookings: BookingWithService[] = (data || []).map((booking) => {
    // Supabase returns joined tables as arrays, extract the first item
    const serviceData = Array.isArray(booking.service) 
      ? booking.service[0] 
      : booking.service
    
    return {
      ...booking,
      status: booking.status as BookingWithService['status'],
      service: serviceData as { title: string } | null
    }
  })

  return { data: bookings, error: null }
}

/**
 * Update a booking status (confirm, cancel, complete)
 */
export async function updateBookingStatus(
  bookingId: string, 
  newStatus: 'confirmed' | 'cancelled' | 'completed'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  // Verify the booking belongs to the user
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, user_id')
    .eq('id', bookingId)
    .single()

  if (!booking || booking.user_id !== user.id) {
    return { success: false, error: 'Reservación no encontrada' }
  }

  // Update the status
  const { error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId)

  if (error) {
    console.error('Error updating booking:', error)
    return { success: false, error: 'Error al actualizar la reservación' }
  }

  revalidatePath('/dashboard/bookings')
  return { success: true }
}
