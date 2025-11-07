import { getTeamUtilization, getUtilizationRecommendations } from '../../../actions/utilization'
import { getCurrentUser } from '../../../actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Activity, AlertCircle, TrendingUp, TrendingDown, Users } from 'lucide-react'
import { UtilizationChart } from './utilization-chart'
import { MemberUtilizationCard } from './member-utilization-card'
import { ResourceOptimization } from './resource-optimization'

export default async function UtilizationPage() {
  const [user, utilization, recommendations] = await Promise.all([
    getCurrentUser(),
    getTeamUtilization(),
    getUtilizationRecommendations().catch(() => null)
  ])

  if (!user) {
    return null
  }

  const isExecutive = user.role.name === 'Executive'

  // 統計情報の計算
  const totalMembers = utilization.length
  const avgUtilization = Math.round(
    utilization.reduce((sum, m) => sum + m.currentAllocation, 0) / totalMembers || 0
  )
  const highUtilizationCount = utilization.filter(m => m.currentAllocation >= 90).length
  const lowUtilizationCount = utilization.filter(m => m.currentAllocation < 50).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">稼働率管理</h1>
        <p className="text-muted-foreground">
          チームメンバーの稼働状況とリソース配分を管理します
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              平均稼働率
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUtilization}%</div>
            <Progress value={avgUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              チームメンバー
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              PM・コンサルタント
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              高稼働メンバー
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highUtilizationCount}</div>
            <p className="text-xs text-muted-foreground">
              90%以上
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              低稼働メンバー
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowUtilizationCount}</div>
            <p className="text-xs text-muted-foreground">
              50%未満
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 推奨事項アラート */}
      {isExecutive && recommendations && recommendations.recommendations.length > 0 && (
        <div className="space-y-2">
          {recommendations.recommendations.slice(0, 3).map((rec, index) => (
            <Card key={index} className={rec.priority === 'high' ? 'border-destructive' : ''}>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                <AlertCircle className="h-4 w-4" />
                <CardTitle className="text-sm">
                  {rec.priority === 'high' ? '要対応' : '推奨'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{rec.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* タブ */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="members">メンバー別</TabsTrigger>
          <TabsTrigger value="trends">トレンド</TabsTrigger>
          {isExecutive && (
            <TabsTrigger value="optimization">最適化</TabsTrigger>
          )}
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* 稼働率分布チャート */}
            <Card>
              <CardHeader>
                <CardTitle>稼働率分布</CardTitle>
                <CardDescription>
                  メンバーの稼働率分布状況
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UtilizationChart data={utilization} type="distribution" />
              </CardContent>
            </Card>

            {/* ロール別稼働率 */}
            <Card>
              <CardHeader>
                <CardTitle>ロール別平均稼働率</CardTitle>
                <CardDescription>
                  各ロールの平均稼働状況
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UtilizationChart data={utilization} type="by-role" />
              </CardContent>
            </Card>
          </div>

          {/* 稼働率ランキング */}
          <Card>
            <CardHeader>
              <CardTitle>稼働率ランキング</CardTitle>
              <CardDescription>
                現在の稼働率が高い/低いメンバー
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-3">高稼働TOP5</h4>
                  <div className="space-y-2">
                    {utilization.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={member.currentAllocation} 
                            className="w-20"
                          />
                          <span className="text-sm font-medium w-12 text-right">
                            {member.currentAllocation}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">低稼働TOP5</h4>
                  <div className="space-y-2">
                    {utilization
                      .sort((a, b) => a.currentAllocation - b.currentAllocation)
                      .slice(0, 5)
                      .map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={member.currentAllocation} 
                              className="w-20"
                            />
                            <span className="text-sm font-medium w-12 text-right">
                              {member.currentAllocation}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* メンバー別タブ */}
        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {utilization.map((member) => (
              <MemberUtilizationCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>

        {/* トレンドタブ */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>稼働率トレンド</CardTitle>
              <CardDescription>
                過去3ヶ月の稼働率推移
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UtilizationChart data={utilization} type="trend" />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>週次稼働率推移</CardTitle>
                <CardDescription>
                  過去4週間の変化
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UtilizationChart data={utilization} type="weekly" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>月次稼働率比較</CardTitle>
                <CardDescription>
                  月ごとの稼働率変化
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UtilizationChart data={utilization} type="monthly" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 最適化タブ（エグゼクティブのみ） */}
        {isExecutive && (
          <TabsContent value="optimization" className="space-y-4">
            <ResourceOptimization 
              utilization={utilization} 
              recommendations={recommendations}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}