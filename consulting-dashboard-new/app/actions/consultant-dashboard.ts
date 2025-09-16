'use server'

import { prisma } from '@/lib/db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'

export async function getConsultantDashboardData() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role.name !== 'consultant' && user.role.name !== 'executive' && user.role.name !== 'pm') {
    throw new Error('権限がありません')
  }

  // 自分が担当しているタスク
  const myTasks = await prisma.task.findMany({
    where: {
      assigneeId: user.id,
      status: {
        not: 'completed'
      }
    },
    include: {
      project: {
        include: {
          client: true
        }
      }
    },
    orderBy: {
      dueDate: 'asc'
    }
  })

  // 今週のタスク
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  const weeklyTasks = await prisma.task.findMany({
    where: {
      assigneeId: user.id,
      dueDate: {
        gte: weekStart,
        lte: weekEnd
      }
    },
    include: {
      project: {
        include: {
          client: true
        }
      }
    },
    orderBy: {
      dueDate: 'asc'
    }
  })

  // タスクステータス別の統計
  const taskStats = await prisma.task.groupBy({
    by: ['status'],
    where: {
      assigneeId: user.id
    },
    _count: true
  })

  // 自分が参加しているプロジェクト
  const myProjects = await prisma.project.findMany({
    where: {
      projectMembers: {
        some: {
          userId: user.id
        }
      },
      status: {
        not: 'completed'
      }
    },
    include: {
      client: true,
      projectMembers: {
        include: {
          user: true
        }
      },
      _count: {
        select: {
          tasks: true,
          milestones: true
        }
      }
    }
  })

  // 今月の実績時間（簡易版）
  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(new Date())
  
  const completedTasksThisMonth = await prisma.task.count({
    where: {
      assigneeId: user.id,
      status: 'completed',
      updatedAt: {
        gte: monthStart,
        lte: monthEnd
      }
    }
  })

  // スキルの統計
  const userSkills = await prisma.userSkill.findMany({
    where: {
      userId: user.id
    },
    include: {
      skill: true
    }
  })

  return {
    tasks: myTasks,
    weeklyTasks,
    taskStats: {
      total: taskStats.reduce((sum, stat) => sum + stat._count, 0),
      todo: taskStats.find(s => s.status === 'todo')?._count || 0,
      in_progress: taskStats.find(s => s.status === 'in_progress')?._count || 0,
      in_review: taskStats.find(s => s.status === 'in_review')?._count || 0,
      completed: taskStats.find(s => s.status === 'completed')?._count || 0
    },
    projects: myProjects,
    completedTasksThisMonth,
    skills: userSkills
  }
}

export async function updateTaskStatus(taskId: string, status: 'todo' | 'in_progress' | 'in_review' | 'completed') {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId }
  })

  if (!task || task.assigneeId !== user.id) {
    throw new Error('タスクが見つかりません')
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status }
  })

  return updatedTask
}