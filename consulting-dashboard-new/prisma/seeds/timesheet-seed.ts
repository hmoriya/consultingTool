import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'

const timesheetDb = new TimesheetPrismaClient({
  datasources: {
    db: {
      url: process.env.TIMESHEET_DATABASE_URL || 'file:./prisma/timesheet-service/data/timesheet.db'
    }
  }
})

export async function seedTimesheets(users?: any, projects?: any) {
  console.log('🌱 Seeding Timesheet Service...')
  
  try {
    // 既存のタイムシートをチェック
    const existingTimesheets = await timesheetDb.timesheet.count()
    if (existingTimesheets > 0) {
      console.log('⚠️  Timesheet Service already has data. Skipping seed.')
      return
    }

    // ユーザーとプロジェクトが渡されていない場合はスキップ
    if (!users || !projects) {
      console.log('⚠️  Users or projects not provided. Skipping timesheet seed.')
      return
    }

    const timeEntries = []
    const timesheets = []
    const today = new Date()
    const currentWeekStart = new Date(today)
    currentWeekStart.setDate(today.getDate() - today.getDay()) // 週の開始（日曜日）
    currentWeekStart.setHours(0, 0, 0, 0)

    // 過去4週間分の工数データを作成
    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(currentWeekStart)
      weekStart.setDate(weekStart.getDate() - week * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      // PMユーザーの工数
      if (users.pmUser && projects.length > 0) {
        // 週次タイムシートを作成
        const pmTimesheet = {
          consultantId: users.pmUser.id,
          weekStartDate: weekStart,
          weekEndDate: weekEnd,
          totalHours: 0,
          billableHours: 0,
          nonBillableHours: 0,
          status: week === 0 ? 'OPEN' : week === 1 ? 'SUBMITTED' : 'APPROVED',
          submittedAt: week > 0 ? new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000) : null
        }
        
        for (let day = 0; day < 5; day++) { // 月〜金
          const date = new Date(weekStart)
          date.setDate(date.getDate() + day + 1) // 月曜日から開始
          const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
          
          // PMとして関わっているプロジェクトの中から2-3個をランダムに選択
          const pmProjects = projects.filter((p: any) => 
            p.projectMembers.some((m: any) => m.userId === users.pmUser.id && m.role === 'pm')
          ).slice(0, 2 + Math.floor(Math.random() * 2))
          
          for (const project of pmProjects) {
            const hours = 2 + Math.floor(Math.random() * 4) // 2-6時間
            pmTimesheet.totalHours += hours
            pmTimesheet.billableHours += hours
            
            timeEntries.push({
              consultantId: users.pmUser.id,
              projectId: project.id,
              taskId: null,
              date: date,
              hours: hours,
              description: `プロジェクト管理・ミーティング・レビュー`,
              billable: true,
              activityType: 'MEETING',
              status: week === 0 ? 'DRAFT' : week === 1 ? 'SUBMITTED' : 'APPROVED',
              weekNumber: weekNumber,
              submittedAt: week > 0 ? new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000) : null,
              approvedAt: week > 1 ? new Date(weekEnd.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
              approvedById: week > 1 ? users.execUser?.id || null : null
            })
          }
        }
        
        timesheets.push(pmTimesheet)
      }

      // コンサルタントユーザーの工数
      if (users.consultantUser && projects.length > 0) {
        // 週次タイムシートを作成
        const consultantTimesheet = {
          consultantId: users.consultantUser.id,
          weekStartDate: weekStart,
          weekEndDate: weekEnd,
          totalHours: 0,
          billableHours: 0,
          nonBillableHours: 0,
          status: week === 0 ? 'OPEN' : week === 1 ? 'SUBMITTED' : 'APPROVED',
          submittedAt: week > 0 ? new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000) : null
        }
        
        for (let day = 0; day < 5; day++) { // 月〜金
          const date = new Date(weekStart)
          date.setDate(date.getDate() + day + 1)
          const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
          
          // 1-2個のプロジェクトで作業
          const consultantProjects = projects.slice(0, 1 + Math.floor(Math.random() * 2))
          
          for (const project of consultantProjects) {
            const hours = 6 + Math.floor(Math.random() * 3) // 6-8時間
            consultantTimesheet.totalHours += hours
            consultantTimesheet.billableHours += hours
            
            timeEntries.push({
              consultantId: users.consultantUser.id,
              projectId: project.id,
              taskId: null,
              date: date,
              hours: hours,
              description: `設計・開発・テスト作業`,
              billable: true,
              activityType: 'DEVELOPMENT',
              status: week === 0 ? 'DRAFT' : week === 1 ? 'SUBMITTED' : 'APPROVED',
              weekNumber: weekNumber,
              submittedAt: week > 0 ? new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000) : null,
              approvedAt: week > 1 ? new Date(weekEnd.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
              approvedById: week > 1 ? users.pmUser?.id || null : null
            })
          }
        }
        
        timesheets.push(consultantTimesheet)
      }

      // その他のコンサルタントの工数
      if (users.allUsers) {
        const consultants = users.allUsers.filter((u: any) => u.email.includes('consultant'))
        for (const consultant of consultants.slice(0, 3)) { // 最大3人分
          const consultantTimesheet = {
            consultantId: consultant.id,
            weekStartDate: weekStart,
            weekEndDate: weekEnd,
            totalHours: 0,
            billableHours: 0,
            nonBillableHours: 0,
            status: week === 0 ? 'OPEN' : week > 2 ? 'APPROVED' : 'SUBMITTED',
            submittedAt: week > 0 ? new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000) : null
          }
          
          for (let day = 0; day < 5; day++) {
            if (Math.random() > 0.3) { // 70%の確率で工数入力
              const date = new Date(weekStart)
              date.setDate(date.getDate() + day + 1)
              const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
              
              const project = projects[Math.floor(Math.random() * projects.length)]
              const hours = 4 + Math.floor(Math.random() * 5) // 4-8時間
              consultantTimesheet.totalHours += hours
              consultantTimesheet.billableHours += hours
              
              timeEntries.push({
                consultantId: consultant.id,
                projectId: project.id,
                taskId: null,
                date: date,
                hours: hours,
                description: `クライアント要件分析・ドキュメント作成・実装`,
                billable: true,
                activityType: 'DEVELOPMENT',
                status: week === 0 ? 'DRAFT' : week > 2 ? 'APPROVED' : 'SUBMITTED',
                weekNumber: weekNumber,
                submittedAt: week > 0 ? new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000) : null,
                approvedAt: week > 2 ? new Date(weekEnd.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
                approvedById: week > 2 ? users.pmUser?.id || null : null
              })
            }
          }
          
          if (consultantTimesheet.totalHours > 0) {
            timesheets.push(consultantTimesheet)
          }
        }
      }
    }

    // タイムシートを一括作成（重複を避けるためにユニークキーでフィルタリング）
    const uniqueTimesheets = timesheets.filter((timesheet, index, self) => 
      index === self.findIndex(t => 
        t.consultantId === timesheet.consultantId && 
        t.weekStartDate.getTime() === timesheet.weekStartDate.getTime()
      )
    )
    
    const createdTimesheets = await timesheetDb.timesheet.createMany({
      data: uniqueTimesheets
    })

    // タイムエントリーを一括作成
    const createdTimeEntries = await timesheetDb.timeEntry.createMany({
      data: timeEntries
    })

    console.log('✅ Timesheet Service seeded successfully')
    console.log(`  - Created ${createdTimesheets.count} timesheets`)
    console.log(`  - Created ${createdTimeEntries.count} time entries`)
    
  } catch (error) {
    console.error('❌ Error seeding Timesheet Service:', error)
    throw error
  } finally {
    await timesheetDb.$disconnect()
  }
}