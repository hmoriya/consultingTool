# BC-005: API層設計

**BC**: Team & Resource Optimization [チームとリソースの最適化] [BC_005]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/talent-optimization-service/api/ + services/productivity-visualization-service/api/

---

## 目次

1. [概要](#overview)
2. [API構成](#api-structure)
3. [エラーコード体系](#error-codes)
4. [認証・認可](#authentication)
5. [レート制限とSLA](#rate-limiting)
6. [BC間連携](#bc-integration)
7. [詳細ドキュメント](#detailed-docs)

---

## 概要 {#overview}

BC-005のAPI層は、リソース配分最適化、タレント育成、スキル開発、タイムシート管理機能を提供します。

### API設計原則

**Issue #146対応**:
- **WHAT（能力定義）**: APIが「何ができるか」を明確に定義
- **HOW（利用方法）**: 実装ガイドは別ドキュメント

**RESTful設計**:
- リソース指向の設計
- HTTPメソッドの適切な使用（GET/POST/PUT/DELETE）
- ステータスコードの標準的な利用

**BC-003との連携**:
- 全APIはBC-003の認証・認可機構を使用
- JWTトークンによるアクセス制御
- RBACによる権限チェック

---

## API構成 {#api-structure}

BC-005のAPIは以下の4つのカテゴリに分類されます:

### 1. リソース管理API

**対象**: resource-api.md

```
POST   /api/bc-005/resources                          # リソース登録
GET    /api/bc-005/resources/{resourceId}             # リソース詳細取得
PUT    /api/bc-005/resources/{resourceId}             # リソース更新
GET    /api/bc-005/resources                          # リソース一覧取得
POST   /api/bc-005/resources/{resourceId}/allocate    # プロジェクト配分
GET    /api/bc-005/resources/{resourceId}/allocations # 配分状況取得
GET    /api/bc-005/resources/{resourceId}/utilization # 稼働率取得
GET    /api/bc-005/resources/forecast-demand          # 需要予測
POST   /api/bc-005/resources/optimize-allocation      # 配分最適化
```

**主要機能**:
- リソースの登録・更新・検索
- プロジェクトへの配分管理（最大200%）
- 稼働率の計算と分析
- リソース需要の予測

---

### 2. タレント管理API

**対象**: talent-api.md

```
GET    /api/bc-005/talents/{talentId}                     # タレント詳細取得
PUT    /api/bc-005/talents/{talentId}                     # タレント情報更新
POST   /api/bc-005/talents/{talentId}/performance         # パフォーマンス記録
PUT    /api/bc-005/talents/{talentId}/performance/{recordId}/approve  # 承認
GET    /api/bc-005/talents/{talentId}/performance         # 評価履歴取得
POST   /api/bc-005/talents/{talentId}/career-plan         # キャリア計画作成
GET    /api/bc-005/talents/{talentId}/career-plan         # キャリア計画取得
POST   /api/bc-005/talents/{talentId}/skills              # スキル習得記録
GET    /api/bc-005/talents/{talentId}/skills              # 保有スキル取得
GET    /api/bc-005/talents/{talentId}/skill-gaps          # スキルギャップ分析
POST   /api/bc-005/skills                                 # スキル定義作成
GET    /api/bc-005/skills                                 # スキル一覧取得
GET    /api/bc-005/skills/{skillId}                       # スキル詳細取得
POST   /api/bc-005/skills/matrix                          # スキルマトリックス生成
```

**主要機能**:
- パフォーマンス評価と承認フロー
- キャリア開発計画の策定
- スキル習得とレベルアップ
- スキルギャップ分析
- 組織全体のスキルマトリックス管理

---

### 3. チーム管理API

**対象**: talent-api.md (チーム機能含む)

```
POST   /api/bc-005/teams                               # チーム作成
GET    /api/bc-005/teams/{teamId}                      # チーム詳細取得
PUT    /api/bc-005/teams/{teamId}                      # チーム更新
DELETE /api/bc-005/teams/{teamId}                      # チーム解散
GET    /api/bc-005/teams                               # チーム一覧取得
POST   /api/bc-005/teams/{teamId}/members              # メンバー追加
DELETE /api/bc-005/teams/{teamId}/members/{memberId}  # メンバー削除
GET    /api/bc-005/teams/{teamId}/members              # メンバー一覧
GET    /api/bc-005/teams/{teamId}/performance          # パフォーマンス取得
POST   /api/bc-005/teams/{teamId}/optimize             # チーム最適化提案
POST   /api/bc-005/teams/form-optimal                  # 最適チーム編成
```

**主要機能**:
- プロジェクトチーム編成
- メンバーの追加・削除
- チームパフォーマンスモニタリング
- スキルバランス最適化

---

### 4. タイムシート管理API

**対象**: timesheet-api.md

```
POST   /api/bc-005/timesheets                          # タイムシート作成
GET    /api/bc-005/timesheets/{timesheetId}            # タイムシート取得
PUT    /api/bc-005/timesheets/{timesheetId}            # タイムシート更新
GET    /api/bc-005/timesheets                          # タイムシート一覧
POST   /api/bc-005/timesheets/{timesheetId}/entries    # 明細追加
POST   /api/bc-005/timesheets/{timesheetId}/submit     # 提出
POST   /api/bc-005/timesheets/{timesheetId}/approve    # 承認
POST   /api/bc-005/timesheets/{timesheetId}/reject     # 却下
GET    /api/bc-005/timesheets/analyze-utilization      # 稼働率分析
GET    /api/bc-005/timesheets/pending-approvals        # 承認待ち一覧
```

**主要機能**:
- タイムシートの作成と明細入力
- 提出・承認・却下フロー
- 稼働率の集計と分析
- 承認ワークフロー管理

---

## エラーコード体系 {#error-codes}

BC-005のエラーコードは `BC005_ERR_XXX` の形式で定義されます。

### コード範囲

```
BC005_ERR_XXX
├── 001-099: リソース管理
├── 100-199: タレント管理
├── 200-299: スキル管理
├── 300-399: チーム管理
├── 400-499: タイムシート管理
├── 500-599: BC間連携エラー
└── 900-999: システムエラー
```

---

### リソース管理エラー（001-099）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC005_ERR_001 | 404 | Resource not found |
| BC005_ERR_002 | 400 | Invalid resource type |
| BC005_ERR_003 | 400 | Allocation exceeds limit (200%) |
| BC005_ERR_004 | 409 | Resource already allocated to project |
| BC005_ERR_005 | 400 | Invalid allocation percentage |
| BC005_ERR_006 | 400 | Allocation date range overlaps |
| BC005_ERR_007 | 400 | Resource unavailable for allocation |

---

### タレント管理エラー（100-199）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC005_ERR_100 | 404 | Talent not found |
| BC005_ERR_101 | 400 | Duplicate performance record for period |
| BC005_ERR_102 | 400 | Invalid performance rating (must be 1.0-5.0) |
| BC005_ERR_103 | 403 | Insufficient permission to approve performance |
| BC005_ERR_104 | 400 | Performance record is not in draft status |
| BC005_ERR_105 | 400 | Duplicate career plan for fiscal year |
| BC005_ERR_106 | 400 | Invalid development goal (not SMART) |

---

### スキル管理エラー（200-299）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC005_ERR_200 | 404 | Skill not found |
| BC005_ERR_201 | 400 | Invalid skill level (must be 1-5) |
| BC005_ERR_202 | 400 | Cannot skip skill levels |
| BC005_ERR_203 | 400 | Prerequisite skills not met |
| BC005_ERR_204 | 400 | Skill already acquired |
| BC005_ERR_205 | 400 | Maximum skill level reached (5) |

---

### チーム管理エラー（300-399）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC005_ERR_300 | 404 | Team not found |
| BC005_ERR_301 | 400 | Team must have at least one leader |
| BC005_ERR_302 | 400 | Cannot remove last leader |
| BC005_ERR_303 | 409 | Member already exists in team |
| BC005_ERR_304 | 400 | Invalid team member allocation |
| BC005_ERR_305 | 400 | Team skill requirements not met |

---

### タイムシート管理エラー（400-499）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC005_ERR_400 | 404 | Timesheet not found |
| BC005_ERR_401 | 400 | Timesheet already submitted |
| BC005_ERR_402 | 400 | Total hours exceed daily limit (24 hours) |
| BC005_ERR_403 | 400 | Cannot modify approved timesheet |
| BC005_ERR_404 | 400 | Timesheet period is invalid |
| BC005_ERR_405 | 403 | Insufficient permission to approve |
| BC005_ERR_406 | 400 | Timesheet is not in submitted status |

---

### BC間連携エラー（500-599）

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| BC005_ERR_500 | 404 | Project not found in BC-001 |
| BC005_ERR_501 | 404 | User not found in BC-003 |
| BC005_ERR_502 | 500 | Failed to send notification to BC-007 |
| BC005_ERR_503 | 500 | Failed to fetch training data from BC-006 |

---

## 認証・認可 {#authentication}

### BC-003との認証連携

BC-005の全APIはBC-003の認証・認可機構を使用します。

```http
Authorization: Bearer <JWT_TOKEN>
```

### 権限レベル

| 操作 | 必要な権限 |
|-----|----------|
| リソース登録・更新 | RESOURCE_MANAGER |
| リソース配分 | PROJECT_MANAGER |
| パフォーマンス記録 | MANAGER |
| パフォーマンス承認 | HR_MANAGER |
| タイムシート提出 | MEMBER |
| タイムシート承認 | MANAGER |
| スキル定義作成 | HR_MANAGER |
| チーム編成 | PROJECT_MANAGER |

### 権限チェックフロー

```
1. JWT トークン検証（BC-003）
   ↓
2. ユーザー識別
   ↓
3. ロール取得（BC-003）
   ↓
4. 権限チェック（BC-005）
   ↓
5. API実行 or 403 Forbidden
```

---

## レート制限とSLA {#rate-limiting}

### レート制限

| APIカテゴリ | レート制限 | 単位 |
|-----------|----------|-----|
| リソース管理 | 100 requests | /minute |
| タレント管理 | 50 requests | /minute |
| スキル管理 | 100 requests | /minute |
| チーム管理 | 100 requests | /minute |
| タイムシート管理 | 200 requests | /minute |
| 分析・レポート | 20 requests | /minute |

**制限超過時**:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

---

### SLA目標

| 指標 | 目標値 |
|-----|-------|
| 可用性 | 99.9% |
| p50レスポンス | < 200ms |
| p95レスポンス | < 500ms |
| p99レスポンス | < 1000ms |

**重要操作の目標**:
- リソース配分: p95 < 300ms
- タイムシート提出: p95 < 400ms
- パフォーマンス記録: p95 < 300ms

---

## BC間連携 {#bc-integration}

### BC-001 (Project Delivery) との連携

**リソース配分**:
```http
POST /api/bc-001/projects/{projectId}/resources
Content-Type: application/json

{
  "resourceId": "uuid",
  "allocationPercentage": 0.8,
  "startDate": "2025-11-01",
  "endDate": "2026-03-31"
}
```

**プロジェクト要件取得**:
```http
GET /api/bc-001/projects/{projectId}/requirements
```

---

### BC-002 (Financial Health) との連携

**リソースコスト送信**:
```http
POST /api/bc-002/resource-costs
Content-Type: application/json

{
  "resourceId": "uuid",
  "costType": "labor",
  "amount": 150000,
  "currency": "JPY",
  "period": {
    "startDate": "2025-11-01",
    "endDate": "2025-11-30"
  }
}
```

---

### BC-003 (Access Control) との連携

**ユーザー情報取得**:
```http
GET /api/bc-003/users/{userId}
```

**権限チェック**:
```http
POST /api/bc-003/authorization/check
Content-Type: application/json

{
  "userId": "uuid",
  "resource": "performance_record",
  "action": "approve"
}
```

---

### BC-004 (Organizational Structure) との連携

**組織単位のリソース取得**:
```http
GET /api/bc-004/organizations/{orgId}/units/{unitId}/members
```

**チームと組織単位の紐付け**:
```http
POST /api/bc-004/organizations/{orgId}/units/{unitId}/teams
Content-Type: application/json

{
  "teamId": "uuid",
  "teamName": "Project Alpha Team"
}
```

---

### BC-006 (Knowledge Management) との連携

**トレーニング推奨取得**:
```http
GET /api/bc-006/training/recommend?skillGaps=java,python
```

**学習履歴とスキル連携**:
```http
POST /api/bc-006/learning/completed
Content-Type: application/json

{
  "talentId": "uuid",
  "courseId": "uuid",
  "skillsAcquired": ["java", "spring-boot"]
}
```

---

### BC-007 (Communication) との連携

**通知送信**（イベント駆動）:
- パフォーマンス評価完了通知
- タイムシート承認依頼通知
- チーム編成通知
- スキルレベルアップ通知

---

## 詳細ドキュメント {#detailed-docs}

BC-005 API層の詳細は以下のドキュメントを参照してください:

1. **[resource-api.md](resource-api.md)** - リソース管理API
   - リソース登録・更新
   - プロジェクト配分管理
   - 稼働率計算と分析
   - リソース需要予測

2. **[talent-api.md](talent-api.md)** - タレント・チーム・スキル管理API
   - パフォーマンス評価と承認
   - キャリア開発計画
   - スキル習得とギャップ分析
   - チーム編成と最適化

3. **[timesheet-api.md](timesheet-api.md)** - タイムシート管理API
   - タイムシート作成と入力
   - 提出・承認フロー
   - 稼働率分析とレポート

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 API層詳細化
