import { NextResponse } from 'next/server'
import { parasolDb } from '@/lib/prisma-vercel'

export async function GET() {
  try {
    console.log('Testing Parasol database connection...')

    // Simple counts
    const useCaseCount = await parasolDb.useCase.count()
    const pageCount = await parasolDb.pageDefinition.count()
    const operationCount = await parasolDb.businessOperation.count()

    console.log(`Counts: useCases=${useCaseCount}, pages=${pageCount}, operations=${operationCount}`)

    // Simple duplication check for pages
    const duplicatePages = await parasolDb.pageDefinition.groupBy({
      by: ['displayName'],
      _count: {
        displayName: true
      },
      having: {
        displayName: {
          _count: {
            gt: 1
          }
        }
      },
      orderBy: {
        _count: {
          displayName: 'desc'
        }
      },
      take: 10
    })

    console.log('Top duplicate pages:', duplicatePages)

    const result = {
      status: 'success',
      data: {
        useCaseCount,
        pageCount,
        operationCount,
        topDuplicatePages: duplicatePages.map(item => ({
          name: item.displayName,
          count: item._count.displayName
        }))
      }
    }

    return NextResponse.json(result)

  } catch (_error) {
    console.error('Parasol database test error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}