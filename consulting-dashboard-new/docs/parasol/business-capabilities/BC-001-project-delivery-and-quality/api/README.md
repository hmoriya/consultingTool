# BC-001: API設計

**BC**: Project Delivery & Quality Management
**作成日**: 2025-10-31
**更新日**: 2025-10-31（Issue #192対応）
**V2移行元**: services/project-success-service/api/

---

## 📋 概要

このドキュメントは、BC-001（プロジェクト配信と品質管理）のAPI設計を定義します。

**重要**: **Issue #146対応** により、API設計はWHAT（能力定義）とHOW（利用方法）に厳密に分離されています。

### WHATレイヤー（このドキュメント）
- **役割**: BC-001が提供するAPI能力の定義
- **対象読者**: APIアーキテクト、サービス統合担当者
- **内容**: エンドポイント、スキーマ、認証、エラーハンドリング、SLA

### HOWレイヤー（UseCaseレベル）
- **役割**: 具体的なAPIの利用方法
- **対象読者**: 実装エンジニア
- **配置場所**: `capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/api-usage.md`
- **内容**: 呼び出しシーケンス、エラー対処法、最適化技法

---

## 🏗️ API設計構成

### 📄 本README（WHAT: 能力定義）
BC-001のAPI全体像と仕様を定義

### 📁 endpoints/（将来実装予定）
個別エンドポイントの詳細OpenAPI定義
- `project-management.yaml`
- `task-management.yaml`
- `deliverable-management.yaml`
- `risk-management.yaml`

### 📁 schemas/（将来実装予定）
共通データスキーマ定義（JSON Schema / OpenAPI）
- `project.schema.json`
- `task.schema.json`
- `common-types.schema.json`

---

## 🌐 主要APIエンドポイント

### 1. Project Management API {#api-project}

#### POST /api/bc-001/projects
**説明**: 新規プロジェクトを作成

**リクエスト**:
```json
{
  "name": "新規プロジェクト名",                    // STRING_200
  "description": "プロジェクトの説明",             // TEXT
  "startDate": "2025-11-01",                      // DATE
  "endDate": "2026-03-31",                        // DATE
  "budget": 10000000.00,                          // DECIMAL
  "ownerId": "uuid-of-owner"                      // UUID
}
```

**レスポンス（成功）**:
- **HTTP 201 Created**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440000",  // UUID
  "name": "新規プロジェクト名",                         // STRING_200
  "status": "planning",                                 // STRING_50
  "createdAt": "2025-10-31T10:00:00Z",                 // TIMESTAMP
  "_links": {
    "self": "/api/bc-001/projects/550e8400-e29b-41d4-a716-446655440000",  // STRING_200
    "tasks": "/api/bc-001/projects/550e8400-e29b-41d4-a716-446655440000/tasks"  // STRING_200
  }
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_001 | nameが空またはnull | 有効なプロジェクト名を指定 |
| 400 | BC001_ERR_002 | startDate > endDate | 日付範囲を修正 |
| 400 | BC001_ERR_003 | budget < 0 | 正の予算額を指定 |
| 401 | AUTH_ERR_001 | 認証トークン不正 | 有効なJWTトークンを提供 |
| 403 | AUTH_ERR_002 | プロジェクト作成権限なし | 必要な権限を取得 |
| 409 | BC001_ERR_010 | 同名プロジェクトが既存 | 異なる名前を使用 |
| 500 | SYS_ERR_001 | システムエラー | リトライまたはサポート連絡 |

**認証**: Bearer Token必須
**権限**: `project:create`
**レート制限**: 10 req/min
**SLA**: p95 < 500ms

---

#### GET /api/bc-001/projects/{projectId}
**説明**: プロジェクト詳細を取得

**パスパラメータ**:
- `projectId` (UUID, 必須): プロジェクトID

**レスポンス（成功）**:
- **HTTP 200 OK**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "プロジェクト名",
  "description": "説明",
  "status": "executing",
  "startDate": "2025-11-01",
  "endDate": "2026-03-31",
  "actualStartDate": "2025-11-05",
  "actualEndDate": null,
  "budget": 10000000.00,
  "ownerId": "uuid-of-owner",
  "createdAt": "2025-10-31T10:00:00Z",
  "updatedAt": "2025-11-05T14:30:00Z",
  "milestones": [
    {
      "milestoneId": "uuid",
      "name": "Phase 1完了",
      "targetDate": "2025-12-31",
      "status": "achieved"
    }
  ],
  "statistics": {
    "totalTasks": 50,
    "completedTasks": 20,
    "progressPercentage": 40.0
  },
  "_links": {
    "self": "/api/bc-001/projects/550e8400-e29b-41d4-a716-446655440000",
    "tasks": "/api/bc-001/projects/550e8400-e29b-41d4-a716-446655440000/tasks",
    "deliverables": "/api/bc-001/projects/550e8400-e29b-41d4-a716-446655440000/deliverables",
    "risks": "/api/bc-001/projects/550e8400-e29b-41d4-a716-446655440000/risks"
  }
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_004 | projectId形式不正 | 有効なUUID形式を指定 |
| 404 | BC001_ERR_404 | プロジェクトが存在しない | 正しいprojectIdを確認 |
| 403 | AUTH_ERR_003 | プロジェクト閲覧権限なし | プロジェクトメンバーに追加される必要あり |

**認証**: Bearer Token必須
**権限**: `project:read`
**レート制限**: 100 req/min
**SLA**: p95 < 200ms

---

#### PUT /api/bc-001/projects/{projectId}
**説明**: プロジェクト情報を更新

**リクエスト**:
```json
{
  "name": "更新後プロジェクト名",
  "description": "更新後の説明",
  "endDate": "2026-04-30",
  "status": "executing"
}
```

**レスポンス（成功）**:
- **HTTP 200 OK**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "更新後プロジェクト名",
  "status": "executing",
  "updatedAt": "2025-11-10T09:15:00Z"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_005 | 不正なステータス遷移 | 正しい遷移順序を確認（domain README参照） |
| 403 | AUTH_ERR_004 | プロジェクト更新権限なし | オーナーまたは管理者権限が必要 |
| 404 | BC001_ERR_404 | プロジェクトが存在しない | 正しいprojectIdを確認 |
| 409 | BC001_ERR_011 | 完了条件未達成で完了不可 | 全タスク・成果物・リスクを確認 |

**認証**: Bearer Token必須
**権限**: `project:update`
**レート制限**: 50 req/min
**SLA**: p95 < 300ms

---

#### DELETE /api/bc-001/projects/{projectId}
**説明**: プロジェクトを論理削除（status: cancelled）

**レスポンス（成功）**:
- **HTTP 204 No Content**

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 403 | AUTH_ERR_005 | プロジェクト削除権限なし | オーナーまたは管理者権限が必要 |
| 404 | BC001_ERR_404 | プロジェクトが存在しない | 正しいprojectIdを確認 |
| 409 | BC001_ERR_012 | 実行中プロジェクトは削除不可 | まずステータスを停止に変更 |

**認証**: Bearer Token必須
**権限**: `project:delete`
**レート制限**: 10 req/min
**SLA**: p95 < 300ms

---

#### GET /api/bc-001/projects
**説明**: プロジェクト一覧を取得（ページング、フィルタリング対応）

**クエリパラメータ**:
- `page` (Integer, デフォルト: 1): ページ番号
- `limit` (Integer, デフォルト: 20, 最大: 100): ページサイズ
- `status` (String, オプション): フィルタ - planning/executing/completed/cancelled
- `ownerId` (UUID, オプション): オーナーでフィルタ
- `startDateFrom` (Date, オプション): 開始日範囲（開始）
- `startDateTo` (Date, オプション): 開始日範囲（終了）
- `sort` (String, デフォルト: createdAt:desc): ソート順 - createdAt:asc, name:asc など

**レスポンス（成功）**:
- **HTTP 200 OK**
```json
{
  "projects": [
    {
      "projectId": "uuid",
      "name": "プロジェクト名",
      "status": "executing",
      "startDate": "2025-11-01",
      "endDate": "2026-03-31",
      "ownerId": "uuid"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 150,
    "totalPages": 8
  },
  "_links": {
    "self": "/api/bc-001/projects?page=1&limit=20",
    "next": "/api/bc-001/projects?page=2&limit=20",
    "last": "/api/bc-001/projects?page=8&limit=20"
  }
}
```

**認証**: Bearer Token必須
**権限**: `project:read`
**レート制限**: 100 req/min
**SLA**: p95 < 300ms

---

### 2. Task Management API {#api-task}

#### POST /api/bc-001/projects/{projectId}/tasks
**説明**: 新規タスクを作成

**リクエスト**:
```json
{
  "name": "タスク名",                              // STRING_200
  "description": "タスクの説明",                   // TEXT
  "parentTaskId": "uuid-of-parent-task",          // UUID
  "priority": "high",                             // STRING_20
  "estimatedHours": 16.5,                         // DECIMAL
  "assigneeId": "uuid-of-assignee",               // UUID
  "startDate": "2025-11-10",                      // DATE
  "dueDate": "2025-11-20"                         // DATE
}
```

**レスポンス（成功）**:
- **HTTP 201 Created**
```json
{
  "taskId": "uuid",
  "projectId": "uuid",
  "name": "タスク名",
  "status": "not_started",
  "priority": "high",
  "createdAt": "2025-11-01T10:00:00Z",
  "_links": {
    "self": "/api/bc-001/projects/{projectId}/tasks/{taskId}",
    "dependencies": "/api/bc-001/projects/{projectId}/tasks/{taskId}/dependencies"
  }
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_020 | nameが空 | 有効なタスク名を指定 |
| 400 | BC001_ERR_021 | estimatedHours ≤ 0 | 正の工数を指定 |
| 400 | BC001_ERR_022 | priority不正 | high/medium/lowのいずれかを指定 |
| 404 | BC001_ERR_404 | projectIdが存在しない | 正しいprojectIdを確認 |
| 404 | BC001_ERR_405 | parentTaskIdが存在しない | 正しい親タスクIDを確認 |
| 404 | BC001_ERR_406 | assigneeIdが存在しない | 正しいユーザーIDを確認 |

**認証**: Bearer Token必須
**権限**: `task:create`
**レート制限**: 50 req/min
**SLA**: p95 < 400ms

---

#### GET /api/bc-001/projects/{projectId}/tasks/{taskId}
**説明**: タスク詳細を取得

**レスポンス（成功）**:
- **HTTP 200 OK**
```json
{
  "taskId": "uuid",
  "projectId": "uuid",
  "parentTaskId": "uuid",
  "name": "タスク名",
  "description": "説明",
  "status": "in_progress",
  "priority": "high",
  "estimatedHours": 16.5,
  "actualHours": 8.0,
  "assigneeId": "uuid",
  "startDate": "2025-11-10",
  "dueDate": "2025-11-20",
  "completedDate": null,
  "dependencies": [
    {
      "predecessorTaskId": "uuid",
      "dependencyType": "FS",
      "lagDays": 0
    }
  ],
  "subtasks": [
    {
      "taskId": "uuid",
      "name": "サブタスク1",
      "status": "completed"
    }
  ],
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-15T14:30:00Z"
}
```

**認証**: Bearer Token必須
**権限**: `task:read`
**レート制限**: 100 req/min
**SLA**: p95 < 200ms

---

#### PUT /api/bc-001/projects/{projectId}/tasks/{taskId}
**説明**: タスク情報を更新

**リクエスト**:
```json
{
  "status": "in_progress",
  "actualHours": 10.5,
  "priority": "medium"
}
```

**レスポンス（成功）**:
- **HTTP 200 OK**

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_023 | 不正なステータス遷移 | タスクライフサイクルを確認 |
| 409 | BC001_ERR_024 | 依存タスク未完了でin_progress不可 | 先行タスクの完了を待つ |
| 409 | BC001_ERR_025 | 担当者未割当でin_progress不可 | 担当者を割り当て |

**認証**: Bearer Token必須
**権限**: `task:update`
**レート制限**: 50 req/min
**SLA**: p95 < 300ms

---

#### POST /api/bc-001/projects/{projectId}/tasks/{taskId}/dependencies
**説明**: タスク依存関係を追加

**リクエスト**:
```json
{
  "predecessorTaskId": "uuid",
  "dependencyType": "FS",
  "lagDays": 2
}
```

**レスポンス（成功）**:
- **HTTP 201 Created**

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_026 | dependencyType不正 | FS/SS/FF/SFのいずれかを指定 |
| 404 | BC001_ERR_407 | predecessorTaskIdが存在しない | 正しいタスクIDを確認 |
| 409 | BC001_ERR_027 | 循環依存が発生 | 依存関係を見直し |

**認証**: Bearer Token必須
**権限**: `task:update`
**レート制限**: 30 req/min
**SLA**: p95 < 400ms

---

### 3. Deliverable Management API {#api-deliverable}

#### POST /api/bc-001/projects/{projectId}/deliverables
**説明**: 新規成果物を作成

**リクエスト**:
```json
{
  "name": "成果物名",
  "description": "説明",
  "taskId": "uuid",
  "version": "1.0.0",
  "filePath": "/storage/deliverables/doc-v1.0.0.pdf",
  "reviewDeadline": "2025-11-25"
}
```

**レスポンス（成功）**:
- **HTTP 201 Created**
```json
{
  "deliverableId": "uuid",
  "projectId": "uuid",
  "name": "成果物名",
  "qualityStatus": "not_reviewed",
  "version": "1.0.0",
  "createdAt": "2025-11-20T10:00:00Z"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_030 | nameが空 | 有効な成果物名を指定 |
| 400 | BC001_ERR_031 | versionが不正（SemVer非準拠） | SemVer形式（x.y.z）で指定 |
| 404 | BC001_ERR_408 | taskIdが存在しない | 正しいタスクIDを確認 |

**認証**: Bearer Token必須
**権限**: `deliverable:create`
**レート制限**: 30 req/min
**SLA**: p95 < 500ms

---

#### POST /api/bc-001/projects/{projectId}/deliverables/{deliverableId}/review
**説明**: 成果物のレビューを提出

**リクエスト**:
```json
{
  "reviewerId": "uuid",
  "reviewDeadline": "2025-11-30"
}
```

**レスポンス（成功）**:
- **HTTP 200 OK**
```json
{
  "deliverableId": "uuid",
  "qualityStatus": "in_review",
  "reviewerId": "uuid",
  "reviewDeadline": "2025-11-30"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_032 | reviewDeadline < 現在日時 | 未来の日付を指定 |
| 404 | BC001_ERR_409 | reviewerIdが存在しない | 正しいレビュアーIDを確認 |
| 409 | BC001_ERR_033 | 既にレビュー中 | レビュー完了を待つ |

**認証**: Bearer Token必須
**権限**: `deliverable:review`
**レート制限**: 30 req/min
**SLA**: p95 < 400ms

---

#### PUT /api/bc-001/projects/{projectId}/deliverables/{deliverableId}/approve
**説明**: 成果物を承認

**リクエスト**:
```json
{
  "comments": "承認コメント",
  "qualityCriteriaMet": [
    "criteria-uuid-1",
    "criteria-uuid-2"
  ]
}
```

**レスポンス（成功）**:
- **HTTP 200 OK**
```json
{
  "deliverableId": "uuid",
  "qualityStatus": "approved",
  "approvedAt": "2025-11-28T15:00:00Z",
  "reviewerId": "uuid"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 403 | AUTH_ERR_006 | レビュアー本人以外は承認不可 | 割り当てられたレビュアーで実行 |
| 409 | BC001_ERR_034 | 必須品質基準未達成 | 全必須基準を満たす必要あり |

**認証**: Bearer Token必須
**権限**: `deliverable:approve`
**レート制限**: 20 req/min
**SLA**: p95 < 400ms

---

#### PUT /api/bc-001/projects/{projectId}/deliverables/{deliverableId}/reject
**説明**: 成果物を差戻し

**リクエスト**:
```json
{
  "reason": "差戻し理由の詳細説明",
  "improvementSuggestions": [
    "改善提案1",
    "改善提案2"
  ]
}
```

**レスポンス（成功）**:
- **HTTP 200 OK**

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_035 | reasonが空 | 差戻し理由を記入 |

**認証**: Bearer Token必須
**権限**: `deliverable:approve`
**レート制限**: 20 req/min
**SLA**: p95 < 400ms

---

### 4. Risk Management API {#api-risk}

#### POST /api/bc-001/projects/{projectId}/risks
**説明**: 新規リスクを識別

**リクエスト**:
```json
{
  "name": "リスク名",
  "description": "リスクの詳細説明",
  "impact": "high",
  "probability": "medium",
  "identifiedById": "uuid"
}
```

**レスポンス（成功）**:
- **HTTP 201 Created**
```json
{
  "riskId": "uuid",
  "projectId": "uuid",
  "name": "リスク名",
  "status": "identified",
  "riskScore": 6,
  "createdAt": "2025-11-01T10:00:00Z"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_040 | impact不正 | high/medium/lowのいずれかを指定 |
| 400 | BC001_ERR_041 | probability不正 | high/medium/lowのいずれかを指定 |

**認証**: Bearer Token必須
**権限**: `risk:create`
**レート制限**: 30 req/min
**SLA**: p95 < 400ms

---

#### POST /api/bc-001/projects/{projectId}/risks/{riskId}/mitigation
**説明**: リスク対応策を計画

**リクエスト**:
```json
{
  "strategy": "回避",
  "description": "対応策の詳細",
  "responsibleId": "uuid",
  "deadline": "2025-11-30",
  "estimatedCost": 50000.00
}
```

**レスポンス（成功）**:
- **HTTP 201 Created**
```json
{
  "mitigationId": "uuid",
  "riskId": "uuid",
  "strategy": "回避",
  "status": "planned",
  "createdAt": "2025-11-05T10:00:00Z"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC001_ERR_042 | deadline < 現在日時 | 未来の日付を指定 |
| 404 | BC001_ERR_410 | responsibleIdが存在しない | 正しいユーザーIDを確認 |
| 409 | BC001_ERR_043 | 既に対応策が存在 | 既存の対応策を更新 |

**認証**: Bearer Token必須
**権限**: `risk:manage`
**レート制限**: 30 req/min
**SLA**: p95 < 400ms

---

## 🔗 BC間連携API

### BC-002 (Financial Health) へのコスト連携

#### POST /api/bc-002/cost-allocations
**説明**: プロジェクトコストをBC-002に連携

**リクエスト**:
```json
{
  "projectId": "uuid",
  "amount": 1500000.00,
  "category": "labor",
  "date": "2025-11-30",
  "description": "タスク実績工数"
}
```

**呼び出しタイミング**: TaskCompletedドメインイベント発生時

**認証**: Service-to-Service OAuth 2.0 Client Credentials
**レート制限**: 200 req/min
**SLA**: p95 < 500ms

---

### BC-005 (Team & Resource Optimization) へのリソース要求

#### POST /api/bc-005/resource-requests
**説明**: プロジェクトに必要なリソースを要求

**リクエスト**:
```json
{
  "projectId": "uuid",
  "skillRequirements": [
    {
      "skillName": "Python",
      "skillLevel": "expert",
      "quantity": 2
    }
  ],
  "startDate": "2025-12-01",
  "duration": 90
}
```

**呼び出しタイミング**: ProjectCreatedドメインイベント発生時

**認証**: Service-to-Service OAuth 2.0 Client Credentials
**レート制限**: 100 req/min
**SLA**: p95 < 800ms

---

### BC-006 (Knowledge Management) への知識検索

#### GET /api/bc-006/knowledge/search
**説明**: プロジェクト関連の知識を検索

**クエリパラメータ**:
- `q` (String, 必須): 検索クエリ
- `context` (String, オプション): project/task/risk
- `projectId` (UUID, オプション): コンテキストプロジェクト

**呼び出しタイミング**: プロジェクト計画時、リスク識別時

**認証**: Bearer Token
**レート制限**: 50 req/min
**SLA**: p95 < 1000ms

---

### BC-007 (Team Communication) への通知送信

#### POST /api/bc-007/notifications
**説明**: チームメンバーに通知を送信

**リクエスト**:
```json
{
  "recipients": ["user-uuid-1", "user-uuid-2"],
  "message": {
    "title": "タスクが割り当てられました",
    "body": "タスク「〇〇」があなたに割り当てられました",
    "link": "/projects/{projectId}/tasks/{taskId}"
  },
  "priority": "normal",
  "channel": "in-app"
}
```

**呼び出しタイミング**: TaskAssigned, DeliverableSubmittedForReview, CriticalRiskDetectedドメインイベント発生時

**認証**: Service-to-Service OAuth 2.0 Client Credentials
**レート制限**: 500 req/min
**SLA**: p95 < 300ms

---

## 🔐 認証・認可

### 認証方式

#### OAuth 2.0 + JWT
- **認証基盤**: BC-003 (Access Control & Security)
- **トークンエンドポイント**: `/api/bc-003/oauth/token`
- **トークン有効期限**: 1時間
- **リフレッシュトークン**: 有効期限7日

#### サービス間認証
- **方式**: OAuth 2.0 Client Credentials Flow
- **クライアントID/シークレット**: BC-003で発行
- **スコープ**: `bc-001:service-access`

### 認可ポリシー

| ロール | 権限 | 説明 |
|--------|------|------|
| **プロジェクトオーナー** | project:*, task:*, deliverable:*, risk:* | 全権限 |
| **プロジェクトメンバー** | project:read, task:*, deliverable:create, risk:read | タスク管理と成果物作成 |
| **レビュアー** | project:read, deliverable:read, deliverable:approve | レビュー・承認 |
| **ステークホルダー** | project:read, task:read, deliverable:read, risk:read | 読取のみ |

### 権限チェック

```typescript
// 例: プロジェクト更新時の権限チェック
if (!user.hasPermission('project:update')) {
  throw new ForbiddenError('AUTH_ERR_004', 'プロジェクト更新権限がありません');
}

// リソースオーナーチェック
if (project.ownerId !== user.userId && !user.isAdmin()) {
  throw new ForbiddenError('AUTH_ERR_004', 'オーナーまたは管理者のみ更新可能です');
}
```

---

## ⚠️ エラーハンドリング

### エラーコード体系

#### エラーコード形式
```
BC001_ERR_XXX
- BC001: Business Capability識別子
- ERR: エラー種別
- XXX: 連番（001-999）
```

#### エラーカテゴリ

| コード範囲 | カテゴリ | 例 |
|----------|---------|-----|
| 001-019 | Project関連 | BC001_ERR_001-019 |
| 020-029 | Task関連 | BC001_ERR_020-029 |
| 030-039 | Deliverable関連 | BC001_ERR_030-039 |
| 040-049 | Risk関連 | BC001_ERR_040-049 |
| 400-499 | リソース未存在 | BC001_ERR_404, BC001_ERR_405 |
| 500-599 | システムエラー | SYS_ERR_001 |

### エラーレスポンス形式

```json
{
  "error": {
    "code": "BC001_ERR_001",
    "message": "プロジェクト名が空です",
    "details": {
      "field": "name",
      "constraint": "not_null",
      "providedValue": null
    },
    "timestamp": "2025-11-01T10:00:00Z",
    "requestId": "req-uuid-for-tracing"
  }
}
```

### リトライ戦略

#### リトライ可能エラー（5xx系）
- **HTTP 500, 502, 503, 504**: システムエラー、一時的な障害
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)

#### リトライ不可エラー（4xx系）
- **HTTP 400, 401, 403, 404, 409**: クライアントエラー、ビジネスルール違反
- **対処**: エラーメッセージを確認し、リクエストを修正

---

## 📊 API SLA (Service Level Agreement)

### 可用性
- **目標**: 99.9% (月間ダウンタイム: 43.2分以内)
- **測定対象**: 全エンドポイント
- **除外**: メンテナンスウィンドウ（毎週日曜 02:00-04:00）

### レスポンスタイム

| エンドポイントカテゴリ | p50 | p95 | p99 |
|-------------------|-----|-----|-----|
| GET（単一リソース） | < 100ms | < 200ms | < 500ms |
| GET（一覧） | < 150ms | < 300ms | < 800ms |
| POST（作成） | < 200ms | < 500ms | < 1000ms |
| PUT（更新） | < 150ms | < 400ms | < 800ms |
| DELETE | < 150ms | < 300ms | < 600ms |

### スループット
- **最大リクエスト数**: 10,000 req/min (全エンドポイント合計)
- **同時接続数**: 1,000接続

### エラー率
- **目標**: < 0.1% (正常系リクエストに対するエラーレスポンス比率)
- **除外**: クライアントエラー（4xx系）

---

## 🚦 レート制限

### エンドポイント別レート制限

| エンドポイント | レート制限 | バースト許容 |
|-------------|----------|-----------|
| POST /projects | 10 req/min | 20 req/min (10秒間) |
| GET /projects/{id} | 100 req/min | 200 req/min |
| GET /projects | 100 req/min | 200 req/min |
| POST /tasks | 50 req/min | 100 req/min |
| PUT /tasks/{id} | 50 req/min | 100 req/min |
| POST /deliverables | 30 req/min | 60 req/min |
| POST /risks | 30 req/min | 60 req/min |

### レート制限超過時のレスポンス

**HTTP 429 Too Many Requests**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "レート制限を超過しました",
    "retryAfter": 60,
    "limit": 10,
    "remaining": 0,
    "resetAt": "2025-11-01T10:01:00Z"
  }
}
```

**レスポンスヘッダー**:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1730457660
Retry-After: 60
```

---

## 📚 V2からの移行

### V2構造（移行元）
```
services/project-success-service/api/
├── api-specification.md（サービスレベル - 廃止）
└── endpoints/
    ├── project-management.yaml
    └── task-management.yaml
```

### V3構造（移行先 - Issue #146対応）
```
BC-001/api/
├── README.md（本ファイル - WHAT層）
├── api-specification.md（詳細OpenAPI定義）
└── schemas/
    ├── project.schema.json
    └── task.schema.json

# HOW層は各UseCaseに配置
capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase}/
└── api-usage.md（HOW層 - 具体的な利用方法）
```

### 主な変更点

1. **Issue #146対応**:
   - WHAT（能力定義）: BC-001/api/
   - HOW（利用方法）: usecases/api-usage.md

2. **エラーコード体系化**:
   - V2: 一貫性のないエラーメッセージ
   - V3: BC001_ERR_XXX 体系的なコード

3. **認証・認可の明確化**:
   - V2: 曖昧な権限定義
   - V3: ロールベースの明確な権限

4. **SLA定義**:
   - V2: 未定義
   - V3: 可用性、レスポンスタイム、スループット明記

### 移行ステータス
- ✅ API仕様の移行完了（Issue #146対応版）
- ✅ エンドポイント構造の整理
- ✅ **Issue #192対応**: 詳細スキーマ、エラーコード、SLA、レート制限を追加
- 🟡 OpenAPI 3.0仕様ファイルの作成（Phase 2で実施予定）

---

## 🔗 関連ドキュメント

### BC-001内部参照
- [../domain/README.md](../domain/README.md) - ドメインモデル（不変条件、ドメインイベント）
- [../data/README.md](../data/README.md) - データモデル（テーブル定義、ER図）

### BC間連携参照
- [../../BC-002-financial-health-and-profitability/api/README.md](../../BC-002-financial-health-and-profitability/api/README.md) - コスト連携API
- [../../BC-003-access-control-and-security/api/README.md](../../BC-003-access-control-and-security/api/README.md) - 認証・認可API
- [../../BC-005-team-and-resource-optimization/api/README.md](../../BC-005-team-and-resource-optimization/api/README.md) - リソース管理API
- [../../BC-006-knowledge-management-and-learning/api/README.md](../../BC-006-knowledge-management-and-learning/api/README.md) - 知識検索API
- [../../BC-007-team-communication-and-collaboration/api/README.md](../../BC-007-team-communication-and-collaboration/api/README.md) - 通知API

### Issue参照
- **Issue #146**: API WHAT/HOW分離ガイド
- **Issue #192**: V3構造ドキュメント整備・品質向上プロジェクト

---

**ステータス**: ✅ Issue #192 Phase 1.2 完了 - BC-001 API 詳細化完了
**次のアクション**: Phase 1.3 - BC-001 データ設計の詳細化
