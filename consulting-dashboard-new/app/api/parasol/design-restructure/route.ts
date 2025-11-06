import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import fs from 'fs'
import path from 'path'
import { FileMapping, RestructureResult } from '@/app/types/parasol'

const parasolDb = new ParasolPrismaClient()

interface PageUseCaseMapping {
  operationId: string
  operationName: string
  serviceName: string
  capabilityName: string
  currentUseCases: UseCaseFile[]
  currentPages: PageFile[]
  proposedMappings: ProposedMapping[]
  restructureActions: RestructureAction[]
}

interface UseCaseFile {
  fileName: string
  filePath: string
  displayName: string
  content: string
}

interface PageFile {
  fileName: string
  filePath: string
  displayName: string
  content: string
}

interface ProposedMapping {
  useCaseFile: string
  suggestedPageFile: string
  confidence: number
  reason: string
  action: 'merge' | 'create' | 'rename' | 'delete'
}

interface RestructureAction {
  type: 'delete_duplicate' | 'merge_files' | 'create_mapping' | 'rename_file'
  description: string
  files: string[]
  newFileName?: string
  confidence: number
}

interface RestructureAnalysisResult {
  totalOperations: number
  problemOperations: number
  pageMappings: PageUseCaseMapping[]
  duplicateFiles: DuplicateFileGroup[]
  summary: {
    totalUseCases: number
    totalPages: number
    unmatchedUseCases: number
    unmatchedPages: number
    duplicateFiles: number
    proposedDeletions: number
  }
}

interface DuplicateFileGroup {
  fileName: string
  files: Array<{
    path: string
    size: number
    content: string
  }>
  similarity: number
  action: 'keep_one' | 'merge_all' | 'manual_review'
}

class DesignRestructureAnalyzer {
  private docsPath: string

  constructor() {
    this.docsPath = path.join(process.cwd(), 'docs/parasol/services')
  }

  async analyzePageUseCaseRelationships(): Promise<RestructureAnalysisResult> {
    const services = fs.readdirSync(this.docsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    const pageMappings: PageUseCaseMapping[] = []
    const duplicateFiles: DuplicateFileGroup[] = []
    let totalOperations = 0
    let problemOperations = 0

    for (const service of services) {
      const servicePath = path.join(this.docsPath, service.name)
      const capabilitiesPath = path.join(servicePath, 'capabilities')

      if (!fs.existsSync(capabilitiesPath)) continue

      const capabilities = fs.readdirSync(capabilitiesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())

      for (const capability of capabilities) {
        const operationsPath = path.join(capabilitiesPath, capability.name, 'operations')

        if (!fs.existsSync(operationsPath)) continue

        const operations = fs.readdirSync(operationsPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())

        for (const operation of operations) {
          totalOperations++

          const operationPath = path.join(operationsPath, operation.name)
          const useCasesPath = path.join(operationPath, 'usecases')
          const pagesPath = path.join(operationPath, 'pages')

          const useCases = this.loadUseCaseFiles(useCasesPath)
          const pages = this.loadPageFiles(pagesPath)

          // 1対1関係でない場合は問題オペレーションとして記録
          if (useCases.length !== pages.length || useCases.length === 0) {
            problemOperations++
          }

          const proposedMappings = this.generateProposedMappings(useCases, pages)
          const restructureActions = this.generateRestructureActions(useCases, pages)

          pageMappings.push({
            operationId: operation.name,
            operationName: operation.name,
            serviceName: service.name,
            capabilityName: capability.name,
            currentUseCases: useCases,
            currentPages: pages,
            proposedMappings,
            restructureActions
          })
        }
      }
    }

    // 重複ファイルの検出
    const allFiles = this.getAllMDFiles()
    const duplicates = this.findDuplicateFiles(allFiles)

    const summary = this.generateSummary(pageMappings, duplicates)

    return {
      totalOperations,
      problemOperations,
      pageMappings,
      duplicateFiles: duplicates,
      summary
    }
  }

  private loadUseCaseFiles(useCasesPath: string): UseCaseFile[] {
    if (!fs.existsSync(useCasesPath)) return []

    return fs.readdirSync(useCasesPath)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(useCasesPath, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const displayName = this.extractDisplayName(content) || file.replace('.md', '')

        return {
          fileName: file,
          filePath: filePath.replace(process.cwd() + '/', ''),
          displayName,
          content
        }
      })
  }

  private loadPageFiles(pagesPath: string): PageFile[] {
    if (!fs.existsSync(pagesPath)) return []

    return fs.readdirSync(pagesPath)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(pagesPath, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const displayName = this.extractDisplayName(content) || file.replace('.md', '')

        return {
          fileName: file,
          filePath: filePath.replace(process.cwd() + '/', ''),
          displayName,
          content
        }
      })
  }

  private extractDisplayName(content: string): string | null {
    const titleMatch = content.match(/^#\s+(.+)$/m)
    return titleMatch ? titleMatch[1] : null
  }

  private generateProposedMappings(useCases: UseCaseFile[], pages: PageFile[]): ProposedMapping[] {
    // ビジネスオペレーション名をファイルパスから抽出
    const operationName = useCases[0] ? this.extractOperationName(useCases[0].filePath) : ''

    // 理想的な1対1関係を推論
    const idealStructure = this.inferIdealStructureFromOperation(operationName, useCases, pages)

    // 既存ファイルとのマッピング
    return this.mapExistingFilesToIdealStructure(idealStructure, useCases, pages)
  }

  private extractOperationName(filePath: string): string {
    // パスから operations/[operation-name] の [operation-name] 部分を抽出
    // 例: "docs/parasol/services/.../operations/facilitate-communication/usecases/..."
    const operationMatch = filePath.match(/\/operations\/([^\/]+)\//)
    return operationMatch ? operationMatch[1] : ''
  }

  private inferIdealStructureFromOperation(operationName: string, useCases: UseCaseFile[], pages: PageFile[]): Array<{useCaseName: string, pageName: string, confidence: number}> {
    // ビジネスオペレーション名から理想的なユースケース・ページペアを推論
    const operationPatterns = {
      'facilitate-communication': [
        { useCase: 'create-communication-channel', page: 'communication-channel-creation-page', confidence: 0.95 },
        { useCase: 'manage-communication-channel', page: 'communication-channel-management-page', confidence: 0.95 },
        { useCase: 'send-message', page: 'message-send-page', confidence: 0.90 },
        { useCase: 'moderate-communication', page: 'communication-moderation-page', confidence: 0.85 }
      ],
      'register-and-manage-members': [
        { useCase: 'register-member', page: 'member-registration-page', confidence: 0.95 },
        { useCase: 'manage-member-profile', page: 'member-profile-management-page', confidence: 0.95 },
        { useCase: 'search-members', page: 'member-search-page', confidence: 0.90 },
        { useCase: 'delete-member', page: 'member-deletion-page', confidence: 0.85 }
      ],
      'manage-projects': [
        { useCase: 'create-project', page: 'project-creation-page', confidence: 0.95 },
        { useCase: 'update-project', page: 'project-update-page', confidence: 0.95 },
        { useCase: 'monitor-project-progress', page: 'project-monitoring-page', confidence: 0.90 },
        { useCase: 'complete-project', page: 'project-completion-page', confidence: 0.85 }
      ]
    }

    // パターンマッチングによる推論
    if (operationPatterns[operationName]) {
      return operationPatterns[operationName].map(pattern => ({
        useCaseName: pattern.useCase,
        pageName: pattern.page,
        confidence: pattern.confidence
      }))
    }

    // パターンがない場合は、既存ファイル名から推論
    return this.inferFromExistingFiles(useCases, pages)
  }

  private inferFromExistingFiles(useCases: UseCaseFile[], pages: PageFile[]): Array<{useCaseName: string, pageName: string, confidence: number}> {
    const inferred: Array<{useCaseName: string, pageName: string, confidence: number}> = []

    for (const useCase of useCases) {
      // ファイル名から機能を推論
      const baseName = useCase.fileName.replace('.md', '')
      const expectedPageName = `${baseName}-page.md`

      // 対応するページが存在するかチェック
      const matchingPage = pages.find(page =>
        page.fileName === expectedPageName ||
        this.calculateNameSimilarity(baseName, page.fileName.replace('-page.md', '').replace('.md', '')) > 0.7
      )

      inferred.push({
        useCaseName: baseName,
        pageName: matchingPage ? matchingPage.fileName.replace('.md', '') : `${baseName}-page`,
        confidence: matchingPage ? 0.8 : 0.6 // 既存ページがあれば高信頼度
      })
    }

    return inferred
  }

  private calculateNameSimilarity(name1: string, name2: string): number {
    return this.stringLikeness(name1.toLowerCase(), name2.toLowerCase())
  }

  private mapExistingFilesToIdealStructure(idealStructure: Array<{useCaseName: string, pageName: string, confidence: number}>, useCases: UseCaseFile[], pages: PageFile[]): ProposedMapping[] {
    const mappings: ProposedMapping[] = []

    for (const ideal of idealStructure) {
      // 理想的なユースケース名に最も近い既存ファイルを検索
      const bestUseCaseMatch = this.findBestFileMatch(ideal.useCaseName, useCases.map(uc => uc.fileName))
      const bestPageMatch = this.findBestFileMatch(ideal.pageName, pages.map(p => p.fileName))

      const actualUseCase = useCases.find(uc => uc.fileName === bestUseCaseMatch)
      const actualPage = pages.find(p => p.fileName === bestPageMatch)

      if (actualUseCase) {
        mappings.push({
          useCaseFile: actualUseCase.fileName,
          suggestedPageFile: actualPage ? actualPage.fileName : `${ideal.pageName}.md`,
          confidence: ideal.confidence,
          reason: this.generateStructureBasedReason(ideal.confidence, actualPage !== undefined),
          action: actualPage ? 'merge' : 'create'
        })
      }
    }

    return mappings
  }

  private findBestFileMatch(idealName: string, actualFiles: string[]): string | null {
    let bestMatch: string | null = null
    let bestScore = 0

    for (const file of actualFiles) {
      const fileName = file.replace('.md', '').replace('-page', '')
      const score = this.calculateNameSimilarity(idealName, fileName)

      if (score > bestScore) {
        bestScore = score
        bestMatch = file
      }
    }

    return bestScore > 0.3 ? bestMatch : null // 最低30%の類似度が必要
  }

  private generateStructureBasedReason(confidence: number, pageExists: boolean): string {
    if (confidence > 0.9) {
      return `ビジネスオペレーションから推論された強い1対1関係 (${Math.round(confidence * 100)}%)`
    } else if (confidence > 0.7) {
      return `ビジネスロジックに基づく適切な対応関係 (${Math.round(confidence * 100)}%)`
    } else if (pageExists) {
      return `既存ファイルの名前パターンから推論 (${Math.round(confidence * 100)}%)`
    } else {
      return `新規ページ作成が必要 (${Math.round(confidence * 100)}%)`
    }
  }

  private calculateSimilarity(useCase: UseCaseFile, page: PageFile): number {
    // 名前の類似度
    const nameSimilarity = this.stringLikeness(
      useCase.fileName.replace('.md', ''),
      page.fileName.replace('-page.md', '').replace('.md', '')
    )

    // 表示名の類似度
    const displayNameSimilarity = this.stringLikeness(
      useCase.displayName.toLowerCase(),
      page.displayName.toLowerCase()
    )

    // 内容の類似度（簡易版）
    const contentSimilarity = this.calculateContentSimilarity(useCase.content, page.content)

    // 加重平均で最終スコアを計算
    return (nameSimilarity * 0.4 + displayNameSimilarity * 0.4 + contentSimilarity * 0.2)
  }

  private stringLikeness(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    return (longer.length - this.editDistance(longer, shorter)) / longer.length
  }

  private editDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  private calculateContentSimilarity(content1: string, content2: string): number {
    // 冗長表現の正規化
    const normalized1 = this.normalizeRedundantText(content1)
    const normalized2 = this.normalizeRedundantText(content2)

    // 機能的キーワードの抽出
    const functionalWords1 = this.extractFunctionalKeywords(normalized1)
    const functionalWords2 = this.extractFunctionalKeywords(normalized2)

    // 通常の単語集合
    const words1 = new Set(normalized1.toLowerCase().match(/\w+/g) || [])
    const words2 = new Set(normalized2.toLowerCase().match(/\w+/g) || [])

    // 機能的キーワードの類似度（重み3倍）
    const functionalIntersection = new Set([...functionalWords1].filter(x => functionalWords2.has(x)))
    const functionalUnion = new Set([...functionalWords1, ...functionalWords2])
    const functionalSimilarity = functionalUnion.size > 0 ? functionalIntersection.size / functionalUnion.size : 0

    // 通常の単語類似度
    const wordIntersection = new Set([...words1].filter(x => words2.has(x)))
    const wordUnion = new Set([...words1, ...words2])
    const wordSimilarity = wordUnion.size > 0 ? wordIntersection.size / wordUnion.size : 0

    // 重み付き平均（機能的キーワード70%、通常単語30%）
    return functionalSimilarity * 0.7 + wordSimilarity * 0.3
  }

  private normalizeRedundantText(content: string): string {
    return content
      // 「・」で区切られた冗長な修飾語列を簡素化
      .replace(/([・・]+[^・\s]+){5,}/g, ' ')
      // 繰り返し修飾語パターンを除去
      .replace(/(効率|品質|価値|競争力|成功|満足|最適化)[・・]+/g, '')
      // 過度な修飾語を簡略化
      .replace(/継続的・効率的・安全に/g, '継続的に')
      .replace(/円滑・効果的・生産的な/g, '効果的な')
      .replace(/適切・最適・効果的/g, '適切')
      // 複数の中点を単一スペースに
      .replace(/[・・]+/g, ' ')
      // 多重スペースを単一スペースに
      .replace(/\s+/g, ' ')
      .trim()
  }

  private extractFunctionalKeywords(content: string): Set<string> {
    const functionalKeywords = [
      // 基本動作
      '作成', '管理', '設定', '変更', '削除', '追加', '編集', '更新',
      // コミュニケーション関連
      'チャネル', 'メッセージ', '通知', 'コミュニケーション', '情報共有',
      'ディスカッション', '会議', 'チャット', '送信', '受信',
      // メンバー・権限関連
      'メンバー', 'ユーザー', '権限', 'ロール', 'アクセス', '招待',
      'グループ', 'チーム', 'プロジェクト', '組織', '承認',
      // システム機能
      'ログイン', 'ログアウト', '認証', 'セキュリティ', '監査',
      'バックアップ', '復旧', '同期', '統合', '連携',
      // UI要素
      'ページ', '画面', 'フォーム', 'ボタン', 'メニュー', 'ダッシュボード',
      'リスト', 'テーブル', 'カード', 'アイコン', 'プレビュー'
    ]

    const words = content.toLowerCase().match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\w]+/g) || []
    return new Set(words.filter(word =>
      functionalKeywords.some(keyword => word.includes(keyword) || keyword.includes(word))
    ))
  }

  private generateMappingReason(useCase: UseCaseFile, page: PageFile, score: number): string {
    if (score > 0.8) {
      return `名前とコンテンツの高い類似性 (${Math.round(score * 100)}%)`
    } else if (score > 0.5) {
      return `名前の部分的一致 (${Math.round(score * 100)}%)`
    } else {
      return `関連性が低いため要確認 (${Math.round(score * 100)}%)`
    }
  }

  private generateRestructureActions(useCases: UseCaseFile[], pages: PageFile[]): RestructureAction[] {
    const actions: RestructureAction[] = []

    // ユースケース数とページ数の比較
    if (pages.length > useCases.length) {
      actions.push({
        type: 'delete_duplicate',
        description: `${pages.length - useCases.length}個の余剰ページを削除`,
        files: pages.slice(useCases.length).map(p => p.filePath),
        confidence: 0.8
      })
    } else if (useCases.length > pages.length) {
      const missingPages = useCases.slice(pages.length)
      actions.push({
        type: 'create_mapping',
        description: `${missingPages.length}個の不足ページを作成`,
        files: missingPages.map(uc => uc.filePath),
        confidence: 0.9
      })
    }

    return actions
  }

  private getAllMDFiles(): Array<{path: string, content: string, name: string}> {
    const files: Array<{path: string, content: string, name: string}> = []

    const traverse = (dirPath: string) => {
      try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true })

        for (const item of items) {
          const fullPath = path.join(dirPath, item.name)

          if (item.isDirectory()) {
            traverse(fullPath)
          } else if (item.name.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf-8')
            files.push({
              path: fullPath.replace(process.cwd() + '/', ''),
              content,
              name: item.name
            })
          }
        }
      } catch (error) {
        // アクセス権限エラー等は無視
      }
    }

    traverse(this.docsPath)
    return files
  }

  private findDuplicateFiles(files: Array<{path: string, content: string, name: string}>): DuplicateFileGroup[] {
    const groups = new Map<string, Array<{path: string, content: string}>>()

    // ファイル名でグループ化
    for (const file of files) {
      if (!groups.has(file.name)) {
        groups.set(file.name, [])
      }
      groups.get(file.name)!.push({
        path: file.path,
        content: file.content
      })
    }

    // 重複のみ抽出
    const duplicates: DuplicateFileGroup[] = []

    for (const [fileName, fileGroup] of groups.entries()) {
      if (fileGroup.length > 1) {
        const similarity = this.calculateGroupSimilarity(fileGroup)

        duplicates.push({
          fileName,
          files: fileGroup.map(f => ({
            path: f.path,
            size: f.content.length,
            content: f.content
          })),
          similarity,
          action: similarity > 0.9 ? 'keep_one' : similarity > 0.7 ? 'merge_all' : 'manual_review'
        })
      }
    }

    return duplicates
  }

  private calculateGroupSimilarity(files: Array<{content: string}>): number {
    if (files.length < 2) return 1.0

    let totalSimilarity = 0
    let comparisons = 0

    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        totalSimilarity += this.calculateContentSimilarity(files[i].content, files[j].content)
        comparisons++
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 0
  }

  private generateSummary(mappings: PageUseCaseMapping[], duplicates: DuplicateFileGroup[]): RestructureAnalysisResult['summary'] {
    const totalUseCases = mappings.reduce((sum, m) => sum + m.currentUseCases.length, 0)
    const totalPages = mappings.reduce((sum, m) => sum + m.currentPages.length, 0)
    const unmatchedUseCases = mappings.reduce((sum, m) =>
      sum + m.currentUseCases.filter(uc =>
        !m.proposedMappings.some(pm => pm.useCaseFile === uc.fileName && pm.confidence > 0.5)
      ).length, 0
    )
    const unmatchedPages = mappings.reduce((sum, m) =>
      sum + m.currentPages.filter(p =>
        !m.proposedMappings.some(pm => pm.suggestedPageFile === p.fileName && pm.confidence > 0.5)
      ).length, 0
    )
    const duplicateFiles = duplicates.length
    const proposedDeletions = duplicates.reduce((sum, d) => sum + (d.files.length - 1), 0)

    return {
      totalUseCases,
      totalPages,
      unmatchedUseCases,
      unmatchedPages,
      duplicateFiles,
      proposedDeletions
    }
  }
}

export async function GET(request: Request) {
  try {
    console.log('設計再構築分析API開始')

    const analyzer = new DesignRestructureAnalyzer()
    const result = await analyzer.analyzePageUseCaseRelationships()

    console.log('設計再構築分析完了:', {
      totalOperations: result.totalOperations,
      problemOperations: result.problemOperations,
      duplicateFiles: result.duplicateFiles.length
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('設計再構築分析エラー:', error)
    return NextResponse.json({
      error: 'Design restructure analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, operationId, mappings } = await request.json()

    if (action === 'apply_restructure') {
      // 実際の再構築処理を実行
      const result = await applyRestructure(operationId, mappings)
      return NextResponse.json(result)
    }

    if (action === 'delete_duplicates') {
      // MD重複ファイル削除を実行
      const result = await deleteDuplicateMDFiles()
      return NextResponse.json(result)
    }

    if (action === 'delete_database_duplicates') {
      // データベースレベルの重複削除を実行
      const result = await deleteDatabaseDuplicates()
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('設計再構築実行エラー:', error)
    return NextResponse.json({
      error: 'Design restructure execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function applyRestructure(operationId: string, mappings: FileMapping[]): Promise<RestructureResult[]> {
  const results = []
  let successCount = 0
  let errorCount = 0

  for (const mapping of mappings) {
    try {
      if (mapping.action === 'delete_duplicate') {
        // 重複ファイルを削除
        const filePath = path.join(process.cwd(), mapping.filePath)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log(`削除完了: ${mapping.filePath}`)
          results.push({
            action: 'delete',
            file: mapping.filePath,
            status: 'success',
            message: 'ファイルを削除しました'
          })
          successCount++
        } else {
          results.push({
            action: 'delete',
            file: mapping.filePath,
            status: 'skip',
            message: 'ファイルが存在しません'
          })
        }
      } else if (mapping.action === 'merge_files') {
        // ファイルをマージ（今後実装）
        results.push({
          action: 'merge',
          file: mapping.filePath,
          status: 'pending',
          message: 'マージ機能は今後実装予定'
        })
      }
    } catch (error) {
      console.error(`ファイル操作エラー:`, error)
      results.push({
        action: mapping.action,
        file: mapping.filePath,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
      errorCount++
    }
  }

  return {
    success: errorCount === 0,
    appliedActions: successCount,
    errorCount,
    results,
    message: `${successCount}件の操作が成功、${errorCount}件のエラーが発生しました`
  }
}

// MD重複ファイル削除専用のエンドポイント
async function deleteDuplicateMDFiles(): Promise<any> {
  const duplicateFiles = [
    // create-notification.md の重複（collaboration-facilitation-service内）
    'docs/parasol/services/collaboration-facilitation-service/capabilities/deliver-immediate-information/operations/deliver-notifications/usecases/create-notification.md',

    // submit-deliverable.md の重複（project-success-service内）
    'docs/parasol/services/project-success-service/capabilities/manage-and-complete-tasks/operations/assign-and-execute-tasks/usecases/submit-deliverable.md',

    // 他の重複ファイルも追加可能
  ]

  const results = []
  let successCount = 0
  let errorCount = 0

  for (const filePath of duplicateFiles) {
    try {
      const fullPath = path.join(process.cwd(), filePath)
      if (fs.existsSync(fullPath)) {
        // バックアップ作成
        const backupPath = `${fullPath}.backup.${Date.now()}`
        fs.copyFileSync(fullPath, backupPath)

        // 元ファイル削除
        fs.unlinkSync(fullPath)

        console.log(`重複ファイル削除完了: ${filePath}`)
        results.push({
          action: 'delete_duplicate',
          originalFile: filePath,
          backupFile: backupPath,
          status: 'success',
          message: 'ファイルを削除し、バックアップを作成しました'
        })
        successCount++
      } else {
        results.push({
          action: 'delete_duplicate',
          originalFile: filePath,
          status: 'skip',
          message: 'ファイルが存在しません'
        })
      }
    } catch (error) {
      console.error(`重複ファイル削除エラー:`, error)
      results.push({
        action: 'delete_duplicate',
        originalFile: filePath,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
      errorCount++
    }
  }

  return {
    success: errorCount === 0,
    deletedFiles: successCount,
    errorCount,
    results,
    message: `${successCount}件の重複ファイルを削除、${errorCount}件のエラーが発生しました`
  }
}

// データベースレベルの重複削除専用の関数
async function deleteDatabaseDuplicates(): Promise<any> {
  try {
    const results = []
    let totalDeletedRecords = 0
    let totalProcessedGroups = 0

    // 1. 重複するページ定義を取得
    const duplicateGroupsRaw = await parasolDb.$queryRaw<Array<{displayName: string, count: bigint}>>`
      SELECT displayName, COUNT(*) as count
      FROM page_definitions
      GROUP BY displayName
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `

    // BigIntをnumberに変換
    const duplicateGroups = duplicateGroupsRaw.map(group => ({
      displayName: group.displayName,
      count: Number(group.count)
    }))

    console.log(`データベース重複グループ数: ${duplicateGroups.length}`)

    // 2. 各重複グループについて、最新以外を削除
    for (const group of duplicateGroups) {
      try {
        totalProcessedGroups++

        // 同じdisplayNameのページ定義を取得（作成日時の降順）
        const duplicatePages = await parasolDb.pageDefinition.findMany({
          where: {
            displayName: group.displayName
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        // 最新の1件を除いて削除対象を特定
        const pagesToDelete = duplicatePages.slice(1) // 最初（最新）以外は削除

        if (pagesToDelete.length > 0) {
          // 削除対象のIDを取得
          const idsToDelete = pagesToDelete.map(page => page.id)

          // 削除実行
          const deleteResult = await parasolDb.pageDefinition.deleteMany({
            where: {
              id: {
                in: idsToDelete
              }
            }
          })

          totalDeletedRecords += deleteResult.count

          results.push({
            displayName: group.displayName,
            totalCount: group.count,
            deletedCount: deleteResult.count,
            keptPageId: duplicatePages[0].id,
            status: 'success',
            message: `${deleteResult.count}件の重複レコードを削除し、最新の1件を保持しました`
          })

          console.log(`✅ ${group.displayName}: ${deleteResult.count}件削除、1件保持`)
        }

      } catch (error) {
        console.error(`重複グループ処理エラー (${group.displayName}):`, error)
        results.push({
          displayName: group.displayName,
          totalCount: group.count,
          deletedCount: 0,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // 3. ユースケース定義の重複も処理
    const duplicateUseCaseGroupsRaw = await parasolDb.$queryRaw<Array<{displayName: string, count: bigint}>>`
      SELECT displayName, COUNT(*) as count
      FROM use_cases
      GROUP BY displayName
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `

    // BigIntをnumberに変換
    const duplicateUseCaseGroups = duplicateUseCaseGroupsRaw.map(group => ({
      displayName: group.displayName,
      count: Number(group.count)
    }))

    console.log(`ユースケース重複グループ数: ${duplicateUseCaseGroups.length}`)

    for (const group of duplicateUseCaseGroups) {
      try {
        totalProcessedGroups++

        const duplicateUseCases = await parasolDb.useCase.findMany({
          where: {
            displayName: group.displayName
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        const useCasesToDelete = duplicateUseCases.slice(1)

        if (useCasesToDelete.length > 0) {
          const idsToDelete = useCasesToDelete.map(uc => uc.id)

          const deleteResult = await parasolDb.useCase.deleteMany({
            where: {
              id: {
                in: idsToDelete
              }
            }
          })

          totalDeletedRecords += deleteResult.count

          results.push({
            displayName: group.displayName,
            totalCount: group.count,
            deletedCount: deleteResult.count,
            keptUseCaseId: duplicateUseCases[0].id,
            status: 'success',
            type: 'usecase',
            message: `${deleteResult.count}件の重複ユースケースを削除し、最新の1件を保持しました`
          })

          console.log(`✅ ユースケース ${group.displayName}: ${deleteResult.count}件削除、1件保持`)
        }

      } catch (error) {
        console.error(`ユースケース重複グループ処理エラー (${group.displayName}):`, error)
        results.push({
          displayName: group.displayName,
          totalCount: group.count,
          deletedCount: 0,
          status: 'error',
          type: 'usecase',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return {
      success: true,
      processedGroups: totalProcessedGroups,
      deletedRecords: totalDeletedRecords,
      pageGroups: duplicateGroups.length,
      useCaseGroups: duplicateUseCaseGroups.length,
      results,
      message: `${totalProcessedGroups}グループを処理し、${totalDeletedRecords}件の重複レコードを削除しました`
    }

  } catch (error) {
    console.error('データベース重複削除エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'データベース重複削除中にエラーが発生しました'
    }
  } finally {
    await parasolDb.$disconnect()
  }
}