# BC-004: ガバナンスポリシー管理API

**ドキュメント**: API層 - ガバナンスポリシー管理
**最終更新**: 2025-11-03

このドキュメントでは、組織のガバナンスポリシーと適用範囲の管理APIを定義します。

---

## 目次

1. [ポリシー管理API](#policy-api)
2. [ポリシールール管理API](#rule-api)
3. [ポリシー評価API](#evaluation-api)
4. [適用範囲管理API](#scope-api)
5. [コンプライアンス監視API](#compliance-api)

---

## ポリシー管理API {#policy-api}

### ポリシー作成

```
POST /api/bc-004/governance/policies
```

**リクエスト**:
```json
{
  "organizationId": "org-uuid",
  "name": "チームアロケーション制限ポリシー",
  "description": "メンバーのチーム参加数とアロケーション率を制限",
  "policyType": "allocation",
  "priority": 100,
  "enforcementLevel": "strict",
  "effectiveFrom": "2025-11-01",
  "effectiveUntil": null
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "policy-uuid",
    "organizationId": "org-uuid",
    "name": "チームアロケーション制限ポリシー",
    "description": "メンバーのチーム参加数とアロケーション率を制限",
    "policyType": "allocation",
    "priority": 100,
    "enforcementLevel": "strict",
    "status": "active",
    "ruleCount": 0,
    "scopeCount": 0,
    "effectiveFrom": "2025-11-01",
    "effectiveUntil": null,
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**ポリシータイプ**:
- `allocation`: アロケーション制約
- `hierarchy`: 階層構造制約
- `access_control`: アクセス制御
- `approval`: 承認ワークフロー
- `compliance`: コンプライアンス要件

**適用レベル**:
- `strict`: 厳格（違反は操作をブロック）
- `warning`: 警告（違反を通知するが操作は許可）
- `audit`: 監査（違反をログに記録）

---

### ポリシー一覧取得

```
GET /api/bc-004/governance/policies?organizationId=org-uuid&status=active&policyType=allocation
```

**クエリパラメータ**:
- `organizationId` (required): 組織ID
- `status` (optional): active | inactive
- `policyType` (optional): ポリシータイプ
- `page` (optional): ページ番号（default: 1）
- `pageSize` (optional): ページサイズ（default: 50）

**レスポンス**:
```json
{
  "data": [
    {
      "id": "policy-uuid",
      "organizationId": "org-uuid",
      "name": "チームアロケーション制限ポリシー",
      "policyType": "allocation",
      "priority": 100,
      "enforcementLevel": "strict",
      "status": "active",
      "ruleCount": 3,
      "scopeCount": 5,
      "effectiveFrom": "2025-11-01",
      "createdAt": "2025-11-03T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 10,
    "totalPages": 1
  }
}
```

---

### ポリシー詳細取得

```
GET /api/bc-004/governance/policies/{policyId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "policy-uuid",
    "organizationId": "org-uuid",
    "name": "チームアロケーション制限ポリシー",
    "description": "メンバーのチーム参加数とアロケーション率を制限",
    "policyType": "allocation",
    "priority": 100,
    "enforcementLevel": "strict",
    "status": "active",
    "rules": [
      {
        "id": "rule-uuid-1",
        "name": "最大アロケーション率制限",
        "condition": "user.totalAllocationRate <= 2.0",
        "errorMessage": "アロケーション率の合計が200%を超えています"
      },
      {
        "id": "rule-uuid-2",
        "name": "最大チーム参加数制限",
        "condition": "user.teamCount <= 5",
        "errorMessage": "チーム参加数が最大値（5）を超えています"
      }
    ],
    "scopes": [
      {
        "id": "scope-uuid-1",
        "targetType": "unit",
        "targetId": "unit-sales-uuid",
        "targetName": "営業本部",
        "includeDescendants": true
      }
    ],
    "effectiveFrom": "2025-11-01",
    "effectiveUntil": null,
    "createdAt": "2025-11-03T12:00:00Z",
    "updatedAt": "2025-11-03T12:00:00Z"
  }
}
```

---

### ポリシー更新

```
PUT /api/bc-004/governance/policies/{policyId}
```

**リクエスト**:
```json
{
  "name": "チームアロケーション制限ポリシー（改訂版）",
  "description": "メンバーのチーム参加数とアロケーション率を制限（上限緩和）",
  "priority": 90,
  "enforcementLevel": "warning"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "policy-uuid",
    "name": "チームアロケーション制限ポリシー（改訂版）",
    "description": "メンバーのチーム参加数とアロケーション率を制限（上限緩和）",
    "priority": 90,
    "enforcementLevel": "warning",
    "updatedAt": "2025-11-03T13:00:00Z"
  }
}
```

---

### ポリシー無効化

```
PUT /api/bc-004/governance/policies/{policyId}/deactivate
```

**リクエスト**:
```json
{
  "reason": "ポリシー改定のため旧ポリシー無効化"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "policy-uuid",
    "status": "inactive",
    "deactivatedAt": "2025-11-03T13:00:00Z",
    "reason": "ポリシー改定のため旧ポリシー無効化"
  }
}
```

---

## ポリシールール管理API {#rule-api}

### ルール追加

```
POST /api/bc-004/governance/policies/{policyId}/rules
```

**リクエスト**:
```json
{
  "name": "プロジェクトチーム最小メンバー数",
  "description": "プロジェクトチームは最低3名必要",
  "condition": "team.teamType == 'project' && team.memberCount >= 3",
  "errorMessage": "プロジェクトチームには最低3名のメンバーが必要です",
  "severity": "error"
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "rule-uuid",
    "policyId": "policy-uuid",
    "name": "プロジェクトチーム最小メンバー数",
    "description": "プロジェクトチームは最低3名必要",
    "condition": "team.teamType == 'project' && team.memberCount >= 3",
    "errorMessage": "プロジェクトチームには最低3名のメンバーが必要です",
    "severity": "error",
    "status": "active",
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**条件式構文**:
- 対象エンティティ: `user`, `team`, `unit`, `organization`
- 演算子: `==`, `!=`, `>`, `>=`, `<`, `<=`, `&&`, `||`, `!`
- 関数: `count()`, `sum()`, `avg()`, `max()`, `min()`, `exists()`

**重要度レベル**:
- `error`: エラー（操作をブロック）
- `warning`: 警告（通知のみ）
- `info`: 情報（ログ記録のみ）

---

### ルール一覧取得

```
GET /api/bc-004/governance/policies/{policyId}/rules
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "rule-uuid-1",
      "name": "最大アロケーション率制限",
      "condition": "user.totalAllocationRate <= 2.0",
      "errorMessage": "アロケーション率の合計が200%を超えています",
      "severity": "error",
      "status": "active",
      "violationCount": 2
    },
    {
      "id": "rule-uuid-2",
      "name": "最大チーム参加数制限",
      "condition": "user.teamCount <= 5",
      "errorMessage": "チーム参加数が最大値（5）を超えています",
      "severity": "error",
      "status": "active",
      "violationCount": 0
    }
  ]
}
```

---

### ルール更新

```
PUT /api/bc-004/governance/policies/{policyId}/rules/{ruleId}
```

**リクエスト**:
```json
{
  "condition": "user.totalAllocationRate <= 2.5",
  "errorMessage": "アロケーション率の合計が250%を超えています",
  "severity": "warning"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "rule-uuid",
    "condition": "user.totalAllocationRate <= 2.5",
    "errorMessage": "アロケーション率の合計が250%を超えています",
    "severity": "warning",
    "updatedAt": "2025-11-03T13:00:00Z"
  }
}
```

---

### ルール削除

```
DELETE /api/bc-004/governance/policies/{policyId}/rules/{ruleId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "rule-uuid",
    "status": "deleted",
    "deletedAt": "2025-11-03T13:00:00Z"
  }
}
```

---

## ポリシー評価API {#evaluation-api}

### ポリシー評価実行

```
POST /api/bc-004/governance/policies/evaluate
```

**リクエスト**:
```json
{
  "action": "add_team_member",
  "context": {
    "organizationId": "org-uuid",
    "unitId": "unit-uuid",
    "teamId": "team-uuid",
    "userId": "user-uuid",
    "allocationRate": 0.80
  }
}
```

**レスポンス**:
```json
{
  "data": {
    "allowed": false,
    "evaluatedPolicies": 3,
    "evaluatedRules": 8,
    "violations": [
      {
        "policyId": "policy-uuid",
        "policyName": "チームアロケーション制限ポリシー",
        "ruleId": "rule-uuid-1",
        "ruleName": "最大アロケーション率制限",
        "severity": "error",
        "errorMessage": "アロケーション率の合計が200%を超えています",
        "currentValue": 2.10,
        "threshold": 2.00
      }
    ],
    "warnings": [
      {
        "policyId": "policy-other-uuid",
        "policyName": "チーム分散推奨ポリシー",
        "ruleId": "rule-other-uuid",
        "ruleName": "同一組織単位への集中警告",
        "severity": "warning",
        "errorMessage": "同一組織単位のチームに集中しすぎています",
        "recommendation": "他の組織単位のチームへの参加を検討してください"
      }
    ]
  }
}
```

**アクションタイプ**:
- `add_team_member`: チームメンバー追加
- `change_allocation`: アロケーション率変更
- `create_team`: チーム作成
- `change_unit_parent`: 組織単位親変更
- `assign_team_leader`: チームリーダー任命

---

### 適用可能ポリシー取得

```
GET /api/bc-004/governance/policies/applicable?organizationId=org-uuid&unitId=unit-uuid&action=add_team_member
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "policy-uuid",
      "name": "チームアロケーション制限ポリシー",
      "policyType": "allocation",
      "priority": 100,
      "enforcementLevel": "strict",
      "applicableRules": [
        {
          "id": "rule-uuid-1",
          "name": "最大アロケーション率制限",
          "condition": "user.totalAllocationRate <= 2.0"
        }
      ],
      "scope": {
        "targetType": "unit",
        "targetId": "unit-uuid",
        "includeDescendants": true
      }
    }
  ]
}
```

---

## 適用範囲管理API {#scope-api}

### 適用範囲追加

```
POST /api/bc-004/governance/policies/{policyId}/scopes
```

**リクエスト**:
```json
{
  "targetType": "unit",
  "targetId": "unit-sales-uuid",
  "includeDescendants": true
}
```

**レスポンス** (201 Created):
```json
{
  "data": {
    "id": "scope-uuid",
    "policyId": "policy-uuid",
    "targetType": "unit",
    "targetId": "unit-sales-uuid",
    "targetName": "営業本部",
    "includeDescendants": true,
    "affectedUnitCount": 8,
    "affectedUserCount": 120,
    "createdAt": "2025-11-03T12:00:00Z"
  }
}
```

**対象タイプ**:
- `organization`: 組織全体
- `unit`: 組織単位
- `team`: チーム
- `user`: 個別ユーザー

---

### 適用範囲一覧取得

```
GET /api/bc-004/governance/policies/{policyId}/scopes
```

**レスポンス**:
```json
{
  "data": [
    {
      "id": "scope-uuid-1",
      "targetType": "unit",
      "targetId": "unit-sales-uuid",
      "targetName": "営業本部",
      "includeDescendants": true,
      "affectedUnitCount": 8,
      "affectedUserCount": 120
    },
    {
      "id": "scope-uuid-2",
      "targetType": "unit",
      "targetId": "unit-eng-uuid",
      "targetName": "技術本部",
      "includeDescendants": true,
      "affectedUnitCount": 12,
      "affectedUserCount": 200
    }
  ],
  "totalAffectedUsers": 320,
  "totalAffectedUnits": 20
}
```

---

### 適用範囲削除

```
DELETE /api/bc-004/governance/policies/{policyId}/scopes/{scopeId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "scope-uuid",
    "status": "deleted",
    "deletedAt": "2025-11-03T13:00:00Z"
  }
}
```

---

## コンプライアンス監視API {#compliance-api}

### 違反検知レポート

```
GET /api/bc-004/governance/compliance/violations?organizationId=org-uuid&startDate=2025-11-01&endDate=2025-11-30
```

**クエリパラメータ**:
- `organizationId` (required): 組織ID
- `policyId` (optional): ポリシーID
- `severity` (optional): error | warning | info
- `status` (optional): active | resolved
- `startDate` (optional): 期間開始日
- `endDate` (optional): 期間終了日

**レスポンス**:
```json
{
  "data": {
    "summary": {
      "totalViolations": 15,
      "activeViolations": 8,
      "resolvedViolations": 7,
      "bySeverity": {
        "error": 3,
        "warning": 10,
        "info": 2
      }
    },
    "violations": [
      {
        "id": "violation-uuid",
        "policyId": "policy-uuid",
        "policyName": "チームアロケーション制限ポリシー",
        "ruleId": "rule-uuid",
        "ruleName": "最大アロケーション率制限",
        "severity": "error",
        "targetType": "user",
        "targetId": "user-uuid",
        "targetName": "田中次郎",
        "errorMessage": "アロケーション率の合計が200%を超えています",
        "currentValue": 2.10,
        "threshold": 2.00,
        "status": "active",
        "detectedAt": "2025-11-15T10:30:00Z"
      }
    ]
  }
}
```

---

### 違反詳細取得

```
GET /api/bc-004/governance/compliance/violations/{violationId}
```

**レスポンス**:
```json
{
  "data": {
    "id": "violation-uuid",
    "policyId": "policy-uuid",
    "policyName": "チームアロケーション制限ポリシー",
    "ruleId": "rule-uuid",
    "ruleName": "最大アロケーション率制限",
    "severity": "error",
    "targetType": "user",
    "targetId": "user-uuid",
    "targetName": "田中次郎",
    "errorMessage": "アロケーション率の合計が200%を超えています",
    "details": {
      "currentValue": 2.10,
      "threshold": 2.00,
      "teams": [
        {
          "teamId": "team-1-uuid",
          "teamName": "プロジェクトAlpha",
          "allocationRate": 1.00
        },
        {
          "teamId": "team-2-uuid",
          "teamName": "プロジェクトBeta",
          "allocationRate": 0.80
        },
        {
          "teamId": "team-3-uuid",
          "teamName": "プロジェクトGamma",
          "allocationRate": 0.30
        }
      ]
    },
    "status": "active",
    "detectedAt": "2025-11-15T10:30:00Z",
    "lastCheckedAt": "2025-11-20T09:00:00Z"
  }
}
```

---

### 違反解決

```
PUT /api/bc-004/governance/compliance/violations/{violationId}/resolve
```

**リクエスト**:
```json
{
  "resolution": "アロケーション率を調整しました",
  "resolvedBy": "admin-user-uuid"
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "violation-uuid",
    "status": "resolved",
    "resolution": "アロケーション率を調整しました",
    "resolvedBy": "admin-user-uuid",
    "resolvedByName": "管理者太郎",
    "resolvedAt": "2025-11-20T10:00:00Z"
  }
}
```

---

### コンプライアンススコア取得

```
GET /api/bc-004/governance/compliance/score?organizationId=org-uuid
```

**レスポンス**:
```json
{
  "data": {
    "organizationId": "org-uuid",
    "organizationName": "株式会社サンプル",
    "overallScore": 92.5,
    "scoreBreakdown": {
      "policyCompliance": 95.0,
      "ruleAdherence": 90.0,
      "violationResolutionRate": 87.5,
      "timelyResolutionRate": 95.0
    },
    "metrics": {
      "totalPolicies": 10,
      "activePolicies": 8,
      "totalRules": 35,
      "activeRules": 30,
      "totalViolations": 15,
      "activeViolations": 3,
      "resolvedViolations": 12,
      "averageResolutionTime": "2.5 days"
    },
    "trend": {
      "previousScore": 88.0,
      "change": 4.5,
      "direction": "improving"
    },
    "calculatedAt": "2025-11-20T12:00:00Z"
  }
}
```

---

### コンプライアンスレポート生成

```
POST /api/bc-004/governance/compliance/reports
```

**リクエスト**:
```json
{
  "organizationId": "org-uuid",
  "reportType": "monthly",
  "startDate": "2025-11-01",
  "endDate": "2025-11-30",
  "includeViolations": true,
  "includeTrends": true,
  "format": "pdf"
}
```

**レスポンス**:
```json
{
  "data": {
    "reportId": "report-uuid",
    "reportType": "monthly",
    "period": {
      "startDate": "2025-11-01",
      "endDate": "2025-11-30"
    },
    "status": "generating",
    "estimatedCompletionTime": "2025-11-20T12:05:00Z",
    "downloadUrl": null,
    "createdAt": "2025-11-20T12:00:00Z"
  }
}
```

---

### レポートダウンロード

```
GET /api/bc-004/governance/compliance/reports/{reportId}/download
```

**レスポンス**:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="compliance-report-2025-11.pdf"

[PDFバイナリデータ]
```

---

## 関連ドキュメント

- [README.md](README.md) - API概要
- [organization-api.md](organization-api.md) - 組織管理API
- [team-api.md](team-api.md) - チーム管理API

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.3 - BC-004 API詳細化
