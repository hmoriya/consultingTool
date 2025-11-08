'use server'

import { authDb, projectDb, financeDb } from '@/lib/db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { hasUserRole } from '@/lib/auth/role-check'
import { calculateUtilization } from '@/lib/utils/utilization'

export async function getDashboardData() {
  const user = await getCurrentUser()
  if (!user || !hasUserRole(user.role.name, 'EXECUTIVE')) {
    redirect('/login')
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  // 最新のKPIデータを取得または計算
  const { getLatestKPIs, calculateAndSaveKPIs } = await import('./kpi')
  let monthlyKPI = await getLatestKPIs('monthly')
  
  // 今月のKPIがない場合は計算
  if (!monthlyKPI || new Date(monthlyKPI.date).getMonth() !== now.getMonth()) {
    const result = await calculateAndSaveKPIs(now, 'monthly')
    monthlyKPI = result.data
  }

  // プロジェクトサマリー
  const projects = await projectDb.project.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      code: true,
      status: true,
      budget: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      organizationId: true,
      clientId: true,
      client: {
        select: {
          id: true,
          name: true,
          industry: true,
        },
      },
      _count: {
        select: {
          projectMembers: true,
          tasks: true,
        },
      },
      tasks: {
        select: {
          status: true,
        },
      },
    },
  })

  // プロジェクトごとの最新メトリクスを計算
  const projectsWithMetrics = await Promise.all(
    projects.map(async (project) => {
      // 今月の収益
      const revenue = await financeDb.revenue.aggregate({
        where: {
          projectId: project.id,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
          status: 'paid',
        },
        _sum: { amount: true },
      })

      // 今月のコスト
      const cost = await financeDb.cost.aggregate({
        where: {
          projectId: project.id,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
          approved: true,
        },
        _sum: { amount: true },
      })

      // 今月の工数
      await financeDb.timeEntry.aggregate({
        where: {
          projectId: project.id,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
          approved: true,
        },
        _sum: { hours: true },
        _avg: { hours: true },
      })

      // プロジェクトメンバーの稼働率
      const members = await projectDb.projectMember.findMany({
        where: { projectId: project.id },
        select: { allocation: true },
      })
      
      const avgUtilization = members.length > 0
        ? members.reduce((sum, m) => sum + m.allocation, 0) / members.length
        : 0

      // 進捗率（完了タスク / 全タスク）
      const completedTasks = project.tasks.filter(t => t.status === 'completed').length
      const progressRate = project._count.tasks > 0
        ? (completedTasks / project._count.tasks) * 100
        : 0

      const projectRevenue = revenue._sum.amount || 0
      const projectCost = cost._sum.amount || 0
      const margin = projectRevenue - projectCost

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        code: project.code,
        status: project.status,
        budget: project.budget,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        organizationId: project.organizationId,
        clientId: project.clientId,
        client: project.client,
        _count: project._count,
        tasks: project.tasks,
        latestMetrics: {
          revenue: projectRevenue,
          cost: projectCost,
          margin,
          utilization: avgUtilization * 100,
          progressRate,
        },
      }
    })
  )

  // 月別の収益データ集計（過去6ヶ月）
  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
    
    // 収益集計
    const monthRevenue = await financeDb.revenue.aggregate({
      where: {
        date: {
          gte: mStart,
          lte: mEnd,
        },
        status: 'paid',
      },
      _sum: { amount: true },
    })
    
    // コスト集計
    const monthCost = await financeDb.cost.aggregate({
      where: {
        date: {
          gte: mStart,
          lte: mEnd,
        },
        approved: true,
      },
      _sum: { amount: true },
    })

    // 工数ベースの人件費を追加
    const monthTimeEntries = await financeDb.timeEntry.findMany({
      where: {
        date: {
          gte: mStart,
          lte: mEnd,
        },
        approved: true,
      },
    })

    // ユーザー情報を取得
    const userIds = [...new Set(monthTimeEntries.map(te => te.userId))]
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

    const hourlyRates: Record<string, number> = {
      executive: 20000,
      pm: 15000,
      consultant: 8000,
      analyst: 6000,
      admin: 6000,
    }

    const laborCost = monthTimeEntries.reduce((sum, entry) => {
      const roleName = userRoleMap.get(entry.userId) || 'consultant'
      const rate = hourlyRates[roleName] || 8000
      return sum + (entry.hours * rate)
    }, 0)
    
    const revenue = monthRevenue._sum.amount || 0
    const cost = (monthCost._sum.amount || 0) + laborCost
    const margin = revenue - cost
    
    monthlyData.push({
      month: mStart.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }),
      revenue,
      cost,
      margin,
      marginRate: revenue > 0 ? (margin / revenue) * 100 : 0,
    })
  }

  // 前月との比較計算
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
  
  const prevMonthRevenue = await financeDb.revenue.aggregate({
    where: {
      date: {
        gte: prevMonthStart,
        lte: prevMonthEnd,
      },
      status: 'paid',
    },
    _sum: { amount: true },
  })

  const currentRevenue = monthlyKPI?.totalRevenue || 0
  const previousRevenue = prevMonthRevenue._sum.amount || 0
  const revenueChangeRate = previousRevenue > 0
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : 0

  return {
    projects: projectsWithMetrics,
    stats: {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onhold: projects.filter(p => p.status === 'onhold').length,
    },
    financials: {
      revenue: monthlyKPI?.totalRevenue || 0,
      cost: monthlyKPI?.totalCost || 0,
      margin: monthlyKPI?.totalMargin || 0,
      marginRate: monthlyKPI?.marginRate || 0,
      revenueChangeRate, // 前月比
    },
    resources: {
      utilization: monthlyKPI?.avgUtilization || 0,
      totalMembers: monthlyKPI?.totalMembers || 0,
    },
    revenueData: monthlyData,
  }
}

export async function getProjectDetails(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return null // TypeScriptのためのreturn
  }

  const project = await projectDb.project.findUnique({
    where: { id: projectId },
    include: {
      projectMembers: true,
      milestones: {
        orderBy: {
          dueDate: 'asc',
        },
      },
    },
  })

  if (!project) {
    throw new Error('プロジェクトが見つかりません')
  }

  return project
}

export async function getResourceData() {
  const user = await getCurrentUser()
  if (!user || !hasUserRole(user.role.name, 'EXECUTIVE')) {
    redirect('/login')
  }

  // 今月の期間を計算
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  // 全メンバーの情報を取得
  const members = await authDb.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  })

  // メンバーごとの今月の工数データを取得
  const timeEntriesByUser = await financeDb.timeEntry.groupBy({
    by: ['userId'],
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
      approved: true,
    },
    _sum: {
      hours: true,
    },
  })

  // 工数データをマップに変換
  const hoursMap = new Map(
    timeEntriesByUser.map(entry => [entry.userId, entry._sum.hours || 0])
  )

  // アクティブなプロジェクト数を取得
  const projectCounts = await projectDb.projectMember.groupBy({
    by: ['userId'],
    where: {
      project: {
        status: 'active',
      },
    },
    _count: true,
  })

  const projectCountMap = new Map(
    projectCounts.map(entry => [entry.userId, entry._count])
  )

  // メンバーごとの稼働率を計算
  const memberData = members.map(member => {
    const actualHours = hoursMap.get(member.id) || 0
    const utilization = calculateUtilization(actualHours, monthStart, monthEnd)
    const projects = projectCountMap.get(member.id) || 0
    
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role.name,
      utilization,
      projects,
    }
  }).filter(member => member.projects > 0) // アクティブなメンバーのみ

  // ロール別の集計
  const roles = await authDb.role.findMany()

  const roleData = await Promise.all(
    roles.map(async (role) => {
      // ロールのユーザーを取得
      const roleUsers = await authDb.user.findMany({
        where: {
          role: {
            name: role.name,
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
            gte: monthStart,
            lte: monthEnd,
          },
          approved: true,
        },
        _sum: {
          hours: true,
        },
      })

      // 稼働率を計算
      const utilizations = roleTimeEntries.map(entry => 
        calculateUtilization(entry._sum.hours || 0, monthStart, monthEnd)
      )
      
      const count = utilizations.length
      const avgUtilization = count > 0 
        ? utilizations.reduce((sum, util) => sum + util, 0) / count 
        : 0
      
      return {
        role: role.name,
        count,
        avgUtilization,
      }
    })
  )

  return {
    members: memberData,
    roleDistribution: roleData.filter(r => r.count > 0),
  }
}