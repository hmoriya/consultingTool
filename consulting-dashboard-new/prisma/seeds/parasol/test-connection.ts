import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

async function testConnection() {
  try {
    console.log('Testing Parasol database connection...')

    // Test service creation
    const testService = await parasolDb.service.create({
      data: {
        name: 'test-service',
        displayName: 'テストサービス',
        description: 'テスト用サービス',
        domainLanguage: JSON.stringify({ content: 'test' }),
        apiSpecification: JSON.stringify({ endpoints: [] }),
        dbSchema: JSON.stringify({ tables: [] })
      }
    })
    console.log('✅ Service created:', testService.displayName)

    // Test capability creation
    const capability = await parasolDb.businessCapability.create({
      data: {
        serviceId: result.id,
        name: 'test-capability',
        displayName: 'テスト能力',
        description: 'テスト用ケーパビリティ',
        category: 'Core',
        definition: 'テスト用の定義'
      }
    })
    console.log('✅ Capability created:', capability.displayName)

    // Test operation creation with detailed design
    const operation = await parasolDb.businessOperation.create({
      data: {
        serviceId: result.id,
        capabilityId: capability.id,
        name: 'test-operation',
        displayName: 'テストオペレーション',
        pattern: 'CRUD',
        goal: 'テスト用の目標',
        operations: JSON.stringify([]),
        businessStates: JSON.stringify(['state1', 'state2']),
        roles: JSON.stringify(['role1', 'role2']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([]),
        robustnessModel: JSON.stringify({}),
        design: `# テストオペレーション設計

## 概要
テスト用のビジネスオペレーション設計

## 詳細
これは詳細な設計内容のテストです。`
      }
    })
    console.log('✅ Operation created:', operation.displayName)
    console.log('Design length:', operation.design?.length || 0)

    const count = await parasolDb.service.count()
    console.log('Total services:', count)

  } catch (_error) {
    console.error('❌ Error:', error)
  } finally {
    await parasolDb.$disconnect()
  }
}

testConnection()