import { config } from 'dotenv'
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'

// Load environment variables
config()

const projectDb = new ProjectPrismaClient({
  log: ['error', 'warn']
})

async function main() {
  try {
    console.log('Updating task assignees...')

    const pmUserId = 'cln8abc120001qs01example2' // 鈴木 花子のID
    
    // 優先度が高い進行中のタスクをPMに割り当て
    const tasksToAssign = [
      '現状分析・要件定義',
      'データベース設計',
      'UI/UXデザイン', 
      '認証機能実装',
      'ダッシュボード画面開発',
      '結合テスト実施',
      'ユーザー受入テスト',
      'API仕様書作成',
      'レポート機能開発'
    ]
    
    let updatedCount = 0
    
    for (const taskTitlePart of tasksToAssign) {
      const tasks = await projectDb.task.findMany({
        where: {
          title: {
            contains: taskTitlePart
          }
        }
      })
      
      for (const task of tasks) {
        await projectDb.task.update({
          where: { id: task.id },
          data: { assigneeId: pmUserId }
        })
        updatedCount++
        console.log(`Assigned task "${task.title}" to PM`)
      }
    }

    console.log(`\n✅ Updated ${updatedCount} tasks with PM assignments`)

  } catch (_error) {
    console.error('Error updating task assignees:', error)
    throw error
  } finally {
    await projectDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))