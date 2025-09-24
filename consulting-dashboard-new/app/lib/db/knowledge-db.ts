import { PrismaClient as KnowledgePrismaClient } from '@/prisma/knowledge-service/generated/client'

const globalForKnowledgeDb = globalThis as unknown as {
  knowledgeDb: KnowledgePrismaClient | undefined
}

export const knowledgeDb = globalForKnowledgeDb.knowledgeDb ?? 
  new KnowledgePrismaClient({
    log: ['error', 'warn']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForKnowledgeDb.knowledgeDb = knowledgeDb
}