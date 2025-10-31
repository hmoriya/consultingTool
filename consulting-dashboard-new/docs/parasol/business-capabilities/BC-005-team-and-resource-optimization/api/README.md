# BC-005: API設計

**BC**: Team & Resource Optimization
**作成日**: 2025-10-31
**V2移行元**: services/talent-optimization-service/api/ + services/productivity-visualization-service/api/

---

## 概要

このディレクトリは、BC-005（チームとリソースの最適化）のAPI設計を定義します。

**重要**: Issue #146対応により、API設計はWHAT（能力定義）とHOW（利用方法）に分離されています。

---

## 主要APIエンドポイント

### Resource Management API
```
POST   /api/bc-005/resources
GET    /api/bc-005/resources/{resourceId}
PUT    /api/bc-005/resources/{resourceId}
GET    /api/bc-005/resources
POST   /api/bc-005/resources/{resourceId}/allocate
GET    /api/bc-005/resources/{resourceId}/utilization
GET    /api/bc-005/resources/forecast-demand
```

### Team Management API
```
POST   /api/bc-005/teams
GET    /api/bc-005/teams/{teamId}
PUT    /api/bc-005/teams/{teamId}
DELETE /api/bc-005/teams/{teamId}
GET    /api/bc-005/teams
POST   /api/bc-005/teams/{teamId}/members
GET    /api/bc-005/teams/{teamId}/performance
POST   /api/bc-005/teams/{teamId}/optimize
```

### Skill Management API
```
POST   /api/bc-005/skills
GET    /api/bc-005/skills/{skillId}
GET    /api/bc-005/skills
POST   /api/bc-005/resources/{resourceId}/skills
GET    /api/bc-005/resources/{resourceId}/skills/gaps
POST   /api/bc-005/skills/matrix
```

### Timesheet Management API
```
POST   /api/bc-005/timesheets
GET    /api/bc-005/timesheets/{timesheetId}
PUT    /api/bc-005/timesheets/{timesheetId}
POST   /api/bc-005/timesheets/{timesheetId}/submit
POST   /api/bc-005/timesheets/{timesheetId}/approve
GET    /api/bc-005/timesheets/analyze-utilization
```

---

## BC間連携API

### BC-001 (Project) へのリソース割当
```
POST /api/bc-001/projects/{projectId}/resources
Body: { resourceId, allocationPercentage, startDate, endDate }
```

### BC-002 (Financial) へのリソースコスト送信
```
POST /api/bc-002/resource-costs
Body: { resourceId, costType, amount, period }
```

---

**ステータス**: Phase 0 - 基本構造作成完了
