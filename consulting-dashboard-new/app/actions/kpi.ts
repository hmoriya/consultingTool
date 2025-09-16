'use server'

import { prisma } from '@/lib/db'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

// KPIを計算して保存（日次/週次/月次）
export async function calculateAndSaveKPIs(date: Date, type: 'daily' | 'weekly' | 'monthly') {
  let startDate: Date
  let endDate: Date

  switch (type) {
    case 'daily':
      startDate = startOfDay(date)
      endDate = endOfDay(date)
      break
    case 'weekly':
      startDate = startOfWeek(date, { weekStartsOn: 1 })
      endDate = endOfWeek(date, { weekStartsOn: 1 })
      break
    case 'monthly':
      startDate = startOfMonth(date)
      endDate = endOfMonth(date)
      break
  }

  try {
    // 既存のKPI記録をチェック
    const existing = await prisma.kPIHistory.findFirst({
      where: {
        date: startDate,
        type,
      },
    })

    if (existing) {
      // 既存の記録を削除（再計算のため）
      await prisma.kPIHistory.delete({
        where: { id: existing.id },
      })
    }

    // 収益の計算
    const revenues = await prisma.revenue.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: 'paid',
      },
      _sum: {
        amount: true,
      },
    })

    // コストの計算
    const costs = await prisma.cost.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        approved: true,
      },
      _sum: {
        amount: true,
      },
    })

    // 工数ベースの人件費計算
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        approved: true,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    })

    // ロール別の標準レート
    const hourlyRates = {
      executive: 20000,
      pm: 15000,
      consultant: 8000,
      analyst: 6000,
      admin: 6000,
    }

    const laborCost = timeEntries.reduce((sum, entry) => {
      const rate = hourlyRates[entry.user.role.name as keyof typeof hourlyRates] || 8000
      return sum + (entry.hours * rate)
    }, 0)

    const totalRevenue = revenues._sum.amount || 0
    const totalCost = (costs._sum.amount || 0) + laborCost
    const totalMargin = totalRevenue - totalCost
    const marginRate = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0

    // アクティブプロジェクト数
    const activeProjects = await prisma.project.count({
      where: {
        status: 'active',
        startDate: {
          lte: endDate,
        },
        OR: [
          { endDate: null },
          { endDate: { gte: startDate } },
        ],
      },
    })

    // 稼働メンバー数と平均稼働率
    const projectMembers = await prisma.projectMember.findMany({
      where: {
        project: {
          status: 'active',
        },
        startDate: {
          lte: endDate,
        },
        OR: [
          { endDate: null },
          { endDate: { gte: startDate } },
        ],
      },
      include: {
        user: true,
      },
    })

    // ユーザーごとの合計稼働率を計算
    const userUtilization = projectMembers.reduce((acc, member) => {
      if (!acc[member.userId]) {
        acc[member.userId] = 0
      }
      acc[member.userId] += member.allocation
      return acc
    }, {} as Record<string, number>)

    const totalMembers = Object.keys(userUtilization).length
    const avgUtilization = totalMembers > 0
      ? Object.values(userUtilization).reduce((sum, util) => sum + util, 0) / totalMembers
      : 0

    // プロジェクト別KPI
    const projectKPIs = await Promise.all(
      (await prisma.project.findMany({
        where: { status: 'active' },
        select: { id: true, name: true },
      })).map(async (project) => {
        const projectRevenue = await prisma.revenue.aggregate({
          where: {
            projectId: project.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: { amount: true },
        })

        const projectCost = await prisma.cost.aggregate({
          where: {
            projectId: project.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: { amount: true },
        })

        const projectTimeEntries = await prisma.timeEntry.aggregate({
          where: {
            projectId: project.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
            approved: true,
          },
          _sum: { hours: true },
        })

        return {
          projectId: project.id,
          projectName: project.name,
          revenue: projectRevenue._sum.amount || 0,
          cost: projectCost._sum.amount || 0,
          hours: projectTimeEntries._sum.hours || 0,
        }
      })
    )

    // ロール別KPI
    const roleKPIs = await Promise.all(
      ['executive', 'pm', 'consultant', 'analyst'].map(async (roleName) => {
        const roleMembers = await prisma.user.findMany({
          where: {
            role: {
              name: roleName,
            },
            projectMembers: {
              some: {
                project: {
                  status: 'active',
                },
              },
            },
          },
          include: {
            projectMembers: {
              where: {
                project: {
                  status: 'active',
                },
              },
            },
          },
        })

        const count = roleMembers.length
        const avgUtil = count > 0
          ? roleMembers.reduce((sum, user) => 
              sum + user.projectMembers.reduce((s, pm) => s + pm.allocation, 0), 0
            ) / count
          : 0

        return {
          role: roleName,
          count,
          avgUtilization: avgUtil,
        }
      })
    )

    // KPI履歴を保存
    const kpiHistory = await prisma.kPIHistory.create({
      data: {
        date: startDate,
        type,
        totalRevenue,
        totalCost,
        totalMargin,
        marginRate,
        avgUtilization,
        activeProjects,
        totalMembers,
        projectKPIs: JSON.stringify(projectKPIs),
        roleKPIs: JSON.stringify(roleKPIs),
      },
    })

    return {
      success: true,
      data: kpiHistory,
    }
  } catch (error) {
    console.error('KPI calculation error:', error)
    return {
      success: false,
      error: 'KPI計算に失敗しました',
    }
  }
}

// 最新のKPIを取得
export async function getLatestKPIs(type: 'daily' | 'weekly' | 'monthly') {
  try {
    const latest = await prisma.kPIHistory.findFirst({
      where: { type },
      orderBy: { date: 'desc' },
    })

    if (!latest) {
      // KPIがない場合は現在の日付で計算
      const result = await calculateAndSaveKPIs(new Date(), type)
      return result.data
    }

    // JSONデータをパース
    const projectKPIs = latest.projectKPIs ? JSON.parse(latest.projectKPIs as string) : []
    const roleKPIs = latest.roleKPIs ? JSON.parse(latest.roleKPIs as string) : []

    return {
      ...latest,
      projectKPIs,
      roleKPIs,
    }
  } catch (error) {
    console.error('Get latest KPIs error:', error)
    return null
  }
}

// KPI履歴を取得（チャート用）
export async function getKPIHistory(type: 'daily' | 'weekly' | 'monthly', count: number = 30) {
  try {
    const history = await prisma.kPIHistory.findMany({
      where: { type },
      orderBy: { date: 'desc' },
      take: count,
    })

    return history.reverse().map(kpi => ({
      ...kpi,
      projectKPIs: kpi.projectKPIs ? JSON.parse(kpi.projectKPIs as string) : [],
      roleKPIs: kpi.roleKPIs ? JSON.parse(kpi.roleKPIs as string) : [],
    }))
  } catch (error) {
    console.error('Get KPI history error:', error)
    return []
  }
}