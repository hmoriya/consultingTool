import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  try {
    console.log('Seeding core data...')

    // Create consulting organization
    let consultingOrg = await db.organization.findFirst({
      where: { type: 'consultingFirm' }
    })

    if (!consultingOrg) {
      consultingOrg = await db.organization.create({
        data: {
          name: 'コンサルティング会社',
          type: 'consultingFirm'
        }
      })
      console.log('Created consulting organization')
    }

    // Create roles
    const roles = [
      { name: 'Executive', description: 'エグゼクティブ' },
      { name: 'PM', description: 'プロジェクトマネージャー' },
      { name: 'Consultant', description: 'コンサルタント' },
      { name: 'Client', description: 'クライアント' },
      { name: 'Admin', description: '管理者' }
    ]

    for (const roleData of roles) {
      const existing = await db.role.findFirst({
        where: { name: roleData.name }
      })

      if (!existing) {
        await db.role.create({
          data: roleData
        })
        console.log(`Created role: ${roleData.name}`)
      }
    }

    // Get roles
    const pmRole = await db.role.findFirst({ where: { name: 'PM' } })
    const consultantRole = await db.role.findFirst({ where: { name: 'Consultant' } })
    const executiveRole = await db.role.findFirst({ where: { name: 'Executive' } })

    if (!pmRole || !consultantRole || !executiveRole) {
      throw new Error('Roles not found')
    }

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10)

    const users = [
      {
        id: 'cln8abc120001qs01example1',
        email: 'exec@example.com',
        password: hashedPassword,
        name: '山田 太郎',
        organizationId: consultingOrg.id,
        roleId: executiveRole.id
      },
      {
        id: 'cln8abc120001qs01example2',
        email: 'pm@example.com',
        password: hashedPassword,
        name: '鈴木 花子',
        organizationId: consultingOrg.id,
        roleId: pmRole.id
      },
      {
        id: 'cln8abc120001qs01example3',
        email: 'consultant@example.com',
        password: hashedPassword,
        name: '佐藤 次郎',
        organizationId: consultingOrg.id,
        roleId: consultantRole.id
      },
      {
        id: 'cln8abc120001qs01example4',
        email: 'takahashi@example.com',
        password: hashedPassword,
        name: '高橋 愛',
        organizationId: consultingOrg.id,
        roleId: consultantRole.id
      },
      {
        id: 'cln8abc120001qs01example5',
        email: 'watanabe@example.com',
        password: hashedPassword,
        name: '渡辺 健',
        organizationId: consultingOrg.id,
        roleId: consultantRole.id
      },
      {
        id: 'cln8abc120001qs01example6',
        email: 'ito@example.com',
        password: hashedPassword,
        name: '伊藤 真由美',
        organizationId: consultingOrg.id,
        roleId: consultantRole.id
      }
    ]

    for (const userData of users) {
      const existing = await db.user.findUnique({
        where: { email: userData.email }
      })

      if (!existing) {
        await db.user.create({
          data: userData
        })
        console.log(`Created user: ${userData.name}`)
      } else {
        console.log(`User already exists: ${userData.email}`)
      }
    }

    console.log('✅ Core data seeding completed')

  } catch (_error) {
    console.error('Error seeding core data:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))