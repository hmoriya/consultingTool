# API仕様: {サービス名}

**バージョン**: v1.0.0
**更新日**: YYYY-MM-DD
**作成者**: {作成者名}

## API概要

**目的**: {このAPIが提供する機能とビジネス価値}

**ベースURL**: `https://api.example.com/v1/{service-name}`

**認証方式**: JWT Bearer Token

**サポートする形式**:
- リクエスト: `application/json`
- レスポンス: `application/json`

**文字エンコーディング**: UTF-8

## 認証

### JWT認証

すべてのAPIリクエストには、HTTPヘッダーに有効なJWTトークンが必要です。

```http
Authorization: Bearer {jwt_token}
```

### トークン取得

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

### トークンリフレッシュ

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

## 共通仕様

### リクエストヘッダー

| ヘッダー名 | 必須 | 説明 |
|-----------|------|------|
| `Authorization` | ○ | Bearer {jwt_token} |
| `Content-Type` | ○ | application/json |
| `Accept` | ○ | application/json |
| `X-Request-ID` | × | リクエストトレース用UUID |

### レスポンス形式

#### 成功レスポンス

```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "message": "操作が成功しました",
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

#### エラーレスポンス

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報",
    "field": "エラーが発生したフィールド名（該当する場合）"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### ページネーション

リスト取得APIは以下の共通パラメータをサポートします。

**クエリパラメータ**:
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 20、最大: 100）
- `sort`: ソート順（例: `name_asc`, `createdAt_desc`）

**レスポンス形式**:
```json
{
  "success": true,
  "data": {
    "items": [/* データ配列 */],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### フィルタリング

リスト取得APIは以下のフィルタリングをサポートします。

**クエリパラメータ**:
- `filter[{field}]`: 完全一致フィルタ
- `search`: 全文検索（複数フィールド対象）
- `status`: ステータスフィルタ
- `createdFrom`: 作成日の開始日（ISO8601形式）
- `createdTo`: 作成日の終了日（ISO8601形式）

**例**:
```
GET /resources?filter[status]=active&search=keyword&page=2&limit=50
```

## エンドポイント定義

---

### リソース: {リソース名1}

#### GET /{resource}

**概要**: {リソース}の一覧を取得

**認証**: 必須

**権限**: `{resource}:read`

**リクエスト**:
```http
GET /{resource}?page=1&limit=20&sort=name_asc
Authorization: Bearer {jwt_token}
```

**クエリパラメータ**:
| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| page | integer | × | 1 | ページ番号 |
| limit | integer | × | 20 | 1ページあたりの件数（最大100） |
| sort | string | × | createdAt_desc | ソート順 |
| filter[status] | string | × | - | ステータスフィルタ |
| search | string | × | - | 検索キーワード |

**レスポンス（200 OK）**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**エラーレスポンス**:
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: 権限不足
- `500 Internal Server Error`: サーバーエラー

---

#### POST /{resource}

**概要**: 新しい{リソース}を作成

**認証**: 必須

**権限**: `{resource}:create`

**リクエスト**:
```http
POST /{resource}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "status": "active"
}
```

**リクエストボディ**:
| フィールド | 型 | 必須 | 制約 | 説明 |
|-----------|-----|------|------|------|
| name | string | ○ | 1-100文字 | 名称 |
| description | string | × | 最大500文字 | 説明 |
| status | string | × | active/inactive | ステータス（デフォルト: active） |

**バリデーションルール**:
- `name`: 必須、1文字以上100文字以内、ユニーク
- `description`: 任意、500文字以内
- `status`: active または inactive のいずれか

**レスポンス（201 Created）**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "{リソース}が作成されました"
}
```

**エラーレスポンス**:
- `400 Bad Request`: リクエストが不正
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: 権限不足
- `422 Unprocessable Entity`: バリデーションエラー
- `500 Internal Server Error`: サーバーエラー

**バリデーションエラー例（422）**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": [
      {
        "field": "name",
        "message": "名称は必須です"
      },
      {
        "field": "name",
        "message": "名称は100文字以内で入力してください"
      }
    ]
  }
}
```

---

#### GET /{resource}/{id}

**概要**: 特定の{リソース}の詳細を取得

**認証**: 必須

**権限**: `{resource}:read`

**リクエスト**:
```http
GET /{resource}/{id}
Authorization: Bearer {jwt_token}
```

**パスパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | uuid | ○ | リソースID |

**レスポンス（200 OK）**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "status": "active",
    "metadata": {
      // 追加のメタデータ
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "createdBy": {
      "id": "uuid",
      "name": "User Name"
    },
    "updatedBy": {
      "id": "uuid",
      "name": "User Name"
    }
  }
}
```

**エラーレスポンス**:
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: 権限不足
- `404 Not Found`: リソースが見つからない
- `500 Internal Server Error`: サーバーエラー

---

#### PUT /{resource}/{id}

**概要**: 特定の{リソース}を更新

**認証**: 必須

**権限**: `{resource}:update`

**リクエスト**:
```http
PUT /{resource}/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "status": "active"
}
```

**パスパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | uuid | ○ | リソースID |

**リクエストボディ**:
| フィールド | 型 | 必須 | 制約 | 説明 |
|-----------|-----|------|------|------|
| name | string | ○ | 1-100文字 | 名称 |
| description | string | × | 最大500文字 | 説明 |
| status | string | × | active/inactive | ステータス |

**レスポンス（200 OK）**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "{リソース}が更新されました"
}
```

**エラーレスポンス**:
- `400 Bad Request`: リクエストが不正
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: 権限不足
- `404 Not Found`: リソースが見つからない
- `422 Unprocessable Entity`: バリデーションエラー
- `500 Internal Server Error`: サーバーエラー

---

#### PATCH /{resource}/{id}

**概要**: 特定の{リソース}を部分更新

**認証**: 必須

**権限**: `{resource}:update`

**リクエスト**:
```http
PATCH /{resource}/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "status": "inactive"
}
```

**パスパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | uuid | ○ | リソースID |

**リクエストボディ**:
更新したいフィールドのみを送信（部分更新）

**レスポンス（200 OK）**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "status": "inactive",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "{リソース}が更新されました"
}
```

**エラーレスポンス**:
- `400 Bad Request`: リクエストが不正
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: 権限不足
- `404 Not Found`: リソースが見つからない
- `422 Unprocessable Entity`: バリデーションエラー
- `500 Internal Server Error`: サーバーエラー

---

#### DELETE /{resource}/{id}

**概要**: 特定の{リソース}を削除（論理削除）

**認証**: 必須

**権限**: `{resource}:delete`

**リクエスト**:
```http
DELETE /{resource}/{id}
Authorization: Bearer {jwt_token}
```

**パスパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | uuid | ○ | リソースID |

**レスポンス（200 OK）**:
```json
{
  "success": true,
  "message": "{リソース}が削除されました"
}
```

**エラーレスポンス**:
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: 権限不足
- `404 Not Found`: リソースが見つからない
- `409 Conflict`: 削除できない（依存関係がある）
- `500 Internal Server Error`: サーバーエラー

---

### リソース: {リソース名2}

{同様の形式で他のリソースのエンドポイントを定義}

---

## エラーコード一覧

| エラーコード | HTTPステータス | 説明 | 対処方法 |
|-------------|---------------|------|---------|
| `INVALID_REQUEST` | 400 | リクエストが不正 | リクエストフォーマットを確認 |
| `UNAUTHORIZED` | 401 | 認証が必要 | 有効なトークンを送信 |
| `TOKEN_EXPIRED` | 401 | トークンが期限切れ | トークンをリフレッシュ |
| `FORBIDDEN` | 403 | アクセス権限なし | 必要な権限を取得 |
| `NOT_FOUND` | 404 | リソースが見つからない | URLとIDを確認 |
| `METHOD_NOT_ALLOWED` | 405 | HTTPメソッドが許可されていない | 正しいメソッドを使用 |
| `CONFLICT` | 409 | リソースの競合 | リソースの状態を確認 |
| `VALIDATION_ERROR` | 422 | バリデーションエラー | 入力値を確認 |
| `RATE_LIMIT_EXCEEDED` | 429 | レート制限超過 | 時間をおいて再試行 |
| `INTERNAL_ERROR` | 500 | サーバー内部エラー | 管理者に連絡 |
| `SERVICE_UNAVAILABLE` | 503 | サービス利用不可 | 後で再試行 |

## レート制限

APIの利用には以下のレート制限が適用されます。

### 制限値
- **一般API**: 1000リクエスト/時間/ユーザー
- **認証API**: 10リクエスト/分/IPアドレス
- **重い処理**: 100リクエスト/時間/ユーザー

### レート制限ヘッダー
APIレスポンスには以下のヘッダーが含まれます。

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

### 制限超過時のレスポンス（429）
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "レート制限を超過しました",
    "details": "1時間後に再試行してください",
    "retryAfter": 3600
  }
}
```

## セキュリティ要件

### HTTPS必須
本番環境ではHTTPSのみをサポートします。HTTP接続は自動的にHTTPSにリダイレクトされます。

### CORS設定
許可されたオリジンからのリクエストのみを受け付けます。

**許可ヘッダー**:
- `Access-Control-Allow-Origin`: 設定されたドメインのみ
- `Access-Control-Allow-Methods`: GET, POST, PUT, PATCH, DELETE
- `Access-Control-Allow-Headers`: Authorization, Content-Type
- `Access-Control-Max-Age`: 86400

### 入力値のサニタイゼーション
すべての入力値は以下のチェックを通過します。
- SQLインジェクション対策
- XSS対策
- コマンドインジェクション対策

### APIキーの管理
- トークンは環境変数で管理
- 定期的なローテーション推奨
- トークンは絶対にGitにコミットしない

## バージョン管理

### バージョニング戦略
- **URL方式**: `/v1/`, `/v2/`でバージョン管理
- **後方互換性**: メジャーバージョン内は互換性を維持
- **非推奨化**: 新バージョンリリース後、旧バージョンは6ヶ月サポート

### バージョン情報
- **現在のバージョン**: v1.0.0
- **サポート中**: v1.x系
- **非推奨**: なし
- **廃止予定**: なし

### 変更履歴
- **v1.0.0** (2024-01-01): 初回リリース

## 実装例

### JavaScript/TypeScript

```typescript
// APIクライアント例
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// リクエストインターセプター（トークン追加）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // トークンリフレッシュまたはログイン画面へ遷移
    }
    return Promise.reject(error.response?.data || error)
  }
)

// 使用例
async function getResources() {
  try {
    const result = await api.get('/resources', {
      params: { page: 1, limit: 20 }
    })
    console.log(result.data.items)
  } catch (error) {
    console.error('Error:', error.error.message)
  }
}
```

### cURL

```bash
# リソース一覧取得
curl -X GET "https://api.example.com/v1/resources?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# 新規作成
curl -X POST "https://api.example.com/v1/resources" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Resource",
    "description": "Description here"
  }'
```

## テスト環境

### テストサーバー
- **URL**: `https://api-test.example.com/v1`
- **認証**: テスト用トークンを使用
- **データ**: 毎日リセット

### テストユーザー
```
email: test@example.com
password: test123
```

## サポート

### 技術サポート
- **メール**: api-support@example.com
- **ドキュメント**: https://docs.example.com
- **Slack**: #api-support

### SLA（Service Level Agreement）
- **稼働率**: 99.9%以上
- **レスポンスタイム**: 95%のリクエストが500ms以内
- **サポート対応**: 平日9:00-18:00（JST）
