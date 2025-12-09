import { Mail, MessageCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-static'

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('common') 

  return (
    <div className="container mx-auto px-5 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Soporte y Ayuda</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-lg text-gray-600 mb-8 text-center">
          ¿Tienes alguna duda o problema? Estamos aquí para ayudarte en cada paso de tu viaje.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a 
            href="mailto:support@mysenda.com"
            className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-white">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Email</h3>
            <p className="text-blue-600">support@mysenda.com</p>
          </a>

          <a 
            href="https://wa.me/5299999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-white">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
            <p className="text-green-600">Chat Directo</p>
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="font-bold text-xl mb-4 text-center">Preguntas Frecuentes</h3>
          <p className="text-center text-gray-600 mb-6">
            Quizás tu duda ya esté resuelta. Revisa nuestra sección de preguntas frecuentes.
          </p>
          <div className="text-center">
            <a href="/faq" className="text-green-600 font-semibold hover:underline">
              Ir a Preguntas Frecuentes &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
