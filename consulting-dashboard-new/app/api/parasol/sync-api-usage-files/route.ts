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
    const { action = 'sync_all' } = body

    let syncedFiles: string[] = []
    let errors: string[] = []
    let stats = {
      found: 0,
      synced: 0,
      errors: 0,
      skipped: 0
    }

    if (action === 'sync_all') {
      // 全API利用仕様ファイルの同期
      const apiUsageFiles = await findAllApiUsageFiles()
      stats.found = apiUsageFiles.length

      for (const fileInfo of apiUsageFiles) {
        try {
          const content = await fs.readFile(fileInfo.fullPath, 'utf-8')

          // ユースケースIDの取得
          const usecase = await prisma.useCase.findFirst({
            where: {
              name: fileInfo.usecaseName,
              operation: {
                name: fileInfo.operationName,
                capability: {
                  name: fileInfo.capabilityName,
                  service: {
                    name: fileInfo.serviceName
                  }
                }
              }
            }
          })

          if (!usecase) {
            errors.push(`ユースケースが見つからない: ${fileInfo.relativePath}`)
            stats.errors++
            continue
          }

          // データベースに同期
          await prisma.useCase.update({
            where: { id: usecase.id },
            data: {
              apiUsageDefinition: content
            }
          })

          syncedFiles.push(fileInfo.relativePath)
          stats.synced++

        } catch (error) {
          console.error(`Failed to sync ${fileInfo.relativePath}:`, error)
          errors.push(`${fileInfo.relativePath}: ${error}`)
          stats.errors++
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${stats.synced}個のAPI利用仕様ファイルをデータベースに同期しました`,
      stats,
      syncedFiles,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('API usage files sync error:', error)
    return NextResponse.json({
      success: false,
      error: 'API利用仕様ファイルの同期に失敗しました',
      details: error
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

async function findAllApiUsageFiles() {
  const files = []
  const docsPath = path.join(process.cwd(), 'docs', 'parasol', 'services')

  try {
    const services = await fs.readdir(docsPath)

    for (const serviceName of services) {
      const servicePath = path.join(docsPath, serviceName)
      const serviceStats = await fs.stat(servicePath)

      if (!serviceStats.isDirectory()) continue

      const capabilitiesPath = path.join(servicePath, 'capabilities')

      try {
        const capabilities = await fs.readdir(capabilitiesPath)

        for (const capabilityName of capabilities) {
          const capabilityPath = path.join(capabilitiesPath, capabilityName)
          const capabilityStats = await fs.stat(capabilityPath)

          if (!capabilityStats.isDirectory()) continue

          const operationsPath = path.join(capabilityPath, 'operations')

          try {
            const operations = await fs.readdir(operationsPath)

            for (const operationName of operations) {
              const operationPath = path.join(operationsPath, operationName)
              const operationStats = await fs.stat(operationPath)

              if (!operationStats.isDirectory()) continue

              const usecasesPath = path.join(operationPath, 'usecases')

              try {
                const usecases = await fs.readdir(usecasesPath)

                for (const usecaseName of usecases) {
                  const usecasePath = path.join(usecasesPath, usecaseName)
                  const usecaseStats = await fs.stat(usecasePath)

                  if (!usecaseStats.isDirectory()) continue

                  const apiUsageFile = path.join(usecasePath, 'api-usage.md')

                  try {
                    await fs.access(apiUsageFile)

                    files.push({
                      serviceName,
                      capabilityName,
                      operationName,
                      usecaseName,
                      fullPath: apiUsageFile,
                      relativePath: `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/api-usage.md`
                    })
                  } catch {
                    // ファイルが存在しない場合はスキップ
                  }
                }
              } catch {
                // usecasesディレクトリが存在しない場合はスキップ
              }
            }
          } catch {
            // operationsディレクトリが存在しない場合はスキップ
          }
        }
      } catch {
        // capabilitiesディレクトリが存在しない場合はスキップ
      }
    }
  } catch {
    // docsディレクトリが存在しない場合はスキップ
  }

  return files
}