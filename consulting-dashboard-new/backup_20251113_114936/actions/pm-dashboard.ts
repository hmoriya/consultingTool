'use server'

import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { projectService } from '@/lib/services/project-service'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek } from 'date-fns'
import { PROJECT_MEMBER_ROLES, USER_ROLES } from '@/constants/roles'

export async function getPMDashboardData() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role.name !== USER_ROLES.PM && user.role.name !== USER_ROLES.EXECUTIVE) {
    throw new Error('権限がありません')
  }

  // プロジェクトサービスから自分がPMとして担当しているプロジェクトを取得
  const allProjects = await projectService.getProjectsWithDetails({
    includeMembers: true,
    includeTasks: true,
    includeMilestones: true,
  })

  // PMとして担当しているアクティブなプロジェクトをフィルタリング
  const myProjects = allProjects.filter(project =>
    project.status !== 'completed' &&
    project.projectMembers.some(member =>
      member.userId === user.id && member.role === PROJECT_MEMBER_ROLES.PM
    )
  )

  // プロジェクトのカウント情報を追加
  const projectsWithCount = myProjects.map(project => ({
    ...project,
    _count: {
      tasks: project.tasks?.length || 0,
      milestones: project.milestones?.length || 0,
      projectMembers: project.projectMembers.length
    }
  }))

  const projectIds = myProjects.map(p => p.id)

  // タスクの統計
  let taskStats = []
  let upcomingMilestones = []
  let riskyTasks = []
  let teamMembers = []

  if (projectIds.length > 0) {
    // タスクの統計（プロジェクトサービスから）
    taskStats = await projectDb.task.groupBy({
      by: ['status'],
      where: {
        projectId: {
          in: projectIds
        }
      },
      _count: true
    })

    // 今週のマイルストーン
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

    upcomingMilestones = await projectDb.milestone.findMany({
      where: {
        projectId: {
          in: projectIds
        },
        dueDate: {
          gte: weekStart,
          lte: weekEnd
        },
        status: {
          not: 'completed'
        }
      },
      include: {
        project: true
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    // リスクの高いタスク（期限切れまたは期限間近）
    const today = new Date()
    const threeDaysLater = new Date()
    threeDaysLater.setDate(today.getDate() + 3)

    riskyTasks = await projectDb.task.findMany({
      where: {
        projectId: {
          in: projectIds
        },
        status: {
          not: 'completed'
        },
        dueDate: {
          lte: threeDaysLater
        }
      },
      include: {
        project: true
      },
      orderBy: {
        dueDate: 'asc'
      },
      take: 10
    })

    // チームメンバーの稼働率
    teamMembers = await projectDb.projectMember.findMany({
      where: {
        projectId: {
          in: projectIds
        }
      },
      include: {
        project: true
      }
    })
  }

  // プロジェクトにクライアント情報を追加
  const milestonesWithClient = upcomingMilestones.map(milestone => {
    const project = myProjects.find(p => p.id === milestone.projectId)
    return {
      ...milestone,
      project: {
        ...milestone.project,
        client: project?.client || null
      }
    }
  })

  // タスクにクライアント情報とアサイン情報を追加
  const assigneeIds = [...new Set(riskyTasks.map(t => t.assigneeId).filter(id => id))]
  const assignees = assigneeIds.length > 0 ? await db.user.findMany({
    where: { id: { in: assigneeIds as string[] } }
  }) : []
  const assigneeMap = new Map(assignees.map(u => [u.id, u]))

  const riskyTasksWithDetails = riskyTasks.map(task => {
    const project = myProjects.find(p => p.id === task.projectId)
    return {
      ...task,
      project: {
        ...task.project,
        client: project?.client || null
      },
      assignee: task.assigneeId ? assigneeMap.get(task.assigneeId) || null : null
    }
  })

  // メンバーのユーザー情報を取得
  const memberUserIds = [...new Set(teamMembers.map(m => m.userId))]
  const memberUsers = memberUserIds.length > 0 ? await db.user.findMany({
    where: { id: { in: memberUserIds } }
  }) : []
  const userMap = new Map(memberUsers.map(u => [u.id, u]))

  const teamMembersWithUser = teamMembers.map(member => ({
    ...member,
    user: userMap.get(member.userId) || null
  }))

  // 稼働率の計算
  const memberUtilization = teamMembersWithUser.reduce((acc, member) => {
    if (!acc[member.userId]) {
      acc[member.userId] = {
        user: member.user,
        allocation: 0,
        projects: []
      }
    }
    acc[member.userId].allocation += member.allocation
    acc[member.userId].projects.push({
      id: member.project.id,
      name: member.project.name,
      allocation: member.allocation
    })
    return acc
  }, {} as Record<string, unknown>)

  return {
    projects: projectsWithCount,
    taskStats: {
      total: taskStats.reduce((sum, stat) => sum + stat._count, 0),
      todo: taskStats.find(s => s.status === 'todo')?._count || 0,
      in_progress: taskStats.find(s => s.status === 'in_progress')?._count || 0,
      in_review: taskStats.find(s => s.status === 'in_review')?._count || 0,
      completed: taskStats.find(s => s.status === 'completed')?._count || 0
    },
    upcomingMilestones: milestonesWithClient,
    riskyTasks: riskyTasksWithDetails,
    teamUtilization: Object.values(memberUtilization)
  }
}

export async function getProjectProgress(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const project = await projectDb.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: true,
      milestones: true,
      projectMembers: {
        where: {
          userId: user.id,
          role: PROJECT_MEMBER_ROLES.PM
        }
      }
    }
  })

  if (!project || (project.projectMembers.length === 0 && user.role.name !== USER_ROLES.EXECUTIVE)) {
    throw new Error('プロジェクトが見つかりません')
  }

  const completedTasks = project.tasks.filter(t => t.status === 'completed').length
  const totalTasks = project.tasks.length
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const completedMilestones = project.milestones.filter(m => m.status === 'completed').length
  const totalMilestones = project.milestones.length
  const milestoneProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  return {
    taskProgress,
    milestoneProgress,
    completedTasks,
    totalTasks,
    completedMilestones,
    totalMilestones
  }
}