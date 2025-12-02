import { Star } from 'lucide-react'

interface RatingSummaryProps {
  rating: number
  count: number
  className?: string
}

export function RatingSummary({ rating, count, className = '' }: RatingSummaryProps) {
  if (count === 0) return null

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-yellow-400">
        <Star size={16} fill="currentColor" />
      </div>
      <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
      <span className="text-gray-500 text-sm">({count} reseñas)</span>
    </div>
  )
}
