import { getTranslations } from 'next-intl/server'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const dynamic = 'force-static'

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('faq')

  const questions = [
    { q: 'travelerQ1', a: 'travelerA1' },
    { q: 'travelerQ2', a: 'travelerA2' },
    { q: 'travelerQ3', a: 'travelerA3' },
    { q: 'travelerQ4', a: 'travelerA4' },
    { q: 'travelerQ5', a: 'travelerA5' },
    { q: 'travelerQ6', a: 'travelerA6' },
  ]

  return (
    <div className="container mx-auto px-5 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4 text-center">{t('title')}</h1>
      <p className="text-xl text-gray-600 text-center mb-12">{t('subtitle')}</p>

      <Accordion type="single" collapsible className="w-full">
        {questions.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium text-lg">
              {t(item.q)}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              {t(item.a)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
