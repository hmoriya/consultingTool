'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import {
  MilestoneItem,
  MilestoneStatus,
  getProjectMilestones,
  getMilestoneStats,
  deleteMilestone
} from '@/actions/milestones'
import { MilestoneCreateForm } from './milestone-create-form'
import { MilestoneEditForm } from './milestone-edit-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ProjectMilestonesProps {
  project: any
}

const statusLabels: Record<MilestoneStatus | 'inProgress', string> = {
  pending: '進行中',
  completed: '完了',
  delayed: '遅延',
  inProgress: '進行中'
}

const statusColors: Record<MilestoneStatus | 'inProgress', string> = {
  pending: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  delayed: 'bg-red-100 text-red-700',
  inProgress: 'bg-blue-100 text-blue-700'
}

const statusIcons: Record<MilestoneStatus | 'inProgress', React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  completed: CheckCircle2,
  delayed: AlertCircle,
  inProgress: Clock  // inProgressステータス用のアイコンを追加
}

export function ProjectMilestones({ project }: ProjectMilestonesProps) {
  const [milestones, setMilestones] = useState<MilestoneItem[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<MilestoneItem | null>(null)

  useEffect(() => {
    loadMilestoneData()
  }, [project.id])

  const loadMilestoneData = async () => {
    try {
      setLoading(true)
      const [milestoneData, statsData] = await Promise.all([
        getProjectMilestones(project.id),
        getMilestoneStats(project.id)
      ])
      setMilestones(milestoneData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load milestone data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm('このマイルストーンを削除しますか？関連するタスクがある場合は削除できません。')) return
    
    try {
      await deleteMilestone(milestoneId)
      await loadMilestoneData()
    } catch (error) {
      console.error('Failed to delete milestone:', error)
      alert('マイルストーンの削除に失敗しました')
    }
  }

  const getStatusIcon = (status: MilestoneStatus | string) => {
    const Icon = statusIcons[status as MilestoneStatus | 'inProgress']
    if (!Icon) {
      console.warn(`No icon found for status: ${status}`)
      return null
    }
    return <Icon className="h-4 w-4" />
  }

  const isOverdue = (milestone: MilestoneItem) => {
    return milestone.status !== 'completed' && new Date(milestone.dueDate) < new Date()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* マイルストーン統計 */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">総マイルストーン</p>
                  <p className="text-2xl font-bold">{stats.totalMilestones}</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">完了率</p>
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">遅延中</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdueMilestones}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">タスク進捗率</p>
                  <p className="text-2xl font-bold">{stats.overallProgress}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* マイルストーン管理 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>マイルストーン</CardTitle>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              マイルストーン追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">マイルストーンがまだ追加されていません</p>
              </div>
            ) : (
              milestones.map((milestone) => {
                const overdue = isOverdue(milestone)
                return (
                  <div 
                    key={milestone.id} 
                    className={`p-6 rounded-lg border ${overdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{milestone.name}</h3>
                          <Badge className={statusColors[milestone.status]}>
                            <span className="mr-1">{getStatusIcon(milestone.status)}</span>
                            {statusLabels[milestone.status]}
                          </Badge>
                          {overdue && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              期日超過
                            </Badge>
                          )}
                        </div>

                        {milestone.description && (
                          <p className="text-muted-foreground mb-3">{milestone.description}</p>
                        )}

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className={overdue ? 'text-red-600 font-medium' : ''}>
                              期日: {format(new Date(milestone.dueDate), 'yyyy/MM/dd', { locale: ja })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span>タスク: {milestone.completedTaskCount}/{milestone.taskCount}</span>
                          </div>
                        </div>

                        {/* 進捗バー */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">進捗率</span>
                            <span className="font-medium">{milestone.progressRate}%</span>
                          </div>
                          <Progress value={milestone.progressRate} className="h-2" />
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingMilestone(milestone)}>
                            <Edit className="h-4 w-4 mr-2" />
                            編集
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteMilestone(milestone.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            削除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* マイルストーン作成フォーム */}
      {showCreateForm && (
        <MilestoneCreateForm
          projectId={project.id}
          onClose={() => setShowCreateForm(false)}
          onMilestoneCreated={loadMilestoneData}
        />
      )}

      {/* マイルストーン編集フォーム */}
      {editingMilestone && (
        <MilestoneEditForm
          milestone={editingMilestone}
          onClose={() => setEditingMilestone(null)}
          onMilestoneUpdated={loadMilestoneData}
        />
      )}
    </div>
  )
}