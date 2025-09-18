import { authDb } from './app/lib/db/auth-db'
import bcrypt from 'bcryptjs'

const prisma = authDb

async function main() {
  console.log('🌱 Creating basic auth data...')

  // 組織を作成
  const org = await prisma.organization.upsert({
    where: { id: 'org1' },
    update: {},
    create: {
      id: 'org1',
      name: 'コンサルティング会社',
      type: 'consultingFirm'
    }
  })

  console.log('✅ Created organization:', org.name)

  // ロールを作成
  const roles = [
    { id: 'role1', name: 'Executive', description: 'エグゼクティブ' },
    { id: 'role2', name: 'PM', description: 'プロジェクトマネージャー' },
    { id: 'role3', name: 'Consultant', description: 'コンサルタント' }
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    })
  }

  console.log('✅ Created roles')

  // ユーザーを作成
  const users = [
    { id: 'user1', email: 'pm@example.com', name: '鈴木 花子', roleId: 'role2' },
    { id: 'user2', email: 'pm2@example.com', name: '木村 大輔', roleId: 'role2' },
    { id: 'user3', email: 'consultant@example.com', name: '佐藤 次郎', roleId: 'role3' },
    { id: 'user4', email: 'consultant2@example.com', name: '高橋 愛', roleId: 'role3' },
    { id: 'user5', email: 'consultant3@example.com', name: '渡辺 健', roleId: 'role3' },
    { id: 'user6', email: 'consultant4@example.com', name: '伊藤 真由美', roleId: 'role3' }
  ]

  const hashedPassword = await bcrypt.hash('password123', 10)

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: hashedPassword,
        organizationId: 'org1',
        isActive: true
      }
    })
    console.log(`✅ Created user: ${user.name} (${user.email})`)
  }

  console.log('\n✅ Basic auth data created successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })