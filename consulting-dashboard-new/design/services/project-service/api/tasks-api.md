# タスク管理 API定義

**更新日: 2025-01-09**

## API概要

プロジェクト内のタスク管理機能を提供するAPI。カンバンボード形式のタスク管理をサポート。

## エンドポイント一覧

### 1. プロジェクトタスク取得

**Server Action**: `getProjectTasks`

#### リクエスト
```typescript
interface GetProjectTasksRequest {
  projectId: string
}
```

#### レスポンス
```typescript
interface Task {
  id: string
  title: string
  description?: string | null
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedHours?: number | null
  actualHours?: number | null
  startDate?: string | null
  dueDate?: string | null
  completedAt?: string | null
  assignee?: {
    id: string
    name: string
    email: string
  } | null
  milestone?: {
    id: string
    name: string
    dueDate: string
  } | null
  createdAt: string
  updatedAt: string
}

interface GetProjectTasksResponse {
  tasks: Task[]
}
```

#### 処理フロー
1. ユーザー認証確認
2. プロジェクトへのアクセス権確認
3. タスク一覧取得（担当者、マイルストーン情報を含む）
4. レスポンス整形

#### エラーケース
- `UNAUTHORIZED`: 認証が必要です
- `PROJECT_NOT_FOUND`: プロジェクトが見つからないか、権限がありません

---

### 2. タスク作成

**Server Action**: `createTask`

#### リクエスト
```typescript
interface CreateTaskRequest {
  projectId: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  milestoneId?: string
  assigneeId?: string
  estimatedHours?: number
  dueDate?: Date
}
```

#### レスポンス
```typescript
interface CreateTaskResponse {
  success: boolean
  taskId?: string
  error?: string
}
```

#### バリデーション
- `title`: 必須、1文字以上
- `priority`: 必須、指定値のいずれか
- `estimatedHours`: 0より大きい数値（指定時）
- `assigneeId`: プロジェクトメンバーであること（指定時）
- `milestoneId`: プロジェクト内のマイルストーンであること（指定時）

#### 処理フロー
1. ユーザー権限確認（PMまたはリード）
2. 入力値バリデーション
3. 担当者がプロジェクトメンバーか確認
4. マイルストーンがプロジェクト内か確認
5. タスク作成（初期ステータス: todo）

#### エラーケース
- `PERMISSION_DENIED`: タスク作成権限がありません
- `INVALID_ASSIGNEE`: 指定されたユーザーはプロジェクトメンバーではありません
- `INVALID_MILESTONE`: 指定されたマイルストーンは存在しません

---

### 3. タスクステータス更新

**Server Action**: `updateTaskStatus`

#### リクエスト
```typescript
interface UpdateTaskStatusRequest {
  taskId: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
}
```

#### レスポンス
```typescript
interface UpdateTaskStatusResponse {
  success: boolean
  task?: Task
  error?: string
}
```

#### 処理フロー
1. ユーザー認証確認
2. タスク存在確認
3. プロジェクトメンバーであることを確認
4. ステータス更新
5. 完了時は完了日時を記録
6. 進行中ステータスの場合、開始日を記録

#### ビジネスルール
- 自分に割り当てられたタスクのみステータス変更可能（PMは例外）
- completedステータス時は自動的に完了日時を記録
- in_progressステータス時は自動的に開始日を記録（未設定の場合）

#### エラーケース
- `TASK_NOT_FOUND`: タスクが見つかりません
- `PERMISSION_DENIED`: このタスクを更新する権限がありません

---

### 4. タスク更新

**Server Action**: `updateTask`

#### リクエスト
```typescript
interface UpdateTaskRequest {
  taskId: string
  title?: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  assigneeId?: string | null
  milestoneId?: string | null
  estimatedHours?: number | null
  actualHours?: number | null
  dueDate?: Date | null
}
```

#### レスポンス
```typescript
interface UpdateTaskResponse {
  success: boolean
  task?: Task
  error?: string
}
```

#### 処理フロー
1. ユーザー権限確認（PMまたはリード）
2. タスク存在確認
3. 更新データのバリデーション
4. 担当者・マイルストーンの妥当性確認
5. タスク更新

#### エラーケース
- `TASK_NOT_FOUND`: タスクが見つかりません
- `PERMISSION_DENIED`: タスク更新権限がありません
- `INVALID_UPDATE`: 無効な更新データです

---

### 5. タスク削除

**Server Action**: `deleteTask`

#### リクエスト
```typescript
interface DeleteTaskRequest {
  taskId: string
}
```

#### レスポンス
```typescript
interface DeleteTaskResponse {
  success: boolean
  error?: string
}
```

#### 処理フロー
1. ユーザー権限確認（PMのみ）
2. タスク存在確認
3. タスク削除

#### エラーケース
- `TASK_NOT_FOUND`: タスクが見つかりません
- `PERMISSION_DENIED`: タスク削除権限がありません

---

## カンバンボード実装

### ドラッグ&ドロップ対応
```typescript
// タスクのステータス更新はドラッグ&ドロップで実行
const handleDrop = async (taskId: string, newStatus: TaskStatus) => {
  const result = await updateTaskStatus(taskId, newStatus)
  if (result.success) {
    // UIを更新
  }
}
```

### ステータス定義
```typescript
const TASK_STATUSES = {
  todo: { label: 'ToDo', color: 'bg-gray-100' },
  in_progress: { label: '進行中', color: 'bg-blue-100' },
  review: { label: 'レビュー', color: 'bg-yellow-100' },
  completed: { label: '完了', color: 'bg-green-100' }
} as const
```

### 優先度定義
```typescript
const TASK_PRIORITIES = {
  low: { label: '低', color: 'text-gray-500' },
  medium: { label: '中', color: 'text-blue-500' },
  high: { label: '高', color: 'text-orange-500' },
  urgent: { label: '緊急', color: 'text-red-500' }
} as const
```

## 実装例

### タスクステータス更新（app/actions/tasks.ts）
```typescript
'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from './auth'

export async function updateTaskStatus(
  taskId: string, 
  status: TaskStatus
) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'UNAUTHORIZED' }
  }
  
  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          projectMembers: {
            where: { userId: user.id }
          }
        }
      }
    }
  })
  
  if (!task) {
    return { success: false, error: 'TASK_NOT_FOUND' }
  }
  
  // プロジェクトメンバーチェック
  const isProjectMember = task.project.projectMembers.length > 0
  const isPM = task.project.projectMembers.some(m => m.role === 'pm')
  const isAssignee = task.assigneeId === user.id
  
  if (!isProjectMember || (!isPM && !isAssignee)) {
    return { success: false, error: 'PERMISSION_DENIED' }
  }
  
  // ステータスに応じた追加処理
  const updateData: any = { status }
  
  if (status === 'completed') {
    updateData.completedAt = new Date()
  } else if (status === 'in_progress' && !task.startDate) {
    updateData.startDate = new Date()
  }
  
  const updatedTask = await db.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      assignee: true,
      milestone: true
    }
  })
  
  return { success: true, task: updatedTask }
}
```

## セキュリティ考慮事項

### アクセス制御
- プロジェクトメンバーのみアクセス可能
- タスク作成・削除はPMとリードのみ
- ステータス変更は担当者またはPMのみ

### データ検証
- Zodによる入力値検証
- 担当者・マイルストーンの妥当性チェック
- 日付の整合性確認