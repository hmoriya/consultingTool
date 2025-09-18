import { z } from 'zod'

// TeamMemberRoleをEnumとして定義
export enum TeamMemberRole {
  PM = 'pm',
  LEAD = 'lead',
  SENIOR = 'senior',
  CONSULTANT = 'consultant',
  ANALYST = 'analyst'
}

// Zodスキーマでバリデーション
export const teamMemberRoleSchema = z.nativeEnum(TeamMemberRole)

// 表示用のラベル定義
export const TEAM_MEMBER_ROLE_LABELS: Record<TeamMemberRole, string> = {
  [TeamMemberRole.PM]: 'プロジェクトマネージャー',
  [TeamMemberRole.LEAD]: 'リードコンサルタント',
  [TeamMemberRole.SENIOR]: 'シニアコンサルタント',
  [TeamMemberRole.CONSULTANT]: 'コンサルタント',
  [TeamMemberRole.ANALYST]: 'アナリスト'
} as const

// 表示用の色定義
export const TEAM_MEMBER_ROLE_COLORS: Record<TeamMemberRole, string> = {
  [TeamMemberRole.PM]: 'bg-purple-100 text-purple-700',
  [TeamMemberRole.LEAD]: 'bg-blue-100 text-blue-700',
  [TeamMemberRole.SENIOR]: 'bg-green-100 text-green-700',
  [TeamMemberRole.CONSULTANT]: 'bg-yellow-100 text-yellow-700',
  [TeamMemberRole.ANALYST]: 'bg-gray-100 text-gray-700'
} as const

// ロールの階層（権限レベル）
export const TEAM_MEMBER_ROLE_HIERARCHY: Record<TeamMemberRole, number> = {
  [TeamMemberRole.PM]: 5,
  [TeamMemberRole.LEAD]: 4,
  [TeamMemberRole.SENIOR]: 3,
  [TeamMemberRole.CONSULTANT]: 2,
  [TeamMemberRole.ANALYST]: 1
} as const

// ユーティリティ関数
export const teamMemberRoleUtils = {
  // 文字列からTeamMemberRoleへの安全な変換
  parseRole(value: unknown): TeamMemberRole | null {
    try {
      return teamMemberRoleSchema.parse(value)
    } catch {
      return null
    }
  },

  // ロールのラベルを取得
  getLabel(role: TeamMemberRole): string {
    return TEAM_MEMBER_ROLE_LABELS[role] || role
  },

  // ロールの色を取得
  getColor(role: TeamMemberRole): string {
    return TEAM_MEMBER_ROLE_COLORS[role] || 'bg-gray-100 text-gray-700'
  },

  // ロールの権限レベルを比較
  hasHigherAuthority(role1: TeamMemberRole, role2: TeamMemberRole): boolean {
    return TEAM_MEMBER_ROLE_HIERARCHY[role1] > TEAM_MEMBER_ROLE_HIERARCHY[role2]
  },

  // 有効なロールの一覧を取得
  getAllRoles(): TeamMemberRole[] {
    return Object.values(TeamMemberRole)
  },

  // 選択肢用の配列を取得
  getSelectOptions(): Array<{ value: TeamMemberRole; label: string }> {
    return Object.values(TeamMemberRole).map(role => ({
      value: role,
      label: TEAM_MEMBER_ROLE_LABELS[role]
    }))
  }
}

// TeamMemberのZodスキーマ
export const teamMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string(),
  role: teamMemberRoleSchema,
  allocation: z.number().min(0).max(100),
  startDate: z.date(),
  endDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type TeamMember = z.infer<typeof teamMemberSchema>