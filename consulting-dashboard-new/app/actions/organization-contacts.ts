'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { USER_ROLES } from '@/constants/roles'

export interface OrganizationContactItem {
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

export async function getOrganizationContacts(organizationId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
    return []
  }

  // エグゼクティブまたはPMのみ担当者一覧を表示可能
  if (user.role.name !== USER_ROLES.EXECUTIVE && user.role.name !== USER_ROLES.PM) {
    throw new Error('権限がありません')
  }

  const contacts = await db.organizationContact.findMany({
    where: {
      organizationId: organizationId,
      isActive: true
    },
    orderBy: [
      { isPrimary: 'desc' },
      { name: 'asc' }
    ]
  })

  return contacts
}

export async function createOrganizationContact(data: {
  organizationId: string
  name: string
  title?: string
  department?: string
  email?: string
  phone?: string
  mobile?: string
  isPrimary?: boolean
  notes?: string
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== USER_ROLES.EXECUTIVE && user.role.name !== USER_ROLES.PM)) {
    throw new Error('権限がありません')
  }

  // 組織が存在するかチェック
  const organization = await db.organization.findFirst({
    where: { id: data.organizationId }
  })

  if (!organization) {
    throw new Error('組織が見つかりません')
  }

  // 主担当者を設定する場合、既存の主担当者を更新
  if (data.isPrimary) {
    await db.organizationContact.updateMany({
      where: {
        organizationId: data.organizationId,
        isPrimary: true
      },
      data: {
        isPrimary: false
      }
    })
  }

  const contact = await db.organizationContact.create({
    data: {
      organizationId: data.organizationId,
      name: data.name,
      title: data.title,
      department: data.department,
      email: data.email,
      phone: data.phone,
      mobile: data.mobile,
      isPrimary: data.isPrimary || false,
      notes: data.notes
    }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'CREATE',
      resource: 'organization_contact',
      resourceId: contact.id,
      details: `担当者「${contact.name}」を作成しました（組織: ${organization.name}）`
    }
  })

  return contact
}

export async function updateOrganizationContact(contactId: string, data: {
  name: string
  title?: string
  department?: string
  email?: string
  phone?: string
  mobile?: string
  isPrimary?: boolean
  notes?: string
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== USER_ROLES.EXECUTIVE && user.role.name !== USER_ROLES.PM)) {
    throw new Error('権限がありません')
  }

  const contact = await db.organizationContact.findFirst({
    where: {
      id: contactId,
      isActive: true
    },
    include: {
      organization: true
    }
  })

  if (!contact) {
    throw new Error('担当者が見つかりません')
  }

  // 主担当者を設定する場合、既存の主担当者を更新
  if (data.isPrimary && !contact.isPrimary) {
    await db.organizationContact.updateMany({
      where: {
        organizationId: contact.organizationId,
        isPrimary: true,
        id: { not: contactId }
      },
      data: {
        isPrimary: false
      }
    })
  }

  const updatedContact = await db.organizationContact.update({
    where: { id: contactId },
    data: {
      name: data.name,
      title: data.title,
      department: data.department,
      email: data.email,
      phone: data.phone,
      mobile: data.mobile,
      isPrimary: data.isPrimary || false,
      notes: data.notes
    }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'organization_contact',
      resourceId: contactId,
      details: `担当者「${contact.name}」を「${data.name}」に更新しました`
    }
  })

  return updatedContact
}

export async function deleteOrganizationContact(contactId: string) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== USER_ROLES.EXECUTIVE && user.role.name !== USER_ROLES.PM)) {
    throw new Error('権限がありません')
  }

  const contact = await db.organizationContact.findFirst({
    where: {
      id: contactId,
      isActive: true
    },
    include: {
      organization: true
    }
  })

  if (!contact) {
    throw new Error('担当者が見つかりません')
  }

  // 論理削除
  await db.organizationContact.update({
    where: { id: contactId },
    data: {
      isActive: false
    }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'DELETE',
      resource: 'organization_contact',
      resourceId: contactId,
      details: `担当者「${contact.name}」を削除しました（組織: ${contact.organization.name}）`
    }
  })

  return { success: true }
}

export async function setPrimaryContact(contactId: string) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== USER_ROLES.EXECUTIVE && user.role.name !== USER_ROLES.PM)) {
    throw new Error('権限がありません')
  }

  const contact = await db.organizationContact.findFirst({
    where: {
      id: contactId,
      isActive: true
    }
  })

  if (!contact) {
    throw new Error('担当者が見つかりません')
  }

  // 既存の主担当者を更新
  await db.organizationContact.updateMany({
    where: {
      organizationId: contact.organizationId,
      isPrimary: true
    },
    data: {
      isPrimary: false
    }
  })

  // 新しい主担当者を設定
  const updatedContact = await db.organizationContact.update({
    where: { id: contactId },
    data: {
      isPrimary: true
    }
  })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'organization_contact',
      resourceId: contactId,
      details: `担当者「${contact.name}」を主担当者に設定しました`
    }
  })

  return updatedContact
}