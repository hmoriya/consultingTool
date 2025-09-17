import { PrismaClient } from '@prisma/timesheet-service'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TIMESHEET_DATABASE_URL || 'file:./prisma/timesheet-service/data/timesheet.db'
    }
  }
})

async function main() {
  console.log('Seeding timesheet database...')
  console.log('Database URL:', process.env.TIMESHEET_DATABASE_URL || 'file:./prisma/timesheet-service/data/timesheet.db')

  // Clean existing data
  console.log('Cleaning existing data...')
  await prisma.timeEntry.deleteMany()
  await prisma.timesheet.deleteMany()
  await prisma.workingHours.deleteMany()
  await prisma.holiday.deleteMany()
  console.log('Existing data cleaned.')

  // Create holidays for 2024
  const holidays2024 = [
    { date: new Date('2024-01-01'), name: '元日', isNationalHoliday: true },
    { date: new Date('2024-01-08'), name: '成人の日', isNationalHoliday: true },
    { date: new Date('2024-02-11'), name: '建国記念の日', isNationalHoliday: true },
    { date: new Date('2024-02-23'), name: '天皇誕生日', isNationalHoliday: true },
    { date: new Date('2024-03-20'), name: '春分の日', isNationalHoliday: true },
    { date: new Date('2024-04-29'), name: '昭和の日', isNationalHoliday: true },
    { date: new Date('2024-05-03'), name: '憲法記念日', isNationalHoliday: true },
    { date: new Date('2024-05-04'), name: 'みどりの日', isNationalHoliday: true },
    { date: new Date('2024-05-05'), name: 'こどもの日', isNationalHoliday: true },
  ]

  for (const holiday of holidays2024) {
    await prisma.holiday.create({
      data: holiday
    })
  }
  console.log(`Created ${holidays2024.length} holidays.`)

  // Create working hours settings
  const workingHours = await prisma.workingHours.create({
    data: {
      userId: 'default',
      standardHours: 8,
      minHours: 4,
      maxHours: 12,
      breakHours: 1,
      startTime: '09:00',
      endTime: '18:00',
      isFlexible: true,
      flexStartTime: '07:00',
      flexEndTime: '22:00'
    }
  })
  console.log('Created default working hours settings.')

  // Create sample timesheets and entries
  const consultantId = 'sample-consultant-1'
  const projectId = 'sample-project-1'

  // Create timesheet for current week
  const currentWeekStart = new Date('2024-03-18')
  const currentWeekEnd = new Date('2024-03-24')

  const timesheet = await prisma.timesheet.create({
    data: {
      consultantId,
      weekStartDate: currentWeekStart,
      weekEndDate: currentWeekEnd,
      status: 'OPEN',
      totalHours: 40,
      billableHours: 35,
      nonBillableHours: 5
    }
  })

  // Create time entries for the week
  const timeEntries = [
    {
      consultantId,
      projectId,
      date: new Date('2024-03-18'),
      hours: 8,
      description: '要件定義ミーティング',
      billable: true,
      activityType: 'MEETING',
      status: 'SUBMITTED',
      weekNumber: 12,
      timesheetId: timesheet.id
    },
    {
      consultantId,
      projectId,
      date: new Date('2024-03-19'),
      hours: 7.5,
      description: 'システム設計書作成',
      billable: true,
      activityType: 'DOCUMENTATION',
      status: 'SUBMITTED',
      weekNumber: 12,
      timesheetId: timesheet.id
    },
    {
      consultantId,
      projectId,
      date: new Date('2024-03-20'),
      hours: 8,
      description: 'コード実装とレビュー',
      billable: true,
      activityType: 'DEVELOPMENT',
      status: 'SUBMITTED',
      weekNumber: 12,
      timesheetId: timesheet.id
    },
    {
      consultantId,
      projectId: 'internal-training',
      date: new Date('2024-03-21'),
      hours: 4,
      description: '社内研修参加',
      billable: false,
      activityType: 'TRAINING',
      status: 'SUBMITTED',
      weekNumber: 12,
      timesheetId: timesheet.id
    },
    {
      consultantId,
      projectId,
      date: new Date('2024-03-21'),
      hours: 4,
      description: 'クライアントミーティング',
      billable: true,
      activityType: 'MEETING',
      status: 'SUBMITTED',
      weekNumber: 12,
      timesheetId: timesheet.id
    },
    {
      consultantId,
      projectId,
      date: new Date('2024-03-22'),
      hours: 8.5,
      description: 'テスト実施とバグ修正',
      billable: true,
      activityType: 'DEVELOPMENT',
      status: 'SUBMITTED',
      weekNumber: 12,
      timesheetId: timesheet.id
    }
  ]

  for (const entry of timeEntries) {
    await prisma.timeEntry.create({
      data: entry
    })
  }
  console.log(`Created ${timeEntries.length} time entries.`)

  console.log('Timesheet database seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })