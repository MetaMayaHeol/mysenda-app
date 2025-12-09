import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/Header'
import { locales, type Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data'

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
    es: 'MySenda - Conecta con Guías Turísticos Locales en México',
    fr: 'MySenda - Connectez-vous avec des Guides Locaux au Mexique',
  }
  
  const descriptions: Record<string, string> = {
    es: 'Descubre experiencias auténticas con guías locales verificados en MySenda. Sin intermediarios, sin comisiones.',
    fr: 'Découvrez des expériences authentiques avec des guides locaux vérifiés sur MySenda. Sans intermédiaires, sans commission.',
  }
  
  return {
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'es': '/es',
        'fr': '/fr',
      },
    },
    manifest: '/manifest.json',
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com'
  const orgSchema = generateOrganizationSchema(baseUrl)
  const websiteSchema = generateWebSiteSchema(baseUrl)

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={orgSchema} />
          <JsonLd data={websiteSchema} />
          <Header user={user} />
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
