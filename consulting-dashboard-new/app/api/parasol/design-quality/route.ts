import { NextResponse } from 'next/server'
import { parasolDb as _parasolDb } from '@/lib/prisma-vercel'
import fs from 'fs'
import path from 'path'

interface DesignQualityAnalysisResult {
  structuralDuplications: StructuralDuplication[]
  capabilityBoundaryIssues: CapabilityBoundaryIssue[]
  businessContextDuplications: BusinessContextDuplication[]
  recommendations: QualityRecommendation[]
}

interface StructuralDuplication {
  type: 'capability-operation-overlap' | 'directory-structure-mismatch'
  description: string
  affectedFiles: string[]
  severity: 'high' | 'medium' | 'low'
  autoFixable: boolean
  recommendedAction: string
}

interface CapabilityBoundaryIssue {
  type: 'function-scattered' | 'responsibility-overlap'
  description: string
  affectedCapabilities: string[]
  duplicatedFunctions: string[]
  consolidationStrategy: string
}

interface BusinessContextDuplication {
  type: 'context-variation' | 'workflow-similarity'
  description: string
  duplicatedFiles: {
    file1: string
    file2: string
    similarity: number
    contextDifference: string
  }
  parametrizationPotential: 'high' | 'medium' | 'low'
}

interface QualityRecommendation {
  priority: 'critical' | 'important' | 'nice-to-have'
  action: string
  impact: string
  effort: 'low' | 'medium' | 'high'
  dependencies: string[]
}

// 設計品質分析エンジン
class DesignQualityAnalyzer {
  private docsPath: string

  constructor() {
    this.docsPath = path.join(process.cwd(), 'docs/parasol/services')
  }

  async analyzeStructuralDuplications(): Promise<StructuralDuplication[]> {
    const duplications: StructuralDuplication[] = []

    try {
      // ケーパビリティとオペレーション名の重複チェック
      const services = fs.readdirSync(this.docsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())

      for (const service of services) {
        const servicePath = path.join(this.docsPath, service.name, 'capabilities')

        if (!fs.existsSync(servicePath)) continue

        const capabilities = fs.readdirSync(servicePath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())

        for (const capability of capabilities) {
          const operationsPath = path.join(servicePath, capability.name, 'operations')

          if (!fs.existsSync(operationsPath)) continue

          const operations = fs.readdirSync(operationsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())

          // ケーパビリティ名とオペレーション名の重複検出
          for (const operation of operations) {
            if (operation.name === capability.name) {
              const affectedFiles = this.findFilesInPath(
                path.join(operationsPath, operation.name)
              )

              duplications.push({
                type: 'capability-operation-overlap',
                description: `ケーパビリティ名 "${capability.name}" とオペレーション名 "${operation.name}" が重複しています`,
                affectedFiles,
                severity: 'high',
                autoFixable: false,
                recommendedAction: `ケーパビリティ構造の見直しが必要です。より具体的なオペレーション名への変更を検討してください。`
              })
            }
          }
        }
      }

      // ディレクトリ構造の不整合チェック
      duplications.push(...this.analyzeDirectoryStructure())

    } catch (_error) {
      console.error('構造的重複分析エラー:', error)
    }

    return duplications
  }

  async analyzeCapabilityBoundaryIssues(): Promise<CapabilityBoundaryIssue[]> {
    const issues: CapabilityBoundaryIssue[] = []

    try {
      // 同じ機能が複数ケーパビリティに散在しているかチェック
      const functionGroups = await this.groupSimilarFunctions()

      for (const [functionName, locations] of functionGroups.entries()) {
        if (locations.length > 1) {
          const capabilities = [...new Set(locations.map(loc => loc.capability))]

          if (capabilities.length > 1) {
            issues.push({
              type: 'function-scattered',
              description: `機能 "${functionName}" が複数のケーパビリティ (${capabilities.join(', ')}) に分散しています`,
              affectedCapabilities: capabilities,
              duplicatedFunctions: [functionName],
              consolidationStrategy: this.determineConsolidationStrategy(functionName, locations)
            })
          }
        }
      }

    } catch (_error) {
      console.error('ケーパビリティ境界分析エラー:', error)
    }

    return issues
  }

  async analyzeBusinessContextDuplications(): Promise<BusinessContextDuplication[]> {
    const duplications: BusinessContextDuplication[] = []

    try {
      // ファイル名ベースの重複検出
      const fileDuplicates = await this.findFileDuplicates()

      for (const duplicate of fileDuplicates) {
        const similarity = await this.calculateContentSimilarity(
          duplicate.files[0],
          duplicate.files[1]
        )

        if (similarity > 0.7) { // 70%以上の類似度
          duplications.push({
            type: 'context-variation',
            description: `類似ファイル "${duplicate.fileName}" が異なるビジネス文脈で重複しています`,
            duplicatedFiles: {
              file1: duplicate.files[0],
              file2: duplicate.files[1],
              similarity,
              contextDifference: this.extractContextDifference(duplicate.files[0], duplicate.files[1])
            },
            parametrizationPotential: similarity > 0.9 ? 'high' : similarity > 0.8 ? 'medium' : 'low'
          })
        }
      }

    } catch (_error) {
      console.error('ビジネス文脈重複分析エラー:', error)
    }

    return duplications
  }

  private findFilesInPath(dirPath: string): string[] {
    const files: string[] = []

    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name)

        if (item.isDirectory()) {
          files.push(...this.findFilesInPath(fullPath))
        } else if (item.name.endsWith('.md')) {
          files.push(fullPath.replace(process.cwd() + '/', ''))
        }
      }
    } catch {
      // ディレクトリが存在しない場合は空配列を返す
    }

    return files
  }

  private analyzeDirectoryStructure(): StructuralDuplication[] {
    // TODO: ディレクトリ構造の不整合を分析
    return []
  }

  private async groupSimilarFunctions(): Promise<Map<string, Array<{capability: string, operation: string, file: string}>>> {
    const functionGroups = new Map()

    // TODO: 同名・類似機能のグループ化
    // create-notification.md の例を実装

    return functionGroups
  }

  private determineConsolidationStrategy(functionName: string, _locations: unknown[]): string {
    // 統合戦略の決定ロジック
    if (functionName.includes('notification')) {
      return '通知機能は communication-delivery ケーパビリティに統一することを推奨'
    }

    return '最も包括的な責務を持つケーパビリティへの統合を検討'
  }

  private async findFileDuplicates(): Promise<Array<{fileName: string, files: string[]}>> {
    const fileMap = new Map<string, string[]>()

    // ファイル名ベースのグループ化
    this.traverseFiles(this.docsPath, (filePath, fileName) => {
      if (!fileMap.has(fileName)) {
        fileMap.set(fileName, [])
      }
      fileMap.get(fileName)!.push(filePath)
    })

    // 重複のみ抽出
    return Array.from(fileMap.entries())
      .filter(([_, files]) => files.length > 1)
      .map(([fileName, files]) => ({ fileName, files }))
  }

  private traverseFiles(dirPath: string, callback: (filePath: string, fileName: string) => void) {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name)

        if (item.isDirectory()) {
          this.traverseFiles(fullPath, callback)
        } else if (item.name.endsWith('.md')) {
          callback(fullPath, item.name)
        }
      }
    } catch {
      // エラーは無視（権限なしディレクトリ等）
    }
  }

  private async calculateContentSimilarity(file1: string, file2: string): Promise<number> {
    try {
      const content1 = fs.readFileSync(file1, 'utf-8')
      const content2 = fs.readFileSync(file2, 'utf-8')

      // 簡単な類似度計算（より高度なアルゴリズムに後で置き換え可能）
      const lines1 = content1.split('\n')
      const lines2 = content2.split('\n')

      const commonLines = lines1.filter(line => lines2.includes(line)).length
      const totalLines = Math.max(lines1.length, lines2.length)

      return totalLines > 0 ? commonLines / totalLines : 0
    } catch {
      return 0
    }
  }

  private extractContextDifference(file1: string, file2: string): string {
    // ファイルパスからビジネス文脈の違いを抽出
    const pathParts1 = file1.split('/')
    const pathParts2 = file2.split('/')

    const capability1 = pathParts1.find((part, index) => pathParts1[index - 1] === 'capabilities')
    const capability2 = pathParts2.find((part, index) => pathParts2[index - 1] === 'capabilities')

    return `${capability1} vs ${capability2}`
  }

  async generateRecommendations(
    structural: StructuralDuplication[],
    boundary: CapabilityBoundaryIssue[],
    context: BusinessContextDuplication[]
  ): Promise<QualityRecommendation[]> {
    const recommendations: QualityRecommendation[] = []

    // 構造的重複の推奨事項
    for (const dup of structural) {
      recommendations.push({
        priority: dup.severity === 'high' ? 'critical' : 'important',
        action: dup.recommendedAction,
        impact: `設計の整合性向上、保守性の改善`,
        effort: dup.autoFixable ? 'low' : 'medium',
        dependencies: ['ケーパビリティ階層の見直し']
      })
    }

    // ケーパビリティ境界の推奨事項
    for (const issue of boundary) {
      recommendations.push({
        priority: 'important',
        action: issue.consolidationStrategy,
        impact: `機能の一元化、責務の明確化`,
        effort: 'medium',
        dependencies: ['ビジネス分析', 'ステークホルダー調整']
      })
    }

    // ビジネス文脈重複の推奨事項
    for (const dup of context) {
      recommendations.push({
        priority: dup.parametrizationPotential === 'high' ? 'important' : 'nice-to-have',
        action: `共通機能のパラメータ化による統合`,
        impact: `重複コード削減、保守工数軽減`,
        effort: dup.parametrizationPotential === 'high' ? 'medium' : 'high',
        dependencies: ['ビジネスルール分析', '影響範囲調査']
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 3, important: 2, 'nice-to-have': 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }
}

export async function GET(_request: Request) {
  try {
    console.log('設計品質分析API開始')

    const analyzer = new DesignQualityAnalyzer()

    // 並行して各種分析を実行
    const [structural, boundary, context] = await Promise.all([
      analyzer.analyzeStructuralDuplications(),
      analyzer.analyzeCapabilityBoundaryIssues(),
      analyzer.analyzeBusinessContextDuplications()
    ])

    // 推奨事項の生成
    const recommendations = await analyzer.generateRecommendations(
      structural,
      boundary,
      context
    )

    const result: DesignQualityAnalysisResult = {
      structuralDuplications: structural,
      capabilityBoundaryIssues: boundary,
      businessContextDuplications: context,
      recommendations
    }

    console.log('設計品質分析完了:', {
      structural: structural.length,
      boundary: boundary.length,
      context: context.length,
      recommendations: recommendations.length
    })

    return NextResponse.json(result)

  } catch (_error) {
    console.error('設計品質分析エラー:', error)
    return NextResponse.json({
      error: 'Design quality analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}