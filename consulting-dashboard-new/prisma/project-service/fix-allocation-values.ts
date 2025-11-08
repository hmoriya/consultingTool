import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import path from 'path'

const projectRoot = path.resolve(__dirname, '../..')

const projectDb = new ProjectPrismaClient({
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL || `file:${path.join(projectRoot, 'prisma/project-service/data/project.db')}`
    }
  }
})

async function main() {
  try {
    console.log('Fixing allocation values in ProjectMember table...')
    
    // すべてのプロジェクトメンバーを取得
    const allMembers = await projectDb.projectMember.findMany()
    
    console.log(`Found ${allMembers.length} project member records`)
    
    let updateCount = 0
    
    for (const member of allMembers) {
      // allocation値が1より大きい場合は、すでに%単位で保存されているので100で割る
      if (member.allocation > 1) {
        const newAllocation = member.allocation / 100
        
        await projectDb.projectMember.update({
          where: {
            id: member.id,
          },
          data: {
            allocation: newAllocation,
          },
        })
        
        console.log(`Updated ${member.userId} in project ${member.projectId}: ${member.allocation}% -> ${newAllocation}`)
        updateCount++
      }
    }
    
    console.log(`✅ Updated ${updateCount} records`)
    
    // 修正後の確認
    console.log('\nVerifying updated values:')
    const samples = await projectDb.projectMember.findMany({
      take: 10,
      orderBy: {
        allocation: 'desc',
      },
    })
    
    samples.forEach(sample => {
      console.log(`User ${sample.userId}: ${(sample.allocation * 100).toFixed(1)}%`)
    })
    
  } catch (_error) {
    console.error('Error fixing allocation values:', error)
    throw error
  } finally {
    await projectDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))