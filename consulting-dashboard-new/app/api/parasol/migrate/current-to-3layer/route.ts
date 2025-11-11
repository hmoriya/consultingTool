import { NextResponse } from 'next/server'
import { parasolDb as _parasolDb } from '@/lib/prisma-vercel'
import fs from 'fs/promises'
import path from 'path'

interface MigrationRequest {
  sourceDirectory?: string
  targetDirectory?: string
  backupOriginal?: boolean
  validationLevel?: 'strict' | 'normal' | 'minimal'
  dryRun?: boolean
}

interface MigrationPlan {
  analysis: {
    totalPages: number
    duplicatePages: number
    layer1Candidates: number
    layer2Candidates: number
    layer3Pages: number
    conflictsToResolve: number
  }
  migration: {
    phase1: { description: string; pages: number; risk: string }
    phase2: { description: string; pages: number; risk: string }
    phase3: { description: string; pages: number; risk: string }
  }
  backupPlan: {
    enabled: boolean
    backupPath?: string
    rollbackInstructions: string[]
  }
  timeline: {
    estimatedDuration: string
    phases: Array<{ phase: string; duration: string; dependencies: string[] }>
  }
}

// 移行処理の中核クラス
class Current3LayerMigrator {
  private sourceDir: string
  private targetDir: string
  private backupEnabled: boolean

  constructor(sourceDir: string, targetDir: string, backupEnabled: boolean) {
    this.sourceDir = sourceDir
    this.targetDir = targetDir
    this.backupEnabled = backupEnabled
  }

  async analyzeMigrationScope() {
    const currentPages = await this.scanCurrentStructure()
    const duplicateAnalysis = this.analyzeDuplicates(currentPages)
    const layerClassification = this.classifyPagesForMigration(currentPages)

    return {
      currentPages,
      duplicateAnalysis,
      layerClassification,
      migrationComplexity: this.calculateMigrationComplexity(layerClassification, duplicateAnalysis)
    }
  }

  async scanCurrentStructure() {
    const servicesPath = path.join(this.sourceDir, 'docs', 'parasol', 'services')
    const pages = []

    try {
      const serviceDirs = await fs.readdir(servicesPath)

      for (const serviceDir of serviceDirs) {
        if (serviceDir === 'global-shared-pages') continue // 既に3層対応済み

        const servicePath = path.join(servicesPath, serviceDir)
        await this.scanServiceStructure(servicePath, serviceDir, pages)
      }
    } catch (_error) {
      throw new Error(`現在の構造のスキャンに失敗: ${error}`)
    }

    return pages
  }

  async scanServiceStructure(servicePath: string, serviceId: string, pages: unknown[]) {
    try {
      const capabilitiesPath = path.join(servicePath, 'capabilities')
      const capabilityDirs = await fs.readdir(capabilitiesPath)

      for (const capabilityDir of capabilityDirs) {
        const operationsPath = path.join(capabilitiesPath, capabilityDir, 'operations')
        const operationDirs = await fs.readdir(operationsPath)

        for (const operationDir of operationDirs) {
          const operationPath = path.join(operationsPath, operationDir)

          // 現在の pages/ 配下をスキャン
          const pagesPath = path.join(operationPath, 'pages')
          await this.scanPagesDirectory(pagesPath, serviceId, operationDir, pages, 'current')

          // usecases/{usecase}/ 配下もスキャン（既存の dedicated-pages があれば）
          const usecasesPath = path.join(operationPath, 'usecases')
          try {
            const usecaseDirs = await fs.readdir(usecasesPath)
            for (const usecaseDir of usecaseDirs) {
              const usecasePagePath = path.join(usecasesPath, usecaseDir, 'pages')
              await this.scanPagesDirectory(usecasePagePath, serviceId, operationDir, pages, 'usecase-current', usecaseDir)
            }
          } catch {
            // usecases が存在しない場合はスキップ
          }
        }
      }
    } catch (_error) {
      console.error(`サービス ${serviceId} のスキャンエラー:`, error)
    }
  }

  async scanPagesDirectory(pagesPath: string, serviceId: string, operationId: string, pages: unknown[], sourceType: string, usecaseId?: string) {
    try {
      const pageFiles = await fs.readdir(pagesPath)
      for (const file of pageFiles.filter(f => f.endsWith('.md'))) {
        const filePath = path.join(pagesPath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const cleanContent = content.replace(/\x1b\[[0-9;]*m/g, '')

        pages.push({
          fileName: file,
          filePath,
          content: cleanContent,
          displayName: this.extractDisplayName(cleanContent) || file.replace('.md', ''),
          name: file.replace('.md', ''),
          serviceId,
          operationId,
          usecaseId,
          sourceType,
          currentLocation: sourceType === 'current' ? 'pages' : 'usecases/pages'
        })
      }
    } catch {
      // ディレクトリが存在しない場合はスキップ
    }
  }

  analyzeDuplicates(pages: unknown[]) {
    const duplicateMap = new Map<string, unknown[]>()

    for (const page of pages) {
      const key = page.displayName
      if (!duplicateMap.has(key)) {
        duplicateMap.set(key, [])
      }
      duplicateMap.get(key)!.push(page)
    }

    const duplicates = Array.from(duplicateMap.entries())
      .filter(([_, group]) => group.length > 1)
      .map(([displayName, group]) => ({
        displayName,
        count: group.length,
        pages: group,
        migrationStrategy: this.determineDuplicateMigrationStrategy(displayName, group)
      }))

    return {
      totalPages: pages.length,
      uniquePages: duplicateMap.size,
      duplicates,
      reductionPotential: pages.length - duplicateMap.size
    }
  }

  classifyPagesForMigration(pages: unknown[]) {
    const layer1 = []
    const layer2 = []
    const layer3 = []

    for (const page of pages) {
      const classification = this.classifySinglePage(page)

      switch (classification.recommendedLayer) {
        case 'global':
          layer1.push({ ...page, ...classification })
          break
        case 'operation':
          layer2.push({ ...page, ...classification })
          break
        case 'usecase':
          layer3.push({ ...page, ...classification })
          break
      }
    }

    return { layer1, layer2, layer3 }
  }

  classifySinglePage(page: unknown) {
    const content = page.content.toLowerCase()
    const displayName = page.displayName.toLowerCase()

    // Layer 1 (global) indicators
    const globalKeywords = ['ログイン', 'ダッシュボード', '通知', 'エラー']
    if (globalKeywords.some(kw => content.includes(kw) || displayName.includes(kw))) {
      return {
        recommendedLayer: 'global',
        confidence: 0.9,
        reasons: ['全サービス共通機能を検出']
      }
    }

    // Layer 2 (operation) indicators
    const operationKeywords = ['成果物提出', '一覧', '検索', '請求書', 'コスト記録', '承認']
    if (operationKeywords.some(kw => content.includes(kw) || displayName.includes(kw))) {
      return {
        recommendedLayer: 'operation',
        confidence: 0.8,
        reasons: ['複数ユースケース共有機能を検出']
      }
    }

    // Layer 3 (usecase) - default for most pages
    const dedicatedKeywords = ['ウィザード', '専用', '詳細設定', '固有']
    const hasDedicatedKeywords = dedicatedKeywords.some(kw => content.includes(kw) || displayName.includes(kw))

    return {
      recommendedLayer: 'usecase',
      confidence: hasDedicatedKeywords ? 0.9 : 0.6,
      reasons: hasDedicatedKeywords ? ['専用機能キーワードを検出'] : ['デフォルト分類']
    }
  }

  determineDuplicateMigrationStrategy(displayName: string, _pages: unknown[]) {
    // 成果物提出画面の場合 -> Layer 2 に統合
    if (displayName.includes('成果物提出')) {
      return {
        strategy: 'consolidate-to-layer2',
        targetLayer: 'operation',
        action: 'merge',
        reasoning: '複数オペレーションで共有される機能'
      }
    }

    // ログイン系の場合 -> Layer 1 に統合
    if (displayName.includes('ログイン')) {
      return {
        strategy: 'consolidate-to-layer1',
        targetLayer: 'global',
        action: 'merge',
        reasoning: '全サービス共通の認証機能'
      }
    }

    // その他の重複 -> Layer 2 に統合を検討
    return {
      strategy: 'consolidate-to-layer2',
      targetLayer: 'operation',
      action: 'review-and-merge',
      reasoning: '重複パターンから共有可能性が高い'
    }
  }

  calculateMigrationComplexity(layerClassification: unknown, duplicateAnalysis: unknown) {
    const { layer1, layer2, layer3 } = layerClassification
    const _totalPages = layer1.length + layer2.length + layer3.length
    const duplicateCount = duplicateAnalysis.duplicates.length

    let complexityScore = 0

    // Layer 1 の複雑度（全サービス影響）
    complexityScore += layer1.length * 3

    // Layer 2 の複雑度（複数オペレーション影響）
    complexityScore += layer2.length * 2

    // Layer 3 の複雑度（独立性が高い）
    complexityScore += layer3.length * 1

    // 重複の複雑度
    complexityScore += duplicateCount * 2

    const complexity = complexityScore < 100 ? 'low' :
                      complexityScore < 300 ? 'medium' : 'high'

    return {
      score: complexityScore,
      level: complexity,
      riskFactors: [
        ...(layer1.length > 10 ? ['Layer 1 ページ数が多く全サービス影響が大'] : []),
        ...(duplicateCount > 50 ? ['重複ページが多く統合作業が複雑'] : []),
        ...(layer2.length > 100 ? ['Layer 2 ページ数が多く影響範囲の分析が必要'] : [])
      ],
      recommendations: this.generateMigrationRecommendations(complexity, layer1.length, layer2.length, duplicateCount)
    }
  }

  generateMigrationRecommendations(complexity: string, layer1Count: number, layer2Count: number, duplicateCount: number) {
    const recommendations = []

    if (complexity === 'high') {
      recommendations.push('段階的移行を強く推奨（フェーズ分割実施）')
      recommendations.push('各フェーズでの十分なテストと検証期間を設ける')
    }

    if (layer1Count > 5) {
      recommendations.push('Layer 1 ページは全サービスへの影響分析を事前に実施')
    }

    if (duplicateCount > 20) {
      recommendations.push('重複ページの統合は優先順位をつけて段階的に実施')
    }

    if (layer2Count > 50) {
      recommendations.push('Layer 2 ページの共有範囲を明確に定義')
    }

    return recommendations
  }

  extractDisplayName(content: string): string | null {
    const lines = content.split('\n')
    const titleLine = lines.find(line => line.startsWith('# '))
    if (!titleLine) return null

    let title = titleLine.replace('# ', '').trim()

    if (title.includes('ページ定義：') || title.includes('ページ定義:')) {
      title = title.replace(/ページ定義[：:]/, '').trim()
    }

    return title
  }
}

export async function POST(request: Request) {
  try {
    const body: MigrationRequest = await request.json()
    const {
      sourceDirectory = process.cwd(),
      targetDirectory = 'docs/parasol/services-3layer',
      backupOriginal = true,
      validationLevel = 'strict',
      dryRun = false
    } = body

    console.log('3層分離移行開始:', { sourceDirectory, targetDirectory, backupOriginal, validationLevel, dryRun })

    // 1. 移行前分析
    const migrator = new Current3LayerMigrator(sourceDirectory, targetDirectory, backupOriginal)
    const analysis = await migrator.analyzeMigrationScope()

    console.log('移行分析完了:', {
      totalPages: analysis.currentPages.length,
      duplicates: analysis.duplicateAnalysis.duplicates.length,
      complexity: analysis.migrationComplexity.level
    })

    // 2. 移行計画の生成
    const migrationPlan: MigrationPlan = {
      analysis: {
        totalPages: analysis.currentPages.length,
        duplicatePages: analysis.duplicateAnalysis.reductionPotential,
        layer1Candidates: analysis.layerClassification.layer1.length,
        layer2Candidates: analysis.layerClassification.layer2.length,
        layer3Pages: analysis.layerClassification.layer3.length,
        conflictsToResolve: analysis.duplicateAnalysis.duplicates.length
      },
      migration: {
        phase1: {
          description: 'Layer 3 ページの移行（影響範囲限定）',
          pages: analysis.layerClassification.layer3.length,
          risk: 'low'
        },
        phase2: {
          description: 'Layer 2 ページの統合（重複解決）',
          pages: analysis.layerClassification.layer2.length,
          risk: 'medium'
        },
        phase3: {
          description: 'Layer 1 ページの移行（全サービス影響）',
          pages: analysis.layerClassification.layer1.length,
          risk: 'high'
        }
      },
      backupPlan: {
        enabled: backupOriginal,
        backupPath: backupOriginal ? `${sourceDirectory}/backup-${new Date().toISOString().split('T')[0]}` : undefined,
        rollbackInstructions: [
          'バックアップディレクトリから元の構造を復元',
          'データベースの page_layer_definitions テーブルをクリア',
          '既存の page_definitions の layerId を NULL に設定'
        ]
      },
      timeline: {
        estimatedDuration: analysis.migrationComplexity.level === 'high' ? '2-3週間' :
                           analysis.migrationComplexity.level === 'medium' ? '1-2週間' : '3-5日',
        phases: [
          {
            phase: 'Phase 1: Layer 3 移行',
            duration: '1-2日',
            dependencies: ['バックアップ作成']
          },
          {
            phase: 'Phase 2: Layer 2 統合',
            duration: analysis.duplicateAnalysis.duplicates.length > 20 ? '1週間' : '2-3日',
            dependencies: ['Phase 1 完了', '重複分析完了']
          },
          {
            phase: 'Phase 3: Layer 1 移行',
            duration: '1-3日',
            dependencies: ['Phase 2 完了', '全サービス影響分析完了']
          }
        ]
      }
    }

    if (dryRun) {
      return NextResponse.json({
        success: true,
        migrationPlan,
        analysis: {
          currentStructure: {
            totalPages: analysis.currentPages.length,
            serviceCount: new Set(analysis.currentPages.map(p => p.serviceId)).size,
            operationCount: new Set(analysis.currentPages.map(p => `${p.serviceId}-${p.operationId}`)).size
          },
          duplicateAnalysis: analysis.duplicateAnalysis,
          layerClassification: {
            layer1: analysis.layerClassification.layer1.length,
            layer2: analysis.layerClassification.layer2.length,
            layer3: analysis.layerClassification.layer3.length
          },
          migrationComplexity: analysis.migrationComplexity
        },
        recommendations: analysis.migrationComplexity.recommendations
      })
    }

    // 実際の移行処理は段階的に実装
    return NextResponse.json({
      success: true,
      message: '移行処理の実装は段階的に行います',
      nextSteps: [
        'Phase 1: Layer 3 ページの移行API実装',
        'Phase 2: 重複ページの統合ロジック実装',
        'Phase 3: Layer 1, 2 の移行とバリデーション実装'
      ],
      migrationPlan,
      implementationStatus: 'analysis-complete-implementation-pending'
    })

  } catch (_error) {
    console.error('3層分離移行エラー:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知のエラー',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}