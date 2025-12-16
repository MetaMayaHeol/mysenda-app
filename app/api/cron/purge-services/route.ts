import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint is protected by a secret key and intended to be called by:
// 1. Vercel Cron Jobs (configured in vercel.json)
// 2. External cron services (e.g., cron-job.org)
// 3. Manual admin triggers

const PURGE_SECRET = process.env.CRON_SECRET || process.env.PURGE_SECRET

export async function GET(request: Request) {
  // Verify authorization
  const authHeader = request.headers.get('authorization')
  
  if (!PURGE_SECRET) {
    console.error('CRON_SECRET or PURGE_SECRET not configured')
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${PURGE_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Create Supabase client with service role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Database configuration missing' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Get threshold from query params (default 30 days)
    const { searchParams } = new URL(request.url)
    const daysThreshold = parseInt(searchParams.get('days') || '30', 10)

    // Option 1: Use the SQL function (if migration was run)
    const { data, error } = await supabase.rpc('purge_old_deleted_services', {
      days_threshold: daysThreshold
    })

    if (error) {
      // Fallback: Direct SQL if function doesn't exist
      if (error.code === '42883') { // function does not exist
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysThreshold)

        const { data: deleted, error: deleteError } = await supabase
          .from('services')
          .delete()
          .not('deleted_at', 'is', null)
          .lt('deleted_at', cutoffDate.toISOString())
          .select('id')

        if (deleteError) {
          throw deleteError
        }

        return NextResponse.json({
          success: true,
          message: `Purged ${deleted?.length || 0} services older than ${daysThreshold} days`,
          purged_count: deleted?.length || 0,
          purged_ids: deleted?.map(s => s.id) || [],
          method: 'direct_delete'
        })
      }
      throw error
    }

    const result = data?.[0] || { purged_count: 0, purged_ids: [] }

    return NextResponse.json({
      success: true,
      message: `Purged ${result.purged_count} services older than ${daysThreshold} days`,
      purged_count: result.purged_count,
      purged_ids: result.purged_ids,
      method: 'sql_function'
    })

  } catch (error) {
    console.error('Purge error:', error)
    return NextResponse.json(
      { error: 'Failed to purge services', details: String(error) },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: Request) {
  return GET(request)
}
