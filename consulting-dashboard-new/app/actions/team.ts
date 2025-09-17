'use server'

import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { getCurrentUser } from './auth'
import { z } from 'zod'
import { User } from '@prisma/client'

export type TeamMemberItem = User & {
  role: {
    id: string
    name: string
    description: string
  }
  projects?: {
    id: string
    name: string
    status: string
    allocation?: number
  }[]
  projectCount?: number
}


// チームメンバー取得
export async function getTeamMembers() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // エグゼクティブとPMのみアクセス可能
  if (user.role.name !== 'Executive' && user.role.name !== 'PM') {
    throw new Error('アクセス権限がありません')
  }

  // ユーザーの組織IDを取得
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true }
  })

  if (!fullUser) {
    throw new Error('ユーザー情報が見つかりません')
  }

  const members = await db.user.findMany({
    where: {
      organizationId: fullUser.organizationId,
      role: {
        name: {
          in: ['Executive', 'PM', 'Consultant']
        }
      }
    },
    include: {
      role: true
    },
    orderBy: [
      {
        role: {
          name: 'asc'
        }
      },
      {
        name: 'asc'
      }
    ]
  })

  // 各メンバーのプロジェクト情報を取得
  const membersWithProjects = await Promise.all(
    members.map(async (member) => {
      const projectMembers = await projectDb.projectMember.findMany({
        where: {
          userId: member.id,
          project: {
            status: 'active'
          }
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              status: true
            }
          }
        }
      })

      const allProjectMembers = await projectDb.projectMember.count({
        where: {
          userId: member.id
        }
      })

      return {
        ...member,
        projects: projectMembers.map(pm => ({
          id: pm.project.id,
          name: pm.project.name,
          status: pm.project.status,
          allocation: pm.allocation
        })),
        projectCount: allProjectMembers
      }
    })
  )

  return membersWithProjects as TeamMemberItem[]
}

// チームメンバー検索
export async function searchTeamMembers(query: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  if (user.role.name !== 'Executive' && user.role.name !== 'PM') {
    throw new Error('アクセス権限がありません')
  }

  // ユーザーの組織IDを取得
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true }
  })

  if (!fullUser) {
    throw new Error('ユーザー情報が見つかりません')
  }

  const members = await db.user.findMany({
    where: {
      organizationId: fullUser.organizationId,
      role: {
        name: {
          in: ['executive', 'pm', 'consultant']
        }
      },
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    },
    include: {
      role: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  // 各メンバーのプロジェクト数を取得
  const membersWithProjectCount = await Promise.all(
    members.map(async (member) => {
      const projectCount = await projectDb.projectMember.count({
        where: {
          userId: member.id
        }
      })

      return {
        ...member,
        projectCount
      }
    })
  )

  return membersWithProjectCount as TeamMemberItem[]
}

// チームメンバー作成
const createMemberSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  name: z.string().min(1, '名前を入力してください'),
  roleId: z.string().uuid('ロールを選択してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
})

export async function createTeamMember(data: z.infer<typeof createMemberSchema>) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  if (user.role.name !== 'Executive' && user.role.name !== 'PM') {
    throw new Error('アクセス権限がありません')
  }

  // ユーザーの組織IDを取得
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true }
  })

  if (!fullUser) {
    throw new Error('ユーザー情報が見つかりません')
  }

  const validatedData = createMemberSchema.parse(data)

  // メールアドレスの重複チェック
  const existingUser = await db.user.findUnique({
    where: { email: validatedData.email }
  })

  if (existingUser) {
    throw new Error('このメールアドレスは既に使用されています')
  }

  // bcryptをインポート
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash(validatedData.password, 10)

  const member = await db.user.create({
    data: {
      email: validatedData.email,
      name: validatedData.name,
      roleId: validatedData.roleId,
      password: hashedPassword,
      organizationId: fullUser.organizationId
    },
    include: {
      role: true
    }
  })

  return member
}

// チームメンバー更新
const updateMemberSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  roleId: z.string().uuid('ロールを選択してください'),
})

export async function updateTeamMember(memberId: string, data: z.infer<typeof updateMemberSchema>) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  if (user.role.name !== 'Executive' && user.role.name !== 'PM') {
    throw new Error('アクセス権限がありません')
  }

  const validatedData = updateMemberSchema.parse(data)

  // ユーザーの組織IDを取得
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true }
  })

  if (!fullUser) {
    throw new Error('ユーザー情報が見つかりません')
  }

  // 同じ組織のメンバーか確認
  const member = await db.user.findFirst({
    where: {
      id: memberId,
      organizationId: fullUser.organizationId
    }
  })

  if (!member) {
    throw new Error('メンバーが見つかりません')
  }

  const updatedMember = await db.user.update({
    where: { id: memberId },
    data: {
      name: validatedData.name,
      roleId: validatedData.roleId
    },
    include: {
      role: true
    }
  })

  return updatedMember
}

// チームメンバー削除
export async function deleteTeamMember(memberId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  if (user.role.name !== 'Executive') {
    throw new Error('エグゼクティブのみメンバーを削除できます')
  }

  // 自分自身は削除できない
  if (user.id === memberId) {
    throw new Error('自分自身は削除できません')
  }

  // ユーザーの組織IDを取得
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true }
  })

  if (!fullUser) {
    throw new Error('ユーザー情報が見つかりません')
  }

  // 同じ組織のメンバーか確認
  const member = await db.user.findFirst({
    where: {
      id: memberId,
      organizationId: fullUser.organizationId
    }
  })

  if (!member) {
    throw new Error('メンバーが見つかりません')
  }

  // アクティブなプロジェクトに参加している場合は削除不可
  const activeProjects = await projectDb.projectMember.count({
    where: {
      userId: memberId,
      project: {
        status: 'active'
      }
    }
  })

  if (activeProjects > 0) {
    throw new Error('アクティブなプロジェクトに参加しているメンバーは削除できません')
  }

  await db.user.delete({
    where: { id: memberId }
  })
}

// メンバーの稼働率を取得
export async function getMemberUtilization(memberId?: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  if (user.role.name !== 'Executive' && user.role.name !== 'PM') {
    throw new Error('アクセス権限がありません')
  }

  // ユーザーの組織IDを取得
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true }
  })

  if (!fullUser) {
    throw new Error('ユーザー情報が見つかりません')
  }

  const whereClause = {
    organizationId: fullUser.organizationId,
    role: {
      name: {
        in: ['pm', 'consultant']
      }
    },
    ...(memberId && { id: memberId })
  }

  const members = await db.user.findMany({
    where: whereClause
  })

  // 各メンバーのプロジェクト情報を取得
  const membersWithProjects = await Promise.all(
    members.map(async (member) => {
      const projectMembers = await projectDb.projectMember.findMany({
        where: {
          userId: member.id,
          project: {
            status: 'active'
          }
        },
        select: {
          allocation: true,
          project: {
            select: {
              name: true,
              clientId: true
            }
          }
        }
      })

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        totalAllocation: projectMembers.reduce((sum, pm) => sum + (pm.allocation || 0), 0),
        projects: projectMembers.map(pm => ({
          name: pm.project.name,
          allocation: pm.allocation || 0
        }))
      }
    })
  )

  return membersWithProjects
}