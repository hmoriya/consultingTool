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
function extractMetadata(content: string, type: 'service' | 'capability' | 'operation' | 'page' | 'usecase' | 'test') {
  const lines = content.split('\n')
  const metadata: any = {}

  // タイトルを抽出（最初の#行）
  const titleLine = lines.find(line => line.startsWith('# ') || line.includes('# '))
  if (titleLine) {
    let title = titleLine.replace('# ', '').trim()

    // ANSIエスケープシーケンスを除去
    title = title.replace(/\x1b\[[0-9;]*m/g, '').replace(/\x1b./g, '').trim()

    // パラソル設計MDファイルの形式に対応（通常コロンと全角コロン両方対応）
    if (type === 'page' && (title.includes('ページ定義：') || title.includes('ページ定義:'))) {
      title = title.replace(/ページ定義[：:]/, '').trim()
    } else if (type === 'usecase' && (title.includes('ユースケース：') || title.includes('ユースケース:'))) {
      title = title.replace(/ユースケース[：:]/, '').trim()
    } else if (type === 'test' && (title.includes('テスト定義：') || title.includes('テスト定義:'))) {
      title = title.replace(/テスト定義[：:]/, '').trim()
    }

    metadata.displayName = title
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

                    // ユースケース、ページ定義、テスト定義を読み込み
                    const usecases = []
                    const pages = []
                    const tests = []

                    // usecases ディレクトリ内の1対1構造（v2.0）またはフラット構造（v1.0）を読み込み
                    const usecasesPath = path.join(operationPath, 'usecases')
                    try {
                      const usecaseEntries = await fs.readdir(usecasesPath, { withFileTypes: true })

                      for (const entry of usecaseEntries) {
                        if (entry.isDirectory()) {
                          // v2.0構造: usecases/[usecase-name]/usecase.md + page.md + api-usage.md
                          const usecaseDirPath = path.join(usecasesPath, entry.name)
                          const usecaseFilePath = path.join(usecaseDirPath, 'usecase.md')
                          const pageFilePath = path.join(usecaseDirPath, 'page.md')
                          const apiUsageFilePath = path.join(usecaseDirPath, 'api-usage.md')

                          try {
                            // ユースケースファイル読み込み
                            const usecaseContent = await fs.readFile(usecaseFilePath, 'utf-8')
                            const usecaseMetadata = extractMetadata(usecaseContent, 'usecase')

                            // API利用仕様ファイル読み込み
                            let apiUsageContent = ''
                            try {
                              apiUsageContent = await fs.readFile(apiUsageFilePath, 'utf-8')
                              console.log(`✅ API利用仕様読み込み成功: ${apiUsageFilePath} (${apiUsageContent.length}文字)`)
                            } catch (apiError) {
                              console.log(`⚠️ API利用仕様なし: ${apiUsageFilePath}`)
                            }

                            const usecaseData = {
                              name: entry.name,
                              displayName: usecaseMetadata.displayName || entry.name,
                              content: usecaseContent,
                              apiUsageDefinition: apiUsageContent
                            }
                            usecases.push(usecaseData)

                            // 対応するページファイル読み込み
                            try {
                              const pageContent = await fs.readFile(pageFilePath, 'utf-8')
                              const pageMetadata = extractMetadata(pageContent, 'page')
                              pages.push({
                                name: entry.name + '-page',
                                displayName: pageMetadata.displayName || (entry.name + 'ページ'),
                                content: pageContent,
                                usecaseName: entry.name // 1対1関係を明示
                              })
                            } catch (pageError) {
                              console.log(`対応ページなし: ${pageFilePath}`)
                            }
                          } catch (usecaseError) {
                            console.log(`ユースケースファイルなし: ${usecaseFilePath}`)
                          }
                        } else if (entry.name.endsWith('.md')) {
                          // v1.0構造: usecases/*.md （フラット構造）
                          const usecaseContent = await fs.readFile(path.join(usecasesPath, entry.name), 'utf-8')
                          const usecaseMetadata = extractMetadata(usecaseContent, 'usecase')
                          usecases.push({
                            name: entry.name.replace('.md', ''),
                            displayName: usecaseMetadata.displayName,
                            content: usecaseContent
                          })
                        }
                      }
                    } catch (error) {
                      // ユースケースディレクトリがない場合は無視
                    }

                    // pages ディレクトリ内のMDファイルを読み込み（v1.0互換性のため）
                    // v2.0では上記でユースケースディレクトリ内のpage.mdが読み込まれる
                    const pagesPath = path.join(operationPath, 'pages')
                    try {
                      const pageFiles = await fs.readdir(pagesPath)
                      for (const pageFile of pageFiles) {
                        if (pageFile.endsWith('.md')) {
                          // v2.0で既に読み込み済みでないことを確認
                          const pageAlreadyLoaded = pages.some(p => p.name === pageFile.replace('.md', '') + '-page')
                          if (!pageAlreadyLoaded) {
                            const pageContent = await fs.readFile(path.join(pagesPath, pageFile), 'utf-8')
                            const pageMetadata = extractMetadata(pageContent, 'page')
                            pages.push({
                              name: pageFile.replace('.md', ''),
                              displayName: pageMetadata.displayName,
                              content: pageContent,
                              usecaseName: null // v1.0形式は1対1関係なし
                            })
                          }
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
                          const testMetadata = extractMetadata(testContent, 'test')
                          tests.push({
                            name: testFile.replace('.md', ''),
                            displayName: testMetadata.displayName,
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
                      usecases: usecases,
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
    // 既存データをクリア（外部キー制約の順序に注意）
    await tx.testDefinition.deleteMany()
    await tx.pageDefinition.deleteMany()
    await tx.useCase.deleteMany()
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
              useCases: JSON.stringify([]), // JSON形式（廃止予定）
              uiDefinitions: JSON.stringify([]),
              testCases: JSON.stringify([]),
              robustnessModel: JSON.stringify({})
            }
          })
          importedOperations++

          // ユースケースが存在する場合とそうでない場合を分けて処理
          // 注意: operations.stepsはユースケースではなくビジネスプロセスのステップなので除外
          const actualUseCases = operationData.usecases && Array.isArray(operationData.usecases)
            ? operationData.usecases.filter((uc: any) => {
                // stepsプロパティを持つオブジェクトはビジネスプロセスステップなのでユースケースから除外
                return uc && typeof uc === 'object' && !('steps' in uc) && uc.name && uc.displayName;
              })
            : [];

          if (actualUseCases && actualUseCases.length > 0) {
            // ユースケースを個別レコードとして保存
            for (const usecaseData of actualUseCases) {
              // displayNameの安全な設定
              const useCaseDisplayName = usecaseData.displayName && typeof usecaseData.displayName === 'string' && usecaseData.displayName.trim()
                ? usecaseData.displayName.trim()
                : (usecaseData.name || 'ユースケース').replace(/-/g, ' ')

              const useCase = await tx.useCase.create({
                data: {
                  operationId: operation.id,
                  name: usecaseData.name || 'usecase',
                  displayName: useCaseDisplayName,
                  definition: usecaseData.content,
                  description: `${usecaseData.name || 'ユースケース'}のユースケース`,
                  actors: JSON.stringify({ primary: 'User', secondary: [] }),
                  preconditions: '[]',
                  postconditions: '[]',
                  basicFlow: '[]',
                  alternativeFlow: '[]',
                  exceptionFlow: '[]',
                  apiUsageDefinition: usecaseData.apiUsageDefinition || ''
                }
              })

              // v2.0: 1対1関係のページを保存
              const relatedPage = operationData.pages?.find(page => page.usecaseName === usecaseData.name)
              if (relatedPage) {
                const displayName = relatedPage.displayName && typeof relatedPage.displayName === 'string' && relatedPage.displayName.trim()
                  ? relatedPage.displayName.trim()
                  : (relatedPage.name || 'ページ').replace(/-/g, ' ')

                await tx.pageDefinition.create({
                  data: {
                    useCaseId: useCase.id,
                    name: relatedPage.name || 'page',
                    displayName: displayName,
                    description: `${usecaseData.name}に対応するページ定義`,
                    content: relatedPage.content || null, // MD形式の内容を保存 (Issue #131)
                    url: `/${relatedPage.name || 'page'}`,
                    layout: '{}',
                    components: '[]',
                    stateManagement: '{}',
                    validations: '[]'
                  }
                })
                importedPages++
              }

              // v1.0互換: usecaseNameがnullのページも関連付け（複数ページ対応）
              const orphanPages = operationData.pages?.filter(page => page.usecaseName === null) || []
              for (const pageData of orphanPages) {
                const displayName = pageData.displayName && typeof pageData.displayName === 'string' && pageData.displayName.trim()
                  ? pageData.displayName.trim()
                  : (pageData.name || 'ページ').replace(/-/g, ' ')

                await tx.pageDefinition.create({
                  data: {
                    useCaseId: useCase.id,
                    name: pageData.name || 'page',
                    displayName: displayName,
                    description: `${pageData.name || 'ページ'}のページ定義`,
                    content: pageData.content || null,
                    url: `/${pageData.name || 'page'}`,
                    layout: '{}',
                    components: '[]',
                    stateManagement: '{}',
                    validations: '[]'
                  }
                })
                importedPages++
              }

              // 各ユースケースに関連するテスト定義を保存
              for (const testData of operationData.tests || []) {
                // displayNameの安全な設定
                const testDisplayName = testData.displayName && typeof testData.displayName === 'string' && testData.displayName.trim()
                  ? testData.displayName.trim()
                  : (testData.name || 'テスト').replace(/-/g, ' ')

                await tx.testDefinition.create({
                  data: {
                    useCaseId: useCase.id,
                    name: testData.name || 'test',
                    displayName: testDisplayName,
                    description: `${testData.name || 'テスト'}のテスト定義`,
                    content: testData.content || null, // MD形式の内容を保存 (Issue #131)
                    testType: 'integration',
                    testCases: '[]',
                    expectedResults: '{}',
                    testData: '{}'
                  }
                })
                importedTests++
              }
            }
          } else {
            // ユースケースがない場合：デフォルトのユースケースを作成してページ定義を関連付け
            if (operationData.pages && operationData.pages.length > 0) {
              const defaultUseCase = await tx.useCase.create({
                data: {
                  operationId: operation.id,
                  name: 'default-usecase',
                  displayName: `${operationData.displayName}のユースケース`,
                  definition: operationData.content,
                  description: `${operationData.displayName}のデフォルトユースケース`,
                  actors: JSON.stringify({ primary: 'User', secondary: [] }),
                  preconditions: '[]',
                  postconditions: '[]',
                  basicFlow: '[]',
                  alternativeFlow: '[]',
                  exceptionFlow: '[]',
                  apiUsageDefinition: ''
                }
              })

              // ページ定義を保存
              for (const pageData of operationData.pages) {
                const displayName = pageData.displayName && typeof pageData.displayName === 'string' && pageData.displayName.trim()
                  ? pageData.displayName.trim()
                  : (pageData.name || 'ページ').replace(/-/g, ' ')

                await tx.pageDefinition.create({
                  data: {
                    useCaseId: defaultUseCase.id,
                    name: pageData.name || 'page',
                    displayName: displayName,
                    description: `${pageData.name || 'ページ'}のページ定義`,
                    content: pageData.content || null,
                    url: `/${pageData.name || 'page'}`,
                    layout: '{}',
                    components: '[]',
                    stateManagement: '{}',
                    validations: '[]'
                  }
                })
                importedPages++
              }
            }
          }
        }
      }
    }
  })

  return { importedServices, importedCapabilities, importedOperations, importedPages, importedTests }
}

export async function POST(request: Request) {
  try {
    console.log('🚀 APIインポート開始 - リクエストボディを取得中');

    // POSTリクエストボディを安全に取得
    let body = null;
    try {
      const bodyText = await request.text();
      if (bodyText && bodyText.trim()) {
        body = JSON.parse(bodyText);
      }
    } catch (jsonError) {
      console.log('📨 リクエストボディが空またはJSONではありません - ファイルスキャンモードで実行');
    }

    console.log('📨 リクエストボディ取得完了:', body ? 'データあり' : 'データなし');

    let services;

    // リクエストボディにサービス情報がある場合は、それを使用
    if (body && Array.isArray(body)) {
      services = body;
      console.log(`📥 POSTデータから${services.length}件のサービスを取得`);
    } else {
      // リクエストボディがない場合は、従来通りMDファイルをスキャン
      const rootPath = process.cwd()
      services = await scanParasolDocs(rootPath)
      console.log(`📁 ファイルスキャンから${services.length}件のサービスを取得`);
    }

    if (services.length === 0) {
      return NextResponse.json(
        { error: 'サービスデータが見つかりませんでした' },
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