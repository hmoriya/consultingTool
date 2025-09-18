import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'
import bcrypt from 'bcryptjs'
import { USER_ROLES } from '../../constants/roles'

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
        execRole: roles.find(r => r.name === USER_ROLES.EXECUTIVE),
        pmRole: roles.find(r => r.name === USER_ROLES.PM),
        consultantRole: roles.find(r => r.name === USER_ROLES.CONSULTANT),
        clientRole: roles.find(r => r.name === USER_ROLES.CLIENT),
        adminRole: roles.find(r => r.name === USER_ROLES.ADMIN)
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
    authDb.role.create({ data: { name: USER_ROLES.EXECUTIVE, description: 'エグゼクティブ' } }),
    authDb.role.create({ data: { name: USER_ROLES.PM, description: 'プロジェクトマネージャー' } }),
    authDb.role.create({ data: { name: USER_ROLES.CONSULTANT, description: 'コンサルタント' } }),
    authDb.role.create({ data: { name: USER_ROLES.CLIENT, description: 'クライアント' } }),
    authDb.role.create({ data: { name: USER_ROLES.ADMIN, description: '管理者' } })
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

  // 担当者データの追加
  const contacts = await Promise.all([
    // テックイノベーション
    authDb.organizationContact.create({
      data: {
        organizationId: clientOrg.id,
        name: '田中 次郎',
        title: '情報システム部長',
        department: '情報システム部',
        email: 'tanaka@tech-innovation.com',
        phone: '03-1234-5678',
        mobile: '090-1234-5678',
        isPrimary: true,
        notes: 'DXプロジェクトの窓口担当'
      }
    }),
    authDb.organizationContact.create({
      data: {
        organizationId: clientOrg.id,
        name: '佐藤 美咲',
        title: 'プロジェクトマネージャー',
        department: '情報システム部',
        email: 'sato@tech-innovation.com',
        phone: '03-1234-5679',
        isPrimary: false
      }
    }),
    // グローバル製造
    authDb.organizationContact.create({
      data: {
        organizationId: globalMfg.id,
        name: '製造 一郎',
        title: '執行役員',
        department: '製造本部',
        email: 'ichiro@global-manufacturing.com',
        phone: '052-123-4567',
        mobile: '080-1234-5678',
        isPrimary: true,
        notes: 'スマートファクトリープロジェクト統括'
      }
    }),
    // 金融ソリューションズ
    authDb.organizationContact.create({
      data: {
        organizationId: financeCorp.id,
        name: '金子 健太',
        title: 'デジタル推進室長',
        department: 'デジタル推進室',
        email: 'kaneko@finance-solutions.com',
        phone: '03-9876-5432',
        mobile: '090-8765-4321',
        isPrimary: true
      }
    }),
    authDb.organizationContact.create({
      data: {
        organizationId: financeCorp.id,
        name: '山田 愛子',
        title: '部長',
        department: 'IT企画部',
        email: 'yamada@finance-solutions.com',
        phone: '03-9876-5433',
        isPrimary: false
      }
    }),
    // ヘルスケアイノベーション
    authDb.organizationContact.create({
      data: {
        organizationId: healthcare.id,
        name: '医療 花子',
        title: 'IT統括責任者',
        department: '医療情報システム部',
        email: 'hanako@healthcare-innovation.com',
        phone: '06-1111-2222',
        isPrimary: true,
        notes: '電子カルテ統合プロジェクト責任者'
      }
    }),
    // リテールチェーン
    authDb.organizationContact.create({
      data: {
        organizationId: retail.id,
        name: '小売 太郎',
        title: 'オムニチャネル推進部長',
        department: 'マーケティング本部',
        email: 'taro@retail-chain.com',
        phone: '03-2222-3333',
        mobile: '090-2222-3333',
        isPrimary: true
      }
    }),
    // エネルギー開発
    authDb.organizationContact.create({
      data: {
        organizationId: energy.id,
        name: 'エネルギー 和子',
        title: '新エネルギー事業部長',
        department: '新エネルギー事業部',
        email: 'kazuko@energy-dev.com',
        phone: '03-3333-4444',
        isPrimary: true,
        notes: '再生可能エネルギー管理システム導入プロジェクト担当'
      }
    })
  ])

  console.log('✅ Auth Service seeded successfully')
  console.log(`  - Created ${contacts.length} organization contacts`)
  
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