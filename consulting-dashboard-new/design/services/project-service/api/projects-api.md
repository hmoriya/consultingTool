# プロジェクト管理 API定義

**更新日: 2025-01-09**

## API概要

プロジェクトの作成、更新、取得などの管理機能を提供するAPI。Next.js Server Actionsで実装。

## エンドポイント一覧

### 1. プロジェクト一覧取得

**Server Action**: `getProjects`

#### リクエスト
なし（ユーザー権限に基づいて自動フィルタリング）

#### レスポンス
```typescript
interface ProjectSummary {
  id: string
  name: string
  code: string
  status: 'planning' | 'active' | 'completed' | 'onhold'
  priority?: 'low' | 'medium' | 'high' | 'critical' | null
  startDate: string
  endDate?: string | null
  budget: number
  client: {
    id: string
    name: string
  }
  manager?: {
    id: string
    name: string
    email: string
  }
  teamSize: number
  progress: number
}

interface GetProjectsResponse {
  projects: ProjectSummary[]
}
```

#### 処理フロー
1. 現在のユーザー取得
2. ロールに基づいてプロジェクトをフィルタリング
   - エグゼクティブ: 全プロジェクト
   - PM: 自身が管理するプロジェクト
   - コンサルタント: 参画中のプロジェクト
   - クライアント: 自組織のプロジェクト
3. タスクの完了率から進捗率を計算
4. チームメンバー数を集計

#### エラーケース
- `UNAUTHORIZED`: 認証が必要です
- `ACCESS_DENIED`: アクセス権限がありません

---

### 2. プロジェクト作成

**Server Action**: `createProject`

#### リクエスト
```typescript
interface CreateProjectRequest {
  name: string
  code: string
  clientId: string
  status: 'planning' | 'active' | 'completed' | 'onhold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: Date
  endDate?: Date
  budget: number
  description?: string
}
```

#### レスポンス
```typescript
interface CreateProjectResponse {
  success: boolean
  projectId?: string
  error?: string
}
```

#### バリデーション
- `name`: 必須、1文字以上
- `code`: 必須、一意性チェック、英数字とハイフンのみ
- `budget`: 必須、0以上の数値
- `endDate`: 開始日以降であること

#### 処理フロー
1. ユーザー権限確認（PM以上）
2. 入力値バリデーション
3. プロジェクトコードの重複チェック
4. プロジェクト作成
5. 作成者をPMとして自動アサイン

#### エラーケース
- `DUPLICATE_CODE`: プロジェクトコードが既に使用されています
- `INVALID_DATES`: 終了日は開始日以降である必要があります
- `PERMISSION_DENIED`: プロジェクト作成権限がありません

---

### 3. プロジェクトステータス更新

**Server Action**: `updateProjectStatus`

#### リクエスト
```typescript
interface UpdateProjectStatusRequest {
  projectId: string
  status: 'planning' | 'active' | 'completed' | 'onhold'
}
```

#### レスポンス
```typescript
interface UpdateProjectStatusResponse {
  success: boolean
  error?: string
}
```

#### 処理フロー
1. ユーザー権限確認
2. プロジェクト存在確認
3. ユーザーがPMであることを確認
4. ステータス更新
5. 監査ログ記録

#### エラーケース
- `PROJECT_NOT_FOUND`: プロジェクトが見つかりません
- `NOT_PROJECT_MANAGER`: このプロジェクトの管理者ではありません
- `INVALID_STATUS_TRANSITION`: 無効なステータス遷移です

---

### 4. プロジェクト詳細取得

**Server Action**: `getProjectDetails`

#### リクエスト
```typescript
interface GetProjectDetailsRequest {
  projectId: string
}
```

#### レスポンス
```typescript
interface ProjectDetails {
  id: string
  name: string
  code: string
  description?: string
  status: 'planning' | 'active' | 'completed' | 'onhold'
  priority?: 'low' | 'medium' | 'high' | 'critical' | null
  startDate: string
  endDate?: string | null
  budget: number
  client: {
    id: string
    name: string
  }
  members: {
    id: string
    userId: string
    user: {
      id: string
      name: string
      email: string
    }
    role: 'pm' | 'lead' | 'senior' | 'consultant' | 'analyst'
    allocation: number
    startDate: string
    endDate?: string
  }[]
  milestones: {
    id: string
    name: string
    dueDate: string
    status: 'pending' | 'completed' | 'delayed'
  }[]
  tasks: {
    total: number
    completed: number
    inProgress: number
    pending: number
  }
}
```

#### 処理フロー
1. ユーザー権限確認
2. プロジェクトへのアクセス権確認
3. プロジェクト詳細情報取得
4. タスク統計の集計

#### エラーケース
- `PROJECT_NOT_FOUND`: プロジェクトが見つかりません
- `ACCESS_DENIED`: このプロジェクトへのアクセス権がありません

---

## 実装例

### プロジェクト作成（app/actions/projects.ts）
```typescript
'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { getCurrentUser } from './auth'

const createProjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().regex(/^[A-Z0-9-]+$/),
  clientId: z.string(),
  status: z.enum(['planning', 'active', 'completed', 'onhold']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  budget: z.number().min(0),
  description: z.string().optional()
}).refine(data => {
  if (data.endDate) {
    return data.endDate >= data.startDate
  }
  return true
}, {
  message: "終了日は開始日以降である必要があります",
  path: ["endDate"]
})

export async function createProject(data: z.infer<typeof createProjectSchema>) {
  const user = await getCurrentUser()
  
  if (!user || !['pm', 'executive'].includes(user.role.name)) {
    return { success: false, error: 'PERMISSION_DENIED' }
  }
  
  try {
    const validated = createProjectSchema.parse(data)
    
    // コード重複チェック
    const existing = await db.project.findUnique({
      where: { code: validated.code }
    })
    
    if (existing) {
      return { success: false, error: 'DUPLICATE_CODE' }
    }
    
    // プロジェクト作成とPMアサイン
    const project = await db.project.create({
      data: {
        ...validated,
        projectMembers: {
          create: {
            userId: user.id,
            role: 'pm',
            allocation: 50,
            startDate: validated.startDate
          }
        }
      }
    })
    
    return { 
      success: true, 
      projectId: project.id 
    }
  } catch (error) {
    return { success: false, error: 'SERVER_ERROR' }
  }
}
```

## セキュリティ考慮事項

### アクセス制御
- ロールベースアクセス制御（RBAC）
- プロジェクトレベルの権限チェック
- データの範囲制限（自組織・自プロジェクトのみ）

### 入力検証
- Zodスキーマによる厳密な型検証
- SQLインジェクション対策（Prismaによる自動エスケープ）
- XSS対策（React/Next.jsの自動エスケープ）

### 監査
- 重要な操作（作成、更新、削除）の監査ログ
- ユーザーとタイムスタンプの記録