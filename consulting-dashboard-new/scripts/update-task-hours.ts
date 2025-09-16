import { PrismaClient } from '@prisma/client'
import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'

const db = new PrismaClient()
const timesheetDb = new TimesheetPrismaClient()

async function main() {
  console.log('Updating task hours data...')

  // タスクの実績時間を工数エントリから集計して更新
  const tasks = await db.task.findMany({
    include: {
      timeEntries: true
    }
  })

  for (const task of tasks) {
    // 工数エントリから実績時間を集計
    const totalHours = task.timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
    
    // 実績時間を更新（小数点1桁に丸める）
    await db.task.update({
      where: { id: task.id },
      data: {
        actualHours: Math.round(totalHours * 10) / 10
      }
    })
    
    console.log(`Updated task ${task.title}: ${totalHours}h -> ${Math.round(totalHours * 10) / 10}h`)
  }

  // いくつかのタスクに見積時間を設定
  const tasksToUpdate = [
    { id: 'cmfgsnezk001q8odoidtyoqei', estimatedHours: 40 },
    { id: 'cmfgsnezk001r8odomw129ek2', estimatedHours: 24 },
    { id: 'cmfgsnezk001k8odobof51s9n', estimatedHours: 80 },
    { id: 'cmfgsnezk001m8odobei0ctye', estimatedHours: 120 },
    { id: 'cmfgsnezk001t8odoa3yv90yi', estimatedHours: 32 },
    { id: 'cmfgsnezk001u8odohxuqbeut', estimatedHours: 60 },
  ]

  for (const update of tasksToUpdate) {
    await db.task.update({
      where: { id: update.id },
      data: { estimatedHours: update.estimatedHours }
    })
    console.log(`Set estimated hours for task ${update.id}: ${update.estimatedHours}h`)
  }

  console.log('Task hours data updated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
    await timesheetDb.$disconnect()
  })