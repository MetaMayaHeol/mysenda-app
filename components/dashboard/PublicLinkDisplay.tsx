'use client'

import { useEffect, useState } from 'react'

interface PublicLinkDisplayProps {
  slug: string | null
}

export function PublicLinkDisplay({ slug }: PublicLinkDisplayProps) {
  const [displayUrl, setDisplayUrl] = useState('')

  useEffect(() => {
    if (slug) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const cleanUrl = appUrl.replace(/^https?:\/\//, '')
      setDisplayUrl(`${cleanUrl}/g/${slug}`)
    }
  }, [slug])

  if (!slug) {
    return <span>Configura tu perfil para obtener tu enlace</span>
  }

  if (!displayUrl) {
    return <span>Cargando...</span>
  }

  return <span>{displayUrl}</span>
}
