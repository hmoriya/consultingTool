# API ドキュメント概要

**更新日: 2025-01-09**

## 概要

コンサルティングダッシュボードのAPI定義ドキュメント。Next.js Server Actionsを使用したサーバーサイドAPIの仕様を記載。

## アーキテクチャ

### 技術スタック
- **フレームワーク**: Next.js 15.1.0 (App Router)
- **API実装**: Server Actions ("use server" directive)
- **データベース**: Prisma + SQLite
- **バリデーション**: Zod
- **認証**: カスタム実装（bcrypt + httpOnly Cookie）

### ディレクトリ構成
```
app/
├── actions/              # Server Actions
│   ├── auth.ts          # 認証API
│   ├── dashboard.ts     # ダッシュボードAPI
│   ├── projects.ts      # プロジェクト管理API
│   ├── tasks.ts         # タスク管理API
│   ├── milestones.ts    # マイルストーン管理API
│   ├── project-team.ts  # プロジェクトチーム管理API
│   ├── team.ts          # 組織チーム管理API
│   └── clients.ts       # クライアント管理API
└── lib/
    ├── db.ts            # Prismaクライアント
    └── schemas/         # Zodスキーマ定義
```

## API一覧

### 認証・認可
- [認証API](./auth-api.md) - ログイン、ログアウト、セッション管理
- [ナビゲーションAPI](./navigation-api.md) - ユーザー情報、メニュー構成、権限確認

### ダッシュボード
- [ダッシュボードAPI](./dashboard-api.md) - 各ロール向けKPI、統計情報

### プロジェクト管理
- [プロジェクトAPI](./projects-api.md) - プロジェクトCRUD、ステータス管理
- [タスクAPI](./tasks-api.md) - タスク管理、カンバンボード
- [マイルストーンAPI](./milestones-api.md) - マイルストーン管理、進捗追跡

### チーム管理
- [チームAPI](./team-api.md) - 組織メンバー管理、稼働率管理
- プロジェクトチームAPI（team-api.md内に統合） - プロジェクト別チーム管理

### クライアント管理
- [クライアントAPI](./clients-api.md) - クライアント組織の管理

## 共通仕様

### エラーハンドリング

#### エラーレスポンス形式
```typescript
interface ErrorResponse {
  success: false
  error: string
  details?: any
}
```

#### 共通エラーコード
- `UNAUTHORIZED`: 認証が必要です
- `PERMISSION_DENIED`: 権限がありません
- `NOT_FOUND`: リソースが見つかりません
- `VALIDATION_ERROR`: 入力値が無効です
- `DUPLICATE_ENTRY`: 重複エラー
- `SERVER_ERROR`: サーバーエラー

### 認証・認可

#### セッション管理
- httpOnly Cookieベース
- 有効期限: 30分（アクティビティで自動延長）
- セッショントークン: UUID v4

#### ロールベースアクセス制御（RBAC）
```typescript
const ROLES = {
  executive: 'エグゼクティブ',    // 全権限
  pm: 'プロジェクトマネージャー',  // プロジェクト管理権限
  consultant: 'コンサルタント',    // 限定的な権限
  client: 'クライアント'          // 閲覧のみ
}
```

### データ検証

#### Zodスキーマ例
```typescript
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().regex(/^[A-Z0-9-]+$/),
  budget: z.number().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional()
}).refine(data => {
  if (data.endDate) {
    return data.endDate >= data.startDate
  }
  return true
}, {
  message: "終了日は開始日以降である必要があります"
})
```

### 日付・時刻

- タイムゾーン: UTC（データベース保存時）
- フォーマット: ISO 8601
- フロントエンド表示: ユーザーのローカルタイムゾーン

### ページネーション（将来実装）

```typescript
interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
```

## セキュリティ

### 基本方針
1. **最小権限の原則**: 必要最小限の権限のみ付与
2. **ゼロトラスト**: すべてのリクエストで認証・認可を確認
3. **データ分離**: 組織・プロジェクト単位でのデータアクセス制御

### 実装済みセキュリティ対策
- パスワードハッシュ化（bcrypt、salt rounds: 10）
- SQLインジェクション対策（Prismaの自動エスケープ）
- XSS対策（React/Next.jsの自動エスケープ）
- CSRF対策（Next.jsの組み込み保護）
- httpOnly Cookie（セッション管理）

### 監査ログ
重要な操作はすべて監査ログに記録:
- ログイン/ログアウト
- データの作成/更新/削除
- 権限変更
- エラー発生

## パフォーマンス

### 最適化手法
1. **Select最適化**: 必要なフィールドのみ取得
2. **Include最適化**: N+1問題の回避
3. **集計関数**: Prismaの`_sum`, `_avg`, `_count`を活用
4. **インデックス**: 頻繁に検索されるカラムにインデックス設定

### キャッシュ戦略（クライアント側）
```typescript
// React Query使用例
const { data, isLoading } = useQuery({
  queryKey: ['projects'],
  queryFn: getProjects,
  staleTime: 5 * 60 * 1000,      // 5分
  cacheTime: 10 * 60 * 1000,     // 10分
  refetchOnWindowFocus: false
})
```

## 開発ガイドライン

### Server Action作成手順
1. `'use server'` ディレクティブを先頭に記載
2. 認証チェックを最初に実行
3. 入力値をZodでバリデーション
4. ビジネスロジックを実装
5. 適切なエラーハンドリング
6. 型安全なレスポンスを返却

### 命名規則
- Server Action: 動詞で始まる（get, create, update, delete）
- スキーマ: `${action}${Resource}Schema`
- 型定義: `${Action}${Resource}Request/Response`

### テスト（将来実装）
- 単体テスト: 各Server Actionのロジック
- 統合テスト: API間の連携
- E2Eテスト: ユーザーシナリオベース

## 今後の拡張予定

### 計画中の機能
- [ ] WebSocket対応（リアルタイム更新）
- [ ] ファイルアップロードAPI
- [ ] 通知システムAPI
- [ ] レポート生成API
- [ ] 外部システム連携API

### パフォーマンス改善
- [ ] Redis導入（セッション管理）
- [ ] データベース接続プーリング
- [ ] バックグラウンドジョブ処理
- [ ] CDN活用（静的アセット）