# BC-005: タイムシート管理API

**ドキュメント**: API層 - タイムシート管理
**最終更新**: 2025-11-03

このドキュメントでは、タイムシートの作成、提出、承認、稼働率分析APIを定義します。

---

## 目次

1. [タイムシート基本管理](#timesheet-basic)
2. [タイムシート明細管理](#timesheet-entries)
3. [承認ワークフロー](#approval-workflow)
4. [稼働率分析](#utilization-analysis)

---

## タイムシート基本管理 {#timesheet-basic}

### タイムシート作成

```
POST /api/bc-005/timesheets
```

**リクエスト**:
```json
{
  "resourceId": "resource-uuid",
  "periodStart": "2025-11-04",
  "periodEnd": "2025-11-10",
  "periodType": "WEEKLY"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "timesheet-uuid",
    "resourceId": "resource-uuid",
    "resourceName": "山田太郎",
    "periodStart": "2025-11-04",
    "periodEnd": "2025-11-10",
    "periodType": "WEEKLY",
    "weekNumber": 45,
    "totalHours": 0.0,
    "billableHours": 0.0,
    "nonBillableHours": 0.0,
    "status": "DRAFT",
    "entryCount": 0,
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**期間タイプ**:
- `WEEKLY`: 週次（月曜日-日曜日）
- `MONTHLY`: 月次
- `CUSTOM`: カスタム期間

---

### タイムシート取得

```
GET /api/bc-005/timesheets/{timesheetId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "timesheet-uuid",
    "resourceId": "resource-uuid",
    "resourceName": "山田太郎",
    "periodStart": "2025-11-04",
    "periodEnd": "2025-11-10",
    "periodType": "WEEKLY",
    "weekNumber": 45,
    "entries": [
      {
        "id": "entry-uuid",
        "date": "2025-11-04",
        "projectId": "project-alpha-uuid",
        "projectName": "Project Alpha",
        "taskType": "DEVELOPMENT",
        "hours": 8.0,
        "description": "API開発",
        "billable": true
      }
    ],
    "totalHours": 42.0,
    "billableHours": 38.0,
    "nonBillableHours": 4.0,
    "status": "SUBMITTED",
    "submittedAt": "2025-11-11T09:00:00Z",
    "approvedBy": null,
    "approvedAt": null,
    "createdAt": "2025-11-03T12:00:00Z",
    "updatedAt": "2025-11-11T09:00:00Z"
  }
}
```

---

### タイムシート一覧取得

```
GET /api/bc-005/timesheets?resourceId=resource-uuid&status=SUBMITTED&startDate=2025-11-01&endDate=2025-11-30
```

**クエリパラメータ**:
- `resourceId` (optional): リソースID
- `status` (optional): DRAFT | SUBMITTED | APPROVED | REJECTED
- `startDate` (optional): 期間開始日以降
- `endDate` (optional): 期間終了日以前
- `projectId` (optional): プロジェクトID
- `page` (optional): ページ番号
- `pageSize` (optional): ページサイズ

**レスポンス**:
```json
{
  "data": [
    {
      "id": "timesheet-uuid",
      "resourceId": "resource-uuid",
      "resourceName": "山田太郎",
      "periodStart": "2025-11-04",
      "periodEnd": "2025-11-10",
      "weekNumber": 45,
      "totalHours": 42.0,
      "billableHours": 38.0,
      "status": "SUBMITTED",
      "submittedAt": "2025-11-11T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 48,
    "totalPages": 1
  },
  "summary": {
    "totalTimesheets": 48,
    "totalHours": 1920.0,
    "avgHoursPerWeek": 40.0,
    "byStatus": {
      "DRAFT": 2,
      "SUBMITTED": 5,
      "APPROVED": 38,
      "REJECTED": 3
    }
  }
}
```

---

### タイムシート更新

```
PUT /api/bc-005/timesheets/{timesheetId}
```

**リクエスト**:
```json
{
  "periodEnd": "2025-11-11"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "timesheet-uuid",
    "periodEnd": "2025-11-11",
    "updatedAt": "2025-11-03T13:00:00Z"
  }
}
```

**エラー**:
- `BC005_ERR_400`: Timesheet not found
- `BC005_ERR_401`: Timesheet already submitted
- `BC005_ERR_403`: Cannot modify approved timesheet

---

### タイムシート削除

```
DELETE /api/bc-005/timesheets/{timesheetId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "timesheet-uuid",
    "status": "deleted",
    "deletedAt": "2025-11-03T13:00:00Z"
  }
}
```

**エラー**:
- `BC005_ERR_403`: Cannot delete approved timesheet

---

## タイムシート明細管理 {#timesheet-entries}

### 明細追加

```
POST /api/bc-005/timesheets/{timesheetId}/entries
```

**リクエスト**:
```json
{
  "date": "2025-11-04",
  "projectId": "project-alpha-uuid",
  "taskType": "DEVELOPMENT",
  "hours": 8.0,
  "description": "API開発 - 認証機能実装",
  "billable": true
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "entry-uuid",
    "timesheetId": "timesheet-uuid",
    "date": "2025-11-04",
    "projectId": "project-alpha-uuid",
    "projectName": "Project Alpha",
    "taskType": "DEVELOPMENT",
    "hours": 8.0,
    "description": "API開発 - 認証機能実装",
    "billable": true,
    "createdAt": "2025-11-03T12:00:00Z"
  },
  "timesheetSummary": {
    "totalHours": 8.0,
    "billableHours": 8.0,
    "nonBillableHours": 0.0,
    "entryCount": 1
  }
}
```

**エラー**:
- `BC005_ERR_402`: Total hours exceed daily limit (24 hours)
- `BC005_ERR_404`: Timesheet period is invalid
- `BC005_ERR_500`: Project not found in BC-001

**タスクタイプ**:
- `DEVELOPMENT`: 開発
- `DESIGN`: 設計
- `TESTING`: テスト
- `DOCUMENTATION`: ドキュメンテーション
- `MEETING`: 会議
- `TRAINING`: トレーニング
- `SUPPORT`: サポート
- `MANAGEMENT`: マネジメント
- `RESEARCH`: 調査・研究
- `OTHER`: その他

---

### 明細更新

```
PUT /api/bc-005/timesheets/{timesheetId}/entries/{entryId}
```

**リクエスト**:
```json
{
  "hours": 6.5,
  "description": "API開発 - 認証機能実装（完了）"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "entry-uuid",
    "hours": 6.5,
    "description": "API開発 - 認証機能実装（完了）",
    "updatedAt": "2025-11-03T14:00:00Z"
  },
  "timesheetSummary": {
    "totalHours": 40.5,
    "billableHours": 36.5,
    "nonBillableHours": 4.0
  }
}
```

---

### 明細削除

```
DELETE /api/bc-005/timesheets/{timesheetId}/entries/{entryId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "entry-uuid",
    "status": "deleted",
    "deletedAt": "2025-11-03T14:00:00Z"
  },
  "timesheetSummary": {
    "totalHours": 34.5,
    "billableHours": 30.5,
    "nonBillableHours": 4.0
  }
}
```

---

### 一括明細追加

```
POST /api/bc-005/timesheets/{timesheetId}/entries/bulk
```

**リクエスト**:
```json
{
  "entries": [
    {
      "date": "2025-11-04",
      "projectId": "project-alpha-uuid",
      "taskType": "DEVELOPMENT",
      "hours": 8.0,
      "description": "API開発",
      "billable": true
    },
    {
      "date": "2025-11-05",
      "projectId": "project-alpha-uuid",
      "taskType": "DEVELOPMENT",
      "hours": 8.0,
      "description": "データベース設計",
      "billable": true
    },
    {
      "date": "2025-11-05",
      "projectId": null,
      "taskType": "TRAINING",
      "hours": 2.0,
      "description": "社内トレーニング参加",
      "billable": false
    }
  ]
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "added": 3,
    "failed": 0,
    "entries": [
      {
        "id": "entry-uuid-1",
        "date": "2025-11-04",
        "hours": 8.0
      }
    ]
  },
  "timesheetSummary": {
    "totalHours": 18.0,
    "billableHours": 16.0,
    "nonBillableHours": 2.0,
    "entryCount": 3
  }
}
```

---

### 明細テンプレート適用

```
POST /api/bc-005/timesheets/{timesheetId}/entries/apply-template
```

**リクエスト**:
```json
{
  "templateId": "template-uuid",
  "startDate": "2025-11-04",
  "endDate": "2025-11-08"
}
```

**レスポンス**:
```json
{
  "data": {
    "appliedEntries": 5,
    "totalHours": 40.0
  }
}
```

---

## 承認ワークフロー {#approval-workflow}

### タイムシート提出

```
POST /api/bc-005/timesheets/{timesheetId}/submit
```

**リクエスト**:
```json
{
  "comments": "今週のタイムシートを提出します"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "timesheet-uuid",
    "status": "SUBMITTED",
    "submittedAt": "2025-11-11T09:00:00Z",
    "totalHours": 42.0,
    "billableHours": 38.0,
    "validation": {
      "isValid": true,
      "warnings": [
        {
          "type": "OVERTIME",
          "message": "週の総労働時間が40時間を超えています: 42時間",
          "severity": "WARNING"
        }
      ],
      "errors": []
    }
  }
}
```

**エラー**:
- `BC005_ERR_401`: Timesheet already submitted
- `BC005_ERR_402`: Total hours exceed daily limit

**ビジネスルール**:
- 明細が1件以上必要
- 1日の合計時間は24時間以下
- 期間内の全日付に明細があることを推奨（警告のみ）

---

### タイムシート承認

```
POST /api/bc-005/timesheets/{timesheetId}/approve
```

**リクエスト**:
```json
{
  "comments": "内容を確認し承認します"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "timesheet-uuid",
    "status": "APPROVED",
    "approvedBy": "manager-uuid",
    "approvedByName": "マネージャー太郎",
    "approvedAt": "2025-11-11T15:00:00Z",
    "comments": "内容を確認し承認します"
  }
}
```

**エラー**:
- `BC005_ERR_405`: Insufficient permission to approve
- `BC005_ERR_406`: Timesheet is not in submitted status

**権限**: MANAGER以上の権限が必要

---

### タイムシート却下

```
POST /api/bc-005/timesheets/{timesheetId}/reject
```

**リクエスト**:
```json
{
  "reason": "11月5日の明細に誤りがあるため再提出をお願いします",
  "requiredCorrections": [
    {
      "entryId": "entry-uuid",
      "issue": "プロジェクトが誤っています。Project BetaではなくProject Alphaです。"
    }
  ]
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "timesheet-uuid",
    "status": "REJECTED",
    "rejectedBy": "manager-uuid",
    "rejectedByName": "マネージャー太郎",
    "rejectedAt": "2025-11-11T15:00:00Z",
    "reason": "11月5日の明細に誤りがあるため再提出をお願いします",
    "requiredCorrections": [
      {
        "entryId": "entry-uuid",
        "issue": "プロジェクトが誤っています。Project BetaではなくProject Alphaです。"
      }
    ]
  }
}
```

**ビジネスルール**:
- 却下後、タイムシートはDRAFTステータスに戻る
- リソースは修正後に再提出可能

---

### 承認待ちタイムシート一覧

```
GET /api/bc-005/timesheets/pending-approvals?approverId=manager-uuid
```

**クエリパラメータ**:
- `approverId` (optional): 承認者ID（省略時は自分の承認待ち）
- `organizationUnitId` (optional): 組織単位ID
- `page` (optional): ページ番号
- `pageSize` (optional): ページサイズ

**レスポンス**:
```json
{
  "data": [
    {
      "id": "timesheet-uuid",
      "resourceId": "resource-uuid",
      "resourceName": "山田太郎",
      "periodStart": "2025-11-04",
      "periodEnd": "2025-11-10",
      "totalHours": 42.0,
      "billableHours": 38.0,
      "submittedAt": "2025-11-11T09:00:00Z",
      "daysWaiting": 0,
      "warnings": [
        {
          "type": "OVERTIME",
          "message": "週の総労働時間が40時間を超えています"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 12,
    "totalPages": 1
  },
  "summary": {
    "totalPending": 12,
    "totalHours": 496.0,
    "avgWaitingDays": 1.5
  }
}
```

---

### 一括承認

```
POST /api/bc-005/timesheets/bulk-approve
```

**リクエスト**:
```json
{
  "timesheetIds": [
    "timesheet-uuid-1",
    "timesheet-uuid-2",
    "timesheet-uuid-3"
  ],
  "comments": "一括承認"
}
```

**レスポンス**:
```json
{
  "data": {
    "approved": 3,
    "failed": 0,
    "results": [
      {
        "timesheetId": "timesheet-uuid-1",
        "status": "APPROVED",
        "approvedAt": "2025-11-11T15:00:00Z"
      }
    ]
  }
}
```

---

## 稼働率分析 {#utilization-analysis}

### 稼働率分析

```
GET /api/bc-005/timesheets/analyze-utilization?startDate=2025-11-01&endDate=2025-11-30&groupBy=resource
```

**クエリパラメータ**:
- `startDate` (required): 分析開始日
- `endDate` (required): 分析終了日
- `groupBy` (required): resource | project | taskType | week
- `resourceIds` (optional): リソースID（カンマ区切り）
- `projectIds` (optional): プロジェクトID（カンマ区切り）
- `organizationUnitId` (optional): 組織単位ID

**レスポンス**:
```json
{
  "data": {
    "period": {
      "startDate": "2025-11-01",
      "endDate": "2025-11-30"
    },
    "summary": {
      "totalResources": 150,
      "totalHours": 24000.0,
      "billableHours": 20400.0,
      "nonBillableHours": 3600.0,
      "billableRate": 0.85,
      "avgUtilizationRate": 0.78,
      "standardWorkHours": 160
    },
    "byResource": [
      {
        "resourceId": "resource-uuid",
        "resourceName": "山田太郎",
        "resourceType": "CONSULTANT",
        "level": "SENIOR",
        "totalHours": 168.0,
        "billableHours": 152.0,
        "nonBillableHours": 16.0,
        "standardHours": 160.0,
        "utilizationRate": 1.05,
        "billableRate": 0.90,
        "overtimeHours": 8.0,
        "status": "OVER_UTILIZED"
      }
    ],
    "byProject": [
      {
        "projectId": "project-alpha-uuid",
        "projectName": "Project Alpha",
        "totalHours": 5200.0,
        "resourceCount": 8,
        "avgHoursPerResource": 650.0
      }
    ],
    "byTaskType": [
      {
        "taskType": "DEVELOPMENT",
        "totalHours": 12000.0,
        "percentage": 50.0,
        "billablePercentage": 95.0
      },
      {
        "taskType": "MEETING",
        "totalHours": 3600.0,
        "percentage": 15.0,
        "billablePercentage": 40.0
      }
    ],
    "trends": {
      "utilizationTrend": [
        {
          "week": "2025-W44",
          "avgUtilization": 0.75
        },
        {
          "week": "2025-W45",
          "avgUtilization": 0.78
        }
      ]
    }
  }
}
```

---

### リソース別稼働率詳細

```
GET /api/bc-005/timesheets/utilization/resource/{resourceId}?startDate=2025-11-01&endDate=2025-11-30
```

**レスポンス**:
```json
{
  "data": {
    "resourceId": "resource-uuid",
    "resourceName": "山田太郎",
    "period": {
      "startDate": "2025-11-01",
      "endDate": "2025-11-30"
    },
    "summary": {
      "totalHours": 168.0,
      "billableHours": 152.0,
      "nonBillableHours": 16.0,
      "standardHours": 160.0,
      "utilizationRate": 1.05,
      "billableRate": 0.90,
      "overtimeHours": 8.0
    },
    "byProject": [
      {
        "projectId": "project-alpha-uuid",
        "projectName": "Project Alpha",
        "hours": 92.0,
        "percentage": 54.8,
        "allocationPercentage": 0.50,
        "variance": 0.048
      },
      {
        "projectId": "project-beta-uuid",
        "projectName": "Project Beta",
        "hours": 60.0,
        "percentage": 35.7,
        "allocationPercentage": 0.35,
        "variance": 0.007
      }
    ],
    "byTaskType": [
      {
        "taskType": "DEVELOPMENT",
        "hours": 120.0,
        "percentage": 71.4
      },
      {
        "taskType": "MEETING",
        "hours": 24.0,
        "percentage": 14.3
      },
      {
        "taskType": "DOCUMENTATION",
        "hours": 24.0,
        "percentage": 14.3
      }
    ],
    "byWeek": [
      {
        "week": "2025-W44",
        "weekStart": "2025-10-28",
        "weekEnd": "2025-11-03",
        "totalHours": 42.0,
        "utilizationRate": 1.05
      }
    ],
    "alerts": [
      {
        "type": "OVERTIME",
        "severity": "WARNING",
        "message": "週の総労働時間が40時間を超えています",
        "week": "2025-W44",
        "hours": 42.0
      }
    ]
  }
}
```

---

### プロジェクト別稼働率詳細

```
GET /api/bc-005/timesheets/utilization/project/{projectId}?startDate=2025-11-01&endDate=2025-11-30
```

**レスポンス**:
```json
{
  "data": {
    "projectId": "project-alpha-uuid",
    "projectName": "Project Alpha",
    "period": {
      "startDate": "2025-11-01",
      "endDate": "2025-11-30"
    },
    "summary": {
      "totalHours": 5200.0,
      "billableHours": 4940.0,
      "resourceCount": 8,
      "avgHoursPerResource": 650.0,
      "plannedHours": 5000.0,
      "variance": 200.0,
      "variancePercentage": 4.0
    },
    "byResource": [
      {
        "resourceId": "resource-uuid",
        "resourceName": "山田太郎",
        "hours": 92.0,
        "allocationPercentage": 0.50,
        "expectedHours": 80.0,
        "variance": 12.0
      }
    ],
    "byTaskType": [
      {
        "taskType": "DEVELOPMENT",
        "hours": 3120.0,
        "percentage": 60.0
      }
    ],
    "costAnalysis": {
      "totalCost": 78000000,
      "currency": "JPY",
      "avgCostPerHour": 15000
    }
  }
}
```

---

### 稼働率レポート生成

```
POST /api/bc-005/timesheets/reports/utilization
```

**リクエスト**:
```json
{
  "reportType": "MONTHLY",
  "period": {
    "startDate": "2025-11-01",
    "endDate": "2025-11-30"
  },
  "groupBy": ["resource", "project"],
  "filters": {
    "organizationUnitId": "unit-uuid",
    "resourceTypes": ["CONSULTANT", "ENGINEER"],
    "minUtilization": 0.5
  },
  "includeCharts": true,
  "format": "PDF"
}
```

**レスポンス**:
```json
{
  "data": {
    "reportId": "report-uuid",
    "reportType": "MONTHLY",
    "period": {
      "startDate": "2025-11-01",
      "endDate": "2025-11-30"
    },
    "status": "GENERATING",
    "estimatedCompletionTime": "2025-11-03T12:05:00Z",
    "downloadUrl": null,
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**レポートタイプ**:
- `WEEKLY`: 週次レポート
- `MONTHLY`: 月次レポート
- `QUARTERLY`: 四半期レポート
- `CUSTOM`: カスタム期間

---

### レポートダウンロード

```
GET /api/bc-005/timesheets/reports/{reportId}/download
```

**レスポンス**:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="utilization-report-2025-11.pdf"

[PDFバイナリデータ]
```

---

### タイムシート統計サマリー

```
GET /api/bc-005/timesheets/statistics?period=2025-11
```

**レスポンス**:
```json
{
  "data": {
    "period": "2025-11",
    "timesheetStatistics": {
      "totalTimesheets": 600,
      "submitted": 580,
      "approved": 540,
      "rejected": 15,
      "draft": 20,
      "submissionRate": 0.97,
      "approvalRate": 0.93
    },
    "utilizationStatistics": {
      "totalHours": 24000.0,
      "avgUtilizationRate": 0.78,
      "billableRate": 0.85,
      "overUtilizedCount": 25,
      "underUtilizedCount": 45,
      "optimalCount": 80
    },
    "complianceStatistics": {
      "onTimeSubmissionRate": 0.92,
      "avgApprovalTime": "1.5 days",
      "lateSubmissions": 48,
      "missingTimesheets": 5
    },
    "trends": {
      "utilizationChange": 0.05,
      "billableRateChange": 0.02,
      "direction": "improving"
    }
  }
}
```

---

## 関連ドキュメント

- [README.md](README.md) - API概要
- [resource-api.md](resource-api.md) - リソース管理API
- [talent-api.md](talent-api.md) - タレント・チーム・スキル管理API

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 API詳細化
