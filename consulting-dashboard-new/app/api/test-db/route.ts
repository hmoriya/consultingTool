import { NextResponse } from 'next/server'
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { db } from '@/lib/db'
import path from 'path'

export async function GET() {
  try {
    // Create a fresh instance with explicit database path
    const projectDbPath = path.resolve(process.cwd(), 'prisma/project-service/data/project.db')
    console.log('Creating project DB with path:', projectDbPath)
    
    const freshProjectDb = new ProjectPrismaClient({
      datasources: {
        db: {
          url: `file:${projectDbPath}`
        }
      },
      log: ['query', 'error', 'warn']
    })
    
    // Test regular db
    const mainDbTest = await db.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' LIMIT 5`
    console.log('Main DB tables:', mainDbTest)
    
    // Test project db with raw query
    const projectDbTest = await freshProjectDb.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' LIMIT 5`
    console.log('Project DB tables:', projectDbTest)
    
    // Try to query projects
    let projectCount = 0
    try {
      projectCount = await freshProjectDb.project.count()
    } catch (countError) {
      console.error('Count error:', countError)
    }
    
    await freshProjectDb.$disconnect()
    
    return NextResponse.json({
      mainDb: mainDbTest,
      projectDb: projectDbTest,
      projectCount,
      projectDbPath
    })
  } catch (_error) {
    console.error('DB Test Error:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}