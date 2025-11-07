/**
 * API利用仕様に関するユーティリティ関数
 * データベース経由での取得を基本とする
 */

import { PrismaClient } from '@prisma/parasol-client'
import path from 'path'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.join(process.cwd(), 'prisma/parasol-service/data/parasol.db')}`
    }
  }
})

/**
 * データベースからAPI利用仕様を取得
 */
export async function getApiUsageFromDatabase(
  serviceName: string,
  capabilityName: string,
  operationName: string,
  usecaseName: string
): Promise<string | null> {
  try {
    const usecase = await prisma.useCase.findFirst({
      where: {
        name: usecaseName,
        operation: {
          name: operationName,
          capability: {
            name: capabilityName,
            service: {
              name: serviceName
            }
          }
        }
      }
    })

    return usecase?.apiUsageDefinition || null
  } catch (_error) {
    console.error('Failed to get API usage from database:', error)
    return null
  }
}

/**
 * データベースにAPI利用仕様を保存
 */
export async function saveApiUsageToDatabase(
  serviceName: string,
  capabilityName: string,
  operationName: string,
  usecaseName: string,
  content: string
): Promise<boolean> {
  try {
    const usecase = await prisma.useCase.findFirst({
      where: {
        name: usecaseName,
        operation: {
          name: operationName,
          capability: {
            name: capabilityName,
            service: {
              name: serviceName
            }
          }
        }
      }
    })

    if (!usecase) {
      console.error('Usecase not found for API usage save')
      return false
    }

    await prisma.useCase.update({
      where: { id: usecase.id },
      data: { apiUsageDefinition: content }
    })

    return true
  } catch (_error) {
    console.error('Failed to save API usage to database:', error)
    return false
  }
}

/**
 * 全ユースケースのAPI利用仕様ステータスを取得
 */
export async function getApiUsageStatus() {
  try {
    const usecases = await prisma.useCase.findMany({
      include: {
        operation: {
          include: {
            capability: {
              include: {
                service: true
              }
            }
          }
        }
      }
    })

    const totalUsecases = usecases.length
    const withApiUsage = usecases.filter(uc => uc.apiUsageDefinition && uc.apiUsageDefinition.trim().length > 0).length
    const withoutApiUsage = totalUsecases - withApiUsage

    return {
      totalUsecases,
      withApiUsage,
      withoutApiUsage,
      coverageRate: totalUsecases > 0 ? (withApiUsage / totalUsecases) * 100 : 0,
      usecases: usecases.map(uc => ({
        id: uc.id,
        name: uc.name,
        displayName: uc.displayName,
        serviceName: uc.operation.capability?.service.name || 'unknown',
        capabilityName: uc.operation.capability?.name || 'unknown',
        operationName: uc.operation.name,
        hasApiUsage: Boolean(uc.apiUsageDefinition && uc.apiUsageDefinition.trim().length > 0),
        apiUsageLength: uc.apiUsageDefinition?.length || 0
      }))
    }
  } catch (_error) {
    console.error('Failed to get API usage status:', error)
    return {
      totalUsecases: 0,
      withApiUsage: 0,
      withoutApiUsage: 0,
      coverageRate: 0,
      usecases: []
    }
  }
}

/**
 * ファイルパス構築（参照用のみ）
 */
export function buildApiUsageFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/api-usage.md`;
}

export function buildUsecaseFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/usecase.md`;
}

export function buildPageFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/page.md`;
}