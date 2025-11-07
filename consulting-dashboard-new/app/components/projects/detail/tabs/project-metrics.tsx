'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
  Legend
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  Users
} from 'lucide-react'

interface ProjectMetricsProps {
  project: unknown
}

export function ProjectMetrics({ project }: ProjectMetricsProps) {
  // メトリクスデータの準備
  const monthlyData = project.projectMetrics?.map((metric: unknown) => ({
    month: new Date(metric.date).toLocaleDateString('ja-JP', { month: 'short' }),
    revenue: metric.revenue,
    cost: metric.cost,
    margin: metric.margin,
    utilization: metric.utilization * 100,
    progressRate: metric.progressRate
  })) || []

  // 品質指標のダミーデータ
  const qualityData = [
    { subject: 'コード品質', A: 85, fullMark: 100 },
    { subject: 'テストカバレッジ', A: 72, fullMark: 100 },
    { subject: 'ドキュメント充実度', A: 90, fullMark: 100 },
    { subject: '顧客満足度', A: 88, fullMark: 100 },
    { subject: '納期遵守率', A: 95, fullMark: 100 },
    { subject: 'バグ発生率', A: 20, fullMark: 100 }
  ]

  // パフォーマンス指標
  const performanceData = [
    { name: '1月', planned: 20, actual: 18 },
    { name: '2月', planned: 35, actual: 32 },
    { name: '3月', planned: 50, actual: 48 },
    { name: '4月', planned: 65, actual: 70 },
    { name: '5月', planned: 80, actual: 75 },
    { name: '6月', planned: 100, actual: 85 }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const latestMetrics = project.projectMetrics?.[0] || {
    progressRate: 0,
    margin: 0,
    utilization: 0,
    revenue: 0,
    cost: 0
  }

  return (
    <div className="space-y-6">
      {/* KPIサマリー */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((latestMetrics.margin / latestMetrics.cost) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              前月比 <span className="text-green-600">+5.2%</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">生産性</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(latestMetrics.revenue / project.projectMembers.length / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              円/人月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">効率性</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Progress value={92} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">品質スコア</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5/10</div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < 4 ? 'bg-yellow-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メトリクスタブ */}
      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">財務指標</TabsTrigger>
          <TabsTrigger value="performance">パフォーマンス</TabsTrigger>
          <TabsTrigger value="quality">品質指標</TabsTrigger>
          <TabsTrigger value="resource">リソース</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>収益・コスト推移</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: unknown) => formatCurrency(value)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="収益"
                  />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="コスト"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>進捗実績 vs 計画</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="計画"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="実績"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>品質レーダーチャート</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={qualityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="品質スコア"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resource" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>リソース使用率推移</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="utilization"
                    fill="#3b82f6"
                    name="使用率 (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* アラートとインサイト */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>アラート</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <TrendingDown className="h-4 w-4 mt-0.5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">生産性が低下傾向</p>
                <p className="text-xs text-muted-foreground">
                  先月比で15%低下しています。タスク配分の見直しを推奨します。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <Activity className="h-4 w-4 mt-0.5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">コスト超過リスク</p>
                <p className="text-xs text-muted-foreground">
                  現在のペースでは予算を10%超過する見込みです。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>改善提案</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Users className="h-4 w-4 mt-0.5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">チーム拡大を検討</p>
                <p className="text-xs text-muted-foreground">
                  現在のタスク量から、2名の追加が最適と分析されます。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <Target className="h-4 w-4 mt-0.5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">自動化ツール導入</p>
                <p className="text-xs text-muted-foreground">
                  テスト自動化により月20時間の削減が見込めます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}