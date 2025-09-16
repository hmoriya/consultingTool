'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from './auth'
import { z } from 'zod'
import { ProjectMember } from '@prisma/client'

export type TeamMemberRole = 'pm' | 'lead' | 'senior' | 'consultant' | 'analyst'

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

  const members = await db.projectMember.findMany({
    where: {
      projectId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: [
      { role: 'asc' },
      { startDate: 'asc' }
    ]
  })

  return members as unknown as TeamMemberItem[]
}

// プロジェクト全体のチーム統計情報取得
export async function getTeamMemberStats(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // プロジェクトメンバーを取得
  const members = await db.projectMember.findMany({
    where: { projectId },
    select: {
      role: true,
      allocation: true
    }
  })

  // 統計情報を計算
  const totalMembers = members.length
  const totalAllocation = members.reduce((sum, m) => sum + m.allocation, 0)
  const averageAllocation = totalMembers > 0 ? totalAllocation / totalMembers : 0

  // ロール分布を計算
  const roleDistribution = members.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalMembers,
    totalAllocation,
    averageAllocation,
    roleDistribution
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
  const existing = await db.projectMember.findFirst({
    where: {
      projectId,
      userId: validatedData.userId
    }
  })

  if (existing) {
    throw new Error('このメンバーは既にプロジェクトに参加しています')
  }

  const member = await db.projectMember.create({
    data: {
      projectId,
      userId: validatedData.userId,
      role: validatedData.role,
      allocation: validatedData.allocation,
      startDate: validatedData.startDate
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  return member as unknown as TeamMemberItem
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

  await db.projectMember.delete({
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
  const existingMembers = await db.projectMember.findMany({
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