'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock, Plus, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

// カレンダーセル内のエントリ
function CalendarEntry({ 
  entry, 
  onUpdate, 
  onDelete 
}: { 
  entry: TimeEntry & { project?: Project }
  onUpdate: (hours: number) => Promise<void>
  onDelete: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [hours, setHours] = useState(entry.hours.toString())
  const [isSaving, setIsSaving] = useState(false)

  // entryの時間が変更されたら、ローカルステートも更新
  useEffect(() => {
    setHours(entry.hours.toString())
  }, [entry.hours])

  const handleSave = async () => {
    const newHours = parseFloat(hours)
    if (!isNaN(newHours) && newHours > 0 && newHours <= 24) {
      setIsSaving(true)
      try {
        await onUpdate(newHours)
        setIsEditing(false)
      } catch (error) {
        // エラーが発生した場合は元の値に戻す
        setHours(entry.hours.toString())
      } finally {
        setIsSaving(false)
      }
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
                disabled={isSaving}
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

export function SimpleWeeklyCalendar({ projects, initialEntries = [], onRefresh }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries)
  const [draggedProject, setDraggedProject] = useState<Project | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [showTimeDialog, setShowTimeDialog] = useState(false)
  const [pendingEntry, setPendingEntry] = useState<{ project: Project; date: Date } | null>(null)
  const [timeInput, setTimeInput] = useState('1')
  const [descriptionInput, setDescriptionInput] = useState('')
  const { toast } = useToast()

  const weekStart = startOfWeek(currentWeek, { locale: ja })
  const weekEnd = endOfWeek(currentWeek, { locale: ja })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  // デバッグ: 週の範囲を確認
  console.log('Current week range:', {
    start: format(weekStart, 'yyyy-MM-dd'),
    end: format(weekEnd, 'yyyy-MM-dd'),
    currentWeek: format(currentWeek, 'yyyy-MM-dd')
  })

  // initialEntriesが更新されたら、内部のentriesステートも更新
  useEffect(() => {
    console.log('Initial entries updated:', initialEntries.length)
    // 日付をDateオブジェクトに確実に変換
    const entriesWithDates = initialEntries.map(entry => ({
      ...entry,
      date: new Date(entry.date)
    }))
    setEntries(entriesWithDates)
  }, [initialEntries])

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

  const handleDragStart = (e: React.DragEvent, project: Project) => {
    setDraggedProject(project)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDragEnter = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault()
    setDropTarget(dateStr)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropTarget(null)
    }
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    setDropTarget(null)

    if (!draggedProject) return

    // 同じ日にすでにエントリがあるかチェック
    const existingEntry = entries.find(
      entry => entry.projectId === draggedProject.id && isSameDay(new Date(entry.date), date)
    )

    if (existingEntry) {
      toast({
        title: 'エントリが既に存在します',
        description: 'その日のプロジェクトエントリを編集してください',
        variant: 'destructive',
      })
    } else {
      // ダイアログを表示
      setPendingEntry({ project: draggedProject, date })
      setTimeInput('1')
      setDescriptionInput(`${draggedProject.name}の作業`)
      setShowTimeDialog(true)
    }

    setDraggedProject(null)
  }

  const handleCreateEntry = async () => {
    if (!pendingEntry) return

    const hours = parseFloat(timeInput)
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      toast({
        title: 'エラー',
        description: '有効な時間を入力してください（0.5〜24時間）',
        variant: 'destructive',
      })
      return
    }

    try {
      console.log('Creating time entry from calendar:', {
        projectId: pendingEntry.project.id,
        date: pendingEntry.date,
        hours,
        description: descriptionInput,
      })
      
      const result = await createTimeEntry({
        projectId: pendingEntry.project.id,
        date: pendingEntry.date,
        hours,
        description: descriptionInput,
        billable: true,
        activityType: 'DEVELOPMENT',
      })

      console.log('Create time entry result:', result)

      if (result.success && result.data) {
        // プロジェクトにカラー情報を含める
        const projectWithColor = projectsWithColors.find(p => p.id === pendingEntry.project.id)
        const newEntry = {
          ...result.data,
          date: new Date(result.data.date), // 日付を確実にDateオブジェクトに変換
          project: projectWithColor || pendingEntry.project,
          projectId: pendingEntry.project.id,
        }
        console.log('Adding new entry to state:', newEntry)
        console.log('Entry date:', newEntry.date)
        console.log('Entry project:', newEntry.project)
        
        setEntries(prevEntries => {
          const updatedEntries = [...prevEntries, newEntry]
          console.log('Total entries after adding:', updatedEntries.length)
          return updatedEntries
        })
        
        toast({
          title: 'エントリを追加しました',
          description: `${format(pendingEntry.date, 'M月d日', { locale: ja })}に${hours}時間を記録`,
        })
        setShowTimeDialog(false)
        setPendingEntry(null)
        
        // 親コンポーネントに更新を通知
        if (onRefresh) {
          // 少し遅延を入れて、状態更新を確実にする
          setTimeout(() => {
            onRefresh()
          }, 100)
        }
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

  const handleUpdateEntry = async (entryId: string, hours: number) => {
    try {
      const entry = entries.find(e => e.id === entryId)
      if (!entry) return

      console.log('Updating time entry:', { entryId, hours })
      const result = await updateTimeEntry(entryId, { hours })
      console.log('Update result:', result)
      
      if (result.success) {
        setEntries(entries.map(e => 
          e.id === entryId ? { ...e, hours } : e
        ))
        toast({
          title: '更新しました',
          description: `工数を${hours}時間に変更`,
        })
        onRefresh?.()
      } else {
        toast({
          title: 'エラー',
          description: result.error || '更新に失敗しました',
          variant: 'destructive',
        })
        throw new Error(result.error || '更新に失敗しました')
      }
    } catch (error) {
      console.error('Error updating entry:', error)
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '更新に失敗しました',
        variant: 'destructive',
      })
      throw error
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      console.log('Deleting time entry:', entryId)
      const result = await deleteTimeEntry(entryId)
      console.log('Delete result:', result)
      
      if (result.success) {
        setEntries(entries.filter(e => e.id !== entryId))
        toast({
          title: '削除しました',
        })
        onRefresh?.()
      } else {
        toast({
          title: 'エラー',
          description: result.error || '削除に失敗しました',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '削除に失敗しました',
        variant: 'destructive',
      })
    }
  }

  const getEntriesForDay = (date: Date) => {
    const dayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date)
      const isSame = isSameDay(entryDate, date)
      if (entries.length < 10) { // デバッグ用: エントリが少ない時のみログ出力
        console.log(`Comparing entry date ${format(entryDate, 'yyyy-MM-dd')} with ${format(date, 'yyyy-MM-dd')}: ${isSame}`)
      }
      return isSame
    })
    console.log(`Entries for ${format(date, 'yyyy-MM-dd')}:`, dayEntries.length, 'Total entries:', entries.length)
    return dayEntries
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

      <div className="grid grid-cols-8 gap-2">
        {/* プロジェクトリスト */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium mb-2">プロジェクト</h4>
          {projectsWithColors.map((project) => (
            <div
              key={project.id}
              draggable
              onDragStart={(e) => handleDragStart(e, project)}
              className="p-2 rounded-md border cursor-move hover:shadow-md transition-shadow bg-white"
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
          ))}
        </div>

        {/* 曜日カラム */}
        {days.map((day) => {
          const dayEntries = getEntriesForDay(day)
          const dayTotal = getDayTotal(day)
          const isToday = isSameDay(day, new Date())
          const dateStr = day.toISOString()

          return (
            <div key={dateStr} className="space-y-2">
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
              
              <Card 
                className={cn(
                  "min-h-[400px] p-2 transition-colors",
                  dropTarget === dateStr && "border-primary bg-primary/5"
                )}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className="space-y-1">
                  {dayEntries.map((entry) => (
                    <CalendarEntry
                      key={entry.id}
                      entry={{
                        ...entry,
                        project: projectsWithColors.find(p => p.id === entry.projectId)
                      }}
                      onUpdate={async (hours) => {
                        await handleUpdateEntry(entry.id, hours)
                      }}
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
              </Card>
            </div>
          )
        })}
      </div>

      <div className="text-sm text-muted-foreground">
        ※ プロジェクトをドラッグして日付にドロップすると工数を追加できます。
        工数バッジをクリックして時間を編集できます。
      </div>

      {/* 時間入力ダイアログ */}
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>工数を記録</DialogTitle>
            <DialogDescription>
              {pendingEntry && (
                <>
                  {pendingEntry.project.client.name} - {pendingEntry.project.name}
                  <br />
                  {format(pendingEntry.date, 'yyyy年M月d日 (E)', { locale: ja })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hours">作業時間（時間）</Label>
              <Input
                id="hours"
                type="number"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                step="0.5"
                min="0.5"
                max="24"
                placeholder="1.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">作業内容</Label>
              <Textarea
                id="description"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                placeholder="実施した作業内容を入力してください"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCreateEntry}>
              記録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}