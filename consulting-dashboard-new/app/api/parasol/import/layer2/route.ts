import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import fs from 'fs/promises'
import path from 'path'

const parasolDb = new ParasolPrismaClient()

interface Layer2ImportRequest {
  operationId?: string
  sourcePattern?: string
  validationLevel?: 'strict' | 'normal' | 'minimal'
  dryRun?: boolean
}

interface PageInfo {
  fileName: string
  filePath: string
  content: string
  displayName: string
  name: string
  serviceId: string
  capabilityId: string
  operationId: string
  layerType: string
}

// Layer 2 (オペレーション内共有) 専用インポート
export async function POST(request: Request) {
  try {
    const body: Layer2ImportRequest = await request.json()
    const {
      operationId,
      sourcePattern = '**/shared-pages/**/*.md',
      validationLevel = 'normal',
      dryRun = false
    } = body

    console.log('Layer 2 インポート開始:', { operationId, sourcePattern, validationLevel, dryRun })

    // 1. shared-pages ディレクトリスキャン
    const basePath = process.cwd()
    const servicesPath = path.join(basePath, 'docs', 'parasol', 'services')

    const pages: PageInfo[] = []
    const scanErrors: { serviceId: string; operationId: string; error: string }[] = []

    // 各サービス内の shared-pages をスキャン
    try {
      const serviceDirs = await fs.readdir(servicesPath)

      for (const serviceDir of serviceDirs.filter(d => d !== 'global-shared-pages')) {
        await scanServiceSharedPages(
          path.join(servicesPath, serviceDir),
          serviceDir,
          operationId,
          pages,
          scanErrors
        )
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'サービスディレクトリのスキャンに失敗しました',
        details: error instanceof Error ? error.message : '未知のエラー'
      }, { status: 500 })
    }

    console.log(`Layer 2 ページ発見: ${pages.length}個`)

    // 2. 重複検出と統合候補の提案
    const duplicationAnalysis = analyzeDuplication(pages)

    // 3. バリデーション
    const validationResults = []
    const validPages = []

    for (const page of pages) {
      const validation = validateLayer2Page(page, validationLevel)
      if (validation.isValid) {
        validPages.push(page)
      }
      validationResults.push({
        page: page.name,
        displayName: page.displayName,
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings
      })
    }

    // 4. オペレーション内影響分析
    const impactAnalysis = await analyzeOperationImpact(validPages, operationId)

    if (dryRun) {
      return NextResponse.json({
        success: true,
        preview: {
          scannedPages: pages.length,
          validPages: validPages.length,
          duplicateGroups: duplicationAnalysis.duplicateGroups.length,
          consolidationOpportunities: duplicationAnalysis.consolidationCandidates.length,
          impactAnalysis
        },
        duplicationAnalysis,
        validationResults: validationResults.filter(v => !v.isValid),
        scanErrors
      })
    }

    // 5. データベース更新
    const processed = []
    const errors = []

    for (const page of validPages) {
      try {
        // 既存の重複チェック
        const existing = await parasolDb.pageLayerDefinition.findFirst({
          where: {
            pageName: page.name,
            layerType: 'operation',
            sharedScope: page.operationId
          }
        })

        const pageData = {
          pageName: page.name,
          layerType: 'operation' as const,
          sharedScope: page.operationId,
          parentOperationId: page.operationId,
          filePath: page.filePath,
          content: page.content,
          displayName: page.displayName
        }

        if (existing) {
          // 更新
          await parasolDb.pageLayerDefinition.update({
            where: { id: existing.id },
            data: pageData
          })
          processed.push({ ...page, action: 'updated' })
        } else {
          // 新規作成
          await parasolDb.pageLayerDefinition.create({
            data: pageData
          })
          processed.push({ ...page, action: 'created' })
        }
      } catch (error) {
        errors.push({
          page: page.name,
          error: error instanceof Error ? error.message : '未知のエラー'
        })
      }
    }

    console.log('Layer 2 インポート完了:', {
      processed: processed.length,
      errors: errors.length
    })

    return NextResponse.json({
      success: true,
      result: {
        layerType: 'operation',
        processedPages: processed.length,
        createdPages: processed.filter(p => p.action === 'created').length,
        updatedPages: processed.filter(p => p.action === 'updated').length,
        errors: errors.length
      },
      duplicationAnalysis,
      impactAnalysis,
      processed: processed.map(p => ({
        name: p.name,
        displayName: p.displayName,
        operationId: p.operationId,
        action: p.action
      })),
      errors,
      scanErrors
    })

  } catch (error) {
    console.error('Layer 2 インポートエラー:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知のエラー',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

async function scanServiceSharedPages(
  servicePath: string,
  serviceId: string,
  targetOperationId: string | undefined,
  pages: unknown[],
  scanErrors: unknown[]
) {
  try {
    const capabilitiesPath = path.join(servicePath, 'capabilities')
    const capabilityDirs = await fs.readdir(capabilitiesPath)

    for (const capabilityDir of capabilityDirs) {
      const operationsPath = path.join(capabilitiesPath, capabilityDir, 'operations')
      try {
        const operationDirs = await fs.readdir(operationsPath)

        for (const operationDir of operationDirs) {
          // 特定のオペレーションが指定されている場合はフィルタリング
          if (targetOperationId && operationDir !== targetOperationId) {
            continue
          }

          const sharedPagesPath = path.join(operationsPath, operationDir, 'shared-pages')

          try {
            const pageFiles = await fs.readdir(sharedPagesPath)

            for (const file of pageFiles.filter(f => f.endsWith('.md'))) {
              const filePath = path.join(sharedPagesPath, file)
              const content = await fs.readFile(filePath, 'utf-8')
              const cleanContent = content.replace(/\x1b\[[0-9;]*m/g, '')

              pages.push({
                fileName: file,
                filePath,
                content: cleanContent,
                displayName: extractDisplayName(cleanContent) || file.replace('.md', ''),
                name: file.replace('.md', ''),
                serviceId,
                capabilityId: capabilityDir,
                operationId: operationDir,
                layerType: 'operation'
              })
            }
          } catch (error) {
            // shared-pages ディレクトリが存在しない場合はスキップ
            scanErrors.push({
              serviceId,
              operationId: operationDir,
              error: `shared-pages ディレクトリが見つかりません: ${error}`
            })
          }
        }
      } catch (error) {
        scanErrors.push({
          serviceId,
          capabilityId: capabilityDir,
          error: `オペレーションディレクトリのスキャンエラー: ${error}`
        })
      }
    }
  } catch (error) {
    scanErrors.push({
      serviceId,
      error: `サービススキャンエラー: ${error}`
    })
  }
}

function analyzeDuplication(pages: PageInfo[]) {
  const duplicateMap = new Map<string, PageInfo[]>()

  // displayName でグループ化
  for (const page of pages) {
    const key = page.displayName
    if (!duplicateMap.has(key)) {
      duplicateMap.set(key, [])
    }
    duplicateMap.get(key)!.push(page)
  }

  const duplicateGroups = []
  const consolidationCandidates = []

  for (const [displayName, group] of duplicateMap.entries()) {
    if (group.length > 1) {
      duplicateGroups.push({
        displayName,
        count: group.length,
        pages: group.map(p => ({
          name: p.name,
          serviceId: p.serviceId,
          operationId: p.operationId,
          filePath: p.filePath
        }))
      })

      // 統合候補を提案
      consolidationCandidates.push({
        displayName,
        consolidationType: detectConsolidationType(displayName),
        recommendedAction: 'merge',
        pages: group
      })
    }
  }

  return {
    totalPages: pages.length,
    uniquePages: duplicateMap.size,
    duplicateGroups,
    consolidationCandidates,
    duplicateReduction: pages.length - duplicateMap.size
  }
}

function detectConsolidationType(displayName: string): string {
  if (displayName.includes('成果物提出')) return 'workflow-common'
  if (displayName.includes('一覧') || displayName.includes('検索')) return 'list-search-common'
  if (displayName.includes('請求書') || displayName.includes('コスト')) return 'finance-common'
  if (displayName.includes('承認')) return 'approval-common'
  return 'general'
}

function validateLayer2Page(page: unknown, level: string) {
  const errors = []
  const warnings = []

  // 基本検証
  if (!page.content.trim()) {
    errors.push('ページ内容が空です')
  }

  if (!page.displayName) {
    errors.push('ページタイトル（# 見出し）が見つかりません')
  }

  // Layer 2 固有の検証
  const operationSharedKeywords = [
    '成果物提出', '一覧', '検索', 'ワークフロー',
    '請求書', 'コスト記録', '承認', '共有'
  ]

  const hasSharedKeywords = operationSharedKeywords.some(keyword =>
    page.content.includes(keyword) || page.displayName.includes(keyword)
  )

  if (level === 'strict' && !hasSharedKeywords) {
    errors.push('Layer 2 ページには複数ユースケースで共有される機能を示すキーワードが必要です')
  }

  // 特定性チェック（Layer 3 的なキーワード）
  const specificKeywords = ['ウィザード', '専用設定', '固有の', '特別な']
  const hasSpecificKeywords = specificKeywords.some(keyword =>
    page.content.includes(keyword) || page.displayName.includes(keyword)
  )

  if (hasSpecificKeywords) {
    warnings.push('特定用途向けのキーワードが含まれています。Layer 3 への移動を検討してください')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

async function analyzeOperationImpact(pages: PageInfo[], targetOperationId?: string) {
  try {
    if (targetOperationId) {
      // 特定オペレーション内の影響分析
      const operationPages = pages.filter(p => p.operationId === targetOperationId)
      const affectedUseCases = await parasolDb.useCase.count({
        where: {
          businessOperationId: { contains: targetOperationId }
        }
      })

      return {
        impactScope: 'operation',
        targetOperation: targetOperationId,
        affectedPages: operationPages.length,
        affectedUseCases,
        impactLevel: operationPages.length > 5 ? 'high' : 'medium',
        recommendations: [
          `オペレーション "${targetOperationId}" 内での影響を分析してください`,
          '関連するユースケースへの影響を確認してください'
        ]
      }
    } else {
      // 全オペレーションへの影響分析
      const operationGroups = new Map<string, number>()

      for (const page of pages) {
        const key = `${page.serviceId}-${page.operationId}`
        operationGroups.set(key, (operationGroups.get(key) || 0) + 1)
      }

      return {
        impactScope: 'multi-operation',
        affectedOperations: operationGroups.size,
        totalPages: pages.length,
        impactLevel: operationGroups.size > 10 ? 'high' : 'medium',
        operationBreakdown: Array.from(operationGroups.entries()).map(([key, count]) => {
          const [serviceId, operationId] = key.split('-')
          return { serviceId, operationId, pageCount: count }
        }),
        recommendations: [
          '複数オペレーションに影響があります',
          '段階的な統合を検討してください',
          '重複ページの優先順位付けを行ってください'
        ]
      }
    }
  } catch (error) {
    return {
      impactScope: 'unknown',
      error: error instanceof Error ? error.message : '影響分析に失敗しました',
      recommendations: ['手動での影響分析を実施してください']
    }
  }
}

function extractDisplayName(content: string): string | null {
  const lines = content.split('\n')
  const titleLine = lines.find(line => line.startsWith('# '))
  if (!titleLine) return null

  let title = titleLine.replace('# ', '').trim()

  // ページ定義プレフィックスを除去
  if (title.includes('ページ定義：') || title.includes('ページ定義:')) {
    title = title.replace(/ページ定義[：:]/, '').trim()
  }

  return title
}