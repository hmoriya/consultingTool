import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import fs from 'fs/promises'
import path from 'path'
import type { 
  PageImport, 
  DuplicationResolutionResult, 
  ImportResult,
  PageClassifier,
  PageLayerClassification 
} from '@/app/types/parasol-api'

const parasolDb = new ParasolPrismaClient()

interface ImportRequest {
  migrationMode?: boolean
  conflictResolution?: 'merge' | 'overwrite' | 'skip'
  layerValidation?: boolean
  dryRun?: boolean
}

interface LayerClassification {
  layer1: string[]
  layer2: string[]
  layer3: string[]
}

interface MigrationSummary {
  globalSharedPages: number
  operationSharedPages: number
  usecaseDedicatedPages: number
  migratedPages: number
  conflictResolved: number
  errors: string[]
}

// 3層分離のページ分類ロジック
class Layer3PageClassifier {
  classifyPage(filePath: string, content: string): 'global' | 'operation' | 'usecase' {
    // Layer 1: global-shared-pages/ 配下
    if (filePath.includes('global-shared-pages/')) {
      return 'global'
    }

    // Layer 2: shared-pages/ 配下
    if (filePath.includes('/shared-pages/')) {
      return 'operation'
    }

    // Layer 3: dedicated-pages/ 配下
    if (filePath.includes('/dedicated-pages/')) {
      return 'usecase'
    }

    // 旧構造: pages/ 配下 → コンテンツ分析
    if (filePath.includes('/pages/')) {
      return this.analyzeLegacyPage(content)
    }

    // デフォルト: Layer 3
    return 'usecase'
  }

  private analyzeLegacyPage(content: string): 'global' | 'operation' | 'usecase' {
    // コンテンツ分析による分類
    const indicators = {
      global: ['ログイン', 'ダッシュボード', '通知', 'エラー'],
      operation: ['一覧', '検索', 'ワークフロー', '成果物提出', '請求書', 'コスト記録'],
      usecase: ['ウィザード', '詳細設定', '専用', '固有']
    }

    const lowerContent = content.toLowerCase()

    // Global indicators
    if (indicators.global.some(term => content.includes(term))) {
      return 'global'
    }

    // Operation indicators
    if (indicators.operation.some(term => content.includes(term))) {
      return 'operation'
    }

    // Default: usecase
    return 'usecase'
  }
}

// 重複解決ロジック
class DuplicationResolver {
  async resolveDuplication(pages: PageImport[], conflictResolution: string = 'merge') {
    const duplicateGroups = new Map<string, PageImport[]>()

    // グループ化
    for (const page of pages) {
      const key = page.displayName || page.name
      if (!duplicateGroups.has(key)) {
        duplicateGroups.set(key, [])
      }
      duplicateGroups.get(key)!.push(page)
    }

    const plan = {
      merge: [] as PageImport[],
      layer1Candidates: [] as PageImport[],
      layer2Candidates: [] as PageImport[],
      conflicts: [] as PageImport[][]
    }

    for (const [name, group] of duplicateGroups.entries()) {
      if (group.length === 1) {
        plan.merge.push(group[0])
        continue
      }

      // 重複がある場合の処理
      if (this.isGlobalCandidate(group)) {
        plan.layer1Candidates.push(this.selectCanonical(group, conflictResolution))
      } else if (this.isOperationCandidate(group)) {
        plan.layer2Candidates.push(this.selectCanonical(group, conflictResolution))
      } else {
        plan.conflicts.push(group)
      }
    }

    return plan
  }

  private isGlobalCandidate(pages: PageImport[]): boolean {
    // 全サービスで共通利用される可能性のあるページ
    const globalKeywords = ['ログイン', 'ダッシュボード', '通知', 'エラー']
    return pages.some(page =>
      globalKeywords.some(keyword =>
        (page.displayName || page.name).includes(keyword)
      )
    )
  }

  private isOperationCandidate(pages: PageImport[]): boolean {
    // 複数オペレーションで共有される可能性のあるページ
    const operationKeywords = ['一覧', '検索', '成果物提出', '請求書', 'コスト']
    return pages.some(page =>
      operationKeywords.some(keyword =>
        (page.displayName || page.name).includes(keyword)
      )
    )
  }

  private selectCanonical(pages: PageImport[], resolution: string): PageImport {
    switch (resolution) {
      case 'merge':
        // 最も包括的なコンテンツを持つページを選択
        return pages.reduce((canonical, current) =>
          (current.content?.length || 0) > (canonical.content?.length || 0) ? current : canonical
        )
      case 'overwrite':
        // 最新のページを選択
        return pages.reduce((latest, current) =>
          new Date(current.updatedAt || current.createdAt) > new Date(latest.updatedAt || latest.createdAt)
            ? current : latest
        )
      case 'skip':
        // 最初のページを選択
        return pages[0]
      default:
        return pages[0]
    }
  }
}

// MDファイルをスキャンして3層分離構造に分類
async function scan3LayerStructure(basePath: string) {
  const servicesPath = path.join(basePath, 'docs', 'parasol', 'services')
  const classifier = new Layer3PageClassifier()
  const pages = []

  try {
    // global-shared-pages をスキャン
    const globalPagesPath = path.join(servicesPath, 'global-shared-pages')
    try {
      const globalFiles = await fs.readdir(globalPagesPath)
      for (const file of globalFiles.filter(f => f.endsWith('.md'))) {
        const filePath = path.join(globalPagesPath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        pages.push({
          filePath,
          content: content.replace(/\x1b\[[0-9;]*m/g, ''), // ANSI除去
          layer: 'global' as const,
          displayName: extractDisplayName(content) || file.replace('.md', ''),
          name: file.replace('.md', '')
        })
      }
    } catch (error) {
      // global-shared-pages が存在しない場合はスキップ
    }

    // 各サービスの shared-pages と dedicated-pages をスキャン
    const serviceDirs = await fs.readdir(servicesPath)
    for (const serviceDir of serviceDirs.filter(d => d !== 'global-shared-pages')) {
      await scanServicePages(path.join(servicesPath, serviceDir), serviceDir, classifier, pages)
    }
  } catch (error) {
    console.error('MDファイルスキャンエラー:', error)
    throw error
  }

  return pages
}

async function scanServicePages(servicePath: string, serviceId: string, classifier: Layer3PageClassifier, pages: PageImport[]) {
  try {
    const capabilitiesPath = path.join(servicePath, 'capabilities')
    const capabilityDirs = await fs.readdir(capabilitiesPath)

    for (const capabilityDir of capabilityDirs) {
      const operationsPath = path.join(capabilitiesPath, capabilityDir, 'operations')
      const operationDirs = await fs.readdir(operationsPath)

      for (const operationDir of operationDirs) {
        const operationPath = path.join(operationsPath, operationDir)

        // shared-pages をスキャン
        await scanPagesDirectory(
          path.join(operationPath, 'shared-pages'),
          'operation',
          serviceId,
          operationDir,
          pages
        )

        // usecases/{usecase}/dedicated-pages をスキャン
        const usecasesPath = path.join(operationPath, 'usecases')
        try {
          const usecaseDirs = await fs.readdir(usecasesPath)
          for (const usecaseDir of usecaseDirs) {
            await scanPagesDirectory(
              path.join(usecasesPath, usecaseDir, 'dedicated-pages'),
              'usecase',
              serviceId,
              operationDir,
              pages,
              usecaseDir
            )
          }
        } catch {
          // usecases が存在しない場合はスキップ
        }
      }
    }
  } catch (error) {
    console.error(`サービス ${serviceId} のスキャンエラー:`, error)
  }
}

async function scanPagesDirectory(
  pagesPath: string,
  layer: 'global' | 'operation' | 'usecase',
  serviceId: string,
  operationId: string,
  pages: PageImport[],
  usecaseId?: string
) {
  try {
    const pageFiles = await fs.readdir(pagesPath)
    for (const file of pageFiles.filter(f => f.endsWith('.md'))) {
      const filePath = path.join(pagesPath, file)
      const content = await fs.readFile(filePath, 'utf-8')
      pages.push({
        filePath,
        content: content.replace(/\x1b\[[0-9;]*m/g, ''), // ANSI除去
        layer,
        displayName: extractDisplayName(content) || file.replace('.md', ''),
        name: file.replace('.md', ''),
        serviceId,
        operationId,
        usecaseId
      })
    }
  } catch (error) {
    // ディレクトリが存在しない場合はスキップ
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

export async function POST(request: Request) {
  try {
    const body: ImportRequest = await request.json()
    const {
      migrationMode = true,
      conflictResolution = 'merge',
      layerValidation = true,
      dryRun = false
    } = body

    console.log('3層分離インポート開始:', { migrationMode, conflictResolution, layerValidation, dryRun })

    // 1. MDファイルスキャン
    const basePath = process.cwd()
    const pages = await scan3LayerStructure(basePath)

    console.log(`スキャン完了: ${pages.length}ページを発見`)

    // 2. 重複解決
    const resolver = new DuplicationResolver()
    const resolutionPlan = await resolver.resolveDuplication(pages, conflictResolution)

    console.log('重複解決計画:', {
      merge: resolutionPlan.merge.length,
      layer1: resolutionPlan.layer1Candidates.length,
      layer2: resolutionPlan.layer2Candidates.length,
      conflicts: resolutionPlan.conflicts.length
    })

    if (dryRun) {
      return NextResponse.json({
        success: true,
        preview: {
          scannedPages: pages.length,
          resolutionPlan: {
            merge: resolutionPlan.merge.length,
            layer1Candidates: resolutionPlan.layer1Candidates.length,
            layer2Candidates: resolutionPlan.layer2Candidates.length,
            conflicts: resolutionPlan.conflicts.length
          }
        },
        estimatedChanges: resolutionPlan.merge.length + resolutionPlan.layer1Candidates.length + resolutionPlan.layer2Candidates.length
      })
    }

    // 3. データベース更新
    const migrationSummary: MigrationSummary = {
      globalSharedPages: 0,
      operationSharedPages: 0,
      usecaseDedicatedPages: 0,
      migratedPages: 0,
      conflictResolved: 0,
      errors: []
    }

    const layerClassification: LayerClassification = {
      layer1: [],
      layer2: [],
      layer3: []
    }

    // Layer 1 (global) ページの処理
    for (const page of resolutionPlan.layer1Candidates) {
      try {
        await parasolDb.pageLayerDefinition.create({
          data: {
            pageName: page.name,
            layerType: 'global',
            filePath: page.filePath,
            content: page.content,
            displayName: page.displayName
          }
        })
        migrationSummary.globalSharedPages++
        layerClassification.layer1.push(page.displayName)
      } catch (error) {
        migrationSummary.errors.push(`Layer 1 ページ作成エラー: ${page.displayName} - ${error}`)
      }
    }

    // Layer 2 (operation) ページの処理
    for (const page of resolutionPlan.layer2Candidates) {
      try {
        await parasolDb.pageLayerDefinition.create({
          data: {
            pageName: page.name,
            layerType: 'operation',
            sharedScope: page.operationId,
            parentOperationId: page.operationId,
            filePath: page.filePath,
            content: page.content,
            displayName: page.displayName
          }
        })
        migrationSummary.operationSharedPages++
        layerClassification.layer2.push(page.displayName)
      } catch (error) {
        migrationSummary.errors.push(`Layer 2 ページ作成エラー: ${page.displayName} - ${error}`)
      }
    }

    // Layer 3 (usecase) ページの処理
    for (const page of resolutionPlan.merge.filter(p => p.layer === 'usecase')) {
      try {
        await parasolDb.pageLayerDefinition.create({
          data: {
            pageName: page.name,
            layerType: 'usecase',
            sharedScope: page.usecaseId,
            parentUseCaseId: page.usecaseId,
            filePath: page.filePath,
            content: page.content,
            displayName: page.displayName
          }
        })
        migrationSummary.usecaseDedicatedPages++
        layerClassification.layer3.push(page.displayName)
      } catch (error) {
        migrationSummary.errors.push(`Layer 3 ページ作成エラー: ${page.displayName} - ${error}`)
      }
    }

    migrationSummary.migratedPages = migrationSummary.globalSharedPages +
                                   migrationSummary.operationSharedPages +
                                   migrationSummary.usecaseDedicatedPages

    migrationSummary.conflictResolved = resolutionPlan.conflicts.length

    console.log('3層分離インポート完了:', migrationSummary)

    return NextResponse.json({
      success: true,
      migrationSummary,
      layerClassification
    })

  } catch (error) {
    console.error('3層分離インポートエラー:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知のエラー',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}