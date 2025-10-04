import { NextResponse } from 'next/server'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import fs from 'fs/promises'
import path from 'path'
// TODO: Issue #103 - パーサーファイルの実装待ち
// import {
//   parseDomainLanguage,
//   stringifyParsedData as stringifyDomainLanguage
// } from '@/lib/parasol/parsers/domain-language-parser'
// import {
//   parseApiSpecification,
//   stringifyParsedData as stringifyApiSpec
// } from '@/lib/parasol/parsers/api-specification-parser'
// import {
//   parseDatabaseDesign,
//   stringifyParsedData as stringifyDbDesign
// } from '@/lib/parasol/parsers/database-design-parser'
// import {
//   parseIntegrationSpecification,
//   stringifyParsedData as stringifyIntegrationSpec
// } from '@/lib/parasol/parsers/integration-specification-parser'

const parasolDb = new ParasolPrismaClient()

interface ServiceMetadata {
  name: string
  displayName: string
  description: string
}

interface CapabilityMetadata {
  name: string
  displayName: string
  category: string
}

interface OperationMetadata {
  name: string
  displayName: string
  pattern: string
}

// MDファイルからメタデータを抽出
function extractMetadata(content: string, type: 'service' | 'capability' | 'operation') {
  const lines = content.split('\n')
  const metadata: any = {}

  // タイトルを抽出（最初の#行）
  const titleLine = lines.find(line => line.startsWith('# '))
  if (titleLine) {
    metadata.displayName = titleLine.replace('# ', '').trim()
  }

  // メタデータセクションを探す
  if (type === 'service') {
    const nameMatch = content.match(/\*\*名前\*\*:\s*(.+)/i)
    const descMatch = content.match(/\*\*説明\*\*:\s*(.+)/i)

    if (nameMatch) metadata.name = nameMatch[1].trim()
    if (descMatch) metadata.description = descMatch[1].trim()
  } else if (type === 'operation') {
    const patternMatch = content.match(/\*\*パターン\*\*:\s*(.+)/i)
    if (patternMatch) metadata.pattern = patternMatch[1].trim()
  }

  return metadata
}

// ディレクトリを再帰的に読み込んで構造化データを生成
async function scanParasolDocs(basePath: string) {
  const servicesPath = path.join(basePath, 'docs', 'parasol', 'services')
  const services = []

  try {
    const serviceDirs = await fs.readdir(servicesPath)

    for (const serviceDir of serviceDirs) {
      const servicePath = path.join(servicesPath, serviceDir)
      const serviceFilePath = path.join(servicePath, 'service.md')

      try {
        // サービスMDファイルを読み込み
        const serviceContent = await fs.readFile(serviceFilePath, 'utf-8')
        const cleanServiceContent = serviceContent.replace(/\x1b\[[0-9;]*m/g, '')
        const serviceMetadata = extractMetadata(cleanServiceContent, 'service')

        // ドメイン言語、API仕様、DB設計、統合仕様を読み込み
        let domainLanguageContent = ''
        let apiSpec = ''
        let dbDesign = ''
        let integrationSpec = ''

        try {
          domainLanguageContent = await fs.readFile(path.join(servicePath, 'domain-language.md'), 'utf-8')
        } catch (error) {
          console.log(`ドメイン言語なし: ${serviceDir}`)
        }

        try {
          apiSpec = await fs.readFile(path.join(servicePath, 'api-specification.md'), 'utf-8')
        } catch (error) {
          console.log(`API仕様なし: ${serviceDir}`)
        }

        try {
          dbDesign = await fs.readFile(path.join(servicePath, 'database-design.md'), 'utf-8')
        } catch (error) {
          console.log(`DB設計なし: ${serviceDir}`)
        }

        try {
          integrationSpec = await fs.readFile(path.join(servicePath, 'integration-specification.md'), 'utf-8')
        } catch (error) {
          console.log(`統合仕様なし: ${serviceDir}`)
        }

        const service = {
          name: serviceMetadata.name || serviceDir,
          displayName: serviceMetadata.displayName || serviceDir,
          description: serviceMetadata.description || '',
          content: cleanServiceContent, // クリーンなコンテンツを使用
          domainLanguage: domainLanguageContent,
          apiSpecification: apiSpec,
          databaseDesign: dbDesign,
          integrationSpecification: integrationSpec,
          capabilities: [] as any[]
        }

        // ケーパビリティを読み込み
        const capabilitiesPath = path.join(servicePath, 'capabilities')
        try {
          const capabilityDirs = await fs.readdir(capabilitiesPath)

          for (const capabilityDir of capabilityDirs) {
            const capabilityPath = path.join(capabilitiesPath, capabilityDir)
            const capabilityFilePath = path.join(capabilityPath, 'capability.md')

            try {
              const capabilityContent = await fs.readFile(capabilityFilePath, 'utf-8')
              const capabilityMetadata = extractMetadata(capabilityContent, 'capability')

              const capability = {
                name: capabilityDir,
                displayName: capabilityMetadata.displayName || capabilityDir,
                content: capabilityContent,
                operations: [] as any[]
              }

              // オペレーションを読み込み
              const operationsPath = path.join(capabilityPath, 'operations')
              try {
                const operationDirs = await fs.readdir(operationsPath)

                for (const operationDir of operationDirs) {
                  const operationPath = path.join(operationsPath, operationDir)
                  const operationFilePath = path.join(operationPath, 'operation.md')

                  try {
                    const operationContent = await fs.readFile(operationFilePath, 'utf-8')
                    // ANSIエスケープシーケンスを除去（bat/catコマンドの装飾を除去）
                    const cleanContent = operationContent.replace(/\x1b\[[0-9;]*m/g, '')
                    const operationMetadata = extractMetadata(cleanContent, 'operation')

                    // ページ定義とテスト定義を読み込み
                    const pages = []
                    const tests = []

                    // pages ディレクトリ内のMDファイルを読み込み
                    const pagesPath = path.join(operationPath, 'pages')
                    try {
                      const pageFiles = await fs.readdir(pagesPath)
                      for (const pageFile of pageFiles) {
                        if (pageFile.endsWith('.md')) {
                          const pageContent = await fs.readFile(path.join(pagesPath, pageFile), 'utf-8')
                          pages.push({
                            name: pageFile.replace('.md', ''),
                            content: pageContent
                          })
                        }
                      }
                    } catch (error) {
                      // ページディレクトリがない場合は無視
                    }

                    // tests ディレクトリ内のMDファイルを読み込み
                    const testsPath = path.join(operationPath, 'tests')
                    try {
                      const testFiles = await fs.readdir(testsPath)
                      for (const testFile of testFiles) {
                        if (testFile.endsWith('.md')) {
                          const testContent = await fs.readFile(path.join(testsPath, testFile), 'utf-8')
                          tests.push({
                            name: testFile.replace('.md', ''),
                            content: testContent
                          })
                        }
                      }
                    } catch (error) {
                      // テストディレクトリがない場合は無視
                    }

                    capability.operations.push({
                      name: operationDir,
                      displayName: operationMetadata.displayName || operationDir,
                      pattern: operationMetadata.pattern || 'Workflow',
                      content: cleanContent, // クリーンなコンテンツを使用
                      pages: pages,
                      tests: tests
                    })
                  } catch (error) {
                    console.log(`オペレーションファイルなし: ${operationFilePath}`)
                  }
                }
              } catch (error) {
                console.log(`オペレーションディレクトリなし: ${operationsPath}`)
              }

              service.capabilities.push(capability)
            } catch (error) {
              console.log(`ケーパビリティファイルなし: ${capabilityFilePath}`)
            }
          }
        } catch (error) {
          console.log(`ケーパビリティディレクトリなし: ${capabilitiesPath}`)
        }

        services.push(service)
      } catch (error) {
        console.log(`サービスファイルなし: ${serviceFilePath}`)
      }
    }
  } catch (error) {
    console.error('ディレクトリ読み込みエラー:', error)
  }

  return services
}

// データベースにインポート
async function importToDatabase(services: any[]) {
  let importedServices = 0
  let importedCapabilities = 0
  let importedOperations = 0
  let importedPages = 0
  let importedTests = 0

  // トランザクション内で処理
  await parasolDb.$transaction(async (tx) => {
    // 既存データをクリア
    await tx.businessOperation.deleteMany()
    await tx.businessCapability.deleteMany()
    await tx.service.deleteMany()

    for (const serviceData of services) {
      // サービスを作成
      const service = await tx.service.create({
        data: {
          name: serviceData.name,
          displayName: serviceData.displayName,
          description: serviceData.description,
          domainLanguage: JSON.stringify({ content: serviceData.content }),
          apiSpecification: serviceData.apiSpecification ? JSON.stringify({ content: serviceData.apiSpecification }) : JSON.stringify({ endpoints: [] }),
          dbSchema: serviceData.databaseDesign ? JSON.stringify({ content: serviceData.databaseDesign }) : JSON.stringify({ tables: [] }),
          serviceDescription: serviceData.content,  // service.mdの全内容をserviceDescriptionに保存
          domainLanguageDefinition: serviceData.domainLanguage || '',  // domain-language.mdをdomainLanguageDefinitionに保存
          apiSpecificationDefinition: serviceData.apiSpecification || '',
          databaseDesignDefinition: serviceData.databaseDesign || ''
        }
      })
      importedServices++

      // TODO: Issue #103 - パーサーファイルの実装後に有効化
      // 新しいドキュメントモデルを作成（Issue #103対応）
      /*
      // 1. ドメイン言語ドキュメント
      if (serviceData.domainLanguage) {
        try {
          const parsed = parseDomainLanguage(serviceData.domainLanguage)
          const stringified = stringifyDomainLanguage(parsed)

          await tx.domainLanguage.create({
            data: {
              serviceId: service.id,
              version: parsed.version,
              content: serviceData.domainLanguage,
              entities: stringified.entities,
              valueObjects: stringified.valueObjects,
              aggregates: stringified.aggregates,
              domainServices: stringified.domainServices,
              domainEvents: stringified.domainEvents,
              businessRules: stringified.businessRules
            }
          })
        } catch (error) {
          console.error(`ドメイン言語パースエラー (${serviceData.name}):`, error)
        }
      }

      // 2. API仕様ドキュメント
      if (serviceData.apiSpecification) {
        try {
          const parsed = parseApiSpecification(serviceData.apiSpecification)
          const stringified = stringifyApiSpec(parsed)

          await tx.apiSpecification.create({
            data: {
              serviceId: service.id,
              version: parsed.version,
              baseUrl: parsed.baseUrl,
              authMethod: parsed.authMethod,
              content: serviceData.apiSpecification,
              endpoints: stringified.endpoints,
              errorCodes: stringified.errorCodes,
              rateLimits: stringified.rateLimits
            }
          })
        } catch (error) {
          console.error(`API仕様パースエラー (${serviceData.name}):`, error)
        }
      }

      // 3. データベース設計ドキュメント
      if (serviceData.databaseDesign) {
        try {
          const parsed = parseDatabaseDesign(serviceData.databaseDesign)
          const stringified = stringifyDbDesign(parsed)

          await tx.databaseDesign.create({
            data: {
              serviceId: service.id,
              dbms: parsed.dbms,
              content: serviceData.databaseDesign,
              tables: stringified.tables,
              erDiagram: stringified.erDiagram || null,
              indexes: stringified.indexes,
              constraints: stringified.constraints
            }
          })
        } catch (error) {
          console.error(`DB設計パースエラー (${serviceData.name}):`, error)
        }
      }

      // 4. 統合仕様ドキュメント
      if (serviceData.integrationSpecification) {
        try {
          const parsed = parseIntegrationSpecification(serviceData.integrationSpecification)
          const stringified = stringifyIntegrationSpec(parsed)

          await tx.integrationSpecification.create({
            data: {
              serviceId: service.id,
              content: serviceData.integrationSpecification,
              dependencies: stringified.dependencies,
              providedEvents: stringified.providedEvents,
              consumedEvents: stringified.consumedEvents,
              syncApis: stringified.syncApis,
              asyncPatterns: stringified.asyncPatterns
            }
          })
        } catch (error) {
          console.error(`統合仕様パースエラー (${serviceData.name}):`, error)
        }
      }
      */

      // ケーパビリティを作成
      for (const capabilityData of serviceData.capabilities) {
        const capability = await tx.businessCapability.create({
          data: {
            serviceId: service.id,
            name: capabilityData.name,
            displayName: capabilityData.displayName,
            description: `${capabilityData.displayName}の実現`,
            category: 'Core',
            definition: capabilityData.content
          }
        })
        importedCapabilities++

        // オペレーションを作成
        for (const operationData of capabilityData.operations) {
          const operation = await tx.businessOperation.create({
            data: {
              serviceId: service.id,
              capabilityId: capability.id,
              name: operationData.name,
              displayName: operationData.displayName,
              pattern: operationData.pattern,
              goal: `${operationData.displayName}を実現する`,
              design: operationData.content,
              operations: JSON.stringify([]),
              businessStates: JSON.stringify([]),
              roles: JSON.stringify([]),
              useCases: JSON.stringify([]),
              uiDefinitions: JSON.stringify([]),
              testCases: JSON.stringify([]),
              robustnessModel: JSON.stringify({})
            }
          })
          importedOperations++

          // ページ定義とテスト定義は現時点でスキップ（スキーマの調整が必要）
          // TODO: UseCaseモデルを作成した後で、ページ定義とテスト定義を関連付ける
        }
      }
    }
  })

  return { importedServices, importedCapabilities, importedOperations, importedPages, importedTests }
}

export async function POST(request: Request) {
  try {
    // プロジェクトのルートパスを取得
    const rootPath = process.cwd()

    // MDファイルをスキャン
    const services = await scanParasolDocs(rootPath)

    if (services.length === 0) {
      return NextResponse.json(
        { error: 'MDファイルが見つかりませんでした' },
        { status: 404 }
      )
    }

    // データベースにインポート
    const result = await importToDatabase(services)

    return NextResponse.json({
      success: true,
      message: 'インポート完了',
      ...result,
      details: services.map(s => ({
        service: s.displayName,
        capabilities: s.capabilities.length,
        operations: s.capabilities.reduce((sum: number, c: any) => sum + c.operations.length, 0)
      }))
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'インポート中にエラーが発生しました', details: error },
      { status: 500 }
    )
  } finally {
    await parasolDb.$disconnect()
  }
}

// MDファイルの存在確認用GET
export async function GET() {
  try {
    const rootPath = process.cwd()
    const services = await scanParasolDocs(rootPath)

    return NextResponse.json({
      success: true,
      servicesFound: services.length,
      services: services.map(s => ({
        name: s.name,
        displayName: s.displayName,
        capabilities: s.capabilities.length,
        operations: s.capabilities.reduce((sum: number, c: any) => sum + c.operations.length, 0)
      }))
    })
  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { error: 'スキャン中にエラーが発生しました', details: error },
      { status: 500 }
    )
  }
}