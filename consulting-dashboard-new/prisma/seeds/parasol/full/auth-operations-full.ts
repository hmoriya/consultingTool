// 認証・組織管理サービスのビジネスオペレーション（フルスペック）

export async function seedAuthOperationsFull(service: any, capability: any) {
  console.log('  Creating auth business operations...')
  
  // 1. ユーザーを登録・管理する
  const { seedRegisterAndManageUsers } = await import('./auth-operations/01-register-and-manage-users')
  await seedRegisterAndManageUsers(service, capability)
  
  // 2. 組織構造を管理する
  const { seedManageOrganizationStructure } = await import('./auth-operations/02-manage-organization-structure')
  await seedManageOrganizationStructure(service, capability)
  
  // 3. アクセス権限を制御する
  const { seedControlAccessPermissions } = await import('./auth-operations/03-control-access-permissions')
  await seedControlAccessPermissions(service, capability)
  
  // 4. 認証を実行する
  const { seedExecuteAuthentication } = await import('./auth-operations/04-execute-authentication')
  await seedExecuteAuthentication(service, capability)
  
  // 5. 監査ログを記録する
  const { seedRecordAuditLogs } = await import('./auth-operations/05-record-audit-logs')
  await seedRecordAuditLogs(service, capability)
  
  console.log('  ✅ Created 5 business operations for auth service')
}