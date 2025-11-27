'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export function BackButton() {
  return (
    <button 
      onClick={() => window.history.back()} 
      className="absolute top-4 left-4 z-10"
    >
      <Button variant="secondary" size="icon" className="rounded-full shadow-md">
        <ChevronLeft size={24} />
      </Button>
    </button>
  )
}
