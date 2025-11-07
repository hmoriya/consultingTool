import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  try {
    console.log('Seeding client organizations...')

    const clients = [
      { name: '株式会社グローバルテック', type: 'client' },
      { name: '日本金融ホールディングス', type: 'client' },
      { name: 'リテールソリューションズ株式会社', type: 'client' },
      { name: 'ヘルスケアイノベーション株式会社', type: 'client' },
      { name: 'ロジスティクスジャパン株式会社', type: 'client' },
      { name: 'エネルギーソリューションズ株式会社', type: 'client' },
      { name: 'スマートファクトリー株式会社', type: 'client' },
      { name: 'エデュケーションテック株式会社', type: 'client' },
    ]

    for (const clientData of clients) {
      const existing = await db.organization.findFirst({
        where: {
          name: clientData.name,
          type: 'client'
        }
      })

      if (!existing) {
        const client = await db.organization.create({
          data: clientData
        })
        console.log(`Created client: ${client.name}`)
      } else {
        console.log(`Client already exists: ${clientData.name}`)
      }
    }

    console.log('✅ Client organizations seeding completed')

  } catch (_error) {
    console.error('Error seeding clients:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))