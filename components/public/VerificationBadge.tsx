'use client'

import { ShieldCheck } from 'lucide-react'
import { VerificationBadgeModal } from './VerificationBadgeModal'
import { useState } from 'react'

interface VerificationBadgeProps {
  size?: number
}

export function VerificationBadge({ size = 24 }: VerificationBadgeProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <VerificationBadgeModal open={showModal} onOpenChange={setShowModal} />
      <button
        onClick={() => setShowModal(true)}
        className="text-green-500 hover:text-green-600 transition-colors cursor-pointer"
        title="Guía Verificado - Haz clic para más información"
        aria-label="Ver información de verificación"
      >
        <ShieldCheck size={size} fill="currentColor" className="text-green-100 stroke-green-600" />
      </button>
    </>
  )
}
