# BC-004: API設計

**BC**: Organizational Structure & Governance
**作成日**: 2025-10-31
**V2移行元**: services/secure-access-service/api/（組織管理APIのみ）

---

## 概要

このディレクトリは、BC-004（組織構造とガバナンス）のAPI設計を定義します。

**重要**: Issue #146対応により、API設計はWHAT（能力定義）とHOW（利用方法）に分離されています。

---

## 主要APIエンドポイント

### Organization Management API
```
POST   /api/bc-004/organizations
GET    /api/bc-004/organizations/{orgId}
PUT    /api/bc-004/organizations/{orgId}
DELETE /api/bc-004/organizations/{orgId}
GET    /api/bc-004/organizations
GET    /api/bc-004/organizations/{orgId}/structure
GET    /api/bc-004/organizations/{orgId}/hierarchy
POST   /api/bc-004/organizations/{orgId}/restructure
```

### Organization Unit Management API
```
POST   /api/bc-004/organizations/{orgId}/units
GET    /api/bc-004/organizations/{orgId}/units/{unitId}
PUT    /api/bc-004/organizations/{orgId}/units/{unitId}
DELETE /api/bc-004/organizations/{orgId}/units/{unitId}
GET    /api/bc-004/organizations/{orgId}/units
GET    /api/bc-004/organizations/{orgId}/units/{unitId}/children
GET    /api/bc-004/organizations/{orgId}/units/{unitId}/ancestors
```

---

## BC間連携API

### BC-003 (Access Control) からの組織情報照会
```
GET /api/bc-004/organizations/{orgId}/structure
GET /api/bc-004/organizations/{orgId}/units/{unitId}/members
```

### BC-005 (Resources) からの組織単位照会
```
GET /api/bc-004/organizations/{orgId}/units
GET /api/bc-004/organizations/{orgId}/units/{unitId}
```

---

**ステータス**: Phase 0 - 基本構造作成完了
