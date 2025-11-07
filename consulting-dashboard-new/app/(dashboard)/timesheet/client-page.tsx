'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TimesheetForm } from '@/components/timesheet/timesheet-form'
import { TimesheetList } from '@/components/timesheet/timesheet-list'
import { WeeklySummary } from '@/components/timesheet/weekly-summary'
import { SimpleWeeklyCalendar } from '@/components/timesheet/simple-weekly-calendar'
import { MyTimesheets } from '@/components/timesheet/my-timesheets'
import { QuickEntry } from '@/components/timesheet/quick-entry'
import { Clock, Calendar, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TimeEntry {
  id: string
  date: Date
  hours: number
  description: string
  billable: boolean
  activityType: string
  status: string
  projectId: string
  taskId?: string
}

interface Project {
  id: string
  name: string
  code: string
  client: {
    id: string
    name: string
  }
  tasks?: Array<{
    id: string
    title: string
    status: string
  }>
}

interface WeeklyData {
  id: string
  weekStartDate: Date
  weekEndDate: Date
  totalHours: number
  billableHours: number
  nonBillableHours: number
  status: string
  entries: TimeEntry[]
}

interface TimesheetClientPageProps {
  projects: Project[]
  initialWeeklyData: WeeklyData | null
  monthlySummary: {
    totalHours: number
    billableHours: number
  } | null
  timesheets?: Array<{
    id: string
    weekStartDate: Date
    weekEndDate: Date
    totalHours: number
    billableHours: number
    status: string
    submittedAt?: Date | null
    approvedAt?: Date | null
  }>
}

export function TimesheetClientPage({ 
  projects, 
  initialWeeklyData, 
  monthlySummary,
  timesheets = []
}: TimesheetClientPageProps) {
  const router = useRouter()
  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(initialWeeklyData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  const [activeTab, setActiveTab] = useState('calendar')
  
  // initialWeeklyDataが更新されたら、weeklyDataも更新
  useEffect(() => {
    setWeeklyData(initialWeeklyData)
  }, [initialWeeklyData])
  
  // 新しいエントリが追加されたときの処理
  const handleEntriesUpdate = useCallback(async () => {
    // フラグを立てて重複リフレッシュを防ぐ
    if (isRefreshing) return
    
    console.log('Refreshing timesheet data...')
    setIsRefreshing(true)
    
    // ページをリフレッシュして最新データを取得
    router.refresh()
    
    // リフレッシュが完了するまで少し待つ
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }, [router, isRefreshing])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">工数管理</h1>
        <p className="text-muted-foreground">
          プロジェクトごとの作業時間を記録・管理
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              今週の合計
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                {weeklyData?.totalHours || 0}
                <span className="text-lg font-normal text-muted-foreground ml-1">時間</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground">請求可能</span>
                </div>
                <span className="font-semibold text-green-600">{weeklyData?.billableHours || 0}時間</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
              今月の合計
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                {monthlySummary?.totalHours || 0}
                <span className="text-lg font-normal text-muted-foreground ml-1">時間</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground">請求可能</span>
                </div>
                <span className="font-semibold text-green-600">{monthlySummary?.billableHours || 0}時間</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={monthlySummary?.totalHours && (monthlySummary.totalHours / 160) * 100 >= 80 
          ? "border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent"
          : "border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent"
        }>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${monthlySummary?.totalHours && (monthlySummary.totalHours / 160) * 100 >= 80 ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>
              稼働率
            </CardTitle>
            <div className={monthlySummary?.totalHours && (monthlySummary.totalHours / 160) * 100 >= 80 
              ? "p-2 bg-green-500/10 rounded-full"
              : "p-2 bg-orange-500/10 rounded-full"
            }>
              <TrendingUp className={monthlySummary?.totalHours && (monthlySummary.totalHours / 160) * 100 >= 80 
                ? "h-4 w-4 text-green-500"
                : "h-4 w-4 text-orange-500"
              } />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {monthlySummary?.totalHours 
                  ? Math.round((monthlySummary.totalHours / 160) * 100) 
                  : 0}
                <span className="text-lg font-normal text-muted-foreground ml-0.5">%</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">目標</span>
                  <span className="font-medium">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full transition-all ${monthlySummary?.totalHours && (monthlySummary.totalHours / 160) * 100 >= 80 ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${Math.min(monthlySummary?.totalHours ? (monthlySummary.totalHours / 160) * 100 : 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* クイック入力 */}
      <QuickEntry 
        projects={projects} 
        onSuccess={handleEntriesUpdate}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">カレンダー</TabsTrigger>
          <TabsTrigger value="entry">フォーム入力</TabsTrigger>
          <TabsTrigger value="list">工数一覧</TabsTrigger>
          <TabsTrigger value="summary">週次サマリー</TabsTrigger>
          <TabsTrigger value="timesheets">マイタイムシート</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>週間カレンダー</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleWeeklyCalendar 
                projects={projects}
                initialEntries={weeklyData?.entries || []}
                onRefresh={handleEntriesUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingEntry ? '工数を編集' : '工数を記録'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimesheetForm 
                projects={projects}
                editingEntry={editingEntry}
                onCancel={() => {
                  setEditingEntry(null)
                  setActiveTab('list')
                }}
                onSuccess={() => {
                  setEditingEntry(null)
                  setActiveTab('list')
                  handleEntriesUpdate()
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>工数記録一覧</CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyData?.entries && weeklyData.entries.length > 0 ? (
                <TimesheetList 
                  entries={weeklyData.entries.map(e => ({
                    ...e,
                    project: projects.find(p => p.id === e.projectId),
                    task: projects
                      .find(p => p.id === e.projectId)
                      ?.tasks.find(t => t.id === e.taskId)
                  }))}
                  onEdit={(entry) => {
                    setEditingEntry(entry)
                    setActiveTab('entry')
                  }}
                  onDelete={() => {
                    handleEntriesUpdate()
                  }}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  工数記録がありません
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>週次サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyData && (
                <WeeklySummary 
                  weekStart={weeklyData.weekStartDate}
                  weekEnd={weeklyData.weekEndDate}
                  timesheet={weeklyData}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheets" className="space-y-4">
          <MyTimesheets 
            timesheets={timesheets} 
            onUpdate={handleEntriesUpdate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}