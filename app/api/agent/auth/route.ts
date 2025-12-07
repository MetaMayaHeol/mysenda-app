import { NextRequest, NextResponse } from 'next/server'
import { verifyAgentApiKey } from '@/lib/auth/agent'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  
  // Format: "Bearer <api_key>"
  const apiKey = authHeader?.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 401 })
  }

  const isValid = await verifyAgentApiKey(apiKey)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid API Key' }, { status: 403 })
  }

  return NextResponse.json({ 
    status: 'ok', 
    message: 'Agent authenticated successfully',
    timestamp: new Date().toISOString()
  })
}
