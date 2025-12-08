'use client'

import { useActionState } from 'react'
import { signInWithEmail } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

const initialState = {
  error: '',
  success: false,
  message: ''
}

export default function LoginPage() {
  const [state, action, isPending] = useActionState(signInWithEmail, initialState)
  const [origin, setOrigin] = useState('')
  const [isGuideSignup, setIsGuideSignup] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
    const params = new URLSearchParams(window.location.search)
    setIsGuideSignup(params.get('role') === 'guide')
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="w-20 h-20 bg-green-500 rounded-2xl mx-auto mb-8 flex items-center justify-center">
          <span className="text-white text-3xl font-bold">R</span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">
          {isGuideSignup ? 'Regístrate como Guía' : 'RutaLink'}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {isGuideSignup 
            ? 'Únete a la comunidad de guías verificados.' 
            : 'Crea tu página en 2 minutos'}
        </p>

        <form action={action} className="space-y-4">
          <input type="hidden" name="origin" value={origin} />
          <div>
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              disabled={isPending}
              className="h-12 text-base"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold"
          >
            {isPending ? 'Enviando...' : 'Recibir enlace mágico'}
          </Button>

          {state?.error && (
            <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="p-4 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
              {state.message}
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Un enlace de conexión será enviado a tu email
        </p>
      </div>
    </div>
  )
}
