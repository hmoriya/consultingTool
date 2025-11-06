import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/parasol-client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.join(process.cwd(), 'prisma/parasol-service/data/parasol.db')}`
    }
  }
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, files } = body // action または files パラメータ

    // dx-api-usage.mdテンプレートの読み込み
    const templatePath = path.join(process.cwd(), 'templates', 'dx-api-usage.md')
    const template = await fs.readFile(templatePath, 'utf-8')

    const createdFiles: string[] = []
    const errors: string[] = []

    if (action === 'create_all_missing' || files === 'all') {
      // 全不足ファイルの作成
      const missingFiles = await getMissingApiUsageFiles()

      for (const missingFile of missingFiles) {
        try {
          const filePath = path.join(process.cwd(), missingFile.filePath)
          const content = await generateApiUsageContent(template, missingFile)

          // ディレクトリの作成
          await fs.mkdir(path.dirname(filePath), { recursive: true })

          // ファイルの作成
          await fs.writeFile(filePath, content, 'utf-8')
          createdFiles.push(missingFile.filePath)

        } catch (error) {
          console.error(`Failed to create ${missingFile.filePath}:`, error)
          errors.push(`${missingFile.filePath}: ${error}`)
        }
      }
    } else if (Array.isArray(files)) {
      // 指定されたファイルのみ作成
      for (const filePath of files) {
        try {
          const fullPath = path.join(process.cwd(), filePath)
          const missingFile = await getMissingFileInfo(filePath)
          const content = await generateApiUsageContent(template, missingFile)

          // ディレクトリの作成
          await fs.mkdir(path.dirname(fullPath), { recursive: true })

          // ファイルの作成
          await fs.writeFile(fullPath, content, 'utf-8')
          createdFiles.push(filePath)

        } catch (error) {
          console.error(`Failed to create ${filePath}:`, error)
          errors.push(`${filePath}: ${error}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdFiles.length}個のAPI利用仕様ファイルを作成しました`,
      createdFiles,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('API usage files creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'API利用仕様ファイルの作成に失敗しました'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

async function getMissingApiUsageFiles() {
  const missingFiles = []
  const docsPath = path.join(process.cwd(), 'docs', 'parasol', 'services')

  console.log('Starting getMissingApiUsageFiles search...')
  console.log('Docs path:', docsPath)

  const services = await prisma.service.findMany({
    where: {
      name: {
        not: 'parasol-service'
      }
    },
    include: {
      capabilities: {
        include: {
          businessOperations: {
            include: {
              useCases: true
            }
          }
        }
      }
    }
  })

  console.log(`Found ${services.length} services to check`)

  for (const service of services) {
    console.log(`Checking service: ${service.name} (${service.capabilities.length} capabilities)`)

    for (const capability of service.capabilities) {
      console.log(`  Checking capability: ${capability.name} (${capability.businessOperations.length} operations)`)

      for (const operation of capability.businessOperations) {
        console.log(`    Checking operation: ${operation.name} (${operation.useCases?.length || 0} usecases)`)

        for (const usecase of operation.useCases || []) {
          const apiUsagePath = path.join(
            docsPath,
            service.name,
            'capabilities',
            capability.name,
            'operations',
            operation.name,
            'usecases',
            usecase.name,
            'api-usage.md'
          )

          console.log(`      Checking usecase: ${usecase.name}`)
          console.log(`        Expected path: ${apiUsagePath}`)

          try {
            await fs.access(apiUsagePath)
            console.log(`        ✅ File exists`)
          } catch (error) {
            console.log(`        ❌ File missing`)
            missingFiles.push({
              serviceName: service.name,
              serviceDisplayName: service.displayName,
              capabilityName: capability.name,
              operationName: operation.name,
              usecaseName: usecase.name,
              usecaseDisplayName: usecase.displayName,
              filePath: `docs/parasol/services/${service.name}/capabilities/${capability.name}/operations/${operation.name}/usecases/${usecase.name}/api-usage.md`
            })
          }
        }
      }
    }
  }

  console.log(`Found ${missingFiles.length} missing API usage files`)
  return missingFiles
}

async function getMissingFileInfo(filePath: string) {
  // ファイルパスから情報を抽出
  const pathParts = filePath.split('/')
  const serviceName = pathParts[3]
  const capabilityName = pathParts[5]
  const operationName = pathParts[7]
  const usecaseName = pathParts[9]

  // データベースから詳細情報を取得
  const service = await prisma.service.findUnique({
    where: { name: serviceName }
  })

  const usecase = await prisma.useCase.findFirst({
    where: { name: usecaseName },
    include: {
      operation: {
        include: {
          capability: true
        }
      }
    }
  })

  return {
    serviceName,
    serviceDisplayName: service?.displayName || serviceName,
    capabilityName,
    operationName,
    usecaseName,
    usecaseDisplayName: usecase?.displayName || usecaseName,
    filePath
  }
}

interface FileInfo {
  serviceName: string
  serviceDisplayName: string
  capabilityName: string
  capabilityDisplayName: string
  operationName: string
  operationDisplayName: string
  usecaseName: string
  usecaseDisplayName: string
}

async function generateApiUsageContent(template: string, fileInfo: FileInfo): Promise<string> {
  // テンプレートの動的置換
  let content = template

  // ユースケース名の置換
  content = content.replace(/\[ユースケース名\]/g, fileInfo.usecaseDisplayName || fileInfo.usecaseName)

  // サービス固有の置換
  const serviceSpecificContent = getServiceSpecificContent(fileInfo.serviceName, fileInfo.usecaseName)

  // Issue #146対応のコメントを追加
  const header = `# API利用仕様: ${fileInfo.usecaseDisplayName || fileInfo.usecaseName}

<!--
このファイルはIssue #146 API仕様WHAT/HOW分離統一化の一環で自動生成されました
WHAT（何ができるか）: services/${fileInfo.serviceName}/api/api-specification.md
HOW（どう使うか）: このファイル（実装エンジニア向け）
-->

`

  content = header + content.substring(content.indexOf('\n') + 1)

  // サービス固有の内容で置換
  if (serviceSpecificContent.apiTable) {
    content = content.replace(/\| \[API名1\].*?\n.*?\n.*?\n/s, serviceSpecificContent.apiTable)
  }

  if (serviceSpecificContent.externalServices) {
    content = content.replace(/\| secure-access-service.*?\n.*?\n.*?\n.*?\n.*?\n/s, serviceSpecificContent.externalServices)
  }

  return content
}

function getServiceSpecificContent(serviceName: string, usecaseName: string) {
  // サービス別のAPI利用パターンを定義
  const patterns: Record<string, any> = {
    'secure-access-service': {
      apiTable: `| 認証API | POST /api/auth/authenticate | ユーザー認証実行 | \`username\`, \`password\`, \`mfaToken\` |
| 権限検証API | POST /api/auth/validate-permission | 操作権限確認 | \`userId\`, \`resource\`, \`action\` |
| セッション管理API | GET /api/auth/sessions/{id} | セッション状態確認 | \`sessionId\`, \`includeDetails\` |`,
      externalServices: `| collaboration-facilitation-service | UC-COMM-01: 認証結果を通知する | 認証完了時 | ユーザーへの認証成功通知 |
| project-success-service | UC-PROJ-02: プロジェクトアクセス権限を確認する | アクセス時 | プロジェクト参加権限の検証 |
| secure-access-service | UC-AUTH-03: アクセスログを記録する | 認証完了時 | 認証操作の監査ログ記録 |`
    },
    'collaboration-facilitation-service': {
      apiTable: `| 通知配信API | POST /api/communications/send | 通知メッセージ配信 | \`recipients\`, \`message\`, \`priority\` |
| メッセージ取得API | GET /api/communications/messages | メッセージ一覧取得 | \`userId\`, \`limit\`, \`offset\` |
| 配信状況確認API | GET /api/communications/delivery-status/{id} | 配信状況確認 | \`messageId\`, \`detailed\` |`,
      externalServices: `| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | 通知送信前 | 送信者権限の確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | 通知送信前 | 通知送信権限の確認 |
| project-success-service | UC-PROJ-05: プロジェクト関係者を取得する | 通知送信時 | 通知対象者の特定 |`
    },
    'project-success-service': {
      apiTable: `| プロジェクト作成API | POST /api/projects | 新規プロジェクト作成 | \`name\`, \`description\`, \`teamMembers\` |
| プロジェクト取得API | GET /api/projects/{id} | プロジェクト詳細取得 | \`projectId\`, \`includeMembers\` |
| タスク管理API | PUT /api/projects/{id}/tasks | タスク状況更新 | \`projectId\`, \`taskData\` |`,
      externalServices: `| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | プロジェクト操作前 | ユーザー認証確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | プロジェクト操作前 | プロジェクト操作権限確認 |
| collaboration-facilitation-service | UC-COMM-01: 重要通知を配信する | マイルストーン達成時 | ステークホルダーへの進捗通知 |`
    }
  }

  return patterns[serviceName] || {
    apiTable: `| [API名1] | POST /api/${serviceName}/[resource] | [利用目的の説明] | \`param1\`, \`param2\`, \`param3\` |
| [API名2] | GET /api/${serviceName}/[resource]/{id} | [利用目的の説明] | \`resourceId\`, \`includeDetails\` |
| [API名3] | PUT /api/${serviceName}/[resource]/{id} | [利用目的の説明] | \`resourceId\`, \`updateData\` |`,
    externalServices: `| secure-access-service | UC-AUTH-01: ユーザー認証を実行する | ユースケース開始時 | 認証トークン取得・操作権限確認 |
| secure-access-service | UC-AUTH-02: 権限を検証する | [操作名]実行前 | [権限名]権限の確認 |
| collaboration-facilitation-service | UC-COMM-01: 重要通知を配信する | [処理]完了時 | [対象者]への[内容]通知 |`
  }
}