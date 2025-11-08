import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

async function main() {
  console.log('Resetting Parasol database...')
  
  // 既存データを削除
  await parasolDb.testDefinition.deleteMany({})
  await parasolDb.pageDefinition.deleteMany({})
  await parasolDb.useCase.deleteMany({})
  await parasolDb.businessOperation.deleteMany({})
  await parasolDb.businessCapability.deleteMany({})
  await parasolDb.service.deleteMany({})
  
  console.log('Database reset complete.\n')
  
  // フルシードを実行するためにchild_processを使用
  const { exec } = await import('child_process')
  const { promisify } = await import('util')
  const execAsync = promisify(exec)
  
  try {
    await execAsync('npx tsx prisma/seeds/parasol/parasol-seed-full.ts')
  } catch (_error) {
    console.error('Failed to run seed script:', error)
    throw _error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })