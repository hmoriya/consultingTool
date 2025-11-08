import { seedDeliverNotifications } from './notification-operations/00-deliver-notifications'
import { seedFacilitateCommunication } from './notification-operations/01-facilitate-communication'

export async function seedNotificationOperationsFull(service: unknown, capability: unknown) {
  console.log('  Seeding notification operations full data...')
  
  const operations = []
  
  // 1. 通知を配信する
  const { operation: operation1 } = await seedDeliverNotifications(service, capability)
  operations.push(operation1)
  
  // 2. コミュニケーションを円滑化する（プロジェクト管理サービスから移動）
  const { operation: operation2 } = await seedFacilitateCommunication(service, capability)
  operations.push(operation2)
  
  console.log(`  ✅ Created ${operations.length} business operations for notification service`)
  
  return { 
    operations,
    count: operations.length
  }
}