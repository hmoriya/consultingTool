import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'
import bcrypt from 'bcryptjs'

const authDb = new AuthPrismaClient()

async function addMoreClients() {
  console.log('🌱 Adding more client organizations...')

  try {
    // クライアントロールを取得
    const clientRole = await authDb.role.findFirst({
      where: { name: 'Client' }
    })

    if (!clientRole) {
      throw new Error('Client role not found. Please run auth service seed first.')
    }

    // 追加のクライアント組織を作成
    const newClients = await Promise.all([
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

    console.log(`✅ Created ${newClients.length} new client organizations`)

    // 各クライアント組織にユーザーを作成
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const clientUsers = await Promise.all([
      authDb.user.create({
        data: {
          email: 'contact@global-manufacturing.com',
          name: '製造 太郎',
          password: hashedPassword,
          organizationId: newClients[0].id,
          roleId: clientRole.id
        }
      }),
      authDb.user.create({
        data: {
          email: 'contact@finance-solutions.com',
          name: '金融 花子',
          password: hashedPassword,
          organizationId: newClients[1].id,
          roleId: clientRole.id
        }
      }),
      authDb.user.create({
        data: {
          email: 'contact@healthcare-innovation.com',
          name: '医療 次郎',
          password: hashedPassword,
          organizationId: newClients[2].id,
          roleId: clientRole.id
        }
      }),
      authDb.user.create({
        data: {
          email: 'contact@retail-chain.com',
          name: '小売 美咲',
          password: hashedPassword,
          organizationId: newClients[3].id,
          roleId: clientRole.id
        }
      }),
      authDb.user.create({
        data: {
          email: 'contact@energy-dev.com',
          name: 'エネルギー 健太',
          password: hashedPassword,
          organizationId: newClients[4].id,
          roleId: clientRole.id
        }
      })
    ])

    console.log(`✅ Created ${clientUsers.length} client users`)

    // 作成した組織情報を表示
    console.log('\n📋 New Client Organizations:')
    newClients.forEach((client, index) => {
      console.log(`- ${client.name} (${clientUsers[index].email})`)
    })

    console.log('\n✅ Client organizations added successfully')

  } catch (_error) {
    console.error('❌ Error adding client organizations:', error)
    throw error
  }
}

if (require.main === module) {
  addMoreClients()
    .then(() => {
      console.log('Client addition completed')
    })
    .catch((e) => {
      console.error('Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await authDb.$disconnect()
    })
}