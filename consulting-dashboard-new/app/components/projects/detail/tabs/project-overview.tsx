'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Target,
  Activity
} from 'lucide-react'

interface ProjectOverviewProps {
  project: unknown
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  // 最新のメトリクスを取得
  const latestMetrics = project.projectMetrics?.[0] || {
    progressRate: 0,
    margin: 0,
    utilization: 0,
    revenue: 0,
    cost: 0
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600'
    if (progress >= 70) return 'text-blue-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="grid gap-6">
      {/* KPIカード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">進捗率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getProgressColor(latestMetrics.progressRate)}`}>
              {latestMetrics.progressRate}%
            </div>
            <Progress value={latestMetrics.progressRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">収益</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(latestMetrics.revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              予算: {formatCurrency(project.budget)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">利益率</CardTitle>
            {latestMetrics.margin > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${latestMetrics.margin > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {((latestMetrics.margin / latestMetrics.revenue) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              利益: {formatCurrency(latestMetrics.margin)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">リソース使用率</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(latestMetrics.utilization * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              チーム: {project.projectMembers.length}名
            </p>
          </CardContent>
        </Card>
      </div>

      {/* プロジェクトサマリー */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>プロジェクトサマリー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">プロジェクトマネージャー</span>
                <span className="text-sm font-medium">
                  {project.projectMembers.find((m: unknown) => m.role === 'pm')?.user.name || '未割当'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">アクティブタスク</span>
                <span className="text-sm font-medium">12件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">完了タスク</span>
                <span className="text-sm font-medium">45件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">次のマイルストーン</span>
                <span className="text-sm font-medium">
                  {project.milestones?.[0]?.name || 'なし'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm">タスク「要件定義書作成」が完了しました</p>
                  <p className="text-xs text-muted-foreground">2時間前</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm">新しいリスクが報告されました</p>
                  <p className="text-xs text-muted-foreground">5時間前</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm">マイルストーン「フェーズ1完了」の期限が近づいています</p>
                  <p className="text-xs text-muted-foreground">1日前</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* リスクと課題 */}
      <Card>
        <CardHeader>
          <CardTitle>リスクと課題</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">高</Badge>
                  <h4 className="text-sm font-medium">技術的負債の蓄積</h4>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  短期的な実装を優先した結果、技術的負債が蓄積している
                </p>
              </div>
              <span className="text-xs text-muted-foreground">2日前</span>
            </div>
            <div className="flex items-start justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">中</Badge>
                  <h4 className="text-sm font-medium">スケジュール遅延の可能性</h4>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  要件変更により、当初スケジュールに遅延が生じる可能性がある
                </p>
              </div>
              <span className="text-xs text-muted-foreground">1週間前</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}