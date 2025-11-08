import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ role: string }> }
) {
  const { role } = await params
  const roleLower = role.toLowerCase()
  return NextResponse.redirect(new URL(`/dashboard/${roleLower}`, request.url))
}