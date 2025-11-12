import { TimesheetClientPage } from './client-page'
import { getWeeklyTimesheet, getMonthlyTimeSummary } from '@/actions/timesheet-new'
import { getMyTimesheetStatuses } from '@/actions/timesheet-approval'
import { projectDb } from '@/lib/prisma-vercel'
import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
// import { startOfWeek, endOfWeek } from 'date-fns'

export default async function TimesheetPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // プロジェクト一覧を取得
  // エグゼクティブの場合は全プロジェクト、それ以外はアサインされているプロジェクトのみ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = await (projectDb as any).project.findMany({
    where: user.role?.name === 'Executive'
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

  // クライアント情報を取得
  const clientIds = [...new Set(projects.map(p => p.clientId))]
  const clients = await db.organization.findMany({
    where: { id: { in: clientIds } }
  })
  const clientMap = new Map(clients.map(c => [c.id, c]))

  // プロジェクトにクライアント情報を追加
  const projectsWithClients = projects.map(p => ({
    ...p,
    client: clientMap.get(p.clientId) || { name: 'クライアント未設定' }
  }))

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
      projects={projectsWithClients}
      initialWeeklyData={weeklyData}
      monthlySummary={monthlySummary}
      timesheets={timesheets}
    />
  )
}