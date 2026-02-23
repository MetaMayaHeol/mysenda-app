'use server'

import { createClient } from '@/lib/supabase/server'
import { authRateLimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'

import { redirect } from 'next/navigation'

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
    
    // Validate origin or fall back to env var
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

export async function signInWithGoogle(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const origin = formData.get('origin') as string
  let redirectUrl: string | null = null

  try {
    const supabase = await createClient()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || 'https://mysenda.com'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message, success: false, message: '' }
    }

    if (data.url) {
      redirectUrl = data.url
    } else {
      return { error: 'No redirect URL returned', success: false, message: '' }
    }
  } catch (err) {
    console.error('Google login error:', err)
    return { error: 'An unexpected error occurred', success: false, message: '' }
  }

  if (redirectUrl) {
    redirect(redirectUrl)
  }
  
  return { error: 'Unexpected flow', success: false, message: '' }
}

export async function signInWithPassword(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  let shouldRedirect = false

  if (!email || !password) {
    return { error: 'Email and password are required', success: false, message: '' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message, success: false, message: '' }
    }

    shouldRedirect = true
  } catch (err) {
    console.error('Password login error:', err)
    return { error: 'Invalid login credentials', success: false, message: '' }
  }

  if (shouldRedirect) {
    redirect('/admin/blog')
  }

  return { error: 'Unexpected flow', success: false, message: '' }
}

export async function signUpWithPassword(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const origin = formData.get('origin') as string

  if (!email || !password) {
    return { error: 'Email and password are required', success: false, message: '' }
  }

  try {
    const supabase = await createClient()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message, success: false, message: '' }
    }

    return { success: true, message: 'Account created! Please check your email to confirm.', error: '' }
  } catch (err) {
    console.error('Signup error:', err)
    return { error: 'An unexpected error occurred', success: false, message: '' }
  }
}

export async function sendPasswordResetEmail(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const origin = formData.get('origin') as string

  if (!email) {
    return { error: 'Email is required', success: false, message: '' }
  }

  try {
    const supabase = await createClient()
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin
    // Remove trailing slash if present to avoid double slashes
    baseUrl = baseUrl.replace(/\/$/, '')
    
    // Construct the full redirect URL using the dedicated callback route
    // This avoids query parameter wildcard issues in Supabase
    const redirectTo = `${baseUrl}/auth/reset-callback`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      return { error: error.message, success: false, message: '' }
    }

    return { success: true, message: 'Check your email for the password reset link!', error: '' }
  } catch (err) {
    console.error('Reset password error:', err)
    return { error: 'An unexpected error occurred', success: false, message: '' }
  }
}

export async function updatePassword(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return { error: 'Password is required', success: false, message: '' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match', success: false, message: '' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      return { error: error.message, success: false, message: '' }
    }
    
  } catch (err) {
    console.error('Update password error:', err)
    return { error: 'An unexpected error occurred', success: false, message: '' }
  }

  redirect('/admin/blog')
  return { error: 'Unexpected flow', success: false, message: '' }
}
