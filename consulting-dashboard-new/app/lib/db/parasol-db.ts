import { PrismaClient } from '@prisma/parasol-client'

const globalForPrisma = globalThis as unknown as {
  parasolDb: PrismaClient | undefined
}

export const parasolDb = globalForPrisma.parasolDb ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.PARASOL_DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.parasolDb = parasolDb