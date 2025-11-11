import { NextResponse } from 'next/server'
import { parasolDb } from '@/lib/prisma-vercel'
import fs from 'fs/promises'
import path from 'path'

interface SharedUseCaseImportRequest {
  operationId?: string
  serviceId?: string
  sourcePattern?: string
  validationLevel?: 'strict' | 'normal' | 'minimal'
  dryRun?: boolean
}

interface UseCaseInfo {
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
  pages: unknown[]
}

// Layer 1 (オペレーション共有ユースケース) 専用インポート
export async function POST(request: Request) {
  try {
    const body: SharedUseCaseImportRequest = await request.json()
    const {
      operationId,
      serviceId,
      sourcePattern = '**/shared-usecases/**/*.md',
      validationLevel = 'normal',
      dryRun = false
    } = body

    console.log('共有ユースケースインポート開始:', {
      operationId, serviceId, sourcePattern, validationLevel, dryRun
    })

    // 1. shared-usecases ディレクトリスキャン
    const basePath = process.cwd()
    const servicesPath = path.join(basePath, 'docs', 'parasol', 'services')

    const useCases: UseCaseInfo[] = []
    const scanErrors: { serviceId: string; operationId: string; error: string }[] = []

    try {
      const serviceDirs = await fs.readdir(servicesPath)

      for (const currentServiceDir of serviceDirs.filter(d => d !== 'global-shared-pages')) {
        // 特定サービスが指定されている場合はフィルタリング
        if (serviceId && currentServiceDir !== serviceId) {
          continue
        }

        await scanServiceSharedUseCases(
          path.join(servicesPath, currentServiceDir),
          currentServiceDir,
          operationId,
          useCases,
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

    console.log(`共有ユースケース発見: ${useCases.length}個`)

    // 2. 共有性分析と重複検出
    const sharingAnalysis = analyzeUseCaseSharing(useCases)

    // 3. バリデーション
    const validationResults = []
    const validUseCases = []

    for (const useCase of useCases) {
      const validation = validateSharedUseCase(useCase, validationLevel)
      if (validation.isValid) {
        validUseCases.push(useCase)
      }
      validationResults.push({
        useCase: useCase.name,
        displayName: useCase.displayName,
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings
      })
    }

    // 4. オペレーション横断影響分析
    const impactAnalysis = await analyzeOperationImpact(validUseCases, operationId)

    if (dryRun) {
      return NextResponse.json({
        success: true,
        preview: {
          scannedUseCases: useCases.length,
          validUseCases: validUseCases.length,
          sharedCandidates: sharingAnalysis.sharedCandidates.length,
          consolidationOpportunities: sharingAnalysis.consolidationCandidates.length,
          impactAnalysis
        },
        sharingAnalysis,
        validationResults: validationResults.filter(v => !v.isValid),
        scanErrors
      })
    }

    // 5. データベース更新
    const processed = []
    const errors = []

    for (const useCase of validUseCases) {
      try {
        // 既存の重複チェック
        const existing = await parasolDb.useCaseLayerDefinition.findFirst({
          where: {
            useCaseName: useCase.name,
            layerType: 'shared',
            sharedScope: 'operation'
          }
        })

        const useCaseData = {
          useCaseName: useCase.name,
          layerType: 'shared' as const,
          sharedScope: 'operation', // オペレーション共有
          parentOperationId: useCase.operationId,
          filePath: useCase.filePath,
          content: useCase.content,
          displayName: useCase.displayName
        }

        if (existing) {
          // 更新
          await parasolDb.useCaseLayerDefinition.update({
            where: { id: existing.id },
            data: useCaseData
          })
          processed.push({ ...useCase, action: 'updated' })
        } else {
          // 新規作成
          await parasolDb.useCaseLayerDefinition.create({
            data: useCaseData
          })
          processed.push({ ...useCase, action: 'created' })
        }
      } catch (_error) {
        errors.push({
          useCase: useCase.name,
          error: error instanceof Error ? error.message : '未知のエラー'
        })
      }
    }

    console.log('共有ユースケースインポート完了:', {
      processed: processed.length,
      errors: errors.length
    })

    return NextResponse.json({
      success: true,
      result: {
        layerType: 'shared',
        processedUseCases: processed.length,
        createdUseCases: processed.filter(p => p.action === 'created').length,
        updatedUseCases: processed.filter(p => p.action === 'updated').length,
        errors: errors.length
      },
      sharingAnalysis,
      impactAnalysis,
      processed: processed.map(p => ({
        name: p.name,
        displayName: p.displayName,
        operationId: p.operationId,
        serviceId: p.serviceId,
        action: p.action
      })),
      errors,
      scanErrors
    })

  } catch (_error) {
    console.error('共有ユースケースインポートエラー:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知のエラー',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

async function scanServiceSharedUseCases(
  servicePath: string,
  serviceId: string,
  targetOperationId: string | undefined,
  useCases: UseCaseInfo[],
  scanErrors: { serviceId: string; operationId: string; error: string }[]
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

          const sharedUseCasesPath = path.join(operationsPath, operationDir, 'shared-usecases')

          try {
            const useCaseDirs = await fs.readdir(sharedUseCasesPath)

            for (const useCaseDir of useCaseDirs) {
              const useCaseFile = path.join(sharedUseCasesPath, useCaseDir, 'usecase.md')
              const content = await fs.readFile(useCaseFile, 'utf-8')
              const cleanContent = content.replace(/\x1b\[[0-9;]*m/g, '')

              // ページも取得
              const pages = await scanUseCasePages(path.join(sharedUseCasesPath, useCaseDir, 'pages'))

              useCases.push({
                fileName: `${useCaseDir}.md`,
                filePath: useCaseFile,
                content: cleanContent,
                displayName: extractDisplayName(cleanContent) || useCaseDir,
                name: useCaseDir,
                serviceId,
                capabilityId: capabilityDir,
                operationId: operationDir,
                useCaseId: useCaseDir,
                layerType: 'shared',
                pages
              })
            }
          } catch (_error) {
            // shared-usecases ディレクトリが存在しない場合はスキップ
            scanErrors.push({
              serviceId,
              operationId: operationDir,
              error: `shared-usecases ディレクトリが見つかりません: ${error}`
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

async function scanUseCasePages(pagesPath: string) {
  const pages = []
  try {
    const pageFiles = await fs.readdir(pagesPath)
    for (const file of pageFiles.filter(f => f.endsWith('.md'))) {
      const filePath = path.join(pagesPath, file)
      const content = await fs.readFile(filePath, 'utf-8')
      pages.push({
        fileName: file,
        filePath,
        content: content.replace(/\x1b\[[0-9;]*m/g, ''),
        displayName: extractDisplayName(content) || file.replace('.md', ''),
        name: file.replace('.md', '')
      })
    }
  } catch {
    // ページディレクトリが存在しない場合はスキップ
  }
  return pages
}

function analyzeUseCaseSharing(useCases: UseCaseInfo[]) {
  const duplicateMap = new Map<string, UseCaseInfo[]>()

  // displayName でグループ化
  for (const useCase of useCases) {
    const key = useCase.displayName
    if (!duplicateMap.has(key)) {
      duplicateMap.set(key, [])
    }
    duplicateMap.get(key)!.push(useCase)
  }

  const sharedCandidates = []
  const consolidationCandidates = []

  for (const [displayName, group] of duplicateMap.entries()) {
    if (group.length > 1) {
      sharedCandidates.push({
        displayName,
        count: group.length,
        useCases: group.map(uc => ({
          name: uc.name,
          serviceId: uc.serviceId,
          operationId: uc.operationId,
          filePath: uc.filePath
        }))
      })

      // 統合候補を提案
      consolidationCandidates.push({
        displayName,
        consolidationType: detectConsolidationType(displayName),
        recommendedAction: 'merge-to-shared',
        useCases: group
      })
    }
  }

  return {
    totalUseCases: useCases.length,
    uniqueUseCases: duplicateMap.size,
    sharedCandidates,
    consolidationCandidates,
    sharingReduction: useCases.length - duplicateMap.size
  }
}

function detectConsolidationType(displayName: string): string {
  if (displayName.includes('成果物を提出')) return 'deliverable-submission'
  if (displayName.includes('メンバーを検索') || displayName.includes('メンバー選択')) return 'member-selection'
  if (displayName.includes('承認を得る') || displayName.includes('承認')) return 'approval-workflow'
  if (displayName.includes('進捗を報告') || displayName.includes('進捗')) return 'progress-reporting'
  if (displayName.includes('一覧を表示') || displayName.includes('検索')) return 'list-search'
  return 'general-shared'
}

function validateSharedUseCase(useCase: unknown, level: string) {
  const errors = []
  const warnings = []

  // 基本検証
  if (!useCase.content.trim()) {
    errors.push('ユースケース内容が空です')
  }

  if (!useCase.displayName) {
    errors.push('ユースケースタイトル（# 見出し）が見つかりません')
  }

  // 共有ユースケース固有の検証
  const sharedKeywords = [
    '成果物を提出', 'メンバーを検索', '承認を得る', '進捗を報告',
    '一覧を表示', '検索する', 'ワークフロー', '共通'
  ]

  const hasSharedKeywords = sharedKeywords.some(keyword =>
    useCase.content.includes(keyword) || useCase.displayName.includes(keyword)
  )

  if (level === 'strict' && !hasSharedKeywords) {
    errors.push('共有ユースケースには複数オペレーションで共有される機能を示すキーワードが必要です')
  }

  // 専用性チェック（個別ユースケース的なキーワード）
  const specificKeywords = ['ウィザード', '専用', '固有', '特別', 'カスタム']
  const hasSpecificKeywords = specificKeywords.some(keyword =>
    useCase.content.includes(keyword) || useCase.displayName.includes(keyword)
  )

  if (hasSpecificKeywords) {
    warnings.push('特定用途向けのキーワードが含まれています。個別ユースケースへの移動を検討してください')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

async function analyzeOperationImpact(useCases: unknown[], targetOperationId?: string) {
  try {
    if (targetOperationId) {
      // 特定オペレーション内の影響分析
      const operationUseCases = useCases.filter(uc => uc.operationId === targetOperationId)
      const relatedOperations = await parasolDb.businessOperation.count({
        where: {
          name: { contains: targetOperationId }
        }
      })

      return {
        impactScope: 'operation',
        targetOperation: targetOperationId,
        affectedUseCases: operationUseCases.length,
        relatedOperations,
        impactLevel: operationUseCases.length > 5 ? 'high' : 'medium',
        recommendations: [
          `オペレーション "${targetOperationId}" 内での共有性を分析してください`,
          '関連するオペレーションへの影響を確認してください'
        ]
      }
    } else {
      // 全オペレーションへの影響分析
      const operationGroups = new Map<string, number>()

      for (const useCase of useCases) {
        const key = `${useCase.serviceId}-${useCase.operationId}`
        operationGroups.set(key, (operationGroups.get(key) || 0) + 1)
      }

      return {
        impactScope: 'multi-operation',
        affectedOperations: operationGroups.size,
        totalUseCases: useCases.length,
        impactLevel: operationGroups.size > 10 ? 'high' : 'medium',
        operationBreakdown: Array.from(operationGroups.entries()).map(([key, count]) => {
          const [serviceId, operationId] = key.split('-')
          return { serviceId, operationId, useCaseCount: count }
        }),
        recommendations: [
          '複数オペレーションにまたがる共有ユースケースがあります',
          '段階的な統合を検討してください',
          '重複ユースケースの優先順位付けを行ってください'
        ]
      }
    }
  } catch (_error) {
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

  // ユースケース定義プレフィックスを除去
  if (title.includes('ユースケース：') || title.includes('ユースケース:')) {
    title = title.replace(/ユースケース[：:]/, '').trim()
  }

  return title
}