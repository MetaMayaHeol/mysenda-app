import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      
      // Default locale to 'fr' for now, or handle dynamic locale if needed
      // Since we moved this out of [locale], we should redirect to a locale-prefixed path
      const targetPath = `/fr${next.startsWith('/') ? next : `/${next}`}`

      if (baseUrl) {
        return NextResponse.redirect(`${baseUrl}${targetPath}`)
      } else if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${targetPath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${targetPath}`)
      } else {
        return NextResponse.redirect(`${origin}${targetPath}`)
      }
    } else {
      console.error('Auth error:', error)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/fr/auth/auth-code-error`)
}
