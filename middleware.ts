import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n/config'
import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimit } from '@/lib/ratelimit'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
})

export default async function middleware(req: NextRequest) {
  // 1. API Rate Limiting
  if (req.nextUrl.pathname.startsWith('/api')) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await apiRateLimit.limit(ip)

    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    
    return NextResponse.next()
  }

  // 2. Intl Middleware for other routes
  return intlMiddleware(req)
}

export const config = {
  // Match all paths except static files and Next.js internals
  // Removed 'api' from exclusion to allow rate limiting
  matcher: [
    '/((?!_next|images|favicon.ico|robots.txt|sitemap.xml|auth|.*\\..*).*)',
  ],
}
