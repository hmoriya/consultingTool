import { db } from '@/lib/db'
import { resourceDb } from '@/lib/db/resource-db'
import { projectDb } from '@/lib/db/project-db'
import { UserProfile, UserWithRole } from '@/types/user'

export class UserService {
  /**
   * ユーザープロファイルを取得（全サービスから情報を集約）
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    // コアサービスからユーザー基本情報を取得
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        organization: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // リソースサービスからスキル情報を取得
    const userSkills = await resourceDb.userSkill.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            category: true,
          },
        },
      },
    })

    // リソースサービスからチーム情報を取得
    const teamMemberships = await resourceDb.teamMember.findMany({
      where: { userId },
      include: {
        team: true,
      },
    })

    // プロジェクトサービスから現在のプロジェクト情報を取得
    const currentProjects = await projectDb.projectMember.findMany({
      where: {
        userId,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
      include: {
        project: true,
      },
    })

    return {
      ...user,
      skills: userSkills.map(us => ({
        ...us.skill,
        level: us.level,
        experienceYears: us.experienceYears,
      })),
      teams: teamMemberships.map(tm => tm.team),
      currentProjects: currentProjects.map(pm => ({
        ...pm.project,
        role: pm.role,
        allocation: pm.allocation,
      })),
      permissions: user.role.permissions.map(rp => rp.permission),
    }
  }

  /**
   * 組織内のユーザー一覧を取得
   */
  async getOrganizationUsers(organizationId: string): Promise<UserWithRole[]> {
    const users = await db.user.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      include: {
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return users
  }

  /**
   * ユーザーの権限を確認
   */
  async checkUserPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return false
    }

    return user.role.permissions.some(
      rp => rp.permission.resource === resource && rp.permission.action === action
    )
  }

  /**
   * ユーザーの稼働状況サマリーを取得
   */
  async getUserUtilizationSummary(userId: string, date: Date) {
    // リソースサービスから現在の配分を取得
    const allocations = await resourceDb.resourceAllocation.findMany({
      where: {
        userId,
        startDate: { lte: date },
        OR: [
          { endDate: null },
          { endDate: { gte: date } },
        ],
      },
    })

    const totalAllocation = allocations.reduce(
      (sum, a) => sum + a.allocationRate,
      0
    )

    // プロジェクトサービスから担当タスクを取得
    const assignedTasks = await projectDb.task.findMany({
      where: {
        assigneeId: userId,
        status: { in: ['todo', 'in_progress'] },
      },
    })

    return {
      currentAllocation: totalAllocation,
      availableCapacity: 1.0 - totalAllocation,
      activeProjects: allocations.length,
      assignedTasks: assignedTasks.length,
      urgentTasks: assignedTasks.filter(t => t.priority === 'urgent').length,
    }
  }

  /**
   * ユーザーを検索
   */
  async searchUsers(query: {
    keyword?: string
    roleId?: string
    organizationId?: string
    skillIds?: string[]
    isActive?: boolean
  }) {
    // 基本的なユーザー検索
    const users = await db.user.findMany({
      where: {
        ...(query.keyword && {
          OR: [
            { name: { contains: query.keyword } },
            { email: { contains: query.keyword } },
          ],
        }),
        ...(query.roleId && { roleId: query.roleId }),
        ...(query.organizationId && { organizationId: query.organizationId }),
        ...(query.isActive !== undefined && { isActive: query.isActive }),
      },
      include: {
        role: true,
        organization: true,
      },
    })

    // スキルでフィルタリング（指定された場合）
    if (query.skillIds && query.skillIds.length > 0) {
      const userIds = users.map(u => u.id)
      const userSkills = await resourceDb.userSkill.findMany({
        where: {
          userId: { in: userIds },
          skillId: { in: query.skillIds },
        },
      })

      const usersWithSkills = new Set(userSkills.map(us => us.userId))
      return users.filter(u => usersWithSkills.has(u.id))
    }

    return users
  }
}

export const userService = new UserService()