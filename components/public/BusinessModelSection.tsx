import { Sparkles, TrendingUp, BarChart3, Trophy, CreditCard, Megaphone } from 'lucide-react'

export function BusinessModelSection() {
  const freeFeatures = [
    { icon: Sparkles, title: 'Perfil Profesional', description: 'Crea tu página gratuita' },
    { icon: TrendingUp, title: 'Publicación Ilimitada', description: 'Todos los tours que quieras' },
    { icon: BarChart3, title: 'Estadísticas Básicas', description: 'Vistas de tu perfil' },
  ]

  const premiumFeatures = [
    { icon: Trophy, title: 'Perfil Destacado', description: 'Aparece primero en búsquedas' },
    { icon: CreditCard, title: 'Pagos Integrados', description: 'Acepta pagos en línea' },
    { icon: Megaphone, title: 'Promoción Premium', description: 'Publicidad destacada' },
  ]

  return (
    <div className="py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto px-5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-sm mb-6">
            Transparencia Total
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ¿Cómo funciona nuestro modelo?
          </h2>
          <p className="text-xl text-gray-600">
            Creemos en la transparencia. Aquí te explicamos exactamente cómo RutaLink genera ingresos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Features */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100% Gratis</h3>
              <p className="text-gray-600">Para todos los guías, siempre</p>
            </div>

            <div className="space-y-4">
              {freeFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-gray-700" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-700 font-medium">
                ✓ Sin comisiones en reservas directas
              </p>
              <p className="text-sm text-gray-700 font-medium">
                ✓ Chat directo con viajeros
              </p>
              <p className="text-sm text-gray-700 font-medium">
                ✓ Control total de tus precios
              </p>
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              OPCIONAL
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Servicios Premium</h3>
              <p className="text-gray-600">Acelera tu crecimiento</p>
            </div>

            <div className="space-y-4">
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-green-700" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-green-200">
              <p className="text-sm text-gray-700 font-medium">
                ✓ Paga solo por lo que usas
              </p>
              <p className="text-sm text-gray-700 font-medium">
                ✓ Sin contratos largos
              </p>
              <p className="text-sm text-gray-700 font-medium">
                ✓ Cancela cuando quieras
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            <strong>Nuestra filosofía:</strong> RutaLink crece cuando los guías crecen. 
            Por eso no cobramos comisiones en reservas directas y mantenemos las funciones 
            básicas 100% gratuitas para siempre.
          </p>
        </div>
      </div>
    </div>
  )
}
