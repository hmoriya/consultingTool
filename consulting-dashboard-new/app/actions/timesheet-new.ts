'use server'

import { timesheetDb } from '@/lib/db/timesheet-db'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// バリデーションスキーマ
const timeEntrySchema = z.object({
  projectId: z.string().min(1, 'プロジェクトを選択してください'),
  taskId: z.string().optional(),
  date: z.string().or(z.date()).transform(val => new Date(val)),
  hours: z.number().min(0.5, '最小0.5時間').max(24, '最大24時間'),
  description: z.string().min(1, '作業内容を入力してください'),
  billable: z.boolean().default(true),
  activityType: z.enum([
    'DEVELOPMENT',
    'MEETING',
    'DOCUMENTATION',
    'REVIEW',
    'TRAVEL',
    'TRAINING',
    'SALES',
    'ADMIN',
    'OTHER'
  ])
})

// 工数記録の作成
export async function createTimeEntry(data: z.infer<typeof timeEntrySchema>) {
  try {
    console.log('createTimeEntry called with:', data)
    const user = await getCurrentUser()
    console.log('getCurrentUser result:', user)
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const validated = timeEntrySchema.parse(data)
    const date = new Date(validated.date)
    const weekNumber = getWeekNumber(date)

    // タイムシートを取得または作成
    const { weekStartDate, weekEndDate } = getWeekDates(date)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timesheet = await (timesheetDb as any).Timesheet.findUnique({
      where: {
        consultantId_weekStartDate: {
          consultantId: user.id,
          weekStartDate
        }
      }
    })

    if (!timesheet) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      timesheet = await (timesheetDb as any).Timesheet.create({
        data: {
          consultantId: user.id,
          weekStartDate,
          weekEndDate,
          status: 'OPEN'
        }
      })
    }

    // 工数記録を作成
    console.log('Creating time entry with data:', {
      ...validated,
      consultantId: user.id,
      weekNumber,
      timesheetId: timesheet.id,
      status: 'DRAFT'
    })
    
    let timeEntry
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      timeEntry = await (timesheetDb as any).TimeEntry.create({
        data: {
          ...validated,
          consultantId: user.id,
          weekNumber,
          timesheetId: timesheet.id,
          status: 'DRAFT'
        }
      })
      console.log('Created time entry:', timeEntry)
    } catch (dbError) {
      console.error('Database error creating time entry:', dbError)
      throw dbError
    }

    // タイムシートの合計時間を更新
    await updateTimesheetTotals(timesheet.id)

    revalidatePath('/timesheet')
    return { success: true, data: timeEntry }
  } catch (_error) {
    console.error('createTimeEntry error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: error instanceof Error ? error.message : '工数記録の作成に失敗しました' }
  }
}

// 工数記録の更新
export async function updateTimeEntry(id: string, data: Partial<z.infer<typeof timeEntrySchema>>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // 所有権の確認
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (timesheetDb as any).TimeEntry.findFirst({
      where: { id, consultantId: user.id }
    })

    if (!existing) {
      return { success: false, error: '工数記録が見つかりません' }
    }
    if (existing.status !== 'DRAFT' && existing.status !== 'OPEN') {
      return { success: false, error: '承認済みの工数は編集できません' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await (timesheetDb as any).TimeEntry.update({
      where: { id },
      data
    })

    if (existing.timesheetId) {
      await updateTimesheetTotals(existing.timesheetId)
    }

    revalidatePath('/timesheet')
    return { success: true, data: updated }
  } catch (_error) {
    console.error('updateTimeEntry error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '工数記録の更新に失敗しました' 
    }
  }
}

// 工数記録の削除
export async function deleteTimeEntry(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (timesheetDb as any).TimeEntry.findFirst({
      where: { id, consultantId: user.id }
    })

    if (!existing) {
      return { success: false, error: '工数記録が見つかりません' }
    }
    if (existing.status !== 'DRAFT' && existing.status !== 'OPEN') {
      return { success: false, error: '承認済みの工数は削除できません' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (timesheetDb as any).TimeEntry.delete({ where: { id } })

    if (existing.timesheetId) {
      await updateTimesheetTotals(existing.timesheetId)
    }

    revalidatePath('/timesheet')
    return { success: true }
  } catch (_error) {
    console.error('deleteTimeEntry error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '工数記録の削除に失敗しました' 
    }
  }
}

// タイムシートの提出
export async function submitTimesheet(timesheetId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('認証が必要です')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timesheet = await (timesheetDb as any).Timesheet.findFirst({
    where: { id: timesheetId, consultantId: user.id },
    include: { entries: true }
  })

  if (!timesheet) throw new Error('タイムシートが見つかりません')
  if (timesheet.status !== 'OPEN') throw new Error('このタイムシートは既に提出済みです')
  if (timesheet.entries.length === 0) throw new Error('工数記録がありません')

  // タイムシートと関連する工数記録を提出済みに更新
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (timesheetDb as any).$transaction([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (timesheetDb as any).Timesheet.update({
      where: { id: timesheetId },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (timesheetDb as any).TimeEntry.updateMany({
      where: { timesheetId },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (timesheetDb as any).ApprovalHistory.create({
      data: {
        timesheetId,
        action: 'SUBMIT',
        actorId: user.id,
        entriesAffected: JSON.stringify(timesheet.entries.map(e => e.id))
      }
    })
  ])

  revalidatePath('/timesheet')
  return { success: true }
}

// 週次の工数記録を取得
export async function getWeeklyTimesheet(date: Date) {
  const user = await getCurrentUser()
  if (!user) return null

  const { weekStartDate, weekEndDate } = getWeekDates(date)
  console.log('getWeeklyTimesheet - date:', date)
  console.log('getWeeklyTimesheet - weekStartDate:', weekStartDate)
  console.log('getWeeklyTimesheet - weekEndDate:', weekEndDate)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timesheet = await (timesheetDb as any).Timesheet.findUnique({
    where: {
      consultantId_weekStartDate: {
        consultantId: user.id,
        weekStartDate
      }
    },
    include: {
      entries: {
        orderBy: { date: 'asc' }
      },
      approvalHistory: {
        orderBy: { timestamp: 'desc' }
      }
    }
  })

  // タイムシートがない場合でも、週内のエントリを取得
  if (!timesheet) {
    // 週内のエントリを直接取得
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = await (timesheetDb as any).TimeEntry.findMany({
      where: {
        consultantId: user.id,
        date: {
          gte: weekStartDate,
          lte: weekEndDate
        }
      },
      orderBy: { date: 'asc' }
    })

    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
    const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0)
    const nonBillableHours = totalHours - billableHours

    console.log('getWeeklyTimesheet - no timesheet, found entries:', entries.length)
    console.log('getWeeklyTimesheet - totalHours:', totalHours)

    return {
      id: '',
      weekStartDate,
      weekEndDate,
      totalHours,
      billableHours,
      nonBillableHours,
      status: 'OPEN',
      entries
    }
  }

  console.log('getWeeklyTimesheet - found timesheet with entries:', timesheet.entries.length)

  // タイムシートのエントリだけでなく、週内の全エントリを取得
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allEntries = await (timesheetDb as any).TimeEntry.findMany({
    where: {
      consultantId: user.id,
      date: {
        gte: weekStartDate,
        lte: weekEndDate
      }
    },
    orderBy: { date: 'asc' }
  })

  const totalHours = allEntries.reduce((sum, e) => sum + e.hours, 0)
  const billableHours = allEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0)
  const nonBillableHours = totalHours - billableHours

  console.log('getWeeklyTimesheet - all entries in week:', allEntries.length)
  console.log('getWeeklyTimesheet - recalculated totalHours:', totalHours)

  return {
    ...timesheet,
    weekStartDate,
    weekEndDate,
    entries: allEntries,
    totalHours,
    billableHours,
    nonBillableHours
  }
}

// 月次の工数サマリーを取得
export async function getMonthlyTimeSummary(year: number, month: number) {
  const user = await getCurrentUser()
  if (!user) return null

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries = await (timesheetDb as any).TimeEntry.findMany({
    where: {
      consultantId: user.id,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { date: 'asc' }
  })

  const summary = {
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
    billableHours: entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0),
    nonBillableHours: entries.filter(e => !e.billable).reduce((sum, e) => sum + e.hours, 0),
    byProject: {} as Record<string, number>,
    byActivity: {} as Record<string, number>,
    entries
  }

  entries.forEach(entry => {
    summary.byProject[entry.projectId] = (summary.byProject[entry.projectId] || 0) + entry.hours
    summary.byActivity[entry.activityType] = (summary.byActivity[entry.activityType] || 0) + entry.hours
  })

  return summary
}

// ヘルパー関数
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getWeekDates(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  // 日曜日を週の始まりとする（日本式）
  const diff = d.getDate() - day
  
  const weekStartDate = new Date(d)
  weekStartDate.setDate(diff)
  weekStartDate.setHours(0, 0, 0, 0)
  weekStartDate.setMilliseconds(0)
  
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekStartDate.getDate() + 6)
  weekEndDate.setHours(23, 59, 59, 999)
  
  return { weekStartDate, weekEndDate }
}

async function updateTimesheetTotals(timesheetId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries = await (timesheetDb as any).TimeEntry.findMany({
    where: { timesheetId }
  })

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
  const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0)
  const nonBillableHours = totalHours - billableHours

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (timesheetDb as any).Timesheet.update({
    where: { id: timesheetId },
    data: {
      totalHours,
      billableHours,
      nonBillableHours
    }
  })
}