'use server'

import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { resourceDb } from '@/lib/db/resource-db'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'

// ユーザーのプロジェクト経験を取得
export async function getUserProjectExperience(userId?: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  const targetUserId = userId || user.id

  // 権限チェック：自分自身またはPM/エグゼクティブ
  if (targetUserId !== user.id && user.role.name !== 'pm' && user.role.name !== 'executive') {
    throw new Error('アクセス権限がありません')
  }

  const projectExperiences = await projectDb.projectMember.findMany({
    where: { userId: targetUserId },
    include: {
      project: {
        include: {
          milestones: true
        }
      },
      skills: true
    },
    orderBy: {
      startDate: 'desc'
    }
  })
  
  // Fetch client information separately
  const projectsWithClients = await Promise.all(
    projectExperiences.map(async (exp) => {
      const client = await db.organization.findUnique({
        where: { id: exp.project.clientId }
      })
      
      // Fetch skill details from resource service
      const skillsWithDetails = await Promise.all(
        exp.skills.map(async (ps) => {
          const skill = await resourceDb.skill.findUnique({
            where: { id: ps.skillId },
            include: { category: true }
          })
          return {
            ...ps,
            skill
          }
        })
      )
      
      return {
        ...exp,
        project: {
          ...exp.project,
          client
        },
        skills: skillsWithDetails
      }
    })
  )

  return projectsWithClients.map(exp => ({
    ...exp,
    duration: exp.endDate 
      ? Math.ceil((new Date(exp.endDate).getTime() - new Date(exp.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
      : Math.ceil((new Date().getTime() - new Date(exp.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
  }))
}

// プロジェクト経験を更新
export async function updateProjectExperience(
  projectMemberId: string,
  data: {
    achievements?: string
    responsibilities?: string
    endDate?: Date | null
  }
) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // 権限チェック
  const projectMember = await projectDb.projectMember.findFirst({
    where: {
      id: projectMemberId,
      OR: [
        { userId: user.id },
        ...(user.role.name === 'pm' || user.role.name === 'executive'
          ? [{ project: { projectMembers: { some: { userId: user.id, role: 'pm' } } } }]
          : []
        )
      ]
    },
    include: {
      project: true
    }
  })

  if (!projectMember) {
    throw new Error('プロジェクト経験が見つからないか、権限がありません')
  }

  const updated = await projectDb.projectMember.update({
    where: { id: projectMemberId },
    data: {
      achievements: data.achievements,
      responsibilities: data.responsibilities,
      endDate: data.endDate
    }
  })

  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'project_member',
      resourceId: projectMemberId,
      details: `プロジェクト「${projectMember.project.name}」の経験情報を更新しました`
    }
  })

  revalidatePath(`/team/experience`)
  return updated
}

// プロジェクトで使用したスキルを追加
export async function addProjectSkill(
  projectMemberId: string,
  skillId: string,
  usageLevel: number
) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // 権限チェック
  const projectMember = await projectDb.projectMember.findFirst({
    where: {
      id: projectMemberId,
      OR: [
        { userId: user.id },
        ...(user.role.name === 'pm' || user.role.name === 'executive'
          ? [{ project: { projectMembers: { some: { userId: user.id, role: 'pm' } } } }]
          : []
        )
      ]
    },
    include: {
      project: true,
      skills: true
    }
  })

  if (!projectMember) {
    throw new Error('プロジェクト経験が見つからないか、権限がありません')
  }

  // 既存チェック
  const existing = projectMember.skills.find(s => s.skillId === skillId)
  if (existing) {
    // 更新
    await projectDb.projectMemberSkill.update({
      where: { id: existing.id },
      data: { usageLevel }
    })
  } else {
    // 新規作成
    await projectDb.projectMemberSkill.create({
      data: {
        projectMemberId,
        skillId,
        usageLevel
      }
    })
  }

  // UserSkillも更新（最終使用日）
  await resourceDb.userSkill.updateMany({
    where: {
      userId: projectMember.userId,
      skillId
    },
    data: {
      lastUsedDate: new Date()
    }
  })

  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'CREATE',
      resource: 'project_member_skill',
      resourceId: projectMemberId,
      details: `プロジェクト「${projectMember.project.name}」でのスキル使用を記録しました`
    }
  })

  revalidatePath(`/team/experience`)
  return { success: true }
}

// プロジェクトで使用したスキルを削除
export async function removeProjectSkill(
  projectMemberId: string,
  skillId: string
) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // 権限チェック
  const projectMember = await projectDb.projectMember.findFirst({
    where: {
      id: projectMemberId,
      OR: [
        { userId: user.id },
        ...(user.role.name === 'pm' || user.role.name === 'executive'
          ? [{ project: { projectMembers: { some: { userId: user.id, role: 'pm' } } } }]
          : []
        )
      ]
    }
  })

  if (!projectMember) {
    throw new Error('プロジェクト経験が見つからないか、権限がありません')
  }

  await projectDb.projectMemberSkill.deleteMany({
    where: {
      projectMemberId,
      skillId
    }
  })

  revalidatePath(`/team/experience`)
  return { success: true }
}

// チームメンバーのプロジェクト経験を検索
export async function searchProjectExperiences(filters: {
  userId?: string
  clientId?: string
  skillIds?: string[]
  role?: string
  startDate?: Date
  endDate?: Date
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== 'pm' && user.role.name !== 'executive')) {
    throw new Error('PM以上の権限が必要です')
  }

  const where: unknown = {
    user: {
      organizationId: user.organizationId
    }
  }

  if (filters.userId) where.userId = filters.userId
  if (filters.clientId) where.project = { clientId: filters.clientId }
  if (filters.role) where.role = filters.role
  if (filters.skillIds?.length) {
    where.skills = {
      some: {
        skillId: { in: filters.skillIds }
      }
    }
  }
  if (filters.startDate || filters.endDate) {
    where.startDate = {}
    if (filters.startDate) where.startDate.gte = filters.startDate
    if (filters.endDate) where.startDate.lte = filters.endDate
  }

  const experiences = await projectDb.projectMember.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      project: true,
      skills: true
    },
    orderBy: [
      { startDate: 'desc' },
      { project: { name: 'asc' } }
    ]
  })

  // Fetch additional data from other services
  const experiencesWithDetails = await Promise.all(
    experiences.map(async (exp) => {
      // Fetch client information
      const client = await db.organization.findUnique({
        where: { id: exp.project.clientId }
      })
      
      // Fetch skill details
      const skillsWithDetails = await Promise.all(
        exp.skills.map(async (ps) => {
          const skill = await resourceDb.skill.findUnique({
            where: { id: ps.skillId },
            include: { category: true }
          })
          return {
            ...ps,
            skill
          }
        })
      )
      
      return {
        ...exp,
        project: {
          ...exp.project,
          client
        },
        skills: skillsWithDetails
      }
    })
  )
  
  return experiencesWithDetails
}