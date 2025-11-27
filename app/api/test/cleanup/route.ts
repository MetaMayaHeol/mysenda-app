import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== 'rutalink-test-admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Find all test users
  const { data: testUsers, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .ilike('email', '%@rutalink.test')

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!testUsers || testUsers.length === 0) {
    return NextResponse.json({ message: 'No test users found to delete' })
  }

  const userIds = testUsers.map(u => u.id)

  // 2. Delete related data (Cascade usually handles this, but being explicit is safer if cascade isn't set)
  // Delete services
  await supabase.from('services').delete().in('user_id', userIds)
  
  // Delete public links
  await supabase.from('public_links').delete().in('user_id', userIds)
  
  // Delete guide photos
  await supabase.from('guide_photos').delete().in('user_id', userIds)

  // 3. Delete users
  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .in('id', userIds)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ 
    message: 'Cleanup completed', 
    deleted_count: userIds.length,
    deleted_ids: userIds
  })
}
