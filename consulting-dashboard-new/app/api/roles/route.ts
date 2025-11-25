import { NextResponse } from 'next/server'
import { authDb } from '@/lib/prisma-vercel'
import { getCurrentUser } from '@/actions/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const roles = await authDb.role.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(roles)
  } catch (_error) {
    console.error('Failed to fetch roles:', error)
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 })
  }
}