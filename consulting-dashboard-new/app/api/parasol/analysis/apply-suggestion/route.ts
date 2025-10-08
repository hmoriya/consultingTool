import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

interface ApplySuggestionRequest {
  type: 'usecase' | 'page'
  suggestionId: string
  action: 'merge' | 'consolidate' | 'template'
  targetName: string
  duplicateIds: string[]
  mergeStrategy: string
  dryRun?: boolean
}

interface ApplySuggestionResult {
  success: boolean
  appliedChanges: {
    merged: number
    updated: number
    created: number
    deleted: number
  }
  consolidatedItems: Array<{
    id: string
    name: string
    action: 'kept' | 'merged' | 'updated' | 'deleted'
  }>
  errors: string[]
}

// ユースケース統合処理
class UseCaseConsolidator {
  async consolidateUseCases(
    targetName: string,
    duplicateIds: string[],
    mergeStrategy: string,
    dryRun: boolean = false
  ): Promise<ApplySuggestionResult> {
    const result: ApplySuggestionResult = {
      success: true,
      appliedChanges: { merged: 0, updated: 0, created: 0, deleted: 0 },
      consolidatedItems: [],
      errors: []
    }

    try {
      // Get the duplicate use cases
      const duplicateUseCases = await parasolDb.useCase.findMany({
        where: { id: { in: duplicateIds } },
        include: {
          operation: {
            include: { service: true }
          },
          pageDefinitions: true,
          testDefinitions: true
        }
      })

      if (duplicateUseCases.length === 0) {
        result.errors.push('No duplicate use cases found')
        result.success = false
        return result
      }

      // Select canonical use case (most comprehensive one)
      const canonicalUseCase = this.selectCanonicalUseCase(duplicateUseCases, mergeStrategy)
      const toMerge = duplicateUseCases.filter(uc => uc.id !== canonicalUseCase.id)

      if (dryRun) {
        // Simulate the changes
        result.consolidatedItems.push({
          id: canonicalUseCase.id,
          name: canonicalUseCase.displayName,
          action: 'kept'
        })

        for (const usecase of toMerge) {
          result.consolidatedItems.push({
            id: usecase.id,
            name: usecase.displayName,
            action: 'merged'
          })
        }

        result.appliedChanges.merged = toMerge.length
        result.appliedChanges.updated = 1 // canonical usecase will be updated

        return result
      }

      // Apply actual consolidation
      await parasolDb.$transaction(async (tx) => {
        // Update canonical use case with consolidated content
        const consolidatedDefinition = this.mergeUseCaseDefinitions(
          canonicalUseCase,
          toMerge,
          mergeStrategy
        )

        await tx.useCase.update({
          where: { id: canonicalUseCase.id },
          data: {
            displayName: targetName,
            definition: consolidatedDefinition,
            description: `統合されたユースケース: ${mergeStrategy}`
          }
        })

        result.appliedChanges.updated = 1
        result.consolidatedItems.push({
          id: canonicalUseCase.id,
          name: targetName,
          action: 'updated'
        })

        // Merge page definitions
        for (const usecase of toMerge) {
          // Move pages to canonical use case
          await tx.pageDefinition.updateMany({
            where: { useCaseId: usecase.id },
            data: { useCaseId: canonicalUseCase.id }
          })

          // Move test definitions
          await tx.testDefinition.updateMany({
            where: { useCaseId: usecase.id },
            data: { useCaseId: canonicalUseCase.id }
          })

          result.consolidatedItems.push({
            id: usecase.id,
            name: usecase.displayName,
            action: 'merged'
          })
        }

        result.appliedChanges.merged = toMerge.length

        // Delete duplicate use cases
        await tx.useCase.deleteMany({
          where: { id: { in: toMerge.map(uc => uc.id) } }
        })

        result.appliedChanges.deleted = toMerge.length
      })

    } catch (error) {
      result.success = false
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }

    return result
  }

  private selectCanonicalUseCase(useCases: any[], strategy: string): any {
    switch (strategy) {
      case 'basic-function-integration':
      case 'workflow-template':
        // Select the one with most comprehensive definition
        return useCases.reduce((canonical, current) =>
          (current.definition?.length || 0) > (canonical.definition?.length || 0)
            ? current : canonical
        )

      case 'parameterized-sharing':
        // Select the one with most page definitions
        return useCases.reduce((canonical, current) =>
          current.pageDefinitions.length > canonical.pageDefinitions.length
            ? current : canonical
        )

      default:
        // Default: select first one
        return useCases[0]
    }
  }

  private mergeUseCaseDefinitions(canonical: any, duplicates: any[], strategy: string): string {
    let baseDefinition = canonical.definition || ''

    // Add content from duplicates based on strategy
    switch (strategy) {
      case 'basic-function-integration':
        // Merge basic flows and add alternative flows
        for (const dup of duplicates) {
          if (dup.definition) {
            baseDefinition += `\n\n## 統合された代替フロー (from ${dup.displayName})\n${dup.definition}`
          }
        }
        break

      case 'workflow-template':
        // Create parameterized workflow
        baseDefinition += `\n\n## パラメータ化された共通ワークフロー\n`
        baseDefinition += `このユースケースは以下のバリエーションに対応:\n`
        for (const dup of duplicates) {
          baseDefinition += `- ${dup.displayName}\n`
        }
        break

      default:
        // Simple concatenation
        for (const dup of duplicates) {
          if (dup.definition) {
            baseDefinition += `\n\n---\n統合内容 from ${dup.displayName}:\n${dup.definition}`
          }
        }
    }

    return baseDefinition
  }
}

// ページ統合処理
class PageConsolidator {
  async consolidatePages(
    targetName: string,
    duplicateIds: string[],
    mergeStrategy: string,
    dryRun: boolean = false
  ): Promise<ApplySuggestionResult> {
    const result: ApplySuggestionResult = {
      success: true,
      appliedChanges: { merged: 0, updated: 0, created: 0, deleted: 0 },
      consolidatedItems: [],
      errors: []
    }

    try {
      // Get the duplicate pages
      const duplicatePages = await parasolDb.pageDefinition.findMany({
        where: { id: { in: duplicateIds } },
        include: {
          useCase: {
            include: {
              operation: {
                include: { service: true }
              }
            }
          }
        }
      })

      if (duplicatePages.length === 0) {
        result.errors.push('No duplicate pages found')
        result.success = false
        return result
      }

      // Select canonical page
      const canonicalPage = duplicatePages.reduce((canonical, current) =>
        (current.content?.length || 0) > (canonical.content?.length || 0)
          ? current : canonical
      )
      const toMerge = duplicatePages.filter(page => page.id !== canonicalPage.id)

      if (dryRun) {
        result.consolidatedItems.push({
          id: canonicalPage.id,
          name: canonicalPage.displayName,
          action: 'kept'
        })

        for (const page of toMerge) {
          result.consolidatedItems.push({
            id: page.id,
            name: page.displayName,
            action: 'merged'
          })
        }

        result.appliedChanges.merged = toMerge.length
        result.appliedChanges.updated = 1

        return result
      }

      // Apply actual consolidation
      await parasolDb.$transaction(async (tx) => {
        // Update canonical page with consolidated content
        const consolidatedContent = this.mergePageContent(canonicalPage, toMerge, mergeStrategy)

        await tx.pageDefinition.update({
          where: { id: canonicalPage.id },
          data: {
            displayName: targetName,
            content: consolidatedContent,
            description: `統合されたページ: ${mergeStrategy}`
          }
        })

        result.appliedChanges.updated = 1
        result.consolidatedItems.push({
          id: canonicalPage.id,
          name: targetName,
          action: 'updated'
        })

        // Mark other pages for deletion tracking
        for (const page of toMerge) {
          result.consolidatedItems.push({
            id: page.id,
            name: page.displayName,
            action: 'merged'
          })
        }

        result.appliedChanges.merged = toMerge.length

        // Delete duplicate pages
        await tx.pageDefinition.deleteMany({
          where: { id: { in: toMerge.map(p => p.id) } }
        })

        result.appliedChanges.deleted = toMerge.length
      })

    } catch (error) {
      result.success = false
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }

    return result
  }

  private mergePageContent(canonical: any, duplicates: any[], strategy: string): string {
    let baseContent = canonical.content || `# ${canonical.displayName}\n\n## 統合されたページ定義\n`

    // Add sections from duplicates
    for (const dup of duplicates) {
      if (dup.content) {
        baseContent += `\n\n## 統合されたセクション (from ${dup.displayName})\n${dup.content}`
      }
    }

    // Add consolidation notes
    baseContent += `\n\n## 統合情報\n- 統合戦略: ${strategy}\n- 統合日: ${new Date().toISOString()}\n`
    baseContent += `- 統合されたページ: ${duplicates.map(d => d.displayName).join(', ')}\n`

    return baseContent
  }
}

export async function POST(request: Request) {
  try {
    const body: ApplySuggestionRequest = await request.json()
    const {
      type,
      suggestionId,
      action,
      targetName,
      duplicateIds,
      mergeStrategy,
      dryRun = false
    } = body

    console.log('統合提案適用開始:', {
      type,
      action,
      targetName,
      duplicateCount: duplicateIds.length,
      dryRun
    })

    let result: ApplySuggestionResult

    if (type === 'usecase') {
      const consolidator = new UseCaseConsolidator()
      result = await consolidator.consolidateUseCases(targetName, duplicateIds, mergeStrategy, dryRun)
    } else if (type === 'page') {
      const consolidator = new PageConsolidator()
      result = await consolidator.consolidatePages(targetName, duplicateIds, mergeStrategy, dryRun)
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid type specified',
        details: 'Type must be either "usecase" or "page"'
      }, { status: 400 })
    }

    console.log('統合提案適用完了:', {
      success: result.success,
      changes: result.appliedChanges,
      errors: result.errors.length
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('統合提案適用エラー:', error)
    return NextResponse.json({
      success: false,
      error: 'Apply suggestion failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}