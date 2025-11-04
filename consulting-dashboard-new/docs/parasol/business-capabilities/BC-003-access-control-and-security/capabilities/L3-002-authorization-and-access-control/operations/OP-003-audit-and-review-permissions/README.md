# OP-003: 権限を監査しレビューする

**作成日**: 2025-10-31
**所属L3**: L3-002-authorization-and-access-control: Authorization And Access Control
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/control-access-permissions/operations/audit-and-review-permissions

---

## 📋 How: この操作の定義

### 操作の概要
権限を監査しレビューするを実行し、ビジネス価値を創出する。

### 実現する機能
- 権限を監査しレビューするに必要な情報の入力と検証
- 権限を監査しレビューするプロセスの実行と進捗管理
- 結果の記録と関係者への通知
- 監査証跡の記録

### 入力
- 操作実行に必要なビジネス情報
- 実行者の認証情報と権限
- 関連エンティティの参照情報

### 出力
- 操作結果（成功/失敗）
- 更新されたエンティティ情報
- 監査ログと履歴情報
- 次のアクションへのガイダンス

---

## 📥 入力パラメータ

### アクセスレビューリクエスト
**説明**: 定期的なアクセス権限のレビューを実施

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| reviewScope | ENUM | ○ | レビュー範囲 | ['USER', 'ROLE', 'RESOURCE', 'ORGANIZATION'] |
| targetId | UUID | ○ | レビュー対象ID | 有効なUUID形式 |
| reviewType | ENUM | ○ | レビュータイプ | ['PERIODIC', 'ADHOC', 'CERTIFICATION', 'RECERTIFICATION'] |
| reviewerId | UUID | ○ | レビュー実施者ID | 有効なUUID形式 |
| reviewPeriod | OBJECT | × | レビュー期間 | {startDate, endDate} |
| includeSub Resources | BOOLEAN | × | サブリソースを含む | デフォルト: true |
| includeInherited | BOOLEAN | × | 継承権限を含む | デフォルト: true |
| riskLevel | ENUM | × | リスクレベルフィルター | ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] |
| complianceFramework | ENUM | × | 準拠フレームワーク | ['GDPR', 'SOC2', 'ISO27001', 'HIPAA'] |

### 最小権限チェックリクエスト
**説明**: ユーザー・ロールの権限が最小権限原則に準拠しているか確認

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| subjectType | ENUM | ○ | 対象タイプ | ['USER', 'ROLE'] |
| subjectId | UUID | ○ | 対象ID | 有効なUUID形式 |
| timeWindow | INTEGER | × | 利用履歴の分析期間（日数） | デフォルト: 90, 範囲: 30-365 |
| usageThreshold | PERCENTAGE | × | 使用率閾値 | デフォルト: 10%, 範囲: 1-50% |
| recommendActions | BOOLEAN | × | 是正アクション推奨 | デフォルト: true |

### SOD（職務分離）チェックリクエスト
**説明**: 職務分離ポリシーに違反していないか確認

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| userId | UUID | ○ | ユーザーID | 有効なUUID形式 |
| checkScope | ENUM | ○ | チェック範囲 | ['USER_LEVEL', 'ROLE_LEVEL', 'ORGANIZATION_LEVEL'] |
| sodPolicyId | UUID | × | SODポリシーID | 有効なUUID形式、未指定時は全ポリシー |
| includeRoleConflicts | BOOLEAN | × | ロール競合を含む | デフォルト: true |
| autoRemediate | BOOLEAN | × | 自動是正 | デフォルト: false |

### 権限使用状況分析リクエスト
**説明**: 権限の実際の使用状況を分析

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| analysisType | ENUM | ○ | 分析タイプ | ['USAGE_FREQUENCY', 'DORMANT_PERMISSIONS', 'EXCESSIVE_PRIVILEGES'] |
| targetType | ENUM | ○ | 対象タイプ | ['USER', 'ROLE', 'RESOURCE'] |
| targetId | UUID | × | 対象ID | UUID形式、未指定時は全体分析 |
| startDate | DATE | ○ | 分析開始日 | YYYY-MM-DD形式 |
| endDate | DATE | ○ | 分析終了日 | YYYY-MM-DD形式、startDate以降 |
| groupBy | ENUM | × | グルーピング | ['DAY', 'WEEK', 'MONTH'] |

### コンプライアンスレポート生成リクエスト
**説明**: 規制準拠レポートを生成

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| framework | ENUM | ○ | 準拠フレームワーク | ['GDPR', 'SOC2', 'ISO27001', 'HIPAA', 'PCI_DSS'] |
| reportType | ENUM | ○ | レポートタイプ | ['ACCESS_CONTROL', 'AUDIT_LOG', 'CERTIFICATION', 'VIOLATION'] |
| organizationId | UUID | ○ | 組織ID | 有効なUUID形式 |
| reportPeriod | OBJECT | ○ | レポート期間 | {startDate, endDate} |
| includeEvidence | BOOLEAN | × | エビデンス含む | デフォルト: true |
| format | ENUM | × | 出力形式 | ['PDF', 'EXCEL', 'JSON'] デフォルト: PDF |

### 期限切れ・未使用権限クリーンアップリクエスト
**説明**: 期限切れまたは長期未使用の権限を特定・削除

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| cleanupType | ENUM | ○ | クリーンアップタイプ | ['EXPIRED', 'DORMANT', 'BOTH'] |
| dormantThresholdDays | INTEGER | △ | 未使用期間（日数） | DORMANT選択時必須、範囲: 30-365 |
| dryRun | BOOLEAN | × | ドライラン実行 | デフォルト: true |
| autoRevoke | BOOLEAN | × | 自動取り消し | デフォルト: false |
| notifyUsers | BOOLEAN | × | ユーザー通知 | デフォルト: true |

---

## 📤 出力仕様

### アクセスレビュー結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "reviewId": "review-uuid",
    "reviewScope": "USER",
    "targetId": "user-uuid",
    "targetName": "田中太郎",
    "reviewType": "PERIODIC",
    "reviewerId": "reviewer-uuid",
    "reviewerName": "監査担当 花子",
    "startedAt": "2025-11-04T09:00:00Z",
    "completedAt": "2025-11-04T10:00:00Z",
    "summary": {
      "totalPermissions": 47,
      "directPermissions": 35,
      "inheritedPermissions": 12,
      "appropriatePermissions": 40,
      "excessivePermissions": 5,
      "unusedPermissions": 2,
      "expiredPermissions": 0
    },
    "findings": [
      {
        "findingId": "finding-uuid-1",
        "severity": "HIGH",
        "category": "EXCESSIVE_PRIVILEGE",
        "permission": {
          "permissionId": "perm-uuid-1",
          "resourceType": "SYSTEM",
          "resourceId": "admin-panel",
          "permissions": ["ADMIN"],
          "grantedAt": "2024-06-01T00:00:00Z",
          "lastUsedAt": null
        },
        "issue": "管理者権限が付与されているが、過去90日間使用履歴なし",
        "recommendation": "権限を READ に降格するか取り消しを検討",
        "riskScore": 85
      },
      {
        "findingId": "finding-uuid-2",
        "severity": "MEDIUM",
        "category": "SOD_VIOLATION",
        "conflictingRoles": ["APPROVER", "REQUESTER"],
        "issue": "承認者と申請者の役割を同時に保持（職務分離違反）",
        "recommendation": "いずれかの役割を削除",
        "riskScore": 65
      }
    ],
    "complianceStatus": {
      "GDPR": "COMPLIANT",
      "SOC2": "NON_COMPLIANT",
      "ISO27001": "PARTIAL_COMPLIANT"
    },
    "nextReviewDate": "2026-11-04T00:00:00Z"
  },
  "actions": {
    "autoApprovedPermissions": 40,
    "flaggedForReview": 5,
    "recommendedRevocations": 2
  }
}
```

### 最小権限チェック結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "checkId": "check-uuid",
    "subjectType": "USER",
    "subjectId": "user-uuid",
    "subjectName": "田中太郎",
    "analyzedPeriod": {
      "startDate": "2025-08-06",
      "endDate": "2025-11-04",
      "days": 90
    },
    "permissionUsageAnalysis": [
      {
        "permissionId": "perm-uuid-1",
        "resourceType": "PROJECT",
        "resourceId": "project-uuid-1",
        "permissions": ["READ", "WRITE", "DELETE"],
        "usageStats": {
          "READ": { "used": true, "frequency": 245, "lastUsed": "2025-11-03T14:30:00Z" },
          "WRITE": { "used": true, "frequency": 89, "lastUsed": "2025-11-02T10:15:00Z" },
          "DELETE": { "used": false, "frequency": 0, "lastUsed": null }
        },
        "recommendation": "DELETE 権限は未使用のため取り消しを推奨",
        "riskLevel": "LOW"
      },
      {
        "permissionId": "perm-uuid-2",
        "resourceType": "SYSTEM",
        "resourceId": "admin-panel",
        "permissions": ["ADMIN"],
        "usageStats": {
          "ADMIN": { "used": false, "frequency": 0, "lastUsed": null }
        },
        "recommendation": "ADMIN 権限は完全未使用のため即座に取り消しを推奨",
        "riskLevel": "HIGH"
      }
    ],
    "summary": {
      "totalPermissions": 15,
      "usedPermissions": 10,
      "unusedPermissions": 5,
      "overPrivilegedScore": 33
    },
    "remediationPlan": [
      {
        "action": "REVOKE",
        "permissionId": "perm-uuid-2",
        "reason": "完全未使用のADMIN権限",
        "priority": "HIGH"
      },
      {
        "action": "DOWNGRADE",
        "permissionId": "perm-uuid-1",
        "from": ["READ", "WRITE", "DELETE"],
        "to": ["READ", "WRITE"],
        "reason": "DELETE権限は未使用",
        "priority": "MEDIUM"
      }
    ]
  }
}
```

### SOD（職務分離）チェック結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "checkId": "sod-check-uuid",
    "userId": "user-uuid",
    "userName": "田中太郎",
    "checkScope": "USER_LEVEL",
    "violations": [
      {
        "violationId": "viol-uuid-1",
        "severity": "CRITICAL",
        "policyId": "sod-policy-uuid-1",
        "policyName": "承認と実行の分離",
        "conflictingPermissions": [
          {
            "permissionId": "perm-uuid-1",
            "resourceType": "PAYMENT",
            "permissions": ["APPROVE_PAYMENT"],
            "role": "APPROVER"
          },
          {
            "permissionId": "perm-uuid-2",
            "resourceType": "PAYMENT",
            "permissions": ["EXECUTE_PAYMENT"],
            "role": "EXECUTOR"
          }
        ],
        "issue": "同一ユーザーが支払承認と支払実行の両方の権限を保持",
        "businessRisk": "不正な支払実行のリスク",
        "recommendedAction": "いずれかの権限を削除し、別のユーザーに割り当て",
        "complianceImpact": ["SOC2", "ISO27001"]
      }
    ],
    "roleConflicts": [
      {
        "conflictId": "conflict-uuid-1",
        "conflictingRoles": [
          { "roleId": "role-uuid-1", "roleName": "財務承認者" },
          { "roleId": "role-uuid-2", "roleName": "財務実行者" }
        ],
        "sodPolicy": "財務職務分離ポリシー",
        "severity": "HIGH"
      }
    ],
    "summary": {
      "totalViolations": 1,
      "critical": 1,
      "high": 0,
      "medium": 0,
      "low": 0,
      "complianceRisk": "HIGH"
    },
    "autoRemediationApplied": false,
    "manualReviewRequired": true
  }
}
```

### 権限使用状況分析結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "analysisId": "analysis-uuid",
    "analysisType": "DORMANT_PERMISSIONS",
    "analyzedPeriod": {
      "startDate": "2025-08-06",
      "endDate": "2025-11-04"
    },
    "dormantPermissions": [
      {
        "permissionId": "perm-uuid-1",
        "userId": "user-uuid-1",
        "userName": "田中太郎",
        "resourceType": "PROJECT",
        "resourceId": "project-uuid-1",
        "permissions": ["ADMIN"],
        "grantedAt": "2024-01-15T00:00:00Z",
        "lastUsedAt": "2024-03-20T10:30:00Z",
        "dormantDays": 229,
        "riskLevel": "CRITICAL",
        "recommendation": "即座に取り消しを推奨"
      }
    ],
    "statistics": {
      "totalPermissionsAnalyzed": 523,
      "activePermissions": 398,
      "dormantPermissions": 125,
      "dormantPercentage": 23.9,
      "averageDormantDays": 156,
      "byRiskLevel": {
        "CRITICAL": 23,
        "HIGH": 45,
        "MEDIUM": 37,
        "LOW": 20
      }
    },
    "trends": {
      "monthlyUsage": [
        { "month": "2025-08", "activePercentage": 78.5 },
        { "month": "2025-09", "activePercentage": 76.2 },
        { "month": "2025-10", "activePercentage": 74.1 }
      ],
      "trend": "DECLINING"
    }
  }
}
```

### コンプライアンスレポート生成成功レスポンス
**HTTPステータス**: 201 Created

```json
{
  "success": true,
  "data": {
    "reportId": "report-uuid",
    "framework": "SOC2",
    "reportType": "ACCESS_CONTROL",
    "organizationId": "org-uuid",
    "organizationName": "株式会社Example",
    "reportPeriod": {
      "startDate": "2025-10-01",
      "endDate": "2025-10-31"
    },
    "generatedAt": "2025-11-04T11:00:00Z",
    "generatedBy": "admin-uuid",
    "complianceScore": 87.5,
    "status": "PARTIAL_COMPLIANT",
    "findings": {
      "compliant": 35,
      "nonCompliant": 8,
      "partiallyCompliant": 5,
      "total": 48
    },
    "criticalFindings": [
      {
        "controlId": "CC6.1",
        "controlName": "論理的・物理的アクセス制御",
        "status": "NON_COMPLIANT",
        "issue": "12名のユーザーに過剰な権限が付与されている",
        "evidence": ["perm-uuid-1", "perm-uuid-2"],
        "remediation": "最小権限原則に基づき権限を見直し"
      }
    ],
    "reportUrl": "/api/compliance/reports/report-uuid/download",
    "format": "PDF",
    "fileSize": 1024567
  },
  "bc007Integration": {
    "notificationSent": true,
    "recipients": ["compliance-officer@example.com", "ciso@example.com"]
  }
}
```

### クリーンアップ結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "cleanupId": "cleanup-uuid",
    "cleanupType": "BOTH",
    "executedAt": "2025-11-04T11:30:00Z",
    "dryRun": false,
    "results": {
      "expired": {
        "identified": 23,
        "revoked": 23,
        "users": 15
      },
      "dormant": {
        "identified": 47,
        "revoked": 47,
        "users": 28,
        "thresholdDays": 90
      },
      "total": {
        "identified": 70,
        "revoked": 70,
        "affectedUsers": 35
      }
    },
    "notifications": {
      "emailsSent": 35,
      "notificationsCreated": 35
    },
    "reclaimedResources": {
      "permissionRecords": 70,
      "storageSpace": "128KB"
    }
  },
  "auditLog": {
    "eventType": "PERMISSION_CLEANUP",
    "recordsCreated": 70
  }
}
```

---

## 🛠️ 実装ガイダンス

### アクセスレビュー実装

#### 1. 定期的アクセスレビューの実装
```typescript
import { prisma } from '@/lib/db';
import { auditLogger } from '@/lib/audit';
import { bc007NotificationService } from '@/lib/bc007';

interface AccessReviewRequest {
  reviewScope: 'USER' | 'ROLE' | 'RESOURCE' | 'ORGANIZATION';
  targetId: string;
  reviewType: 'PERIODIC' | 'ADHOC' | 'CERTIFICATION';
  reviewerId: string;
  includeInherited?: boolean;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

async function performAccessReview(request: AccessReviewRequest) {
  const reviewId = generateUUID();
  const findings = [];

  // 1. 権限データ収集
  const permissions = await collectPermissions(request);

  // 2. 各権限の分析
  for (const permission of permissions) {
    // 2.1. 使用頻度分析
    const usageAnalysis = await analyzePermissionUsage(
      permission.id,
      90 // 過去90日間
    );

    // 2.2. 過剰権限チェック
    if (usageAnalysis.unusedDays > 60) {
      findings.push({
        findingId: generateUUID(),
        severity: 'HIGH',
        category: 'EXCESSIVE_PRIVILEGE',
        permission,
        issue: `権限が${usageAnalysis.unusedDays}日間未使用`,
        recommendation: '権限の取り消しを推奨',
        riskScore: calculateRiskScore(permission, usageAnalysis)
      });
    }

    // 2.3. SOD違反チェック
    const sodViolations = await checkSODViolations(
      permission.subjectId,
      permission
    );

    if (sodViolations.length > 0) {
      findings.push({
        findingId: generateUUID(),
        severity: 'CRITICAL',
        category: 'SOD_VIOLATION',
        conflictingRoles: sodViolations.map(v => v.role),
        issue: '職務分離ポリシー違反',
        recommendation: '競合する権限のいずれかを削除',
        riskScore: 90
      });
    }
  }

  // 3. レビュー結果の保存
  const review = await prisma.accessReview.create({
    data: {
      id: reviewId,
      reviewScope: request.reviewScope,
      targetId: request.targetId,
      reviewType: request.reviewType,
      reviewerId: request.reviewerId,
      startedAt: new Date(),
      completedAt: new Date(),
      totalPermissions: permissions.length,
      findings: findings,
      complianceStatus: await checkComplianceStatus(permissions)
    }
  });

  // 4. 監査ログ記録
  await auditLogger.log({
    eventType: 'ACCESS_REVIEW_COMPLETED',
    reviewId,
    reviewerId: request.reviewerId,
    findingsCount: findings.length,
    highSeverityCount: findings.filter(f => f.severity === 'HIGH').length
  });

  // 5. BC-007 通知送信（重大な所見がある場合）
  const criticalFindings = findings.filter(
    f => f.severity === 'CRITICAL' || f.severity === 'HIGH'
  );

  if (criticalFindings.length > 0) {
    await bc007NotificationService.send({
      type: 'ACCESS_REVIEW_ALERT',
      recipientId: request.reviewerId,
      priority: 'HIGH',
      title: `アクセスレビュー完了: ${criticalFindings.length}件の重大な所見`,
      body: 'アクセスレビューで重大な権限問題が検出されました。',
      actionUrl: `/access-reviews/${reviewId}`
    });
  }

  return review;
}
```

#### 2. 最小権限原則チェックの実装
```typescript
async function checkLeastPrivilege(
  subjectId: string,
  subjectType: 'USER' | 'ROLE',
  timeWindowDays: number = 90
) {
  // 1. 対象の全権限を取得
  const permissions = await prisma.permission.findMany({
    where: {
      subjectType,
      subjectId,
      status: 'ACTIVE'
    }
  });

  // 2. 各権限の使用履歴を分析
  const usageAnalysis = await Promise.all(
    permissions.map(async (permission) => {
      const usage = await analyzePermissionUsage(
        permission.id,
        timeWindowDays
      );

      return {
        permission,
        usageStats: usage,
        recommendation: determineRecommendation(permission, usage)
      };
    })
  );

  // 3. 未使用権限を特定
  const unusedPermissions = usageAnalysis.filter(
    a => a.usageStats.frequency === 0
  );

  // 4. 是正計画の生成
  const remediationPlan = unusedPermissions.map(item => ({
    action: 'REVOKE',
    permissionId: item.permission.id,
    reason: `${timeWindowDays}日間未使用`,
    priority: calculatePriority(item.permission),
    estimatedRisk: 'LOW'
  }));

  return {
    totalPermissions: permissions.length,
    usedPermissions: usageAnalysis.length - unusedPermissions.length,
    unusedPermissions: unusedPermissions.length,
    overPrivilegedScore: (unusedPermissions.length / permissions.length) * 100,
    remediationPlan
  };
}

async function analyzePermissionUsage(
  permissionId: string,
  timeWindowDays: number
) {
  const startDate = subDays(new Date(), timeWindowDays);

  // Elasticsearch監査ログから使用履歴を取得
  const usageLogs = await elasticsearchClient.search({
    index: 'audit-logs',
    body: {
      query: {
        bool: {
          must: [
            { term: { 'permission.id': permissionId } },
            { range: { timestamp: { gte: startDate } } }
          ]
        }
      },
      aggs: {
        usage_frequency: { value_count: { field: 'permission.id' } },
        last_used: { max: { field: 'timestamp' } }
      }
    }
  });

  return {
    frequency: usageLogs.aggregations.usage_frequency.value,
    lastUsed: usageLogs.aggregations.last_used.value,
    unusedDays: usageLogs.aggregations.last_used.value
      ? daysBetween(new Date(usageLogs.aggregations.last_used.value), new Date())
      : timeWindowDays
  };
}
```

#### 3. SOD（職務分離）チェックの実装
```typescript
interface SODPolicy {
  id: string;
  name: string;
  conflictingRoles: string[];
  conflictingPermissions: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

async function checkSODViolations(userId: string, checkScope: string) {
  // 1. SODポリシーを取得
  const sodPolicies = await prisma.sODPolicy.findMany({
    where: { active: true }
  });

  const violations = [];

  // 2. ユーザーの権限とロールを取得
  const userPermissions = await getUserPermissions(userId);
  const userRoles = await getUserRoles(userId);

  // 3. 各SODポリシーに対してチェック
  for (const policy of sodPolicies) {
    // 3.1. ロールレベルの競合チェック
    const roleConflicts = userRoles.filter(role =>
      policy.conflictingRoles.includes(role.id)
    );

    if (roleConflicts.length >= 2) {
      violations.push({
        violationId: generateUUID(),
        severity: policy.severity,
        policyId: policy.id,
        policyName: policy.name,
        conflictingRoles: roleConflicts,
        issue: `ユーザーが競合する複数のロールを保持: ${roleConflicts.map(r => r.name).join(', ')}`,
        businessRisk: policy.businessRisk,
        recommendedAction: `いずれかのロールを削除: ${roleConflicts[0].name}`,
        complianceImpact: policy.complianceFrameworks
      });
    }

    // 3.2. 権限レベルの競合チェック
    const permissionConflicts = userPermissions.filter(perm =>
      policy.conflictingPermissions.some(cp =>
        perm.permissions.includes(cp)
      )
    );

    if (permissionConflicts.length >= 2) {
      violations.push({
        violationId: generateUUID(),
        severity: policy.severity,
        policyId: policy.id,
        policyName: policy.name,
        conflictingPermissions: permissionConflicts,
        issue: `競合する権限を同時に保持`,
        businessRisk: policy.businessRisk,
        recommendedAction: '競合する権限のいずれかを削除',
        complianceImpact: policy.complianceFrameworks
      });
    }
  }

  return violations;
}
```

#### 4. コンプライアンスレポート生成の実装
```typescript
async function generateComplianceReport(
  framework: string,
  reportType: string,
  organizationId: string,
  reportPeriod: { startDate: Date; endDate: Date }
) {
  const reportId = generateUUID();

  // 1. フレームワーク別のコントロールを取得
  const controls = await getComplianceControls(framework);

  const findings = [];
  let compliantCount = 0;
  let nonCompliantCount = 0;

  // 2. 各コントロールの評価
  for (const control of controls) {
    const assessment = await assessControl(
      control,
      organizationId,
      reportPeriod
    );

    if (assessment.status === 'COMPLIANT') {
      compliantCount++;
    } else if (assessment.status === 'NON_COMPLIANT') {
      nonCompliantCount++;
      findings.push({
        controlId: control.id,
        controlName: control.name,
        status: assessment.status,
        issue: assessment.issue,
        evidence: assessment.evidence,
        remediation: assessment.remediation
      });
    }
  }

  // 3. コンプライアンススコア計算
  const totalControls = controls.length;
  const complianceScore = (compliantCount / totalControls) * 100;

  // 4. レポートドキュメント生成（PDF）
  const reportBuffer = await generatePDFReport({
    framework,
    organizationId,
    reportPeriod,
    complianceScore,
    findings,
    controls
  });

  // 5. レポートファイル保存
  const reportPath = await saveReportFile(reportId, reportBuffer, 'PDF');

  // 6. データベースにレポート記録
  const report = await prisma.complianceReport.create({
    data: {
      id: reportId,
      framework,
      reportType,
      organizationId,
      reportPeriod,
      generatedAt: new Date(),
      complianceScore,
      status: complianceScore >= 90 ? 'COMPLIANT' : 'PARTIAL_COMPLIANT',
      findings,
      reportUrl: reportPath
    }
  });

  // 7. BC-007 通知送信（コンプライアンス担当者へ）
  await bc007NotificationService.send({
    type: 'COMPLIANCE_REPORT_GENERATED',
    recipientRole: 'COMPLIANCE_OFFICER',
    priority: complianceScore < 70 ? 'HIGH' : 'NORMAL',
    title: `${framework} コンプライアンスレポート生成完了`,
    body: `コンプライアンススコア: ${complianceScore.toFixed(1)}%`,
    actionUrl: `/compliance/reports/${reportId}`,
    metadata: {
      reportId,
      framework,
      score: complianceScore
    }
  });

  return report;
}
```

#### 5. 期限切れ・未使用権限クリーンアップの実装
```typescript
async function cleanupPermissions(
  cleanupType: 'EXPIRED' | 'DORMANT' | 'BOTH',
  dormantThresholdDays: number = 90,
  dryRun: boolean = true
) {
  const cleanupId = generateUUID();
  const results = {
    expired: { identified: 0, revoked: 0, users: new Set() },
    dormant: { identified: 0, revoked: 0, users: new Set() }
  };

  // 1. 期限切れ権限のクリーンアップ
  if (cleanupType === 'EXPIRED' || cleanupType === 'BOTH') {
    const expiredPermissions = await prisma.permission.findMany({
      where: {
        expiresAt: { lt: new Date() },
        status: 'ACTIVE'
      }
    });

    results.expired.identified = expiredPermissions.length;

    if (!dryRun) {
      for (const permission of expiredPermissions) {
        await revokePermission({
          permissionId: permission.id,
          revokedBy: 'SYSTEM_CLEANUP',
          reason: '期限切れ権限の自動クリーンアップ',
          immediateRevoke: true
        });

        results.expired.revoked++;
        results.expired.users.add(permission.subjectId);
      }
    }
  }

  // 2. 未使用権限のクリーンアップ
  if (cleanupType === 'DORMANT' || cleanupType === 'BOTH') {
    const allPermissions = await prisma.permission.findMany({
      where: { status: 'ACTIVE' }
    });

    for (const permission of allPermissions) {
      const usage = await analyzePermissionUsage(
        permission.id,
        dormantThresholdDays
      );

      if (usage.frequency === 0) {
        results.dormant.identified++;

        if (!dryRun) {
          await revokePermission({
            permissionId: permission.id,
            revokedBy: 'SYSTEM_CLEANUP',
            reason: `${dormantThresholdDays}日間未使用のため自動削除`,
            immediateRevoke: true
          });

          results.dormant.revoked++;
          results.dormant.users.add(permission.subjectId);
        }
      }
    }
  }

  // 3. クリーンアップ結果の記録
  const cleanup = await prisma.permissionCleanup.create({
    data: {
      id: cleanupId,
      cleanupType,
      executedAt: new Date(),
      dryRun,
      results: {
        expired: {
          identified: results.expired.identified,
          revoked: results.expired.revoked,
          users: results.expired.users.size
        },
        dormant: {
          identified: results.dormant.identified,
          revoked: results.dormant.revoked,
          users: results.dormant.users.size,
          thresholdDays: dormantThresholdDays
        }
      }
    }
  });

  // 4. 監査ログ記録
  await auditLogger.log({
    eventType: 'PERMISSION_CLEANUP',
    cleanupId,
    dryRun,
    totalRevoked: results.expired.revoked + results.dormant.revoked,
    affectedUsers: results.expired.users.size + results.dormant.users.size
  });

  return cleanup;
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### アクセスレビューエラー (E-REVIEW-1xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-REVIEW-1001 | 400 | Invalid review scope | 不正なレビュー範囲 | 'USER', 'ROLE', 'RESOURCE', 'ORGANIZATION'のいずれかを指定 |
| E-REVIEW-1002 | 404 | Review target not found | レビュー対象が存在しない | 有効な対象IDを指定 |
| E-REVIEW-1003 | 403 | Insufficient review permissions | レビュー権限なし | レビュー権限が必要 |
| E-REVIEW-1004 | 400 | Invalid review period | 不正なレビュー期間 | 有効な期間を指定 |
| E-REVIEW-1005 | 500 | Review processing failed | レビュー処理失敗 | 再試行、失敗時はサポートに連絡 |

#### SODチェックエラー (E-SOD-2xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-SOD-2001 | 400 | Invalid check scope | 不正なチェック範囲 | 有効なチェック範囲を指定 |
| E-SOD-2002 | 404 | SOD policy not found | SODポリシーが存在しない | 有効なポリシーIDを指定 |
| E-SOD-2003 | 409 | SOD violation detected | SOD違反を検出 | 競合する権限を削除 |
| E-SOD-2004 | 500 | SOD check failed | SODチェック失敗 | 再試行、失敗時はサポートに連絡 |

#### コンプライアンスレポートエラー (E-COMP-3xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-COMP-3001 | 400 | Invalid framework | 不正なフレームワーク | 有効なフレームワークを指定 |
| E-COMP-3002 | 400 | Invalid report period | 不正なレポート期間 | 有効な期間を指定 |
| E-COMP-3003 | 500 | Report generation failed | レポート生成失敗 | 再試行、失敗時はサポートに連絡 |
| E-COMP-3004 | 507 | Insufficient storage | ストレージ不足 | ストレージを確保 |

#### 権限分析エラー (E-ANALYSIS-4xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-ANALYSIS-4001 | 400 | Invalid analysis type | 不正な分析タイプ | 有効な分析タイプを指定 |
| E-ANALYSIS-4002 | 400 | Invalid time window | 不正な時間枠 | 30-365日の範囲で指定 |
| E-ANALYSIS-4003 | 500 | Analysis processing failed | 分析処理失敗 | 再試行、失敗時はサポートに連絡 |
| E-ANALYSIS-4004 | 503 | Elasticsearch unavailable | Elasticsearch利用不可 | サービス復旧を待つ |

#### クリーンアップエラー (E-CLEANUP-5xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-CLEANUP-5001 | 400 | Invalid cleanup type | 不正なクリーンアップタイプ | 有効なタイプを指定 |
| E-CLEANUP-5002 | 400 | Invalid threshold | 不正な閾値 | 30-365日の範囲で指定 |
| E-CLEANUP-5003 | 500 | Cleanup failed | クリーンアップ失敗 | ロールバック実施、再試行 |
| E-CLEANUP-5004 | 409 | Cleanup already running | クリーンアップ実行中 | 実行完了を待つ |

### エラーレスポンス形式

```json
{
  "success": false,
  "error": {
    "code": "E-SOD-2003",
    "message": "SOD violation detected",
    "details": "ユーザー「田中太郎」に職務分離違反が検出されました。",
    "timestamp": "2025-11-04T12:00:00Z",
    "requestId": "req-uuid"
  },
  "violations": [
    {
      "policyId": "sod-policy-uuid-1",
      "policyName": "承認と実行の分離",
      "severity": "CRITICAL",
      "conflictingPermissions": ["APPROVE_PAYMENT", "EXECUTE_PAYMENT"]
    }
  ],
  "suggestedActions": [
    "いずれかの権限を削除",
    "別のユーザーに権限を再割り当て",
    "SODポリシーを見直す"
  ]
}
```

### 監査ログ記録

```typescript
// アクセスレビュー完了
await auditLog.record({
  eventType: 'ACCESS_REVIEW_COMPLETED',
  reviewId: review.id,
  reviewerId: request.reviewerId,
  targetId: request.targetId,
  findingsCount: findings.length,
  criticalFindings: findings.filter(f => f.severity === 'CRITICAL').length,
  timestamp: new Date()
});

// SOD違反検出
await auditLog.record({
  eventType: 'SOD_VIOLATION_DETECTED',
  userId: userId,
  violations: violations.length,
  criticalViolations: violations.filter(v => v.severity === 'CRITICAL').length,
  autoRemediated: autoRemediate,
  timestamp: new Date()
});

// コンプライアンスレポート生成
await auditLog.record({
  eventType: 'COMPLIANCE_REPORT_GENERATED',
  reportId: report.id,
  framework: framework,
  complianceScore: report.complianceScore,
  nonCompliantControls: report.findings.length,
  timestamp: new Date()
});
```

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

この操作に関連するドメインエンティティ、値オブジェクト、集約の詳細定義は、上記ドメインモデルドキュメントを参照してください。

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

この操作を実現するAPIエンドポイント、リクエスト/レスポンス形式、認証・認可要件は、上記API仕様ドキュメントを参照してください。

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

この操作が扱うデータ構造、永続化要件、データ整合性制約は、上記データモデルドキュメントを参照してください。

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

> **注記**: ユースケースは Phase 4 の実装フェーズで、V2構造から段階的に移行・作成されます。
> 
> **Phase 3 (現在)**: Operation構造とREADME作成
> **Phase 4 (次)**: UseCase定義とページ定義の移行
> **Phase 5**: API実装とテストコード

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/secure-access-service/capabilities/control-access-permissions/operations/audit-and-review-permissions/](../../../../../../services/secure-access-service/capabilities/control-access-permissions/operations/audit-and-review-permissions/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
