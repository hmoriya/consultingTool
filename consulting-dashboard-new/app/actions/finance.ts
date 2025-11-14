'use server'

import { prisma } from '@/lib/db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { z } from 'zod'

// 収益記録スキーマ
type RevenueData = z.infer<typeof revenueSchema>
const revenueSchema = z.object({
  projectId: z.string(),
  date: z.date(),
  amount: z.number().positive(),
  type: z.enum(['monthly_fee', 'milestone', 'change_order', 'other']),
  description: z.string().optional(),
  invoiceNo: z.string().optional(),
  status: z.enum(['pending', 'invoiced', 'paid']).default('pending'),
})

// コスト記録スキーマ
type CostData = z.infer<typeof costSchema>
const costSchema = z.object({
  projectId: z.string(),
  date: z.date(),
  amount: z.number().positive(),
  category: z.enum(['labor', 'outsourcing', 'expense', 'other']),
  description: z.string().optional(),
  userId: z.string().optional(),
})

// 収益記録を作成
export async function createRevenue(data: RevenueData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role.name !== 'pm' && user.role.name !== 'executive') {
    return {
      success: false,
      error: '権限がありません',
    }
  }

  try {
    // PMの場合は自分のプロジェクトのみ
    if (user.role.name === 'pm') {
      const isMember = await prisma.projectMember.findFirst({
        where: {
          projectId: data.projectId,
          userId: user.id,
          role: 'pm',
        },
      })

      if (!isMember) {
        return {
          success: false,
          error: 'このプロジェクトの収益を管理する権限がありません',
        }
      }
    }

    const revenue = await prisma.revenue.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    })

    return {
      success: true,
      data: revenue,
    }
  } catch (error) {
    console.error('Revenue creation error:', error)
    return {
      success: false,
      error: '収益記録の作成に失敗しました',
    }
  }
}

// コスト記録を作成
export async function createCost(data: CostData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role.name !== 'pm' && user.role.name !== 'executive') {
    return {
      success: false,
      error: '権限がありません',
    }
  }

  try {
    // PMの場合は自分のプロジェクトのみ
    if (user.role.name === 'pm') {
      const isMember = await prisma.projectMember.findFirst({
        where: {
          projectId: data.projectId,
          userId: user.id,
          role: 'pm',
        },
      })

      if (!isMember) {
        return {
          success: false,
          error: 'このプロジェクトのコストを管理する権限がありません',
        }
      }
    }

    const cost = await prisma.cost.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    })

    return {
      success: true,
      data: cost,
    }
  } catch (error) {
    console.error('Cost creation error:', error)
    return {
      success: false,
      error: 'コスト記録の作成に失敗しました',
    }
  }
}

// プロジェクトの月次財務データを取得
export async function getProjectFinancials(projectId: string, month: Date) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  try {
    // 収益データを取得
    const revenues = await prisma.revenue.findMany({
      where: {
        projectId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // コストデータを取得
    const costs = await prisma.cost.findMany({
      where: {
        projectId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // 人件費の計算（工数記録から）
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        projectId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
        approved: true,
      },
      include: {
        user: {
          include: {
            projectMembers: {
              where: {
                projectId,
              },
              select: {
                role: true,
              },
            },
          },
        },
      },
    })

    // ロール別の標準レートを設定（実際は設定値から取得する）
    const hourlyRates = {
      pm: 15000,
      lead: 12000,
      senior: 10000,
      consultant: 8000,
      analyst: 6000,
    }

    const laborCosts = timeEntries.map(entry => {
      const role = entry.user.projectMembers[0]?.role || 'consultant'
      const rate = hourlyRates[role as keyof typeof hourlyRates]
      return {
        userId: entry.userId,
        userName: entry.user.name,
        hours: entry.hours,
        rate,
        amount: entry.hours * rate,
        date: entry.date,
      }
    })

    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0)
    const totalCost = costs.reduce((sum, c) => sum + c.amount, 0)
    const totalLaborCost = laborCosts.reduce((sum, l) => sum + l.amount, 0)
    const totalAllCosts = totalCost + totalLaborCost
    const margin = totalRevenue - totalAllCosts
    const marginRate = totalRevenue > 0 ? (margin / totalRevenue) * 100 : 0

    // 前月との比較
    const prevMonthStart = startOfMonth(subMonths(month, 1))
    const prevMonthEnd = endOfMonth(subMonths(month, 1))

    const prevRevenues = await prisma.revenue.aggregate({
      where: {
        projectId,
        date: {
          gte: prevMonthStart,
          lte: prevMonthEnd,
        },
      },
      _sum: {
        amount: true,
      },
    })


    const prevRevenueTotal = prevRevenues._sum.amount || 0
    const revenueChange = prevRevenueTotal > 0 
      ? ((totalRevenue - prevRevenueTotal) / prevRevenueTotal) * 100
      : 0

    return {
      revenues,
      costs,
      laborCosts,
      summary: {
        totalRevenue,
        totalCost: totalAllCosts,
        totalLaborCost,
        totalOtherCost: totalCost,
        margin,
        marginRate,
        revenueChange,
      },
    }
  } catch (error) {
    console.error('Project financials error:', error)
    return {
      success: false,
      error: 'プロジェクト財務データの取得に失敗しました',
    }
  }
}

// 全社の月次財務サマリーを取得
export async function getCompanyFinancialSummary(month: Date) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role.name !== 'executive') {
    return {
      success: false,
      error: '権限がありません',
    }
  }

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  try {
    // 全プロジェクトの収益
    const totalRevenue = await prisma.revenue.aggregate({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
        status: 'paid',
      },
      _sum: {
        amount: true,
      },
    })

    // 全プロジェクトのコスト
    const totalCost = await prisma.cost.aggregate({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
        approved: true,
      },
      _sum: {
        amount: true,
      },
    })

    // 承認済み工数から人件費を計算
    const approvedHours = await prisma.timeEntry.groupBy({
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

    // ユーザー情報を取得して人件費を計算
    const userIds = approvedHours.map(h => h.userId)
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: {
        role: true,
      },
    })

    const roleRates = {
      executive: 20000,
      pm: 15000,
      consultant: 8000,
      client: 0,
      admin: 6000,
    }

    const totalLaborCost = approvedHours.reduce((sum, hour) => {
      const user = users.find(u => u.id === hour.userId)
      const rate = roleRates[user?.role.name as keyof typeof roleRates] || 8000
      return sum + (hour._sum.hours || 0) * rate
    }, 0)

    const revenue = totalRevenue._sum.amount || 0
    const cost = (totalCost._sum.amount || 0) + totalLaborCost
    const margin = revenue - cost
    const marginRate = revenue > 0 ? (margin / revenue) * 100 : 0

    // 前月比の計算
    const prevMonthStart = startOfMonth(subMonths(month, 1))
    const prevMonthEnd = endOfMonth(subMonths(month, 1))

    const prevRevenue = await prisma.revenue.aggregate({
      where: {
        date: {
          gte: prevMonthStart,
          lte: prevMonthEnd,
        },
        status: 'paid',
      },
      _sum: {
        amount: true,
      },
    })

    const prevRevenueTotal = prevRevenue._sum.amount || 0
    const revenueChange = prevRevenueTotal > 0
      ? ((revenue - prevRevenueTotal) / prevRevenueTotal) * 100
      : 0

    // プロジェクト別の収益
    const projectRevenues = await prisma.revenue.groupBy({
      by: ['projectId'],
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: projectRevenues.map(p => p.projectId),
        },
      },
      select: {
        id: true,
        name: true,
        client: {
          select: {
            name: true,
          },
        },
      },
    })

    const projectData = projectRevenues.map(pr => {
      const project = projects.find(p => p.id === pr.projectId)
      return {
        projectId: pr.projectId,
        projectName: project?.name || '',
        clientName: project?.client.name || '',
        revenue: pr._sum.amount || 0,
      }
    })

    return {
      summary: {
        revenue,
        cost,
        laborCost: totalLaborCost,
        margin,
        marginRate,
        revenueChange,
      },
      projectRevenues: projectData.sort((a, b) => b.revenue - a.revenue),
    }
  } catch (error) {
    console.error('Company financial summary error:', error)
    return {
      success: false,
      error: '全社財務サマリーの取得に失敗しました',
    }
  }
}