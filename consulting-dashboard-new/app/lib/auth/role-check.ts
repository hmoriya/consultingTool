import { USER_ROLES, PROJECT_MEMBER_ROLES } from '@/constants/roles'

/**
 * ユーザーのロールをチェックする関数
 * 大文字小文字を区別せずに比較し、定数との整合性を保つ
 */
export function hasUserRole(userRole: string | undefined, targetRole: keyof typeof USER_ROLES): boolean {
  if (!userRole) return false
  
  const normalizedUserRole = userRole.toUpperCase()
  const normalizedTargetRole = USER_ROLES[targetRole].toUpperCase()
  
  return normalizedUserRole === normalizedTargetRole
}

/**
 * 複数のロールのいずれかを持っているかチェック
 */
export function hasAnyUserRole(userRole: string | undefined, targetRoles: Array<keyof typeof USER_ROLES>): boolean {
  if (!userRole) return false
  
  return targetRoles.some(role => hasUserRole(userRole, role))
}

/**
 * プロジェクトメンバーのロールをチェックする関数
 */
export function hasProjectRole(memberRole: string | undefined, targetRole: keyof typeof PROJECT_MEMBER_ROLES): boolean {
  if (!memberRole) return false
  
  const normalizedMemberRole = memberRole.toLowerCase()
  const normalizedTargetRole = PROJECT_MEMBER_ROLES[targetRole].toLowerCase()
  
  return normalizedMemberRole === normalizedTargetRole
}

/**
 * 複数のプロジェクトロールのいずれかを持っているかチェック
 */
export function hasAnyProjectRole(memberRole: string | undefined, targetRoles: Array<keyof typeof PROJECT_MEMBER_ROLES>): boolean {
  if (!memberRole) return false
  
  return targetRoles.some(role => hasProjectRole(memberRole, role))
}