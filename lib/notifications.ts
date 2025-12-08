import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

// Use Service Role key for backend operations (sending notifications)
// This file should ONLY be used in Server Actions/Route Handlers
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null

interface NotificationParams {
  userId: string // Guide ID
  userEmail?: string // Guide Email (optional, if we want to skip fetching it)
  title: string
  message: string
  type: 'booking_request' | 'info' | 'alert' | 'system'
  link?: string
}

export async function sendNotification({
  userId,
  userEmail,
  title,
  message,
  type,
  link
}: NotificationParams) {
  const results = {
    email: false,
    db: false,
    errors: [] as string[]
  }

  // 1. Insert into Database (In-App)
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        link,
        read: false
      })
    
    if (error) throw error
    results.db = true
  } catch (err: any) {
    console.error('Notification DB Error:', err)
    results.errors.push(err.message)
  }

  // 2. Send Email (via Resend)
  if (resend) {
    try {
      // If email not provided, fetch from DB
      let emailTo = userEmail
      if (!emailTo) {
        const { data } = await supabaseAdmin
          .from('users')
          .select('email')
          .eq('id', userId)
          .single()
        emailTo = data?.email
      }

      if (emailTo) {
        await resend.emails.send({
          from: 'RutaLink <noreply@rutalink.com>', // Needs domain config or testing
          to: emailTo,
          subject: title,
          html: `<p><strong>${title}</strong></p><p>${message}</p>${link ? `<a href="${process.env.NEXT_PUBLIC_APP_URL}${link}">Ver detalles</a>` : ''}`
        })
        results.email = true
      }
    } catch (err: any) {
      console.error('Notification Email Error:', err)
      // Don't fail the whole request just because email failed
      results.errors.push(err.message)
    }
  }

  return results
}
