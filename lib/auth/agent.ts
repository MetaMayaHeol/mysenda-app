import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function verifyAgentApiKey(apiKey: string) {
  if (!apiKey) return false

  // 1. Hash the provided key
  const keyHash = crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex')

  // 2. Check DB bypassing RLS (we need to check the key globally)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: keyRecord, error } = await supabaseAdmin
    .from('api_keys')
    .select('id, last_used_at')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single()

  if (error || !keyRecord) {
    return false
  }

  // 3. Update last_used_at (fire and forget, don't await blocking)
  supabaseAdmin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyRecord.id)
    .then()

  return true
}
