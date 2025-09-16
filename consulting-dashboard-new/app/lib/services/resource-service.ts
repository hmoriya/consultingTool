import { resourceDb } from '@/lib/db/resource-db'
import { db } from '@/lib/db'
import { ResourceAllocation, SkillWithLevel, TeamMemberWithUser } from '@/types/resource'

export class ResourceService {
  /**
   * チーム一覧を取得（メンバー情報付き）
   */
  async getTeamsWithMembers() {
    const teams = await resourceDb.team.findMany({
      where: { isActive: true },
      include: {
        members: true,
        childTeams: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    // メンバーのユーザー情報を取得
    const memberUserIds = [...new Set(
      teams.flatMap(t => t.members.map(m => m.userId))
    )]
    const users = await db.user.findMany({
      where: {
        id: { in: memberUserIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    const userMap = new Map(users.map(u => [u.id, u]))

    // チームメンバーにユーザー情報を追加
    teams.forEach(team => {
      team.members.forEach(member => {
        const memberWithUser = member as TeamMemberWithUser
        memberWithUser.user = userMap.get(member.userId) || undefined
      })
    })

    return teams
  }

  /**
   * ユーザーのスキルを取得
   */
  async getUserSkills(userId: string): Promise<SkillWithLevel[]> {
    const userSkills = await resourceDb.userSkill.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [
        { skill: { category: { order: 'asc' } } },
        { level: 'desc' },
      ],
    })

    return userSkills.map(us => ({
      ...us.skill,
      userLevel: us.level,
      experienceYears: us.experienceYears,
      lastUsedDate: us.lastUsedDate,
    }))
  }

  /**
   * スキルを持つユーザーを検索
   */
  async findUsersBySkills(skillIds: string[], minLevel?: number) {
    const userSkills = await resourceDb.userSkill.findMany({
      where: {
        skillId: { in: skillIds },
        ...(minLevel && { level: { gte: minLevel } }),
      },
      include: {
        skill: true,
      },
    })

    // ユーザー情報を取得
    const userIds = [...new Set(userSkills.map(us => us.userId))]
    const users = await db.user.findMany({
      where: {
        id: { in: userIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    // ユーザーごとにスキル情報をまとめる
    const userSkillMap = new Map<string, typeof userSkills>()
    userSkills.forEach(us => {
      if (!userSkillMap.has(us.userId)) {
        userSkillMap.set(us.userId, [])
      }
      userSkillMap.get(us.userId)!.push(us)
    })

    return users.map(user => ({
      ...user,
      skills: userSkillMap.get(user.id) || [],
    }))
  }

  /**
   * リソースの稼働状況を確認
   */
  async checkResourceAvailability(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ResourceAllocation[]> {
    const allocations = await resourceDb.resourceAllocation.findMany({
      where: {
        userId,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
          {
            startDate: { lte: endDate },
            endDate: null,
          },
        ],
      },
      orderBy: {
        startDate: 'asc',
      },
    })

    return allocations
  }

  /**
   * リソース配分を作成
   */
  async createResourceAllocation(input: {
    userId: string
    projectId: string
    allocationRate: number
    startDate: Date
    endDate?: Date
    role: string
    billableRate?: number
  }) {
    // 既存の配分と衝突しないか確認
    const existingAllocations = await this.checkResourceAvailability(
      input.userId,
      input.startDate,
      input.endDate || new Date('2099-12-31')
    )

    // 合計稼働率を計算
    const totalAllocation = existingAllocations.reduce(
      (sum, a) => sum + a.allocationRate,
      0
    ) + input.allocationRate

    if (totalAllocation > 1.0) {
      throw new Error(`Resource over-allocated. Total allocation: ${totalAllocation * 100}%`)
    }

    return await resourceDb.resourceAllocation.create({
      data: {
        userId: input.userId,
        projectId: input.projectId,
        allocationRate: input.allocationRate,
        startDate: input.startDate,
        endDate: input.endDate,
        role: input.role,
        billableRate: input.billableRate,
        status: 'planned',
      },
    })
  }

  /**
   * チームのキャパシティを計算
   */
  async calculateTeamCapacity(
    teamId: string,
    startDate: Date,
    endDate: Date
  ) {
    const team = await resourceDb.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
      },
    })

    if (!team) {
      throw new Error('Team not found')
    }

    // チームメンバーの稼働状況を取得
    const memberCapacities = await Promise.all(
      team.members.map(async (member) => {
        const allocations = await this.checkResourceAvailability(
          member.userId,
          startDate,
          endDate
        )

        const totalAllocation = allocations.reduce(
          (sum, a) => sum + a.allocationRate,
          0
        )

        return {
          userId: member.userId,
          availableCapacity: 1.0 - totalAllocation,
          allocations,
        }
      })
    )

    const totalAvailableCapacity = memberCapacities.reduce(
      (sum, mc) => sum + mc.availableCapacity,
      0
    )

    return {
      teamId,
      totalMembers: team.members.length,
      totalAvailableCapacity,
      memberCapacities,
    }
  }

  /**
   * スキルギャップ分析
   */
  async analyzeSkillGap(requiredSkills: { skillId: string; level: number }[]) {
    const gaps = []

    for (const required of requiredSkills) {
      const userSkills = await resourceDb.userSkill.findMany({
        where: {
          skillId: required.skillId,
          level: { gte: required.level },
        },
      })

      const availableCount = userSkills.length
      const averageLevel = userSkills.length > 0
        ? userSkills.reduce((sum, us) => sum + us.level, 0) / userSkills.length
        : 0

      gaps.push({
        skillId: required.skillId,
        requiredLevel: required.level,
        availableCount,
        averageLevel,
        gap: required.level - averageLevel,
      })
    }

    return gaps
  }
}

export const resourceService = new ResourceService()