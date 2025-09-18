'use server'

import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek } from 'date-fns'
import { USER_ROLES } from '@/constants/roles'

export interface MemberUtilization {
  id: string
  name: string
  email: string
  role: string
  currentAllocation: number
  projects: {
    id: string
    name: string
    clientName: string
    allocation: number
    role: string
  }[]
  weeklyUtilization: {
    weekStart: string
    utilization: number
  }[]
  monthlyUtilization: {
    month: string
    utilization: number
    allocatedDays: number
    totalDays: number
  }[]
}

// チームの稼働率を取得
export async function getTeamUtilization(targetMonth?: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return []
  }

  if (user.role.name !== 'Executive' && user.role.name !== 'PM') {
    throw new Error('アクセス権限がありません')
  }

  const currentDate = targetMonth ? new Date(targetMonth) : new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // チームメンバーを取得
  const members = await db.user.findMany({
    where: {
      organizationId: user.organizationId,
      role: {
        name: {
          in: ['PM', 'Consultant']
        }
      }
    },
    include: {
      role: true
    }
  })

  // メンバーごとの稼働率を計算
  const utilizationData: MemberUtilization[] = []

  for (const member of members) {
    // プロジェクトメンバー情報を取得
    const projectMembers = await projectDb.projectMember.findMany({
      where: {
        userId: member.id,
        OR: [
          {
            startDate: { lte: monthEnd },
            endDate: null
          },
          {
            startDate: { lte: monthEnd },
            endDate: { gte: monthStart }
          }
        ]
      },
      include: {
        project: true
      }
    })

    // クライアント情報を取得
    const clientIds = [...new Set(projectMembers.map(pm => pm.project.clientId))]
    const clients = await db.organization.findMany({
      where: { id: { in: clientIds } }
    })
    const clientMap = new Map(clients.map(c => [c.id, c]))

    // 現在のプロジェクト割り当て
    const currentProjects = projectMembers
      .filter(pm => pm.project.status === 'active')
      .map(pm => {
        const client = clientMap.get(pm.project.clientId)
        return {
          id: pm.project.id,
          name: pm.project.name,
          clientName: client?.name || 'Unknown',
          allocation: pm.allocation,
          role: pm.role
        }
      })

    const currentAllocation = currentProjects.reduce((sum, p) => sum + p.allocation, 0)

    // 週次稼働率（過去4週間）
    const weeklyUtilization = []
    for (let i = 3; i >= 0; i--) {
      const weekDate = new Date()
      weekDate.setDate(weekDate.getDate() - (i * 7))
      const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 })

      const weekProjects = projectMembers.filter(pm => {
        const startDate = new Date(pm.startDate)
        const endDate = pm.endDate ? new Date(pm.endDate) : new Date()
        
        return startDate <= weekEnd && endDate >= weekStart
      })

      const weekAllocation = weekProjects.reduce((sum, pm) => sum + pm.allocation, 0)

      weeklyUtilization.push({
        weekStart: format(weekStart, 'yyyy-MM-dd'),
        utilization: Math.min(weekAllocation, 100)
      })
    }

    // 月次稼働率（過去3ヶ月）
    const monthlyUtilization = []
    for (let i = 2; i >= 0; i--) {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - i)
      const mStart = startOfMonth(monthDate)
      const mEnd = endOfMonth(monthDate)

      // 月内の各日の稼働率を計算
      const days = eachDayOfInterval({ start: mStart, end: mEnd })
      let allocatedDays = 0
      
      for (const day of days) {
        // 週末を除外
        if (day.getDay() === 0 || day.getDay() === 6) continue

        const dayProjects = projectMembers.filter(pm => {
          const startDate = new Date(pm.startDate)
          const endDate = pm.endDate ? new Date(pm.endDate) : new Date()
          
          return startDate <= day && endDate >= day
        })

        if (dayProjects.length > 0) {
          allocatedDays++
        }
      }

      // 営業日数を計算（週末を除く）
      const totalDays = days.filter(d => d.getDay() !== 0 && d.getDay() !== 6).length

      monthlyUtilization.push({
        month: format(mStart, 'yyyy-MM'),
        utilization: totalDays > 0 ? Math.round((allocatedDays / totalDays) * 100) : 0,
        allocatedDays,
        totalDays
      })
    }

    utilizationData.push({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role.name,
      currentAllocation,
      projects: currentProjects,
      weeklyUtilization,
      monthlyUtilization
    })
  }

  return utilizationData.sort((a, b) => b.currentAllocation - a.currentAllocation)
}

// プロジェクトごとのリソース配分を取得
export async function getProjectResourceAllocation(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return null
  }

  // プロジェクトアクセス権限チェック
  const project = await projectDb.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { projectMembers: { some: { userId: user.id } } },
        ...(user.role.name === USER_ROLES.EXECUTIVE ? [{ id: projectId }] : [])
      ]
    },
    include: {
      projectMembers: true
    }
  })

  if (!project) {
    throw new Error('プロジェクトが見つからないか、権限がありません')
  }

  // ユーザー情報を取得
  const memberUsers = await db.user.findMany({
    where: {
      id: { in: project.projectMembers.map(pm => pm.userId) }
    },
    include: {
      role: true
    }
  })

  const userMap = new Map(memberUsers.map(u => [u.id, u]))

  // ロール別にグループ化
  const roleAllocation = project.projectMembers.reduce((acc, member) => {
    const user = userMap.get(member.userId)
    if (!user) return acc

    const roleName = user.role.name
    if (!acc[roleName]) {
      acc[roleName] = {
        count: 0,
        totalAllocation: 0,
        members: []
      }
    }

    acc[roleName].count++
    acc[roleName].totalAllocation += member.allocation
    acc[roleName].members.push({
      id: user.id,
      name: user.name,
      allocation: member.allocation,
      projectRole: member.role
    })

    return acc
  }, {} as Record<string, any>)

  // 合計稼働率
  const totalAllocation = project.projectMembers.reduce((sum, pm) => sum + pm.allocation, 0)

  // クライアント情報を取得
  const client = await db.organization.findUnique({
    where: { id: project.clientId }
  })

  return {
    project: {
      id: project.id,
      name: project.name,
      clientName: client?.name || 'Unknown',
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate
    },
    totalAllocation,
    totalMembers: project.projectMembers.length,
    roleAllocation,
    members: project.projectMembers.map(pm => ({
      id: pm.user.id,
      name: pm.user.name,
      email: pm.user.email,
      role: pm.user.role.name,
      projectRole: pm.role,
      allocation: pm.allocation,
      startDate: pm.startDate,
      endDate: pm.endDate
    }))
  }
}

// 稼働率の最適化提案を取得
export async function getUtilizationRecommendations() {
  const user = await getCurrentUser()
  if (!user || user.role.name !== 'Executive') {
    throw new Error('エグゼクティブのみアクセス可能です')
  }

  // 低稼働率メンバー（50%未満）
  const lowUtilizationMembers = await db.user.findMany({
    where: {
      organizationId: user.organizationId,
      role: {
        name: {
          in: ['PM', 'Consultant']
        }
      }
    },
    include: {
      role: true,
      projectMembers: {
        where: {
          project: {
            status: 'active'
          }
        }
      }
    }
  })

  const underutilized = lowUtilizationMembers
    .map(member => {
      const totalAllocation = member.projectMembers.reduce((sum, pm) => sum + pm.allocation, 0)
      return {
        id: member.id,
        name: member.name,
        role: member.role.name,
        currentAllocation: totalAllocation,
        availableCapacity: 100 - totalAllocation
      }
    })
    .filter(m => m.currentAllocation < 50)
    .sort((a, b) => a.currentAllocation - b.currentAllocation)

  // 高稼働率メンバー（90%以上）
  const overutilized = lowUtilizationMembers
    .map(member => {
      const totalAllocation = member.projectMembers.reduce((sum, pm) => sum + pm.allocation, 0)
      return {
        id: member.id,
        name: member.name,
        role: member.role.name,
        currentAllocation: totalAllocation,
        overAllocation: totalAllocation - 100
      }
    })
    .filter(m => m.currentAllocation >= 90)
    .sort((a, b) => b.currentAllocation - a.currentAllocation)

  // プロジェクト別のリソース不足
  const projects = await db.project.findMany({
    where: {
      status: 'active',
      client: {
        organization: {
          id: user.organizationId
        }
      }
    },
    include: {
      projectMembers: {
        include: {
          user: {
            include: {
              role: true
            }
          }
        }
      }
    }
  })

  const resourceShortages = projects
    .map(project => {
      // 必要なロール別人数（仮の基準）
      const requiredResources = {
        pm: 1,
        consultant: Math.ceil(project.budget / 30000000), // 3000万円につき1人
        analyst: Math.ceil(project.budget / 50000000) // 5000万円につき1人
      }

      const currentResources = project.projectMembers.reduce((acc, pm) => {
        const role = pm.role.toLowerCase()
        acc[role] = (acc[role] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const shortages = Object.entries(requiredResources)
        .filter(([role, required]) => (currentResources[role] || 0) < required)
        .map(([role, required]) => ({
          role,
          required,
          current: currentResources[role] || 0,
          shortage: required - (currentResources[role] || 0)
        }))

      return {
        projectId: project.id,
        projectName: project.name,
        shortages
      }
    })
    .filter(p => p.shortages.length > 0)

  return {
    underutilized,
    overutilized,
    resourceShortages,
    recommendations: [
      ...underutilized.slice(0, 3).map(member => ({
        type: 'low_utilization' as const,
        priority: 'medium' as const,
        message: `${member.name}（${member.role}）の稼働率が${member.currentAllocation}%です。新規プロジェクトへのアサインを検討してください。`,
        memberId: member.id,
        memberName: member.name,
        currentAllocation: member.currentAllocation
      })),
      ...overutilized.slice(0, 3).map(member => ({
        type: 'high_utilization' as const,
        priority: 'high' as const,
        message: `${member.name}（${member.role}）の稼働率が${member.currentAllocation}%と高負荷です。タスクの再配分を推奨します。`,
        memberId: member.id,
        memberName: member.name,
        currentAllocation: member.currentAllocation
      })),
      ...resourceShortages.slice(0, 3).map(project => ({
        type: 'resource_shortage' as const,
        priority: 'high' as const,
        message: `${project.projectName}でリソースが不足しています。${project.shortages.map(s => `${s.role}: ${s.shortage}名`).join('、')}の追加が必要です。`,
        projectId: project.projectId,
        projectName: project.projectName
      }))
    ].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }
}