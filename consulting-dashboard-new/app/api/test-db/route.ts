import { NextResponse } from 'next/server'
import { authDb, projectDb } from '@/lib/prisma-vercel'

export async function GET() {
  try {
    // Use unified Vercel-optimized project client
    console.log('Using unified project DB client from prisma-vercel')
    
    // Test auth db
    const authDbTest = await authDb.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' LIMIT 5`
    console.log('Auth DB tables:', authDbTest)
    
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
  } catch (error) {
    console.error('DB Test Error:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}