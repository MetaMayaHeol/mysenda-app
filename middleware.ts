import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL (/es/..., /fr/...)
  localeDetection: true,  // Detect from Accept-Language header
})

export const config = {
  // Match all paths except API routes, static files, etc.
  matcher: [
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /images, /favicon.ico, /robots.txt, /sitemap.xml (static files)
    '/((?!api|_next|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
