# セキュアアクセスサービス 統合仕様書

**バージョン**: v1.0.0
**最終更新日**: 2025-01-15

---

## 1. 概要

### サービスの役割
セキュアアクセスサービスは、認証・認可を提供する中核的なサービスであり、全サービスからの依存を受ける基盤サービスです。

### 統合パターン
- **サービス間認証**: JWT Bearer Token
- **イベント駆動**: ユーザー作成・ロール変更等をドメインイベントとして発行
- **同期API**: 認証・認可確認はRESTful APIで提供

---

## 2. 依存関係

### 依存先サービス一覧

#### 1. {通知サービス}

**依存タイプ**: イベント購読（非同期）
**クリティカリティ**: 中
**目的**: ユーザー登録やパスワードリセット時のメール送信

**フォールバック戦略**:
- 通知サービスが停止していても認証機能は継続
- イベントはメッセージキューに蓄積（後で再送）

---

### 依存元サービス一覧

#### 1. {プロジェクト成功支援サービス}

**依存タイプ**: 同期API（認証・認可）
**クリティカリティ**: 高
**目的**: プロジェクトAPIの認証・認可

**提供API**:
- `POST /auth/verify`: トークン検証
- `GET /users/{userId}`: ユーザー情報取得
- `GET /users/{userId}/permissions`: 権限取得

---

#### 2. {タレント最適化サービス}

**依存タイプ**: 同期API（認証・認可）
**クリティカリティ**: 高
**目的**: リソース管理APIの認証・認可

**提供API**:
- `POST /auth/verify`: トークン検証
- `GET /users/{userId}`: ユーザー情報取得
- `GET /users/{userId}/roles`: ロール取得

---

#### 3. {生産性可視化サービス}

**依存タイプ**: 同期API（認証・認可）
**クリティカリティ**: 高
**目的**: タイムシートAPIの認証・認可

**提供API**:
- `POST /auth/verify`: トークン検証
- `GET /users/{userId}`: ユーザー情報取得

---

#### 4. {ナレッジ共創サービス}

**依存タイプ**: 同期API（認証・認可）
**クリティカリティ**: 中
**目的**: ナレッジAPIの認証・認可

**提供API**:
- `POST /auth/verify`: トークン検証
- `GET /users/{userId}`: ユーザー情報取得

---

#### 5. {収益最適化サービス}

**依存タイプ**: 同期API（認証・認可）
**クリティカリティ**: 高
**目的**: 財務データAPIの認証・認可

**提供API**:
- `POST /auth/verify`: トークン検証
- `GET /users/{userId}/permissions`: 権限取得（財務データは特別な権限が必要）

---

#### 6. {コラボレーション促進サービス}

**依存タイプ**: イベント購読（非同期）
**クリティカリティ**: 中
**目的**: ユーザー関連通知の配信

**提供イベント**:
- `UserCreated`: 新規ユーザー作成
- `UserRoleChanged`: ロール変更
- `PasswordResetRequested`: パスワードリセット要求

---

## 3. ドメインイベント

### 提供するドメインイベント

#### イベント1: UserCreated

**概要**: 新規ユーザーが作成された
**発生タイミング**: ユーザー登録が完了した時

**ペイロード**:
```json
{
  "eventId": "evt_abc123",
  "eventType": "UserCreated",
  "occurredAt": "2025-01-15T10:00:00Z",
  "aggregateId": "user_xyz789",
  "data": {
    "userId": "user_xyz789",
    "email": "user@example.com",
    "displayName": "山田太郎",
    "organizationId": "org_123",
    "roles": ["consultant"]
  }
}
```

**購読者**:
| サービス | 処理内容 | 重要度 |
|---------|---------|--------|
| コラボレーション促進サービス | ウェルカムメール送信 | 中 |
| タレント最適化サービス | リソースプロファイル作成 | 低 |

---

#### イベント2: UserRoleChanged

**概要**: ユーザーのロールが変更された
**発生タイミング**: ロール追加または削除が完了した時

**ペイロード**:
```json
{
  "eventId": "evt_def456",
  "eventType": "UserRoleChanged",
  "occurredAt": "2025-01-15T11:00:00Z",
  "aggregateId": "user_xyz789",
  "data": {
    "userId": "user_xyz789",
    "changedBy": "admin_abc",
    "previousRoles": ["consultant"],
    "newRoles": ["consultant", "pm"],
    "changeType": "added"
  }
}
```

**購読者**:
| サービス | 処理内容 | 重要度 |
|---------|---------|--------|
| コラボレーション促進サービス | ロール変更通知 | 中 |
| プロジェクト成功支援サービス | プロジェクト権限の再計算 | 高 |

---

#### イベント3: PasswordResetRequested

**概要**: パスワードリセットが要求された
**発生タイミング**: パスワードリセットリクエストが承認された時

**ペイロード**:
```json
{
  "eventId": "evt_ghi789",
  "eventType": "PasswordResetRequested",
  "occurredAt": "2025-01-15T12:00:00Z",
  "aggregateId": "user_xyz789",
  "data": {
    "userId": "user_xyz789",
    "email": "user@example.com",
    "resetToken": "reset_token_abc123",
    "expiresAt": "2025-01-15T13:00:00Z"
  }
}
```

**購読者**:
| サービス | 処理内容 | 重要度 |
|---------|---------|--------|
| コラボレーション促進サービス | パスワードリセットメール送信 | 高 |

---

#### イベント4: UserLoggedIn

**概要**: ユーザーがログインした
**発生タイミング**: 認証が成功した時

**ペイロード**:
```json
{
  "eventId": "evt_jkl012",
  "eventType": "UserLoggedIn",
  "occurredAt": "2025-01-15T09:00:00Z",
  "aggregateId": "user_xyz789",
  "data": {
    "userId": "user_xyz789",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "loginMethod": "password"
  }
}
```

**購読者**:
| サービス | 処理内容 | 重要度 |
|---------|---------|--------|
| コラボレーション促進サービス | ログイン通知（異常検知時） | 低 |

---

### 購読するドメインイベント

**購読イベントなし**: セキュアアクセスサービスは基盤サービスのため、他サービスのイベントに依存しない

---

## 4. データ連携

### 他サービスへのAPI呼び出し

#### 呼び出し先: {コラボレーション促進サービス}

##### エンドポイント1: POST /notifications

**目的**: ユーザー登録時のウェルカムメール送信
**頻度**: ユーザー登録時（低頻度）

**リクエスト**:
```json
{
  "type": "email",
  "to": "user@example.com",
  "subject": "アカウント作成完了",
  "template": "user_welcome",
  "data": {
    "displayName": "山田太郎"
  }
}
```

**リトライ戦略**:
- 最大3回リトライ（指数バックオフ）
- 失敗時はログ記録のみ（ユーザー登録は継続）

---

### 他サービスからのAPI呼び出し

#### 呼び出し元: 全サービス（共通）

##### エンドポイント1: POST /auth/verify

**目的**: JWTトークンの検証とユーザー情報取得
**頻度**: 全APIリクエスト（高頻度）

**リクエストヘッダー**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**レスポンス**:
```json
{
  "valid": true,
  "userId": "user_xyz789",
  "email": "user@example.com",
  "roles": ["consultant"],
  "organizationId": "org_123"
}
```

**パフォーマンス要件**:
- レスポンス時間: 平均50ms以下
- キャッシュ戦略: Redisでトークン検証結果を5分間キャッシュ

---

##### エンドポイント2: GET /users/{userId}/permissions

**目的**: ユーザーの全権限を取得
**頻度**: 権限チェック時（中頻度）

**レスポンス**:
```json
{
  "userId": "user_xyz789",
  "permissions": [
    "project:read",
    "project:write",
    "task:read",
    "task:write"
  ]
}
```

**キャッシュ戦略**:
- Redisで権限情報を10分間キャッシュ
- ロール変更時はキャッシュを即座に無効化

---

## 5. 非同期イベント統合

### イベントバス仕様

**イベント配信方式**: In-Memory EventEmitter（現在）
**将来計画**: RabbitMQ/AWS SNS/SQS

### イベント発行パターン

```typescript
// ドメインイベント発行
eventBus.publish('UserCreated', {
  eventId: generateEventId(),
  eventType: 'UserCreated',
  occurredAt: new Date().toISOString(),
  aggregateId: userId,
  data: {
    userId,
    email,
    displayName,
    organizationId,
    roles
  }
})
```

### イベント購読パターン

```typescript
// 他サービスでの購読例
eventBus.subscribe('UserCreated', async (event) => {
  // ウェルカムメール送信処理
  await sendWelcomeEmail(event.data.email, event.data.displayName)
})
```

### イベント配信保証

**現在**: At-most-once（最大1回）
**将来**: At-least-once（最低1回）with Idempotency Key

---

## 6. 同期API統合

### APIゲートウェイパターン（将来）

```
[クライアント]
    ↓
[APIゲートウェイ]
    ↓ JWT検証
[セキュアアクセスサービス]
    ↓ 権限確認後
[各マイクロサービス]
```

### 認証フロー

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Gateway as APIゲートウェイ
    participant Auth as セキュアアクセスサービス
    participant Service as 各サービス

    Client->>Gateway: リクエスト + JWT
    Gateway->>Auth: POST /auth/verify
    Auth-->>Gateway: ユーザー情報
    Gateway->>Service: リクエスト + ユーザーコンテキスト
    Service-->>Gateway: レスポンス
    Gateway-->>Client: レスポンス
```

---

## 7. サービス間通信プロトコル

### RESTful API
- **形式**: JSON
- **認証**: JWT Bearer Token
- **エラーハンドリング**: 標準HTTPステータスコード

### イベント駆動
- **形式**: JSON
- **配信**: EventEmitter（現在）→ MessageQueue（将来）
- **順序保証**: なし（現在）→ パーティション別順序保証（将来）

---

## 8. エラーハンドリングと復旧

### サーキットブレーカーパターン（将来実装）

```typescript
// 通知サービス呼び出し時
const circuitBreaker = new CircuitBreaker(sendNotification, {
  timeout: 3000,
  errorThreshold: 50, // 50%エラー率で開放
  resetTimeout: 30000 // 30秒後に半開状態へ
})
```

### フォールバック戦略

| 依存サービス | 障害時の対応 |
|-------------|------------|
| 通知サービス | イベントをキューに保存、後で再送 |
| なし（他依存なし） | - |

---

## 9. パフォーマンス要件

### レスポンス時間
| API | 目標 | 上限 |
|-----|------|------|
| POST /login | 100ms | 200ms |
| POST /auth/verify | 50ms | 100ms |
| GET /users/{id} | 30ms | 50ms |

### スループット
- ログインAPI: 100リクエスト/秒
- トークン検証API: 1000リクエスト/秒

### キャッシュ戦略
- **トークン検証結果**: Redis 5分
- **ユーザー権限**: Redis 10分
- **ユーザープロファイル**: Redis 1時間

---

## 10. セキュリティ

### 通信暗号化
- **サービス間通信**: mTLS（将来）
- **データベース接続**: SSL/TLS

### 認証・認可
- **サービス間認証**: JWT（共有シークレット）
- **将来計画**: OAuth2 Client Credentials Flow

---

**ドキュメント管理**:
- 作成日: 2025-01-15
- 作成者: System
- レビュー状態: Draft
