'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
// import { Progress } from '@/components/ui/progress'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Edit,
  Copy,
  Target,
  Settings,
  Zap,
  Trash2,
  GitMerge
} from 'lucide-react'

interface PageUseCaseMapping {
  operationId: string
  operationName: string
  serviceName: string
  capabilityName: string
  currentUseCases: UseCaseFile[]
  currentPages: PageFile[]
  proposedMappings: ProposedMapping[]
  restructureActions: RestructureAction[]
}

interface UseCaseFile {
  fileName: string
  filePath: string
  displayName: string
  content: string
}

interface PageFile {
  fileName: string
  filePath: string
  displayName: string
  content: string
}

interface ProposedMapping {
  useCaseFile: string
  suggestedPageFile: string
  confidence: number
  reason: string
  action: 'merge' | 'create' | 'rename' | 'delete'
}

interface RestructureAction {
  type: 'delete_duplicate' | 'merge_files' | 'create_mapping' | 'rename_file'
  description: string
  files: string[]
  newFileName?: string
  confidence: number
}

interface DuplicateFileGroup {
  fileName: string
  files: Array<{
    path: string
    size: number
    content: string
  }>
  similarity: number
  action: 'keep_one' | 'merge_all' | 'manual_review'
}

interface RestructureAnalysisResult {
  totalOperations: number
  problemOperations: number
  pageMappings: PageUseCaseMapping[]
  duplicateFiles: DuplicateFileGroup[]
  summary: {
    totalUseCases: number
    totalPages: number
    unmatchedUseCases: number
    unmatchedPages: number
    duplicateFiles: number
    proposedDeletions: number
  }
}

const ACTION_COLORS = {
  merge: '#f97316',
  create: '#10b981',
  rename: '#3b82f6',
  delete: '#ef4444'
}

const ACTION_LABELS = {
  merge: '統合',
  create: '新規作成',
  rename: 'リネーム',
  delete: '削除'
}

const CONFIDENCE_LEVELS = {
  high: { min: 0.8, label: '高', color: '#10b981' },
  medium: { min: 0.5, label: '中', color: '#f97316' },
  low: { min: 0, label: '低', color: '#ef4444' }
}

export default function DesignRestructureDashboard() {
  const [analysisData, setAnalysisData] = useState<RestructureAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [_selectedOperations, _setSelectedOperations] = useState<Set<string>>(new Set())

  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/parasol/design-restructure')
      if (!response.ok) {
        throw new Error(`分析に失敗しました: ${response.statusText}`)
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (_error) {
      setError(_error instanceof Error ? _error.message : '不明なエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleApplyRestructure = async (operationId: string, mappings: ProposedMapping[]) => {
    try {
      const response = await fetch('/api/parasol/design-restructure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply_restructure',
          operationId,
          mappings
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`再構築が完了しました: ${result.message}`)
        await fetchAnalysis() // データを再取得
      } else {
        alert(`再構築に失敗しました: ${result.message}`)
      }

    } catch (_error) {
      console.error('再構築実行エラー:', error)
      alert('再構築の処理中にエラーが発生しました')
    }
  }

  const handleDeleteDuplicates = async () => {
    const confirmDelete = confirm('重複ファイルを削除します。バックアップが作成されますが、元に戻すことはできません。続行しますか？')

    if (!confirmDelete) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/parasol/design-restructure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_duplicates'
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`重複削除が完了しました: ${result.message}\n削除されたファイル: ${result.deletedFiles}件`)
        await fetchAnalysis() // データを再取得
      } else {
        alert(`重複削除に失敗しました: ${result.message}`)
      }

    } catch (_error) {
      console.error('重複削除エラー:', error)
      alert('重複削除の処理中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDatabaseDuplicates = async () => {
    const confirmDelete = confirm('データベース内の重複レコードを削除します。同一名のページ・ユースケースで最新以外が削除されます。続行しますか？')

    if (!confirmDelete) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/parasol/design-restructure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_database_duplicates'
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`データベース重複削除が完了しました: ${result.message}\n削除されたレコード: ${result.deletedRecords}件\nページグループ: ${result.pageGroups}件\nユースケースグループ: ${result.useCaseGroups}件`)
        await fetchAnalysis() // データを再取得
      } else {
        alert(`データベース重複削除に失敗しました: ${result.message}`)
      }

    } catch (_error) {
      console.error('データベース重複削除エラー:', error)
      alert('データベース重複削除の処理中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= CONFIDENCE_LEVELS.high.min) return CONFIDENCE_LEVELS.high
    if (confidence >= CONFIDENCE_LEVELS.medium.min) return CONFIDENCE_LEVELS.medium
    return CONFIDENCE_LEVELS.low
  }

  useEffect(() => {
    fetchAnalysis()
  }, [fetchAnalysis])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 mr-2" />
        <span>設計再構築分析を実行中...</span>
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
        <Button onClick={fetchAnalysis}>設計再構築分析を開始</Button>
      </div>
    )
  }

  // チャート用データの準備
  const problemRatio = analysisData.totalOperations > 0
    ? (analysisData.problemOperations / analysisData.totalOperations) * 100
    : 0

  const mappingActionData = analysisData.pageMappings
    .flatMap(m => m.proposedMappings)
    .reduce((acc, mapping) => {
      acc[mapping.action] = (acc[mapping.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const actionChartData = Object.entries(mappingActionData).map(([action, count]) => ({
    action: ACTION_LABELS[action as keyof typeof ACTION_LABELS] || action,
    count,
    color: ACTION_COLORS[action as keyof typeof ACTION_COLORS]
  }))

  const confidenceData = analysisData.pageMappings
    .flatMap(m => m.proposedMappings)
    .reduce((acc, mapping) => {
      const level = getConfidenceLevel(mapping.confidence)
      acc[level.label] = (acc[level.label] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const confidenceChartData = Object.entries(confidenceData).map(([level, count]) => ({
    name: level,
    value: count,
    color: CONFIDENCE_LEVELS[level === '高' ? 'high' : level === '中' ? 'medium' : 'low'].color
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">設計再構築ダッシュボード</h2>
          <p className="text-muted-foreground">
            ページとユースケースの1対1関係への再構築と重複削除
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalysis} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button variant="destructive" onClick={handleDeleteDuplicates} disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            重複ファイル削除
          </Button>
          <Button variant="destructive" onClick={handleDeleteDatabaseDuplicates} disabled={isLoading}>
            <Zap className="h-4 w-4 mr-2" />
            DB重複削除
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総オペレーション数</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.totalOperations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">問題オペレーション</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analysisData.problemOperations}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(problemRatio)}% が1対1関係でない
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">重複ファイル</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.summary.duplicateFiles}</div>
            <p className="text-xs text-muted-foreground">
              {analysisData.summary.proposedDeletions}件の削除候補
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">改善可能性</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(100 - problemRatio)}%
            </div>
            <p className="text-xs text-muted-foreground">最適化後の品質</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="mappings">マッピング詳細</TabsTrigger>
          <TabsTrigger value="duplicates">重複ファイル</TabsTrigger>
          <TabsTrigger value="operations">オペレーション一覧</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* アクション分布 */}
            <Card>
              <CardHeader>
                <CardTitle>推奨アクション分布</CardTitle>
                <CardDescription>ページ・ユースケース関係の改善アクション</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={actionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="action" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 信頼度分布 */}
            <Card>
              <CardHeader>
                <CardTitle>マッピング信頼度分布</CardTitle>
                <CardDescription>自動マッピング提案の確実性</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={confidenceChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {confidenceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* サマリー情報 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>再構築サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisData.summary.totalUseCases}
                  </div>
                  <div className="text-sm text-muted-foreground">総ユースケース数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisData.summary.totalPages}
                  </div>
                  <div className="text-sm text-muted-foreground">総ページ数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {analysisData.summary.unmatchedUseCases}
                  </div>
                  <div className="text-sm text-muted-foreground">未マッチユースケース</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {analysisData.summary.unmatchedPages}
                  </div>
                  <div className="text-sm text-muted-foreground">未マッチページ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mappings">
          <Card>
            <CardHeader>
              <CardTitle>ページ・ユースケースマッピング詳細</CardTitle>
              <CardDescription>
                各オペレーションのページとユースケースの関係と推奨改善アクション
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysisData.pageMappings
                  .filter(mapping => mapping.currentUseCases.length !== mapping.currentPages.length || mapping.proposedMappings.length > 0)
                  .map((mapping, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">
                          {mapping.serviceName} / {mapping.capabilityName} / {mapping.operationName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ユースケース: {mapping.currentUseCases.length}件 |
                          ページ: {mapping.currentPages.length}件
                        </p>
                      </div>
                      <Badge variant={
                        mapping.currentUseCases.length === mapping.currentPages.length ? 'secondary' : 'destructive'
                      }>
                        {mapping.currentUseCases.length === mapping.currentPages.length ? '1対1' : '不一致'}
                      </Badge>
                    </div>

                    {/* 提案マッピング */}
                    {mapping.proposedMappings.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium">推奨マッピング:</h5>
                        {mapping.proposedMappings.map((pm, pmIndex) => {
                          const confidenceLevel = getConfidenceLevel(pm.confidence)
                          return (
                            <div key={pmIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex-1">
                                <span className="font-medium">{pm.useCaseFile}</span>
                                <span className="mx-2">→</span>
                                <span>{pm.suggestedPageFile}</span>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  variant="outline"
                                  style={{ backgroundColor: confidenceLevel.color + '20', borderColor: confidenceLevel.color }}
                                >
                                  信頼度: {Math.round(pm.confidence * 100)}%
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  style={{ backgroundColor: ACTION_COLORS[pm.action] + '20' }}
                                >
                                  {ACTION_LABELS[pm.action]}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* アクションボタン */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleApplyRestructure(mapping.operationId, mapping.proposedMappings)}
                        disabled={mapping.proposedMappings.length === 0}
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        再構築実行
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        手動調整
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duplicates">
          <Card>
            <CardHeader>
              <CardTitle>重複ファイル一覧</CardTitle>
              <CardDescription>同名ファイルの重複と推奨削除アクション</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.duplicateFiles.map((duplicate, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{duplicate.fileName}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          類似度: {Math.round(duplicate.similarity * 100)}%
                        </Badge>
                        <Badge variant={
                          duplicate.action === 'keep_one' ? 'destructive' :
                          duplicate.action === 'merge_all' ? 'default' : 'secondary'
                        }>
                          {duplicate.action === 'keep_one' ? '1つ保持' :
                           duplicate.action === 'merge_all' ? '全て統合' : '手動確認'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {duplicate.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                          <span className="font-mono">{file.path}</span>
                          <span className="text-muted-foreground">{file.size} 文字</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="destructive" onClick={handleDeleteDuplicates} disabled={isLoading}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        重複削除
                      </Button>
                      <Button size="sm" variant="outline">
                        <GitMerge className="h-4 w-4 mr-1" />
                        統合
                      </Button>
                    </div>
                  </div>
                ))}

                {analysisData.duplicateFiles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                    <p>重複ファイルは見つかりませんでした</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle>全オペレーション一覧</CardTitle>
              <CardDescription>ページ・ユースケース関係の状況</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisData.pageMappings.map((mapping, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded border ${
                      mapping.currentUseCases.length === mapping.currentPages.length
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {mapping.serviceName} / {mapping.operationName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {mapping.capabilityName}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        UC: {mapping.currentUseCases.length} |
                        P: {mapping.currentPages.length}
                      </div>
                      <Badge variant={
                        mapping.currentUseCases.length === mapping.currentPages.length ? 'secondary' : 'destructive'
                      }>
                        {mapping.currentUseCases.length === mapping.currentPages.length ? '1対1' : '要修正'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}