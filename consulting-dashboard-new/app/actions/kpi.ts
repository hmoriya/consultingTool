'use server'

import { authDb, projectDb, financeDb } from '@/lib/db'
import { timesheetDb } from '@/lib/db/timesheet-db'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { calculateAverageUtilization } from '@/lib/utils/utilization'

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (financeDb as any).KPIHistory.findFirst({
      where: {
        date: startDate,
        type,
      },
    })

    if (existing) {
      // 既存の記録を削除（再計算のため）
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (financeDb as any).KPIHistory.delete({
        where: { id: existing.id },
      })
    }

    // 収益の計算
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const revenues = await (financeDb as any).revenue.aggregate({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const costs = await (financeDb as any).cost.aggregate({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timeEntries = await (timesheetDb as any).timeEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        approved: true,
      },
    })

    // ユーザー情報を取得
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userIds = [...new Set(timeEntries.map((te: any) => te.userId))]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users = await (authDb as any).user.findMany({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRoleMap = new Map(users.map((u: any) => [u.id, u.role.name]))

    // ロール別の標準レート
    const hourlyRates = {
      executive: 20000,
      pm: 15000,
      consultant: 8000,
      analyst: 6000,
      admin: 6000,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const laborCost = timeEntries.reduce((sum: number, entry: any) => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timeEntriesByUser = await (timesheetDb as any).timeEntry.groupBy({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memberUtilizations = timeEntriesByUser.map((entry: any) => ({
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })).map(async (project: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const projectRevenue = await (financeDb as any).revenue.aggregate({
          where: {
            projectId: project.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: { amount: true },
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const projectCost = await (financeDb as any).cost.aggregate({
          where: {
            projectId: project.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: { amount: true },
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const projectTimeEntries = await (timesheetDb as any).timeEntry.aggregate({
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['executive', 'pm', 'consultant', 'analyst'].map(async (roleName: any) => {
        // まずロールに属するユーザーを取得
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roleUsers = await (authDb as any).user.findMany({
          where: {
            role: {
              name: roleName,
            },
          },
          select: {
            id: true,
          },
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userIds = roleUsers.map((u: any) => u.id)
        
        // ロールのユーザーの工数データを取得
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roleTimeEntries = await (timesheetDb as any).timeEntry.groupBy({
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roleMemberUtilizations = roleTimeEntries.map((entry: any) => ({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kpiHistory = await (financeDb as any).KPIHistory.create({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const latest = await (financeDb as any).KPIHistory.findFirst({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const history = await (financeDb as any).KPIHistory.findMany({
      where: { type },
      orderBy: { date: 'desc' },
      take: count,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return history.reverse().map((kpi: any) => ({
      ...kpi,
      projectKPIs: kpi.projectKPIs ? JSON.parse(kpi.projectKPIs as string) : [],
      roleKPIs: kpi.roleKPIs ? JSON.parse(kpi.roleKPIs as string) : [],
    }))
  } catch (error) {
    console.error('Get KPI history error:', error)
    return []
  }
}