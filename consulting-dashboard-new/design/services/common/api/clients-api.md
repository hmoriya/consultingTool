# クライアント管理 API定義

**更新日: 2025-01-09**

## API概要

クライアント組織の管理機能を提供するAPI。プロジェクト作成時のクライアント選択や統計情報の取得をサポート。

## エンドポイント一覧

### 1. クライアント一覧取得

**Server Action**: `getClients`

#### リクエスト
なし（ユーザー権限に基づいて自動フィルタリング）

#### レスポンス
```typescript
interface Client {
  id: string
  name: string
  projectCount: number
  activeProjectCount: number
  totalRevenue: number
}

interface GetClientsResponse {
  clients: Client[]
}
```

#### 処理フロー
1. ユーザー権限確認（エグゼクティブまたはPM）
2. クライアント組織一覧取得
3. 各クライアントのプロジェクト統計を集計
   - 全プロジェクト数
   - アクティブプロジェクト数
   - 総収益（予算の合計）

#### エラーケース
- `UNAUTHORIZED`: 認証が必要です
- `PERMISSION_DENIED`: クライアント管理権限がありません

---

### 2. クライアント作成

**Server Action**: `createClient`

#### リクエスト
```typescript
interface CreateClientRequest {
  name: string
}
```

#### レスポンス
```typescript
interface CreateClientResponse {
  success: boolean
  clientId?: string
  error?: string
}
```

#### バリデーション
- `name`: 必須、1文字以上、255文字以下

#### 処理フロー
1. ユーザー権限確認（エグゼクティブまたはPM）
2. 入力値バリデーション
3. 同名クライアントの重複チェック
4. クライアント組織作成（type: 'client'）

#### エラーケース
- `PERMISSION_DENIED`: クライアント作成権限がありません
- `DUPLICATE_NAME`: 同名のクライアントが既に存在します
- `VALIDATION_ERROR`: 入力値が無効です

---

### 3. クライアント更新

**Server Action**: `updateClient`

#### リクエスト
```typescript
interface UpdateClientRequest {
  clientId: string
  name: string
}
```

#### レスポンス
```typescript
interface UpdateClientResponse {
  success: boolean
  client?: {
    id: string
    name: string
  }
  error?: string
}
```

#### 処理フロー
1. ユーザー権限確認（エグゼクティブまたはPM）
2. クライアント存在確認
3. 同名クライアントの重複チェック
4. クライアント名更新

#### エラーケース
- `CLIENT_NOT_FOUND`: クライアントが見つかりません
- `DUPLICATE_NAME`: 同名のクライアントが既に存在します
- `PERMISSION_DENIED`: 更新権限がありません

---

### 4. クライアント削除

**Server Action**: `deleteClient`

#### リクエスト
```typescript
interface DeleteClientRequest {
  clientId: string
}
```

#### レスポンス
```typescript
interface DeleteClientResponse {
  success: boolean
  error?: string
}
```

#### 処理フロー
1. ユーザー権限確認（エグゼクティブのみ）
2. クライアント存在確認
3. 関連プロジェクトの確認
4. 関連プロジェクトがない場合のみ削除実行

#### ビジネスルール
- プロジェクトが紐づいているクライアントは削除不可
- 削除権限はエグゼクティブのみ

#### エラーケース
- `CLIENT_NOT_FOUND`: クライアントが見つかりません
- `HAS_PROJECTS`: このクライアントには関連するプロジェクトがあります
- `PERMISSION_DENIED`: 削除権限がありません

---

### 5. クライアント検索

**Server Action**: `searchClients`

#### リクエスト
```typescript
interface SearchClientsRequest {
  query: string
}
```

#### レスポンス
```typescript
interface SearchClient {
  id: string
  name: string
}

interface SearchClientsResponse {
  clients: SearchClient[]
}
```

#### 処理フロー
1. ユーザー権限確認
2. クライアント名で部分一致検索
3. 最大20件まで返却

#### 使用シーン
- プロジェクト作成時のクライアント選択ダイアログ
- クライアント管理画面の検索機能

---

## UI実装

### クライアント選択ダイアログ
```typescript
interface ClientSelectDialogProps {
  value: string
  onSelect: (clientId: string) => void
}

// コンボボックス形式で検索と選択を統合
const ClientSelectDialog = ({ value, onSelect }: ClientSelectDialogProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<SearchClient[]>([])
  
  const handleSearch = useCallback(async (query: string) => {
    if (query.length >= 2) {
      const result = await searchClients(query)
      setClients(result.clients)
    }
  }, [])
  
  // デバウンス処理で検索を最適化
  const debouncedSearch = useDebouncedCallback(handleSearch, 300)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ダイアログ内容 */}
    </Dialog>
  )
}
```

### クライアント統計カード
```typescript
interface ClientStatsCardProps {
  client: Client
}

const ClientStatsCard = ({ client }: ClientStatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              プロジェクト数
            </p>
            <p className="text-2xl font-bold">
              {client.projectCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              アクティブ
            </p>
            <p className="text-2xl font-bold text-green-600">
              {client.activeProjectCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              総収益
            </p>
            <p className="text-2xl font-bold">
              ¥{client.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## 実装例

### クライアント作成（app/actions/clients.ts）
```typescript
'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { getCurrentUser } from './auth'

const createClientSchema = z.object({
  name: z.string().min(1).max(255)
})

export async function createClient(
  data: z.infer<typeof createClientSchema>
) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'UNAUTHORIZED' }
  }
  
  if (!['executive', 'pm'].includes(user.role.name)) {
    return { success: false, error: 'PERMISSION_DENIED' }
  }
  
  try {
    const validated = createClientSchema.parse(data)
    
    // 重複チェック
    const existing = await db.organization.findFirst({
      where: {
        name: validated.name,
        type: 'client'
      }
    })
    
    if (existing) {
      return { success: false, error: 'DUPLICATE_NAME' }
    }
    
    const client = await db.organization.create({
      data: {
        name: validated.name,
        type: 'client'
      }
    })
    
    return {
      success: true,
      clientId: client.id
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
- 一覧表示・作成・更新: エグゼクティブとPM
- 削除: エグゼクティブのみ
- 検索: 認証済みユーザー全員

### データ保護
- クライアント削除時の関連データ保護
- 名前の一意性保証
- XSS対策（React自動エスケープ）

### 監査
- クライアント作成・更新・削除の監査ログ
- 操作者と日時の記録