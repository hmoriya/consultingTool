# BC-004: チーム管理API

**ドキュメント**: API層 - チーム管理
**最終更新**: 2025-11-03

このドキュメントでは、チームと チームメンバーの管理APIを定義します。

---

## 目次

1. [チーム管理API](#team-api)
2. [チームメンバー管理API](#team-member-api)
3. [アロケーション管理API](#allocation-api)
4. [チームリーダー管理API](#leader-api)
5. [統計・集計API](#statistics-api)

---

## チーム管理API {#team-api}

### チーム作成

```
POST /api/bc-004/teams
```

**リクエスト**:
```json
{
  "organizationId": "org-uuid",
  "unitId": "unit-uuid",
  "name": "プロジェクトAlphaチーム",
  "purpose": "新製品開発プロジェクト",
  "teamType": "project",
  "startDate": "2025-11-01",
  "endDate": "2026-03-31"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "team-uuid",
    "organizationId": "org-uuid",
    "unitId": "unit-uuid",
    "name": "プロジェクトAlphaチーム",
    "purpose": "新製品開発プロジェクト",
    "teamType": "project",
    "status": "active",
    "memberCount": 0,
    "leaderCount": 0,
    "totalAllocationRate": 0.00,
    "startDate": "2025-11-01",
    "endDate": "2026-03-31",
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**エラー**:
- `BC004_ERR_200`: Team name already exists in organization
- `BC004_ERR_201`: Invalid date range (endDate must be after startDate)

---

### チーム一覧取得

```
GET /api/bc-004/teams?organizationId=org-uuid&status=active&teamType=project&page=1&pageSize=50
```

**クエリパラメータ**:
- `organizationId` (required): 組織ID
- `unitId` (optional): 組織単位ID
- `status` (optional): active | inactive
- `teamType` (optional): permanent | project | task_force
- `page` (optional): ページ番号（default: 1）
- `pageSize` (optional): ページサイズ（default: 50, max: 200）

**レスポンス**:
```json
{
  "data": [
    {
      "id": "team-uuid",
      "organizationId": "org-uuid",
      "unitId": "unit-uuid",
      "name": "プロジェクトAlphaチーム",
      "teamType": "project",
      "status": "active",
      "memberCount": 5,
      "leaderCount": 1,
      "totalAllocationRate": 3.50,
      "startDate": "2025-11-01",
      "endDate": "2026-03-31",
      "createdAt": "2025-11-03T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 15,
    "totalPages": 1
  }
}
```

---

### チーム詳細取得

```
GET /api/bc-004/teams/{teamId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "team-uuid",
    "organizationId": "org-uuid",
    "unitId": "unit-uuid",
    "unitName": "技術本部",
    "name": "プロジェクトAlphaチーム",
    "purpose": "新製品開発プロジェクト",
    "teamType": "project",
    "status": "active",
    "memberCount": 5,
    "leaderCount": 1,
    "totalAllocationRate": 3.50,
    "maxAllocationRate": 5.00,
    "allocationUtilization": 70.0,
    "leaders": [
      {
        "userId": "user-leader-uuid",
        "userName": "山田太郎",
        "assignedAt": "2025-11-01T09:00:00Z"
      }
    ],
    "startDate": "2025-11-01",
    "endDate": "2026-03-31",
    "createdAt": "2025-11-03T12:00:00Z",
    "updatedAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### チーム更新

```
PUT /api/bc-004/teams/{teamId}
```

**リクエスト**:
```json
{
  "name": "プロジェクトAlpha改チーム",
  "purpose": "新製品開発プロジェクト（スコープ拡大）",
  "endDate": "2026-06-30"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "team-uuid",
    "name": "プロジェクトAlpha改チーム",
    "purpose": "新製品開発プロジェクト（スコープ拡大）",
    "endDate": "2026-06-30",
    "updatedAt": "2025-11-03T12:30:00Z"
  }
}
```

---

### チーム無効化

```
PUT /api/bc-004/teams/{teamId}/deactivate
```

**リクエスト**:
```json
{
  "reason": "プロジェクト完了"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "team-uuid",
    "status": "inactive",
    "deactivatedAt": "2025-11-03T12:00:00Z",
    "reason": "プロジェクト完了",
    "affectedMemberCount": 5
  }
}
```

**ビジネスルール**:
- チーム無効化時、全てのメンバーのステータスもinactiveに変更される
- リーダー関連も全て無効化される

---

## チームメンバー管理API {#team-member-api}

### メンバー追加

```
POST /api/bc-004/teams/{teamId}/members
```

**リクエスト**:
```json
{
  "userId": "user-uuid",
  "allocationRate": 0.80,
  "role": "developer",
  "startDate": "2025-11-01",
  "endDate": "2026-03-31"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "member-uuid",
    "teamId": "team-uuid",
    "userId": "user-uuid",
    "userName": "鈴木花子",
    "allocationRate": 0.80,
    "role": "developer",
    "status": "active",
    "isLeader": false,
    "startDate": "2025-11-01",
    "endDate": "2026-03-31",
    "joinedAt": "2025-11-03T12:00:00Z"
  },
  "userAllocationSummary": {
    "userId": "user-uuid",
    "totalAllocationRate": 1.50,
    "teamCount": 2,
    "availableAllocationRate": 0.50
  }
}
```

**エラー**:
- `BC004_ERR_202`: User already exists in team
- `BC004_ERR_203`: Allocation rate exceeds user capacity (>2.0)
- `BC004_ERR_204`: Invalid allocation rate (must be 0.0-1.0)

**ビジネスルール**:
- 1ユーザーの全チーム合計アロケーション率は2.0以下（200%以下）
- 1チーム内のアロケーション率は0.0-1.0の範囲

---

### メンバー一覧取得

```
GET /api/bc-004/teams/{teamId}/members?status=active&includeLeaders=true
```

**クエリパラメータ**:
- `status` (optional): active | inactive
- `includeLeaders` (optional): リーダー情報含む（default: true）

**レスポンス**:
```json
{
  "data": [
    {
      "id": "member-uuid",
      "userId": "user-uuid",
      "userName": "鈴木花子",
      "email": "suzuki@example.com",
      "allocationRate": 0.80,
      "role": "developer",
      "status": "active",
      "isLeader": false,
      "startDate": "2025-11-01",
      "endDate": "2026-03-31",
      "joinedAt": "2025-11-03T12:00:00Z"
    },
    {
      "id": "member-leader-uuid",
      "userId": "user-leader-uuid",
      "userName": "山田太郎",
      "email": "yamada@example.com",
      "allocationRate": 1.00,
      "role": "project_manager",
      "status": "active",
      "isLeader": true,
      "startDate": "2025-11-01",
      "endDate": "2026-03-31",
      "joinedAt": "2025-11-01T09:00:00Z"
    }
  ],
  "statistics": {
    "totalMembers": 5,
    "activeMembers": 5,
    "totalAllocationRate": 3.50,
    "averageAllocationRate": 0.70
  }
}
```

---

### メンバー削除

```
DELETE /api/bc-004/teams/{teamId}/members/{memberId}
```

**リクエスト**:
```json
{
  "reason": "プロジェクト担当変更",
  "effectiveDate": "2025-12-01"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "member-uuid",
    "status": "inactive",
    "leftAt": "2025-12-01T00:00:00Z",
    "reason": "プロジェクト担当変更"
  }
}
```

**エラー**:
- `BC004_ERR_205`: Cannot remove last leader from active team

**ビジネスルール**:
- activeステータスのチームは最低1名のリーダーが必要
- リーダーを削除する場合、別のリーダーが存在する必要がある

---

## アロケーション管理API {#allocation-api}

### アロケーション率変更

```
PUT /api/bc-004/teams/{teamId}/members/{memberId}/allocation
```

**リクエスト**:
```json
{
  "newAllocationRate": 0.50,
  "effectiveDate": "2025-12-01",
  "reason": "他プロジェクトとの兼務"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "member-uuid",
    "teamId": "team-uuid",
    "userId": "user-uuid",
    "previousAllocationRate": 0.80,
    "newAllocationRate": 0.50,
    "effectiveDate": "2025-12-01",
    "updatedAt": "2025-11-03T12:00:00Z"
  },
  "userAllocationSummary": {
    "userId": "user-uuid",
    "totalAllocationRate": 1.20,
    "teamCount": 2,
    "availableAllocationRate": 0.80,
    "teams": [
      {
        "teamId": "team-uuid",
        "teamName": "プロジェクトAlphaチーム",
        "allocationRate": 0.50
      },
      {
        "teamId": "team-other-uuid",
        "teamName": "プロジェクトBetaチーム",
        "allocationRate": 0.70
      }
    ]
  }
}
```

**エラー**:
- `BC004_ERR_203`: Allocation rate exceeds user capacity

---

### ユーザーアロケーション状況取得

```
GET /api/bc-004/users/{userId}/allocations
```

**レスポンス**:
```json
{
  "data": {
    "userId": "user-uuid",
    "userName": "鈴木花子",
    "totalAllocationRate": 1.50,
    "availableAllocationRate": 0.50,
    "teamCount": 2,
    "teams": [
      {
        "teamId": "team-uuid",
        "teamName": "プロジェクトAlphaチーム",
        "teamType": "project",
        "organizationName": "株式会社サンプル",
        "unitName": "技術本部",
        "allocationRate": 0.80,
        "role": "developer",
        "isLeader": false,
        "startDate": "2025-11-01",
        "endDate": "2026-03-31"
      },
      {
        "teamId": "team-other-uuid",
        "teamName": "プロジェクトBetaチーム",
        "teamType": "project",
        "organizationName": "株式会社サンプル",
        "unitName": "営業本部",
        "allocationRate": 0.70,
        "role": "consultant",
        "isLeader": false,
        "startDate": "2025-10-01",
        "endDate": "2025-12-31"
      }
    ]
  }
}
```

---

## チームリーダー管理API {#leader-api}

### リーダー任命

```
POST /api/bc-004/teams/{teamId}/leaders
```

**リクエスト**:
```json
{
  "memberId": "member-uuid",
  "effectiveDate": "2025-11-01"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "leader-uuid",
    "teamId": "team-uuid",
    "memberId": "member-uuid",
    "userId": "user-uuid",
    "userName": "山田太郎",
    "status": "active",
    "assignedAt": "2025-11-01T09:00:00Z"
  }
}
```

**エラー**:
- `BC004_ERR_206`: Member not found in team
- `BC004_ERR_207`: Member is already a leader

**ビジネスルール**:
- リーダーになるにはチームの activeメンバーである必要がある
- 1チームに複数のリーダーが存在可能

---

### リーダー解任

```
DELETE /api/bc-004/teams/{teamId}/leaders/{leaderId}
```

**リクエスト**:
```json
{
  "reason": "リーダー交代",
  "effectiveDate": "2025-12-01"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "leader-uuid",
    "status": "inactive",
    "removedAt": "2025-12-01T00:00:00Z",
    "reason": "リーダー交代"
  }
}
```

**エラー**:
- `BC004_ERR_205`: Cannot remove last leader from active team

---

### リーダー一覧取得

```
GET /api/bc-004/teams/{teamId}/leaders
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "leader-uuid",
      "memberId": "member-uuid",
      "userId": "user-uuid",
      "userName": "山田太郎",
      "email": "yamada@example.com",
      "status": "active",
      "assignedAt": "2025-11-01T09:00:00Z"
    }
  ]
}
```

---

## 統計・集計API {#statistics-api}

### チーム統計取得

```
GET /api/bc-004/teams/{teamId}/statistics
```

**レスポンス**:
```json
{
  "data": {
    "teamId": "team-uuid",
    "teamName": "プロジェクトAlphaチーム",
    "status": "active",
    "memberStatistics": {
      "totalMembers": 5,
      "activeMembers": 5,
      "inactiveMembers": 0,
      "leaderCount": 1
    },
    "allocationStatistics": {
      "totalAllocationRate": 3.50,
      "averageAllocationRate": 0.70,
      "maxAllocationRate": 1.00,
      "minAllocationRate": 0.50,
      "allocationUtilization": 70.0
    },
    "roleDistribution": [
      {
        "role": "project_manager",
        "count": 1,
        "totalAllocationRate": 1.00
      },
      {
        "role": "developer",
        "count": 3,
        "totalAllocationRate": 2.00
      },
      {
        "role": "designer",
        "count": 1,
        "totalAllocationRate": 0.50
      }
    ],
    "timeline": {
      "startDate": "2025-11-01",
      "endDate": "2026-03-31",
      "daysElapsed": 2,
      "daysRemaining": 148,
      "completionPercentage": 1.3
    }
  }
}
```

---

### 組織単位別チーム統計

```
GET /api/bc-004/organizations/{orgId}/units/{unitId}/team-statistics
```

**レスポンス**:
```json
{
  "data": {
    "organizationId": "org-uuid",
    "unitId": "unit-uuid",
    "unitName": "技術本部",
    "teamStatistics": {
      "totalTeams": 8,
      "activeTeams": 6,
      "inactiveTeams": 2,
      "teamsByType": {
        "permanent": 2,
        "project": 5,
        "task_force": 1
      }
    },
    "memberStatistics": {
      "totalMembers": 45,
      "uniqueUsers": 38,
      "averageMembersPerTeam": 7.5
    },
    "allocationStatistics": {
      "totalAllocationRate": 32.50,
      "averageAllocationRatePerUser": 0.86,
      "usersOverAllocated": 2,
      "usersUnderAllocated": 15
    },
    "teams": [
      {
        "teamId": "team-uuid",
        "teamName": "プロジェクトAlphaチーム",
        "teamType": "project",
        "status": "active",
        "memberCount": 5,
        "totalAllocationRate": 3.50
      }
    ]
  }
}
```

---

### アロケーション分析レポート

```
GET /api/bc-004/organizations/{orgId}/allocation-analysis?startDate=2025-11-01&endDate=2025-11-30
```

**レスポンス**:
```json
{
  "data": {
    "organizationId": "org-uuid",
    "organizationName": "株式会社サンプル",
    "period": {
      "startDate": "2025-11-01",
      "endDate": "2025-11-30"
    },
    "overallStatistics": {
      "totalUsers": 250,
      "usersInTeams": 120,
      "totalTeams": 15,
      "activeTeams": 12,
      "totalAllocationRate": 85.50,
      "averageAllocationRate": 0.71
    },
    "allocationDistribution": {
      "underAllocated": {
        "count": 65,
        "percentage": 54.2,
        "averageAllocationRate": 0.35
      },
      "normalAllocated": {
        "count": 50,
        "percentage": 41.7,
        "averageAllocationRate": 0.85
      },
      "overAllocated": {
        "count": 5,
        "percentage": 4.2,
        "averageAllocationRate": 1.45
      }
    },
    "alerts": [
      {
        "type": "over_allocation",
        "severity": "high",
        "userId": "user-overallocated-uuid",
        "userName": "田中次郎",
        "totalAllocationRate": 1.80,
        "teamCount": 3
      }
    ]
  }
}
```

---

## 関連ドキュメント

- [README.md](README.md) - API概要
- [organization-api.md](organization-api.md) - 組織管理API
- [governance-api.md](governance-api.md) - ガバナンスポリシーAPI

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.3 - BC-004 API詳細化
