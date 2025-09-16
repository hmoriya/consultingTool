import { TimesheetClientPage } from './client-page'
import { getWeeklyTimesheet, getMonthlyTimeSummary } from '@/actions/timesheet-new'
import { getMyTimesheetStatuses } from '@/actions/timesheet-approval'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek } from 'date-fns'

export default async function TimesheetPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // プロジェクト一覧を取得
  // エグゼクティブの場合は全プロジェクト、それ以外はアサインされているプロジェクトのみ
  const projects = await db.project.findMany({
    where: user.role?.name === 'executive' 
      ? {
          status: {
            not: 'completed'
          }
        }
      : {
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
      tasks: {
        where: {
          status: {
            not: 'completed'
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  // 今週の工数データを取得
  const today = new Date()
  const weeklyData = await getWeeklyTimesheet(today)
  
  // 今月のサマリーを取得
  const monthlySummary = await getMonthlyTimeSummary(
    today.getFullYear(),
    today.getMonth() + 1
  )

  // マイタイムシート一覧を取得
  const timesheetsResult = await getMyTimesheetStatuses()
  const timesheets = timesheetsResult.success ? timesheetsResult.data : []

  return (
    <TimesheetClientPage 
      projects={projects}
      initialWeeklyData={weeklyData}
      monthlySummary={monthlySummary}
      timesheets={timesheets}
    />
  )
}