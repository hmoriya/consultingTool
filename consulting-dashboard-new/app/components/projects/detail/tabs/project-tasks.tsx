'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Filter,
  Calendar,
  Clock,
  User,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react'
import { TaskItem, TaskStatus, TaskPriority, getProjectTasks, updateTaskStatus } from '@/actions/tasks'
import { getProjectMilestones } from '@/actions/milestones'
import { TaskCreateForm } from './task-create-form'
import { TaskCard } from './task-card'
import { TaskKanban } from './task-kanban'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProjectTasksProps {
  project: any
}

const statusLabels: Record<TaskStatus, string> = {
  todo: '未着手',
  in_progress: '進行中',
  review: 'レビュー',
  completed: '完了'
}

const priorityLabels: Record<TaskPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急'
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')

  useEffect(() => {
    loadTasks()
  }, [project.id])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const [projectTasks, projectMilestones] = await Promise.all([
        getProjectTasks(project.id),
        getProjectMilestones(project.id)
      ])
      setTasks(projectTasks)
      setMilestones(projectMilestones)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, status)
      await loadTasks() // リロード
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
    if (assigneeFilter !== 'all' && task.assignee?.id !== assigneeFilter) return false
    return true
  })

  // 統計計算
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  }

  const progressRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  // ユニークな担当者リスト
  const assignees = Array.from(
    new Set(tasks.filter(t => t.assignee).map(t => t.assignee!.id))
  ).map(id => tasks.find(t => t.assignee?.id === id)?.assignee).filter(Boolean)

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* タスク統計 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">総タスク</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">完了</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">進行中</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">遅延</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 進捗バー */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>プロジェクト進捗</span>
              <span>{progressRate.toFixed(1)}%</span>
            </div>
            <Progress value={progressRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* ヘッダー・フィルター */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">タスク管理</h3>
            <p className="text-sm text-muted-foreground">
              プロジェクトのタスクを管理・追跡します
            </p>
          </div>
          <div className="flex gap-2">
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList>
                <TabsTrigger value="list">リスト</TabsTrigger>
                <TabsTrigger value="kanban">カンバン</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新規タスク
            </Button>
          </div>
        </div>

        {/* フィルター */}
        <div className="flex gap-4 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="優先度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="担当者" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {assignees.map(assignee => (
                <SelectItem key={assignee!.id} value={assignee!.id}>
                  {assignee!.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(statusFilter !== 'all' || priorityFilter !== 'all' || assigneeFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter('all')
                setPriorityFilter('all')
                setAssigneeFilter('all')
              }}
            >
              フィルターをクリア
            </Button>
          )}
        </div>
      </div>

      {/* タスクリスト/カンバン */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {tasks.length === 0 
                    ? 'タスクがまだ作成されていません' 
                    : '条件に一致するタスクがありません'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleTaskStatusChange}
                onTaskUpdate={loadTasks}
              />
            ))
          )}
        </div>
      ) : (
        <TaskKanban
          tasks={filteredTasks}
          onStatusChange={handleTaskStatusChange}
          onTaskUpdate={loadTasks}
        />
      )}

      {/* タスク作成フォーム */}
      {showCreateForm && (
        <TaskCreateForm
          projectId={project.id}
          projectMembers={project.projectMembers}
          milestones={milestones}
          onClose={() => setShowCreateForm(false)}
          onTaskCreated={loadTasks}
        />
      )}
    </div>
  )
}