import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-5 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Logo */}
          <div className="w-24 h-24 bg-green-500 rounded-3xl mx-auto mb-8 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">R</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Tu página de guía turístico
            <br />
            <span className="text-green-500">en 2 minutos</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crea tu perfil profesional, muestra tus servicios y recibe reservas por WhatsApp.
            Sin complicaciones, sin comisiones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explorar">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 text-lg">
                Explorar Guías
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="h-14 px-8 text-lg">
                Soy Guía
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-5 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Configuración rápida</h3>
            <p className="text-gray-600">
              Crea tu página en minutos. Solo necesitas tu email y listo.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Reservas por WhatsApp</h3>
            <p className="text-gray-600">
              Tus clientes te contactan directamente. Sin intermediarios.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">📱</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Optimizado para móvil</h3>
            <p className="text-gray-600">
              Funciona perfecto incluso con conexión lenta. Ideal para zonas turísticas.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-500 text-white py-20">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de guías que ya usan RutaLink
          </p>
          <Link href="/auth/login">
            <Button className="bg-white text-green-500 hover:bg-gray-100 font-bold h-14 px-8 text-lg">
              Crear mi página gratis
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-5 text-center">
          <p className="text-gray-400">
            © 2024 RutaLink. Hecho para guías turísticos.
          </p>
        </div>
      </footer>
    </div>
  )
}
