'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskItem {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  estimatedHours: number | null
  actualHours: number | null
  startDate: Date | null
  dueDate: Date | null
  completedAt: Date | null
  assignee: {
    id: string
    name: string
    email: string
  } | null
  milestone: {
    id: string
    name: string
  } | null
  createdAt: Date
  updatedAt: Date
}

export async function getProjectTasks(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return [] // TypeScriptのためのreturn
  }

  // プロジェクトアクセス権限チェック
  const project = await db.project.findFirst({
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

  const tasks = await db.task.findMany({
    where: { projectId },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      milestone: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: [
      { status: 'asc' },
      { priority: 'desc' },
      { dueDate: 'asc' }
    ]
  })

  return tasks.map(task => ({
    ...task,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority
  }))
}

export async function createTask(data: {
  projectId: string
  title: string
  description?: string
  priority: TaskPriority
  estimatedHours?: number
  startDate?: string
  dueDate?: string
  assigneeId?: string
  milestoneId?: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // プロジェクトアクセス権限チェック
  const project = await db.project.findFirst({
    where: {
      id: data.projectId,
      OR: [
        { projectMembers: { some: { userId: user.id, role: { in: ['pm', 'lead'] } } } },
        ...(user.role.name === 'executive' ? [{ id: data.projectId }] : [])
      ]
    }
  })

  if (!project) {
    throw new Error('タスクを作成する権限がありません')
  }

  const task = await db.task.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      status: 'todo',
      priority: data.priority,
      estimatedHours: data.estimatedHours,
      startDate: data.startDate ? new Date(data.startDate) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assigneeId: data.assigneeId,
      milestoneId: data.milestoneId
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      milestone: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'CREATE',
      resource: 'task',
      resourceId: task.id,
      details: `タスク「${task.title}」を作成しました`
    }
  })

  return {
    ...task,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // タスクのアクセス権限チェック
  const task = await db.task.findFirst({
    where: {
      id: taskId,
      OR: [
        { assigneeId: user.id },
        { project: { projectMembers: { some: { userId: user.id, role: { in: ['pm', 'lead'] } } } } },
        ...(user.role.name === 'executive' ? [{ id: taskId }] : [])
      ]
    },
    include: {
      project: true
    }
  })

  if (!task) {
    throw new Error('タスクが見つからないか、権限がありません')
  }

  const updateData: any = {
    status,
    updatedAt: new Date()
  }

  if (status === 'completed') {
    updateData.completedAt = new Date()
  } else if (task.completedAt) {
    updateData.completedAt = null
  }

  const updatedTask = await db.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      milestone: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'task',
      resourceId: taskId,
      details: `タスク「${task.title}」のステータスを「${status}」に変更しました`
    }
  })

  return {
    ...updatedTask,
    status: updatedTask.status as TaskStatus,
    priority: updatedTask.priority as TaskPriority
  }
}

export async function updateTask(taskId: string, data: {
  title?: string
  description?: string
  priority?: TaskPriority
  estimatedHours?: number
  actualHours?: number
  startDate?: string
  dueDate?: string
  assigneeId?: string
  milestoneId?: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // タスクのアクセス権限チェック
  const task = await db.task.findFirst({
    where: {
      id: taskId,
      OR: [
        { assigneeId: user.id },
        { project: { projectMembers: { some: { userId: user.id, role: { in: ['pm', 'lead'] } } } } },
        ...(user.role.name === 'executive' ? [{ id: taskId }] : [])
      ]
    }
  })

  if (!task) {
    throw new Error('タスクが見つからないか、権限がありません')
  }

  const updateData: any = {
    ...data,
    updatedAt: new Date()
  }

  if (data.startDate !== undefined) {
    updateData.startDate = data.startDate ? new Date(data.startDate) : null
  }
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null
  }

  const updatedTask = await db.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      milestone: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'task',
      resourceId: taskId,
      details: `タスク「${task.title}」を更新しました`
    }
  })

  return {
    ...updatedTask,
    status: updatedTask.status as TaskStatus,
    priority: updatedTask.priority as TaskPriority
  }
}

export async function deleteTask(taskId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // タスクのアクセス権限チェック
  const task = await db.task.findFirst({
    where: {
      id: taskId,
      OR: [
        { project: { projectMembers: { some: { userId: user.id, role: { in: ['pm', 'lead'] } } } } },
        ...(user.role.name === 'executive' ? [{ id: taskId }] : [])
      ]
    }
  })

  if (!task) {
    throw new Error('タスクが見つからないか、権限がありません')
  }

  await db.task.delete({
    where: { id: taskId }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'DELETE',
      resource: 'task',
      resourceId: taskId,
      details: `タスク「${task.title}」を削除しました`
    }
  })

  return { success: true }
}