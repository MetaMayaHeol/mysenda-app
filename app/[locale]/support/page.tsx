import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, Mail, MessageCircle, Clock, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'support' })
  
  return {
    title: `${t('title')} - RutaLink`,
    description: t('subtitle'),
  }
}

export default async function SupportPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  
  const t = await getTranslations('support')

  const commonIssues = [
    { title: t('issueBooking'), href: `/${locale}/faq#reservas` },
    { title: t('issueVerification'), href: `/${locale}/faq#verificacion` },
    { title: t('issueRefunds'), href: `/${locale}/cancellation-policy` },
    { title: t('issueAccount'), href: `/${locale}/faq#cuenta` },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-5">
          <Link href={`/${locale}`}>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 mb-8">
              <ChevronLeft size={20} />
              {t('backHome')}
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-300">{t('subtitle')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-5 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Email Support */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-8">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Mail className="text-blue-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('emailTitle')}</h2>
              <p className="text-gray-600 mb-4">
                {t('emailDesc')}
              </p>
              <a 
                href="mailto:support@rutalink.com" 
                className="text-blue-600 font-semibold hover:underline text-lg"
              >
                support@rutalink.com
              </a>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Clock size={16} />
                <span>{t('emailResponse')}</span>
              </div>
            </div>

            {/* WhatsApp Support */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="text-green-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('whatsappTitle')}</h2>
              <p className="text-gray-600 mb-4">
                {t('whatsappDesc')}
              </p>
              <a 
                href="https://wa.me/5215512345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  {t('openWhatsapp')}
                </Button>
              </a>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Clock size={16} />
                <span>{t('whatsappHours')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="text-purple-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">{t('commonIssues')}</h2>
            </div>
            <p className="text-gray-600 mb-6">
              {t('commonIssuesDesc')}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {commonIssues.map((issue, index) => (
                <Link 
                  key={index}
                  href={issue.href}
                  className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-gray-900 font-semibold group-hover:text-purple-700">
                    {issue.title} →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Link */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('checkFaq')}</h3>
            <p className="text-gray-600 mb-6">
              {t('faqDesc')}
            </p>
            <Link href={`/${locale}/faq`}>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
                {t('viewFaq')}
              </Button>
            </Link>
          </div>

          {/* Response Times */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-3">{t('responseTimes')}</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span><strong>WhatsApp:</strong> {t('whatsappImmediate')}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span><strong>Email:</strong> {t('emailTime')}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>{t('urgentCases')}</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">
              <strong>{t('businessHours')}</strong> {t('businessHoursValue')}
            </p>
            <p className="text-xs mt-2 text-gray-500">
              {t('afterHours')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
