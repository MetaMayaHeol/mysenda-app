'use client'

import { useState } from 'react'
import { ReviewWithGuide } from '@/app/actions/admin-reviews'
import { approveReview, rejectReview } from '@/app/actions/admin-reviews'
import { Button } from '@/components/ui/button'

type ReviewCardProps = {
  review: ReviewWithGuide
  onUpdate?: () => void
}

export function ReviewCard({ review, onUpdate }: ReviewCardProps) {
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    const result = await approveReview(review.id)
    setLoading(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      onUpdate?.()
    }
  }

  const handleReject = async () => {
    if (!confirm('¿Estás seguro de que quieres rechazar esta reseña? Se eliminará permanentemente.')) {
      return
    }
    
    setLoading(true)
    const result = await rejectReview(review.id)
    setLoading(false)
    
    if (result.error) {
      alert(result.error)
    } else {
      onUpdate?.()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header - Guide Info */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">
            {review.guide?.name || review.guide?.email || 'Guía desconocido'}
          </h4>
          <p className="text-xs text-gray-500">{review.guide?.email}</p>
        </div>
        {review.approved ? (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            ✓ Aprobada
          </span>
        ) : (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
            ⏳ Pendiente
          </span>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {review.reviewer_name}
          </span>
          <span className="text-lg">{renderStars(review.rating)}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {review.comment}
        </p>
      </div>

      {/* Footer - Date & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {formatDate(review.created_at)}
        </span>
        
        {!review.approved && (
          <div className="flex gap-2">
            <Button
              onClick={handleReject}
              disabled={loading}
              variant="outline"
              className="h-8 px-3 text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
            >
              {loading ? '...' : '✕ Rechazar'}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="h-8 px-3 text-xs bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? '...' : '✓ Aprobar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
