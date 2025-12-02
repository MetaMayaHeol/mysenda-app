import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, AlertCircle, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Política de Cancelación - RutaLink',
  description: 'Conoce los términos y condiciones de cancelación y reembolso en RutaLink.',
}

export default function CancellationPolicyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Cancelación</h1>
          <p className="text-xl text-gray-300">Términos y condiciones de cancelación y reembolso</p>
          <p className="text-sm text-gray-400 mt-4">Última actualización: Diciembre 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-5 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex gap-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Importante</h3>
              <p className="text-yellow-800 text-sm leading-relaxed">
                RutaLink actúa como plataforma de conexión entre viajeros y guías. Las políticas de 
                cancelación específicas las establece cada guía de forma individual. Esta política general 
                aplica cuando se utilizan nuestros servicios de pago integrado.
              </p>
            </div>
          </div>

          {/* General Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Términos Generales</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Al reservar un tour a través de RutaLink, aceptas los siguientes términos de cancelación. 
                Estas políticas están diseñadas para ser justas tanto para viajeros como para guías turísticos.
              </p>
            </div>
          </section>

          {/* Cancellation by Traveler */}
          <section className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="text-blue-600" size={24} />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cancelación por el Viajero</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="font-semibold text-green-900 mb-1">Más de 7 días antes del tour</p>
                <p className="text-green-800 text-sm">Reembolso del 100% del monto pagado</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-900 mb-1">Entre 3-7 días antes del tour</p>
                <p className="text-blue-800 text-sm">Reembolso del 50% del monto pagado</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <p className="font-semibold text-orange-900 mb-1">Menos de 3 días antes del tour</p>
                <p className="text-orange-800 text-sm">Sin reembolso (el guía puede ofrecer reprogramación)</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="font-semibold text-red-900 mb-1">No asistencia sin aviso</p>
                <p className="text-red-800 text-sm">Sin reembolso y posible penalización en futuras reservas</p>
              </div>
            </div>
          </section>

          {/* Cancellation by Guide */}
          <section className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="text-green-600" size={24} />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cancelación por el Guía</h3>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                Si un guía cancela una reserva confirmada:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Reembolso completo del 100% del pago</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Prioridad para reservar otro tour con diferente guía</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Posible compensación adicional según el caso</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Force Majeure */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Fuerza Mayor</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              En caso de eventos fuera del control de ambas partes (desastres naturales, pandemias, 
              disturbios civiles, cierres gubernamentales, etc.):
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Se ofrecerá reprogramación sin costo adicional</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Si la reprogramación no es posible, se reembolsará el 100%</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Los gastos ya incurridos por el guía podrán ser deducidos del reembolso</span>
              </li>
            </ul>
          </section>

          {/* Modifications */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Modificaciones</h3>
            <p className="text-gray-700 leading-relaxed">
              Los cambios de fecha están sujetos a disponibilidad del guía. Se recomienda coordinar 
              cambios con al menos 48 horas de anticipación. El guía puede aplicar cargos adicionales 
              por cambios de último momento.
            </p>
          </section>

          {/* Refund Process */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Proceso de Reembolso</h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-green-600">1.</span>
                <span>Solicita la cancelación desde tu panel de reservas o contacta a soporte</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600">2.</span>
                <span>Recibirás confirmación de cancelación en 24-48 horas</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600">3.</span>
                <span>El reembolso se procesará en 5-10 días hábiles</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600">4.</span>
                <span>Los fondos aparecerán en tu método de pago original</span>
              </li>
            </ol>
          </section>

          {/* Disputes */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Resolución de Disputas</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              En caso de desacuerdo sobre una cancelación o reembolso:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="text-purple-600">→</span>
                <span>Contacta primero directamente al guía para intentar resolver</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600">→</span>
                <span>Si no hay acuerdo, contacta a soporte de RutaLink</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600">→</span>
                <span>Nuestro equipo mediará para encontrar una solución justa</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600">→</span>
                <span>La decisión final de RutaLink será vinculante</span>
              </li>
            </ul>
          </section>

          {/* Contact CTA */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-3">¿Necesitas cancelar o modificar?</h3>
            <p className="text-gray-600 mb-6">Contacta a nuestro equipo de soporte para ayudarte</p>
            <Link href="/support">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Ir a Soporte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
