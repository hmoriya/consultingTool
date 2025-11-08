import { NextResponse } from 'next/server'
import { getClientPortalData } from '@/actions/client-portal'

export async function GET() {
  try {
    const data = await getClientPortalData()
    return NextResponse.json(data)
  } catch (_error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined 
    }, { status: 500 })
  }
}