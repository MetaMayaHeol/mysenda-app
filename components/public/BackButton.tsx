'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export function BackButton() {
  return (
    <Button 
      variant="secondary" 
      size="icon" 
      className="rounded-full shadow-md absolute top-4 left-4 z-10"
      onClick={() => window.history.back()}
    >
      <ChevronLeft size={24} />
    </Button>
  )
}
