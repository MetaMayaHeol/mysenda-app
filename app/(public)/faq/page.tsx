import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes - RutaLink',
  description: 'Respuestas a las preguntas más comunes sobre RutaLink para viajeros y guías turísticos.',
}

export default function FAQPage() {
  const travelerFAQs = [
    {
      question: '¿Cómo reservo un tour?',
      answer: 'Explora los perfiles de guías, elige el que más te guste y contacta directamente por WhatsApp. Puedes coordinar fechas, precios y detalles del tour directamente con el guía.',
    },
    {
      question: '¿Es seguro contactar por WhatsApp?',
      answer: 'Sí. Todos nuestros guías verificados han pasado un proceso de validación de identidad. Sin embargo, siempre recomendamos verificar los detalles del tour, confirmar precios por escrito y seguir las mejores prácticas de seguridad al viajar.',
    },
    {
      question: '¿Puedo cancelar mi reserva?',
      answer: 'Las políticas de cancelación las establece cada guía individualmente. Te recomendamos acordar los términos de cancelación por escrito con tu guía antes de hacer cualquier pago o reserva.',
    },
    {
      question: '¿Los guías están verificados?',
      answer: 'Los guías con el badge "Guía Verificado" han pasado nuestro proceso de verificación que incluye: validación de identidad, prueba de experiencia, verificación de fotos y revisión de antecedentes. Haz clic en el badge para más detalles.',
    },
    {
      question: '¿Qué idiomas hablan los guías?',
      answer: 'Cada perfil de guía muestra los idiomas que habla. Puedes filtrar guías por idioma en la página de exploración para encontrar uno que hable tu lengua nativa.',
    },
    {
      question: '¿Hay garantía de reembolso?',
      answer: 'RutaLink facilita la conexión entre viajeros y guías, pero no procesa pagos directamente (a menos que uses nuestra opción de pago integrado). Las políticas de reembolso las establece cada guía. Para mayor seguridad, puedes usar nuestra opción de pago con garantía.',
    },
  ]

  const guideFAQs = [
    {
      question: '¿Cómo me registro como guía?',
      answer: 'Haz clic en "Soy Guía Turístico" en la página principal, crea una cuenta con tu email, completa tu perfil con fotos y descripción, y añade tus tours. ¡Es completamente gratis!',
    },
    {
      question: '¿Cuánto cuesta crear un perfil?',
      answer: 'Crear y mantener tu perfil es 100% GRATIS. No cobramos ninguna tarifa mensual ni anual. Puedes publicar todos los tours que quieras sin costo.',
    },
    {
      question: '¿Cómo recibo pagos?',
      answer: 'Puedes coordinar pagos directamente con tus clientes (efectivo, transferencia, etc.) sin que RutaLink tome comisión. También ofrecemos una opción de pago integrado opcional con tarifas competitivas.',
    },
    {
      question: '¿RutaLink cobra comisión?',
      answer: 'NO cobramos comisión en reservas directas. Si un viajero te contacta por WhatsApp y paga directamente, el 100% del pago es tuyo. Solo cobramos una pequeña tarifa si usas servicios premium opcionales.',
    },
    {
      question: '¿Cómo me verifico?',
      answer: 'Completa tu perfil al 100%, sube una foto de tu identificación oficial, proporciona pruebas de tu experiencia como guía (certificaciones, referencias) y nuestro equipo revisará tu solicitud en 2-3 días hábiles.',
    },
    {
      question: '¿Puedo ofrecer varios tours?',
      answer: '¡Sí! Puedes crear ilimitados tours en tu perfil. Cada tour puede tener su propia descripción, precio, duración y fotos. Esto ayuda a los viajeros a encontrar exactamente lo que buscan.',
    },
  ]

  const technicalFAQs = [
    {
      question: '¿Cómo funciona el pago seguro?',
      answer: 'Nuestro sistema de pago integrado (opcional) utiliza procesadores seguros como Stripe. Los fondos se retienen hasta que el tour se complete satisfactoriamente, ofreciendo protección tanto al viajero como al guía.',
    },
    {
      question: '¿Mis datos están protegidos?',
      answer: 'Sí. Usamos encriptación SSL, cumplimos con estándares de privacidad internacionales y nunca compartimos tu información personal sin tu consentimiento. Lee nuestra Política de Privacidad para más detalles.',
    },
    {
      question: '¿En qué países está disponible?',
      answer: 'Actualmente RutaLink está enfocado en México, pero estamos expandiéndonos a otros países de Latinoamérica. Los guías de cualquier país pueden registrarse y ofrecer sus servicios.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-5">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 mb-8">
              <ChevronLeft size={20} />
              Volver al inicio
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl text-gray-300">Encuentra respuestas a las dudas más comunes</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-5 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Para Viajeros */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                V
              </span>
              Para Viajeros
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {travelerFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`traveler-${index}`} className="border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Para Guías */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                G
              </span>
              Para Guías
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {guideFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`guide-${index}`} className="border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Técnicas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">
                T
              </span>
              Preguntas Técnicas
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {technicalFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`tech-${index}`} className="border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Contact CTA */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-3">¿No encontraste tu respuesta?</h3>
            <p className="text-gray-600 mb-6">Nuestro equipo está aquí para ayudarte</p>
            <Link href="/support">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Contactar Soporte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
