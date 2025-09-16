'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'

export async function getDashboardData() {
  const user = await getCurrentUser()
  if (!user || user.role.name !== 'executive') {
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
  const projects = await db.project.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
      budget: true,
      client: {
        select: {
          name: true,
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
      const revenue = await db.revenue.aggregate({
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
      const cost = await db.cost.aggregate({
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
      const timeEntries = await db.timeEntry.aggregate({
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
      const members = await db.projectMember.findMany({
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
        ...project,
        latestMetrics: {
          revenue: projectRevenue,
          cost: projectCost,
          margin,
          utilization: avgUtilization,
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
    const monthRevenue = await db.revenue.aggregate({
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
    const monthCost = await db.cost.aggregate({
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
    const monthTimeEntries = await db.timeEntry.findMany({
      where: {
        date: {
          gte: mStart,
          lte: mEnd,
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

    const hourlyRates: Record<string, number> = {
      executive: 20000,
      pm: 15000,
      consultant: 8000,
      analyst: 6000,
      admin: 6000,
    }

    const laborCost = monthTimeEntries.reduce((sum, entry) => {
      const rate = hourlyRates[entry.user.role.name] || 8000
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
  
  const prevMonthRevenue = await db.revenue.aggregate({
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

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      client: true,
      projectMembers: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      milestones: {
        orderBy: {
          dueDate: 'asc',
        },
      },
      projectMetrics: {
        orderBy: {
          date: 'desc',
        },
        take: 12,
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
  if (!user || user.role.name !== 'executive') {
    redirect('/login')
  }

  // 全メンバーの稼働状況を取得
  const members = await db.user.findMany({
    where: {
      projectMembers: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          name: true,
        },
      },
      projectMembers: {
        select: {
          allocation: true,
          project: {
            select: {
              status: true,
            },
          },
        },
      },
    },
  })

  // メンバーごとの稼働率を計算
  const memberData = members.map(member => {
    const activeProjects = member.projectMembers.filter(
      pm => pm.project.status === 'active'
    )
    const totalAllocation = activeProjects.reduce((sum, pm) => sum + pm.allocation, 0)
    
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role.name,
      utilization: totalAllocation,
      projects: activeProjects.length,
    }
  })

  // ロール別の集計
  const roleDistribution = await db.role.findMany({
    select: {
      name: true,
      users: {
        select: {
          projectMembers: {
            where: {
              project: {
                status: 'active',
              },
            },
            select: {
              allocation: true,
            },
          },
        },
      },
    },
  })

  const roleData = roleDistribution.map(role => {
    const roleUsers = role.users.filter(u => u.projectMembers.length > 0)
    const totalUtilization = roleUsers.reduce(
      (sum, user) => sum + user.projectMembers.reduce((s, pm) => s + pm.allocation, 0),
      0
    )
    
    return {
      role: role.name,
      count: roleUsers.length,
      avgUtilization: roleUsers.length > 0 ? totalUtilization / roleUsers.length : 0,
    }
  })

  return {
    members: memberData,
    roleDistribution: roleData.filter(r => r.count > 0),
  }
}