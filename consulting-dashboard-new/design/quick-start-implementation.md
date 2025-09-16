# 未実装機能のクイックスタート実装ガイド

**更新日: 2025-01-13**

## 🚀 最優先実装: 工数入力機能

### Step 1: Prismaスキーマの適用

```bash
# timesheet-serviceのスキーマを作成
mkdir -p prisma/timesheet-service
```

```prisma
// prisma/timesheet-service/schema.prisma
model Timesheet {
  id           String   @id @default(uuid())
  userId       String
  projectId    String
  taskId       String?
  date         DateTime
  hours        Float
  description  String
  status       String   @default("draft") // draft, submitted, approved, rejected
  approvedBy   String?
  approvedAt   DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Step 2: 工数入力フォームの実装

```typescript
// app/components/timesheet/timesheet-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { createTimesheet } from '@/actions/timesheet'

const timesheetSchema = z.object({
  projectId: z.string().min(1, 'プロジェクトを選択してください'),
  taskId: z.string().optional(),
  date: z.date(),
  hours: z.number().min(0.5).max(24),
  description: z.string().min(1, '作業内容を入力してください')
})

export function TimesheetForm({ projects, tasks }) {
  const form = useForm({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      date: new Date(),
      hours: 0,
      description: ''
    }
  })

  const onSubmit = async (data) => {
    await createTimesheet(data)
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* フォームフィールドの実装 */}
    </form>
  )
}
```

### Step 3: Server Actionの作成

```typescript
// app/actions/timesheet.ts
'use server'

import { timesheetDb } from '@/lib/clients/timesheetDb'
import { getCurrentUser } from './auth'

export async function createTimesheet(data: {
  projectId: string
  taskId?: string
  date: Date
  hours: number
  description: string
}) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  return await timesheetDb.timesheet.create({
    data: {
      ...data,
      userId: user.id,
      status: 'draft'
    }
  })
}

export async function submitTimesheets(ids: string[]) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  return await timesheetDb.timesheet.updateMany({
    where: {
      id: { in: ids },
      userId: user.id,
      status: 'draft'
    },
    data: {
      status: 'submitted'
    }
  })
}
```

## 📊 次の優先実装: ガントチャート

### Option 1: Frappe Ganttを使用

```bash
npm install frappe-gantt react-frappe-gantt
```

```typescript
// app/components/projects/gantt-chart.tsx
'use client'

import { useEffect, useRef } from 'react'
import Gantt from 'frappe-gantt'

export function GanttChart({ tasks }) {
  const ganttRef = useRef(null)

  useEffect(() => {
    if (ganttRef.current) {
      new Gantt(ganttRef.current, tasks, {
        view_mode: 'Week',
        date_format: 'YYYY-MM-DD',
        on_click: (task) => {
          console.log('Task clicked:', task)
        },
        on_date_change: (task, start, end) => {
          // タスクの日付更新処理
        }
      })
    }
  }, [tasks])

  return <svg ref={ganttRef}></svg>
}
```

### Option 2: gantt-task-reactを使用

```bash
npm install gantt-task-react
```

```typescript
// app/components/projects/gantt-chart.tsx
'use client'

import { Gantt, Task } from 'gantt-task-react'
import "gantt-task-react/dist/index.css"

export function GanttChart({ tasks }) {
  const ganttTasks: Task[] = tasks.map(task => ({
    start: new Date(task.startDate),
    end: new Date(task.endDate),
    name: task.name,
    id: task.id,
    type: 'task',
    progress: task.progress || 0,
    dependencies: task.dependencies || []
  }))

  return (
    <Gantt
      tasks={ganttTasks}
      viewMode="Week"
      onDateChange={(task) => {
        // 日付変更処理
      }}
      onTaskDelete={(task) => {
        // タスク削除処理
      }}
    />
  )
}
```

## 🔔 通知システムの実装

### Step 1: 通知コンポーネント

```typescript
// app/components/notifications/notification-bell.tsx
'use client'

import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/hooks/use-notifications'

export function NotificationBell() {
  const { notifications, unreadCount } = useNotifications()

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-2 -right-2">
          {unreadCount}
        </Badge>
      )}
    </div>
  )
}
```

### Step 2: リアルタイム通知（Server-Sent Events）

```typescript
// app/api/notifications/stream/route.ts
export async function GET(request: Request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const sendNotification = (notification: any) => {
        const data = `data: ${JSON.stringify(notification)}\n\n`
        controller.enqueue(encoder.encode(data))
      }

      // 通知の監視ロジック
      const interval = setInterval(async () => {
        const newNotifications = await checkNewNotifications()
        newNotifications.forEach(sendNotification)
      }, 5000)

      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
```

## 💰 財務ダッシュボードの基本実装

```typescript
// app/components/finance/revenue-chart.tsx
'use client'

import { Line } from 'react-chartjs-2'

export function RevenueChart({ data }) {
  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: '収益',
        data: data.map(d => d.revenue),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'コスト',
        data: data.map(d => d.cost),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  }

  return <Line data={chartData} />
}
```

## 🎯 実装のコツ

### 1. 段階的な実装
- まず最小限の機能から始める
- ユーザーフィードバックを受けながら改善

### 2. 既存コンポーネントの再利用
- shadcn/uiのコンポーネントを最大限活用
- 共通コンポーネントは`/app/components/ui`に配置

### 3. Server ActionsとRoute Handlersの使い分け
- フォーム送信: Server Actions
- リアルタイム通信: Route Handlers
- ファイルアップロード: Route Handlers

### 4. エラーハンドリング
```typescript
try {
  const result = await action()
  toast.success('成功しました')
} catch (error) {
  toast.error('エラーが発生しました')
  console.error(error)
}
```

### 5. ローディング状態の管理
```typescript
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async () => {
  setIsLoading(true)
  try {
    await action()
  } finally {
    setIsLoading(false)
  }
}
```

## 📚 参考リソース

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)