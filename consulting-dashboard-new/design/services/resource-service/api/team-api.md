# チーム管理 API定義

**更新日: 2025-01-09**

## API概要

組織全体のチームメンバー管理とプロジェクトチームの管理機能を提供するAPI。稼働率の可視化とリソース配分の最適化をサポート。

## 組織チーム管理API

### 1. チームメンバー一覧取得

**Server Action**: `getTeamMembers`

#### リクエスト
なし（組織に基づいて自動フィルタリング）

#### レスポンス
```typescript
interface TeamMember {
  id: string
  name: string
  email: string
  role: {
    id: string
    name: string
    description: string
  }
  utilization: number
  projects: {
    id: string
    projectId: string
    projectName: string
    role: string
    allocation: number
  }[]
}

interface GetTeamMembersResponse {
  members: TeamMember[]
}
```

#### 処理フロー
1. ユーザー権限確認（エグゼクティブまたはPM）
2. ユーザーの組織取得
3. 組織内メンバー一覧取得（クライアントユーザーを除外）
4. 各メンバーの稼働率を計算（プロジェクト配分の合計）

#### ビジネスルール
- クライアント組織のユーザーは表示しない
- 稼働率 = 全プロジェクトの配分率の合計
- 100%を超える場合は過負荷として表示

#### エラーケース
- `UNAUTHORIZED`: 認証が必要です
- `PERMISSION_DENIED`: チーム管理権限がありません

---

### 2. チームメンバー検索

**Server Action**: `searchTeamMembers`

#### リクエスト
```typescript
interface SearchTeamMembersRequest {
  query: string
}
```

#### レスポンス
```typescript
interface SearchTeamMembersResponse {
  members: TeamMember[]
}
```

#### 処理フロー
1. 権限確認
2. 名前またはメールアドレスで部分一致検索
3. 結果を稼働率順にソート

---

### 3. チームメンバー作成

**Server Action**: `createTeamMember`

#### リクエスト
```typescript
interface CreateTeamMemberRequest {
  name: string
  email: string
  role: 'executive' | 'pm' | 'consultant'
  password: string
}
```

#### レスポンス
```typescript
interface CreateTeamMemberResponse {
  success: boolean
  memberId?: string
  error?: string
}
```

#### バリデーション（Zod）
```typescript
const createMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['executive', 'pm', 'consultant']),
  password: z.string().min(8)
})
```

#### 処理フロー
1. ユーザー権限確認（エグゼクティブまたはPM）
2. 入力値バリデーション
3. メールアドレス重複チェック
4. パスワードハッシュ化
5. ユーザー作成（同一組織に所属）

#### エラーケース
- `DUPLICATE_EMAIL`: このメールアドレスは既に使用されています
- `INVALID_ROLE`: 無効なロールです
- `PERMISSION_DENIED`: メンバー作成権限がありません

---

### 4. チームメンバー更新

**Server Action**: `updateTeamMember`

#### リクエスト
```typescript
interface UpdateTeamMemberRequest {
  memberId: string
  name?: string
  role?: 'executive' | 'pm' | 'consultant'
  isActive?: boolean
}
```

#### レスポンス
```typescript
interface UpdateTeamMemberResponse {
  success: boolean
  member?: TeamMember
  error?: string
}
```

#### 処理フロー
1. 権限確認（エグゼクティブのみロール変更可能）
2. メンバー存在確認（同一組織）
3. 更新実行

#### ビジネスルール
- PMは名前と有効/無効の切り替えのみ可能
- エグゼクティブはロール変更も可能
- 自分自身のロールは変更不可

---

### 5. チームメンバー削除

**Server Action**: `deleteTeamMember`

#### リクエスト
```typescript
interface DeleteTeamMemberRequest {
  memberId: string
}
```

#### レスポンス
```typescript
interface DeleteTeamMemberResponse {
  success: boolean
  error?: string
}
```

#### 処理フロー
1. 権限確認（エグゼクティブのみ）
2. メンバー存在確認
3. 進行中プロジェクトの確認
4. 物理削除ではなく無効化（isActive = false）

#### エラーケース
- `MEMBER_HAS_ACTIVE_PROJECTS`: アクティブなプロジェクトに参加中です
- `CANNOT_DELETE_SELF`: 自分自身は削除できません

---

### 6. メンバー稼働率取得

**Server Action**: `getMemberUtilization`

#### リクエスト
```typescript
interface GetMemberUtilizationRequest {
  memberId?: string // 省略時は全メンバー
}
```

#### レスポンス
```typescript
interface MemberUtilization {
  memberId: string
  name: string
  totalAllocation: number
  projects: {
    projectId: string
    projectName: string
    allocation: number
    startDate: string
    endDate?: string
  }[]
}

interface GetMemberUtilizationResponse {
  utilizations: MemberUtilization[]
}
```

---

## プロジェクトチーム管理API

### 1. プロジェクトチームメンバー取得

**Server Action**: `getProjectTeamMembers`

#### リクエスト
```typescript
interface GetProjectTeamMembersRequest {
  projectId: string
}
```

#### レスポンス
```typescript
interface ProjectTeamMember {
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
  endDate?: string | null
}

interface GetProjectTeamMembersResponse {
  members: ProjectTeamMember[]
}
```

---

### 2. プロジェクトチーム統計取得

**Server Action**: `getTeamMemberStats`

#### リクエスト
```typescript
interface GetTeamMemberStatsRequest {
  projectId: string
}
```

#### レスポンス
```typescript
interface TeamStats {
  totalMembers: number
  totalAllocation: number
  averageAllocation: number
  roleDistribution: {
    pm: number
    lead: number
    senior: number
    consultant: number
    analyst: number
  }
}
```

---

### 3. プロジェクトメンバー追加

**Server Action**: `addTeamMember`

#### リクエスト
```typescript
interface AddTeamMemberRequest {
  projectId: string
  userId: string
  role: 'pm' | 'lead' | 'senior' | 'consultant' | 'analyst'
  allocation: number // 1-100
  startDate: Date
  endDate?: Date
}
```

#### バリデーション
- `allocation`: 1以上100以下の整数
- `endDate`: 開始日以降（指定時）
- `userId`: 組織内の有効なユーザー

#### ビジネスルール
- 同一ユーザーの重複追加は不可
- PMロールは複数設定可能

---

### 4. プロジェクトメンバー削除

**Server Action**: `removeTeamMember`

#### リクエスト
```typescript
interface RemoveTeamMemberRequest {
  memberId: string
}
```

---

### 5. 利用可能ユーザー取得

**Server Action**: `getAvailableUsers`

#### リクエスト
```typescript
interface GetAvailableUsersRequest {
  projectId: string
}
```

#### レスポンス
```typescript
interface AvailableUser {
  id: string
  name: string
  email: string
  role: {
    name: string
  }
  organization: {
    name: string
  }
  currentUtilization: number
}
```

#### 処理フロー
1. プロジェクトの現在のメンバーを取得
2. 組織内の全ユーザーから未参画メンバーを抽出
3. 各ユーザーの現在の稼働率を計算

---

## UI実装

### 稼働率ビジュアライゼーション
```typescript
const UtilizationBar = ({ utilization }: { utilization: number }) => {
  const getColor = (value: number) => {
    if (value > 100) return 'bg-red-500'
    if (value > 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  return (
    <div className="relative w-full h-6 bg-gray-200 rounded">
      <div
        className={cn('h-full rounded transition-all', getColor(utilization))}
        style={{ width: `${Math.min(utilization, 120)}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {utilization}%
      </span>
    </div>
  )
}
```

### ロール分布チャート
```typescript
const RoleDistributionChart = ({ distribution }: { distribution: RoleDistribution }) => {
  const data = Object.entries(distribution).map(([role, count]) => ({
    name: ROLE_LABELS[role],
    value: count
  }))
  
  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  )
}
```

## 実装例

### チームメンバー作成（app/actions/team.ts）
```typescript
'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { getCurrentUser } from './auth'

const createMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['executive', 'pm', 'consultant']),
  password: z.string().min(8)
})

export async function createTeamMember(
  data: z.infer<typeof createMemberSchema>
) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return { success: false, error: 'UNAUTHORIZED' }
  }
  
  if (!['executive', 'pm'].includes(currentUser.role.name)) {
    return { success: false, error: 'PERMISSION_DENIED' }
  }
  
  try {
    const validated = createMemberSchema.parse(data)
    
    // メール重複チェック
    const existing = await db.user.findUnique({
      where: { email: validated.email }
    })
    
    if (existing) {
      return { success: false, error: 'DUPLICATE_EMAIL' }
    }
    
    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(validated.password, 10)
    
    // ロール取得
    const role = await db.role.findUnique({
      where: { name: validated.role }
    })
    
    if (!role) {
      return { success: false, error: 'INVALID_ROLE' }
    }
    
    // ユーザー作成
    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        roleId: role.id,
        organizationId: currentUser.organization.id
      }
    })
    
    return {
      success: true,
      memberId: user.id
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'VALIDATION_ERROR' }
    }
    return { success: false, error: 'SERVER_ERROR' }
  }
}
```

## セキュリティ考慮事項

### アクセス制御
- 組織内のメンバーのみ表示
- 作成・更新・削除は権限に応じて制限
- クライアントユーザーの分離

### パスワード管理
- bcryptによるハッシュ化（saltラウンド: 10）
- パスワード最小長: 8文字
- パスワードリセット機能（将来実装）

### データ保護
- メールアドレスの一意性保証
- 物理削除ではなく論理削除
- 稼働率の過負荷警告