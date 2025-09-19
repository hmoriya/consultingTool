'use server'

import { prisma } from '@/lib/db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { z } from 'zod'
import { hasAnyUserRole } from '@/lib/auth/role-check'

// 工数入力スキーマ
const timeEntrySchema = z.object({
  projectId: z.string(),
  taskId: z.string().optional(),
  date: z.date(),
  hours: z.number().min(0.5).max(24),
  description: z.string().optional(),
  billable: z.boolean().default(true),
})

// 工数記録を作成
export async function createTimeEntry(data: z.infer<typeof timeEntrySchema>) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // 同じ日に同じプロジェクト/タスクに重複する記録がないかチェック
    const existing = await prisma.timeEntry.findFirst({
      where: {
        userId: user.id,
        projectId: data.projectId,
        taskId: data.taskId,
        date: data.date,
      },
    })

    if (existing) {
      return {
        success: false,
        error: 'この日にこのプロジェクト/タスクの工数記録は既に存在します',
      }
    }

    // 1日の合計が24時間を超えないかチェック
    const dailyTotal = await prisma.timeEntry.aggregate({
      where: {
        userId: user.id,
        date: data.date,
      },
      _sum: {
        hours: true,
      },
    })

    const currentTotal = dailyTotal._sum.hours || 0
    if (currentTotal + data.hours > 24) {
      return {
        success: false,
        error: `1日の合計時間が24時間を超えます（現在: ${currentTotal}時間）`,
      }
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId: user.id,
        projectId: data.projectId,
        taskId: data.taskId,
        date: data.date,
        hours: data.hours,
        description: data.description,
        billable: data.billable,
      },
    })

    return {
      success: true,
      data: timeEntry,
    }
  } catch (error) {
    console.error('Time entry creation error:', error)
    return {
      success: false,
      error: '工数記録の作成に失敗しました',
    }
  }
}

// 工数記録を更新
export async function updateTimeEntry(
  id: string,
  data: Partial<z.infer<typeof timeEntrySchema>>
) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // 所有者チェック
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
    })

    if (!timeEntry) {
      return {
        success: false,
        error: '工数記録が見つかりません',
      }
    }

    if (timeEntry.userId !== user.id && !hasAnyUserRole(user.role.name, ['PM', 'EXECUTIVE'])) {
      return {
        success: false,
        error: '権限がありません',
      }
    }

    // 承認済みの場合は編集不可
    if (timeEntry.approved) {
      return {
        success: false,
        error: '承認済みの工数記録は編集できません',
      }
    }

    const updated = await prisma.timeEntry.update({
      where: { id },
      data,
    })

    return {
      success: true,
      data: updated,
    }
  } catch (error) {
    console.error('Time entry update error:', error)
    return {
      success: false,
      error: '工数記録の更新に失敗しました',
    }
  }
}

// 工数記録を削除
export async function deleteTimeEntry(id: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  try {
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
    })

    if (!timeEntry) {
      return {
        success: false,
        error: '工数記録が見つかりません',
      }
    }

    if (timeEntry.userId !== user.id && !hasAnyUserRole(user.role.name, ['PM', 'EXECUTIVE'])) {
      return {
        success: false,
        error: '権限がありません',
      }
    }

    if (timeEntry.approved) {
      return {
        success: false,
        error: '承認済みの工数記録は削除できません',
      }
    }

    await prisma.timeEntry.delete({
      where: { id },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Time entry deletion error:', error)
    return {
      success: false,
      error: '工数記録の削除に失敗しました',
    }
  }
}

// 週次工数記録を取得
export async function getWeeklyTimesheet(date: Date) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      userId: user.id,
      date: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    include: {
      project: {
        include: {
          client: true,
        },
      },
      task: true,
    },
    orderBy: {
      date: 'asc',
    },
  })

  // プロジェクトごとに集計
  const projectSummary = timeEntries.reduce((acc, entry) => {
    const projectId = entry.projectId
    if (!acc[projectId]) {
      acc[projectId] = {
        project: entry.project,
        totalHours: 0,
        billableHours: 0,
        entries: [],
      }
    }
    acc[projectId].totalHours += entry.hours
    if (entry.billable) {
      acc[projectId].billableHours += entry.hours
    }
    acc[projectId].entries.push(entry)
    return acc
  }, {} as Record<string, any>)

  return {
    weekStart,
    weekEnd,
    timeEntries,
    projectSummary: Object.values(projectSummary),
    totalHours: timeEntries.reduce((sum, entry) => sum + entry.hours, 0),
    billableHours: timeEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.hours, 0),
  }
}

// 月次工数記録を取得
export async function getMonthlyTimesheet(date: Date) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)

  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      userId: user.id,
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    include: {
      project: {
        include: {
          client: true,
        },
      },
      task: true,
    },
    orderBy: {
      date: 'asc',
    },
  })

  // 週ごとに集計
  const weeklyData = []
  let currentDate = monthStart
  while (currentDate <= monthEnd) {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
    
    const weekEntries = timeEntries.filter(
      entry => entry.date >= weekStart && entry.date <= weekEnd
    )
    
    weeklyData.push({
      weekStart,
      weekEnd,
      totalHours: weekEntries.reduce((sum, entry) => sum + entry.hours, 0),
      billableHours: weekEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.hours, 0),
      approvedHours: weekEntries.filter(e => e.approved).reduce((sum, entry) => sum + entry.hours, 0),
    })
    
    currentDate = new Date(weekEnd.getTime() + 1)
  }

  return {
    monthStart,
    monthEnd,
    timeEntries,
    weeklyData,
    totalHours: timeEntries.reduce((sum, entry) => sum + entry.hours, 0),
    billableHours: timeEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.hours, 0),
    approvedHours: timeEntries.filter(e => e.approved).reduce((sum, entry) => sum + entry.hours, 0),
  }
}

// 工数承認（PM/Executive用）
export async function approveTimeEntries(ids: string[]) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (!hasAnyUserRole(user.role.name, ['PM', 'EXECUTIVE'])) {
    return {
      success: false,
      error: '権限がありません',
    }
  }

  try {
    // PMの場合は自分のプロジェクトの工数のみ承認可能
    if (hasAnyUserRole(user.role.name, ['PM'])) {
      const projectIds = await prisma.projectMember.findMany({
        where: {
          userId: user.id,
          role: 'pm',
        },
        select: {
          projectId: true,
        },
      })

      const allowedProjectIds = projectIds.map(p => p.projectId)

      // 対象の工数記録がすべて自分のプロジェクトのものかチェック
      const timeEntries = await prisma.timeEntry.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: {
          projectId: true,
        },
      })

      const invalidEntries = timeEntries.filter(
        entry => !allowedProjectIds.includes(entry.projectId)
      )

      if (invalidEntries.length > 0) {
        return {
          success: false,
          error: '自分が管理していないプロジェクトの工数は承認できません',
        }
      }
    }

    await prisma.timeEntry.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        approved: true,
        approvedBy: user.id,
        approvedAt: new Date(),
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Time entries approval error:', error)
    return {
      success: false,
      error: '工数承認に失敗しました',
    }
  }
}