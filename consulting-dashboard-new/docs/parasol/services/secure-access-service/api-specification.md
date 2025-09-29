# API仕様: セキュアアクセスサービス

## API概要
**目的**: 認証・認可・監査機能を提供し、システムへの安全なアクセスを実現
**バージョン**: v1.0.0
**ベースURL**: `https://api.example.com/v1/auth`

## 認証
**認証方式**: JWT Bearer Token
**ヘッダー**: `Authorization: Bearer {jwt_token}`

## 共通仕様

### リクエストヘッダー
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
X-Request-ID: {uuid}
```

### レスポンス形式
```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "field": "該当フィールド",
    "details": "詳細情報"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

## エンドポイント定義

### 認証 API

#### POST /auth/login
**概要**: ユーザーの認証を行い、アクセストークンを発行

**リクエスト**:
- **Method**: POST
- **URL**: `/auth/login`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "mfaCode": "123456"  // オプション: MFA有効時は必須
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "ユーザー名",
      "role": "Consultant",
      "permissions": ["read", "write"]
    }
  }
}
```

#### POST /auth/logout
**概要**: 現在のセッションを終了し、トークンを無効化

**リクエスト**:
- **Method**: POST
- **URL**: `/auth/logout`
- **Headers**: 認証必須

**レスポンス**:
```json
{
  "success": true,
  "message": "ログアウトしました"
}
```

#### POST /auth/refresh
**概要**: リフレッシュトークンを使用して新しいアクセストークンを取得

**リクエスト**:
- **Method**: POST
- **URL**: `/auth/refresh`
- **Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### ユーザー管理 API

#### GET /users
**概要**: ユーザー一覧を取得（管理者権限必須）

**リクエスト**:
- **Method**: GET
- **URL**: `/users`
- **Parameters**:
  - `page` (query, optional): ページ番号 (default: 1)
  - `limit` (query, optional): 件数 (default: 20, max: 100)
  - `role` (query, optional): ロールでフィルター
  - `status` (query, optional): active/inactive
  - `search` (query, optional): 名前またはメールで検索

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "ユーザー名",
        "role": "Consultant",
        "isActive": true,
        "lastLoginAt": "2024-01-01T00:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

#### POST /users
**概要**: 新規ユーザーを作成（管理者権限必須）

**リクエスト**:
- **Method**: POST
- **URL**: `/users`
- **Body**:
```json
{
  "email": "newuser@example.com",
  "name": "新規ユーザー",
  "password": "securePassword123",
  "role": "Consultant",
  "organizationId": "uuid"
}
```

#### GET /users/{userId}
**概要**: 特定ユーザーの詳細情報を取得

#### PUT /users/{userId}
**概要**: ユーザー情報を更新

#### DELETE /users/{userId}
**概要**: ユーザーを削除（論理削除）

### 権限管理 API

#### GET /permissions
**概要**: 権限一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/permissions`
- **Parameters**:
  - `role` (query, optional): ロールでフィルター

**レスポンス**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "resource": "projects",
      "action": "read",
      "role": "Consultant",
      "description": "プロジェクト読み取り権限"
    }
  ]
}
```

#### POST /permissions/assign
**概要**: ユーザーに権限を付与

**リクエスト**:
- **Method**: POST
- **URL**: `/permissions/assign`
- **Body**:
```json
{
  "userId": "uuid",
  "permissions": [
    {
      "resource": "projects",
      "actions": ["read", "write", "delete"]
    }
  ]
}
```

#### POST /permissions/revoke
**概要**: ユーザーから権限を取消

### 監査ログ API

#### GET /audit-logs
**概要**: 監査ログを取得（管理者権限必須）

**リクエスト**:
- **Method**: GET
- **URL**: `/audit-logs`
- **Parameters**:
  - `userId` (query, optional): ユーザーIDでフィルター
  - `action` (query, optional): アクションでフィルター
  - `dateFrom` (query, optional): 開始日時
  - `dateTo` (query, optional): 終了日時
  - `page` (query, optional): ページ番号
  - `limit` (query, optional): 件数

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "action": "LOGIN_SUCCESS",
        "resource": "auth",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "details": {
          "method": "password",
          "mfaUsed": true
        },
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1000,
      "pages": 50
    }
  }
}
```

### MFA（多要素認証）API

#### POST /mfa/setup
**概要**: MFAを設定

**リクエスト**:
- **Method**: POST
- **URL**: `/mfa/setup`
- **Body**:
```json
{
  "type": "totp" // totp, sms, email
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,...",
    "backupCodes": [
      "XXXX-XXXX",
      "YYYY-YYYY"
    ]
  }
}
```

#### POST /mfa/verify
**概要**: MFAコードを検証

#### POST /mfa/disable
**概要**: MFAを無効化

## エラーコード

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| AUTH_FAILED | 401 | 認証失敗 |
| INVALID_CREDENTIALS | 401 | メールまたはパスワードが不正 |
| ACCOUNT_LOCKED | 403 | アカウントがロックされている |
| PERMISSION_DENIED | 403 | アクセス権限なし |
| USER_NOT_FOUND | 404 | ユーザーが見つからない |
| VALIDATION_ERROR | 422 | 入力値が不正 |
| MFA_REQUIRED | 428 | 多要素認証が必要 |
| TOO_MANY_ATTEMPTS | 429 | ログイン試行回数超過 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

## レート制限
- **認証エンドポイント**: 5リクエスト/分
- **一般API**: 100リクエスト/分
- **管理API**: 50リクエスト/分
- **制限時のレスポンス**: 429 Too Many Requests
- **制限情報ヘッダー**:
  - `X-RateLimit-Limit`: 制限数
  - `X-RateLimit-Remaining`: 残り回数
  - `X-RateLimit-Reset`: リセット時刻

## Webhook
**イベント通知**: 重要なセキュリティイベント発生時にWebhookで通知
- ログイン成功/失敗
- 権限変更
- アカウントロック
- 不審なアクティビティ検出

## バージョン管理
- **現在**: v1.0.0
- **サポート**: v1.x系を2年間サポート
- **廃止予定**: なし
- **バージョンヘッダー**: `X-API-Version: 1.0.0`