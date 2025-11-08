import { PrismaClient as FinancePrismaClient } from '@prisma/finance-client'
import { PrismaClient as AuthPrismaClient } from '@prisma/client'
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import path from 'path'
import { startOfMonth, endOfMonth } from 'date-fns'

const projectRoot = path.resolve(__dirname, '../..')

const financeDb = new FinancePrismaClient({
  datasources: {
    db: {
      url: process.env.FINANCE_DATABASE_URL || `file:${path.join(projectRoot, 'prisma/finance-service/data/finance.db')}`
    }
  }
})

const authDb = new AuthPrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL || `file:${path.join(projectRoot, 'prisma/auth-service/data/auth.db')}`
    }
  }
})

const projectDb = new ProjectPrismaClient({
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL || `file:${path.join(projectRoot, 'prisma/project-service/data/project.db')}`
    }
  }
})

async function main() {
  try {
    console.log('Creating timesheet data...')
    
    // ユーザーとプロジェクトを取得
    const users = await authDb.user.findMany()
    const projects = await projectDb.project.findMany({
      where: {
        status: 'active'
      }
    })
    
    console.log(`Found ${users.length} users and ${projects.length} active projects`)
    
    // 今月の営業日を計算
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const today = new Date()
    
    // PMユーザー（鈴木花子）の工数データ作成
    const pmUser = users.find(u => u.email === 'pm@example.com')
    if (pmUser) {
      // 今月の各営業日に工数を記録
      for (let d = new Date(monthStart); d <= today && d <= monthEnd; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) continue // 土日はスキップ
        
        // 複数プロジェクトに分散して工数を記録（合計7-8時間/日）
        const projectsToWork = projects.slice(0, 3) // 3つのプロジェクトに工数を分散
        
        for (const project of projectsToWork) {
          const hours = Math.random() * 2 + 2 // 2-4時間
          
          await financeDb.timeEntry.create({
            data: {
              userId: pmUser.id,
              projectId: project.id,
              date: new Date(d),
              hours: Math.round(hours * 10) / 10, // 0.1時間単位
              description: `${project.name}のプロジェクト管理業務`,
              billable: true,
              approved: true,
              approvedBy: pmUser.id,
              approvedAt: new Date(),
            }
          })
        }
      }
      
      console.log(`Created timesheet entries for PM: ${pmUser.name}`)
    }
    
    // コンサルタントユーザー（伊藤真由美）の工数データ作成
    const consultantUser = users.find(u => u.email === 'consultant@example.com')
    if (consultantUser) {
      // 稼働率を低く設定（週に1-2日程度）
      const workDays = [5, 10, 15, 20].filter(day => {
        const date = new Date(monthStart)
        date.setDate(day)
        return date <= today && date.getDay() !== 0 && date.getDay() !== 6
      })
      
      for (const day of workDays) {
        const date = new Date(monthStart)
        date.setDate(day)
        
        const project = projects[0] // 1つのプロジェクトのみ
        const hours = Math.random() * 2 + 1 // 1-3時間
        
        await financeDb.timeEntry.create({
          data: {
            userId: consultantUser.id,
            projectId: project.id,
            date,
            hours: Math.round(hours * 10) / 10,
            description: `${project.name}の分析作業`,
            billable: true,
            approved: true,
            approvedBy: pmUser?.id || consultantUser.id,
            approvedAt: new Date(),
          }
        })
      }
      
      console.log(`Created timesheet entries for Consultant: ${consultantUser.name}`)
    }
    
    // 実績確認
    const totalEntries = await financeDb.timeEntry.count()
    const totalHours = await financeDb.timeEntry.aggregate({
      _sum: { hours: true }
    })
    
    console.log(`✅ Created ${totalEntries} timesheet entries with total ${totalHours._sum.hours} hours`)
    
  } catch (_error) {
    console.error('Error seeding timesheet data:', error)
    throw error
  } finally {
    await financeDb.$disconnect()
    await authDb.$disconnect()
    await projectDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))