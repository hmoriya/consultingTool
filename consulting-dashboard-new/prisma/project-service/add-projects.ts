import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'

const projectDb = new ProjectPrismaClient()
const authDb = new AuthPrismaClient()

async function addMoreProjects() {
  console.log('🌱 Adding projects for new client organizations...')

  try {
    // 新しいクライアント組織を取得
    const clientOrgs = await authDb.organization.findMany({
      where: { 
        type: 'client',
        NOT: {
          name: '株式会社テックイノベーション'
        }
      }
    })

    if (clientOrgs.length === 0) {
      throw new Error('No new client organizations found. Please run add-clients script first.')
    }

    console.log(`Found ${clientOrgs.length} client organizations`)

    // PMユーザーを取得
    const pmUser = await authDb.user.findFirst({
      where: { email: 'pm@example.com' }
    })

    if (!pmUser) {
      throw new Error('PM user not found')
    }

    // 各クライアント組織にプロジェクトを作成
    const projects = []
    
    // グローバル製造株式会社
    const globalMfg = clientOrgs.find(c => c.name === 'グローバル製造株式会社')
    if (globalMfg) {
      projects.push(await projectDb.project.create({
        data: {
          name: 'スマートファクトリー導入',
          code: 'SMF001',
          clientId: globalMfg.id,
          status: 'active',
          priority: 'high',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-10-31'),
          budget: 45000000,
          description: 'IoTとAIを活用した次世代製造ラインの構築'
        }
      }))
    }

    // 金融ソリューションズ株式会社
    const financeCorp = clientOrgs.find(c => c.name === '金融ソリューションズ株式会社')
    if (financeCorp) {
      projects.push(await projectDb.project.create({
        data: {
          name: 'デジタルバンキング戦略',
          code: 'DBS001',
          clientId: financeCorp.id,
          status: 'planning',
          priority: 'high',
          startDate: new Date('2024-05-01'),
          endDate: new Date('2025-03-31'),
          budget: 60000000,
          description: 'オンラインバンキングサービスの全面刷新'
        }
      }))
    }

    // ヘルスケアイノベーション株式会社
    const healthcare = clientOrgs.find(c => c.name === 'ヘルスケアイノベーション株式会社')
    if (healthcare) {
      projects.push(await projectDb.project.create({
        data: {
          name: '電子カルテシステム統合',
          code: 'EMR001',
          clientId: healthcare.id,
          status: 'active',
          priority: 'critical',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-06-30'),
          budget: 35000000,
          description: '複数病院の電子カルテシステムの統合と標準化'
        }
      }))
    }

    // リテールチェーン株式会社
    const retail = clientOrgs.find(c => c.name === 'リテールチェーン株式会社')
    if (retail) {
      projects.push(await projectDb.project.create({
        data: {
          name: 'オムニチャネル戦略推進',
          code: 'OMN001',
          clientId: retail.id,
          status: 'active',
          priority: 'medium',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-11-30'),
          budget: 28000000,
          description: '店舗とECの統合による顧客体験の向上'
        }
      }))
    }

    // エネルギー開発株式会社
    const energy = clientOrgs.find(c => c.name === 'エネルギー開発株式会社')
    if (energy) {
      projects.push(await projectDb.project.create({
        data: {
          name: '再生可能エネルギー管理システム',
          code: 'REN001',
          clientId: energy.id,
          status: 'planning',
          priority: 'medium',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2025-05-31'),
          budget: 42000000,
          description: '太陽光・風力発電施設の統合管理プラットフォーム構築'
        }
      }))
    }

    console.log(`✅ Created ${projects.length} new projects`)

    // プロジェクトメンバーを追加（PMユーザーを全プロジェクトに割り当て）
    const pmMembers = await Promise.all(
      projects.map(project => 
        projectDb.projectMember.create({
          data: {
            projectId: project.id,
            userId: pmUser.id,
            role: 'PM',
            allocation: 0.2, // 各プロジェクトに20%ずつ割り当て
            startDate: project.startDate
          }
        })
      )
    )

    console.log(`✅ Added PM to ${pmMembers.length} projects`)

    // 作成したプロジェクトを表示
    console.log('\n📋 New Projects:')
    projects.forEach(project => {
      const client = clientOrgs.find(c => c.id === project.clientId)
      console.log(`- ${project.name} (${project.code}) - ${client?.name}`)
    })

    console.log('\n✅ Projects added successfully')

  } catch (error) {
    console.error('❌ Error adding projects:', error)
    throw error
  }
}

if (require.main === module) {
  addMoreProjects()
    .then(() => {
      console.log('Project addition completed')
    })
    .catch((e) => {
      console.error('Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await projectDb.$disconnect()
      await authDb.$disconnect()
    })
}