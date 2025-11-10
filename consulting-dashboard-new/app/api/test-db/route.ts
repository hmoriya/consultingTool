import { NextResponse } from 'next/server'
import { projectDb } from '@/lib/prisma-vercel'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Use unified Vercel-optimized project client
    console.log('Using unified project DB client from prisma-vercel')
    
    // Test regular db
    const mainDbTest = await db.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' LIMIT 5`
    console.log('Main DB tables:', mainDbTest)
    
    // Test project db with raw query
    const projectDbTest = await projectDb.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' LIMIT 5`
    console.log('Project DB tables:', projectDbTest)
    
    // Try to query projects
    let projectCount = 0
    try {
      projectCount = await projectDb.project.count()
    } catch (countError) {
      console.error('Count error:', countError)
    }
    
    await projectDb.$disconnect()
    
    return NextResponse.json({
      mainDb: mainDbTest,
      projectDb: projectDbTest,
      projectCount,
      source: 'unified-prisma-vercel'
    })
  } catch (_error) {
    console.error('DB Test Error:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}