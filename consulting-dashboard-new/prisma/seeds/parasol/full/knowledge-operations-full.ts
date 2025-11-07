import { seedCaptureKnowledge } from './knowledge-operations/01-capture-knowledge'
import { seedSearchAndUtilize } from './knowledge-operations/02-search-and-utilize'
import { seedShareKnowledge } from './knowledge-operations/03-share-knowledge'
import { seedExtractBestPractices } from './knowledge-operations/04-extract-best-practices'

// 知識管理サービスのビジネスオペレーション群
export async function seedKnowledgeOperationsFull(service: unknown, capability: unknown) {
  console.log('  Creating knowledge business operations...')
  
  // 知識を収集・整理する
  await seedCaptureKnowledge(service, capability)
  
  // 知識を検索・活用する
  await seedSearchAndUtilize(service, capability)
  
  // 知識を共有・伝承する
  await seedShareKnowledge(service, capability)
  
  // ベストプラクティスを抽出する
  await seedExtractBestPractices(service, capability)
}