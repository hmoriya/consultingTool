import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

interface DuplicationAnalysisResult {
  usecaseDuplications: {
    total: number
    groups: DuplicationGroup[]
  }
  pageDuplications: {
    total: number
    consolidationPotential: number
  }
}

interface DuplicationGroup {
  name: string
  duplicateCount: number
  services: string[]
  mergeStrategy: string
  impactLevel: 'low' | 'medium' | 'high'
  usecases: UseCaseInfo[]
}

interface UseCaseInfo {
  id: string
  name: string
  displayName: string
  serviceId: string
  operationId: string
  filePath?: string
}

interface PageInfo {
  id: string
  name: string
  displayName: string
  useCaseId: string
  serviceId: string
  operationId: string
}

// ユースケース重複分析
class UseCaseDuplicationAnalyzer {
  private usecases: UseCaseInfo[] = []

  async loadUseCases() {
    // Get all business operations with their use cases
    const operations = await parasolDb.businessOperation.findMany({
      include: {
        useCases: true,
        service: true
      }
    })

    this.usecases = operations.flatMap(operation =>
      (operation.useCases || []).map(usecase => ({
        id: usecase.id,
        name: usecase.name,
        displayName: usecase.displayName,
        serviceId: operation.serviceId,
        operationId: operation.id,
        filePath: undefined // Will be populated if needed
      }))
    )
  }

  analyzeDuplications(): DuplicationGroup[] {
    const groups = new Map<string, UseCaseInfo[]>()

    // Group by display name
    for (const usecase of this.usecases) {
      const key = usecase.displayName.toLowerCase().trim()
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(usecase)
    }

    // Filter groups with duplicates and create analysis
    const duplicateGroups: DuplicationGroup[] = []

    for (const [displayName, usecases] of groups.entries()) {
      if (usecases.length > 1) {
        const services = [...new Set(usecases.map(uc => uc.serviceId))]

        duplicateGroups.push({
          name: displayName,
          duplicateCount: usecases.length,
          services,
          mergeStrategy: this.determineMergeStrategy(displayName, usecases),
          impactLevel: this.calculateImpactLevel(usecases.length, services.length),
          usecases
        })
      }
    }

    // Sort by impact level and duplicate count
    return duplicateGroups.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 }
      if (impactOrder[a.impactLevel] !== impactOrder[b.impactLevel]) {
        return impactOrder[b.impactLevel] - impactOrder[a.impactLevel]
      }
      return b.duplicateCount - a.duplicateCount
    })
  }

  private determineMergeStrategy(displayName: string, usecases: UseCaseInfo[]): string {
    const lowerName = displayName.toLowerCase()

    // Analyze common patterns
    if (lowerName.includes('成果物') && lowerName.includes('提出')) {
      return 'basic-function-integration'
    }
    if (lowerName.includes('一覧') || lowerName.includes('検索')) {
      return 'parameterized-sharing'
    }
    if (lowerName.includes('承認')) {
      return 'workflow-template'
    }
    if (lowerName.includes('登録') || lowerName.includes('作成')) {
      return 'crud-template'
    }

    // Check if across different services
    const services = [...new Set(usecases.map(uc => uc.serviceId))]
    if (services.length > 1) {
      return 'cross-service-integration'
    }

    return 'pattern-consolidation'
  }

  private calculateImpactLevel(duplicateCount: number, serviceCount: number): 'low' | 'medium' | 'high' {
    if (serviceCount > 3 || duplicateCount > 6) {
      return 'high'
    }
    if (serviceCount > 1 || duplicateCount > 3) {
      return 'medium'
    }
    return 'low'
  }

  getTotalUseCases(): number {
    return this.usecases.length
  }
}

// ページ重複分析
class PageDuplicationAnalyzer {
  private pages: PageInfo[] = []

  async loadPages() {
    // Get all page definitions
    const pages = await parasolDb.pageDefinition.findMany({
      include: {
        useCase: {
          include: {
            operation: {
              include: {
                service: true
              }
            }
          }
        }
      }
    })

    this.pages = pages
      .filter(page => page.useCase) // useCaseがnullでないもののみを処理
      .map(page => ({
        id: page.id,
        name: page.name,
        displayName: page.displayName,
        useCaseId: page.useCaseId!,
        serviceId: page.useCase!.operation.serviceId,
        operationId: page.useCase!.operationId
      }))
  }

  analyzeDuplications(): { total: number; consolidationPotential: number } {
    const groups = new Map<string, PageInfo[]>()

    // Group by display name
    for (const page of this.pages) {
      const key = page.displayName.toLowerCase().trim()
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(page)
    }

    // Count duplicates
    let totalDuplicates = 0
    let consolidationPotential = 0

    for (const [_, pages] of groups.entries()) {
      if (pages.length > 1) {
        totalDuplicates += pages.length
        // Potential for consolidation (keep 1, remove others)
        consolidationPotential += pages.length - 1
      }
    }

    return {
      total: totalDuplicates,
      consolidationPotential
    }
  }

  getTotalPages(): number {
    return this.pages.length
  }
}

export async function GET(_request: Request) {
  try {
    console.log('重複分析API開始')

    // Initialize analyzers
    const usecaseAnalyzer = new UseCaseDuplicationAnalyzer()
    const pageAnalyzer = new PageDuplicationAnalyzer()

    // Load data
    await Promise.all([
      usecaseAnalyzer.loadUseCases(),
      pageAnalyzer.loadPages()
    ])

    // Perform analysis
    const usecaseGroups = usecaseAnalyzer.analyzeDuplications()
    const pageAnalysis = pageAnalyzer.analyzeDuplications()

    const result: DuplicationAnalysisResult = {
      usecaseDuplications: {
        total: usecaseAnalyzer.getTotalUseCases(),
        groups: usecaseGroups
      },
      pageDuplications: {
        total: pageAnalyzer.getTotalPages(),
        consolidationPotential: pageAnalysis.consolidationPotential
      }
    }

    console.log('重複分析完了:', {
      usecaseGroups: usecaseGroups.length,
      pageConsolidationPotential: pageAnalysis.consolidationPotential
    })

    return NextResponse.json(result)

  } catch (_error) {
    console.error('重複分析エラー:', error)
    return NextResponse.json({
      error: 'Duplication analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}