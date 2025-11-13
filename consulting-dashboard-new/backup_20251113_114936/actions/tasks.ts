'use server'

import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { timesheetDb } from '@/lib/prisma-vercel'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { USER_ROLES } from '@/constants/roles'

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
  const project = await projectDb.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { projectMembers: { some: { userId: user.id } } },
        ...(user.role.name === USER_ROLES.EXECUTIVE ? [{ id: projectId }] : [])
      ]
    }
  })

  if (!project) {
    throw new Error('プロジェクトが見つからないか、権限がありません')
  }

  const tasks = await projectDb.task.findMany({
    where: { projectId },
    include: {
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
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority,
    assignee: task.assigneeId ? assigneeMap.get(task.assigneeId) || null : null
  }))
}

export async function getUserTasks() {
  const user = await getCurrentUser()
  if (!user) {
    return []
  }

  const tasks = await projectDb.task.findMany({
    where: {
      assigneeId: user.id
    },
    include: {
      project: true,
      milestone: true
    },
    orderBy: [
      { status: 'asc' },
      { dueDate: 'asc' }
    ]
  })

  // クライアント情報を取得
  const clientIds = [...new Set(tasks.map(t => t.project.clientId))]
  const clients = await db.organization.findMany({
    where: {
      id: { in: clientIds }
    }
  })
  const clientMap = new Map(clients.map(c => [c.id, c]))

  // タスクにクライアント情報を付与
  return tasks.map(task => ({
    ...task,
    client: clientMap.get(task.project.clientId) || null
  }))
}

export async function getTaskById(taskId: string) {
  const user = await getCurrentUser()
  if (!user) {
    return null
  }

  const task = await projectDb.task.findUnique({
    where: {
      id: taskId,
      assigneeId: user.id // ユーザーに割り当てられたタスクのみ表示
    },
    include: {
      project: true,
      milestone: true
    }
  })

  if (!task) {
    return null
  }

  // クライアント情報を取得（auth serviceから）
  const client = await db.organization.findUnique({
    where: { id: task.project.clientId }
  })

  // timesheet-serviceから工数エントリを取得
  const timeEntries = await timesheetDb.timeEntry.findMany({
    where: {
      consultantId: user.id,
      taskId: task.id
    },
    orderBy: {
      date: 'desc'
    },
    take: 10
  })

  return {
    ...task,
    client,
    timeEntries
  }
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
  const project = await projectDb.project.findFirst({
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

  const task = await projectDb.task.create({
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
      milestone: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // ユーザー情報を取得
  let assignee = null
  if (task.assigneeId) {
    assignee = await db.user.findUnique({
      where: { id: task.assigneeId },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
  }

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
    priority: task.priority as TaskPriority,
    assignee
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus, comment?: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // タスクのアクセス権限チェック
  const task = await projectDb.task.findFirst({
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

  const updateData: unknown = {
    status,
    updatedAt: new Date()
  }

  if (status === 'completed') {
    updateData.completedAt = new Date()
  } else if (task.completedAt) {
    updateData.completedAt = null
  }

  const updatedTask = await projectDb.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      milestone: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // ユーザー情報を取得
  let assignee = null
  if (updatedTask.assigneeId) {
    assignee = await db.user.findUnique({
      where: { id: updatedTask.assigneeId },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
  }

  // 監査ログ（コメントも含める）
  const logDetails = comment 
    ? `タスク「${task.title}」のステータスを「${status}」に変更しました - コメント: ${comment}`
    : `タスク「${task.title}」のステータスを「${status}」に変更しました`
    
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'task',
      resourceId: taskId,
      details: logDetails
    }
  })

  return {
    ...updatedTask,
    status: updatedTask.status as TaskStatus,
    priority: updatedTask.priority as TaskPriority,
    assignee
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
  const task = await projectDb.task.findFirst({
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

  const updateData: unknown = {
    ...data,
    updatedAt: new Date()
  }

  if (data.startDate !== undefined) {
    updateData.startDate = data.startDate ? new Date(data.startDate) : null
  }
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null
  }

  const updatedTask = await projectDb.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      milestone: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // ユーザー情報を取得
  let assignee = null
  if (updatedTask.assigneeId) {
    assignee = await db.user.findUnique({
      where: { id: updatedTask.assigneeId },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
  }

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
    priority: updatedTask.priority as TaskPriority,
    assignee
  }
}

export async function deleteTask(taskId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // タスクのアクセス権限チェック
  const task = await projectDb.task.findFirst({
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

  await projectDb.task.delete({
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