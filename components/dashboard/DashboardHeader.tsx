'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  showBackButton?: boolean
  backUrl?: string
}

export function DashboardHeader({ 
  title, 
  showBackButton = true,
  backUrl = '/dashboard'
}: DashboardHeaderProps) {
  const router = useRouter()

  return (
    <div className="bg-white border-b border-gray-200 p-5 flex items-center gap-3 sticky top-0 z-10">
      {showBackButton && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.push(backUrl)}
        >
          <ChevronLeft size={24} />
        </Button>
      )}
      <h1 className="text-xl font-bold flex-1">{title}</h1>
    </div>
  )
}
