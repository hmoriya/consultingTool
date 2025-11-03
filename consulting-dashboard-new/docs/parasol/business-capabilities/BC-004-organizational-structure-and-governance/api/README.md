# BC-004: API設計

**BC**: Organizational Structure & Governance [組織構造とガバナンス] [ORGANIZATIONAL_STRUCTURE_GOVERNANCE]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/secure-access-service/api/（組織管理APIのみ）

---

## 目次

1. [概要](#overview)
2. [認証・認可](#authentication)
3. [API一覧](#api-list)
4. [共通仕様](#common-spec)
5. [エラーハンドリング](#error-handling)
6. [BC間連携](#bc-integration)
7. [レート制限・SLA](#rate-limiting-sla)

詳細APIドキュメント：
- [organization-api.md](organization-api.md) - 組織・組織単位管理API
- [team-api.md](team-api.md) - チーム管理API
- [governance-api.md](governance-api.md) - ガバナンスポリシーAPI

---

## 概要 {#overview}

BC-004は組織構造とガバナンスを管理するAPIを提供します。

### 主要機能

1. **組織管理**
   - 組織の作成・更新・削除
   - 組織階層の可視化
   - 組織再編の実行

2. **組織単位管理**
   - 部門・事業部・課の管理
   - 階層構造の維持（閉包テーブル）
   - メンバー配置

3. **チーム管理**
   - プロジェクトチーム・機能チームの管理
   - チームメンバーのアサイン率管理
   - チームロール管理

4. **ガバナンス**
   - 組織ポリシーの定義
   - ポリシー評価
   - コンプライアンスチェック

### Issue #146対応

**WHAT/HOW分離原則**:
- **WHAT（能力定義）**: 本ドキュメント - APIが提供する機能と仕様
- **HOW（利用方法）**: 別途ユースケースドキュメントで定義

---

## 認証・認可 {#authentication}

### 認証方式

BC-004 APIは**BC-003 (Access Control & Security)** の認証基盤を使用します。

```http
Authorization: Bearer <access_token>
```

- **トークン形式**: JWT (RS256)
- **有効期限**: 30分
- **リフレッシュ**: `/api/bc-003/auth/refresh-token`

### 必要な権限

| API | 必要な権限 | 説明 |
|-----|----------|------|
| `GET /organizations` | `organization:read` | 組織一覧取得 |
| `POST /organizations` | `organization:write` | 組織作成 |
| `PUT /organizations/{id}` | `organization:write` | 組織更新 |
| `DELETE /organizations/{id}` | `organization:delete` | 組織削除 |
| `GET /organizations/{id}/units` | `organization:read` | 組織単位一覧取得 |
| `POST /organizations/{id}/units` | `organization_unit:write` | 組織単位作成 |
| `POST /organizations/{id}/restructure` | `organization:restructure` | 組織再編（高権限） |
| `GET /teams` | `team:read` | チーム一覧取得 |
| `POST /teams` | `team:write` | チーム作成 |
| `POST /teams/{id}/members` | `team:write` | チームメンバー追加 |
| `GET /governance-policies` | `governance:read` | ポリシー一覧取得 |
| `POST /governance-policies` | `governance:write` | ポリシー作成（管理者のみ） |

### ロール推奨設定

```
system_admin
├── organization:* (全権限)
└── governance:* (全権限)

org_admin
├── organization:read, organization:write
├── organization_unit:read, organization_unit:write
├── team:read, team:write
└── governance:read

project_manager
├── organization:read
├── organization_unit:read
├── team:read, team:write (自チームのみ)
└── governance:read

member
├── organization:read
├── organization_unit:read
└── team:read
```

---

## API一覧 {#api-list}

### 組織管理API

```
POST   /api/bc-004/organizations
GET    /api/bc-004/organizations
GET    /api/bc-004/organizations/{orgId}
PUT    /api/bc-004/organizations/{orgId}
DELETE /api/bc-004/organizations/{orgId}
POST   /api/bc-004/organizations/{orgId}/archive
POST   /api/bc-004/organizations/{orgId}/restore
GET    /api/bc-004/organizations/{orgId}/structure
POST   /api/bc-004/organizations/{orgId}/restructure
```

### 組織単位管理API

```
POST   /api/bc-004/organizations/{orgId}/units
GET    /api/bc-004/organizations/{orgId}/units
GET    /api/bc-004/organizations/{orgId}/units/{unitId}
PUT    /api/bc-004/organizations/{orgId}/units/{unitId}
DELETE /api/bc-004/organizations/{orgId}/units/{unitId}
PUT    /api/bc-004/organizations/{orgId}/units/{unitId}/parent
GET    /api/bc-004/organizations/{orgId}/units/{unitId}/children
GET    /api/bc-004/organizations/{orgId}/units/{unitId}/ancestors
GET    /api/bc-004/organizations/{orgId}/units/{unitId}/descendants
POST   /api/bc-004/organizations/{orgId}/units/{unitId}/members
GET    /api/bc-004/organizations/{orgId}/units/{unitId}/members
DELETE /api/bc-004/organizations/{orgId}/units/{unitId}/members/{memberId}
```

### チーム管理API

```
POST   /api/bc-004/teams
GET    /api/bc-004/teams
GET    /api/bc-004/teams/{teamId}
PUT    /api/bc-004/teams/{teamId}
DELETE /api/bc-004/teams/{teamId}
POST   /api/bc-004/teams/{teamId}/disband
POST   /api/bc-004/teams/{teamId}/members
GET    /api/bc-004/teams/{teamId}/members
DELETE /api/bc-004/teams/{teamId}/members/{memberId}
PUT    /api/bc-004/teams/{teamId}/members/{memberId}/allocation
PUT    /api/bc-004/teams/{teamId}/leader
GET    /api/bc-004/users/{userId}/teams
GET    /api/bc-004/users/{userId}/allocation-summary
```

### ガバナンスポリシーAPI

```
POST   /api/bc-004/governance-policies
GET    /api/bc-004/governance-policies
GET    /api/bc-004/governance-policies/{policyId}
PUT    /api/bc-004/governance-policies/{policyId}
DELETE /api/bc-004/governance-policies/{policyId}
POST   /api/bc-004/governance-policies/{policyId}/activate
POST   /api/bc-004/governance-policies/{policyId}/deactivate
POST   /api/bc-004/governance-policies/{policyId}/rules
DELETE /api/bc-004/governance-policies/{policyId}/rules/{ruleId}
POST   /api/bc-004/governance-policies/{policyId}/evaluate
GET    /api/bc-004/governance-policies/applicable
```

---

## 共通仕様 {#common-spec}

### リクエストヘッダー

```http
Content-Type: application/json
Authorization: Bearer <access_token>
X-Request-ID: <uuid>
Accept-Language: ja
```

### レスポンス形式

#### 成功レスポンス

```json
{
  "data": {
    "id": "uuid",
    "name": "組織名",
    ...
  },
  "meta": {
    "timestamp": "2025-11-03T12:00:00Z",
    "requestId": "req-uuid"
  }
}
```

#### ページネーション

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 150,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false
  },
  "meta": {
    "timestamp": "2025-11-03T12:00:00Z",
    "requestId": "req-uuid"
  }
}
```

#### エラーレスポンス

```json
{
  "error": {
    "code": "BC004_ERR_101",
    "message": "Organization not found",
    "details": {
      "organizationId": "org-uuid"
    }
  },
  "meta": {
    "timestamp": "2025-11-03T12:00:00Z",
    "requestId": "req-uuid"
  }
}
```

### クエリパラメータ

#### フィルタリング

```
GET /api/bc-004/organizations?status=active&type=headquarters
GET /api/bc-004/teams?organizationId=org-uuid&teamType=project_team
```

#### ソート

```
GET /api/bc-004/organizations?sort=name:asc
GET /api/bc-004/teams?sort=createdAt:desc,name:asc
```

#### ページネーション

```
GET /api/bc-004/organizations?page=1&pageSize=50
```

#### フィールド選択

```
GET /api/bc-004/organizations?fields=id,name,code
```

---

## エラーハンドリング {#error-handling}

### エラーコード体系

```
BC004_ERR_XXX
├── 001-099: 組織管理
├── 100-199: 組織単位管理
├── 200-299: チーム管理
├── 300-399: ガバナンスポリシー
├── 400-499: BC間連携エラー
└── 500-599: システムエラー
```

### 主要エラーコード

#### 組織管理（001-099）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC004_ERR_001 | 404 | Organization not found |
| BC004_ERR_002 | 409 | Organization code already exists |
| BC004_ERR_003 | 400 | Invalid organization type |
| BC004_ERR_004 | 403 | Organization is archived |
| BC004_ERR_005 | 409 | Cannot delete organization with active units |

#### 組織単位管理（100-199）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC004_ERR_101 | 404 | Organization unit not found |
| BC004_ERR_102 | 400 | Invalid parent unit |
| BC004_ERR_103 | 400 | Circular reference detected |
| BC004_ERR_104 | 400 | Maximum hierarchy depth exceeded (max: 10) |
| BC004_ERR_105 | 409 | Unit path already exists |
| BC004_ERR_106 | 400 | Cannot delete unit with children |
| BC004_ERR_107 | 404 | Member not found in unit |
| BC004_ERR_108 | 409 | Member already exists in unit |

#### チーム管理（200-299）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC004_ERR_201 | 404 | Team not found |
| BC004_ERR_202 | 400 | Team leader is required |
| BC004_ERR_203 | 400 | Leader must be a team member |
| BC004_ERR_204 | 409 | Member already exists in team |
| BC004_ERR_205 | 404 | Team member not found |
| BC004_ERR_206 | 400 | Invalid allocation rate (must be 0.0-1.0) |
| BC004_ERR_207 | 409 | Team is disbanded |
| BC004_ERR_208 | 400 | Cannot disband team with active projects |
| BC004_ERR_209 | 400 | User over-allocated (warning) |

#### ガバナンスポリシー（300-399）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC004_ERR_301 | 404 | Governance policy not found |
| BC004_ERR_302 | 400 | Policy must have at least one rule |
| BC004_ERR_303 | 400 | Invalid policy scope |
| BC004_ERR_304 | 400 | Invalid policy priority (must be 1-1000) |
| BC004_ERR_305 | 404 | Policy rule not found |
| BC004_ERR_306 | 409 | Policy already exists for scope |
| BC004_ERR_307 | 400 | Policy evaluation failed |

#### BC間連携エラー（400-499）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC004_ERR_401 | 404 | User not found (BC-003) |
| BC004_ERR_402 | 403 | Insufficient permissions (BC-003) |
| BC004_ERR_403 | 500 | BC-003 service unavailable |

#### システムエラー（500-599）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC004_ERR_500 | 500 | Internal server error |
| BC004_ERR_501 | 503 | Service temporarily unavailable |
| BC004_ERR_502 | 504 | Request timeout |

### エラーレスポンス例

```json
{
  "error": {
    "code": "BC004_ERR_103",
    "message": "Circular reference detected in organization hierarchy",
    "details": {
      "unitId": "unit-123",
      "parentUnitId": "unit-456",
      "circularPath": ["unit-123", "unit-456", "unit-789", "unit-123"]
    }
  },
  "meta": {
    "timestamp": "2025-11-03T12:00:00Z",
    "requestId": "req-abc-123"
  }
}
```

---

## BC間連携 {#bc-integration}

### BC-003 (Access Control & Security) への依存

BC-004は認証・認可をBC-003に完全依存します。

#### トークン検証

```typescript
// BC-004の全APIでトークン検証を実施
const tokenValidation = await fetch('/api/bc-003/auth/validate-token', {
  method: 'POST',
  headers: {'Authorization': `Bearer ${token}`},
  body: JSON.stringify({token})
});

if (!tokenValidation.valid) {
  return {error: 'BC004_ERR_402', message: 'Invalid token'};
}
```

#### 権限チェック

```typescript
// 組織作成時の権限チェック
const permissionCheck = await fetch('/api/bc-003/auth/check-permission', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    permission: 'organization:write'
  })
});

if (!permissionCheck.granted) {
  return {error: 'BC004_ERR_402', message: 'Insufficient permissions'};
}
```

### BC-001 (Project Portfolio) からの参照

BC-001はプロジェクトの所属組織単位とチームを参照します。

#### プロジェクトの組織単位取得

```
GET /api/bc-004/organizations/{orgId}/units/{unitId}
```

**使用例**: プロジェクト作成時に所属組織単位を選択

#### プロジェクトチーム取得

```
GET /api/bc-004/teams/{teamId}
```

**使用例**: プロジェクトにチームを割り当て

### BC-005 (Resources) からの参照

BC-005はリソースの配置先組織単位とチームアサインを参照します。

#### リソース配置先組織単位

```
GET /api/bc-004/organizations/{orgId}/units
```

**使用例**: リソースを組織単位に配置

#### リソースのチームアサイン

```
GET /api/bc-004/teams/{teamId}/members
POST /api/bc-004/teams/{teamId}/members
```

**使用例**: リソースをチームにアサイン

---

## レート制限・SLA {#rate-limiting-sla}

### レート制限

| エンドポイントカテゴリ | レート制限 | 説明 |
|--------------------|----------|------|
| 組織CRUD | 100 req/min | 組織の作成・更新・削除 |
| 組織単位CRUD | 100 req/min | 組織単位の作成・更新・削除 |
| 組織階層取得 | 200 req/min | 階層構造、祖先・子孫取得 |
| チームCRUD | 100 req/min | チームの作成・更新・削除 |
| チームメンバー管理 | 100 req/min | メンバー追加・削除・アサイン率変更 |
| ガバナンスポリシー | 50 req/min | ポリシー作成・更新（管理者のみ） |
| ポリシー評価 | 200 req/min | ポリシー評価（自動実行） |
| BC間連携（読み取り） | 500 req/min | 他BCからの参照 |

### レート制限超過時のレスポンス

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": {
    "code": "BC004_ERR_429",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 100,
      "window": "1 minute",
      "retryAfter": 60
    }
  }
}
```

### SLA

| メトリクス | 目標値 |
|----------|-------|
| 可用性 | 99.5% |
| 応答時間（p95） - 単一リソース取得 | < 200ms |
| 応答時間（p95） - 一覧取得 | < 500ms |
| 応答時間（p95） - 階層構造取得 | < 800ms |
| 応答時間（p95） - 組織再編 | < 2000ms |
| エラー率 | < 1% |

---

## 関連ドキュメント

### BC-004内部ドキュメント

- [organization-api.md](organization-api.md) - 組織・組織単位管理API詳細
- [team-api.md](team-api.md) - チーム管理API詳細
- [governance-api.md](governance-api.md) - ガバナンスポリシーAPI詳細
- [../domain/README.md](../domain/README.md) - BC-004 ドメインモデル
- [../data/README.md](../data/README.md) - BC-004 データ設計

### 関連Issue

- Issue #192: V3構造ドキュメント整備プロジェクト
- Issue #146: WHAT/HOW分離原則

---

**ステータス**: Phase 2.3 - BC-004 API設計詳細化進行中
**最終更新**: 2025-11-03
**次のアクション**: organization-api.md の作成

---

**変更履歴**:
- 2025-11-03: Phase 2.3 - BC-004 API設計を詳細化（Issue #192）
  - 包括的README.md作成（概要、認証、エラーコード）
  - エラーコード体系定義（BC004_ERR_001-599）
  - BC間連携パターン定義（BC-003, BC-001, BC-005）
  - レート制限・SLA定義
  - 4ファイル分割構成（メンテナンス性向上）
- 2025-10-31: Phase 0 - 基本構造作成
