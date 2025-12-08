import { JsonLd } from '@/components/seo/JsonLd'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data'

// ... existing imports

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  
  // ... existing logic
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rutalink.com'
  const messages = await getMessages()

  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
