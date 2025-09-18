import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'

const authDb = new AuthPrismaClient()

async function removeDuplicateOrganizations() {
  console.log('🧹 Removing duplicate organizations...')

  try {
    // 重複している組織を検索（株式会社テックイノベーション）
    const duplicateOrgs = await authDb.organization.findMany({
      where: { 
        name: '株式会社テックイノベーション',
        type: 'client'
      },
      include: {
        users: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (duplicateOrgs.length <= 1) {
      console.log('✅ No duplicate organizations found')
      return
    }

    console.log(`Found ${duplicateOrgs.length} organizations with name "株式会社テックイノベーション"`)

    // 最初の組織を保持し、それ以降を削除対象とする
    const [keepOrg, ...orgsToDelete] = duplicateOrgs

    console.log(`Keeping organization: ${keepOrg.id} (created at: ${keepOrg.createdAt})`)
    console.log(`Organizations to delete: ${orgsToDelete.length}`)

    // 削除対象の組織に関連するプロジェクトを確認
    const projectDb = new (await import('@prisma/project-client')).PrismaClient()
    
    for (const org of orgsToDelete) {
      console.log(`\nChecking organization ${org.id}...`)
      
      // この組織に関連するプロジェクトがあるか確認
      const projects = await projectDb.project.findMany({
        where: { clientId: org.id }
      })

      if (projects.length > 0) {
        console.log(`  - Found ${projects.length} projects, updating to use primary organization...`)
        
        // プロジェクトのclientIdを最初の組織に更新
        await projectDb.project.updateMany({
          where: { clientId: org.id },
          data: { clientId: keepOrg.id }
        })
      }

      // ユーザーがいる場合は組織IDを更新
      if (org.users.length > 0) {
        console.log(`  - Found ${org.users.length} users, updating organization...`)
        
        await authDb.user.updateMany({
          where: { organizationId: org.id },
          data: { organizationId: keepOrg.id }
        })
      }

      // 組織を削除
      await authDb.organization.delete({
        where: { id: org.id }
      })
      
      console.log(`  ✅ Deleted organization ${org.id}`)
    }

    await projectDb.$disconnect()

    console.log('\n✅ Duplicate organizations removed successfully')
    
    // 残った組織の情報を表示
    const remainingOrgs = await authDb.organization.findMany({
      where: { type: 'client' },
      orderBy: { name: 'asc' }
    })

    console.log('\n📋 Current client organizations:')
    remainingOrgs.forEach(org => {
      console.log(`- ${org.name} (${org.id})`)
    })

  } catch (error) {
    console.error('❌ Error removing duplicates:', error)
    throw error
  }
}

if (require.main === module) {
  removeDuplicateOrganizations()
    .then(() => {
      console.log('Duplicate removal completed')
    })
    .catch((e) => {
      console.error('Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await authDb.$disconnect()
    })
}