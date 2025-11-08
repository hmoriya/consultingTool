# パラソルV3 MVP API仕様書

## 概要

パラソルV3 MVP（タスク管理境界コンテキスト）のRESTful API仕様書。全8オペレーションに対応するエンドポイントとデータ形式を定義。

## バージョン情報

| 項目 | 内容 |
|------|------|
| バージョン | 1.0 |
| 作成日 | 2024-11-05 |
| 作成者 | Claude Code |
| 対象システム | パラソルV3 MVP - BC-001タスク管理 |
| APIバージョン | v1 |
| ベースURL | `/api/v1` |

---

## 1. API設計原則

### 1.1 REST原則
- **リソース指向**: URIはリソースを表現
- **HTTPメソッド**: 標準的なHTTPメソッドを使用
- **ステートレス**: セッション状態を保持しない
- **階層構造**: リソースの階層関係をURIで表現

### 1.2 命名規則
- **URIパス**: ケバブケース（例: `/task-assignments`）
- **JSONキー**: キャメルケース（例: `createdAt`）
- **エラーコード**: スネークケース（例: `INVALID_TASK_STATUS`）

### 1.3 認証・認可
- **認証方式**: JWT Bearer Token
- **権限制御**: ロールベースアクセス制御（RBAC）
- **セキュリティヘッダー**: 必須セキュリティヘッダーの設定

---

## 2. 共通仕様

### 2.1 リクエストヘッダー

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
Accept: application/json
X-Request-ID: <UUID>
```

### 2.2 レスポンス形式

#### 成功レスポンス
```json
{
  "success": true,
  "data": { /* レスポンスデータ */ },
  "timestamp": "2024-11-05T10:30:00Z",
  "requestId": "uuid-v4"
}
```

#### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": [
      {
        "field": "title",
        "message": "タスク名は必須です"
      }
    ]
  },
  "timestamp": "2024-11-05T10:30:00Z",
  "requestId": "uuid-v4"
}
```

### 2.3 ページネーション

```json
{
  "success": true,
  "data": {
    "items": [ /* データ配列 */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 3. Operation 1: タスク作成 (op-001-create-task)

### 3.1 タスクテンプレート一覧取得

```http
GET /api/v1/task-templates
```

**レスポンス**:
```json
{
  "success": true,
  "data": [
    {
      "id": "template-001",
      "name": "開発タスクテンプレート",
      "description": "ソフトウェア開発向けテンプレート",
      "fields": [
        {
          "name": "title",
          "type": "text",
          "required": true,
          "label": "タスク名"
        }
      ]
    }
  ]
}
```

### 3.2 タスク作成

```http
POST /api/v1/tasks
```

**リクエスト**:
```json
{
  "title": "ログイン機能の実装",
  "description": "ユーザー認証システムの実装",
  "projectId": "project-001",
  "priority": "HIGH",
  "dueDate": "2024-11-15",
  "estimatedHours": 16,
  "assigneeIds": ["user-001"],
  "dependencies": ["task-002"],
  "tags": ["backend", "security"]
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "task-001",
    "title": "ログイン機能の実装",
    "status": "TODO",
    "createdAt": "2024-11-05T10:30:00Z",
    "createdBy": "user-001"
  }
}
```

### 3.3 タスク検証

```http
POST /api/v1/tasks/validate
```

**リクエスト**:
```json
{
  "title": "サンプルタスク",
  "dueDate": "2024-11-15",
  "dependencies": ["task-002"]
}
```

---

## 4. Operation 2: タスクアサイン (op-002-assign-task)

### 4.1 アサイン可能ユーザー検索

```http
GET /api/v1/users/available?skills=backend,frontend&workload=low
```

**レスポンス**:
```json
{
  "success": true,
  "data": [
    {
      "id": "user-001",
      "name": "田中太郎",
      "email": "tanaka@example.com",
      "skills": ["backend", "frontend"],
      "currentWorkload": 75,
      "availability": "available"
    }
  ]
}
```

### 4.2 タスクアサイン実行

```http
POST /api/v1/tasks/{taskId}/assignments
```

**リクエスト**:
```json
{
  "userId": "user-001",
  "role": "assignee",
  "dueDate": "2024-11-15",
  "notes": "優先度高のため早急対応お願いします"
}
```

### 4.3 アサイン解除

```http
DELETE /api/v1/tasks/{taskId}/assignments/{userId}
```

---

## 5. Operation 3: 進捗更新 (op-003-update-progress)

### 5.1 進捗率更新

```http
PATCH /api/v1/tasks/{taskId}/progress
```

**リクエスト**:
```json
{
  "completionRate": 50,
  "status": "IN_PROGRESS",
  "notes": "設計書作成完了、実装開始",
  "actualHours": 8
}
```

### 5.2 時間記録

```http
POST /api/v1/tasks/{taskId}/time-logs
```

**リクエスト**:
```json
{
  "startTime": "2024-11-05T09:00:00Z",
  "endTime": "2024-11-05T12:00:00Z",
  "description": "設計書作成",
  "category": "development"
}
```

### 5.3 成果物アップロード

```http
POST /api/v1/tasks/{taskId}/attachments
Content-Type: multipart/form-data
```

**リクエスト**:
```
file: [バイナリファイル]
description: 設計書
category: document
```

---

## 6. Operation 4: タスク完了 (op-004-complete-task)

### 6.1 完了チェックリスト取得

```http
GET /api/v1/tasks/{taskId}/completion-checklist
```

### 6.2 タスク完了実行

```http
POST /api/v1/tasks/{taskId}/complete
```

**リクエスト**:
```json
{
  "completionNotes": "すべての機能が正常に動作することを確認",
  "actualHours": 20,
  "deliverables": [
    {
      "name": "ソースコード",
      "url": "/attachments/source-code.zip"
    }
  ],
  "retrospective": {
    "whatWentWell": "設計通りに実装できた",
    "whatToImprove": "テスト期間をもう少し長く取るべきだった"
  }
}
```

---

## 7. Operation 5: タスクレビュー (op-005-review-task)

### 7.1 レビュー開始

```http
POST /api/v1/tasks/{taskId}/reviews
```

**リクエスト**:
```json
{
  "reviewerId": "user-002",
  "reviewType": "code_review",
  "criteria": [
    "code_quality",
    "performance",
    "security"
  ]
}
```

### 7.2 レビュー結果提出

```http
PATCH /api/v1/tasks/{taskId}/reviews/{reviewId}
```

**リクエスト**:
```json
{
  "status": "approved",
  "score": 85,
  "feedback": "全体的に良好。一部リファクタリング推奨箇所あり",
  "improvements": [
    {
      "category": "code_quality",
      "description": "例外処理の強化が必要"
    }
  ]
}
```

---

## 8. Operation 6: タスクコラボレーション (op-006-collaborate-task)

### 8.1 コラボレーション開始

```http
POST /api/v1/tasks/{taskId}/collaborations
```

### 8.2 リアルタイムコメント

```http
POST /api/v1/tasks/{taskId}/comments
```

**リクエスト**:
```json
{
  "content": "@田中さん 実装方針について相談があります",
  "mentions": ["user-001"],
  "attachments": ["screenshot.png"]
}
```

### 8.3 意思決定記録

```http
POST /api/v1/tasks/{taskId}/decisions
```

**リクエスト**:
```json
{
  "title": "データベース設計方針決定",
  "description": "NoSQLを採用することに決定",
  "participants": ["user-001", "user-002"],
  "rationale": "スケーラビリティを重視"
}
```

---

## 9. Operation 7: 進捗監視 (op-007-monitor-progress)

### 9.1 進捗ダッシュボードデータ

```http
GET /api/v1/monitoring/dashboard?projectId=project-001
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTasks": 50,
      "completedTasks": 20,
      "inProgressTasks": 15,
      "overdueTasks": 3
    },
    "progressTrend": [
      {
        "date": "2024-11-01",
        "completionRate": 35
      }
    ],
    "bottlenecks": [
      {
        "taskId": "task-005",
        "reason": "dependency_blocked",
        "duration": 5
      }
    ]
  }
}
```

### 9.2 アラート設定

```http
POST /api/v1/monitoring/alerts
```

**リクエスト**:
```json
{
  "type": "deadline_approaching",
  "criteria": {
    "daysBeforeDeadline": 2,
    "taskStatus": ["TODO", "IN_PROGRESS"]
  },
  "notifications": {
    "email": true,
    "slack": true
  }
}
```

---

## 10. Operation 8: パフォーマンス分析 (op-008-analyze-performance)

### 10.1 パフォーマンス概要取得

```http
GET /api/v1/analytics/performance?period=last_30_days&groupBy=user
```

### 10.2 効率性分析

```http
GET /api/v1/analytics/efficiency
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "averageCompletionTime": 5.2,
    "estimationAccuracy": 78,
    "productivityTrend": "increasing",
    "recommendations": [
      {
        "type": "process_improvement",
        "description": "レビュー時間の短縮により全体効率が15%向上見込み"
      }
    ]
  }
}
```

### 10.3 予測分析

```http
GET /api/v1/analytics/predictions?projectId=project-001
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "expectedCompletionDate": "2024-12-15",
    "confidence": 85,
    "riskFactors": [
      {
        "factor": "resource_shortage",
        "impact": "medium",
        "mitigation": "追加リソースの確保"
      }
    ]
  }
}
```

---

## 11. WebSocket API（リアルタイム通信）

### 11.1 接続

```javascript
const ws = new WebSocket('wss://api.example.com/ws/v1/tasks/{taskId}');
```

### 11.2 イベント

```json
{
  "type": "task_updated",
  "data": {
    "taskId": "task-001",
    "field": "status",
    "oldValue": "TODO",
    "newValue": "IN_PROGRESS",
    "updatedBy": "user-001",
    "timestamp": "2024-11-05T10:30:00Z"
  }
}
```

---

## 12. エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|----------------|------|
| `VALIDATION_ERROR` | 400 | 入力値検証エラー |
| `UNAUTHORIZED` | 401 | 認証エラー |
| `FORBIDDEN` | 403 | 権限エラー |
| `TASK_NOT_FOUND` | 404 | タスクが見つからない |
| `TASK_ALREADY_COMPLETED` | 409 | タスクは既に完了済み |
| `DEPENDENCY_CONFLICT` | 409 | 依存関係の競合 |
| `ASSIGNMENT_LIMIT_EXCEEDED` | 422 | アサイン上限超過 |
| `INTERNAL_SERVER_ERROR` | 500 | サーバー内部エラー |

---

## 13. レート制限

### 13.1 制限値
- **一般API**: 1000リクエスト/時間
- **アップロードAPI**: 100リクエスト/時間
- **分析API**: 500リクエスト/時間

### 13.2 レスポンスヘッダー
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1699200000
```

---

## 14. API使用例

### 14.1 タスク作成からアサインまでの流れ

```javascript
// 1. タスク作成
const task = await fetch('/api/v1/tasks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'ログイン機能実装',
    projectId: 'project-001',
    priority: 'HIGH'
  })
});

// 2. アサイン可能ユーザー検索
const users = await fetch('/api/v1/users/available?skills=backend');

// 3. タスクアサイン
const assignment = await fetch(`/api/v1/tasks/${task.id}/assignments`, {
  method: 'POST',
  body: JSON.stringify({
    userId: 'user-001',
    role: 'assignee'
  })
});
```

---

## 15. 更新履歴

| バージョン | 更新日 | 更新者 | 更新内容 |
|-----------|--------|---------|----------|
| 1.0 | 2024-11-05 | Claude Code | 初版作成 |

---

## 16. 関連ドキュメント

- [ドメイン言語定義書](domain-language.md)
- [データベース設計書](database-design.md)
- [統合仕様書](integration-specification.md)
- [MVP実装計画書](mvp-implementation-plan.md)