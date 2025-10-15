import { NextResponse } from 'next/server'
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

interface APIUsageStats {
  totalUsecases: number
  apiUsageFiles: number
  missingFiles: number
  coverageRate: number
  serviceBreakdown: ServiceStats[]
}

interface ServiceStats {
  serviceName: string
  displayName: string
  totalUsecases: number
  apiUsageFiles: number
  coverageRate: number
  priority: 'high' | 'medium' | 'low'
}

interface MissingFile {
  serviceName: string
  operation: string
  usecase: string
  filePath: string
  priority: 'high' | 'medium' | 'low'
}

export async function GET() {
  try {
    // 1. 全ユースケース数を取得
    const totalUsecases = await prisma.useCase.count()

    // 2. サービス別ユースケース統計の取得
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

    // 3. 既存のapi-usage.mdファイルをカウント
    const docsPath = path.join(process.cwd(), 'docs', 'parasol', 'services')
    let totalApiUsageFiles = 0
    const missingFiles: MissingFile[] = []
    const serviceBreakdown: ServiceStats[] = []

    for (const service of services) {
      let serviceUsecaseCount = 0
      let serviceApiUsageCount = 0

      // サービス優先度の決定
      const priority = getPriority(service.name)

      for (const capability of service.capabilities) {
        for (const operation of capability.businessOperations) {
          const usecases = operation.useCases || []
          serviceUsecaseCount += usecases.length

          for (const usecase of usecases) {
            // api-usage.mdファイルの存在確認
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

            try {
              await fs.access(apiUsagePath)
              serviceApiUsageCount++
              totalApiUsageFiles++
            } catch {
              // ファイルが存在しない場合、不足リストに追加
              missingFiles.push({
                serviceName: service.name,
                operation: operation.name,
                usecase: usecase.name,
                filePath: `docs/parasol/services/${service.name}/capabilities/${capability.name}/operations/${operation.name}/usecases/${usecase.name}/api-usage.md`,
                priority
              })
            }
          }
        }
      }

      // サービス別統計
      if (serviceUsecaseCount > 0) {
        serviceBreakdown.push({
          serviceName: service.name,
          displayName: service.displayName,
          totalUsecases: serviceUsecaseCount,
          apiUsageFiles: serviceApiUsageCount,
          coverageRate: serviceUsecaseCount > 0 ? (serviceApiUsageCount / serviceUsecaseCount) * 100 : 0,
          priority
        })
      }
    }

    // 4. 統計データの構築
    const stats: APIUsageStats = {
      totalUsecases,
      apiUsageFiles: totalApiUsageFiles,
      missingFiles: totalUsecases - totalApiUsageFiles,
      coverageRate: totalUsecases > 0 ? (totalApiUsageFiles / totalUsecases) * 100 : 0,
      serviceBreakdown: serviceBreakdown.sort((a, b) => {
        // 優先度順にソート
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
    }

    return NextResponse.json({
      success: true,
      stats,
      missingFiles: missingFiles.sort((a, b) => {
        // 優先度順にソート
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
    })

  } catch (error) {
    console.error('API usage analysis error:', error)
    return NextResponse.json({
      success: false,
      error: 'API利用状況の分析に失敗しました'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

function getPriority(serviceName: string): 'high' | 'medium' | 'low' {
  // Issue #146対応優先度の定義
  switch (serviceName) {
    case 'secure-access-service':
    case 'collaboration-facilitation-service':
      return 'high'
    case 'project-success-service':
    case 'knowledge-co-creation-service':
      return 'medium'
    default:
      return 'low'
  }
}