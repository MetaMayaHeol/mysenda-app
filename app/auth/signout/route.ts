import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  // Redirect to login page - defaulting to /fr for now as per other redirects
  // In a robust app, we'd extract the locale from the referrer or cookie
  return NextResponse.redirect(new URL('/fr/auth/login', request.url), {
    status: 302,
  })
}
