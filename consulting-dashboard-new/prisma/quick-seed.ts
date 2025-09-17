import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting quick seed...')

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'コンサルティング会社',
      type: 'consultingFirm'
    }
  })

  // Create roles
  const execRole = await prisma.role.create({
    data: {
      name: 'Executive',
      description: 'エグゼクティブ',
      isSystem: true
    }
  })

  const pmRole = await prisma.role.create({
    data: {
      name: 'PM',
      description: 'プロジェクトマネージャー',
      isSystem: true
    }
  })

  const consultantRole = await prisma.role.create({
    data: {
      name: 'Consultant',
      description: 'コンサルタント',
      isSystem: true
    }
  })

  const clientRole = await prisma.role.create({
    data: {
      name: 'Client',
      description: 'クライアント',
      isSystem: true
    }
  })

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.create({
    data: {
      email: 'exec@example.com',
      password: hashedPassword,
      name: 'Executive User',
      roleId: execRole.id,
      organizationId: org.id
    }
  })

  await prisma.user.create({
    data: {
      email: 'pm@example.com',
      password: hashedPassword,
      name: 'PM User',
      roleId: pmRole.id,
      organizationId: org.id
    }
  })

  await prisma.user.create({
    data: {
      email: 'consultant@example.com',
      password: hashedPassword,
      name: 'Consultant User',
      roleId: consultantRole.id,
      organizationId: org.id
    }
  })

  await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: hashedPassword,
      name: 'Client User',
      roleId: clientRole.id,
      organizationId: org.id
    }
  })

  console.log('Quick seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })