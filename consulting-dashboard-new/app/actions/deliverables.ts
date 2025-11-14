'use server'

import { projectDb } from '@/lib/db/project-db'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// バリデーションスキーマ
const deliverableSchema = z.object({
  projectId: z.string().min(1, 'プロジェクトを選択してください'),
  milestoneId: z.string().optional(),
  name: z.string().min(1, '成果物名を入力してください'),
  description: z.string().optional(),
  type: z.enum(['document', 'software', 'report', 'presentation', 'other']),
  status: z.enum(['draft', 'review', 'approved', 'delivered']).default('draft'),
  version: z.string().optional(),
  fileUrl: z.string().optional()
})

// 成果物作成
export async function createDeliverable(data: z.infer<typeof deliverableSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const validated = deliverableSchema.parse(data)

    // プロジェクトへのアクセス権限確認
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectMember = await (projectDb as any).ProjectMember.findFirst({
      where: {
        projectId: validated.projectId,
        userId: user.id
      }
    })

    if (!projectMember) {
      return { success: false, error: 'このプロジェクトへのアクセス権限がありません' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deliverable = await (projectDb as any).Deliverable.create({
      data: validated,
      include: {
        project: {
          select: { name: true, code: true }
        },
        milestone: {
          select: { name: true }
        }
      }
    })

    revalidatePath('/deliverables')
    revalidatePath('/projects')
    return { success: true, data: deliverable }
  } catch (error) {
    console.error('createDeliverable error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: '成果物の作成に失敗しました' }
  }
}

// 成果物更新
export async function updateDeliverable(id: string, data: Partial<z.infer<typeof deliverableSchema>>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // 既存の成果物を取得してアクセス権限確認
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (projectDb as any).Deliverable.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            projectMembers: {
              where: { userId: user.id }
            }
          }
        }
      }
    })

    if (!existing) {
      return { success: false, error: '成果物が見つかりません' }
    }

    if (existing.project.projectMembers.length === 0) {
      return { success: false, error: 'この成果物への編集権限がありません' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deliverable = await (projectDb as any).Deliverable.update({
      where: { id },
      data,
      include: {
        project: {
          select: { name: true, code: true }
        },
        milestone: {
          select: { name: true }
        }
      }
    })

    revalidatePath('/deliverables')
    revalidatePath('/projects')
    return { success: true, data: deliverable }
  } catch (error) {
    console.error('updateDeliverable error:', error)
    return { success: false, error: '成果物の更新に失敗しました' }
  }
}

// 成果物削除
export async function deleteDeliverable(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // 既存の成果物を取得してアクセス権限確認
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (projectDb as any).Deliverable.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            projectMembers: {
              where: { userId: user.id }
            }
          }
        }
      }
    })

    if (!existing) {
      return { success: false, error: '成果物が見つかりません' }
    }

    if (existing.project.projectMembers.length === 0) {
      return { success: false, error: 'この成果物への削除権限がありません' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (projectDb as any).Deliverable.delete({
      where: { id }
    })

    revalidatePath('/deliverables')
    revalidatePath('/projects')
    return { success: true }
  } catch (error) {
    console.error('deleteDeliverable error:', error)
    return { success: false, error: '成果物の削除に失敗しました' }
  }
}

// 成果物一覧取得
export async function getDeliverables(projectId?: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // ユーザーがアクセス可能なプロジェクトIDを取得
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessibleProjects = await (projectDb as any).ProjectMember.findMany({
      where: { userId: user.id },
      select: { projectId: true }
    })

    const projectIds = accessibleProjects.map(pm => pm.projectId)

    const whereClause: unknown = {
      projectId: { in: projectIds }
    }

    if (projectId) {
      whereClause.projectId = projectId
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deliverables = await (projectDb as any).Deliverable.findMany({
      where: whereClause,
      include: {
        project: {
          select: { name: true, code: true }
        },
        milestone: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: deliverables }
  } catch (error) {
    console.error('getDeliverables error:', error)
    return { success: false, error: '成果物一覧の取得に失敗しました' }
  }
}

// 成果物詳細取得
export async function getDeliverableById(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deliverable = await (projectDb as any).Deliverable.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            name: true,
            code: true,
            projectMembers: {
              where: { userId: user.id }
            }
          }
        },
        milestone: {
          select: { name: true }
        }
      }
    })

    if (!deliverable) {
      return { success: false, error: '成果物が見つかりません' }
    }

    if (deliverable.project.projectMembers.length === 0) {
      return { success: false, error: 'この成果物へのアクセス権限がありません' }
    }

    return { success: true, data: deliverable }
  } catch (error) {
    console.error('getDeliverableById error:', error)
    return { success: false, error: '成果物の取得に失敗しました' }
  }
}

// プロジェクト一覧取得（成果物作成時のプロジェクト選択用）
export async function getAccessibleProjects() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects = await (projectDb as any).Project.findMany({
      where: {
        projectMembers: {
          some: { userId: user.id }
        }
      },
      select: {
        id: true,
        name: true,
        code: true,
        status: true
      },
      orderBy: { name: 'asc' }
    })

    return { success: true, data: projects }
  } catch (error) {
    console.error('getAccessibleProjects error:', error)
    return { success: false, error: 'プロジェクト一覧の取得に失敗しました' }
  }
}

// プロジェクトのマイルストーン一覧取得
export async function getProjectMilestones(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // プロジェクトへのアクセス権限確認
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectMember = await (projectDb as any).ProjectMember.findFirst({
      where: {
        projectId,
        userId: user.id
      }
    })

    if (!projectMember) {
      return { success: false, error: 'このプロジェクトへのアクセス権限がありません' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const milestones = await (projectDb as any).Milestone.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        dueDate: true,
        status: true
      },
      orderBy: { dueDate: 'asc' }
    })

    return { success: true, data: milestones }
  } catch (error) {
    console.error('getProjectMilestones error:', error)
    return { success: false, error: 'マイルストーン一覧の取得に失敗しました' }
  }
}