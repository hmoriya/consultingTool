'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight, Users, AlertTriangle, TrendingDown } from 'lucide-react'
import type { MemberUtilization } from '../../../actions/utilization'

interface ResourceOptimizationProps {
  utilization: MemberUtilization[]
  recommendations: any
}

export function ResourceOptimization({ utilization, recommendations }: ResourceOptimizationProps) {
  if (!recommendations) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            最適化提案を取得できませんでした
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* サマリー */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              低稼働メンバー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.underutilized.length}</div>
            <p className="text-sm text-muted-foreground">
              50%未満の稼働率
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              高負荷メンバー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.overutilized.length}</div>
            <p className="text-sm text-muted-foreground">
              90%以上の稼働率
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-red-500" />
              リソース不足プロジェクト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.resourceShortages.length}</div>
            <p className="text-sm text-muted-foreground">
              要員追加が必要
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 推奨アクション */}
      <Card>
        <CardHeader>
          <CardTitle>推奨アクション</CardTitle>
          <CardDescription>
            リソース配分を最適化するための提案
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              現在、特に対応が必要な項目はありません
            </p>
          ) : (
            recommendations.recommendations.map((rec: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {rec.priority === 'high' ? '優先度高' : '優先度中'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {rec.type === 'low_utilization' && '低稼働'}
                      {rec.type === 'high_utilization' && '高負荷'}
                      {rec.type === 'resource_shortage' && 'リソース不足'}
                    </span>
                  </div>
                  <p className="text-sm">{rec.message}</p>
                </div>
                <Button size="sm" variant="ghost">
                  詳細
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 詳細リスト */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 低稼働メンバーリスト */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">低稼働メンバー詳細</CardTitle>
            <CardDescription>
              新規プロジェクトへのアサイン候補
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.underutilized.slice(0, 5).map((member: any) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.currentAllocation}%</p>
                    <p className="text-xs text-muted-foreground">
                      余裕: {member.availableCapacity}%
                    </p>
                  </div>
                </div>
              ))}
              {recommendations.underutilized.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  該当なし
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 高負荷メンバーリスト */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">高負荷メンバー詳細</CardTitle>
            <CardDescription>
              タスク再配分が推奨されるメンバー
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.overutilized.slice(0, 5).map((member: any) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {member.currentAllocation}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      超過: +{member.overAllocation}%
                    </p>
                  </div>
                </div>
              ))}
              {recommendations.overutilized.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  該当なし
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* リソース不足プロジェクト */}
      {recommendations.resourceShortages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">リソース不足プロジェクト</CardTitle>
            <CardDescription>
              追加要員が必要なプロジェクト
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.resourceShortages.map((project: any) => (
                <div key={project.projectId} className="border rounded-lg p-3">
                  <p className="font-medium text-sm mb-2">{project.projectName}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.shortages.map((shortage: any, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {shortage.role}: {shortage.shortage}名不足
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}