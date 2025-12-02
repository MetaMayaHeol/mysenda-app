'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

interface VerificationBadgeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VerificationBadgeModal({ open, onOpenChange }: VerificationBadgeModalProps) {
  const verificationSteps = [
    {
      title: 'Verificación de Identidad',
      description: 'Revisión de documento oficial (INE, pasaporte) para confirmar identidad del guía.',
    },
    {
      title: 'Prueba de Experiencia',
      description: 'Validación de experiencia como guía turístico mediante certificaciones, referencias o portafolio.',
    },
    {
      title: 'Verificación de Fotos',
      description: 'Control de autenticidad de fotos de perfil y galería para garantizar transparencia.',
    },
    {
      title: 'Revisión de Antecedentes',
      description: 'Verificación de buenas prácticas y ausencia de quejas graves en plataformas previas.',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="text-green-500" size={28} fill="currentColor" />
            Guía Verificado
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            El badge &quot;Guía Verificado&quot; garantiza que el perfil ha pasado nuestro proceso de validación riguroso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <h4 className="font-semibold text-sm text-gray-700">Proceso de Verificación:</h4>
          
          <div className="space-y-3">
            {verificationSteps.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="text-green-500" size={20} />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-gray-900">{step.title}</h5>
                  <p className="text-xs text-gray-600 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-green-800">
              <strong>Nota:</strong> La verificación no garantiza la calidad del servicio, pero sí confirma 
              que el guía es quien dice ser y cuenta con experiencia demostrable.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
