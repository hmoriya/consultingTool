import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getPMDashboardData } from '@/actions/pm-dashboard'
import { getPendingApprovals } from '@/actions/timesheet-approval'
import { ProjectSummaryCard } from '@/components/dashboard/pm/project-summary-card'
import { TaskStats } from '@/components/dashboard/pm/task-stats'
import { UpcomingMilestones } from '@/components/dashboard/pm/upcoming-milestones'
import { RiskyTasks } from '@/components/dashboard/pm/risky-tasks'
import { TeamUtilization } from '@/components/dashboard/pm/team-utilization'
import { PendingTimesheetApprovals } from '@/components/dashboard/pm/pending-timesheet-approvals'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BarChart3, Users, Calendar, AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function PMDashboard() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role.name !== 'pm' && user.role.name !== 'executive') {
    redirect('/dashboard/' + user.role.name)
  }

  const dashboardData = await getPMDashboardData()
  const pendingApprovals = await getPendingApprovals()

  return (
      <div className="container max-w-7xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">プロジェクトマネージャーダッシュボード</h1>
            <p className="text-muted-foreground mt-1">
              プロジェクトの進捗とチームの状況を管理
            </p>
          </div>
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新規プロジェクト
            </Button>
          </Link>
        </div>

        {/* 統計サマリー */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                アクティブプロジェクト
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.projects.length}</div>
              <p className="text-xs text-muted-foreground">
                管理中のプロジェクト
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                総タスク数
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.taskStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.taskStats.completed} 完了
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                今週のマイルストーン
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.upcomingMilestones.length}</div>
              <p className="text-xs text-muted-foreground">
                期限が近いマイルストーン
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                要注意タスク
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dashboardData.riskyTasks.length}
              </div>
              <p className="text-xs text-muted-foreground">
                期限切れ・期限間近
              </p>
            </CardContent>
          </Card>

          <Link href="/timesheet/approval" className="block">
            <Card className="hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  承認待ち工数
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {pendingApprovals.success ? pendingApprovals.data?.length || 0 : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  承認が必要な工数記録
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* メインコンテンツ */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* 左カラム */}
          <div className="space-y-6">
            {/* プロジェクト一覧 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">管理中のプロジェクト</h2>
                <Link href="/projects">
                  <Button variant="ghost" size="sm">
                    すべて見る
                  </Button>
                </Link>
              </div>
              {dashboardData.projects.length === 0 ? (
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      管理中のプロジェクトはありません
                    </p>
                    <Link href="/projects/new">
                      <Button variant="outline" size="sm" className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        プロジェクトを作成
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {dashboardData.projects.slice(0, 3).map((project) => (
                    <ProjectSummaryCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </div>

            {/* タスク統計 */}
            <TaskStats stats={dashboardData.taskStats} />
          </div>

          {/* 右カラム */}
          <div className="space-y-6">
            {/* 今週のマイルストーン */}
            <UpcomingMilestones milestones={dashboardData.upcomingMilestones} />

            {/* 要注意タスク */}
            <RiskyTasks tasks={dashboardData.riskyTasks} />

            {/* チーム稼働率 */}
            <TeamUtilization members={dashboardData.teamUtilization} />

            {/* 承認待ち工数 */}
            {pendingApprovals.success && pendingApprovals.data && (
              <PendingTimesheetApprovals timesheets={pendingApprovals.data} />
            )}
          </div>
        </div>
      </div>
  )
}