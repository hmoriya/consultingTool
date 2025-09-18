import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'
import bcrypt from 'bcryptjs'

const authDb = new AuthPrismaClient()

export async function seedCore() {
  console.log('🌱 Seeding Auth Service...')

  // 既存データをチェック
  const existingOrgs = await authDb.organization.count()
  if (existingOrgs > 0) {
    console.log('⚠️  Auth Service already has data. Skipping seed.')
    const organizations = await authDb.organization.findMany({ where: { type: 'client' } })
    const consultingFirm = await authDb.organization.findFirst({ where: { type: 'consultingFirm' } })
    const users = await authDb.user.findMany()
    const roles = await authDb.role.findMany()
    
    return {
      organizations: {
        consultingFirm,
        clientOrg: organizations[0],
        globalMfg: organizations.find(o => o.name === 'グローバル製造株式会社'),
        financeCorp: organizations.find(o => o.name === '金融ソリューションズ株式会社'),
        healthcare: organizations.find(o => o.name === 'ヘルスケアイノベーション株式会社'),
        retail: organizations.find(o => o.name === 'リテールチェーン株式会社'),
        energy: organizations.find(o => o.name === 'エネルギー開発株式会社')
      },
      roles: {
        execRole: roles.find(r => r.name === 'Executive'),
        pmRole: roles.find(r => r.name === 'PM'),
        consultantRole: roles.find(r => r.name === 'Consultant'),
        clientRole: roles.find(r => r.name === 'Client'),
        adminRole: roles.find(r => r.name === 'Admin')
      },
      users
    }
  }

  // 組織の作成
  const consultingFirm = await authDb.organization.create({
    data: {
      name: 'コンサルティング会社',
      type: 'consultingFirm'
    }
  })

  // 複数のクライアント組織を作成
  const clientOrgs = await Promise.all([
    authDb.organization.create({
      data: {
        name: '株式会社テックイノベーション',
        type: 'client'
      }
    }),
    authDb.organization.create({
      data: {
        name: 'グローバル製造株式会社',
        type: 'client'
      }
    }),
    authDb.organization.create({
      data: {
        name: '金融ソリューションズ株式会社',
        type: 'client'
      }
    }),
    authDb.organization.create({
      data: {
        name: 'ヘルスケアイノベーション株式会社',
        type: 'client'
      }
    }),
    authDb.organization.create({
      data: {
        name: 'リテールチェーン株式会社',
        type: 'client'
      }
    }),
    authDb.organization.create({
      data: {
        name: 'エネルギー開発株式会社',
        type: 'client'
      }
    })
  ])

  const [clientOrg, globalMfg, financeCorp, healthcare, retail, energy] = clientOrgs

  // ロールの作成
  const roles = await Promise.all([
    authDb.role.create({ data: { name: 'Executive', description: 'エグゼクティブ' } }),
    authDb.role.create({ data: { name: 'PM', description: 'プロジェクトマネージャー' } }),
    authDb.role.create({ data: { name: 'Consultant', description: 'コンサルタント' } }),
    authDb.role.create({ data: { name: 'Client', description: 'クライアント' } }),
    authDb.role.create({ data: { name: 'Admin', description: '管理者' } })
  ])

  const [execRole, pmRole, consultantRole, clientRole, adminRole] = roles

  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash('password123', 10)

  // テストユーザーの作成
  const users = await Promise.all([
    authDb.user.create({
      data: {
        email: 'exec@example.com',
        name: '山田 太郎',
        password: hashedPassword,
        organizationId: consultingFirm.id,
        roleId: execRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'pm@example.com',
        name: '鈴木 花子',
        password: hashedPassword,
        organizationId: consultingFirm.id,
        roleId: pmRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'consultant@example.com',
        name: '佐藤 次郎',
        password: hashedPassword,
        organizationId: consultingFirm.id,
        roleId: consultantRole.id
      }
    }),
    // 追加のコンサルタント
    authDb.user.create({
      data: {
        email: 'consultant2@example.com',
        name: '高橋 愛',
        password: hashedPassword,
        organizationId: consultingFirm.id,
        roleId: consultantRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'consultant3@example.com',
        name: '渡辺 健',
        password: hashedPassword,
        organizationId: consultingFirm.id,
        roleId: consultantRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'consultant4@example.com',
        name: '伊藤 真由美',
        password: hashedPassword,
        organizationId: consultingFirm.id,
        roleId: consultantRole.id
      }
    }),
    // 追加のPM
    authDb.user.create({
      data: {
        email: 'pm2@example.com',
        name: '木村 大輔',
        password: hashedPassword,
        organizationId: consultingFirm.id,
        roleId: pmRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'client@example.com',
        name: '田中 美咲',
        password: hashedPassword,
        organizationId: clientOrg.id,
        roleId: clientRole.id
      }
    }),
    // 追加のクライアントユーザー
    authDb.user.create({
      data: {
        email: 'contact@global-manufacturing.com',
        name: '製造 太郎',
        password: hashedPassword,
        organizationId: globalMfg.id,
        roleId: clientRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'contact@finance-solutions.com',
        name: '金融 花子',
        password: hashedPassword,
        organizationId: financeCorp.id,
        roleId: clientRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'contact@healthcare-innovation.com',
        name: '医療 次郎',
        password: hashedPassword,
        organizationId: healthcare.id,
        roleId: clientRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'contact@retail-chain.com',
        name: '小売 美咲',
        password: hashedPassword,
        organizationId: retail.id,
        roleId: clientRole.id
      }
    }),
    authDb.user.create({
      data: {
        email: 'contact@energy-dev.com',
        name: 'エネルギー 健太',
        password: hashedPassword,
        organizationId: energy.id,
        roleId: clientRole.id
      }
    })
  ])

  console.log('✅ Auth Service seeded successfully')
  
  return {
    organizations: { 
      consultingFirm, 
      clientOrg,
      globalMfg,
      financeCorp,
      healthcare,
      retail,
      energy
    },
    roles: { execRole, pmRole, consultantRole, clientRole, adminRole },
    users
  }
}

if (require.main === module) {
  seedCore()
    .then(() => {
      console.log('Core seed completed')
    })
    .catch((e) => {
      console.error('Error seeding core data:', e)
      process.exit(1)
    })
    .finally(async () => {
      await authDb.$disconnect()
    })
}