import { ShieldCheck, UserCheck, FileCheck, Phone } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-static'

export default async function VerificationInfoPage() {
  const steps = [
    {
      icon: FileCheck,
      title: "1. Documentación Oficial",
      desc: "Validamos la identidad de cada guía mediante identificación oficial (INE, Pasaporte) y comprobante de domicilio."
    },
    {
      icon: UserCheck,
      title: "2. Validación de Experiencia",
      desc: "Revisamos evidencia de su actividad turística, incluyendo fotos de tours reales y, en su caso, certificaciones (SECTUR)."
    },
    {
      icon: Phone,
      title: "3. Entrevista Personal",
      desc: "Realizamos una videollamada con cada guía para conocerlos, verificar su profesionalismo y responder sus dudas."
    },
    {
      icon: ShieldCheck,
      title: "4. Monitoreo Continuo",
      desc: "Mantenemos el estándar de calidad mediante el sistema de reseñas y reportes de viajeros."
    }
  ]

  return (
    <div className="container mx-auto px-5 py-24 max-w-4xl">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <ShieldCheck size={40} className="text-green-600" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 mb-4">
          Proceso de Verificación MySenda
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tu seguridad es nuestra prioridad. Así es como garantizamos que nuestros guías sean quienes dicen ser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={index} className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Icon size={24} className="text-gray-700" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-xl mb-3 text-blue-900">¿Eres guía turístico?</h3>
        <p className="text-blue-800 mb-6">
          Obtener tu insignia de verificación es gratuito y aumenta tus reservas en un 300%.
        </p>
        <Link 
          href="/auth?view=signup&role=guide" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Iniciar Verificación
        </Link>
      </div>
    </div>
  )
}

