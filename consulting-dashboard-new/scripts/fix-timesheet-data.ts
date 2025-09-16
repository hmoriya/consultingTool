import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'
import { PrismaClient } from '@prisma/client'

const timesheetDb = new TimesheetPrismaClient()
const db = new PrismaClient()

async function main() {
  console.log('Fixing timesheet data...')

  // まず既存の工数エントリを削除
  await timesheetDb.timeEntry.deleteMany({})
  console.log('Deleted all existing time entries')

  // タスクの実績時間をリセット
  await db.task.updateMany({
    data: {
      actualHours: 0
    }
  })
  console.log('Reset all task actual hours')

  // 新しい工数エントリを作成
  const consultant = await db.user.findFirst({
    where: { email: 'consultant@example.com' }
  })

  if (!consultant) {
    throw new Error('Consultant user not found')
  }

  // 週次タイムシートを取得または作成
  const weekStartDate = new Date('2025-09-14')
  weekStartDate.setUTCHours(0, 0, 0, 0)
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay()) // 日曜日に調整

  let timesheet = await timesheetDb.timesheet.findFirst({
    where: {
      consultantId: consultant.id,
      weekStartDate: weekStartDate
    }
  })

  if (!timesheet) {
    timesheet = await timesheetDb.timesheet.create({
      data: {
        consultantId: consultant.id,
        weekStartDate: weekStartDate,
        weekEndDate: new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000),
        totalHours: 0,
        billableHours: 0,
        nonBillableHours: 0,
        status: 'DRAFT'
      }
    })
  }

  // プロジェクトとタスクを取得
  const project1 = await db.project.findFirst({
    where: { name: 'デジタルトランスフォーメーション戦略策定' }
  })
  
  const project2 = await db.project.findFirst({
    where: { name: 'デジタル金融サービス開発' }
  })

  if (!project1 || !project2) {
    throw new Error('Projects not found')
  }

  // 実際の工数エントリを作成
  const entries = [
    // 月曜日
    {
      consultantId: consultant.id,
      projectId: project1.id,
      taskId: 'cmfgsnezk001q8odoidtyoqei', // 現状業務プロセス分析
      date: new Date('2025-09-08'),
      hours: 3.5,
      description: '現状業務プロセスの文書化',
      billable: true,
      activityType: 'ANALYSIS'
    },
    {
      consultantId: consultant.id,
      projectId: project1.id,
      taskId: 'cmfgsnezk001q8odoidtyoqei',
      date: new Date('2025-09-08'),
      hours: 4.5,
      description: 'プロセスフローチャート作成',
      billable: true,
      activityType: 'DOCUMENTATION'
    },
    // 火曜日
    {
      consultantId: consultant.id,
      projectId: project1.id,
      taskId: 'cmfgsnezk001r8odomw129ek2', // ステークホルダーインタビュー
      date: new Date('2025-09-09'),
      hours: 2.0,
      description: 'インタビュー準備',
      billable: true,
      activityType: 'PREPARATION'
    },
    {
      consultantId: consultant.id,
      projectId: project1.id,
      taskId: 'cmfgsnezk001r8odomw129ek2',
      date: new Date('2025-09-09'),
      hours: 3.5,
      description: 'ステークホルダーインタビュー実施',
      billable: true,
      activityType: 'MEETING'
    },
    // 水曜日
    {
      consultantId: consultant.id,
      projectId: project2.id,
      taskId: 'cmfgsnezk001k8odobof51s9n', // 既存システム分析
      date: new Date('2025-09-10'),
      hours: 5.0,
      description: 'システムアーキテクチャ分析',
      billable: true,
      activityType: 'ANALYSIS'
    },
    // 木曜日
    {
      consultantId: consultant.id,
      projectId: project2.id,
      taskId: 'cmfgsnezk001k8odobof51s9n',
      date: new Date('2025-09-11'),
      hours: 4.0,
      description: 'ギャップ分析レポート作成',
      billable: true,
      activityType: 'DOCUMENTATION'
    },
    // 金曜日
    {
      consultantId: consultant.id,
      projectId: project2.id,
      taskId: 'cmfgsnezk001m8odobei0ctye', // APIアーキテクチャ設計
      date: new Date('2025-09-12'),
      hours: 3.0,
      description: 'API設計書ドラフト作成',
      billable: true,
      activityType: 'DESIGN'
    },
    {
      consultantId: consultant.id,
      projectId: project2.id,
      taskId: 'cmfgsnezk001m8odobei0ctye',
      date: new Date('2025-09-12'),
      hours: 2.5,
      description: 'レビューミーティング',
      billable: true,
      activityType: 'MEETING'
    }
  ]

  // 工数エントリを作成
  for (const entry of entries) {
    await timesheetDb.timeEntry.create({
      data: {
        ...entry,
        status: 'DRAFT',
        weekNumber: 37,
        timesheetId: timesheet.id
      }
    })
    console.log(`Created time entry: ${entry.date.toLocaleDateString()} - ${entry.hours}h - ${entry.description}`)
  }

  // タスクの実績時間を更新
  const taskHours: Record<string, number> = {}
  for (const entry of entries) {
    if (entry.taskId) {
      taskHours[entry.taskId] = (taskHours[entry.taskId] || 0) + entry.hours
    }
  }

  for (const [taskId, hours] of Object.entries(taskHours)) {
    await db.task.update({
      where: { id: taskId },
      data: { actualHours: hours }
    })
    console.log(`Updated task ${taskId}: ${hours}h`)
  }

  // タイムシートの合計時間を更新
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)
  await timesheetDb.timesheet.update({
    where: { id: timesheet.id },
    data: {
      totalHours,
      billableHours: totalHours,
      nonBillableHours: 0
    }
  })

  console.log('Timesheet data fixed successfully!')
  console.log(`Total hours: ${totalHours}h`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await timesheetDb.$disconnect()
    await db.$disconnect()
  })