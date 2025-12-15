'use server'

import { createClient } from '@/lib/supabase/server'
import { bookingSchema } from '@/lib/utils/validators'
import { apiRateLimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'

interface BookingState {
  error?: string
  message?: string
  success: boolean
}

export async function createBooking(prevState: BookingState | null, formData: FormData): Promise<BookingState> {
  // 1. Rate Limiting
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1'
  const { success: allowed } = await apiRateLimit.limit(ip)

  if (!allowed) {
    return { error: 'Demasiadas solicitudes. Intenta más tarde.', success: false }
  }

  // 2. Parse & Validate
  const rawData = {
    service_id: formData.get('service_id'),
    user_id: formData.get('user_id'),
    customer_name: formData.get('customer_name'),
    customer_whatsapp: formData.get('customer_whatsapp'),
    date: formData.get('date'),
    time: formData.get('time'),
  }

  const validated = bookingSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: 'Datos inválidos', success: false }
  }

  const { service_id, user_id, customer_name, customer_whatsapp, date, time } = validated.data
  const supabase = await createClient()

  // 3. Double Booking Check
  // Check if there is already a confirmed or pending booking for this slot
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('service_id', service_id)
    .eq('date', date)
    .eq('time', time)
    .in('status', ['confirmed', 'pending_confirmation'])
    .single()

  if (existing) {
    return { error: 'Este horario ya no está disponible.', success: false }
  }

  // 4. Create Booking
  const { error: insertError } = await supabase
    .from('bookings')
    .insert({
      service_id,
      user_id,
      customer_name,
      customer_whatsapp,
      date,
      time,
      status: 'pending_confirmation'
    })

  if (insertError) {
    console.error('Booking Error:', insertError)
    // RETURN DETAILED ERROR FOR DEBUGGING
    return { error: `Error al procesar la reserva: ${insertError.message || JSON.stringify(insertError)}`, success: false }
  }

  // 5. Send Notification (Email + In-App)
  // We use the imported utility which uses Service Role internally
  const { sendNotification } = await import('@/lib/notifications')
  await sendNotification({
    userId: user_id,
    title: 'Nueva Solicitud de Reserva',
    message: `Tienes una nueva solicitud para ${service_id} el día ${date} a las ${time}. Cliente: ${customer_name}`,
    type: 'booking_request',
    link: '/dashboard/bookings' // TODO: Build this page
  })

  return { success: true, message: 'Solicitud enviada. Redirigiendo a WhatsApp...' }
}
