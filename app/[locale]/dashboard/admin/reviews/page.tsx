import { isAdmin } from '@/lib/auth/admin'
import { getPendingReviews, getAllReviews } from '@/app/actions/admin-reviews'
import { redirect } from 'next/navigation'
import { ReviewsClient } from './ReviewsClient'
import Link from 'next/link'

export default async function AdminReviewsPage() {
  // Check if user is admin
  const adminCheck = await isAdmin()
  
  if (!adminCheck) {
    redirect('/dashboard')
  }

  // Fetch reviews
  const [pendingReviews, allReviews] = await Promise.all([
    getPendingReviews(),
    getAllReviews()
  ])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900 text-xl"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              🛡️ Panel de administración
            </h1>
            <p className="text-sm text-gray-600">
              Moderación de reseñas
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <ReviewsClient 
          initialPendingReviews={pendingReviews}
          initialAllReviews={allReviews}
        />
      </div>
    </div>
  )
}
