import { NextRequest, NextResponse } from 'next/server'
import { VERCEL_CONFIG, createApiResponse } from '@/lib/vercel-config'

// Vercel Function設定
export const runtime = 'nodejs'
export const maxDuration = 10
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        region: process.env.VERCEL_REGION || 'unknown',
        runtime: 'nodejs18.x'
      },
      services: {
        database: 'connected', // 実際のDB接続チェックを追加可能
        prisma: 'ready'
      },
      performance: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    }

    return NextResponse.json(
      createApiResponse(true, health),
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Vercel-Region': process.env.VERCEL_REGION || 'unknown'
        }
      }
    )
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      createApiResponse(false, null, 'Health check failed'),
      { status: 500 }
    )
  }
}