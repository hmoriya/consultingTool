'use server'

import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'

export type MilestoneStatus = 'pending' | 'completed' | 'delayed'

export interface MilestoneItem {
  id: string
  projectId: string
  name: string
  description: string | null
  dueDate: Date
  status: MilestoneStatus
  createdAt: Date
  updatedAt: Date
  taskCount: number
  completedTaskCount: number
  progressRate: number
}

export async function getProjectMilestones(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return [] // TypeScriptのためのreturn
  }

  // プロジェクトアクセス権限チェック
  const project = await projectDb.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { projectMembers: { some: { userId: user.id } } },
        ...(user.role.name === 'executive' ? [{ id: projectId }] : [])
      ]
    }
  })

  if (!project) {
    throw new Error('プロジェクトが見つからないか、権限がありません')
  }

  const milestones = await projectDb.milestone.findMany({
    where: { projectId },
    include: {
      tasks: {
        select: {
          id: true,
          status: true
        }
      }
    },
    orderBy: [
      { dueDate: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  return milestones.map(milestone => {
    const taskCount = milestone.tasks.length
    const completedTaskCount = milestone.tasks.filter(task => task.status === 'completed').length
    const progressRate = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0

    return {
      ...milestone,
      status: milestone.status as MilestoneStatus,
      taskCount,
      completedTaskCount,
      progressRate
    }
  })
}

export async function createMilestone(data: {
  projectId: string
  name: string
  description?: string
  dueDate: string
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== 'pm' && user.role.name !== 'executive')) {
    throw new Error('権限がありません')
  }

  // プロジェクトアクセス権限チェック
  const project = await projectDb.project.findFirst({
    where: {
      id: data.projectId,
      OR: [
        { projectMembers: { some: { userId: user.id, role: 'pm' } } },
        ...(user.role.name === 'executive' ? [{ id: data.projectId }] : [])
      ]
    }
  })

  if (!project) {
    throw new Error('プロジェクトが見つからないか、権限がありません')
  }

  // 期日チェック（プロジェクトの終了日以内）
  const dueDate = new Date(data.dueDate)
  if (project.endDate && dueDate > project.endDate) {
    throw new Error('マイルストーンの期日がプロジェクトの終了日を超えています')
  }

  const milestone = await projectDb.milestone.create({
    data: {
      projectId: data.projectId,
      name: data.name,
      description: data.description || null,
      dueDate: dueDate,
      status: 'pending'
    }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'CREATE',
      resource: 'milestone',
      resourceId: milestone.id,
      details: `マイルストーン「${milestone.name}」を作成しました`
    }
  })

  return milestone
}

export async function updateMilestone(milestoneId: string, data: {
  name?: string
  description?: string
  dueDate?: string
  status?: MilestoneStatus
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== 'pm' && user.role.name !== 'executive')) {
    throw new Error('権限がありません')
  }

  // マイルストーンのアクセス権限チェック
  const milestone = await projectDb.milestone.findFirst({
    where: {
      id: milestoneId,
      ...(user.role.name !== 'executive' ? {
        project: {
          projectMembers: { 
            some: { 
              userId: user.id, 
              role: 'pm' 
            } 
          }
        }
      } : {})
    },
    include: {
      project: true
    }
  })

  if (!milestone) {
    throw new Error('マイルストーンが見つからないか、権限がありません')
  }

  const updateData: unknown = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description || null
  if (data.dueDate !== undefined) {
    const dueDate = new Date(data.dueDate)
    // プロジェクトの終了日チェック
    if (milestone.project.endDate && dueDate > milestone.project.endDate) {
      throw new Error('マイルストーンの期日がプロジェクトの終了日を超えています')
    }
    updateData.dueDate = dueDate
  }
  if (data.status !== undefined) updateData.status = data.status

  const updatedMilestone = await projectDb.milestone.update({
    where: { id: milestoneId },
    data: updateData
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'milestone',
      resourceId: milestoneId,
      details: `マイルストーン「${milestone.name}」を更新しました`
    }
  })

  return updatedMilestone
}

export async function deleteMilestone(milestoneId: string) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== 'pm' && user.role.name !== 'executive')) {
    throw new Error('権限がありません')
  }

  // マイルストーンのアクセス権限チェック
  const milestone = await projectDb.milestone.findFirst({
    where: {
      id: milestoneId,
      ...(user.role.name !== 'executive' ? {
        project: {
          projectMembers: { 
            some: { 
              userId: user.id, 
              role: 'pm' 
            } 
          }
        }
      } : {})
    },
    include: {
      tasks: true
    }
  })

  if (!milestone) {
    throw new Error('マイルストーンが見つからないか、権限がありません')
  }

  // 関連するタスクがある場合の確認
  if (milestone.tasks.length > 0) {
    throw new Error(`このマイルストーンには${milestone.tasks.length}件のタスクが紐づいています。先にタスクを移動してください。`)
  }

  await projectDb.milestone.delete({
    where: { id: milestoneId }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'DELETE',
      resource: 'milestone',
      resourceId: milestoneId,
      details: `マイルストーン「${milestone.name}」を削除しました`
    }
  })

  return { success: true }
}

export async function getMilestoneStats(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return {
      totalMilestones: 0,
      completedMilestones: 0,
      delayedMilestones: 0,
      pendingMilestones: 0,
      overdueMilestones: 0,
      overallProgress: 0,
      completionRate: 0
    } // TypeScriptのためのreturn
  }

  // プロジェクトアクセス権限チェック
  const project = await projectDb.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { projectMembers: { some: { userId: user.id } } },
        ...(user.role.name === 'executive' ? [{ id: projectId }] : [])
      ]
    }
  })

  if (!project) {
    throw new Error('プロジェクトが見つからないか、権限がありません')
  }

  const milestones = await projectDb.milestone.findMany({
    where: { projectId },
    include: {
      tasks: {
        select: {
          status: true
        }
      }
    }
  })

  const totalMilestones = milestones.length
  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const delayedMilestones = milestones.filter(m => m.status === 'delayed').length
  const pendingMilestones = milestones.filter(m => m.status === 'pending').length

  // 期日を過ぎた未完了マイルストーン
  const overdueMilestones = milestones.filter(m => 
    m.status !== 'completed' && m.dueDate < new Date()
  ).length

  // 全タスクの進捗率
  const allTasks = milestones.flatMap(m => m.tasks)
  const completedTasks = allTasks.filter(t => t.status === 'completed').length
  const overallProgress = allTasks.length > 0 
    ? Math.round((completedTasks / allTasks.length) * 100) 
    : 0

  return {
    totalMilestones,
    completedMilestones,
    delayedMilestones,
    pendingMilestones,
    overdueMilestones,
    overallProgress,
    completionRate: totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100) 
      : 0
  }
}

// マイルストーンのタスク一覧を取得
export async function getMilestoneTasks(milestoneId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return [] // TypeScriptのためのreturn
  }

  // マイルストーンのアクセス権限チェック
  const milestone = await projectDb.milestone.findFirst({
    where: {
      id: milestoneId,
      ...(user.role.name !== 'executive' ? {
        project: {
          projectMembers: { 
            some: { 
              userId: user.id 
            } 
          }
        }
      } : {})
    }
  })

  if (!milestone) {
    throw new Error('マイルストーンが見つからないか、権限がありません')
  }

  const tasks = await projectDb.task.findMany({
    where: { milestoneId },
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  // ユーザー情報を取得
  const assigneeIds = [...new Set(tasks.map(t => t.assigneeId).filter(Boolean))] as string[]
  const assignees = assigneeIds.length > 0 ? await db.user.findMany({
    where: { id: { in: assigneeIds } },
    select: {
      id: true,
      name: true,
      email: true
    }
  }) : []
  
  const assigneeMap = new Map(assignees.map(a => [a.id, a]))

  return tasks.map(task => ({
    ...task,
    assignee: task.assigneeId ? assigneeMap.get(task.assigneeId) || null : null
  }))
}