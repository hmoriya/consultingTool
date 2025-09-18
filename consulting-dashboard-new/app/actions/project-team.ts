'use server'

import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { getCurrentUser } from './auth'
import { z } from 'zod'
import { ProjectMember } from '@prisma/project-client'
import { TeamMemberRole, teamMemberRoleUtils, teamMemberRoleSchema } from '@/types/team-member'

export type TeamMemberItem = {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  role: TeamMemberRole
  allocation: number
  startDate: Date
  endDate: Date | null
}

export type TeamMemberStats = {
  totalHours: number
  completedTasks: number
  activeIssues: number
  utilization: number
}

export type AvailableUser = {
  id: string
  name: string
  email: string
  role: {
    name: string
  }
}

// プロジェクトのチームメンバー取得
export async function getProjectTeamMembers(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  const members = await projectDb.projectMember.findMany({
    where: {
      projectId
    },
    orderBy: [
      { role: 'asc' },
      { startDate: 'asc' }
    ]
  })

  // ユーザー情報を取得
  const userIds = [...new Set(members.map(m => m.userId))]
  const users = userIds.length > 0 ? await db.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      name: true,
      email: true
    }
  }) : []

  const userMap = new Map(users.map(u => [u.id, u]))

  return members.map(member => {
    // ロールの検証と変換
    const validatedRole = teamMemberRoleUtils.parseRole(member.role)
    if (!validatedRole) {
      console.warn(`Invalid role detected: ${member.role}, defaulting to CONSULTANT`)
    }
    
    return {
      ...member,
      role: validatedRole || TeamMemberRole.CONSULTANT,
      user: userMap.get(member.userId) || { id: member.userId, name: 'Unknown', email: '' }
    }
  }) as TeamMemberItem[]
}

// プロジェクト全体のチーム統計情報取得
export async function getTeamMemberStats(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // プロジェクトメンバーを取得
  const members = await projectDb.projectMember.findMany({
    where: { projectId },
    select: {
      role: true,
      allocation: true
    }
  })

  // 統計情報を計算
  const totalMembers = members.length
  
  // 平均稼働率（各メンバーの稼働率の平均）
  const averageAllocation = totalMembers > 0 
    ? members.reduce((sum, m) => sum + m.allocation, 0) / totalMembers 
    : 0

  // FTE（Full-Time Equivalent）: フルタイム換算の人数
  // 例：30% + 40% + 50% = 1.2FTE（フルタイム1.2人分の工数）
  const totalFTE = members.reduce((sum, m) => sum + m.allocation / 100, 0)

  // プロジェクトに必要な推定FTE（仮に3人と設定、実際は別途管理すべき）
  const requiredFTE = 3 // TODO: プロジェクトごとに設定可能にする
  const fteUtilization = requiredFTE > 0 ? (totalFTE / requiredFTE) * 100 : 0

  // ロール分布を計算
  const roleDistribution = members.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // PM数を計算（プロジェクトに最低1人は必要）
  const pmCount = members.filter(m => {
    const role = teamMemberRoleUtils.parseRole(m.role)
    return role === TeamMemberRole.PM
  }).length

  return {
    totalMembers,
    averageAllocation,
    totalFTE,
    requiredFTE,
    fteUtilization,
    roleDistribution,
    pmCount,
    // 後方互換性のため残す（UIで段階的に移行）
    totalAllocation: totalFTE * 100 // FTEをパーセント表記に
  }
}

// チームメンバー追加
const addMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['pm', 'lead', 'senior', 'consultant', 'analyst']),
  allocation: z.number().min(0).max(100),
  startDate: z.date()
})

export async function addTeamMember(projectId: string, data: z.infer<typeof addMemberSchema>) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // PM以上の権限チェック
  if (user.role.name !== 'executive' && user.role.name !== 'pm') {
    throw new Error('権限がありません')
  }

  const validatedData = addMemberSchema.parse(data)

  // 既存メンバーチェック
  const existing = await projectDb.projectMember.findFirst({
    where: {
      projectId,
      userId: validatedData.userId
    }
  })

  if (existing) {
    throw new Error('このメンバーは既にプロジェクトに参加しています')
  }

  const member = await projectDb.projectMember.create({
    data: {
      projectId,
      userId: validatedData.userId,
      role: validatedData.role,
      allocation: validatedData.allocation,
      startDate: validatedData.startDate
    }
  })

  // ユーザー情報を取得
  const userData = await db.user.findUnique({
    where: { id: member.userId },
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  return {
    ...member,
    user: userData || { id: member.userId, name: 'Unknown', email: '' }
  } as TeamMemberItem
}

// チームメンバー更新
const updateMemberSchema = z.object({
  role: teamMemberRoleSchema,
  allocation: z.number().min(0).max(100),
  startDate: z.date(),
  endDate: z.date().nullable().optional()
})

export async function updateTeamMember(memberId: string, data: z.infer<typeof updateMemberSchema>) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  if (user.role.name !== 'executive' && user.role.name !== 'pm') {
    throw new Error('権限がありません')
  }

  const validatedData = updateMemberSchema.parse(data)

  const member = await projectDb.projectMember.update({
    where: {
      id: memberId
    },
    data: {
      role: validatedData.role,
      allocation: validatedData.allocation,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate
    }
  })

  // ユーザー情報を取得
  const userData = await db.user.findUnique({
    where: { id: member.userId },
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  return {
    ...member,
    user: userData || { id: member.userId, name: 'Unknown', email: '' }
  } as TeamMemberItem
}

// チームメンバー削除
export async function removeTeamMember(memberId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  if (user.role.name !== 'executive' && user.role.name !== 'pm') {
    throw new Error('権限がありません')
  }

  await projectDb.projectMember.delete({
    where: {
      id: memberId
    }
  })
}

// 利用可能なユーザー取得（プロジェクトに未参加のユーザー）
export async function getAvailableUsers(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // プロジェクトに既に参加しているユーザーIDを取得
  const existingMembers = await projectDb.projectMember.findMany({
    where: { projectId },
    select: { userId: true }
  })
  
  const existingUserIds = existingMembers.map(m => m.userId)

  // コンサルティングファームのユーザーで、プロジェクトに未参加のユーザーを取得
  const availableUsers = await db.user.findMany({
    where: {
      organizationId: user.organizationId,
      id: {
        notIn: existingUserIds
      },
      role: {
        name: {
          in: ['executive', 'pm', 'consultant']
        }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          name: true
        }
      },
      organization: {
        select: {
          name: true
        }
      }
    }
  })

  return availableUsers
}