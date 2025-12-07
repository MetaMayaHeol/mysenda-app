'use server'

import { indexAllServices } from '@/lib/ai/indexer'

export async function triggerIndexing() {
  try {
    const result = await indexAllServices()
    return result
  } catch (error: any) {
    return { error: error.message || 'Unknown error' }
  }
}
