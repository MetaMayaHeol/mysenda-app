export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Bienvenido a MySenda 🚀</h1>
            <p className="text-gray-600 mt-2">Configura tu perfil en 2 minutos para empezar a recibir reservas.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
