/**
 * ロール定義の定数
 * プロジェクトメンバーのロールとユーザーロールを統一管理
 */

// プロジェクトメンバーのロール
export const PROJECT_MEMBER_ROLES = {
  PM: 'pm',
  MEMBER: 'member',
  REVIEWER: 'reviewer',
  OBSERVER: 'observer'
} as const

// ユーザーのシステムロール（Auth DB）
export const USER_ROLES = {
  EXECUTIVE: 'Executive',
  PM: 'PM',
  CONSULTANT: 'Consultant',
  CLIENT: 'Client',
  ADMIN: 'Admin'
} as const

// 型定義
export type ProjectMemberRole = typeof PROJECT_MEMBER_ROLES[keyof typeof PROJECT_MEMBER_ROLES]
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// ロールの表示名
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  // プロジェクトメンバーロール
  [PROJECT_MEMBER_ROLES.PM]: 'プロジェクトマネージャー',
  [PROJECT_MEMBER_ROLES.MEMBER]: 'メンバー',
  [PROJECT_MEMBER_ROLES.REVIEWER]: 'レビュアー',
  [PROJECT_MEMBER_ROLES.OBSERVER]: 'オブザーバー',

  // ユーザーロール
  [USER_ROLES.EXECUTIVE]: 'エグゼクティブ',
  [USER_ROLES.PM]: 'プロジェクトマネージャー',
  [USER_ROLES.CONSULTANT]: 'コンサルタント',
  [USER_ROLES.CLIENT]: 'クライアント',
  [USER_ROLES.ADMIN]: '管理者'
}

// ユーザーロールからプロジェクトメンバーロールへのマッピング
export const USER_TO_PROJECT_ROLE_MAP: Record<string, ProjectMemberRole> = {
  [USER_ROLES.PM]: PROJECT_MEMBER_ROLES.PM,
  [USER_ROLES.CONSULTANT]: PROJECT_MEMBER_ROLES.MEMBER,
  [USER_ROLES.EXECUTIVE]: PROJECT_MEMBER_ROLES.REVIEWER,
  [USER_ROLES.CLIENT]: PROJECT_MEMBER_ROLES.OBSERVER,
  [USER_ROLES.ADMIN]: PROJECT_MEMBER_ROLES.PM
}