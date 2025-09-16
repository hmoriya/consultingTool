import { PrismaClient as ResourcePrismaClient } from '@prisma/resource-client'

const globalForResourcePrisma = globalThis as unknown as {
  resourcePrisma: ResourcePrismaClient | undefined
}

export const resourceDb = globalForResourcePrisma.resourcePrisma ?? new ResourcePrismaClient({
  datasources: {
    db: {
      url: process.env.RESOURCE_DATABASE_URL || 'file:./prisma/resource-service/data/resource.db'
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForResourcePrisma.resourcePrisma = resourceDb