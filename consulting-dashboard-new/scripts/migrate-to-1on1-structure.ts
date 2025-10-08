#!/usr/bin/env tsx

/**
 * パラソル設計MDディレクトリ構造を1対1関係強制構造に移行するスクリプト
 *
 * 移行前構造:
 * operations/[operation-name]/
 * ├── operation.md
 * ├── usecases/
 * │   ├── usecase-1.md
 * │   └── usecase-2.md
 * └── pages/
 *     ├── page-1.md
 *     └── page-2.md
 *
 * 移行後構造:
 * operations/[operation-name]/
 * ├── operation.md
 * └── usecases/
 *     ├── [usecase-1-name]/
 *     │   ├── usecase.md
 *     │   └── page.md
 *     └── [usecase-2-name]/
 *         ├── usecase.md
 *         └── page.md
 */

import fs from 'fs'
import path from 'path'

interface MigrationResult {
  success: boolean
  operationsProcessed: number
  useCaseDirectoriesCreated: number
  filesRelocated: number
  errors: string[]
  backupPath: string
}

interface UseCasePageMapping {
  useCaseFile: string
  useCaseContent: string
  correspondingPageFile: string | null
  pageContent: string | null
  newDirectoryName: string
}

class ParasolStructureMigrator {
  private readonly baseDocsPath: string
  private readonly backupDir: string
  private readonly dryRun: boolean

  constructor(baseDocsPath: string, dryRun: boolean = false) {
    this.baseDocsPath = baseDocsPath
    this.backupDir = path.join(process.cwd(), 'backups', `parasol-migration-${Date.now()}`)
    this.dryRun = dryRun
  }

  async migrate(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      operationsProcessed: 0,
      useCaseDirectoriesCreated: 0,
      filesRelocated: 0,
      errors: [],
      backupPath: this.backupDir
    }

    try {
      console.log('🚀 パラソル設計MD構造移行開始')
      console.log(`📁 対象パス: ${this.baseDocsPath}`)
      console.log(`🗂️  バックアップ先: ${this.backupDir}`)
      console.log(`🧪 ドライランモード: ${this.dryRun}`)

      // Step 1: バックアップ作成
      if (!this.dryRun) {
        await this.createBackup()
        console.log('✅ バックアップ作成完了')
      }

      // Step 2: 移行対象のオペレーションを検索
      const operationPaths = this.findOperationsToMigrate()
      console.log(`📋 移行対象オペレーション: ${operationPaths.length}件`)

      // Step 3: 各オペレーションの移行
      for (const operationPath of operationPaths) {
        try {
          const migrated = await this.migrateOperation(operationPath)
          if (migrated) {
            result.operationsProcessed++
            console.log(`✅ 移行完了: ${path.basename(operationPath)}`)
          }
        } catch (error) {
          const errorMsg = `❌ 移行エラー (${path.basename(operationPath)}): ${error}`
          result.errors.push(errorMsg)
          console.error(errorMsg)
        }
      }

      result.success = result.errors.length === 0
      console.log(`🎉 移行処理完了: ${result.operationsProcessed}/${operationPaths.length} オペレーション`)

    } catch (error) {
      const errorMsg = `💥 移行処理中に致命的エラー: ${error}`
      result.errors.push(errorMsg)
      console.error(errorMsg)
    }

    return result
  }

  private async createBackup(): Promise<void> {
    // バックアップディレクトリ作成
    fs.mkdirSync(this.backupDir, { recursive: true })

    // パラソルドキュメント全体をバックアップ
    await this.copyDirectory(this.baseDocsPath, path.join(this.backupDir, 'original-docs'))

    // バックアップ情報ファイル作成
    const backupInfo = {
      timestamp: new Date().toISOString(),
      originalPath: this.baseDocsPath,
      migrationVersion: '1.0.0',
      description: 'パラソル設計MD構造1対1関係強制移行前バックアップ'
    }
    fs.writeFileSync(
      path.join(this.backupDir, 'backup-info.json'),
      JSON.stringify(backupInfo, null, 2)
    )
  }

  private findOperationsToMigrate(): string[] {
    const operations: string[] = []

    const findOperations = (dirPath: string) => {
      if (!fs.existsSync(dirPath)) return

      const items = fs.readdirSync(dirPath, { withFileTypes: true })

      for (const item of items) {
        if (item.isDirectory()) {
          const fullPath = path.join(dirPath, item.name)

          // operationsディレクトリを発見
          if (item.name === 'operations') {
            const operationDirs = fs.readdirSync(fullPath, { withFileTypes: true })
              .filter(d => d.isDirectory())
              .map(d => path.join(fullPath, d.name))

            operations.push(...operationDirs)
          } else {
            // 再帰的に探索
            findOperations(fullPath)
          }
        }
      }
    }

    findOperations(this.baseDocsPath)
    return operations
  }

  private async migrateOperation(operationPath: string): Promise<boolean> {
    const useCasesPath = path.join(operationPath, 'usecases')
    const pagesPath = path.join(operationPath, 'pages')

    // 既に新構造の場合はスキップ
    if (this.isAlreadyNewStructure(operationPath)) {
      console.log(`⏭️  スキップ (既に新構造): ${path.basename(operationPath)}`)
      return false
    }

    // usecasesディレクトリが存在しない場合はスキップ
    if (!fs.existsSync(useCasesPath)) {
      console.log(`⏭️  スキップ (usecasesなし): ${path.basename(operationPath)}`)
      return false
    }

    // ユースケースとページのマッピングを作成
    const mappings = this.createUseCasePageMappings(useCasesPath, pagesPath)

    if (mappings.length === 0) {
      console.log(`⏭️  スキップ (ユースケースなし): ${path.basename(operationPath)}`)
      return false
    }

    // 新構造ディレクトリの作成とファイル移動
    for (const mapping of mappings) {
      await this.createNewUseCaseDirectory(operationPath, mapping)
    }

    // 古いusecasesとpagesディレクトリを削除
    if (!this.dryRun) {
      if (fs.existsSync(pagesPath)) {
        fs.rmSync(pagesPath, { recursive: true, force: true })
      }
      // 古いusecasesディレクトリ内のMDファイルを削除（ディレクトリ自体は残す）
      this.cleanupOldUseCasesDirectory(useCasesPath)
    }

    return true
  }

  private isAlreadyNewStructure(operationPath: string): boolean {
    const useCasesPath = path.join(operationPath, 'usecases')

    if (!fs.existsSync(useCasesPath)) return false

    // usecasesディレクトリ内にサブディレクトリが存在し、
    // そのサブディレクトリにusecase.mdとpage.mdがあれば新構造
    const items = fs.readdirSync(useCasesPath, { withFileTypes: true })
    const subDirs = items.filter(item => item.isDirectory())

    if (subDirs.length === 0) return false

    // 最初のサブディレクトリをチェック
    const firstSubDir = path.join(useCasesPath, subDirs[0].name)
    return fs.existsSync(path.join(firstSubDir, 'usecase.md')) &&
           fs.existsSync(path.join(firstSubDir, 'page.md'))
  }

  private createUseCasePageMappings(useCasesPath: string, pagesPath: string): UseCasePageMapping[] {
    const operationPath = path.dirname(useCasesPath)

    // Step 1: ビジネスオペレーション仕様から理想構造を生成
    const idealStructure = this.generateIdealStructureFromOperation(operationPath)

    if (idealStructure.length > 0) {
      console.log(`  📋 ビジネスオペレーション仕様から${idealStructure.length}個のユースケース・ページペアを生成`)
      return this.mapIdealStructureToExistingFiles(idealStructure, useCasesPath, pagesPath)
    }

    // Step 2: 理想構造がない場合は従来の方法を使用
    console.log(`  ⚠️  ビジネスオペレーション仕様が見つからないため、既存ファイルベースで処理`)
    return this.createMappingsFromExistingFiles(useCasesPath, pagesPath)
  }

  private generateIdealStructureFromOperation(operationPath: string): Array<{useCaseName: string, pageTitle: string, directoryName: string}> {
    const operationFile = path.join(operationPath, 'operation.md')

    if (!fs.existsSync(operationFile)) {
      return []
    }

    const operationContent = fs.readFileSync(operationFile, 'utf-8')
    const operationName = path.basename(operationPath)

    // ビジネスオペレーションからプロセスフローを抽出
    const processSteps = this.extractProcessStepsFromOperation(operationContent)

    // プロセスステップからユースケース・ページペアを生成
    return this.generateUseCasePagePairsFromSteps(operationName, processSteps)
  }

  private extractProcessStepsFromOperation(operationContent: string): string[] {
    const steps: string[] = []

    // プロセスフローセクションを検索
    const processFlowMatch = operationContent.match(/## プロセスフロー[\s\S]*?(?=##|$)/i)
    if (!processFlowMatch) {
      return steps
    }

    const processFlowSection = processFlowMatch[0]

    // 番号付きリストのステップを抽出
    const stepMatches = processFlowSection.match(/^\d+\.\s+(.+)$/gm)
    if (stepMatches) {
      steps.push(...stepMatches.map(match => match.replace(/^\d+\.\s+/, '').trim()))
    }

    return steps
  }

  private generateUseCasePagePairsFromSteps(operationName: string, processSteps: string[]): Array<{useCaseName: string, pageTitle: string, directoryName: string}> {
    const pairs: Array<{useCaseName: string, pageTitle: string, directoryName: string}> = []

    // 一般的なビジネスオペレーションパターンと対応ユースケース
    const operationPatterns: {[key: string]: Array<{useCase: string, page: string, directory: string}>} = {
      'facilitate-communication': [
        { useCase: 'コミュニケーションチャネルを作成する', page: 'コミュニケーションチャネル作成ページ', directory: 'create-communication-channel' },
        { useCase: 'コミュニケーションチャネルを管理する', page: 'コミュニケーションチャネル管理ページ', directory: 'manage-communication-channel' },
        { useCase: 'コミュニケーションを管理する', page: 'コミュニケーション管理ページ', directory: 'moderate-communication' }
      ],
      'register-and-manage-members': [
        { useCase: 'メンバーを登録する', page: 'メンバー登録ページ', directory: 'register-member' },
        { useCase: 'メンバー情報を管理する', page: 'メンバー情報管理ページ', directory: 'manage-member-profile' },
        { useCase: 'メンバーを検索する', page: 'メンバー検索ページ', directory: 'search-members' },
        { useCase: 'メンバーを削除する', page: 'メンバー削除ページ', directory: 'delete-member' }
      ],
      'manage-projects': [
        { useCase: 'プロジェクトを作成する', page: 'プロジェクト作成ページ', directory: 'create-project' },
        { useCase: 'プロジェクトを更新する', page: 'プロジェクト更新ページ', directory: 'update-project' },
        { useCase: 'プロジェクト進捗を監視する', page: 'プロジェクト監視ページ', directory: 'monitor-project-progress' },
        { useCase: 'プロジェクトを完了する', page: 'プロジェクト完了ページ', directory: 'complete-project' }
      ]
    }

    // パターンマッチングによる生成
    if (operationPatterns[operationName]) {
      return operationPatterns[operationName].map(pattern => ({
        useCaseName: pattern.useCase,
        pageTitle: pattern.page,
        directoryName: pattern.directory
      }))
    }

    // パターンがない場合はプロセスステップから推論
    return this.inferUseCasesFromProcessSteps(processSteps)
  }

  private inferUseCasesFromProcessSteps(processSteps: string[]): Array<{useCaseName: string, pageTitle: string, directoryName: string}> {
    const pairs: Array<{useCaseName: string, pageTitle: string, directoryName: string}> = []

    // プロセスステップから動詞を抽出してユースケースに変換
    const actionPatterns = [
      { pattern: /(作成|創成|生成)/, useCase: 'XXXを作成する', page: 'XXX作成ページ', directory: 'create-XXX' },
      { pattern: /(管理|編集|更新)/, useCase: 'XXXを管理する', page: 'XXX管理ページ', directory: 'manage-XXX' },
      { pattern: /(検索|探索|照会)/, useCase: 'XXXを検索する', page: 'XXX検索ページ', directory: 'search-XXX' },
      { pattern: /(削除|除去|消去)/, useCase: 'XXXを削除する', page: 'XXX削除ページ', directory: 'delete-XXX' },
      { pattern: /(承認|認可|許可)/, useCase: 'XXXを承認する', page: 'XXX承認ページ', directory: 'approve-XXX' },
      { pattern: /(送信|配信|通知)/, useCase: 'XXXを送信する', page: 'XXX送信ページ', directory: 'send-XXX' }
    ]

    for (let i = 0; i < processSteps.length; i++) {
      const step = processSteps[i]

      for (const pattern of actionPatterns) {
        if (pattern.pattern.test(step)) {
          const stepNumber = i + 1
          pairs.push({
            useCaseName: `ステップ${stepNumber}: ${step}`,
            pageTitle: `ステップ${stepNumber}実行ページ`,
            directoryName: `step-${stepNumber}-${pattern.directory.replace('XXX', 'action')}`
          })
          break
        }
      }
    }

    return pairs
  }

  private mapIdealStructureToExistingFiles(
    idealStructure: Array<{useCaseName: string, pageTitle: string, directoryName: string}>,
    useCasesPath: string,
    pagesPath: string
  ): UseCasePageMapping[] {
    const mappings: UseCasePageMapping[] = []

    // 既存ファイル一覧を取得
    const existingUseCaseFiles = fs.existsSync(useCasesPath)
      ? fs.readdirSync(useCasesPath).filter(file => file.endsWith('.md'))
      : []

    const existingPageFiles = fs.existsSync(pagesPath)
      ? fs.readdirSync(pagesPath).filter(file => file.endsWith('.md'))
      : []

    for (const ideal of idealStructure) {
      // 理想構造に最も近い既存ファイルを検索
      const bestUseCaseMatch = this.findBestMatchingFile(ideal.useCaseName, existingUseCaseFiles)
      const bestPageMatch = this.findBestMatchingFile(ideal.pageTitle, existingPageFiles)

      // 既存ファイルの内容を読み込み
      const useCaseContent = bestUseCaseMatch
        ? fs.readFileSync(path.join(useCasesPath, bestUseCaseMatch), 'utf-8')
        : this.generateDefaultUseCaseContent(ideal.useCaseName)

      const pageContent = bestPageMatch
        ? fs.readFileSync(path.join(pagesPath, bestPageMatch), 'utf-8')
        : null

      mappings.push({
        useCaseFile: bestUseCaseMatch || `${ideal.directoryName}.md`,
        useCaseContent,
        correspondingPageFile: bestPageMatch,
        pageContent,
        newDirectoryName: ideal.directoryName
      })
    }

    return mappings
  }

  private createMappingsFromExistingFiles(useCasesPath: string, pagesPath: string): UseCasePageMapping[] {
    const mappings: UseCasePageMapping[] = []

    // 従来のロジック（既存ファイルベース）
    const useCaseFiles = fs.readdirSync(useCasesPath).filter(file => file.endsWith('.md'))
    const pageFiles = fs.existsSync(pagesPath)
      ? fs.readdirSync(pagesPath).filter(file => file.endsWith('.md'))
      : []

    for (const useCaseFile of useCaseFiles) {
      const useCaseContent = fs.readFileSync(path.join(useCasesPath, useCaseFile), 'utf-8')
      const correspondingPageFile = this.findCorrespondingPageFile(useCaseFile, pageFiles)
      const pageContent = correspondingPageFile
        ? fs.readFileSync(path.join(pagesPath, correspondingPageFile), 'utf-8')
        : null
      const newDirectoryName = this.generateUseCaseDirectoryName(useCaseFile, useCaseContent)

      mappings.push({
        useCaseFile,
        useCaseContent,
        correspondingPageFile,
        pageContent,
        newDirectoryName
      })
    }

    return mappings
  }

  private findBestMatchingFile(targetName: string, files: string[]): string | null {
    let bestMatch: string | null = null
    let bestScore = 0

    for (const file of files) {
      const fileName = file.replace('.md', '')
      const score = this.calculateSimilarity(targetName.toLowerCase(), fileName.toLowerCase())

      if (score > bestScore) {
        bestScore = score
        bestMatch = file
      }
    }

    return bestScore > 0.3 ? bestMatch : null
  }

  private generateDefaultUseCaseContent(useCaseName: string): string {
    return `# ユースケース: ${useCaseName}

## 基本情報
- **ユースケースID**: UC-AUTO-GEN
- **アクター**: [アクターを記載]
- **概要**: ${useCaseName}の実行を支援するユースケース

## 事前条件
- [前提条件を記載]

## 事後条件
### 成功時
- ${useCaseName}が正常に完了している

### 失敗時
- エラーメッセージが表示されている

## 基本フロー
1. アクターが${useCaseName}の実行を開始する
2. システムが必要な処理を実行する
3. システムが結果を表示する
4. ユースケース完了

## 代替フロー
### 代替フロー1: [条件]
- [代替処理の説明]

## 例外フロー
### 例外1: [エラー条件]
- [エラー処理の説明]

## 特別要件
- **性能**: [性能要件]
- **可用性**: [可用性要件]
- **セキュリティ**: [セキュリティ要件]

---
*このユースケースは1対1構造移行時に自動生成されました。詳細を追加してください。*
`
  }

  private findCorrespondingPageFile(useCaseFile: string, pageFiles: string[]): string | null {
    const useCaseBaseName = useCaseFile.replace('.md', '')

    // 完全一致を探す
    const exactMatch = pageFiles.find(pageFile =>
      pageFile.replace('.md', '').replace('-page', '') === useCaseBaseName
    )
    if (exactMatch) return exactMatch

    // 部分一致を探す
    const partialMatch = pageFiles.find(pageFile => {
      const pageBaseName = pageFile.replace('.md', '').replace('-page', '')
      return this.calculateSimilarity(useCaseBaseName, pageBaseName) > 0.7
    })

    return partialMatch || null
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  private levenshteinDistance(str1: string, str2: string): number {
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

  private generateUseCaseDirectoryName(useCaseFile: string, useCaseContent: string): string {
    // ファイル名からベース名を取得
    let baseName = useCaseFile.replace('.md', '')

    // ユースケース内容からタイトルを抽出
    const titleMatch = useCaseContent.match(/^#\s+ユースケース:\s*(.+)$/m)
    if (titleMatch) {
      const title = titleMatch[1].trim()
      // 日本語タイトルを英語ファイル名に変換
      baseName = this.convertJapaneseToEnglishFileName(title)
    }

    // ケバブケース形式に正規化
    return baseName
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  private convertJapaneseToEnglishFileName(japaneseTitle: string): string {
    // 一般的な日本語→英語変換パターン
    const conversions: { [key: string]: string } = {
      'コミュニケーションチャネルを作成する': 'create-communication-channel',
      'コミュニケーションチャネルを管理する': 'manage-communication-channel',
      'コミュニケーションを管理する': 'moderate-communication',
      'メンバーを登録する': 'register-member',
      'メンバー情報を管理する': 'manage-member-profile',
      'メンバーを検索する': 'search-members',
      'メンバーを削除する': 'delete-member',
      'プロジェクトを作成する': 'create-project',
      'プロジェクトを更新する': 'update-project',
      'プロジェクト進捗を監視する': 'monitor-project-progress',
      'プロジェクトを完了する': 'complete-project'
    }

    return conversions[japaneseTitle] || japaneseTitle
      .replace(/を作成する/, '-create')
      .replace(/を管理する/, '-manage')
      .replace(/を削除する/, '-delete')
      .replace(/を検索する/, '-search')
      .replace(/を更新する/, '-update')
      .replace(/を監視する/, '-monitor')
      .replace(/を完了する/, '-complete')
  }

  private async createNewUseCaseDirectory(operationPath: string, mapping: UseCasePageMapping): Promise<void> {
    const newUseCaseDir = path.join(operationPath, 'usecases', mapping.newDirectoryName)

    if (this.dryRun) {
      console.log(`  🧪 [DRY RUN] 作成予定: ${newUseCaseDir}`)
      console.log(`  📄 usecase.md: ${mapping.useCaseFile}`)
      console.log(`  📄 page.md: ${mapping.correspondingPageFile || 'NEW CREATE'}`)
      return
    }

    // 新しいユースケースディレクトリを作成
    fs.mkdirSync(newUseCaseDir, { recursive: true })

    // usecase.mdを作成
    fs.writeFileSync(path.join(newUseCaseDir, 'usecase.md'), mapping.useCaseContent)

    // page.mdを作成（対応するページがあればその内容、なければテンプレート）
    const pageContent = mapping.pageContent || this.generateDefaultPageContent(mapping.useCaseContent)
    fs.writeFileSync(path.join(newUseCaseDir, 'page.md'), pageContent)
  }

  private generateDefaultPageContent(useCaseContent: string): string {
    // ユースケース内容からページ名を推定
    const titleMatch = useCaseContent.match(/^#\s+ユースケース:\s*(.+)$/m)
    const useCaseTitle = titleMatch ? titleMatch[1].trim() : 'ユースケース'

    const pageTitle = useCaseTitle.replace('ユースケース:', 'ページ定義:').replace(/する$/, 'ページ')

    return `# ${pageTitle}

## 画面の目的
このページは${useCaseTitle}の実行をサポートする画面です。

## 利用者
- **主要利用者**: ${useCaseTitle}を実行するユーザー

## 画面構成

### メインコンテンツ部
- ${useCaseTitle}の実行に必要な機能を提供

## アクション・操作

### 主要アクション
- **実行**: ${useCaseTitle}を実行する

## 画面の振る舞い
- ユーザーの操作に応じて適切なフィードバックを提供

## 画面遷移

### 遷移元画面
- [前画面を記載]

### 遷移先画面
- [次画面を記載]

---
*このページ定義は1対1構造移行時に自動生成されました。必要に応じて詳細を追加してください。*
`
  }

  private cleanupOldUseCasesDirectory(useCasesPath: string): void {
    // usecasesディレクトリ内のMDファイルのみを削除
    const items = fs.readdirSync(useCasesPath)

    for (const item of items) {
      const itemPath = path.join(useCasesPath, item)
      const stat = fs.statSync(itemPath)

      if (stat.isFile() && item.endsWith('.md')) {
        fs.unlinkSync(itemPath)
      }
    }
  }

  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.promises.mkdir(dest, { recursive: true })

    const items = await fs.promises.readdir(src, { withFileTypes: true })

    for (const item of items) {
      const srcPath = path.join(src, item.name)
      const destPath = path.join(dest, item.name)

      if (item.isDirectory()) {
        await this.copyDirectory(srcPath, destPath)
      } else {
        await fs.promises.copyFile(srcPath, destPath)
      }
    }
  }
}

// CLI実行
async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const baseDocsPath = path.join(process.cwd(), 'docs/parasol/services')

  console.log('📁 パラソル設計MD構造移行ツール v1.0.0')
  console.log('=' .repeat(50))

  const migrator = new ParasolStructureMigrator(baseDocsPath, dryRun)
  const result = await migrator.migrate()

  console.log('\n📊 移行結果:')
  console.log(`✅ 成功: ${result.success}`)
  console.log(`📋 処理オペレーション: ${result.operationsProcessed}`)
  console.log(`🗂️  作成ディレクトリ: ${result.useCaseDirectoriesCreated}`)
  console.log(`📄 移動ファイル: ${result.filesRelocated}`)
  console.log(`❌ エラー: ${result.errors.length}`)
  console.log(`💾 バックアップ: ${result.backupPath}`)

  if (result.errors.length > 0) {
    console.log('\n❌ エラー詳細:')
    result.errors.forEach(error => console.log(`  ${error}`))
  }

  process.exit(result.success ? 0 : 1)
}

if (require.main === module) {
  main().catch(console.error)
}

export { ParasolStructureMigrator }