'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Target, FileText, Download, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { ProjectDocuments } from './project-documents'

interface ProjectOverviewProps {
  projects: any[]
}

export function ProjectOverview({ projects }: ProjectOverviewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-700'
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning':
        return '計画中'
      case 'active':
        return '進行中'
      case 'on_hold':
        return '保留中'
      case 'completed':
        return '完了'
      default:
        return status
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロジェクト一覧</CardTitle>
        <CardDescription>現在のプロジェクトの詳細と進捗状況</CardDescription>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            プロジェクトはありません
          </div>
        ) : (
          <Tabs value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <TabsList className="grid w-full grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <TabsTrigger key={project.id} value={project.id}>
                  {project.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {projects.map((project) => (
              <TabsContent key={project.id} value={project.id} className="space-y-6">
                {/* プロジェクトヘッダー */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(project.status)} variant="secondary">
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>

                {/* 進捗バー */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">全体進捗</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>完了タスク: {project.completedTasks}</span>
                    <span>総タスク: {project.totalTasks}</span>
                  </div>
                </div>

                {/* プロジェクト情報 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">期間</p>
                        <p className="font-medium">
                          {formatDate(project.startDate)} - 
                          {project.endDate ? formatDate(project.endDate) : '未定'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">プロジェクトマネージャー</p>
                        <p className="font-medium">
                          {project.pm ? project.pm.name : '未割当'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">マイルストーン</p>
                        <p className="font-medium">{project.milestones.length}件</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">チームメンバー</p>
                        <p className="font-medium">{project.projectMembers.length}人</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* マイルストーン */}
                {project.milestones.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">マイルストーン</h4>
                    <div className="space-y-2">
                      {project.milestones.map((milestone: any) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                        >
                          <div>
                            <p className="font-medium text-sm">{milestone.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              期限: {formatDate(milestone.targetDate)}
                            </p>
                          </div>
                          <Badge
                            className={
                              milestone.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : milestone.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }
                            variant="secondary"
                          >
                            {milestone.status === 'completed'
                              ? '完了'
                              : milestone.status === 'in_progress'
                              ? '進行中'
                              : '未着手'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ドキュメント */}
                <ProjectDocuments projectId={project.id} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}