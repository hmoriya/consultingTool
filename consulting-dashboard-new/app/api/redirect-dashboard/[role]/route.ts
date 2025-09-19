import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { role: string } }
) {
  const role = params.role.toLowerCase()
  return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
}