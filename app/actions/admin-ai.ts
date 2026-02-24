'use server'

import { indexAllServices } from '@/lib/ai/indexer'
import { requireAdmin } from '@/lib/auth/admin'

export async function triggerIndexing() {
  await requireAdmin();
  try {
    const result = await indexAllServices()
    return result
  } catch (error: any) {
    return { error: error.message || 'Unknown error' }
  }
}
