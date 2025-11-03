# BC-004: 組織・組織単位管理API

**ドキュメント**: API層 - 組織・組織単位管理
**最終更新**: 2025-11-03

このドキュメントでは、組織と組織単位の管理APIを定義します。

---

## 目次

1. [組織管理API](#organization-api)
2. [組織単位管理API](#unit-api)
3. [組織階層API](#hierarchy-api)
4. [組織メンバー管理API](#member-api)

---

## 組織管理API {#organization-api}

### 組織作成

```
POST /api/bc-004/organizations
```

**リクエスト**:
```json
{
  "name": "株式会社サンプル",
  "code": "SAMPLE-CORP",
  "type": "headquarters",
  "description": "サンプル組織"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "org-uuid",
    "name": "株式会社サンプル",
    "code": "SAMPLE-CORP",
    "type": "headquarters",
    "status": "active",
    "rootUnitId": "unit-root-uuid",
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### 組織一覧取得

```
GET /api/bc-004/organizations?status=active&page=1&pageSize=50
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "org-uuid",
      "name": "株式会社サンプル",
      "code": "SAMPLE-CORP",
      "type": "headquarters",
      "status": "active",
      "createdAt": "2025-11-03T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

---

### 組織詳細取得

```
GET /api/bc-004/organizations/{orgId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "org-uuid",
    "name": "株式会社サンプル",
    "code": "SAMPLE-CORP",
    "type": "headquarters",
    "status": "active",
    "description": "サンプル組織",
    "rootUnitId": "unit-root-uuid",
    "unitCount": 15,
    "memberCount": 250,
    "teamCount": 8,
    "createdAt": "2025-11-03T12:00:00Z",
    "updatedAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### 組織階層構造取得

```
GET /api/bc-004/organizations/{orgId}/structure
```

**レスポンス**:
```json
{
  "data": {
    "organizationId": "org-uuid",
    "rootUnit": {
      "id": "unit-root-uuid",
      "name": "本社",
      "hierarchyLevel": 0,
      "children": [
        {
          "id": "unit-sales-uuid",
          "name": "営業本部",
          "hierarchyLevel": 1,
          "memberCount": 50,
          "children": [
            {
              "id": "unit-sales-1-uuid",
              "name": "第一営業部",
              "hierarchyLevel": 2,
              "memberCount": 25,
              "children": []
            }
          ]
        },
        {
          "id": "unit-eng-uuid",
          "name": "技術本部",
          "hierarchyLevel": 1,
          "memberCount": 100,
          "children": []
        }
      ]
    }
  }
}
```

---

## 組織単位管理API {#unit-api}

### 組織単位作成

```
POST /api/bc-004/organizations/{orgId}/units
```

**リクエスト**:
```json
{
  "name": "営業本部",
  "parentUnitId": "unit-root-uuid",
  "unitType": "division",
  "description": "営業部門"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "unit-uuid",
    "organizationId": "org-uuid",
    "name": "営業本部",
    "parentUnitId": "unit-root-uuid",
    "unitType": "division",
    "hierarchyLevel": 1,
    "path": "/本社/営業本部",
    "memberCount": 0,
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### 組織単位一覧取得

```
GET /api/bc-004/organizations/{orgId}/units?parentUnitId=root
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "unit-sales-uuid",
      "name": "営業本部",
      "unitType": "division",
      "hierarchyLevel": 1,
      "path": "/本社/営業本部",
      "memberCount": 50
    },
    {
      "id": "unit-eng-uuid",
      "name": "技術本部",
      "unitType": "division",
      "hierarchyLevel": 1,
      "path": "/本社/技術本部",
      "memberCount": 100
    }
  ]
}
```

---

### 親単位変更（組織再編）

```
PUT /api/bc-004/organizations/{orgId}/units/{unitId}/parent
```

**リクエスト**:
```json
{
  "newParentUnitId": "unit-new-parent-uuid",
  "reason": "組織再編"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "unit-uuid",
    "organizationId": "org-uuid",
    "name": "第一営業部",
    "previousParentUnitId": "unit-old-parent-uuid",
    "newParentUnitId": "unit-new-parent-uuid",
    "previousPath": "/本社/営業本部/第一営業部",
    "newPath": "/本社/技術本部/第一営業部",
    "affectedDescendantCount": 3,
    "updatedAt": "2025-11-03T12:00:00Z"
  }
}
```

**エラー**:
- `BC004_ERR_103`: 循環参照検知
- `BC004_ERR_104`: 最大階層深度超過

---

## 組織階層API {#hierarchy-api}

### 祖先単位取得

```
GET /api/bc-004/organizations/{orgId}/units/{unitId}/ancestors
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "unit-root-uuid",
      "name": "本社",
      "hierarchyLevel": 0,
      "depth": 2
    },
    {
      "id": "unit-sales-uuid",
      "name": "営業本部",
      "hierarchyLevel": 1,
      "depth": 1
    }
  ]
}
```

---

### 子孫単位取得

```
GET /api/bc-004/organizations/{orgId}/units/{unitId}/descendants?maxDepth=2
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "unit-child-1-uuid",
      "name": "第一営業部",
      "hierarchyLevel": 2,
      "depth": 1,
      "path": "/本社/営業本部/第一営業部"
    },
    {
      "id": "unit-grandchild-uuid",
      "name": "第一営業課",
      "hierarchyLevel": 3,
      "depth": 2,
      "path": "/本社/営業本部/第一営業部/第一営業課"
    }
  ]
}
```

---

## 組織メンバー管理API {#member-api}

### メンバー追加

```
POST /api/bc-004/organizations/{orgId}/units/{unitId}/members
```

**リクエスト**:
```json
{
  "userId": "user-uuid",
  "roleInUnit": "manager"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "member-uuid",
    "organizationId": "org-uuid",
    "unitId": "unit-uuid",
    "userId": "user-uuid",
    "roleInUnit": "manager",
    "status": "active",
    "joinedAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### メンバー一覧取得

```
GET /api/bc-004/organizations/{orgId}/units/{unitId}/members
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "member-uuid",
      "userId": "user-uuid",
      "userName": "山田太郎",
      "roleInUnit": "manager",
      "status": "active",
      "joinedAt": "2025-11-03T12:00:00Z"
    }
  ]
}
```

---

### メンバー削除

```
DELETE /api/bc-004/organizations/{orgId}/units/{unitId}/members/{memberId}
```

**リクエスト**:
```json
{
  "reason": "異動"
}
```

**レスポンス** (200 OK):
```json
{
  "data": {
    "id": "member-uuid",
    "status": "inactive",
    "leftAt": "2025-11-03T12:00:00Z"
  }
}
```

---

## 関連ドキュメント

- [README.md](README.md) - API概要
- [team-api.md](team-api.md) - チーム管理API
- [governance-api.md](governance-api.md) - ガバナンスポリシーAPI

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.3 - BC-004 API詳細化
