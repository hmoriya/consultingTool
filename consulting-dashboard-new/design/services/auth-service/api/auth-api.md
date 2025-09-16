# 認証API定義

**更新日: 2025-01-09**

## API概要

認証・認可に関するAPIエンドポイントの定義。Next.js Server Actionsを使用して実装。

## エンドポイント一覧

### 1. ログイン

**Server Action**: `login`

#### リクエスト
```typescript
interface LoginRequest {
  email: string
  password: string
}
```

#### レスポンス
```typescript
interface LoginResponse {
  success: boolean
  error?: string
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}
```

#### バリデーション（Zod）
```typescript
const LoginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください')
})
```

#### 処理フロー
1. 入力値バリデーション
2. ユーザー検索（email）
3. パスワード検証（bcrypt.compare）
4. セッション作成
5. Cookieセット（httpOnly）
6. 監査ログ記録

#### エラーケース
- `INVALID_CREDENTIALS`: 認証情報が無効
- `USER_NOT_FOUND`: ユーザーが存在しない
- `USER_INACTIVE`: ユーザーが無効化されている
- `VALIDATION_ERROR`: 入力値エラー

---

### 2. ログアウト

**Server Action**: `logout`

#### リクエスト
なし（セッションから取得）

#### レスポンス
```typescript
interface LogoutResponse {
  success: boolean
}
```

#### 処理フロー
1. 現在のセッション取得
2. セッション削除
3. Cookie削除
4. 監査ログ記録

---

### 3. セッション確認

**Server Action**: `getSession`

#### リクエスト
なし（Cookieから取得）

#### レスポンス
```typescript
interface SessionResponse {
  user?: {
    id: string
    name: string
    email: string
    role: string
    organization: string
  }
  expires?: string
}
```

#### 処理フロー
1. CookieからセッショントークンID取得
2. セッション検証
3. 有効期限チェック
4. ユーザー情報取得

---

### 4. セッション延長

**Server Action**: `refreshSession`

#### リクエスト
なし（セッションから取得）

#### レスポンス
```typescript
interface RefreshSessionResponse {
  success: boolean
  expires?: string
}
```

#### 処理フロー
1. 現在のセッション取得
2. 有効期限更新（+30分）
3. Cookie更新

---

## セッション管理

### Cookie仕様
```typescript
const sessionCookie = {
  name: 'session',
  value: sessionId,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 30 // 30分
}
```

### セッションデータ構造
```typescript
interface Session {
  id: string
  userId: string
  token: string
  ipAddress: string
  userAgent: string
  expiresAt: Date
  createdAt: Date
}
```

## セキュリティ対策

### パスワードハッシュ化
```typescript
// 登録時
const hashedPassword = await bcrypt.hash(password, 10)

// 検証時
const isValid = await bcrypt.compare(password, user.password)
```

### CSRF対策
Next.jsの組み込みCSRF保護を使用

### レート制限（将来実装）
- ログイン試行: 5回/5分
- パスワードリセット: 3回/時間

### 監査ログ
```typescript
await createAuditLog({
  userId: user.id,
  action: 'LOGIN',
  resource: 'auth',
  ipAddress: request.headers['x-forwarded-for'],
  userAgent: request.headers['user-agent']
})
```

## 実装例

### Server Action（app/actions/auth.ts）
```typescript
'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { LoginSchema } from '@/lib/schemas/auth'

export async function login(data: z.infer<typeof LoginSchema>) {
  try {
    // バリデーション
    const validated = LoginSchema.parse(data)
    
    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: { role: true, organization: true }
    })
    
    if (!user || !user.isActive) {
      return { success: false, error: 'INVALID_CREDENTIALS' }
    }
    
    // パスワード検証
    const validPassword = await bcrypt.compare(validated.password, user.password)
    if (!validPassword) {
      return { success: false, error: 'INVALID_CREDENTIALS' }
    }
    
    // セッション作成
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30分
      }
    })
    
    // Cookie設定
    cookies().set('session', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 30
    })
    
    // 最終ログイン更新
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name
      }
    }
  } catch (error) {
    return { success: false, error: 'SERVER_ERROR' }
  }
}
```