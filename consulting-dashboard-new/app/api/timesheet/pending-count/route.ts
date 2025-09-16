import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import { getPendingApprovals } from '@/actions/timesheet-approval'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user || !['pm', 'executive'].includes(user.role.name)) {
      return NextResponse.json({ count: 0 })
    }

    const result = await getPendingApprovals()
    
    if (!result.success || !result.data) {
      return NextResponse.json({ count: 0 })
    }

    return NextResponse.json({ count: result.data.length })
  } catch (error) {
    console.error('Failed to get pending count:', error)
    return NextResponse.json({ count: 0 })
  }
}