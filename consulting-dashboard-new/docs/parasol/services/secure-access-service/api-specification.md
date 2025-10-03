# セキュアアクセスサービス API仕様書

**バージョン**: v1.0.0
**最終更新日**: 2025-01-15

---

## 1. 概要

### サービス概要
セキュアアクセスサービスは、認証・認可・アクセス制御を担うコアサービスです。

### ベースURL
`http://localhost:3000/api/auth`

### 認証方式
JWT Bearer Token認証

**認証ヘッダー形式**:
```
Authorization: Bearer <JWT_TOKEN>
```

**トークン有効期限**:
- アクセストークン: 1時間
- リフレッシュトークン: 7日間

---

## 2. エンドポイント一覧

### 2.1 認証関連

#### POST /register

**概要**: 新規ユーザー登録

**認証**: 不要

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "displayName": "山田太郎",
  "organizationId": "org_123"
}
```

**レスポンス（201 Created）**:
```json
{
  "userId": "user_abc123",
  "email": "user@example.com",
  "displayName": "山田太郎",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

**エラーレスポンス**:
- `400 Bad Request`: バリデーションエラー
- `409 Conflict`: メールアドレス重複

---

#### POST /login

**概要**: ログイン（JWT発行）

**認証**: 不要

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**レスポンス（200 OK）**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh_token_xyz",
  "expiresIn": 3600,
  "user": {
    "id": "user_abc123",
    "email": "user@example.com",
    "displayName": "山田太郎",
    "roles": ["consultant"]
  }
}
```

**エラーレスポンス**:
- `401 Unauthorized`: 認証情報が無効
- `429 Too Many Requests`: ログイン試行回数超過

---

#### POST /logout

**概要**: ログアウト（トークン無効化）

**認証**: 必須

**権限**: 全ロール

**レスポンス（204 No Content）**

---

#### POST /refresh

**概要**: アクセストークン再発行

**認証**: 不要（リフレッシュトークンを使用）

**リクエストボディ**:
```json
{
  "refreshToken": "refresh_token_xyz"
}
```

**レスポンス（200 OK）**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

**エラーレスポンス**:
- `401 Unauthorized`: リフレッシュトークンが無効または期限切れ

---

#### POST /mfa/enable

**概要**: MFA（多要素認証）を有効化

**認証**: 必須

**権限**: 全ロール

**レスポンス（200 OK）**:
```json
{
  "qrCodeUrl": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP",
  "backupCodes": [
    "12345678",
    "87654321"
  ]
}
```

---

#### POST /mfa/verify

**概要**: MFA検証コード確認

**認証**: 必須

**リクエストボディ**:
```json
{
  "code": "123456"
}
```

**レスポンス（200 OK）**:
```json
{
  "verified": true
}
```

**エラーレスポンス**:
- `401 Unauthorized`: 検証コードが無効

---

### 2.2 ユーザー管理

#### GET /users

**概要**: ユーザー一覧取得

**認証**: 必須

**権限**: `user:read`

**クエリパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| page | number | ○ | ページ番号（1から開始） |
| limit | number | - | 1ページあたりの件数（デフォルト: 20） |
| organizationId | string | - | 組織IDでフィルタ |
| role | string | - | ロールでフィルタ |
| status | string | - | ステータスでフィルタ（active/suspended） |

**レスポンス（200 OK）**:
```json
{
  "users": [
    {
      "id": "user_abc123",
      "email": "user@example.com",
      "displayName": "山田太郎",
      "organizationId": "org_123",
      "roles": ["consultant"],
      "status": "active",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

#### GET /users/:userId

**概要**: ユーザー詳細取得

**認証**: 必須

**権限**: `user:read`

**パスパラメータ**:
- `userId`: ユーザーID

**レスポンス（200 OK）**:
```json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "displayName": "山田太郎",
  "organizationId": "org_123",
  "roles": ["consultant"],
  "permissions": ["project:read", "task:write"],
  "mfaEnabled": true,
  "status": "active",
  "lastLoginAt": "2025-01-15T09:00:00Z",
  "createdAt": "2025-01-10T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

**エラーレスポンス**:
- `404 Not Found`: ユーザーが存在しない

---

#### PATCH /users/:userId

**概要**: ユーザー情報更新

**認証**: 必須

**権限**: `user:write`

**リクエストボディ**:
```json
{
  "displayName": "山田次郎",
  "status": "suspended"
}
```

**レスポンス（200 OK）**:
```json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "displayName": "山田次郎",
  "status": "suspended",
  "updatedAt": "2025-01-15T11:00:00Z"
}
```

---

#### DELETE /users/:userId

**概要**: ユーザー削除（論理削除）

**認証**: 必須

**権限**: `user:delete`

**レスポンス（204 No Content）**

---

### 2.3 ロール・権限管理

#### GET /roles

**概要**: ロール一覧取得

**認証**: 必須

**権限**: `role:read`

**レスポンス（200 OK）**:
```json
{
  "roles": [
    {
      "id": "role_exec",
      "name": "executive",
      "displayName": "エグゼクティブ",
      "permissions": ["*"],
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ]
}
```

---

#### POST /users/:userId/roles

**概要**: ユーザーにロール付与

**認証**: 必須

**権限**: `role:assign`

**リクエストボディ**:
```json
{
  "roleId": "role_pm"
}
```

**レスポンス（200 OK）**:
```json
{
  "userId": "user_abc123",
  "roles": ["consultant", "pm"]
}
```

---

#### DELETE /users/:userId/roles/:roleId

**概要**: ユーザーからロール削除

**認証**: 必須

**権限**: `role:assign`

**レスポンス（204 No Content）**

---

### 2.4 組織管理

#### GET /organizations

**概要**: 組織一覧取得

**認証**: 必須

**権限**: `org:read`

**レスポンス（200 OK）**:
```json
{
  "organizations": [
    {
      "id": "org_123",
      "name": "株式会社サンプル",
      "parentId": null,
      "type": "client",
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ]
}
```

---

#### GET /organizations/:orgId

**概要**: 組織詳細取得

**認証**: 必須

**権限**: `org:read`

**レスポンス（200 OK）**:
```json
{
  "id": "org_123",
  "name": "株式会社サンプル",
  "parentId": null,
  "type": "client",
  "memberCount": 25,
  "createdAt": "2025-01-10T10:00:00Z"
}
```

---

### 2.5 監査ログ

#### GET /audit-logs

**概要**: 監査ログ取得

**認証**: 必須

**権限**: `audit:read`

**クエリパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| userId | string | - | ユーザーIDでフィルタ |
| action | string | - | アクション種別でフィルタ |
| startDate | string | - | 開始日時（ISO 8601形式） |
| endDate | string | - | 終了日時（ISO 8601形式） |

**レスポンス（200 OK）**:
```json
{
  "logs": [
    {
      "id": "log_xyz",
      "userId": "user_abc123",
      "action": "user.login",
      "resource": "auth",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-01-15T09:00:00Z"
    }
  ]
}
```

---

## 3. エラーコード一覧

| コード | HTTPステータス | メッセージ | 説明 |
|--------|---------------|-----------|------|
| `AUTH_001` | 401 | Invalid credentials | 認証情報が無効 |
| `AUTH_002` | 401 | Token expired | トークン期限切れ |
| `AUTH_003` | 401 | Invalid token | トークンが無効 |
| `AUTH_004` | 403 | Insufficient permissions | 権限不足 |
| `AUTH_005` | 429 | Too many login attempts | ログイン試行回数超過 |
| `USER_001` | 409 | Email already exists | メールアドレス重複 |
| `USER_002` | 404 | User not found | ユーザーが存在しない |
| `USER_003` | 400 | Invalid password format | パスワード形式が無効 |
| `MFA_001` | 401 | Invalid MFA code | MFA検証コードが無効 |
| `MFA_002` | 400 | MFA already enabled | MFAは既に有効 |

---

## 4. レート制限

### 制限値

**認証エンドポイント**:
- 10リクエスト/分（IPアドレス単位）
- 5ログイン失敗/時間（ユーザー単位）

**一般エンドポイント**:
- 100リクエスト/分（ユーザー単位）
- 1000リクエスト/時間（ユーザー単位）

### レスポンスヘッダー

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642251600
```

### 制限超過時のレスポンス

**ステータスコード**: 429 Too Many Requests

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "レート制限を超過しました",
    "retryAfter": 60
  }
}
```

---

## 5. セキュリティ

### パスワードポリシー

- 最小長: 8文字
- 必須要素: 大文字、小文字、数字、特殊文字
- 過去3世代のパスワード再利用禁止

### トークン管理

- JWT署名アルゴリズム: HS256
- リフレッシュトークンのローテーション: 有効
- トークン無効化: ログアウト時、パスワード変更時

### 監査ログ記録対象

- ログイン/ログアウト
- ロール・権限変更
- ユーザー作成/更新/削除
- MFA有効化/無効化

---

**ドキュメント管理**:
- 作成日: 2025-01-15
- 作成者: System
- レビュー状態: Draft
