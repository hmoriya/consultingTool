# API仕様: 生産性可視化サービス

## API概要
**目的**: タイムシート管理、工数追跡、稼働率分析、生産性測定を通じて、個人とチームの生産性を可視化するRESTful API
**バージョン**: v1.0.0
**ベースURL**: `https://api.example.com/v1/productivity-visualization`

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

### Timesheet API

#### GET /timesheets
**概要**: タイムシート一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/timesheets`
- **Parameters**:
  - `userId` (query, optional): ユーザーID
  - `periodStart` (query, optional): 期間開始日（YYYY-MM-DD）
  - `periodEnd` (query, optional): 期間終了日（YYYY-MM-DD）
  - `status` (query, optional): ステータス（Draft/Submitted/Approved/Rejected/Revised）
  - `page` (query, optional): ページ番号 (default: 1)
  - `limit` (query, optional): 件数 (default: 20, max: 100)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "periodStart": "2024-01-01",
        "periodEnd": "2024-01-07",
        "totalHours": 40.0,
        "billableHours": 32.0,
        "nonBillableHours": 8.0,
        "overtimeHours": 0.0,
        "status": "Approved",
        "submittedAt": "2024-01-08T09:00:00Z",
        "approvedAt": "2024-01-08T14:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-08T14:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

#### POST /timesheets
**概要**: 新規タイムシートを作成

**リクエスト**:
- **Method**: POST
- **URL**: `/timesheets`
- **Body**:
```json
{
  "userId": "uuid",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-07",
  "comments": "週次タイムシート"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-07",
    "totalHours": 0.0,
    "billableHours": 0.0,
    "nonBillableHours": 0.0,
    "overtimeHours": 0.0,
    "status": "Draft",
    "comments": "週次タイムシート",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /timesheets/{id}
**概要**: 特定タイムシートの詳細を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/timesheets/{id}`
- **Path Parameters**:
  - `id` (required): タイムシートID (UUID形式)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-07",
    "totalHours": 40.0,
    "billableHours": 32.0,
    "nonBillableHours": 8.0,
    "overtimeHours": 0.0,
    "status": "Approved",
    "submittedAt": "2024-01-08T09:00:00Z",
    "approvedAt": "2024-01-08T14:00:00Z",
    "approvedBy": "uuid",
    "comments": "週次タイムシート",
    "entries": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "taskId": "uuid",
        "date": "2024-01-01",
        "hours": 8.0,
        "billable": true,
        "activityType": "Development",
        "description": "機能実装"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-08T14:00:00Z"
  }
}
```

#### PUT /timesheets/{id}
**概要**: タイムシートを更新

**リクエスト**:
- **Method**: PUT
- **URL**: `/timesheets/{id}`
- **Body**:
```json
{
  "comments": "更新後のコメント"
}
```

#### DELETE /timesheets/{id}
**概要**: タイムシートを削除（Draft状態のみ可能）

**リクエスト**:
- **Method**: DELETE
- **URL**: `/timesheets/{id}`

#### PUT /timesheets/{id}/submit
**概要**: タイムシートを提出

**リクエスト**:
- **Method**: PUT
- **URL**: `/timesheets/{id}/submit`
- **Body**:
```json
{
  "submittedBy": "uuid",
  "submittedAt": "2024-01-08T09:00:00Z"
}
```

#### PUT /timesheets/{id}/approve
**概要**: タイムシートを承認

**リクエスト**:
- **Method**: PUT
- **URL**: `/timesheets/{id}/approve`
- **Body**:
```json
{
  "approvedBy": "uuid",
  "approvedAt": "2024-01-08T14:00:00Z",
  "comments": "承認します"
}
```

#### PUT /timesheets/{id}/reject
**概要**: タイムシートを却下

**リクエスト**:
- **Method**: PUT
- **URL**: `/timesheets/{id}/reject`
- **Body**:
```json
{
  "approvedBy": "uuid",
  "rejectionReason": "工数の根拠が不明確",
  "comments": "詳細な説明を追加してください"
}
```

### TimeEntry API

#### GET /timesheets/{timesheetId}/entries
**概要**: タイムシートの工数記録一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/timesheets/{timesheetId}/entries`
- **Parameters**:
  - `projectId` (query, optional): プロジェクトID
  - `date` (query, optional): 作業日
  - `billable` (query, optional): 課金対象フラグ (true/false)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "timesheetId": "uuid",
        "userId": "uuid",
        "projectId": "uuid",
        "taskId": "uuid",
        "activityType": "Development",
        "date": "2024-01-01",
        "startTime": "09:00:00",
        "endTime": "17:00:00",
        "hours": 8.0,
        "billable": true,
        "description": "機能実装作業",
        "location": "Office",
        "tags": ["Frontend", "React"],
        "createdAt": "2024-01-01T17:30:00Z",
        "updatedAt": "2024-01-01T17:30:00Z"
      }
    ]
  }
}
```

#### POST /timesheets/{timesheetId}/entries
**概要**: 新規工数記録を作成

**リクエスト**:
- **Method**: POST
- **URL**: `/timesheets/{timesheetId}/entries`
- **Body**:
```json
{
  "userId": "uuid",
  "projectId": "uuid",
  "taskId": "uuid",
  "activityType": "Development",
  "date": "2024-01-01",
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "hours": 8.0,
  "billable": true,
  "description": "機能実装作業",
  "location": "Office",
  "tags": ["Frontend", "React"]
}
```

#### PUT /entries/{id}
**概要**: 工数記録を更新

**リクエスト**:
- **Method**: PUT
- **URL**: `/entries/{id}`
- **Body**:
```json
{
  "hours": 7.5,
  "description": "機能実装作業（修正版）"
}
```

#### DELETE /entries/{id}
**概要**: 工数記録を削除

**リクエスト**:
- **Method**: DELETE
- **URL**: `/entries/{id}`

### WorkPattern API

#### GET /work-patterns
**概要**: 勤務パターン一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/work-patterns`
- **Parameters**:
  - `userId` (query, optional): ユーザーID
  - `isDefault` (query, optional): デフォルトフラグ

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "標準勤務",
        "isDefault": true,
        "weeklyHours": 40.0,
        "dailyHours": 8.0,
        "workDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "startTime": "09:00:00",
        "endTime": "18:00:00",
        "breakDuration": "PT1H",
        "flexTime": false,
        "effectiveFrom": "2024-01-01",
        "effectiveTo": null,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /work-patterns
**概要**: 新規勤務パターンを作成

**リクエスト**:
- **Method**: POST
- **URL**: `/work-patterns`
- **Body**:
```json
{
  "userId": "uuid",
  "name": "フレックスタイム",
  "isDefault": false,
  "weeklyHours": 40.0,
  "dailyHours": 8.0,
  "workDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "startTime": "09:00:00",
  "endTime": "18:00:00",
  "breakDuration": "PT1H",
  "flexTime": true,
  "coreTimeStart": "10:00:00",
  "coreTimeEnd": "15:00:00",
  "effectiveFrom": "2024-04-01"
}
```

#### PUT /work-patterns/{id}
**概要**: 勤務パターンを更新

#### DELETE /work-patterns/{id}
**概要**: 勤務パターンを削除

### UtilizationRate API

#### GET /utilization-rates
**概要**: 稼働率一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/utilization-rates`
- **Parameters**:
  - `userId` (query, optional): ユーザーID
  - `teamId` (query, optional): チームID
  - `periodType` (query, optional): 期間タイプ（Daily/Weekly/Monthly/Quarterly）
  - `periodStart` (query, optional): 期間開始日
  - `periodEnd` (query, optional): 期間終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "teamId": null,
        "periodType": "Weekly",
        "periodStart": "2024-01-01",
        "periodEnd": "2024-01-07",
        "availableHours": 40.0,
        "plannedHours": 40.0,
        "actualHours": 38.0,
        "billableHours": 32.0,
        "utilizationRate": 95.0,
        "billableRate": 84.2,
        "productivityIndex": 1.05,
        "createdAt": "2024-01-08T00:00:00Z",
        "updatedAt": "2024-01-08T00:00:00Z"
      }
    ]
  }
}
```

#### POST /utilization-rates/calculate
**概要**: 稼働率を計算して記録

**リクエスト**:
- **Method**: POST
- **URL**: `/utilization-rates/calculate`
- **Body**:
```json
{
  "userId": "uuid",
  "periodType": "Weekly",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-07"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "periodType": "Weekly",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-07",
    "availableHours": 40.0,
    "plannedHours": 40.0,
    "actualHours": 38.0,
    "billableHours": 32.0,
    "utilizationRate": 95.0,
    "billableRate": 84.2,
    "productivityIndex": 1.05,
    "createdAt": "2024-01-08T00:00:00Z",
    "updatedAt": "2024-01-08T00:00:00Z"
  }
}
```

#### GET /utilization-rates/team/{teamId}
**概要**: チーム稼働率を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/utilization-rates/team/{teamId}`
- **Parameters**:
  - `periodType` (query, required): 期間タイプ
  - `periodStart` (query, required): 期間開始日
  - `periodEnd` (query, required): 期間終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "teamId": "uuid",
    "periodType": "Monthly",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-31",
    "members": [
      {
        "userId": "uuid",
        "userName": "山田太郎",
        "utilizationRate": 95.0,
        "billableRate": 84.2
      }
    ],
    "teamAverage": {
      "utilizationRate": 87.5,
      "billableRate": 78.3
    }
  }
}
```

### ProductivityMetric API

#### GET /productivity-metrics
**概要**: 生産性指標一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/productivity-metrics`
- **Parameters**:
  - `userId` (query, optional): ユーザーID
  - `teamId` (query, optional): チームID
  - `projectId` (query, optional): プロジェクトID
  - `metricType` (query, optional): 指標タイプ（Velocity/Efficiency/Quality/Output）

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "teamId": null,
        "projectId": "uuid",
        "metricType": "Velocity",
        "periodStart": "2024-01-01",
        "periodEnd": "2024-01-31",
        "metricValue": 42.0,
        "targetValue": 40.0,
        "unit": "StoryPoints",
        "trend": "Improving",
        "calculationMethod": "完了したストーリーポイントの合計",
        "createdAt": "2024-02-01T00:00:00Z",
        "updatedAt": "2024-02-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /productivity-metrics
**概要**: 生産性指標を記録

**リクエスト**:
- **Method**: POST
- **URL**: `/productivity-metrics`
- **Body**:
```json
{
  "userId": "uuid",
  "projectId": "uuid",
  "metricType": "Efficiency",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-31",
  "metricValue": 1.25,
  "targetValue": 1.0,
  "unit": "Tasks/Day",
  "calculationMethod": "完了タスク数 / 実働日数"
}
```

### ドメインサービスAPI

#### POST /timesheets/{id}/calculate
**概要**: タイムシートの合計工数を計算

**リクエスト**:
- **Method**: POST
- **URL**: `/timesheets/{id}/calculate`

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "timesheetId": "uuid",
    "totalHours": 40.0,
    "billableHours": 32.0,
    "nonBillableHours": 8.0,
    "overtimeHours": 0.0,
    "billableRate": 80.0
  }
}
```

#### POST /utilization/analyze
**概要**: 稼働率の詳細分析

**リクエスト**:
- **Method**: POST
- **URL**: `/utilization/analyze`
- **Body**:
```json
{
  "userId": "uuid",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-31"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "utilizationRate": 87.5,
    "billableRate": 78.3,
    "weeklyBreakdown": [
      {
        "week": 1,
        "utilizationRate": 90.0,
        "billableRate": 80.0
      }
    ],
    "projectBreakdown": [
      {
        "projectId": "uuid",
        "projectName": "DXプロジェクト",
        "hours": 120.0,
        "percentage": 75.0
      }
    ],
    "recommendations": [
      "非課金時間が多いため、タスクの見直しを検討してください"
    ]
  }
}
```

#### GET /productivity/compare
**概要**: 生産性の比較分析

**リクエスト**:
- **Method**: GET
- **URL**: `/productivity/compare`
- **Parameters**:
  - `userIds` (query, required): ユーザーIDのリスト（カンマ区切り）
  - `periodStart` (query, required): 期間開始日
  - `periodEnd` (query, required): 期間終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "comparisons": [
      {
        "userId": "uuid1",
        "userName": "山田太郎",
        "utilizationRate": 95.0,
        "billableRate": 84.2,
        "productivity": {
          "efficiency": 8.5,
          "quality": 9.0,
          "timeliness": 8.0,
          "overall": 8.5
        }
      },
      {
        "userId": "uuid2",
        "userName": "佐藤花子",
        "utilizationRate": 88.0,
        "billableRate": 76.5,
        "productivity": {
          "efficiency": 7.5,
          "quality": 8.5,
          "timeliness": 9.0,
          "overall": 8.3
        }
      }
    ],
    "teamAverage": {
      "utilizationRate": 91.5,
      "billableRate": 80.4,
      "productivity": {
        "efficiency": 8.0,
        "quality": 8.8,
        "timeliness": 8.5,
        "overall": 8.4
      }
    }
  }
}
```

#### GET /timesheets/pending-approval
**概要**: 承認待ちタイムシート一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/timesheets/pending-approval`
- **Parameters**:
  - `approverId` (query, required): 承認者ID

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "山田太郎",
        "periodStart": "2024-01-01",
        "periodEnd": "2024-01-07",
        "totalHours": 40.0,
        "submittedAt": "2024-01-08T09:00:00Z",
        "workflow": {
          "currentStep": 1,
          "totalSteps": 2,
          "status": "Pending"
        }
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
| CONFLICT | 409 | リソースの競合（期間重複等） |
| VALIDATION_ERROR | 422 | バリデーションエラー |
| BUSINESS_RULE_VIOLATION | 422 | ビジネスルール違反 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

### ビジネスルール違反の詳細エラーコード

| コード | 説明 |
|--------|------|
| TIMESHEET_PERIOD_OVERLAP | タイムシート期間が重複 |
| TIMESHEET_ALREADY_APPROVED | タイムシートは既に承認済み |
| TIMESHEET_NOT_EDITABLE | 承認済みタイムシートは編集不可 |
| DAILY_HOURS_EXCEEDED | 1日24時間を超過 |
| WEEKLY_HOURS_EXCEEDED | 週60時間を超過 |
| INVALID_TIME_RANGE | 開始時刻が終了時刻より後 |
| PAST_ENTRY_NOT_EDITABLE | 2週間以上前の記録は編集不可 |
| INVALID_WORK_PATTERN | 勤務パターンが不正 |
| DEFAULT_PATTERN_EXISTS | デフォルトパターンは既に存在 |

## レート制限
- **一般API**: 1000リクエスト/時間
- **計算処理**: 100リクエスト/時間
- **制限時のレスポンス**: 429 Too Many Requests

## バージョン管理
- **現在**: v1.0.0
- **サポート**: v1.x系をサポート
- **廃止予定**: なし

## Webhooks

### 対応イベント
- `timesheet.submitted`: タイムシート提出時
- `timesheet.approved`: タイムシート承認時
- `timesheet.rejected`: タイムシート却下時
- `overtime.detected`: 残業検出時
- `low_utilization.detected`: 低稼働率検出時

### Webhook設定
```json
POST /webhooks
{
  "url": "https://client.example.com/webhook",
  "events": ["timesheet.approved", "overtime.detected"],
  "secret": "webhook_secret"
}
```

### Webhookペイロード例
```json
{
  "event": "timesheet.approved",
  "timestamp": "2024-01-08T14:00:00Z",
  "data": {
    "timesheetId": "uuid",
    "userId": "uuid",
    "approvedBy": "uuid",
    "billableHours": 32.0,
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-07"
  }
}
```
