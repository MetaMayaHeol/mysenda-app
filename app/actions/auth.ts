'use server'

import { createClient } from '@/lib/supabase/server'
import { authRateLimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'

interface AuthState {
  error: string
  success: boolean
  message: string
}

export async function signInWithEmail(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const origin = formData.get('origin') as string
  
  if (!email) {
    return { error: 'Email is required', success: false, message: '' }
  }

  try {
    // 1. Rate Limiting
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await authRateLimit.limit(ip)

    if (!success) {
      return { error: 'Too many requests. Please try again later.', success: false, message: '' }
    }

    // 2. Supabase Auth
    const supabase = await createClient()
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message, success: false, message: '' }
    }

    return { success: true, message: 'Check your email for the magic link!', error: '' }
  } catch (err) {
    console.error('Login error:', err)
    return { error: 'An unexpected error occurred', success: false, message: '' }
  }
}
