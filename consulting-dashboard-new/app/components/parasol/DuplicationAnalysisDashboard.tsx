'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Merge,
  Eye,
  Settings,
  Info
} from 'lucide-react'

interface DuplicationGroup {
  name: string
  duplicateCount: number
  services: string[]
  mergeStrategy: string
  impactLevel: 'low' | 'medium' | 'high'
  usecases: UseCaseInfo[]
}

interface UseCaseInfo {
  id: string
  name: string
  displayName: string
  serviceId: string
  operationId: string
}

interface DuplicationAnalysisResult {
  usecaseDuplications: {
    total: number
    groups: DuplicationGroup[]
  }
  pageDuplications: {
    total: number
    consolidationPotential: number
  }
}

const IMPACT_COLORS = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#10b981'
}

const MERGE_STRATEGY_LABELS = {
  'basic-function-integration': '基本機能統合',
  'parameterized-sharing': 'パラメータ化共有',
  'workflow-template': 'ワークフローテンプレート',
  'crud-template': 'CRUDテンプレート',
  'cross-service-integration': 'サービス横断統合',
  'pattern-consolidation': 'パターン統合'
}

export default function DuplicationAnalysisDashboard() {
  const [analysisData, setAnalysisData] = useState<DuplicationAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<DuplicationGroup | null>(null)

  const fetchAnalysis = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/parasol/analysis/duplications')
      if (!response.ok) {
        throw new Error(`分析に失敗しました: ${response.statusText}`)
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (_error) {
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [fetchAnalysis])

  const handleApplySuggestion = async (group: DuplicationGroup) => {
    try {
      const response = await fetch('/api/parasol/analysis/apply-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'usecase',
          suggestionId: group.name,
          action: 'merge',
          targetName: group.name,
          duplicateIds: group.usecases.map(uc => uc.id),
          mergeStrategy: group.mergeStrategy,
          dryRun: true // First run as dry run
        })
      })

      const result = await response.json()
      console.log('統合提案結果:', result)

      // Show success message or details
      alert(`統合提案が正常に処理されました。\n統合予定: ${result.appliedChanges?.merged || 0}件`)

    } catch (_error) {
      console.error('統合提案エラー:', error)
      alert('統合提案の処理中にエラーが発生しました')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 mr-2" />
        <span>重複分析を実行中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!analysisData) {
    return (
      <div className="text-center py-8">
        <Button onClick={fetchAnalysis}>重複分析を開始</Button>
      </div>
    )
  }

  // Prepare chart data
  const impactDistribution = analysisData.usecaseDuplications.groups.reduce((acc, group) => {
    acc[group.impactLevel] = (acc[group.impactLevel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(impactDistribution).map(([level, count]) => ({
    name: level === 'high' ? '高' : level === 'medium' ? '中' : '低',
    value: count,
    color: IMPACT_COLORS[level as keyof typeof IMPACT_COLORS]
  }))

  const mergeStrategyData = analysisData.usecaseDuplications.groups.reduce((acc, group) => {
    const strategy = MERGE_STRATEGY_LABELS[group.mergeStrategy as keyof typeof MERGE_STRATEGY_LABELS] || group.mergeStrategy
    acc[strategy] = (acc[strategy] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const strategyChartData = Object.entries(mergeStrategyData).map(([strategy, count]) => ({
    strategy,
    count
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">重複分析ダッシュボード</h2>
          <p className="text-muted-foreground">
            ユースケースとページ定義の重複を分析し、統合提案を提供します
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalysis}>
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総ユースケース数</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.usecaseDuplications.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">重複グループ数</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.usecaseDuplications.groups.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総ページ数</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.pageDuplications.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">統合可能性</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.pageDuplications.consolidationPotential}</div>
            <p className="text-xs text-muted-foreground">ページの統合可能数</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>影響レベル分布</CardTitle>
            <CardDescription>重複グループの影響レベル別分布</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Merge Strategy Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>統合戦略分布</CardTitle>
            <CardDescription>推奨される統合戦略の分布</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={strategyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="strategy"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Duplication Groups List */}
      <Card>
        <CardHeader>
          <CardTitle>重複グループ詳細</CardTitle>
          <CardDescription>
            統合候補として特定された重複グループ一覧
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.usecaseDuplications.groups.map((group, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {group.duplicateCount}件の重複 • {group.services.length}サービス
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={group.impactLevel === 'high' ? 'destructive' :
                               group.impactLevel === 'medium' ? 'default' : 'secondary'}
                    >
                      影響度: {group.impactLevel === 'high' ? '高' :
                                group.impactLevel === 'medium' ? '中' : '低'}
                    </Badge>
                    <Badge variant="outline">
                      {MERGE_STRATEGY_LABELS[group.mergeStrategy as keyof typeof MERGE_STRATEGY_LABELS] || group.mergeStrategy}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedGroup(selectedGroup?.name === group.name ? null : group)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    詳細
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApplySuggestion(group)}
                  >
                    <Merge className="h-4 w-4 mr-1" />
                    統合提案適用
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-1" />
                    設定
                  </Button>
                </div>

                {/* Expanded Details */}
                {selectedGroup?.name === group.name && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="font-medium mb-2">含まれるユースケース:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {group.usecases.map((usecase) => (
                        <div key={usecase.id} className="text-sm bg-gray-50 p-2 rounded">
                          <div className="font-medium">{usecase.displayName}</div>
                          <div className="text-muted-foreground">
                            {usecase.serviceId} / {usecase.operationId}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}