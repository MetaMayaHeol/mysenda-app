'use server'

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import crypto from 'crypto'

// Initialize Supabase Admin client for writing analytics (bypassing RLS if needed, though we have policies)
// We use service role key to ensure we can write even if user is anon
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Tracks a page view for a guide profile or service
 * Uses a hash of IP + User Agent + Date to prevent duplicate counts per day
 */
export async function trackView(
  pageType: 'profile' | 'service',
  guideId: string,
  resourceId?: string
) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    // Create a hash for deduplication (privacy friendly, no raw IP stored)
    const viewerHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}-${today}-${pageType}-${resourceId || guideId}`)
      .digest('hex')

    // Check if view already exists for this hash
    const { data: existingView } = await supabaseAdmin
      .from('analytics')
      .select('id')
      .eq('viewer_hash', viewerHash)
      .single()

    if (existingView) {
      // Already viewed today, don't count
      return { success: true, skipped: true }
    }

    // Record new view
    const { error } = await supabaseAdmin.from('analytics').insert({
      user_id: guideId,
      page_type: pageType,
      resource_id: resourceId || null,
      viewer_hash: viewerHash,
    })

    if (error) {
      console.error('Error tracking view:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in trackView:', error)
    return { success: false, error: 'Internal error' }
  }
}

/**
 * Fetches analytics data for a guide
 */
export async function getAnalyticsData(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get date 30 days ago
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: analytics, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return analytics || []
}
