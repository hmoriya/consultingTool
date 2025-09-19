'use server'

import { authDb, projectDb, financeDb } from '@/lib/db'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { calculateUtilization, calculateAverageUtilization } from '@/lib/utils/utilization'

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
    const existing = await financeDb.kPIHistory.findFirst({
      where: {
        date: startDate,
        type,
      },
    })

    if (existing) {
      // 既存の記録を削除（再計算のため）
      await financeDb.kPIHistory.delete({
        where: { id: existing.id },
      })
    }

    // 収益の計算
    const revenues = await financeDb.revenue.aggregate({
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
    const costs = await financeDb.cost.aggregate({
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
    const timeEntries = await financeDb.timeEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        approved: true,
      },
    })

    // ユーザー情報を取得
    const userIds = [...new Set(timeEntries.map(te => te.userId))]
    const users = await authDb.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: {
        role: true,
      },
    })

    // ユーザーIDとロールのマップを作成
    const userRoleMap = new Map(users.map(u => [u.id, u.role.name]))

    // ロール別の標準レート
    const hourlyRates = {
      executive: 20000,
      pm: 15000,
      consultant: 8000,
      analyst: 6000,
      admin: 6000,
    }

    const laborCost = timeEntries.reduce((sum, entry) => {
      const roleName = userRoleMap.get(entry.userId) || 'consultant'
      const rate = hourlyRates[roleName as keyof typeof hourlyRates] || 8000
      return sum + (entry.hours * rate)
    }, 0)

    const totalRevenue = revenues._sum.amount || 0
    const totalCost = (costs._sum.amount || 0) + laborCost
    const totalMargin = totalRevenue - totalCost
    const marginRate = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0

    // アクティブプロジェクト数
    const activeProjects = await projectDb.project.count({
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

    // 稼働メンバーの工数データから稼働率を計算
    const timeEntriesByUser = await financeDb.timeEntry.groupBy({
      by: ['userId'],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        approved: true,
      },
      _sum: {
        hours: true,
      },
    })

    // ユーザーごとの実働時間
    const memberUtilizations = timeEntriesByUser.map(entry => ({
      userId: entry.userId,
      actualHours: entry._sum.hours || 0,
    }))

    const totalMembers = memberUtilizations.length
    const avgUtilization = calculateAverageUtilization(memberUtilizations, startDate, endDate)

    // プロジェクト別KPI
    const projectKPIs = await Promise.all(
      (await projectDb.project.findMany({
        where: { status: 'active' },
        select: { id: true, name: true },
      })).map(async (project) => {
        const projectRevenue = await financeDb.revenue.aggregate({
          where: {
            projectId: project.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: { amount: true },
        })

        const projectCost = await financeDb.cost.aggregate({
          where: {
            projectId: project.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: { amount: true },
        })

        const projectTimeEntries = await financeDb.timeEntry.aggregate({
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
        // まずロールに属するユーザーを取得
        const roleUsers = await authDb.user.findMany({
          where: {
            role: {
              name: roleName,
            },
          },
          select: {
            id: true,
          },
        })

        const userIds = roleUsers.map(u => u.id)
        
        // ロールのユーザーの工数データを取得
        const roleTimeEntries = await financeDb.timeEntry.groupBy({
          by: ['userId'],
          where: {
            userId: {
              in: userIds,
            },
            date: {
              gte: startDate,
              lte: endDate,
            },
            approved: true,
          },
          _sum: {
            hours: true,
          },
        })

        // ロールのメンバーの実働時間
        const roleMemberUtilizations = roleTimeEntries.map(entry => ({
          userId: entry.userId,
          actualHours: entry._sum.hours || 0,
        }))

        const count = roleMemberUtilizations.length
        const avgUtil = calculateAverageUtilization(roleMemberUtilizations, startDate, endDate)

        return {
          role: roleName,
          count,
          avgUtilization: avgUtil,
        }
      })
    )

    // KPI履歴を保存
    const kpiHistory = await financeDb.kPIHistory.create({
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
    const latest = await financeDb.kPIHistory.findFirst({
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
    const history = await financeDb.kPIHistory.findMany({
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