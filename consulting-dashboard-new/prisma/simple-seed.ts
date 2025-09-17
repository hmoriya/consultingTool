import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating basic data...')

  // 組織の作成
  const consultingFirm = await prisma.organization.create({
    data: {
      name: 'コンサルティング会社A',
      type: 'consultingFirm',
    },
  })

  const clientOrg = await prisma.organization.create({
    data: {
      name: '株式会社クライアント',
      type: 'client',
    },
  })

  // 権限の作成
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        resource: 'dashboard',
        action: 'read',
        description: 'ダッシュボードの閲覧',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'project',
        action: 'read',
        description: 'プロジェクトの閲覧',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'project',
        action: 'write',
        description: 'プロジェクトの編集',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'user',
        action: 'read',
        description: 'ユーザーの閲覧',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'user',
        action: 'write',
        description: 'ユーザーの編集',
      },
    }),
  ])

  // ロールの作成
  const executiveRole = await prisma.role.create({
    data: {
      name: 'Executive',
      description: 'エグゼクティブ',
      isSystem: true,
    },
  })

  const pmRole = await prisma.role.create({
    data: {
      name: 'PM',
      description: 'プロジェクトマネージャー',
      isSystem: true,
    },
  })

  const consultantRole = await prisma.role.create({
    data: {
      name: 'Consultant',
      description: 'コンサルタント',
      isSystem: true,
    },
  })

  const clientRole = await prisma.role.create({
    data: {
      name: 'Client',
      description: 'クライアント',
      isSystem: true,
    },
  })

  // ロールに権限を割り当て
  await Promise.all([
    // Executive: 全権限
    ...permissions.map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: executiveRole.id,
          permissionId: permission.id,
        },
      })
    ),
    // PM: プロジェクト関連権限
    prisma.rolePermission.create({
      data: {
        roleId: pmRole.id,
        permissionId: permissions.find(p => p.resource === 'dashboard' && p.action === 'read')!.id,
      },
    }),
    prisma.rolePermission.create({
      data: {
        roleId: pmRole.id,
        permissionId: permissions.find(p => p.resource === 'project' && p.action === 'read')!.id,
      },
    }),
    prisma.rolePermission.create({
      data: {
        roleId: pmRole.id,
        permissionId: permissions.find(p => p.resource === 'project' && p.action === 'write')!.id,
      },
    }),
    // Consultant: 読み取り権限中心
    prisma.rolePermission.create({
      data: {
        roleId: consultantRole.id,
        permissionId: permissions.find(p => p.resource === 'dashboard' && p.action === 'read')!.id,
      },
    }),
    prisma.rolePermission.create({
      data: {
        roleId: consultantRole.id,
        permissionId: permissions.find(p => p.resource === 'project' && p.action === 'read')!.id,
      },
    }),
    // Client: ダッシュボード閲覧のみ
    prisma.rolePermission.create({
      data: {
        roleId: clientRole.id,
        permissionId: permissions.find(p => p.resource === 'dashboard' && p.action === 'read')!.id,
      },
    }),
  ])

  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash('password123', 10)

  // テストユーザーの作成
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'exec@example.com',
        password: hashedPassword,
        name: 'エグゼクティブ 太郎',
        roleId: executiveRole.id,
        organizationId: consultingFirm.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'pm@example.com',
        password: hashedPassword,
        name: 'プロジェクトマネージャー 花子',
        roleId: pmRole.id,
        organizationId: consultingFirm.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'consultant@example.com',
        password: hashedPassword,
        name: 'コンサルタント 次郎',
        roleId: consultantRole.id,
        organizationId: consultingFirm.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'client@example.com',
        password: hashedPassword,
        name: 'クライアント 三郎',
        roleId: clientRole.id,
        organizationId: clientOrg.id,
      },
    }),
  ])

  console.log('Created test users:')
  users.forEach(user => {
    console.log(`- ${user.email} (${user.name})`)
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })