# ナビゲーションAPI定義

**更新日: 2025-01-09**

## API概要

ナビゲーションシステムに関連するAPIの定義。主にユーザー情報とメニュー構成の取得に使用。

## エンドポイント一覧

### 1. ユーザー情報取得

**Server Action**: `getCurrentUser`

#### リクエスト
なし（セッションから取得）

#### レスポンス
```typescript
interface CurrentUserResponse {
  user?: {
    id: string
    name: string
    email: string
    role: {
      id: string
      name: string
      description: string
    }
    organization: {
      id: string
      name: string
      type: string
    }
  }
}
```

#### 処理フロー
1. セッション取得
2. ユーザー情報取得（ロール、組織を含む）
3. レスポンス整形

---

### 2. メニューアイテム取得

**Server Action**: `getMenuItems`

#### リクエスト
```typescript
interface GetMenuItemsRequest {
  userRole: string
}
```

#### レスポンス
```typescript
interface MenuItem {
  id: string
  label: string
  path: string
  icon: string
  badge?: number
}

interface GetMenuItemsResponse {
  items: MenuItem[]
}
```

#### 処理フロー
1. ユーザーロール確認
2. ロールベースのメニュー生成
3. 動的バッジ情報追加（将来実装）

#### メニュー構成ロジック
```typescript
const menuConfig = {
  executive: [
    { id: 'dashboard', label: 'ダッシュボード', path: '/dashboard/executive', icon: 'Home' },
    { id: 'projects', label: 'プロジェクト一覧', path: '/projects', icon: 'Folder' },
    { id: 'reports', label: 'レポート', path: '/reports', icon: 'BarChart' },
    { id: 'settings', label: '設定', path: '/settings', icon: 'Settings' },
    { id: 'help', label: 'ヘルプ', path: '/help', icon: 'HelpCircle' }
  ],
  pm: [
    { id: 'dashboard', label: 'ダッシュボード', path: '/dashboard/pm', icon: 'Home' },
    { id: 'projects', label: 'プロジェクト管理', path: '/projects', icon: 'Folder' },
    { id: 'team', label: 'チーム管理', path: '/team', icon: 'Users' },
    { id: 'reports', label: 'レポート', path: '/reports', icon: 'BarChart' },
    { id: 'settings', label: '設定', path: '/settings', icon: 'Settings' }
  ],
  consultant: [
    { id: 'dashboard', label: 'ダッシュボード', path: '/dashboard/consultant', icon: 'Home' },
    { id: 'tasks', label: 'タスク', path: '/tasks', icon: 'CheckSquare' },
    { id: 'timesheet', label: '工数入力', path: '/timesheet', icon: 'Clock' },
    { id: 'knowledge', label: 'ナレッジ', path: '/knowledge', icon: 'BookOpen' },
    { id: 'settings', label: '設定', path: '/settings', icon: 'Settings' }
  ],
  client: [
    { id: 'dashboard', label: 'ダッシュボード', path: '/dashboard/client', icon: 'Home' },
    { id: 'projects', label: 'プロジェクト', path: '/projects/client', icon: 'Folder' },
    { id: 'deliverables', label: '成果物', path: '/deliverables', icon: 'FileText' },
    { id: 'help', label: 'ヘルプ', path: '/help', icon: 'HelpCircle' }
  ]
}
```

---

### 3. 権限確認

**Server Action**: `checkPermission`

#### リクエスト
```typescript
interface CheckPermissionRequest {
  resource: string
  action: string
}
```

#### レスポンス
```typescript
interface CheckPermissionResponse {
  allowed: boolean
}
```

#### 処理フロー
1. 現在のユーザー取得
2. ユーザーロールの権限取得
3. 権限チェック

---

## UI状態管理API

### 1. サイドバー状態保存

**Client-side Function**: `saveSidebarState`

#### 実装
```typescript
export function saveSidebarState(isCollapsed: boolean) {
  localStorage.setItem('sidebar_state', isCollapsed ? 'collapsed' : 'expanded')
}
```

### 2. サイドバー状態取得

**Client-side Function**: `getSidebarState`

#### 実装
```typescript
export function getSidebarState(): boolean {
  const state = localStorage.getItem('sidebar_state')
  return state === 'collapsed'
}
```

## 実装例

### ユーザー情報取得（app/actions/user.ts）
```typescript
'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function getCurrentUser() {
  const sessionId = cookies().get('session')?.value
  
  if (!sessionId) {
    return { user: null }
  }
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        include: {
          role: true,
          organization: true
        }
      }
    }
  })
  
  if (!session || session.expiresAt < new Date()) {
    return { user: null }
  }
  
  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: {
        id: session.user.role.id,
        name: session.user.role.name,
        description: session.user.role.description
      },
      organization: {
        id: session.user.organization.id,
        name: session.user.organization.name,
        type: session.user.organization.type
      }
    }
  }
}
```

### Context Provider（app/contexts/user-context.tsx）
```typescript
'use client'

import { createContext, useContext, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: {
    id: string
    name: string
    description: string
  }
  organization: {
    id: string
    name: string
    type: string
  }
}

interface UserContextType {
  user: User | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true
})

export function UserProvider({ 
  children, 
  user 
}: { 
  children: ReactNode
  user: User | null 
}) {
  return (
    <UserContext.Provider value={{ user, isLoading: false }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
```