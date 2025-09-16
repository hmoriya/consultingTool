import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'

const globalForPrisma = globalThis as unknown as {
  timesheetPrisma: TimesheetPrismaClient | undefined
}

export const timesheetDb =
  globalForPrisma.timesheetPrisma ??
  new TimesheetPrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.TIMESHEET_DATABASE_URL || 'file:./prisma/timesheet-service/data/timesheet.db'
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.timesheetPrisma = timesheetDb