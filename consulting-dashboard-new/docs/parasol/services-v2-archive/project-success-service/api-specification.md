# API仕様: プロジェクト成功支援サービス

## API概要
**目的**: プロジェクトの計画、実行、監視、完了までのライフサイクル全体を支援するRESTful API
**バージョン**: v1.0.0
**ベースURL**: `https://api.example.com/v1/project-success`

## 認証
**認証方式**: JWT (JSON Web Token)
**ヘッダー**: `Authorization: Bearer {token}`

## 共通仕様

### リクエストヘッダー
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
```

### レスポンス形式
```json
{
  "success": boolean,
  "data": object,
  "message": string,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## エンドポイント定義

### Project API

#### GET /projects
**概要**: プロジェクト一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/projects`
- **Parameters**:
  - `page` (query, optional): ページ番号 (default: 1)
  - `limit` (query, optional): 件数 (default: 20, max: 100)
  - `status` (query, optional): ステータスフィルタ (Planning/Active/OnHold/Completed/Cancelled)
  - `priority` (query, optional): 優先度フィルタ (Critical/High/Medium/Low)
  - `clientId` (query, optional): クライアントIDフィルタ
  - `projectManagerId` (query, optional): PMIDフィルタ
  - `sort` (query, optional): ソート順 (startDate_asc, budget_desc, etc)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "code": "DX001",
        "name": "デジタルトランスフォーメーション推進",
        "description": "全社的なDX推進プロジェクト",
        "clientId": "uuid",
        "status": "Active",
        "priority": "Critical",
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "actualEndDate": null,
        "budget": 50000000,
        "actualCost": 25000000,
        "projectManagerId": "uuid",
        "sponsorId": "uuid",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-06-01T00:00:00Z"
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

#### POST /projects
**概要**: 新規プロジェクトを作成

**リクエスト**:
- **Method**: POST
- **URL**: `/projects`
- **Body**:
```json
{
  "code": "DX001",
  "name": "デジタルトランスフォーメーション推進",
  "description": "全社的なDX推進プロジェクト",
  "clientId": "uuid",
  "status": "Planning",
  "priority": "Critical",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "budget": 50000000,
  "projectManagerId": "uuid",
  "sponsorId": "uuid"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "DX001",
    "name": "デジタルトランスフォーメーション推進",
    "description": "全社的なDX推進プロジェクト",
    "clientId": "uuid",
    "status": "Planning",
    "priority": "Critical",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "budget": 50000000,
    "projectManagerId": "uuid",
    "sponsorId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /projects/{id}
**概要**: 特定プロジェクトの詳細を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/projects/{id}`
- **Path Parameters**:
  - `id` (required): プロジェクトID (UUID形式)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "DX001",
    "name": "デジタルトランスフォーメーション推進",
    "description": "全社的なDX推進プロジェクト",
    "clientId": "uuid",
    "status": "Active",
    "priority": "Critical",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "actualEndDate": null,
    "budget": 50000000,
    "actualCost": 25000000,
    "projectManagerId": "uuid",
    "sponsorId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-06-01T00:00:00Z",
    "milestones": [...],
    "members": [...],
    "metrics": {
      "completionRate": 50,
      "budgetUtilization": 50,
      "onSchedule": true
    }
  }
}
```

#### PUT /projects/{id}
**概要**: プロジェクトを更新

**リクエスト**:
- **Method**: PUT
- **URL**: `/projects/{id}`
- **Path Parameters**:
  - `id` (required): プロジェクトID (UUID形式)
- **Body**:
```json
{
  "name": "デジタルトランスフォーメーション推進（更新）",
  "description": "全社的なDX推進プロジェクト - 範囲拡大",
  "status": "Active",
  "priority": "Critical",
  "endDate": "2025-03-31",
  "budget": 60000000
}
```

#### DELETE /projects/{id}
**概要**: プロジェクトを削除

**リクエスト**:
- **Method**: DELETE
- **URL**: `/projects/{id}`
- **Path Parameters**:
  - `id` (required): プロジェクトID (UUID形式)

#### PUT /projects/{id}/status
**概要**: プロジェクトステータスを変更

**リクエスト**:
- **Method**: PUT
- **URL**: `/projects/{id}/status`
- **Body**:
```json
{
  "status": "Active",
  "reason": "要件定義完了のため実行フェーズへ移行",
  "changedBy": "uuid"
}
```

### Task API

#### GET /projects/{projectId}/tasks
**概要**: プロジェクトのタスク一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/projects/{projectId}/tasks`
- **Parameters**:
  - `status` (query, optional): ステータスフィルタ
  - `assigneeId` (query, optional): 担当者フィルタ
  - `priority` (query, optional): 優先度フィルタ
  - `includeSubtasks` (query, optional): サブタスク含む (default: true)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "parentTaskId": null,
        "code": "DX001-T001",
        "name": "要件定義",
        "description": "全体要件の定義と合意",
        "assigneeId": "uuid",
        "status": "InProgress",
        "priority": "High",
        "estimatedHours": 80,
        "actualHours": 40,
        "startDate": "2024-01-01",
        "dueDate": "2024-01-31",
        "completedDate": null,
        "progress": 50,
        "dependencies": ["uuid1", "uuid2"],
        "subtasks": [...]
      }
    ]
  }
}
```

#### POST /projects/{projectId}/tasks
**概要**: 新規タスクを作成

**リクエスト**:
- **Method**: POST
- **URL**: `/projects/{projectId}/tasks`
- **Body**:
```json
{
  "parentTaskId": null,
  "code": "DX001-T001",
  "name": "要件定義",
  "description": "全体要件の定義と合意",
  "assigneeId": "uuid",
  "status": "NotStarted",
  "priority": "High",
  "estimatedHours": 80,
  "startDate": "2024-01-01",
  "dueDate": "2024-01-31",
  "dependencies": []
}
```

#### GET /tasks/{id}
**概要**: タスクの詳細を取得

#### PUT /tasks/{id}
**概要**: タスクを更新

#### DELETE /tasks/{id}
**概要**: タスクを削除

#### PUT /tasks/{id}/progress
**概要**: タスク進捗を更新

**リクエスト**:
- **Method**: PUT
- **URL**: `/tasks/{id}/progress`
- **Body**:
```json
{
  "progress": 75,
  "actualHours": 60,
  "status": "InProgress",
  "comment": "順調に進捗中"
}
```

### Milestone API

#### GET /projects/{projectId}/milestones
**概要**: プロジェクトのマイルストーン一覧を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "name": "要件定義完了",
        "description": "全要件の合意取得",
        "targetDate": "2024-01-31",
        "actualDate": "2024-02-05",
        "status": "Achieved",
        "deliverables": ["uuid1", "uuid2"],
        "criteria": "全ステークホルダーの承認取得",
        "isKeyMilestone": true
      }
    ]
  }
}
```

#### POST /projects/{projectId}/milestones
**概要**: 新規マイルストーンを作成

#### PUT /milestones/{id}
**概要**: マイルストーンを更新

#### PUT /milestones/{id}/achieve
**概要**: マイルストーンを達成としてマーク

**リクエスト**:
- **Method**: PUT
- **URL**: `/milestones/{id}/achieve`
- **Body**:
```json
{
  "actualDate": "2024-02-05",
  "deliverables": ["uuid1", "uuid2"],
  "comment": "全ステークホルダーの承認を取得"
}
```

### Risk API

#### GET /projects/{projectId}/risks
**概要**: プロジェクトのリスク一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/projects/{projectId}/risks`
- **Parameters**:
  - `status` (query, optional): ステータスフィルタ
  - `category` (query, optional): カテゴリフィルタ
  - `minScore` (query, optional): 最小リスクスコア

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "code": "RISK-001",
        "title": "キーパーソン離任リスク",
        "description": "プロジェクトリーダーの異動可能性",
        "category": "External",
        "probability": "Medium",
        "impact": "High",
        "riskScore": 12,
        "status": "Mitigating",
        "owner": "uuid",
        "mitigationPlan": "後継者育成と知識移転",
        "contingencyPlan": "外部専門家の招聘",
        "identifiedDate": "2024-02-01",
        "targetResolutionDate": "2024-03-31"
      }
    ]
  }
}
```

#### POST /projects/{projectId}/risks
**概要**: 新規リスクを登録

**リクエスト**:
- **Method**: POST
- **URL**: `/projects/{projectId}/risks`
- **Body**:
```json
{
  "code": "RISK-001",
  "title": "キーパーソン離任リスク",
  "description": "プロジェクトリーダーの異動可能性",
  "category": "External",
  "probability": "Medium",
  "impact": "High",
  "owner": "uuid",
  "mitigationPlan": "後継者育成と知識移転",
  "contingencyPlan": "外部専門家の招聘"
}
```

#### PUT /risks/{id}
**概要**: リスクを更新

#### PUT /risks/{id}/assess
**概要**: リスクを再評価

**リクエスト**:
- **Method**: PUT
- **URL**: `/risks/{id}/assess`
- **Body**:
```json
{
  "probability": "Low",
  "impact": "Medium",
  "status": "Monitoring",
  "comment": "軽減策が効果を発揮"
}
```

### Deliverable API

#### GET /projects/{projectId}/deliverables
**概要**: プロジェクトの成果物一覧を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "milestoneId": "uuid",
        "name": "要件定義書",
        "description": "システム全体の要件定義",
        "type": "Document",
        "status": "Approved",
        "version": "1.0",
        "fileUrl": "https://storage.example.com/docs/requirements.pdf",
        "size": 2048576,
        "checksum": "sha256hash",
        "dueDate": "2024-01-31",
        "deliveredDate": "2024-02-05",
        "approvedBy": "uuid",
        "approvedDate": "2024-02-10"
      }
    ]
  }
}
```

#### POST /projects/{projectId}/deliverables
**概要**: 新規成果物を作成

#### PUT /deliverables/{id}
**概要**: 成果物を更新

#### POST /deliverables/{id}/versions
**概要**: 新しいバージョンを作成

**リクエスト**:
- **Method**: POST
- **URL**: `/deliverables/{id}/versions`
- **Body**:
```json
{
  "version": "1.1",
  "fileUrl": "https://storage.example.com/docs/requirements_v1.1.pdf",
  "size": 2150400,
  "checksum": "sha256hash",
  "changeDescription": "クライアントフィードバックを反映"
}
```

#### PUT /deliverables/{id}/approve
**概要**: 成果物を承認

**リクエスト**:
- **Method**: PUT
- **URL**: `/deliverables/{id}/approve`
- **Body**:
```json
{
  "approvedBy": "uuid",
  "approvedDate": "2024-02-10",
  "comment": "承認します"
}
```

### ProjectMember API

#### GET /projects/{projectId}/members
**概要**: プロジェクトメンバー一覧を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "userId": "uuid",
        "role": "PM",
        "allocationRate": 100,
        "startDate": "2024-01-01",
        "endDate": null,
        "responsibilities": "プロジェクト全体の統括",
        "skills": ["プロジェクト管理", "リーダーシップ"],
        "isActive": true
      }
    ]
  }
}
```

#### POST /projects/{projectId}/members
**概要**: メンバーをアサイン

**リクエスト**:
- **Method**: POST
- **URL**: `/projects/{projectId}/members`
- **Body**:
```json
{
  "userId": "uuid",
  "role": "Member",
  "allocationRate": 50,
  "startDate": "2024-02-01",
  "endDate": "2024-12-31",
  "responsibilities": "開発担当",
  "skills": ["Java", "React"]
}
```

#### PUT /projects/{projectId}/members/{memberId}
**概要**: メンバー情報を更新

#### DELETE /projects/{projectId}/members/{memberId}
**概要**: メンバーをアサイン解除

### ドメインサービスAPI

#### POST /projects/{projectId}/scheduling/critical-path
**概要**: クリティカルパスを計算

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "criticalPath": [
      {
        "taskId": "uuid",
        "taskName": "要件定義",
        "startDate": "2024-01-01",
        "endDate": "2024-01-31",
        "duration": 30,
        "slack": 0
      }
    ],
    "projectDuration": 365,
    "earliestCompletion": "2024-12-31",
    "latestCompletion": "2024-12-31"
  }
}
```

#### POST /projects/{projectId}/scheduling/optimize
**概要**: スケジュールを最適化

**リクエスト**:
- **Method**: POST
- **URL**: `/projects/{projectId}/scheduling/optimize`
- **Body**:
```json
{
  "constraints": {
    "maxDuration": 300,
    "resourceLimit": 10,
    "budgetLimit": 50000000
  },
  "objectives": ["minimizeDuration", "optimizeResources"]
}
```

#### POST /risks/assess
**概要**: リスクを評価

**リクエスト**:
- **Method**: POST
- **URL**: `/risks/assess`
- **Body**:
```json
{
  "probability": "Medium",
  "impact": "High",
  "category": "Technical"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "riskScore": 12,
    "level": "High",
    "recommendedActions": [
      "軽減策の立案",
      "週次モニタリング",
      "PMへのエスカレーション"
    ]
  }
}
```

#### GET /projects/{projectId}/risks/priority
**概要**: リスクを優先度順に取得

#### POST /projects/{projectId}/resources/allocate
**概要**: リソースを最適配分

**リクエスト**:
- **Method**: POST
- **URL**: `/projects/{projectId}/resources/allocate`
- **Body**:
```json
{
  "members": [
    {"userId": "uuid1", "availableHours": 160},
    {"userId": "uuid2", "availableHours": 80}
  ],
  "tasks": ["uuid1", "uuid2", "uuid3"]
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "allocations": [
      {
        "taskId": "uuid1",
        "assigneeId": "uuid1",
        "allocatedHours": 80,
        "reason": "スキルマッチ度: 95%"
      }
    ],
    "optimization": {
      "utilizationRate": 0.85,
      "skillMatchScore": 0.92
    }
  }
}
```

#### GET /users/{userId}/utilization
**概要**: ユーザーの稼働率を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/users/{userId}/utilization`
- **Parameters**:
  - `startDate` (query, required): 開始日
  - `endDate` (query, required): 終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "utilizationRate": 85,
    "allocatedHours": 136,
    "availableHours": 160,
    "projects": [
      {
        "projectId": "uuid",
        "projectName": "DXプロジェクト",
        "allocationRate": 50,
        "hours": 80
      }
    ]
  }
}
```

## エラーコード

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| INVALID_REQUEST | 400 | リクエストが不正 |
| UNAUTHORIZED | 401 | 認証が必要 |
| FORBIDDEN | 403 | アクセス権限なし |
| NOT_FOUND | 404 | リソースが見つからない |
| CONFLICT | 409 | リソースの競合（コード重複等） |
| VALIDATION_ERROR | 422 | バリデーションエラー |
| BUSINESS_RULE_VIOLATION | 422 | ビジネスルール違反 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

### ビジネスルール違反の詳細エラーコード

| コード | 説明 |
|--------|------|
| PROJECT_CODE_DUPLICATE | プロジェクトコードが重複 |
| BUDGET_EXCEEDED | 予算超過 |
| INVALID_STATUS_TRANSITION | 不正なステータス遷移 |
| CIRCULAR_DEPENDENCY | タスクの循環依存 |
| TASK_NOT_IN_PROJECT_PERIOD | タスクがプロジェクト期間外 |
| OVERALLOCATION | リソースの過剰配分 |
| RISK_SCORE_INVALID | リスクスコアの計算エラー |
| DELIVERABLE_VERSION_CONFLICT | 成果物バージョンの競合 |

## レート制限
- **一般API**: 1000リクエスト/時間
- **重い処理（最適化、計算）**: 100リクエスト/時間
- **制限時のレスポンス**: 429 Too Many Requests

## バージョン管理
- **現在**: v1.0.0
- **サポート**: v1.x系をサポート
- **廃止予定**: なし

## Webhooks

### 対応イベント
- `project.created`: プロジェクト作成時
- `project.status_changed`: ステータス変更時
- `task.completed`: タスク完了時
- `milestone.achieved`: マイルストーン達成時
- `risk.identified`: リスク特定時
- `deliverable.approved`: 成果物承認時

### Webhook設定
```json
POST /webhooks
{
  "url": "https://client.example.com/webhook",
  "events": ["project.created", "task.completed"],
  "secret": "webhook_secret"
}
```

### Webhookペイロード例
```json
{
  "event": "task.completed",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "taskId": "uuid",
    "projectId": "uuid",
    "completedBy": "uuid",
    "actualHours": 80
  }
}
```
