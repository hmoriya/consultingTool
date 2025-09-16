import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'

const globalForProjectPrisma = globalThis as unknown as {
  projectPrisma: ProjectPrismaClient | undefined
}

export const projectDb = globalForProjectPrisma.projectPrisma ?? new ProjectPrismaClient({
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL || 'file:./prisma/project-service/data/project.db'
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForProjectPrisma.projectPrisma = projectDb