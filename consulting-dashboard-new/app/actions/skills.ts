'use server'

import { db } from '@/lib/db'
import { resourceDb } from '@/lib/db/resource-db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// スキルカテゴリ一覧を取得
export async function getSkillCategories() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return []
  }

  // スキルカテゴリを取得
  const categories = await resourceDb.skillCategory.findMany({
    include: {
      skills: {
        include: {
          users: true
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  // 組織内のユーザーIDリストを取得
  const organizationUsers = await db.user.findMany({
    where: {
      organizationId: user.organizationId
    },
    select: {
      id: true
    }
  })
  const organizationUserIds = organizationUsers.map(u => u.id)

  return categories.map(category => ({
    ...category,
    skills: category.skills.map(skill => ({
      ...skill,
      users: skill.users.filter(userSkill => organizationUserIds.includes(userSkill.userId))
    })),
    skillCount: category.skills.length,
    userCount: category.skills.reduce((acc, skill) => 
      acc + skill.users.filter(userSkill => organizationUserIds.includes(userSkill.userId)).length, 
      0
    )
  }))
}

// スキル一覧を取得
export async function getSkills(categoryId?: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return []
  }

  // 組織内のユーザーIDリストを取得
  const organizationUsers = await db.user.findMany({
    where: {
      organizationId: user.organizationId
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  })
  const userMap = new Map(organizationUsers.map(u => [u.id, u]))

  const skills = await resourceDb.skill.findMany({
    where: categoryId ? { categoryId } : {},
    include: {
      category: true,
      users: true
    },
    orderBy: { name: 'asc' }
  })

  return skills.map(skill => {
    const filteredUsers = skill.users.filter(userSkill => userMap.has(userSkill.userId))
    return {
      ...skill,
      users: filteredUsers.map(userSkill => ({
        ...userSkill,
        user: userMap.get(userSkill.userId)
      })),
      userCount: filteredUsers.length,
      averageLevel: filteredUsers.length > 0
        ? filteredUsers.reduce((acc, userSkill) => acc + userSkill.level, 0) / filteredUsers.length
        : 0
    }
  })
}

// ユーザーのスキルを取得
export async function getUserSkills(userId?: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return []
  }

  // 権限チェック：自分自身またはPM/エグゼクティブ
  if (userId && userId !== user.id && user.role.name !== 'pm' && user.role.name !== 'executive') {
    throw new Error('アクセス権限がありません')
  }

  const targetUserId = userId || user.id

  const userSkills = await resourceDb.userSkill.findMany({
    where: { userId: targetUserId },
    include: {
      skill: {
        include: {
          category: true
        }
      }
    },
    orderBy: [
      { level: 'desc' },
      { skill: { category: { order: 'asc' } } },
      { skill: { name: 'asc' } }
    ]
  })

  return userSkills
}

// スキルカテゴリを作成
export async function createSkillCategory(data: {
  name: string
  order?: number
}) {
  const user = await getCurrentUser()
  if (!user || user.role.name !== 'executive') {
    throw new Error('エグゼクティブのみスキルカテゴリを作成できます')
  }

  const category = await resourceDb.skillCategory.create({
    data: {
      name: data.name,
      order: data.order ?? 0
    }
  })

  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'CREATE',
      resource: 'skill_category',
      resourceId: category.id,
      details: `スキルカテゴリ「${category.name}」を作成しました`
    }
  })

  return category
}

// スキルを作成
export async function createSkill(data: {
  name: string
  categoryId: string
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== 'pm' && user.role.name !== 'executive')) {
    throw new Error('PM以上の権限が必要です')
  }

  const skill = await resourceDb.skill.create({
    data: {
      name: data.name,
      categoryId: data.categoryId
    },
    include: {
      category: true
    }
  })

  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'CREATE',
      resource: 'skill',
      resourceId: skill.id,
      details: `スキル「${skill.name}」を作成しました`
    }
  })

  return skill
}

// ユーザースキルを追加・更新
export async function upsertUserSkill(data: {
  userId?: string
  skillId: string
  level: number
  experienceYears?: number
  certifications?: string[]
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // 権限チェック：自分自身またはPM/エグゼクティブ
  const targetUserId = data.userId || user.id
  if (targetUserId !== user.id && user.role.name !== 'pm' && user.role.name !== 'executive') {
    throw new Error('アクセス権限がありません')
  }

  // 既存のスキルチェック
  const existingSkill = await resourceDb.userSkill.findUnique({
    where: {
      userId_skillId: {
        userId: targetUserId,
        skillId: data.skillId
      }
    }
  })

  const certificationsJson = data.certifications ? JSON.stringify(data.certifications) : null

  if (existingSkill) {
    // 更新
    const updated = await resourceDb.userSkill.update({
      where: {
        id: existingSkill.id
      },
      data: {
        level: data.level,
        experienceYears: data.experienceYears,
        certifications: certificationsJson,
        lastUsedDate: new Date()
      },
      include: {
        skill: true
      }
    })

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE',
        resource: 'user_skill',
        resourceId: updated.id,
        details: `スキル「${updated.skill.name}」のレベルを${data.level}に更新しました`
      }
    })

    revalidatePath('/team/skills')
    return updated
  } else {
    // 新規作成
    const created = await resourceDb.userSkill.create({
      data: {
        userId: targetUserId,
        skillId: data.skillId,
        level: data.level,
        experienceYears: data.experienceYears,
        certifications: certificationsJson,
        lastUsedDate: new Date()
      },
      include: {
        skill: true
      }
    })

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE',
        resource: 'user_skill',
        resourceId: created.id,
        details: `スキル「${created.skill.name}」を追加しました（レベル: ${data.level}）`
      }
    })

    revalidatePath('/team/skills')
    return created
  }
}

// ユーザースキルを削除
export async function deleteUserSkill(userSkillId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  const userSkill = await resourceDb.userSkill.findFirst({
    where: {
      id: userSkillId,
      OR: [
        { userId: user.id },
        ...(user.role.name === 'pm' || user.role.name === 'executive'
          ? [{ user: { organizationId: user.organizationId } }]
          : []
        )
      ]
    },
    include: {
      skill: true
    }
  })

  if (!userSkill) {
    throw new Error('スキルが見つからないか、権限がありません')
  }

  await resourceDb.userSkill.delete({
    where: { id: userSkillId }
  })

  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'DELETE',
      resource: 'user_skill',
      resourceId: userSkillId,
      details: `スキル「${userSkill.skill.name}」を削除しました`
    }
  })

  revalidatePath('/team/skills')
  return { success: true }
}

// スキルを持つメンバーを検索
export async function searchMembersBySkill(skillIds: string[], minLevel?: number) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== 'pm' && user.role.name !== 'executive')) {
    throw new Error('PM以上の権限が必要です')
  }

  // 組織内のユーザーを取得
  const members = await db.user.findMany({
    where: {
      organizationId: user.organizationId
    },
    include: {
      role: true
    }
  })

  // 各ユーザーのスキルを取得
  const membersWithSkills = await Promise.all(
    members.map(async (member) => {
      const userSkills = await resourceDb.userSkill.findMany({
        where: {
          userId: member.id,
          skillId: { in: skillIds },
          level: minLevel ? { gte: minLevel } : undefined
        },
        include: {
          skill: {
            include: {
              category: true
            }
          }
        }
      })

      return {
        ...member,
        matchingSkills: userSkills,
        currentProjects: [], // プロジェクト情報は別サービスにあるため簡略化
        totalAllocation: 0
      }
    })
  )

  // マッチするスキルを持つメンバーのみ返す
  return membersWithSkills.filter(m => m.matchingSkills.length > 0)
}

// プロジェクトに必要なスキルを分析（簡略版）
export async function analyzeProjectSkillGap(projectId: string) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== 'pm' && user.role.name !== 'executive')) {
    throw new Error('PM以上の権限が必要です')
  }

  // マイクロサービス化により、この機能は現在利用できません
  // 将来的にサービス間連携を実装する予定
  return {
    project: {
      id: projectId,
      name: 'プロジェクト',
      memberCount: 0
    },
    skills: []
  }
}