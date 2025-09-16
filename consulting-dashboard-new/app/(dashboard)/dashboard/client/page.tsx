import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getClientPortalData } from '@/actions/client-portal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectOverview } from '@/components/dashboard/client/project-overview'
import { RecentActivities } from '@/components/dashboard/client/recent-activities'
import { ProjectStats } from '@/components/dashboard/client/project-stats'
import { Briefcase, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

export default async function ClientDashboard() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (user.role.name !== 'client' && user.role.name !== 'executive') {
    redirect('/dashboard/' + user.role.name)
  }

  const portalData = await getClientPortalData()

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold">クライアントポータル</h1>
        <p className="text-muted-foreground mt-1">
          {portalData.organization.name} - プロジェクト進捗と成果物の確認
        </p>
      </div>

      {/* 統計サマリー */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総プロジェクト数
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portalData.stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              全プロジェクト
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              進行中
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{portalData.stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              アクティブプロジェクト
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              完了済み
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{portalData.stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              完了プロジェクト
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総予算
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{portalData.stats.totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              アクティブプロジェクト合計
            </p>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* プロジェクト一覧 (2/3幅) */}
        <div className="md:col-span-2">
          <ProjectOverview projects={portalData.projects} />
        </div>

        {/* サイドバー (1/3幅) */}
        <div className="space-y-6">
          {/* プロジェクト統計 */}
          <ProjectStats projects={portalData.projects} />

          {/* 最近の活動 */}
          <RecentActivities activities={portalData.recentActivities} />
        </div>
      </div>
    </div>
  )
}