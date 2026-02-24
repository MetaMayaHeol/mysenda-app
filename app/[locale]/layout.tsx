import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import "../globals.css";
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/Header'
import { locales, type Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { GoogleAdSense } from '@/components/analytics/GoogleAdSense'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  
  const titles: Record<string, string> = {
    es: 'MySenda - Blog de Viaje & Descubrimientos en América Latina',
    fr: 'MySenda - Blog Voyage & Découvertes en Amérique Latine',
    en: 'MySenda - Travel & Discovery Blog about Latin America',
  }
  
  const descriptions: Record<string, string> = {
    es: 'Descubre relatos, itinerarios eco-responsables e inmersión en la cultura local de América Latina.',
    fr: 'Découvrez des récits, itinéraires éco-responsables et immersion dans la culture locale d\'Amérique Latine.',
    en: 'Discover stories, eco-friendly itineraries and immersion in the local culture of Latin America.',
  }
  
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'),
    title: {
      default: titles[locale] || titles.es,
      template: '%s | MySenda'
    },
    description: descriptions[locale] || descriptions.es,
    applicationName: 'MySenda',
    authors: [{ name: 'MySenda' }],
    keywords: ['guías turísticos', 'tour guides', 'mexico', 'yucatan', 'merida', 'valladolid', 'cenotes', 'tours', 'travel', 'voyage', 'tourisme', 'guides touristiques'],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'es': '/es',
        'fr': '/fr',
        'en': '/en',
      },
    },
    manifest: '/manifest.json',
    openGraph: {
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      url: `https://mysenda.com/${locale}`,
      siteName: 'MySenda',
      images: [
        {
          url: 'https://mysenda.com/hero-yucatan.webp', // Fallback to hero image for now
          width: 1200,
          height: 630,
          alt: 'MySenda - Guides Touristiques / Tour Guides',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      images: ['https://mysenda.com/hero-yucatan.webp'],
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the current locale
  const messages = await getMessages()

  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Header user={user} />
          {children}
          <Toaster />
          <Analytics />
          <GoogleAnalytics />
          <GoogleAdSense />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
