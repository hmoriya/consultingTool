'use server'

import { authDb } from '@/app/lib/db/auth-db'
import { projectDb } from '@/app/lib/db/project-db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { USER_ROLES } from '@/constants/roles'

export interface ClientItem {
  id: string
  name: string
  type: string
  industry?: string | null
  description?: string | null
  website?: string | null
  employeeCount?: number | null
  foundedYear?: number | null
  address?: string | null
  phone?: string | null
  email?: string | null
  createdAt: Date
  updatedAt: Date
  projectCount?: number
  activeProjectCount?: number
  contacts?: OrganizationContact[]
}

export interface OrganizationContact {
  id: string
  organizationId: string
  name: string
  title?: string | null
  department?: string | null
  email?: string | null
  phone?: string | null
  mobile?: string | null
  isPrimary: boolean
  isActive: boolean
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export async function getClients() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return [] // TypeScriptのためのreturn
  }

  // コンサルタントも含めてクライアント一覧を表示可能
  // (作成・編集・削除は別途制限)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clients = await (authDb as any).organization.findMany({
    where: {
      type: 'client'
    },
    include: {
      contacts: {
        where: {
          isActive: true
        },
        orderBy: [
          { isPrimary: 'desc' },
          { name: 'asc' }
        ]
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  // 各クライアントのプロジェクト数を取得
  const clientsWithProjectCount = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clients.map(async (client: any) => {
      let projects = []
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects = await (projectDb as any).project.findMany({
          where: {
            clientId: client.id
          },
          select: {
            id: true,
            status: true
          }
        })
      } catch (error) {
        console.error('Error fetching projects for client:', client.id, error)
        // If project DB is not working, continue without project data
      }

      return {
        id: client.id,
        name: client.name,
        type: client.type,
        industry: client.industry,
        description: client.description,
        website: client.website,
        employeeCount: client.employeeCount,
        foundedYear: client.foundedYear,
        address: client.address,
        phone: client.phone,
        email: client.email,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        projectCount: projects.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activeProjectCount: projects.filter((p: any) => p.status === 'active').length,
        contacts: client.contacts
      }
    })
  )

  return clientsWithProjectCount
}

export async function createClient(data: {
  name: string
  industry?: string
  description?: string
  website?: string
  employeeCount?: number
  foundedYear?: number
  address?: string
  phone?: string
  email?: string
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== USER_ROLES.EXECUTIVE && user.role.name !== USER_ROLES.PM)) {
    throw new Error('権限がありません')
  }

  // 同名のクライアント組織が既に存在しないかチェック
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingClient = await (authDb as any).organization.findFirst({
    where: {
      name: data.name,
      type: 'client'
    }
  })

  if (existingClient) {
    throw new Error('同名のクライアントが既に存在します')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = await (authDb as any).organization.create({
    data: {
      name: data.name,
      type: 'client',
      industry: data.industry,
      description: data.description,
      website: data.website,
      employeeCount: data.employeeCount,
      foundedYear: data.foundedYear,
      address: data.address,
      phone: data.phone,
      email: data.email
    }
  })

  // 監査ログ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (authDb as any).auditLog.create({
    data: {
      userId: user.id,
      action: 'CREATE',
      resource: 'client',
      resourceId: client.id,
      details: `クライアント「${client.name}」を作成しました`
    }
  })

  return client
}

export async function updateClient(clientId: string, data: {
  name: string
  industry?: string
  description?: string
  website?: string
  employeeCount?: number
  foundedYear?: number
  address?: string
  phone?: string
  email?: string
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== USER_ROLES.EXECUTIVE && user.role.name !== USER_ROLES.PM)) {
    throw new Error('権限がありません')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = await (authDb as any).organization.findFirst({
    where: {
      id: clientId,
      type: 'client'
    }
  })

  if (!client) {
    throw new Error('クライアントが見つかりません')
  }

  // 同名のクライアント組織が既に存在しないかチェック（自分自身を除く）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingClient = await (authDb as any).organization.findFirst({
    where: {
      name: data.name,
      type: 'client',
      id: { not: clientId }
    }
  })

  if (existingClient) {
    throw new Error('同名のクライアントが既に存在します')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedClient = await (authDb as any).organization.update({
    where: { id: clientId },
    data: {
      name: data.name,
      industry: data.industry,
      description: data.description,
      website: data.website,
      employeeCount: data.employeeCount,
      foundedYear: data.foundedYear,
      address: data.address,
      phone: data.phone,
      email: data.email
    }
  })

  // 監査ログ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (authDb as any).auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'client',
      resourceId: clientId,
      details: `クライアント「${client.name}」を「${data.name}」に更新しました`
    }
  })

  return updatedClient
}

export async function deleteClient(clientId: string) {
  const user = await getCurrentUser()
  if (!user || user.role.name !== USER_ROLES.EXECUTIVE) {
    throw new Error('権限がありません（エグゼクティブのみ削除可能）')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = await (authDb as any).organization.findFirst({
    where: {
      id: clientId,
      type: 'client'
    }
  })

  if (!client) {
    throw new Error('クライアントが見つかりません')
  }

  // プロジェクトが存在するかチェック
  const projectCount = await projectDb.project.count({
    where: {
      clientId: clientId
    }
  })

  if (projectCount > 0) {
    throw new Error(`このクライアントには${projectCount}件のプロジェクトが存在します。削除できません。`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (authDb as any).organization.delete({
    where: { id: clientId }
  })

  // 監査ログ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (authDb as any).auditLog.create({
    data: {
      userId: user.id,
      action: 'DELETE',
      resource: 'client',
      resourceId: clientId,
      details: `クライアント「${client.name}」を削除しました`
    }
  })

  return { success: true }
}

export async function searchClients(query: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // コンサルタントも含めてクライアント検索可能
  // (作成・編集・削除は別途制限)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clients = await (authDb as any).organization.findMany({
    where: {
      type: 'client',
      name: {
        contains: query,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: 'asc'
    },
    take: 10 // 最大10件まで
  })

  return clients
}