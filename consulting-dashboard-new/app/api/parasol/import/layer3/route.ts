import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import fs from 'fs/promises'
import path from 'path'

const parasolDb = new ParasolPrismaClient()

interface Layer3ImportRequest {
  useCaseId?: string
  operationId?: string
  serviceId?: string
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
  useCaseId: string
  layerType: string
}

// Layer 3 (ユースケース専用) 専用インポート
export async function POST(request: Request) {
  try {
    const body: Layer3ImportRequest = await request.json()
    const {
      useCaseId,
      operationId,
      serviceId,
      sourcePattern = '**/usecases/**/dedicated-pages/**/*.md',
      validationLevel = 'minimal',
      dryRun = false
    } = body

    console.log('Layer 3 インポート開始:', {
      useCaseId, operationId, serviceId, sourcePattern, validationLevel, dryRun
    })

    // 1. dedicated-pages ディレクトリスキャン
    const basePath = process.cwd()
    const servicesPath = path.join(basePath, 'docs', 'parasol', 'services')

    const pages: PageInfo[] = []
    const scanErrors: { serviceId: string; operationId: string; error: string }[] = []

    try {
      const serviceDirs = await fs.readdir(servicesPath)

      for (const currentServiceDir of serviceDirs.filter(d => d !== 'global-shared-pages')) {
        // 特定サービスが指定されている場合はフィルタリング
        if (serviceId && currentServiceDir !== serviceId) {
          continue
        }

        await scanServiceDedicatedPages(
          path.join(servicesPath, currentServiceDir),
          currentServiceDir,
          operationId,
          useCaseId,
          pages,
          scanErrors
        )
      }
    } catch (_error) {
      return NextResponse.json({
        success: false,
        error: 'サービスディレクトリのスキャンに失敗しました',
        details: error instanceof Error ? error.message : '未知のエラー'
      }, { status: 500 })
    }

    console.log(`Layer 3 ページ発見: ${pages.length}個`)

    // 2. 高速バリデーション（Layer 3は影響範囲が限定的なため最小限）
    const validationResults = []
    const validPages = []

    for (const page of pages) {
      const validation = validateLayer3Page(page, validationLevel)
      if (validation.isValid) {
        validPages.push(page)
      } else if (validationLevel !== 'minimal') {
        validationResults.push({
          page: page.name,
          displayName: page.displayName,
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings
        })
      }
    }

    // 3. 独立性分析（Layer 3の特徴）
    const independenceAnalysis = analyzePageIndependence(validPages)

    if (dryRun) {
      return NextResponse.json({
        success: true,
        preview: {
          scannedPages: pages.length,
          validPages: validPages.length,
          independentPages: independenceAnalysis.independentPages,
          processingTime: 'fast',
          independenceAnalysis
        },
        validationResults: validationResults.filter(v => !v.isValid),
        scanErrors,
        performance: {
          expectedProcessingTime: `${Math.ceil(validPages.length / 10)}秒（推定）`,
          parallelProcessing: true,
          rollbackSupport: true
        }
      })
    }

    // 4. 高速データベース更新（並列処理対応）
    const processed = []
    const errors = []

    // Layer 3は独立性が高いため並列処理可能
    const batchSize = 10
    const batches = []
    for (let i = 0; i < validPages.length; i += batchSize) {
      batches.push(validPages.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (page) => {
        try {
          // 既存の重複チェック
          const existing = await parasolDb.pageLayerDefinition.findFirst({
            where: {
              pageName: page.name,
              layerType: 'usecase',
              sharedScope: page.useCaseId
            }
          })

          const pageData = {
            pageName: page.name,
            layerType: 'usecase' as const,
            sharedScope: page.useCaseId,
            parentUseCaseId: page.useCaseId,
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
            return { ...page, action: 'updated' }
          } else {
            // 新規作成
            await parasolDb.pageLayerDefinition.create({
              data: pageData
            })
            return { ...page, action: 'created' }
          }
        } catch (_error) {
          throw {
            page: page.name,
            error: error instanceof Error ? error.message : '未知のエラー'
          }
        }
      })

      try {
        const batchResults = await Promise.all(batchPromises)
        processed.push(...batchResults)
      } catch (_error) {
        errors.push(error)
      }
    }

    console.log('Layer 3 インポート完了:', {
      processed: processed.length,
      errors: errors.length,
      batches: batches.length
    })

    return NextResponse.json({
      success: true,
      result: {
        layerType: 'usecase',
        processedPages: processed.length,
        createdPages: processed.filter(p => p.action === 'created').length,
        updatedPages: processed.filter(p => p.action === 'updated').length,
        errors: errors.length,
        processingMode: 'parallel'
      },
      independenceAnalysis,
      processed: processed.map(p => ({
        name: p.name,
        displayName: p.displayName,
        useCaseId: p.useCaseId,
        operationId: p.operationId,
        serviceId: p.serviceId,
        action: p.action
      })),
      errors,
      scanErrors,
      performance: {
        batchCount: batches.length,
        batchSize,
        parallelProcessing: true
      }
    })

  } catch (_error) {
    console.error('Layer 3 インポートエラー:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知のエラー',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

async function scanServiceDedicatedPages(
  servicePath: string,
  serviceId: string,
  targetOperationId: string | undefined,
  targetUseCaseId: string | undefined,
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

          const usecasesPath = path.join(operationsPath, operationDir, 'usecases')

          try {
            const usecaseDirs = await fs.readdir(usecasesPath)

            for (const usecaseDir of usecaseDirs) {
              // 特定のユースケースが指定されている場合はフィルタリング
              if (targetUseCaseId && usecaseDir !== targetUseCaseId) {
                continue
              }

              const dedicatedPagesPath = path.join(usecasesPath, usecaseDir, 'dedicated-pages')

              try {
                const pageFiles = await fs.readdir(dedicatedPagesPath)

                for (const file of pageFiles.filter(f => f.endsWith('.md'))) {
                  const filePath = path.join(dedicatedPagesPath, file)
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
                    useCaseId: usecaseDir,
                    layerType: 'usecase'
                  })
                }
              } catch (_error) {
                // dedicated-pages ディレクトリが存在しない場合はスキップ
                scanErrors.push({
                  serviceId,
                  operationId: operationDir,
                  useCaseId: usecaseDir,
                  error: `dedicated-pages ディレクトリが見つかりません: ${error}`
                })
              }
            }
          } catch (_error) {
            // usecases ディレクトリが存在しない場合はスキップ
            scanErrors.push({
              serviceId,
              operationId: operationDir,
              error: `usecases ディレクトリが見つかりません: ${error}`
            })
          }
        }
      } catch (_error) {
        scanErrors.push({
          serviceId,
          capabilityId: capabilityDir,
          error: `オペレーションディレクトリのスキャンエラー: ${error}`
        })
      }
    }
  } catch (_error) {
    scanErrors.push({
      serviceId,
      error: `サービススキャンエラー: ${error}`
    })
  }
}

function validateLayer3Page(page: unknown, level: string) {
  const errors = []
  const warnings = []

  // 基本検証（Layer 3は最小限）
  if (!page.content.trim()) {
    errors.push('ページ内容が空です')
  }

  // Layer 3は独立性が高く、厳密なバリデーションは不要
  if (level === 'minimal') {
    return { isValid: errors.length === 0, errors, warnings }
  }

  if (!page.displayName) {
    errors.push('ページタイトル（# 見出し）が見つかりません')
  }

  // Layer 3 推奨キーワード（専用性）
  const dedicatedKeywords = [
    'ウィザード', '専用', '詳細設定', '固有', '特別',
    'カスタム', '個別', '特殊', 'アドバンス'
  ]

  const hasDedicatedKeywords = dedicatedKeywords.some(keyword =>
    page.content.includes(keyword) || page.displayName.includes(keyword)
  )

  if (level === 'strict' && !hasDedicatedKeywords) {
    warnings.push('Layer 3 ページには専用機能を示すキーワードがあることを推奨します')
  }

  // 共通性チェック（Layer 1, 2的なキーワード）
  const commonKeywords = ['全サービス', '共通', '一覧', '汎用']
  const hasCommonKeywords = commonKeywords.some(keyword =>
    page.content.includes(keyword) || page.displayName.includes(keyword)
  )

  if (hasCommonKeywords) {
    warnings.push('共通機能を示すキーワードが含まれています。Layer 1, 2 への移動を検討してください')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function analyzePageIndependence(pages: PageInfo[]) {
  const useCaseGroups = new Map<string, PageInfo[]>()
  const operationGroups = new Map<string, PageInfo[]>()

  // ユースケース別グループ化
  for (const page of pages) {
    const useCaseKey = `${page.serviceId}-${page.operationId}-${page.useCaseId}`
    if (!useCaseGroups.has(useCaseKey)) {
      useCaseGroups.set(useCaseKey, [])
    }
    useCaseGroups.get(useCaseKey)!.push(page)

    // オペレーション別グループ化
    const operationKey = `${page.serviceId}-${page.operationId}`
    if (!operationGroups.has(operationKey)) {
      operationGroups.set(operationKey, [])
    }
    operationGroups.get(operationKey)!.push(page)
  }

  // 独立性分析
  const independentPages = []
  const potentialConflicts = []

  for (const [useCaseKey, useCasePages] of useCaseGroups.entries()) {
    const [serviceId, operationId, useCaseId] = useCaseKey.split('-')

    // 単一ユースケース内のページは独立性が高い
    if (useCasePages.length <= 5) {
      independentPages.push(...useCasePages.map(p => ({
        ...p,
        independenceLevel: 'high',
        conflictRisk: 'low'
      })))
    } else {
      // ページ数が多い場合は潜在的な競合リスク
      potentialConflicts.push({
        useCaseKey,
        serviceId,
        operationId,
        useCaseId,
        pageCount: useCasePages.length,
        risk: 'moderate'
      })
    }
  }

  return {
    totalPages: pages.length,
    useCaseCount: useCaseGroups.size,
    operationCount: operationGroups.size,
    independentPages: independentPages.length,
    potentialConflicts: potentialConflicts.length,
    independenceRatio: (independentPages.length / pages.length * 100).toFixed(1),
    processingRecommendation: independentPages.length > pages.length * 0.8 ? 'parallel' : 'sequential',
    useCaseBreakdown: Array.from(useCaseGroups.entries()).map(([key, pages]) => {
      const [serviceId, operationId, useCaseId] = key.split('-')
      return {
        serviceId,
        operationId,
        useCaseId,
        pageCount: pages.length,
        independenceLevel: pages.length <= 5 ? 'high' : 'moderate'
      }
    })
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