# マイルストーン管理 API定義

**更新日: 2025-01-09**

## API概要

プロジェクトの重要な節目（マイルストーン）を管理するAPI。タイムライン表示と進捗管理をサポート。

## エンドポイント一覧

### 1. プロジェクトマイルストーン取得

**Server Action**: `getProjectMilestones`

#### リクエスト
```typescript
interface GetProjectMilestonesRequest {
  projectId: string
}
```

#### レスポンス
```typescript
interface Milestone {
  id: string
  name: string
  description?: string | null
  dueDate: string
  status: 'pending' | 'completed' | 'delayed'
  tasksCount: number
  completedTasksCount: number
  progress: number
  createdAt: string
  updatedAt: string
}

interface GetProjectMilestonesResponse {
  milestones: Milestone[]
}
```

#### 処理フロー
1. ユーザー認証確認
2. プロジェクトアクセス権確認
3. マイルストーン一覧取得
4. 各マイルストーンのタスク統計を集計
5. 進捗率計算（完了タスク数 / 全タスク数）

#### ビジネスルール
- 期日を過ぎた pending ステータスは自動的に delayed として扱う
- 進捗率は関連タスクの完了率から算出

#### エラーケース
- `UNAUTHORIZED`: 認証が必要です
- `PROJECT_NOT_FOUND`: プロジェクトが見つからないか、権限がありません

---

### 2. マイルストーン作成

**Server Action**: `createMilestone`

#### リクエスト
```typescript
interface CreateMilestoneRequest {
  projectId: string
  name: string
  description?: string
  dueDate: Date
}
```

#### レスポンス
```typescript
interface CreateMilestoneResponse {
  success: boolean
  milestoneId?: string
  error?: string
}
```

#### バリデーション
- `name`: 必須、1文字以上
- `dueDate`: 必須、プロジェクト期間内であること

#### 処理フロー
1. ユーザー権限確認（PMまたはエグゼクティブ）
2. プロジェクト存在確認
3. 入力値バリデーション
4. マイルストーン作成（初期ステータス: pending）

#### エラーケース
- `PERMISSION_DENIED`: マイルストーン作成権限がありません
- `INVALID_DATE`: 期日がプロジェクト期間外です
- `DUPLICATE_NAME`: 同名のマイルストーンが既に存在します

---

### 3. マイルストーン更新

**Server Action**: `updateMilestone`

#### リクエスト
```typescript
interface UpdateMilestoneRequest {
  milestoneId: string
  name?: string
  description?: string | null
  dueDate?: Date
  status?: 'pending' | 'completed' | 'delayed'
}
```

#### レスポンス
```typescript
interface UpdateMilestoneResponse {
  success: boolean
  milestone?: Milestone
  error?: string
}
```

#### 処理フロー
1. ユーザー権限確認（PMまたはエグゼクティブ）
2. マイルストーン存在確認
3. プロジェクトのPMであることを確認
4. 更新データのバリデーション
5. マイルストーン更新

#### ビジネスルール
- completed ステータスへの変更時、関連タスクの完了率をチェック
- 期日変更時、プロジェクト期間との整合性を確認

#### エラーケース
- `MILESTONE_NOT_FOUND`: マイルストーンが見つからないか、権限がありません
- `INCOMPLETE_TASKS`: 未完了のタスクがあるため完了にできません
- `PERMISSION_DENIED`: 更新権限がありません

---

### 4. マイルストーン削除

**Server Action**: `deleteMilestone`

#### リクエスト
```typescript
interface DeleteMilestoneRequest {
  milestoneId: string
}
```

#### レスポンス
```typescript
interface DeleteMilestoneResponse {
  success: boolean
  error?: string
}
```

#### 処理フロー
1. ユーザー権限確認（PMのみ）
2. マイルストーン存在確認
3. 関連タスクの確認
4. マイルストーン削除（関連タスクのマイルストーンIDをnullに更新）

#### エラーケース
- `MILESTONE_NOT_FOUND`: マイルストーンが見つかりません
- `PERMISSION_DENIED`: 削除権限がありません
- `HAS_ACTIVE_TASKS`: アクティブなタスクが関連付けられています

---

### 5. マイルストーン統計取得

**Server Action**: `getMilestoneStats`

#### リクエスト
```typescript
interface GetMilestoneStatsRequest {
  projectId: string
}
```

#### レスポンス
```typescript
interface MilestoneStats {
  total: number
  pending: number
  completed: number
  delayed: number
  upcomingDeadlines: {
    id: string
    name: string
    dueDate: string
    daysUntilDue: number
  }[]
}
```

#### 処理フロー
1. プロジェクトアクセス権確認
2. マイルストーン統計を集計
3. 直近7日以内の締切を抽出

---

### 6. マイルストーンタスク取得

**Server Action**: `getMilestoneTasks`

#### リクエスト
```typescript
interface GetMilestoneTasksRequest {
  milestoneId: string
}
```

#### レスポンス
```typescript
interface MilestoneTask {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: {
    id: string
    name: string
  }
}

interface GetMilestoneTasksResponse {
  tasks: MilestoneTask[]
}
```

#### 処理フロー
1. マイルストーンアクセス権確認
2. 関連タスク一覧取得

---

## タイムライン表示

### ビジュアル表現
```typescript
interface TimelineItem {
  id: string
  name: string
  date: Date
  status: 'pending' | 'completed' | 'delayed'
  progress: number
  tasksInfo: string // "5/10 タスク完了"
}

// ステータスに応じた色分け
const STATUS_COLORS = {
  pending: 'bg-blue-500',
  completed: 'bg-green-500',
  delayed: 'bg-red-500'
} as const
```

### 進捗インジケーター
```typescript
// 円形プログレスバーで進捗を表示
const CircularProgress = ({ progress }: { progress: number }) => {
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (progress / 100) * circumference
  
  return (
    <svg className="w-20 h-20">
      <circle
        cx="40"
        cy="40"
        r="36"
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="stroke-current"
      />
    </svg>
  )
}
```

## 実装例

### マイルストーン更新（app/actions/milestones.ts）
```typescript
'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { getCurrentUser } from './auth'

const updateMilestoneSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(['pending', 'completed', 'delayed']).optional()
})

export async function updateMilestone(
  milestoneId: string,
  data: z.infer<typeof updateMilestoneSchema>
) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'UNAUTHORIZED' }
  }
  
  const milestone = await db.milestone.findUnique({
    where: { id: milestoneId },
    include: {
      project: {
        include: {
          projectMembers: {
            where: { 
              userId: user.id,
              role: { in: ['pm', 'lead'] }
            }
          }
        }
      }
    }
  })
  
  if (!milestone) {
    return { success: false, error: 'MILESTONE_NOT_FOUND' }
  }
  
  const isAuthorized = 
    user.role.name === 'executive' || 
    milestone.project.projectMembers.length > 0
  
  if (!isAuthorized) {
    return { success: false, error: 'PERMISSION_DENIED' }
  }
  
  // completedへの変更時、タスクチェック
  if (data.status === 'completed') {
    const incompleteTasks = await db.task.count({
      where: {
        milestoneId: milestoneId,
        status: { not: 'completed' }
      }
    })
    
    if (incompleteTasks > 0) {
      return { 
        success: false, 
        error: 'INCOMPLETE_TASKS' 
      }
    }
  }
  
  const updated = await db.milestone.update({
    where: { id: milestoneId },
    data,
    include: {
      tasks: true
    }
  })
  
  // 進捗率を計算
  const progress = updated.tasks.length > 0
    ? (updated.tasks.filter(t => t.status === 'completed').length / 
       updated.tasks.length) * 100
    : 0
  
  return {
    success: true,
    milestone: {
      ...updated,
      tasksCount: updated.tasks.length,
      completedTasksCount: updated.tasks.filter(
        t => t.status === 'completed'
      ).length,
      progress
    }
  }
}
```

## セキュリティ考慮事項

### アクセス制御
- プロジェクトメンバーのみ閲覧可能
- 作成・更新・削除はPMとエグゼクティブのみ
- クライアントは閲覧のみ可能

### データ整合性
- マイルストーン削除時の関連タスク処理
- 期日とプロジェクト期間の整合性チェック
- ステータス遷移の妥当性検証