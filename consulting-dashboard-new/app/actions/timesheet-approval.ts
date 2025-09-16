'use server'

import { getCurrentUser } from '@/actions/auth'
import { timesheetDb as db } from '@/lib/db/timesheet-db'
import { db as userDb } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 承認申請のスキーマ
const submitForApprovalSchema = z.object({
  timesheetId: z.string(),
})

// 承認/差戻しのスキーマ
const approvalActionSchema = z.object({
  timesheetId: z.string(),
  action: z.enum(['APPROVE', 'REJECT']),
  comments: z.string().optional(),
})

// 承認申請を提出
export async function submitTimesheetForApproval(timesheetId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('認証が必要です')
    }

    // タイムシートの所有者確認
    const timesheet = await db.timesheet.findUnique({
      where: { id: timesheetId },
      include: {
        entries: true
      }
    })

    if (!timesheet) {
      throw new Error('タイムシートが見つかりません')
    }

    if (timesheet.consultantId !== user.id) {
      throw new Error('このタイムシートを編集する権限がありません')
    }

    if (timesheet.status !== 'OPEN' && timesheet.status !== 'REJECTED') {
      throw new Error('入力中または差戻し状態のタイムシートのみ承認申請できます')
    }

    if (timesheet.entries.length === 0) {
      throw new Error('工数記録がないタイムシートは承認申請できません')
    }

    // タイムシートのステータスを更新
    const updated = await db.timesheet.update({
      where: { id: timesheetId },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    })

    // 承認履歴を作成
    await db.approvalHistory.create({
      data: {
        timesheetId: timesheetId,
        action: 'SUBMIT',
        actorId: user.id,
        timestamp: new Date(),
        comments: `${timesheet.totalHours}時間の工数を承認申請しました`,
        entriesAffected: JSON.stringify(timesheet.entries.map(e => e.id))
      }
    })

    revalidatePath('/timesheet')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Submit timesheet for approval error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '承認申請に失敗しました' 
    }
  }
}

// タイムシートを承認/差戻し
export async function approveOrRejectTimesheet(
  timesheetId: string, 
  action: 'APPROVE' | 'REJECT',
  comments?: string
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('認証が必要です')
    }

    // 承認権限の確認（PMまたはExecutiveロールが必要）
    const userRole = user.role.name.toLowerCase()
    if (!['pm', 'executive'].includes(userRole)) {
      throw new Error('承認権限がありません')
    }

    const timesheet = await db.timesheet.findUnique({
      where: { id: timesheetId },
      include: {
        entries: true
      }
    })

    if (!timesheet) {
      throw new Error('タイムシートが見つかりません')
    }

    if (timesheet.status !== 'SUBMITTED') {
      throw new Error('承認待ち状態のタイムシートのみ処理できます')
    }

    // プロジェクトメンバーかどうか確認（実際の実装では詳細な権限チェックが必要）
    // ここでは簡略化のため、PMとExecutiveは全て承認可能とする

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
    
    // タイムシートのステータスを更新
    const updated = await db.timesheet.update({
      where: { id: timesheetId },
      data: {
        status: newStatus,
        updatedAt: new Date()
      }
    })

    // 工数エントリのステータスも更新
    await db.timeEntry.updateMany({
      where: { timesheetId: timesheetId },
      data: {
        status: newStatus,
        ...(action === 'APPROVE' && {
          approvedAt: new Date(),
          approvedById: user.id
        })
      }
    })

    // 承認履歴を作成
    await db.approvalHistory.create({
      data: {
        timesheetId: timesheetId,
        action: action,
        actorId: user.id,
        timestamp: new Date(),
        comments: comments || (action === 'APPROVE' ? '承認されました' : '差戻されました'),
        entriesAffected: JSON.stringify(timesheet.entries.map(e => e.id))
      }
    })

    revalidatePath('/timesheet')
    revalidatePath('/timesheet/approval')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Approve/reject timesheet error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '処理に失敗しました' 
    }
  }
}

// 承認待ちタイムシートを取得
export async function getPendingApprovals() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('認証が必要です')
    }

    // 承認権限の確認
    const userRole = user.role.name.toLowerCase()
    if (!['pm', 'executive'].includes(userRole)) {
      return { success: true, data: [] }
    }

    const timesheets = await db.timesheet.findMany({
      where: {
        status: 'SUBMITTED'
      },
      include: {
        entries: true,
        approvalHistory: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        submittedAt: 'asc'
      }
    })

    // ユーザー情報を取得して付加
    const timesheetsWithUser = await Promise.all(
      timesheets.map(async (timesheet) => {
        const user = await userDb.user.findUnique({
          where: { id: timesheet.consultantId },
          select: { name: true, email: true }
        })
        return {
          ...timesheet,
          consultant: user
        }
      })
    )

    return { success: true, data: timesheetsWithUser }
  } catch (error) {
    console.error('Get pending approvals error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '承認待ちリストの取得に失敗しました' 
    }
  }
}

// 承認履歴を取得
export async function getApprovalHistory(timesheetId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('認証が必要です')
    }

    const timesheet = await db.timesheet.findUnique({
      where: { id: timesheetId }
    })

    if (!timesheet) {
      throw new Error('タイムシートが見つかりません')
    }

    // 本人または承認者のみ閲覧可能
    const userRole = user.role.name.toLowerCase()
    if (timesheet.consultantId !== user.id && !['pm', 'executive'].includes(userRole)) {
      throw new Error('承認履歴を閲覧する権限がありません')
    }

    const history = await db.approvalHistory.findMany({
      where: { timesheetId },
      orderBy: {
        timestamp: 'desc'
      }
    })

    return { success: true, data: history }
  } catch (error) {
    console.error('Get approval history error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '承認履歴の取得に失敗しました' 
    }
  }
}

// マイタイムシートの承認状況を取得
export async function getMyTimesheetStatuses() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('認証が必要です')
    }

    const timesheets = await db.timesheet.findMany({
      where: {
        consultantId: user.id
      },
      include: {
        entries: {
          select: {
            id: true
          }
        },
        approvalHistory: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        weekStartDate: 'desc'
      },
      take: 10
    })

    return { success: true, data: timesheets }
  } catch (error) {
    console.error('Get my timesheet statuses error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'タイムシート一覧の取得に失敗しました' 
    }
  }
}