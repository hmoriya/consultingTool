import { TimesheetClientPage } from './client-page'
import { getWeeklyTimesheet, getMonthlyTimeSummary } from '@/actions/timesheet-new'
import { getMyTimesheetStatuses } from '@/actions/timesheet-approval'
import { projectDb, authDb } from '@/lib/prisma-vercel'
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientIds = [...new Set(projects.map((p: any) => p.clientId))]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clients = await (authDb as any).organization.findMany({
    where: { id: { in: clientIds } }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientMap = new Map(clients.map((c: any) => [c.id, c]))

  // プロジェクトにクライアント情報を追加
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projectsWithClients = projects.map((p: any) => ({
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timesheets = timesheetsResult.success ? timesheetsResult.data : [] as any

  return (
    <TimesheetClientPage
      projects={projectsWithClients}
      initialWeeklyData={weeklyData}
      monthlySummary={monthlySummary}
      timesheets={timesheets}
    />
  )
}