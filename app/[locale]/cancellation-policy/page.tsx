import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-static'

export default async function CancellationPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('faq') // Reusing some strings or just generic structure

  return (
    <div className="container mx-auto px-5 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Política de Cancelación</h1>
      
      <div className="prose max-w-none text-gray-700">
        <p className="lead text-xl mb-8">
          En RutaLink, creemos en la transparencia y flexibilidad entre viajeros y guías.
        </p>
        
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Políticas Individuales</h3>
        <p className="mb-6">
          Cada guía turístico en RutaLink establece sus propias políticas de cancelación. 
          Al contactar a un guía, te recomendamos confirmar por escrito:
        </p>
        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>El plazo límite para cancelar sin costo.</li>
          <li>Si se requiere un depósito y si es reembolsable.</li>
          <li>Qué sucede en caso de mal clima o fuerza mayor.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-4 text-gray-900">Recomendación General</h3>
        <p className="mb-6">
          Sugerimos siempre acordar los detalles por WhatsApp antes de realizar cualquier pago. 
          Si utilizas nuestro servicio de pago garantizado (cuando esté disponible), aplicarán las políticas estándar de protección al viajero.
        </p>
      </div>
    </div>
  )
}
