'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import crypto from 'crypto'

const reviewSchema = z.object({
  guideId: z.string().uuid(),
  reviewerName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres').max(500, 'El comentario es muy largo'),
})

async function getReviewerIdentifier(guideId: string): Promise<string> {
  const headersList = await headers()
  
  // Get IP from various possible headers (Vercel, Cloudflare, etc.)
  const forwarded = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const cfIp = headersList.get('cf-connecting-ip')
  
  const ip = cfIp || forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Hash IP for privacy (GDPR compliance)
  const ipHash = crypto
    .createHash('sha256')
    .update(ip + process.env.NEXT_PUBLIC_SUPABASE_URL) // Add salt
    .digest('hex')
    .substring(0, 16)
  
  return `${ipHash}_${guideId}`
}

export async function submitReview(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    guideId: formData.get('guideId'),
    reviewerName: formData.get('reviewerName'),
    rating: Number(formData.get('rating')),
    comment: formData.get('comment'),
  }

  const validatedFields = reviewSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { guideId, reviewerName, rating, comment } = validatedFields.data

  // IP-based rate limiting with 24h window
  const reviewerIdentifier = await getReviewerIdentifier(guideId)
  
  // Calculate 24 hours ago
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  // Check if this IP already reviewed this guide in the last 24 hours
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id, created_at')
    .eq('guide_id', guideId)
    .eq('reviewer_identifier', reviewerIdentifier)
    .gte('created_at', twentyFourHoursAgo)
    .single()

  if (existingReview) {
    return { error: 'Ya has dejado una reseña para este guía recientemente. Espera 24 horas antes de enviar otra.' }
  }

  const { error } = await supabase
    .from('reviews')
    .insert({
      guide_id: guideId,
      reviewer_name: reviewerName,
      rating,
      comment,
      reviewer_identifier: reviewerIdentifier,
      approved: false // Requires admin approval
    })

  if (error) {
    console.error('Error submitting review:', error)
    return { error: 'Error al guardar la reseña. Inténtalo de nuevo.' }
  }

  // Note: Review won't appear until admin approves it
  return { success: true, needsApproval: true }
}

export async function getReviews(guideId: string) {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('guide_id', guideId)
    .eq('approved', true) // Only show approved reviews
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return reviews
}
