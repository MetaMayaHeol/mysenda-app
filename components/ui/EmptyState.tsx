import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="bg-green-500 hover:bg-green-600 text-white font-bold">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}
