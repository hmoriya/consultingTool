import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import fs from 'fs/promises'
import path from 'path'

const parasolDb = new ParasolPrismaClient()

interface UseCaseCentric2LayerImportRequest {
  sourceDirectory?: string
  conflictResolution?: 'merge' | 'overwrite' | 'skip'
  layerValidation?: boolean
  dryRun?: boolean
}

interface UseCaseLayerClassification {
  shared: any[]
  individual: any[]
}

interface UseCaseMigrationSummary {
  sharedUseCases: number
  individualUseCases: number
  migratedUseCases: number
  conflictResolved: number
  errors: string[]
}

// ユースケース中心2層分離のクラスファイア
class UseCaseCentric2LayerClassifier {
  classifyUseCase(filePath: string, content: string): 'shared' | 'individual' {
    // shared-usecases/ 配下
    if (filePath.includes('/shared-usecases/')) {
      return 'shared'
    }

    // individual-usecases/ 配下
    if (filePath.includes('/individual-usecases/')) {
      return 'individual'
    }

    // 旧構造: usecases/ 配下 → コンテンツ分析
    if (filePath.includes('/usecases/')) {
      return this.analyzeLegacyUseCase(content)
    }

    // デフォルト: individual
    return 'individual'
  }

  private analyzeLegacyUseCase(content: string): 'shared' | 'individual' {
    // コンテンツ分析による分類
    const sharedIndicators = [
      '成果物を提出する', 'メンバーを検索', '承認を得る', '進捗を報告',
      '一覧を表示', '検索する', 'ワークフロー', '共通', '汎用'
    ]

    const individualIndicators = [
      'ウィザード', '専用', '固有', '特別', 'カスタム', '個別', '特殊'
    ]

    const lowerContent = content.toLowerCase()

    // Shared indicators (オペレーション共有ユースケース)
    if (sharedIndicators.some(term => content.includes(term))) {
      return 'shared'
    }

    // Individual indicators (個別ユースケース)
    if (individualIndicators.some(term => content.includes(term))) {
      return 'individual'
    }

    // デフォルト: individual
    return 'individual'
  }
}

// 重複解決ロジック (ユースケース中心)
class UseCaseDuplicationResolver {
  async resolveDuplication(useCases: any[], conflictResolution: string = 'merge') {
    const duplicateGroups = new Map<string, any[]>()

    // グループ化
    for (const useCase of useCases) {
      const key = useCase.displayName || useCase.name
      if (!duplicateGroups.has(key)) {
        duplicateGroups.set(key, [])
      }
      duplicateGroups.get(key)!.push(useCase)
    }

    const plan = {
      merge: [] as any[],
      sharedCandidates: [] as any[],
      individualCandidates: [] as any[],
      conflicts: [] as any[]
    }

    for (const [name, group] of duplicateGroups.entries()) {
      if (group.length === 1) {
        plan.merge.push(group[0])
        continue
      }

      // 重複がある場合の処理
      if (this.isSharedCandidate(group)) {
        plan.sharedCandidates.push(this.selectCanonical(group, conflictResolution))
      } else {
        plan.conflicts.push(group)
      }
    }

    return plan
  }

  private isSharedCandidate(useCases: any[]): boolean {
    // オペレーション共有候補（複数オペレーションで利用される可能性）
    const sharedKeywords = ['成果物提出', 'メンバー検索', '承認', '進捗報告']
    return useCases.some(useCase =>
      sharedKeywords.some(keyword =>
        (useCase.displayName || useCase.name).includes(keyword)
      )
    )
  }

  private selectCanonical(useCases: any[], resolution: string): any {
    switch (resolution) {
      case 'merge':
        // 最も包括的なコンテンツを持つユースケースを選択
        return useCases.reduce((canonical, current) =>
          (current.content?.length || 0) > (canonical.content?.length || 0) ? current : canonical
        )
      case 'overwrite':
        // 最新のユースケースを選択
        return useCases.reduce((latest, current) =>
          new Date(current.updatedAt || current.createdAt) > new Date(latest.updatedAt || latest.createdAt)
            ? current : latest
        )
      case 'skip':
        // 最初のユースケースを選択
        return useCases[0]
      default:
        return useCases[0]
    }
  }
}

// MDファイルをスキャンしてユースケース中心2層分離構造に分類
async function scanUseCaseCentric2LayerStructure(basePath: string) {
  const servicesPath = path.join(basePath, 'docs', 'parasol', 'services')
  const classifier = new UseCaseCentric2LayerClassifier()
  const useCases = []

  try {
    // 各サービスの shared-usecases と individual-usecases をスキャン
    const serviceDirs = await fs.readdir(servicesPath)
    for (const serviceDir of serviceDirs.filter(d => d !== 'global-shared-pages')) {
      await scanServiceUseCases(path.join(servicesPath, serviceDir), serviceDir, classifier, useCases)
    }
  } catch (error) {
    console.error('ユースケースファイルスキャンエラー:', error)
    throw error
  }

  return useCases
}

async function scanServiceUseCases(servicePath: string, serviceId: string, classifier: any, useCases: any[]) {
  try {
    const capabilitiesPath = path.join(servicePath, 'capabilities')
    const capabilityDirs = await fs.readdir(capabilitiesPath)

    for (const capabilityDir of capabilityDirs) {
      const operationsPath = path.join(capabilitiesPath, capabilityDir, 'operations')
      const operationDirs = await fs.readdir(operationsPath)

      for (const operationDir of operationDirs) {
        const operationPath = path.join(operationsPath, operationDir)

        // shared-usecases をスキャン
        await scanUseCasesDirectory(
          path.join(operationPath, 'shared-usecases'),
          'shared',
          serviceId,
          operationDir,
          useCases
        )

        // individual-usecases をスキャン
        await scanUseCasesDirectory(
          path.join(operationPath, 'individual-usecases'),
          'individual',
          serviceId,
          operationDir,
          useCases
        )

        // 旧構造: usecases をスキャン（自動分類）
        const legacyUsecasesPath = path.join(operationPath, 'usecases')
        try {
          const usecaseDirs = await fs.readdir(legacyUsecasesPath)
          for (const usecaseDir of usecaseDirs) {
            const usecaseFile = path.join(legacyUsecasesPath, usecaseDir, 'usecase.md')
            try {
              const content = await fs.readFile(usecaseFile, 'utf-8')
              const layer = classifier.classifyUseCase(usecaseFile, content)

              useCases.push({
                filePath: usecaseFile,
                content: content.replace(/\x1b\[[0-9;]*m/g, ''), // ANSI除去
                layer,
                displayName: extractDisplayName(content) || usecaseDir,
                name: usecaseDir,
                serviceId,
                operationId: operationDir,
                usecaseId: usecaseDir
              })
            } catch {
              // ファイルが存在しない場合はスキップ
            }
          }
        } catch {
          // 旧構造が存在しない場合はスキップ
        }
      }
    }
  } catch (error) {
    console.error(`サービス ${serviceId} のユースケーススキャンエラー:`, error)
  }
}

async function scanUseCasesDirectory(
  useCasesPath: string,
  layer: 'shared' | 'individual',
  serviceId: string,
  operationId: string,
  useCases: any[]
) {
  try {
    const useCaseDirs = await fs.readdir(useCasesPath)
    for (const useCaseDir of useCaseDirs) {
      const usecaseFile = path.join(useCasesPath, useCaseDir, 'usecase.md')
      const content = await fs.readFile(usecaseFile, 'utf-8')

      useCases.push({
        filePath: usecaseFile,
        content: content.replace(/\x1b\[[0-9;]*m/g, ''), // ANSI除去
        layer,
        displayName: extractDisplayName(content) || useCaseDir,
        name: useCaseDir,
        serviceId,
        operationId,
        usecaseId: useCaseDir,

        // ページも一緒にスキャン
        pages: await scanUseCasePages(path.join(useCasesPath, useCaseDir, 'pages'))
      })
    }
  } catch (error) {
    // ディレクトリが存在しない場合はスキップ
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
        content: content.replace(/\x1b\[[0-9;]*m/g, ''), // ANSI除去
        displayName: extractDisplayName(content) || file.replace('.md', ''),
        name: file.replace('.md', '')
      })
    }
  } catch {
    // ページディレクトリが存在しない場合はスキップ
  }
  return pages
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

export async function POST(request: Request) {
  try {
    const body: UseCaseCentric2LayerImportRequest = await request.json()
    const {
      sourceDirectory = process.cwd(),
      conflictResolution = 'merge',
      layerValidation = true,
      dryRun = false
    } = body

    console.log('ユースケース中心2層分離インポート開始:', { sourceDirectory, conflictResolution, layerValidation, dryRun })

    // 1. ユースケースMDファイルスキャン
    const basePath = sourceDirectory
    const useCases = await scanUseCaseCentric2LayerStructure(basePath)

    console.log(`スキャン完了: ${useCases.length}ユースケースを発見`)

    // 2. ユースケース重複解決
    const resolver = new UseCaseDuplicationResolver()
    const resolutionPlan = await resolver.resolveDuplication(useCases, conflictResolution)

    console.log('ユースケース重複解決計画:', {
      merge: resolutionPlan.merge.length,
      shared: resolutionPlan.sharedCandidates.length,
      conflicts: resolutionPlan.conflicts.length
    })

    if (dryRun) {
      return NextResponse.json({
        success: true,
        preview: {
          scannedUseCases: useCases.length,
          resolutionPlan: {
            merge: resolutionPlan.merge.length,
            sharedCandidates: resolutionPlan.sharedCandidates.length,
            conflicts: resolutionPlan.conflicts.length
          },
          layerBreakdown: {
            shared: useCases.filter(uc => uc.layer === 'shared').length,
            individual: useCases.filter(uc => uc.layer === 'individual').length
          }
        },
        estimatedChanges: resolutionPlan.merge.length + resolutionPlan.sharedCandidates.length
      })
    }

    // 3. データベース更新
    const migrationSummary: UseCaseMigrationSummary = {
      sharedUseCases: 0,
      individualUseCases: 0,
      migratedUseCases: 0,
      conflictResolved: 0,
      errors: []
    }

    const layerClassification: UseCaseLayerClassification = {
      shared: [],
      individual: []
    }

    // Shared UseCases (Layer 1) の処理
    for (const useCase of resolutionPlan.sharedCandidates) {
      try {
        await parasolDb.useCaseLayerDefinition.create({
          data: {
            useCaseName: useCase.name,
            layerType: 'shared',
            sharedScope: 'operation', // オペレーション共有
            parentOperationId: useCase.operationId,
            filePath: useCase.filePath,
            content: useCase.content,
            displayName: useCase.displayName
          }
        })
        migrationSummary.sharedUseCases++
        layerClassification.shared.push(useCase.displayName)
      } catch (error) {
        migrationSummary.errors.push(`共有ユースケース作成エラー: ${useCase.displayName} - ${error}`)
      }
    }

    // Individual UseCases (Layer 2) の処理
    for (const useCase of resolutionPlan.merge.filter(uc => uc.layer === 'individual')) {
      try {
        await parasolDb.useCaseLayerDefinition.create({
          data: {
            useCaseName: useCase.name,
            layerType: 'individual',
            sharedScope: 'usecase', // ユースケース専用
            parentOperationId: useCase.operationId,
            parentUseCaseId: useCase.usecaseId,
            filePath: useCase.filePath,
            content: useCase.content,
            displayName: useCase.displayName
          }
        })
        migrationSummary.individualUseCases++
        layerClassification.individual.push(useCase.displayName)
      } catch (error) {
        migrationSummary.errors.push(`個別ユースケース作成エラー: ${useCase.displayName} - ${error}`)
      }
    }

    migrationSummary.migratedUseCases = migrationSummary.sharedUseCases + migrationSummary.individualUseCases
    migrationSummary.conflictResolved = resolutionPlan.conflicts.length

    console.log('ユースケース中心2層分離インポート完了:', migrationSummary)

    return NextResponse.json({
      success: true,
      migrationSummary,
      layerClassification
    })

  } catch (error) {
    console.error('ユースケース中心2層分離インポートエラー:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知のエラー',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}