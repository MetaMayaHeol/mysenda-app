import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, Mail, MessageCircle, Clock, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Soporte - RutaLink',
  description: 'Contacta con el equipo de soporte de RutaLink para resolver tus dudas.',
}

export default function SupportPage() {
  const commonIssues = [
    { title: 'Problemas con reserva', href: '/faq#reservas' },
    { title: 'Verificación de guía', href: '/faq#verificacion' },
    { title: 'Reembolsos y cancelaciones', href: '/cancellation-policy' },
    { title: 'Cuenta y perfil', href: '/faq#cuenta' },
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Centro de Soporte</h1>
          <p className="text-xl text-gray-300">Estamos aquí para ayudarte</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Email</h2>
              <p className="text-gray-600 mb-4">
                Envíanos un correo con tu consulta y te respondemos en menos de 24 horas
              </p>
              <a 
                href="mailto:support@rutalink.com" 
                className="text-blue-600 font-semibold hover:underline text-lg"
              >
                support@rutalink.com
              </a>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Clock size={16} />
                <span>Respuesta en ~12-24 horas</span>
              </div>
            </div>

            {/* WhatsApp Support */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="text-green-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">WhatsApp</h2>
              <p className="text-gray-600 mb-4">
                Chatea con nosotros directamente para soporte inmediato
              </p>
              <a 
                href="https://wa.me/5215512345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Abrir WhatsApp
                </Button>
              </a>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Clock size={16} />
                <span>Lun-Vie 9:00-18:00 (GMT-6)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="text-purple-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">Problemas Comunes</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Encuentra soluciones rápidas a los problemas más frecuentes
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
            <h3 className="text-xl font-bold text-gray-900 mb-3">¿Ya revisaste nuestro FAQ?</h3>
            <p className="text-gray-600 mb-6">
              La mayoría de preguntas ya están respondidas en nuestra sección de preguntas frecuentes
            </p>
            <Link href="/faq">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
                Ver Preguntas Frecuentes
              </Button>
            </Link>
          </div>

          {/* Response Times */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-3">Tiempos de respuesta esperados:</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span><strong>WhatsApp:</strong> Respuesta inmediata durante horario laboral</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span><strong>Email:</strong> 12-24 horas en días hábiles</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span><strong>Casos urgentes:</strong> Prioridad máxima, respuesta en 2-4 horas</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">
              <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (Hora del Centro de México)
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Los mensajes recibidos fuera de horario serán atendidos el siguiente día hábil
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
