'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock, Plus, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { createTimeEntry, updateTimeEntry, deleteTimeEntry } from '@/actions/timesheet-new'

interface Project {
  id: string
  name: string
  client: { name: string }
  color?: string
}

interface TimeEntry {
  id: string
  date: Date
  hours: number
  projectId: string
  project?: Project
  description: string
  activityType: string
  billable: boolean
  status: string
}

interface WeeklyCalendarProps {
  projects: Project[]
  initialEntries?: TimeEntry[]
  onRefresh?: () => void
}

// ドラッグ可能なプロジェクトアイテム
function DraggableProject({ project }: { project: Project }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-2 rounded-md border cursor-move hover:shadow-md transition-all",
        "bg-white",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: project.color || '#3b82f6' }}
        />
        <div className="text-sm">
          <div className="font-medium">{project.client.name}</div>
          <div className="text-xs text-muted-foreground">{project.name}</div>
        </div>
      </div>
    </div>
  )
}

// カレンダーセル内のエントリ
function CalendarEntry({ 
  entry, 
  onUpdate, 
  onDelete 
}: { 
  entry: TimeEntry & { project?: Project }
  onUpdate: (hours: number) => void
  onDelete: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [hours, setHours] = useState(entry.hours.toString())

  const handleSave = () => {
    const newHours = parseFloat(hours)
    if (!isNaN(newHours) && newHours > 0 && newHours <= 24) {
      onUpdate(newHours)
      setIsEditing(false)
    }
  }

  return (
    <div 
      className="p-2 rounded-md border mb-1 group hover:shadow-sm transition-shadow"
      style={{ 
        backgroundColor: entry.project?.color ? `${entry.project.color}20` : '#3b82f620',
        borderColor: entry.project?.color || '#3b82f6'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">
            {entry.project?.client.name || 'Unknown'}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {entry.project?.name || 'Unknown Project'}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-12 h-6 text-xs"
                step="0.5"
                min="0.5"
                max="24"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') {
                    setHours(entry.hours.toString())
                    setIsEditing(false)
                  }
                }}
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={handleSave}
              >
                <Save className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                {entry.hours}h
              </Badge>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onDelete}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>
      {entry.description && (
        <div className="text-xs text-muted-foreground mt-1 truncate">
          {entry.description}
        </div>
      )}
    </div>
  )
}

// ドロップ可能なカレンダーセル
function DroppableCalendarCell({ date, children }: { date: Date; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
  })

  return (
    <Card 
      ref={setNodeRef}
      className={cn(
        "min-h-[400px] p-2 transition-colors",
        isOver && "border-primary bg-primary/5"
      )}
    >
      {children}
    </Card>
  )
}


export function WeeklyCalendar({ projects, initialEntries = [], onRefresh }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  const weekStart = startOfWeek(currentWeek, { locale: ja })
  const weekEnd = endOfWeek(currentWeek, { locale: ja })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // プロジェクトに色を割り当て
  const projectsWithColors = projects.map((project, index) => ({
    ...project,
    color: [
      '#3b82f6', // blue
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
    ][index % 8]
  }))

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    console.log('Drag end event:', { active: active?.id, over: over?.id })
    
    if (!over || !active) {
      setActiveId(null)
      return
    }

    const projectId = active.id as string
    const targetDate = new Date(over.id as string)
    const project = projectsWithColors.find(p => p.id === projectId)
    
    console.log('Creating time entry:', { projectId, targetDate, project })

    if (!project) {
      setActiveId(null)
      return
    }

    // 同じ日にすでにエントリがあるかチェック
    const existingEntry = entries.find(
      entry => entry.projectId === projectId && isSameDay(new Date(entry.date), targetDate)
    )

    if (existingEntry) {
      toast({
        title: 'エントリが既に存在します',
        description: 'その日のプロジェクトエントリを編集してください',
        variant: 'destructive',
      })
    } else {
      // 新しいエントリを作成
      try {
        const result = await createTimeEntry({
          projectId,
          date: targetDate,
          hours: 1,
          description: `${project.name}の作業`,
          billable: true,
          activityType: 'DEVELOPMENT',
        })

        if (result.success && result.data) {
          const newEntry = {
            ...result.data,
            project: project,
          }
          setEntries([...entries, newEntry])
          toast({
            title: 'エントリを追加しました',
            description: `${format(targetDate, 'M月d日', { locale: ja })}に1時間を記録`,
          })
        } else {
          console.error('Failed to create entry:', result)
          toast({
            title: 'エラー',
            description: result.error || 'エントリの追加に失敗しました',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('エントリ追加エラー:', error)
        toast({
          title: 'エラー',
          description: error instanceof Error ? error.message : 'エントリの追加に失敗しました',
          variant: 'destructive',
        })
      }
    }

    setActiveId(null)
    setOverId(null)
  }

  const handleUpdateEntry = async (entryId: string, hours: number) => {
    try {
      const entry = entries.find(e => e.id === entryId)
      if (!entry) return

      const result = await updateTimeEntry(entryId, { hours })
      
      if (result.success) {
        setEntries(entries.map(e => 
          e.id === entryId ? { ...e, hours } : e
        ))
        toast({
          title: '更新しました',
          description: `工数を${hours}時間に変更`,
        })
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: '更新に失敗しました',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const result = await deleteTimeEntry(entryId)
      
      if (result.success) {
        setEntries(entries.filter(e => e.id !== entryId))
        toast({
          title: '削除しました',
        })
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: '削除に失敗しました',
        variant: 'destructive',
      })
    }
  }

  const getEntriesForDay = (date: Date) => {
    return entries.filter(entry => 
      isSameDay(new Date(entry.date), date)
    )
  }

  const getDayTotal = (date: Date) => {
    return getEntriesForDay(date).reduce((sum, entry) => sum + entry.hours, 0)
  }

  const weekTotal = entries
    .filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= weekStart && entryDate <= weekEnd
    })
    .reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <div className="space-y-4">
      {/* 週ナビゲーション */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(weekStart, 'yyyy年M月d日', { locale: ja })} - {format(weekEnd, 'M月d日', { locale: ja })}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">週合計: {weekTotal}時間</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-8 gap-2">
          {/* プロジェクトリスト */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium mb-2">プロジェクト</h4>
            {projectsWithColors.map((project) => (
              <DraggableProject key={project.id} project={project} />
            ))}
          </div>

          {/* 曜日カラム */}
          {days.map((day) => {
          const dayEntries = getEntriesForDay(day)
          const dayTotal = getDayTotal(day)
          const isToday = isSameDay(day, new Date())

          return (
            <div key={day.toISOString()} className="space-y-2">
              <div className={cn(
                "text-center p-2 rounded-md",
                isToday && "bg-primary/10"
              )}>
                <div className="text-xs text-muted-foreground">
                  {format(day, 'E', { locale: ja })}
                </div>
                <div className="text-sm font-medium">
                  {format(day, 'd')}
                </div>
                {dayTotal > 0 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {dayTotal}h
                  </Badge>
                )}
              </div>
              
              <DroppableCalendarCell date={day}>
                <div className="space-y-1">
                  {dayEntries.map((entry) => (
                    <CalendarEntry
                      key={entry.id}
                      entry={{
                        ...entry,
                        project: projectsWithColors.find(p => p.id === entry.projectId)
                      }}
                      onUpdate={(hours) => handleUpdateEntry(entry.id, hours)}
                      onDelete={() => handleDeleteEntry(entry.id)}
                    />
                  ))}
                </div>
                {dayEntries.length === 0 && (
                  <div className="flex items-center justify-center h-full min-h-[100px] text-xs text-muted-foreground">
                    <Plus className="h-3 w-3 mr-1" />
                    ドロップして追加
                  </div>
                )}
              </DroppableCalendarCell>
            </div>
          )
        })}
        </div>
      </DndContext>

      <div className="text-sm text-muted-foreground">
        ※ プロジェクトをドラッグして日付にドロップすると工数を追加できます。
        工数バッジをクリックして時間を編集できます。
      </div>
    </div>
  )
}