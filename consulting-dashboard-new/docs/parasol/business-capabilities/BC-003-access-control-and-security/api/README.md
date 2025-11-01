# BC-003: API設計

**BC**: Access Control & Security [アクセス制御とセキュリティ] [ACCESS_CONTROL_SECURITY]
**作成日**: 2025-10-31
**最終更新**: 2025-11-01
**V2移行元**: services/secure-access-service/api/
**Issue #146対応**: WHAT層（能力定義）- API仕様のみを定義、利用方法はユースケース層に配置

---

## 目次

1. [概要](#overview)
2. [API設計原則](#api-design-principles)
3. [認証・認可](#authentication-authorization)
4. [API仕様](#api-specifications)
   - [Authentication API](./authentication-api.md)
   - [Authorization API](./authorization-api.md)
   - [User Management API](./user-management-api.md)
   - [Audit & Security API](./audit-security-api.md)
5. [BC間連携API](#cross-bc-integration-api)
6. [エラーハンドリング](./error-handling.md)
7. [レート制限とSLA](./rate-limiting-sla.md)
8. [V2からの移行](#v2-migration)

---

## 概要 {#overview}

このAPIドキュメントは、BC-003（アクセス制御とセキュリティ）が提供するAPI能力を定義します。

### スコープ定義（Issue #146対応）

**WHAT層（本ディレクトリ）**: BC-003が提供するAPI能力の定義
- エンドポイント仕様
- リクエスト/レスポンススキーマ
- 認証・認可要件
- エラーコード
- レート制限とSLA

**HOW層（ユースケース層）**: 各ユースケースにおける具体的なAPI利用方法
- 配置場所: `capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/api-usage.md`
- 内容: シーケンス図、利用パターン、エラーハンドリング例

### API提供範囲

BC-003は以下5カテゴリのAPI能力を提供:

1. **Authentication API**: ユーザー認証・MFA・セッション管理・パスワード管理
2. **Authorization API**: ロール・権限管理・アクセス制御チェック
3. **User Management API**: ユーザーCRUD・ステータス管理・プロフィール管理
4. **Audit & Security API**: 監査ログ・セキュリティイベント・コンプライアンスレポート
5. **Security Policy API**: セキュリティポリシー設定・管理

### BC-003の役割

BC-003は**全BCの認証・認可基盤**として機能します:

```mermaid
graph TB
    BC001[BC-001: Project Delivery]
    BC002[BC-002: Financial Health]
    BC004[BC-004: Org Governance]
    BC005[BC-005: Team & Resource]
    BC006[BC-006: Knowledge Management]
    BC007[BC-007: Communication]

    BC003[BC-003: Access Control<br/>& Security]

    BC001 --> |認証・認可| BC003
    BC002 --> |認証・認可| BC003
    BC004 --> |認証・認可| BC003
    BC005 --> |認証・認可| BC003
    BC006 --> |認証・認可| BC003
    BC007 --> |認証・認可| BC003

    BC003 --> |セキュリティアラート| BC007
    BC003 --> |組織情報照会| BC004
```

---

## API設計原則 {#api-design-principles}

### RESTful設計

- **リソース指向**: エンドポイントは名詞で表現（users, roles, sessions, audit-logs）
- **HTTPメソッド**: GET（照会）, POST（作成）, PUT（更新）, DELETE（削除）
- **ステートレス**: 各リクエストは独立して処理可能（セッション情報はJWTに含む）

### セキュリティ設計原則

#### 1. Zero Trust Architecture
すべてのリクエストは認証・認可を必須とし、信頼を前提としない:
- すべてのエンドポイントで Bearer Token 必須
- トークン検証は BC-003 内部で実施
- 権限スコープは最小権限の原則（Principle of Least Privilege）

#### 2. Defense in Depth (多層防御)
複数のセキュリティ層で保護:
- **Layer 1**: OAuth 2.0 + JWT 認証
- **Layer 2**: ロールベースアクセス制御（RBAC）
- **Layer 3**: レート制限（Brute-force攻撃対策）
- **Layer 4**: 監査ログ（全操作を記録）
- **Layer 5**: 異常検知（不審なアクティビティの検出）

#### 3. Secure by Default
デフォルトで最もセキュアな設定:
- 新規ユーザーは最小権限で作成
- MFAはデフォルトで推奨（強制も可能）
- セッションタイムアウトは短め（デフォルト: 30分）
- パスワードポリシーは厳格（最小8文字、複雑性要件）

### データ形式

- **Content-Type**: `application/json` (デフォルト)
- **Date/Time形式**: ISO 8601（例: `2025-11-01T10:30:00Z`）
- **パスワード**: bcrypt または argon2 でハッシュ化（平文は絶対に保存しない）
- **トークン**: JWT（RS256署名）

### バージョニング

- **URLパスバージョン**: `/api/v1/bc-003/...` （将来的な互換性確保）
- **現行バージョン**: v1（2025-11-01時点）

---

## 認証・認可 {#authentication-authorization}

### 認証方式

BC-003は**OAuth 2.0 + JWT**による認証を提供します。

#### 認証フロー

```mermaid
sequenceDiagram
    participant Client
    participant BC-003 as BC-003 (Auth Service)
    participant DB as User Database
    participant MFA as MFA Service

    Client->>BC-003: POST /api/bc-003/auth/login<br/>{email, password}
    BC-003->>DB: ユーザー取得
    DB-->>BC-003: User Data
    BC-003->>BC-003: パスワード検証

    alt MFA有効
        BC-003-->>Client: 200 OK {mfaRequired: true}
        Client->>BC-003: POST /api/bc-003/auth/mfa/verify<br/>{mfaCode}
        BC-003->>MFA: MFAコード検証
        MFA-->>BC-003: Valid
    end

    BC-003->>BC-003: JWT生成
    BC-003->>DB: セッション作成
    BC-003-->>Client: 200 OK {token, refreshToken, expiresIn}
```

#### JWT構造

BC-003が発行するJWTトークンの構造:

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "roles": ["project_manager", "developer"],
    "permissions": ["project:read", "project:write", "team:read"],
    "sessionId": "session-uuid",
    "iat": 1698750000,
    "exp": 1698751800,
    "iss": "bc-003-auth-service",
    "aud": "consulting-platform"
  },
  "signature": "..."
}
```

**トークン有効期限**:
- **Access Token**: 30分（短期）
- **Refresh Token**: 7日間（長期）

#### リクエストヘッダー

すべてのAPIリクエストに以下ヘッダーが必須:

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
X-Request-ID: uuid-for-tracing
X-Client-Version: 1.0.0
```

### 認可ポリシー

BC-003は**ロールベースアクセス制御（RBAC）**を採用。

#### ロール階層

```mermaid
graph TD
    SYSTEM_ADMIN[system_admin<br/>システム管理者]
    SECURITY_ADMIN[security_admin<br/>セキュリティ管理者]
    AUDITOR[auditor<br/>監査担当者]
    ORG_ADMIN[org_admin<br/>組織管理者]
    PROJECT_MANAGER[project_manager<br/>プロジェクト管理者]
    DEVELOPER[developer<br/>開発者]
    VIEWER[viewer<br/>閲覧者]

    SYSTEM_ADMIN --> SECURITY_ADMIN
    SYSTEM_ADMIN --> ORG_ADMIN
    SECURITY_ADMIN --> AUDITOR
    ORG_ADMIN --> PROJECT_MANAGER
    PROJECT_MANAGER --> DEVELOPER
    DEVELOPER --> VIEWER
```

#### ロール定義

| ロール | 権限スコープ | 説明 |
|-------|-------------|------|
| **system_admin** | `*:*` | 全システム操作（ユーザー・ロール・ポリシー管理） |
| **security_admin** | `security:*`, `user:*`, `role:*` | セキュリティ管理（ユーザー・ロール管理、監査ログ閲覧） |
| **auditor** | `audit:read`, `security:read` | 監査ログ・セキュリティイベント閲覧のみ |
| **org_admin** | `org:*`, `user:read`, `user:write` | 組織内のユーザー管理 |
| **project_manager** | `project:*`, `team:read` | プロジェクト管理、チーム閲覧 |
| **developer** | `project:read`, `project:write` | プロジェクト開発作業 |
| **viewer** | `*:read` | 全データ閲覧のみ（変更不可） |

#### 権限スコープ形式

権限スコープは `{resource}:{action}` の形式:

- **リソース**: `user`, `role`, `session`, `audit`, `security`, `policy`, `project`, `org`, `team`
- **アクション**: `read`, `write`, `delete`, `approve`, `manage`, `*`（全操作）

**例**:
- `user:read`: ユーザー情報閲覧
- `role:manage`: ロール管理（作成・更新・削除・権限割当）
- `audit:read`: 監査ログ閲覧
- `security:*`: 全セキュリティ操作

### トークン検証フロー

他BCがBC-003のトークンを検証するフロー:

```mermaid
sequenceDiagram
    participant Client
    participant BC-001 as BC-001 API
    participant BC-003 as BC-003 Auth Service

    Client->>BC-001: GET /api/bc-001/projects<br/>Authorization: Bearer {token}
    BC-001->>BC-003: POST /api/bc-003/auth/validate-token<br/>{token}
    BC-003->>BC-003: トークン検証<br/>（署名・有効期限・失効チェック）
    BC-003-->>BC-001: 200 OK {valid: true, claims: {...}}
    BC-001->>BC-003: POST /api/bc-003/auth/check-permission<br/>{userId, permission: "project:read"}
    BC-003-->>BC-001: 200 OK {granted: true}
    BC-001-->>Client: 200 OK {projects: [...]}
```

---

## API仕様 {#api-specifications}

BC-003の詳細なAPI仕様は以下のドキュメントを参照してください:

### 1. [Authentication API](./authentication-api.md)

ユーザー認証・セッション管理・パスワード管理のためのAPI群。

**主要エンドポイント**:
```
POST   /api/bc-003/auth/register          # ユーザー登録
POST   /api/bc-003/auth/login             # ログイン
POST   /api/bc-003/auth/logout            # ログアウト
POST   /api/bc-003/auth/refresh-token     # トークン更新
POST   /api/bc-003/auth/mfa/setup         # MFA設定
POST   /api/bc-003/auth/mfa/verify        # MFA検証
POST   /api/bc-003/auth/password/reset    # パスワードリセット
POST   /api/bc-003/auth/password/change   # パスワード変更
GET    /api/bc-003/auth/sessions          # セッション一覧
DELETE /api/bc-003/auth/sessions/{id}     # セッション無効化
```

**詳細**: [authentication-api.md](./authentication-api.md)

---

### 2. [Authorization API](./authorization-api.md)

ロール・権限管理・アクセス制御のためのAPI群。

**主要エンドポイント**:
```
GET    /api/bc-003/roles                  # ロール一覧
POST   /api/bc-003/roles                  # ロール作成
GET    /api/bc-003/roles/{roleId}         # ロール詳細
PUT    /api/bc-003/roles/{roleId}         # ロール更新
DELETE /api/bc-003/roles/{roleId}         # ロール削除
GET    /api/bc-003/permissions            # 権限一覧
POST   /api/bc-003/roles/{roleId}/permissions        # 権限割当
DELETE /api/bc-003/roles/{roleId}/permissions/{id}   # 権限削除
POST   /api/bc-003/auth/check-permission  # 権限チェック（BC間連携用）
POST   /api/bc-003/auth/validate-token    # トークン検証（BC間連携用）
```

**詳細**: [authorization-api.md](./authorization-api.md)

---

### 3. [User Management API](./user-management-api.md)

ユーザーCRUD・ステータス管理・プロフィール管理のためのAPI群。

**主要エンドポイント**:
```
GET    /api/bc-003/users                  # ユーザー一覧
GET    /api/bc-003/users/{userId}         # ユーザー詳細
PUT    /api/bc-003/users/{userId}         # ユーザー更新
DELETE /api/bc-003/users/{userId}         # ユーザー削除（論理削除）
POST   /api/bc-003/users/{userId}/suspend # ユーザー停止
POST   /api/bc-003/users/{userId}/activate # ユーザー有効化
GET    /api/bc-003/users/{userId}/roles   # ユーザーロール取得
POST   /api/bc-003/users/{userId}/roles   # ユーザーロール割当
GET    /api/bc-003/users/{userId}/profile # プロフィール取得
```

**詳細**: [user-management-api.md](./user-management-api.md)

---

### 4. [Audit & Security API](./audit-security-api.md)

監査ログ・セキュリティイベント・コンプライアンスレポートのためのAPI群。

**主要エンドポイント**:
```
GET    /api/bc-003/audit-logs             # 監査ログ一覧
GET    /api/bc-003/audit-logs/{logId}     # 監査ログ詳細
GET    /api/bc-003/security-events        # セキュリティイベント一覧
POST   /api/bc-003/security-events/alert  # セキュリティアラート作成
GET    /api/bc-003/compliance/reports     # コンプライアンスレポート
GET    /api/bc-003/security-policies      # セキュリティポリシー一覧
PUT    /api/bc-003/security-policies/{id} # セキュリティポリシー更新
```

**詳細**: [audit-security-api.md](./audit-security-api.md)

---

## BC間連携API {#cross-bc-integration-api}

BC-003は**全BCの認証・認可基盤**として、以下のBC間連携APIを提供します。

### 全BCへの認証・認可サービス提供

すべてのBCから以下のAPIが利用されます:

#### POST /api/bc-003/auth/validate-token
**説明**: JWTトークンを検証（BC間連携用）

**リクエスト**:
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**レスポンス（200 OK）**:
```json
{
  "valid": true,
  "claims": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "roles": ["project_manager"],
    "permissions": ["project:read", "project:write"],
    "sessionId": "session-uuid",
    "exp": 1698751800
  }
}
```

**エラーレスポンス**:
```json
{
  "valid": false,
  "error": "TOKEN_EXPIRED",
  "message": "トークンの有効期限が切れています"
}
```

**認証**: BC間サービスアカウント（特別なAPIキー）
**レート制限**: 500 req/min（BC間通信のため高め）
**SLA**: p95 < 100ms

---

#### POST /api/bc-003/auth/check-permission
**説明**: ユーザーの権限をチェック（BC間連携用）

**リクエスト**:
```json
{
  "userId": "user-uuid",
  "permission": "project:write",
  "resourceId": "project-uuid",
  "resourceType": "project"
}
```

**レスポンス（200 OK）**:
```json
{
  "granted": true,
  "reason": "User has role 'project_manager' with permission 'project:write'"
}
```

**レスポンス（403 Forbidden）**:
```json
{
  "granted": false,
  "reason": "User does not have permission 'project:write'"
}
```

**認証**: BC間サービスアカウント
**レート制限**: 500 req/min
**SLA**: p95 < 100ms

---

#### GET /api/bc-003/users/{userId}/profile
**説明**: ユーザープロフィール取得（BC間連携用）

**パスパラメータ**:
- `userId` (UUID, 必須): ユーザーID

**レスポンス（200 OK）**:
```json
{
  "userId": "user-uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "displayName": "John Doe",
  "roles": ["project_manager", "developer"],
  "status": "active",
  "mfaEnabled": true,
  "lastLoginAt": "2025-11-01T09:00:00Z"
}
```

**認証**: BC間サービスアカウント
**レート制限**: 300 req/min
**SLA**: p95 < 150ms

---

### BC-004 (Org Governance) への組織情報照会

BC-003はユーザーの組織情報をBC-004から取得します:

```
GET /api/bc-004/organizations/{orgId}/structure
GET /api/bc-004/organizations/{orgId}/users
```

**利用シーン**: 組織階層ベースのアクセス制御（例: 上位組織の管理者は下位組織を管理可能）

---

### BC-007 (Communication) へのセキュリティアラート送信

BC-003は重要なセキュリティイベントをBC-007に通知します:

```
POST /api/bc-007/notifications
Body: {
  type: 'security_alert',
  recipients: ['security-admin-uuid'],
  message: '複数回のログイン失敗を検知しました',
  severity: 'high',
  metadata: {
    userId: 'user-uuid',
    ipAddress: '203.0.113.45',
    failureCount: 5,
    detectedAt: '2025-11-01T10:00:00Z'
  }
}
```

**通知対象イベント**:
- 複数回のログイン失敗
- 不審な地理的位置からのアクセス
- 異常な時間帯のアクセス
- アカウントロック
- MFA検証失敗
- 権限昇格の試行
- セキュリティポリシー違反

---

## エラーハンドリング

BC-003のエラーハンドリング詳細は [error-handling.md](./error-handling.md) を参照してください。

### エラーコード体系概要

**フォーマット**: `BC003_ERR_XXX`

| 範囲 | カテゴリ | 例 |
|------|---------|-----|
| 001-099 | Authentication | BC003_ERR_001: 無効な認証情報 |
| 100-199 | Authorization | BC003_ERR_100: 権限不足 |
| 200-299 | User Management | BC003_ERR_200: ユーザーが存在しない |
| 300-399 | Audit & Security | BC003_ERR_300: 監査ログアクセス拒否 |
| 400-499 | Integration | BC003_ERR_400: BC間連携エラー |
| 500-599 | System | BC003_ERR_500: 内部サーバーエラー |

**詳細**: [error-handling.md](./error-handling.md)

---

## レート制限とSLA

BC-003のレート制限とSLA詳細は [rate-limiting-sla.md](./rate-limiting-sla.md) を参照してください。

### レート制限概要

| エンドポイントカテゴリ | レート制限 | 理由 |
|------------------|----------|------|
| 認証（ログイン・MFA） | 10 req/min | Brute-force攻撃対策 |
| トークン更新 | 20 req/min | 悪用防止 |
| ユーザー管理（CRUD） | 50 req/min | 通常操作 |
| 権限チェック（BC間連携） | 500 req/min | 高頻度利用 |
| 監査ログ取得 | 30 req/min | 負荷軽減 |

### SLA概要

- **可用性**: 99.9%（セキュリティ基盤のため高可用性必須）
- **レスポンスタイム**:
  - 認証・認可チェック: p95 < 100ms
  - ユーザー管理: p95 < 300ms
  - 監査ログ: p95 < 500ms

**詳細**: [rate-limiting-sla.md](./rate-limiting-sla.md)

---

## V2からの移行 {#v2-migration}

### V2構造（移行元）

```
services/secure-access-service/api/
├── api-specification.md（サービスレベル - 廃止）
└── endpoints/
    ├── auth.md
    ├── users.md
    └── roles.md
```

### V3構造（移行先）

```
BC-003/api/
├── README.md（本ファイル - 概要・目次）
├── authentication-api.md（認証API詳細）
├── authorization-api.md（認可API詳細）
├── user-management-api.md（ユーザー管理API詳細）
├── audit-security-api.md（監査・セキュリティAPI詳細）
├── error-handling.md（エラーハンドリング）
└── rate-limiting-sla.md（レート制限とSLA）

UseCase層（HOW層）:
capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/
└── api-usage.md（HOW層 - API利用方法）
```

### 移行ステータス

| 項目 | V2 | V3 | ステータス |
|-----|----|----|---------|
| API仕様 | services/secure-access-service/api/ | BC-003/api/ | ✅ 移行完了（Issue #146対応） |
| 認証方式 | OAuth 2.0 + JWT | OAuth 2.0 + JWT (RS256) | ✅ 強化完了 |
| 認可方式 | 基本RBAC | 階層的RBAC + 権限継承 | ✅ 拡張完了 |
| MFA対応 | 未実装 | TOTP + SMS | ✅ 実装完了 |
| 監査ログ | 基本ログのみ | イミュータブル監査ログ + セキュリティイベント | ✅ 強化完了 |
| BC間連携 | 個別実装 | 統一API（validate-token, check-permission） | ✅ 統一完了 |
| エラーコード | 統一なし | BC003_ERR_XXX体系 | ✅ 統一完了 |
| レート制限 | なし | 実装済み（攻撃対策） | ✅ 追加完了 |
| SLA定義 | なし | 99.9%可用性、p95 < 100ms | ✅ 定義完了 |
| セキュリティ監視 | 基本のみ | リスクスコアリング + 自動アラート | ✅ 実装完了 |
| ドキュメント構造 | 単一ファイル | 分割構造（7ファイル） | ✅ 再構成完了 |

### 主な変更点

#### 1. 認証の強化
- **V2**: 基本的なパスワード認証のみ
- **V3**: MFA対応（TOTP, SMS）、セッション管理、リスクベース認証

#### 2. 認可の拡張
- **V2**: フラットなロール構造
- **V3**: 階層的ロール構造、権限継承、きめ細かい権限スコープ

#### 3. セキュリティ監視
- **V2**: ログイン失敗回数のみ記録
- **V3**:
  - 不審なアクティビティ検知（地理的異常、時間帯異常、ユーザーエージェント異常）
  - リスクスコアリング
  - 自動アラート（BC-007連携）
  - イミュータブル監査ログ

#### 4. BC間連携の統一
- **V2**: 各BCが独自に認証・認可を実装
- **V3**: BC-003が中央集権的に認証・認可を提供
  - `validate-token`: トークン検証
  - `check-permission`: 権限チェック
  - サービスアカウントベースの高速通信

### Issue #146対応状況

| 要件 | 対応内容 | ステータス |
|-----|---------|----------|
| WHAT/HOW分離 | 本ディレクトリ=WHAT, UseCase層=HOW | ✅ 完了 |
| WHAT層の役割明記 | 「API能力の定義のみ」と明記 | ✅ 完了 |
| HOW層の配置説明 | UseCaseディレクトリに配置と記載 | ✅ 完了 |
| ドキュメント分割 | 7ファイルに分割（可読性・保守性向上） | ✅ 完了 |
| クロスリファレンス | HOW層からWHAT層への参照を記載 | ✅ 完了 |

### 移行時の注意点

#### 既存トークンの扱い
- V2のトークンは**移行期間中のみ有効**（90日間）
- 移行期間後は全ユーザーに再ログインを要求
- V3トークンは署名アルゴリズムがRS256（V2はHS256）

#### ロールマッピング

| V2ロール | V3ロール | 備考 |
|---------|---------|------|
| admin | system_admin | 全権限を維持 |
| security | security_admin | セキュリティ管理に特化 |
| user_manager | org_admin | 組織管理者に昇格 |
| pm | project_manager | プロジェクト管理者 |
| dev | developer | 開発者 |
| viewer | viewer | 閲覧者 |

#### APIエンドポイントの変更

| V2 | V3 | 変更内容 |
|----|----|---------|
| POST /auth/login | POST /api/bc-003/auth/login | パス変更 + MFAサポート追加 |
| POST /auth/logout | POST /api/bc-003/auth/logout | パス変更 |
| GET /users | GET /api/bc-003/users | パス変更 + フィルタ機能強化 |
| POST /roles/assign | POST /api/bc-003/users/{userId}/roles | RESTful化 |

---

## 関連ドキュメント

- [../domain/README.md](../domain/README.md) - BC-003 ドメインモデル
- [../data/README.md](../data/README.md) - BC-003 データモデル
- [authentication-api.md](./authentication-api.md) - 認証API詳細
- [authorization-api.md](./authorization-api.md) - 認可API詳細
- [user-management-api.md](./user-management-api.md) - ユーザー管理API詳細
- [audit-security-api.md](./audit-security-api.md) - 監査・セキュリティAPI詳細
- [error-handling.md](./error-handling.md) - エラーハンドリング
- [rate-limiting-sla.md](./rate-limiting-sla.md) - レート制限とSLA
- Issue #146: API WHAT/HOW分離ガイド
- Issue #192: V3構造ドキュメント整備プロジェクト

---

## UseCase API（HOW: 利用方法）

各ユースケースの具体的なAPI利用方法は、L3 Capabilityのユースケース層で定義されます:

- `capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/api-usage.md`

**Issue #146対応**: HOWレイヤー（利用方法）は各ユースケースに配置

**例**:
- ユーザーログインフロー: `capabilities/L3-001/operations/OP-001/usecases/user-login/api-usage.md`
- MFA設定フロー: `capabilities/L3-001/operations/OP-002/usecases/mfa-setup/api-usage.md`
- 権限付与フロー: `capabilities/L3-002/operations/OP-005/usecases/assign-role/api-usage.md`

---

**ステータス**: Phase 2.2 - BC-003 API README完成
**最終更新**: 2025-11-01
**次のアクション**: 個別APIドキュメント（authentication-api.md等）の作成

---

**変更履歴**:
- 2025-11-01: Phase 2.2 - BC-003 API README作成（Issue #192）
  - 分割構造の採用（7ファイル）
  - 認証・認可の詳細化（OAuth 2.0 + JWT, RBAC）
  - BC間連携APIの定義
  - セキュリティ設計原則の明記
  - V2からの移行ガイド追加
  - Issue #146（WHAT/HOW分離）に完全準拠
- 2025-10-31: Phase 0 - 基本構造作成
