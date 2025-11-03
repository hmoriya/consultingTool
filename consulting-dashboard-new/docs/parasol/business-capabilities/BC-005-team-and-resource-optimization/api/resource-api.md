# BC-005: リソース管理API

**ドキュメント**: API層 - リソース管理
**最終更新**: 2025-11-03

このドキュメントでは、リソースの登録、配分、稼働率管理APIを定義します。

---

## 目次

1. [リソース基本管理](#resource-basic)
2. [リソース配分管理](#resource-allocation)
3. [稼働率管理](#utilization)
4. [リソース最適化](#optimization)

---

## リソース基本管理 {#resource-basic}

### リソース登録

```
POST /api/bc-005/resources
```

**リクエスト**:
```json
{
  "userId": "user-uuid",
  "resourceType": "CONSULTANT",
  "level": "SENIOR",
  "costRate": 15000,
  "currency": "JPY",
  "skills": [
    {
      "skillId": "skill-java-uuid",
      "level": 4
    },
    {
      "skillId": "skill-spring-uuid",
      "level": 3
    }
  ],
  "availability": {
    "startDate": "2025-11-01",
    "status": "AVAILABLE"
  }
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "resource-uuid",
    "userId": "user-uuid",
    "userName": "山田太郎",
    "resourceType": "CONSULTANT",
    "level": "SENIOR",
    "costRate": 15000,
    "currency": "JPY",
    "status": "AVAILABLE",
    "currentUtilization": 0.0,
    "skills": [
      {
        "skillId": "skill-java-uuid",
        "skillName": "Java",
        "level": 4,
        "levelName": "EXPERT"
      }
    ],
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**エラー**:
- `BC005_ERR_002`: Invalid resource type
- `BC005_ERR_501`: User not found in BC-003

---

### リソース詳細取得

```
GET /api/bc-005/resources/{resourceId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "resource-uuid",
    "userId": "user-uuid",
    "userName": "山田太郎",
    "email": "yamada@example.com",
    "resourceType": "CONSULTANT",
    "level": "SENIOR",
    "costRate": 15000,
    "currency": "JPY",
    "status": "ALLOCATED",
    "currentUtilization": 0.85,
    "allocations": [
      {
        "id": "allocation-uuid",
        "projectId": "project-alpha-uuid",
        "projectName": "Project Alpha",
        "allocationPercentage": 0.50,
        "startDate": "2025-11-01",
        "endDate": "2026-03-31",
        "status": "active"
      },
      {
        "id": "allocation-uuid-2",
        "projectId": "project-beta-uuid",
        "projectName": "Project Beta",
        "allocationPercentage": 0.35,
        "startDate": "2025-11-15",
        "endDate": "2026-02-28",
        "status": "active"
      }
    ],
    "skills": [
      {
        "skillId": "skill-java-uuid",
        "skillName": "Java",
        "category": "TECHNICAL",
        "level": 4,
        "levelName": "EXPERT",
        "acquiredDate": "2020-03-15"
      }
    ],
    "totalAllocationRate": 0.85,
    "availableAllocationRate": 1.15,
    "createdAt": "2025-11-03T12:00:00Z",
    "updatedAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### リソース更新

```
PUT /api/bc-005/resources/{resourceId}
```

**リクエスト**:
```json
{
  "level": "PRINCIPAL",
  "costRate": 18000,
  "status": "AVAILABLE"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "resource-uuid",
    "level": "PRINCIPAL",
    "costRate": 18000,
    "status": "AVAILABLE",
    "updatedAt": "2025-11-03T13:00:00Z"
  }
}
```

---

### リソース一覧取得

```
GET /api/bc-005/resources?resourceType=CONSULTANT&level=SENIOR&status=AVAILABLE&page=1&pageSize=50
```

**クエリパラメータ**:
- `resourceType` (optional): CONSULTANT | ENGINEER | DESIGNER | PROJECT_MANAGER | ANALYST
- `level` (optional): JUNIOR | INTERMEDIATE | SENIOR | PRINCIPAL | PARTNER
- `status` (optional): AVAILABLE | ALLOCATED | UNAVAILABLE | ON_LEAVE
- `skillIds` (optional): カンマ区切りのスキルID
- `minUtilization` (optional): 最小稼働率（0.0-1.0）
- `maxUtilization` (optional): 最大稼働率（0.0-1.0）
- `page` (optional): ページ番号（default: 1）
- `pageSize` (optional): ページサイズ（default: 50, max: 200）

**レスポンス**:
```json
{
  "data": [
    {
      "id": "resource-uuid",
      "userId": "user-uuid",
      "userName": "山田太郎",
      "resourceType": "CONSULTANT",
      "level": "SENIOR",
      "costRate": 15000,
      "status": "AVAILABLE",
      "currentUtilization": 0.35,
      "totalAllocationRate": 0.35,
      "availableAllocationRate": 1.65,
      "skillCount": 5,
      "topSkills": ["Java", "Spring", "AWS"]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 150,
    "totalPages": 3
  }
}
```

---

## リソース配分管理 {#resource-allocation}

### プロジェクトへの配分

```
POST /api/bc-005/resources/{resourceId}/allocate
```

**リクエスト**:
```json
{
  "projectId": "project-uuid",
  "allocationPercentage": 0.50,
  "startDate": "2025-11-01",
  "endDate": "2026-03-31",
  "role": "SENIOR_CONSULTANT"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "allocation-uuid",
    "resourceId": "resource-uuid",
    "projectId": "project-uuid",
    "projectName": "Project Alpha",
    "allocationPercentage": 0.50,
    "startDate": "2025-11-01",
    "endDate": "2026-03-31",
    "role": "SENIOR_CONSULTANT",
    "status": "active",
    "createdAt": "2025-11-03T12:00:00Z"
  },
  "resourceSummary": {
    "resourceId": "resource-uuid",
    "totalAllocationRate": 0.85,
    "availableAllocationRate": 1.15,
    "allocationCount": 2
  }
}
```

**エラー**:
- `BC005_ERR_003`: Allocation exceeds limit (200%)
- `BC005_ERR_005`: Invalid allocation percentage
- `BC005_ERR_006`: Allocation date range overlaps
- `BC005_ERR_007`: Resource unavailable for allocation
- `BC005_ERR_500`: Project not found in BC-001

**ビジネスルール**:
- 配分率は0.0-1.0（0%-100%）の範囲
- 同一リソースの全配分合計は2.0（200%）以下
- 期間が重複する配分の合計も200%以下

---

### 配分状況取得

```
GET /api/bc-005/resources/{resourceId}/allocations?status=active
```

**クエリパラメータ**:
- `status` (optional): active | completed | cancelled
- `startDate` (optional): 期間開始日以降
- `endDate` (optional): 期間終了日以前

**レスポンス**:
```json
{
  "data": {
    "resourceId": "resource-uuid",
    "resourceName": "山田太郎",
    "totalAllocationRate": 0.85,
    "availableAllocationRate": 1.15,
    "allocations": [
      {
        "id": "allocation-uuid",
        "projectId": "project-alpha-uuid",
        "projectName": "Project Alpha",
        "projectStatus": "in_progress",
        "allocationPercentage": 0.50,
        "startDate": "2025-11-01",
        "endDate": "2026-03-31",
        "role": "SENIOR_CONSULTANT",
        "status": "active",
        "daysRemaining": 148
      }
    ]
  }
}
```

---

### 配分変更

```
PUT /api/bc-005/resources/{resourceId}/allocations/{allocationId}
```

**リクエスト**:
```json
{
  "allocationPercentage": 0.60,
  "endDate": "2026-06-30",
  "reason": "プロジェクト期間延長"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "allocation-uuid",
    "allocationPercentage": 0.60,
    "endDate": "2026-06-30",
    "updatedAt": "2025-11-03T13:00:00Z"
  }
}
```

---

### 配分解除

```
DELETE /api/bc-005/resources/{resourceId}/allocations/{allocationId}
```

**リクエスト**:
```json
{
  "reason": "プロジェクト要員変更",
  "effectiveDate": "2025-12-31"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "allocation-uuid",
    "status": "cancelled",
    "effectiveDate": "2025-12-31",
    "reason": "プロジェクト要員変更",
    "cancelledAt": "2025-11-03T13:00:00Z"
  }
}
```

---

## 稼働率管理 {#utilization}

### 稼働率取得

```
GET /api/bc-005/resources/{resourceId}/utilization?period=2025-11
```

**クエリパラメータ**:
- `period` (required): 期間（YYYY-MM形式）
- `groupBy` (optional): project | week | day

**レスポンス**:
```json
{
  "data": {
    "resourceId": "resource-uuid",
    "resourceName": "山田太郎",
    "period": "2025-11",
    "summary": {
      "totalWorkHours": 168,
      "standardWorkHours": 160,
      "utilizationRate": 1.05,
      "billableHours": 152,
      "nonBillableHours": 16,
      "billableRate": 0.90
    },
    "byProject": [
      {
        "projectId": "project-alpha-uuid",
        "projectName": "Project Alpha",
        "workHours": 92,
        "utilizationRate": 0.58,
        "allocationPercentage": 0.50,
        "variance": 0.08
      },
      {
        "projectId": "project-beta-uuid",
        "projectName": "Project Beta",
        "workHours": 60,
        "utilizationRate": 0.38,
        "allocationPercentage": 0.35,
        "variance": 0.03
      }
    ],
    "byWeek": [
      {
        "weekNumber": 45,
        "weekStart": "2025-11-03",
        "weekEnd": "2025-11-09",
        "workHours": 42,
        "standardHours": 40,
        "utilizationRate": 1.05
      }
    ]
  }
}
```

---

### 稼働率分析

```
GET /api/bc-005/resources/utilization-analysis?startDate=2025-11-01&endDate=2025-11-30
```

**クエリパラメータ**:
- `startDate` (required): 分析開始日
- `endDate` (required): 分析終了日
- `resourceType` (optional): リソースタイプ
- `level` (optional): レベル
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
      "avgUtilizationRate": 0.78,
      "avgBillableRate": 0.85,
      "underUtilized": 35,
      "overUtilized": 12,
      "optimal": 103
    },
    "distribution": {
      "underUtilized": {
        "count": 35,
        "percentage": 23.3,
        "avgUtilization": 0.45
      },
      "optimal": {
        "count": 103,
        "percentage": 68.7,
        "avgUtilization": 0.82
      },
      "overUtilized": {
        "count": 12,
        "percentage": 8.0,
        "avgUtilization": 1.15
      }
    },
    "byResourceType": [
      {
        "resourceType": "CONSULTANT",
        "count": 80,
        "avgUtilization": 0.82,
        "avgBillableRate": 0.88
      }
    ],
    "alerts": [
      {
        "type": "OVER_UTILIZATION",
        "resourceId": "resource-uuid",
        "resourceName": "田中次郎",
        "utilizationRate": 1.25,
        "threshold": 1.00
      }
    ]
  }
}
```

---

## リソース最適化 {#optimization}

### リソース需要予測

```
GET /api/bc-005/resources/forecast-demand?startDate=2025-12-01&endDate=2026-02-28
```

**クエリパラメータ**:
- `startDate` (required): 予測開始日
- `endDate` (required): 予測終了日
- `projectIds` (optional): 対象プロジェクトID（カンマ区切り）

**レスポンス**:
```json
{
  "data": {
    "forecastPeriod": {
      "startDate": "2025-12-01",
      "endDate": "2026-02-28"
    },
    "demandForecast": {
      "totalDemand": 125.5,
      "currentSupply": 98.0,
      "gap": 27.5,
      "gapPercentage": 28.1
    },
    "byResourceType": [
      {
        "resourceType": "CONSULTANT",
        "demand": 60.5,
        "supply": 45.0,
        "gap": 15.5,
        "recommendedHires": 3
      },
      {
        "resourceType": "ENGINEER",
        "demand": 45.0,
        "supply": 38.0,
        "gap": 7.0,
        "recommendedHires": 2
      }
    ],
    "bySkill": [
      {
        "skillId": "skill-java-uuid",
        "skillName": "Java",
        "demand": 25.0,
        "supply": 18.0,
        "gap": 7.0
      }
    ],
    "recommendations": [
      {
        "action": "HIRE",
        "resourceType": "CONSULTANT",
        "level": "SENIOR",
        "requiredSkills": ["Java", "AWS"],
        "count": 3,
        "priority": "HIGH",
        "startDate": "2025-12-01"
      },
      {
        "action": "UPSKILL",
        "targetSkill": "AWS",
        "currentResources": 5,
        "trainingDuration": "2 months"
      }
    ]
  }
}
```

---

### 配分最適化提案

```
POST /api/bc-005/resources/optimize-allocation
```

**リクエスト**:
```json
{
  "projectIds": [
    "project-alpha-uuid",
    "project-beta-uuid"
  ],
  "constraints": {
    "maxAllocationPerResource": 1.0,
    "minimumSkillMatch": 0.8,
    "preferredUtilizationRate": 0.85
  },
  "objectives": {
    "maximizeUtilization": 0.6,
    "minimizeCost": 0.3,
    "maximizeSkillMatch": 0.1
  }
}
```

**レスポンス**:
```json
{
  "data": {
    "optimizationScore": 0.87,
    "currentState": {
      "avgUtilization": 0.72,
      "totalCost": 15000000,
      "avgSkillMatch": 0.75
    },
    "proposedState": {
      "avgUtilization": 0.85,
      "totalCost": 14500000,
      "avgSkillMatch": 0.88
    },
    "improvements": {
      "utilizationIncrease": 0.13,
      "costReduction": 500000,
      "skillMatchIncrease": 0.13
    },
    "recommendations": [
      {
        "action": "REALLOCATE",
        "resourceId": "resource-uuid-1",
        "resourceName": "山田太郎",
        "fromProject": "project-alpha-uuid",
        "toProject": "project-beta-uuid",
        "currentAllocation": 0.50,
        "proposedAllocation": 0.70,
        "reason": "Better skill match and higher priority project",
        "skillMatchScore": 0.92,
        "impact": {
          "utilizationChange": 0.20,
          "costChange": -50000
        }
      }
    ],
    "executionPlan": {
      "totalChanges": 8,
      "estimatedDuration": "2 weeks",
      "risks": [
        {
          "type": "PROJECT_DELAY",
          "severity": "LOW",
          "mitigations": ["Phased transition", "Knowledge transfer"]
        }
      ]
    }
  }
}
```

---

### 利用可能リソース検索

```
POST /api/bc-005/resources/search-available
```

**リクエスト**:
```json
{
  "requiredSkills": [
    {
      "skillId": "skill-java-uuid",
      "minLevel": 3
    },
    {
      "skillId": "skill-aws-uuid",
      "minLevel": 2
    }
  ],
  "period": {
    "startDate": "2025-12-01",
    "endDate": "2026-03-31"
  },
  "minAvailability": 0.50,
  "resourceType": "CONSULTANT",
  "maxCostRate": 20000
}
```

**レスポンス**:
```json
{
  "data": [
    {
      "resourceId": "resource-uuid",
      "resourceName": "山田太郎",
      "resourceType": "CONSULTANT",
      "level": "SENIOR",
      "costRate": 15000,
      "availability": 0.65,
      "skillMatchScore": 0.92,
      "matchedSkills": [
        {
          "skillId": "skill-java-uuid",
          "skillName": "Java",
          "level": 4,
          "required": 3,
          "match": true
        },
        {
          "skillId": "skill-aws-uuid",
          "skillName": "AWS",
          "level": 3,
          "required": 2,
          "match": true
        }
      ],
      "currentAllocations": [
        {
          "projectId": "project-gamma-uuid",
          "projectName": "Project Gamma",
          "allocationPercentage": 0.35,
          "endDate": "2026-01-31"
        }
      ],
      "recommendationScore": 0.88
    }
  ],
  "summary": {
    "totalMatches": 5,
    "perfectMatches": 2,
    "partialMatches": 3
  }
}
```

---

## 関連ドキュメント

- [README.md](README.md) - API概要
- [talent-api.md](talent-api.md) - タレント・チーム・スキル管理API
- [timesheet-api.md](timesheet-api.md) - タイムシート管理API

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 API詳細化
