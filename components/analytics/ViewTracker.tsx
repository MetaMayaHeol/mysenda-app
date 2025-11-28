'use client'

import { useEffect, useRef } from 'react'
import { trackView } from '@/lib/actions/analytics'

interface ViewTrackerProps {
  type: 'profile' | 'service'
  guideId: string
  resourceId?: string
}

export function ViewTracker({ type, guideId, resourceId }: ViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return

    // Track view after a small delay to ensure it's a real visit
    const timer = setTimeout(() => {
      trackView(type, guideId, resourceId)
        .catch(err => console.error('Failed to track view:', err))
      tracked.current = true
    }, 2000) // 2 seconds delay to count as a view

    return () => clearTimeout(timer)
  }, [type, guideId, resourceId])

  return null // Invisible component
}
