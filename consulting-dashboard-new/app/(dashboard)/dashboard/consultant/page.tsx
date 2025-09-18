import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getConsultantDashboardData } from '@/actions/consultant-dashboard'
import { USER_ROLES } from '@/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TaskList } from '@/components/dashboard/consultant/task-list'
import { WeeklyCalendar } from '@/components/dashboard/consultant/weekly-calendar'
import { ProjectCards } from '@/components/dashboard/consultant/project-cards'
import { SkillsSummary } from '@/components/dashboard/consultant/skills-summary'
import { Calendar, CheckCircle2, Clock, FileText, Target } from 'lucide-react'

export default async function ConsultantDashboard() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role.name !== USER_ROLES.CONSULTANT && user.role.name !== USER_ROLES.EXECUTIVE) {
    redirect('/dashboard/' + user.role.name.toLowerCase())
  }

  const dashboardData = await getConsultantDashboardData()

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold">コンサルタントダッシュボード</h1>
        <p className="text-muted-foreground mt-1">
          タスクの管理と進捗確認
        </p>
      </div>

      {/* 統計サマリー */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              未完了タスク
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.taskStats.todo + dashboardData.taskStats.in_progress}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.taskStats.in_progress} 進行中
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              レビュー待ち
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.taskStats.in_review}</div>
            <p className="text-xs text-muted-foreground">
              承認待ちタスク
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              今月の完了タスク
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardData.completedTasksThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              タスク完了
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブプロジェクト
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.projects.length}</div>
            <p className="text-xs text-muted-foreground">
              参加プロジェクト
            </p>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 左カラム */}
        <div className="space-y-6">
          {/* タスク一覧 */}
          <TaskList tasks={dashboardData.tasks} />

          {/* プロジェクト一覧 */}
          <ProjectCards projects={dashboardData.projects} />
        </div>

        {/* 右カラム */}
        <div className="space-y-6">
          {/* 今週のスケジュール */}
          <WeeklyCalendar tasks={dashboardData.weeklyTasks} />

          {/* スキルサマリー */}
          <SkillsSummary skills={dashboardData.skills} />
        </div>
      </div>
    </div>
  )
}