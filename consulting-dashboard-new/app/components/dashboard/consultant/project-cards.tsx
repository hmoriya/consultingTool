'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Briefcase, Users, Calendar, Target } from 'lucide-react'
import Link from 'next/link'

interface ProjectCardsProps {
  projects: any[]
}

export function ProjectCards({ projects }: ProjectCardsProps) {
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

  const calculateProgress = (project: any) => {
    if (!project._count.tasks) return 0
    // 簡易的な進捗計算（実際はタスクのステータスを考慮すべき）
    const progress = Math.random() * 100 // 仮の値
    return Math.round(progress)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>参加プロジェクト</CardTitle>
            <CardDescription>現在参加中のプロジェクト一覧</CardDescription>
          </div>
          <Link href="/projects">
            <Badge variant="ghost" className="cursor-pointer">
              {projects.length}件
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
            <p>参加中のプロジェクトはありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const progress = calculateProgress(project)
              
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block"
                >
                  <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.client.name}
                        </p>
                      </div>
                      <Badge className={getStatusColor(project.status)} variant="secondary">
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">進捗</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{project.projectMembers.length}人</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Target className="h-3 w-3" />
                        <span>{project._count.tasks}タスク</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{project._count.milestones}MS</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}