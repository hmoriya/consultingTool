import { PrismaClient } from '@prisma/timesheet-service'

const globalForPrisma = globalThis as unknown as {
  timesheetPrisma: PrismaClient | undefined
}

export const timesheetDb = globalForPrisma.timesheetPrisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.TIMESHEET_DATABASE_URL || 'file:./timesheet.db'
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.timesheetPrisma = timesheetDb