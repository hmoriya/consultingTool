'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Target,
  Zap,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

interface StructuralDuplication {
  type: 'capability-operation-overlap' | 'directory-structure-mismatch'
  description: string
  affectedFiles: string[]
  severity: 'high' | 'medium' | 'low'
  autoFixable: boolean
  recommendedAction: string
}

interface CapabilityBoundaryIssue {
  type: 'function-scattered' | 'responsibility-overlap'
  description: string
  affectedCapabilities: string[]
  duplicatedFunctions: string[]
  consolidationStrategy: string
}

interface BusinessContextDuplication {
  type: 'context-variation' | 'workflow-similarity'
  description: string
  duplicatedFiles: {
    file1: string
    file2: string
    similarity: number
    contextDifference: string
  }
  parametrizationPotential: 'high' | 'medium' | 'low'
}

interface QualityRecommendation {
  priority: 'critical' | 'important' | 'nice-to-have'
  action: string
  impact: string
  effort: 'low' | 'medium' | 'high'
  dependencies: string[]
}

interface DesignQualityAnalysisResult {
  structuralDuplications: StructuralDuplication[]
  capabilityBoundaryIssues: CapabilityBoundaryIssue[]
  businessContextDuplications: BusinessContextDuplication[]
  recommendations: QualityRecommendation[]
}

const SEVERITY_COLORS = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#10b981'
}

const PRIORITY_COLORS = {
  critical: '#dc2626',
  important: '#ea580c',
  'nice-to-have': '#16a34a'
}

const EFFORT_LABELS = {
  low: '低',
  medium: '中',
  high: '高'
}

export default function DesignQualityDashboard() {
  const [analysisData, setAnalysisData] = useState<DesignQualityAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('overview')

  const fetchAnalysis = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/parasol/design-quality')
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 mr-2" />
        <span>設計品質分析を実行中...</span>
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
        <Button onClick={fetchAnalysis}>設計品質分析を開始</Button>
      </div>
    )
  }

  // チャート用データの準備
  const severityData = analysisData.structuralDuplications.reduce((acc, dup) => {
    acc[dup.severity] = (acc[dup.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const severityChartData = Object.entries(severityData).map(([severity, count]) => ({
    name: severity === 'high' ? '高' : severity === 'medium' ? '中' : '低',
    value: count,
    color: SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS]
  }))

  const priorityData = analysisData.recommendations.reduce((acc, rec) => {
    acc[rec.priority] = (acc[rec.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
    priority: priority === 'critical' ? '重要' : priority === 'important' ? '推奨' : '任意',
    count,
    color: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS]
  }))

  const totalIssues = analysisData.structuralDuplications.length +
                     analysisData.capabilityBoundaryIssues.length +
                     analysisData.businessContextDuplications.length

  const autoFixableIssues = analysisData.structuralDuplications.filter(d => d.autoFixable).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">設計品質向上ダッシュボード</h2>
          <p className="text-muted-foreground">
            パラソル設計の品質問題を特定し、改善提案を提供します
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalysis}>
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総問題数</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
            <p className="text-xs text-muted-foreground">設計品質問題</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">構造的問題</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.structuralDuplications.length}</div>
            <p className="text-xs text-muted-foreground">修正推奨</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">自動修正可能</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoFixableIssues}</div>
            <p className="text-xs text-muted-foreground">自動化可能</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">推奨事項</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.recommendations.length}</div>
            <p className="text-xs text-muted-foreground">改善提案</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="structural">構造的問題</TabsTrigger>
          <TabsTrigger value="boundary">ケーパビリティ境界</TabsTrigger>
          <TabsTrigger value="context">ビジネス文脈</TabsTrigger>
          <TabsTrigger value="recommendations">推奨事項</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 深刻度分布 */}
            <Card>
              <CardHeader>
                <CardTitle>問題の深刻度分布</CardTitle>
                <CardDescription>構造的問題の深刻度別分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 推奨事項優先度分布 */}
            <Card>
              <CardHeader>
                <CardTitle>推奨事項の優先度</CardTitle>
                <CardDescription>改善提案の優先度別分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="structural">
          <Card>
            <CardHeader>
              <CardTitle>構造的重複問題</CardTitle>
              <CardDescription>ケーパビリティとオペレーションの構造的な問題</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.structuralDuplications.map((dup, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{dup.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          影響ファイル: {dup.affectedFiles.length}件
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={dup.severity === 'high' ? 'destructive' :
                                   dup.severity === 'medium' ? 'default' : 'secondary'}
                        >
                          深刻度: {dup.severity === 'high' ? '高' :
                                   dup.severity === 'medium' ? '中' : '低'}
                        </Badge>
                        {dup.autoFixable && (
                          <Badge variant="secondary">自動修正可能</Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-muted rounded">
                      <h5 className="text-sm font-medium mb-1">推奨対応:</h5>
                      <p className="text-sm">{dup.recommendedAction}</p>
                    </div>
                    {dup.affectedFiles.length > 0 && (
                      <details className="mt-3">
                        <summary className="text-sm font-medium cursor-pointer">
                          影響ファイル一覧 ({dup.affectedFiles.length}件)
                        </summary>
                        <ul className="mt-2 space-y-1 text-xs">
                          {dup.affectedFiles.map((file, fileIndex) => (
                            <li key={fileIndex} className="text-muted-foreground">{file}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                ))}

                {analysisData.structuralDuplications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                    <p>構造的重複問題は見つかりませんでした</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boundary">
          <Card>
            <CardHeader>
              <CardTitle>ケーパビリティ境界問題</CardTitle>
              <CardDescription>機能の分散と責務の重複問題</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.capabilityBoundaryIssues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{issue.description}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-1">影響ケーパビリティ:</h5>
                        <div className="flex flex-wrap gap-1">
                          {issue.affectedCapabilities.map((cap, capIndex) => (
                            <Badge key={capIndex} variant="outline">{cap}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">重複機能:</h5>
                        <div className="flex flex-wrap gap-1">
                          {issue.duplicatedFunctions.map((func, funcIndex) => (
                            <Badge key={funcIndex} variant="secondary">{func}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-muted rounded">
                      <h5 className="text-sm font-medium mb-1">統合戦略:</h5>
                      <p className="text-sm">{issue.consolidationStrategy}</p>
                    </div>
                  </div>
                ))}

                {analysisData.capabilityBoundaryIssues.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                    <p>ケーパビリティ境界問題は見つかりませんでした</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="context">
          <Card>
            <CardHeader>
              <CardTitle>ビジネス文脈重複</CardTitle>
              <CardDescription>異なる文脈での機能重複とパラメータ化の可能性</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.businessContextDuplications.map((dup, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{dup.description}</h4>
                      <Badge
                        variant={dup.parametrizationPotential === 'high' ? 'default' :
                                 dup.parametrizationPotential === 'medium' ? 'secondary' : 'outline'}
                      >
                        パラメータ化: {dup.parametrizationPotential === 'high' ? '高' :
                                     dup.parametrizationPotential === 'medium' ? '中' : '低'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-1">ファイル1:</h5>
                        <p className="text-muted-foreground text-xs">{dup.duplicatedFiles.file1}</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">ファイル2:</h5>
                        <p className="text-muted-foreground text-xs">{dup.duplicatedFiles.file2}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <span className="text-sm">類似度: </span>
                        <Badge variant="secondary">
                          {Math.round(dup.duplicatedFiles.similarity * 100)}%
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm">文脈の違い: </span>
                        <span className="text-sm font-medium">{dup.duplicatedFiles.contextDifference}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {analysisData.businessContextDuplications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                    <p>ビジネス文脈重複は見つかりませんでした</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>改善推奨事項</CardTitle>
              <CardDescription>優先度順の設計品質改善提案</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{rec.action}</h4>
                      <div className="flex gap-2">
                        <Badge
                          variant={rec.priority === 'critical' ? 'destructive' :
                                   rec.priority === 'important' ? 'default' : 'secondary'}
                        >
                          {rec.priority === 'critical' ? '重要' :
                           rec.priority === 'important' ? '推奨' : '任意'}
                        </Badge>
                        <Badge variant="outline">
                          工数: {EFFORT_LABELS[rec.effort]}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.impact}</p>
                    {rec.dependencies.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">前提条件:</h5>
                        <div className="flex flex-wrap gap-1">
                          {rec.dependencies.map((dep, depIndex) => (
                            <Badge key={depIndex} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {analysisData.recommendations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>現在、推奨事項はありません</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}