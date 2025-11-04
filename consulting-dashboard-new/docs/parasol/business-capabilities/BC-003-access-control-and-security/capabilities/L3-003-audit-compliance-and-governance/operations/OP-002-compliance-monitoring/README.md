# OP-002: コンプライアンスを監視する

**作成日**: 2025-10-31
**所属L3**: L3-003-audit-compliance-and-governance: Audit Compliance And Governance
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/audit-and-assure-security/operations/compliance-monitoring

---

## 📋 How: この操作の定義

### 操作の概要
コンプライアンスを監視するを実行し、ビジネス価値を創出する。

### 実現する機能
- コンプライアンスを監視するに必要な情報の入力と検証
- コンプライアンスを監視するプロセスの実行と進捗管理
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

### 1. コンプライアンスチェック実行

```typescript
interface ComplianceCheckRequest {
  // チェック対象範囲
  scope: {
    organizationId?: string;          // 組織ID（組織全体チェック時）
    projectId?: string;               // プロジェクトID（プロジェクト単位チェック時）
    userId?: string;                  // ユーザーID（個人単位チェック時）
    resourceType?: string;            // リソースタイプ（特定リソースチェック時）
  };

  // コンプライアンスフレームワーク
  frameworks: ComplianceFramework[];  // ['GDPR', 'SOC2', 'ISO27001', 'HIPAA', 'PCI_DSS']

  // チェック種別
  checkType: 'FULL' | 'INCREMENTAL' | 'TARGETED';

  // 対象期間
  period?: {
    startDate: Date;
    endDate: Date;
  };

  // 詳細度レベル
  detailLevel: 'SUMMARY' | 'DETAILED' | 'COMPREHENSIVE';

  // レポート形式
  reportFormat?: 'JSON' | 'PDF' | 'EXCEL' | 'CSV';

  // 実行者情報
  executedBy: string;                 // 監査実行者ID
  executionReason?: string;           // 実行理由

  // 自動修復オプション
  autoRemediate?: boolean;            // 自動修復の有効化
  remediationLevel?: 'LOW' | 'MEDIUM' | 'HIGH'; // 修復対象深刻度
}

enum ComplianceFramework {
  GDPR = 'GDPR',                      // EU一般データ保護規則
  SOC2 = 'SOC2',                      // SOC2 Type II
  ISO27001 = 'ISO27001',              // ISO/IEC 27001情報セキュリティ
  HIPAA = 'HIPAA',                    // 米国医療保険の携行性と責任に関する法律
  PCI_DSS = 'PCI_DSS'                 // クレジットカード業界データセキュリティ基準
}
```

### 2. ポリシー評価リクエスト

```typescript
interface PolicyEvaluationRequest {
  // ポリシーID
  policyId: string;

  // 評価対象
  target: {
    entityType: 'USER' | 'RESOURCE' | 'PERMISSION' | 'OPERATION';
    entityId: string;
  };

  // 評価コンテキスト
  context: {
    ipAddress?: string;
    location?: string;
    timestamp: Date;
    requestMetadata?: Record<string, any>;
  };

  // 評価モード
  mode: 'ENFORCE' | 'AUDIT_ONLY';     // 強制モード or 監査のみモード

  // 評価者
  evaluatedBy: string;
}
```

### 3. 違反検出リクエスト

```typescript
interface ViolationDetectionRequest {
  // 検出範囲
  scope: {
    startDate: Date;
    endDate: Date;
    organizationId?: string;
    includeArchived?: boolean;
  };

  // 検出ルール
  rules: ViolationRule[];

  // 深刻度フィルター
  severityFilter?: ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')[];

  // 検出モード
  mode: 'REALTIME' | 'BATCH';

  // 通知設定
  notificationConfig?: {
    enabled: boolean;
    recipients: string[];              // BC-007通知先
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

interface ViolationRule {
  ruleId: string;
  framework: ComplianceFramework;
  category: string;                    // 例: 'access_control', 'data_retention', 'encryption'
  enabled: boolean;
  threshold?: number;                  // 閾値（該当する場合）
}
```

### 4. 修復追跡リクエスト

```typescript
interface RemediationTrackingRequest {
  // 違反ID
  violationId: string;

  // 修復計画
  remediationPlan: {
    plannedDate: Date;                 // 修復予定日
    assignedTo: string;                // 修復担当者
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    estimatedEffort?: string;          // 見積もり工数
    description: string;               // 修復計画詳細
  };

  // 修復ステータス更新
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'CLOSED';

  // 修復証跡
  evidence?: {
    timestamp: Date;
    description: string;
    attachments?: string[];            // 添付ファイルURL
    verifiedBy?: string;               // 検証者
  };

  // BC-007通知設定
  notifyStakeholders?: boolean;
}
```

### 入力パラメータのバリデーション

```typescript
import { z } from 'zod';

const ComplianceCheckRequestSchema = z.object({
  scope: z.object({
    organizationId: z.string().uuid().optional(),
    projectId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    resourceType: z.string().optional()
  }),
  frameworks: z.array(z.enum(['GDPR', 'SOC2', 'ISO27001', 'HIPAA', 'PCI_DSS'])).min(1),
  checkType: z.enum(['FULL', 'INCREMENTAL', 'TARGETED']),
  period: z.object({
    startDate: z.date(),
    endDate: z.date()
  }).optional(),
  detailLevel: z.enum(['SUMMARY', 'DETAILED', 'COMPREHENSIVE']),
  reportFormat: z.enum(['JSON', 'PDF', 'EXCEL', 'CSV']).optional(),
  executedBy: z.string().uuid(),
  executionReason: z.string().optional(),
  autoRemediate: z.boolean().optional(),
  remediationLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional()
}).refine(
  (data) => !data.period || data.period.endDate >= data.period.startDate,
  { message: '終了日は開始日以降である必要があります' }
);

function validateComplianceCheckRequest(request: unknown): ComplianceCheckRequest {
  return ComplianceCheckRequestSchema.parse(request);
}
```

---

## 📤 出力仕様

### 1. コンプライアンスチェック結果

```typescript
interface ComplianceCheckResult {
  // チェックID
  checkId: string;

  // 実行情報
  execution: {
    executedAt: Date;
    executedBy: string;
    duration: number;                  // 実行時間（ミリ秒）
    scope: ComplianceCheckRequest['scope'];
    frameworks: ComplianceFramework[];
  };

  // 総合評価
  overallAssessment: {
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL' | 'NEEDS_REVIEW';
    complianceScore: number;           // 0-100のスコア
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
  };

  // フレームワーク別結果
  frameworkResults: FrameworkComplianceResult[];

  // 違反サマリー
  violations: {
    total: number;
    bySeverity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    byCategory: Record<string, number>;
  };

  // 推奨アクション
  recommendations: Recommendation[];

  // レポートURL
  reportUrl?: string;                  // PDFレポート等のURL

  // 次回チェック推奨日
  nextCheckRecommended: Date;
}

interface FrameworkComplianceResult {
  framework: ComplianceFramework;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
  score: number;

  // コントロール別結果
  controls: ControlCheckResult[];

  // 主要な課題
  keyIssues: string[];

  // 証拠文書
  evidence: {
    documentId: string;
    type: string;
    url: string;
  }[];
}

interface ControlCheckResult {
  controlId: string;
  controlName: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'NOT_APPLICABLE';
  findings: string[];
  evidence: string[];
}

interface Recommendation {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  estimatedEffort: string;
  impact: string;
  dueDate?: Date;
}
```

**出力例（JSON）**:

```json
{
  "checkId": "check-2025-001",
  "execution": {
    "executedAt": "2025-11-04T10:00:00Z",
    "executedBy": "audit-user-123",
    "duration": 45000,
    "scope": {
      "organizationId": "org-001"
    },
    "frameworks": ["GDPR", "SOC2", "ISO27001"]
  },
  "overallAssessment": {
    "status": "PARTIAL",
    "complianceScore": 78,
    "totalChecks": 150,
    "passedChecks": 117,
    "failedChecks": 23,
    "warningChecks": 10
  },
  "frameworkResults": [
    {
      "framework": "GDPR",
      "status": "PARTIAL",
      "score": 82,
      "controls": [
        {
          "controlId": "GDPR-7.1",
          "controlName": "データ最小化",
          "category": "data_protection",
          "status": "FAIL",
          "findings": [
            "不要な個人データが30日以上保持されています"
          ],
          "evidence": ["audit-log-2025-11-01"]
        }
      ],
      "keyIssues": [
        "データ保持期間違反（5件）",
        "同意管理の不備（3件）"
      ],
      "evidence": []
    }
  ],
  "violations": {
    "total": 23,
    "bySeverity": {
      "critical": 2,
      "high": 8,
      "medium": 10,
      "low": 3
    },
    "byCategory": {
      "access_control": 5,
      "data_retention": 8,
      "encryption": 4,
      "logging": 6
    }
  },
  "recommendations": [
    {
      "priority": "CRITICAL",
      "category": "data_retention",
      "title": "古いデータの削除",
      "description": "保持期間を超えた個人データ（8件）を直ちに削除してください",
      "estimatedEffort": "2時間",
      "impact": "GDPR Article 5(1)(e) 違反のリスク軽減",
      "dueDate": "2025-11-07T23:59:59Z"
    }
  ],
  "reportUrl": "https://s3.example.com/compliance-reports/check-2025-001.pdf",
  "nextCheckRecommended": "2025-12-04T10:00:00Z"
}
```

### 2. ポリシー評価結果

```typescript
interface PolicyEvaluationResult {
  evaluationId: string;
  policyId: string;
  timestamp: Date;

  // 評価結果
  decision: 'ALLOW' | 'DENY' | 'CONDITIONAL';

  // 評価詳細
  details: {
    matchedRules: PolicyRule[];
    violatedRules: PolicyRule[];
    appliedConditions?: string[];
  };

  // 違反情報（DENY時）
  violation?: {
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
    framework: ComplianceFramework;
    remediationRequired: boolean;
  };

  // 監査証跡
  auditTrail: {
    evaluatedBy: string;
    context: Record<string, any>;
    logId: string;
  };
}

interface PolicyRule {
  ruleId: string;
  ruleName: string;
  description: string;
  framework: ComplianceFramework;
}
```

### 3. 違反検出結果

```typescript
interface ViolationDetectionResult {
  detectionId: string;
  timestamp: Date;

  // 検出された違反
  violations: DetectedViolation[];

  // 統計
  statistics: {
    totalViolations: number;
    newViolations: number;
    recurringViolations: number;
    resolvedViolations: number;
    bySeverity: Record<string, number>;
    byFramework: Record<ComplianceFramework, number>;
  };

  // トレンド分析
  trend: {
    comparedToPrevious: 'IMPROVING' | 'STABLE' | 'WORSENING';
    changePercentage: number;
    timeSeriesData: {
      date: Date;
      violationCount: number;
    }[];
  };

  // BC-007通知ステータス
  notificationSent: boolean;
  notificationRecipients?: string[];
}

interface DetectedViolation {
  violationId: string;
  framework: ComplianceFramework;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  // 違反詳細
  details: {
    ruleId: string;
    ruleName: string;
    description: string;
    detectedAt: Date;
    affectedEntities: {
      entityType: string;
      entityId: string;
      entityName?: string;
    }[];
  };

  // 影響範囲
  impact: {
    usersAffected?: number;
    dataRecordsAffected?: number;
    businessImpact: string;
  };

  // 修復状況
  remediationStatus: 'NOT_STARTED' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  assignedTo?: string;
  dueDate?: Date;

  // 証拠
  evidence: {
    logEntries: string[];
    screenshots?: string[];
    documentRefs?: string[];
  };
}
```

### 4. 修復追跡結果

```typescript
interface RemediationTrackingResult {
  trackingId: string;
  violationId: string;

  // 修復ステータス
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'CLOSED';

  // タイムライン
  timeline: {
    plannedDate: Date;
    startedDate?: Date;
    completedDate?: Date;
    verifiedDate?: Date;
    closedDate?: Date;
  };

  // 修復詳細
  remediation: {
    assignedTo: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    actions: RemediationAction[];
    estimatedEffort: string;
    actualEffort?: string;
  };

  // 検証結果
  verification?: {
    verifiedBy: string;
    verifiedAt: Date;
    outcome: 'SUCCESSFUL' | 'PARTIAL' | 'FAILED';
    notes: string;
    evidenceUrls: string[];
  };

  // 通知履歴（BC-007）
  notifications: {
    sentAt: Date;
    recipientId: string;
    type: string;
    status: 'SENT' | 'DELIVERED' | 'READ';
  }[];
}

interface RemediationAction {
  actionId: string;
  description: string;
  completedAt?: Date;
  completedBy?: string;
  evidence?: string[];
}
```

---

## 🛠️ 実装ガイダンス

### 1. コンプライアンスチェックエンジン実装

```typescript
import { prisma } from '@/lib/db';
import { auditLogger } from '@/lib/audit/winston-elasticsearch';

class ComplianceCheckEngine {

  /**
   * コンプライアンスチェックを実行
   */
  async executeComplianceCheck(
    request: ComplianceCheckRequest
  ): Promise<ComplianceCheckResult> {
    const checkId = generateUUID();
    const startTime = Date.now();

    // 1. チェック実行記録
    await this.recordCheckExecution(checkId, request);

    // 2. フレームワーク別チェック実行
    const frameworkResults: FrameworkComplianceResult[] = [];

    for (const framework of request.frameworks) {
      const result = await this.checkFrameworkCompliance(
        framework,
        request.scope,
        request.detailLevel
      );
      frameworkResults.push(result);
    }

    // 3. 総合評価算出
    const overallAssessment = this.calculateOverallAssessment(frameworkResults);

    // 4. 違反検出
    const violations = await this.detectViolations(frameworkResults);

    // 5. 推奨アクション生成
    const recommendations = await this.generateRecommendations(
      frameworkResults,
      violations
    );

    // 6. レポート生成（非同期）
    let reportUrl: string | undefined;
    if (request.reportFormat) {
      reportUrl = await this.generateReport(
        checkId,
        frameworkResults,
        request.reportFormat
      );
    }

    // 7. 自動修復（オプション）
    if (request.autoRemediate) {
      await this.performAutoRemediation(
        violations,
        request.remediationLevel || 'LOW'
      );
    }

    // 8. 監査ログ記録
    await auditLogger.log({
      eventType: 'COMPLIANCE_CHECK_EXECUTED',
      userId: request.executedBy,
      details: {
        checkId,
        frameworks: request.frameworks,
        scope: request.scope,
        overallStatus: overallAssessment.status,
        violationCount: violations.total
      }
    });

    // 9. BC-007通知（重大な違反が検出された場合）
    if (violations.bySeverity.critical > 0 || violations.bySeverity.high > 0) {
      await this.sendComplianceAlert(checkId, violations, request.executedBy);
    }

    const duration = Date.now() - startTime;

    return {
      checkId,
      execution: {
        executedAt: new Date(),
        executedBy: request.executedBy,
        duration,
        scope: request.scope,
        frameworks: request.frameworks
      },
      overallAssessment,
      frameworkResults,
      violations,
      recommendations,
      reportUrl,
      nextCheckRecommended: this.calculateNextCheckDate(request.checkType)
    };
  }

  /**
   * フレームワーク別コンプライアンスチェック
   */
  private async checkFrameworkCompliance(
    framework: ComplianceFramework,
    scope: ComplianceCheckRequest['scope'],
    detailLevel: string
  ): Promise<FrameworkComplianceResult> {

    // フレームワーク固有のコントロールを取得
    const controls = await this.getFrameworkControls(framework);

    const controlResults: ControlCheckResult[] = [];

    for (const control of controls) {
      const result = await this.evaluateControl(control, scope);
      controlResults.push(result);
    }

    // スコア算出
    const passedControls = controlResults.filter(c => c.status === 'PASS').length;
    const score = Math.round((passedControls / controlResults.length) * 100);

    // ステータス判定
    let status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
    if (score >= 95) {
      status = 'COMPLIANT';
    } else if (score >= 70) {
      status = 'PARTIAL';
    } else {
      status = 'NON_COMPLIANT';
    }

    // 主要な課題を抽出
    const keyIssues = controlResults
      .filter(c => c.status === 'FAIL')
      .map(c => `${c.controlName}: ${c.findings.join(', ')}`)
      .slice(0, 5); // トップ5の課題

    return {
      framework,
      status,
      score,
      controls: controlResults,
      keyIssues,
      evidence: []
    };
  }

  /**
   * GDPR固有チェック実装例
   */
  private async checkGDPRCompliance(scope: any): Promise<ControlCheckResult[]> {
    const results: ControlCheckResult[] = [];

    // GDPR Article 5(1)(e) - データ保持期間
    const dataRetentionCheck = await this.checkDataRetention(scope);
    results.push({
      controlId: 'GDPR-5.1.e',
      controlName: 'データ保持期間遵守',
      category: 'data_protection',
      status: dataRetentionCheck.compliant ? 'PASS' : 'FAIL',
      findings: dataRetentionCheck.findings,
      evidence: dataRetentionCheck.evidenceIds
    });

    // GDPR Article 32 - セキュリティ対策
    const securityCheck = await this.checkSecurityMeasures(scope);
    results.push({
      controlId: 'GDPR-32',
      controlName: '適切なセキュリティ対策',
      category: 'security',
      status: securityCheck.compliant ? 'PASS' : 'FAIL',
      findings: securityCheck.findings,
      evidence: securityCheck.evidenceIds
    });

    // GDPR Article 30 - 処理活動の記録
    const recordsCheck = await this.checkProcessingRecords(scope);
    results.push({
      controlId: 'GDPR-30',
      controlName: '処理活動の記録',
      category: 'documentation',
      status: recordsCheck.compliant ? 'PASS' : 'FAIL',
      findings: recordsCheck.findings,
      evidence: recordsCheck.evidenceIds
    });

    return results;
  }

  /**
   * データ保持期間チェック
   */
  private async checkDataRetention(scope: any): Promise<{
    compliant: boolean;
    findings: string[];
    evidenceIds: string[];
  }> {
    const findings: string[] = [];
    const evidenceIds: string[] = [];

    // 削除予定を過ぎたデータの検出
    const expiredData = await prisma.auditLog.findMany({
      where: {
        expiresAt: { lt: new Date() }
      },
      select: {
        id: true,
        eventType: true,
        createdAt: true,
        expiresAt: true
      }
    });

    if (expiredData.length > 0) {
      findings.push(
        `保持期間を超えたデータが${expiredData.length}件存在します`
      );
      evidenceIds.push(...expiredData.map(d => d.id));
    }

    // 90日ルールの確認
    const ninetyDaysAgo = subDays(new Date(), 90);
    const oldDataWithoutExpiry = await prisma.auditLog.count({
      where: {
        createdAt: { lt: ninetyDaysAgo },
        expiresAt: null
      }
    });

    if (oldDataWithoutExpiry > 0) {
      findings.push(
        `削除予定日が設定されていない古いデータが${oldDataWithoutExpiry}件存在します`
      );
    }

    return {
      compliant: findings.length === 0,
      findings,
      evidenceIds
    };
  }
}

export const complianceCheckEngine = new ComplianceCheckEngine();
```

### 2. ポリシー評価エンジン実装

```typescript
class PolicyEvaluationEngine {

  /**
   * ポリシー評価を実行
   */
  async evaluatePolicy(
    request: PolicyEvaluationRequest
  ): Promise<PolicyEvaluationResult> {
    const evaluationId = generateUUID();

    // 1. ポリシー定義取得
    const policy = await this.getPolicy(request.policyId);

    if (!policy) {
      throw new PolicyNotFoundError(`Policy ${request.policyId} not found`);
    }

    // 2. ルール評価
    const matchedRules: PolicyRule[] = [];
    const violatedRules: PolicyRule[] = [];
    let decision: 'ALLOW' | 'DENY' | 'CONDITIONAL' = 'ALLOW';

    for (const rule of policy.rules) {
      const ruleResult = await this.evaluateRule(
        rule,
        request.target,
        request.context
      );

      if (ruleResult.matched) {
        matchedRules.push(rule);

        if (ruleResult.violated) {
          violatedRules.push(rule);
          decision = 'DENY';
        }
      }
    }

    // 3. 違反情報の生成（DENY時）
    let violation: PolicyEvaluationResult['violation'];
    if (decision === 'DENY' && violatedRules.length > 0) {
      const mostSevereRule = this.getMostSevereRule(violatedRules);

      violation = {
        severity: mostSevereRule.severity,
        reason: mostSevereRule.description,
        framework: mostSevereRule.framework,
        remediationRequired: mostSevereRule.severity === 'CRITICAL' || mostSevereRule.severity === 'HIGH'
      };
    }

    // 4. 監査ログ記録
    const logId = await auditLogger.log({
      eventType: 'POLICY_EVALUATED',
      userId: request.evaluatedBy,
      details: {
        evaluationId,
        policyId: request.policyId,
        decision,
        violatedRulesCount: violatedRules.length
      }
    });

    // 5. ENFORCE モードの場合、違反時にBC-007通知
    if (request.mode === 'ENFORCE' && decision === 'DENY') {
      await bc007NotificationService.send({
        type: 'POLICY_VIOLATION',
        recipientId: request.evaluatedBy,
        title: 'ポリシー違反が検出されました',
        body: `ポリシー「${policy.name}」に違反するアクションが検出されました。`,
        priority: violation?.severity === 'CRITICAL' ? 'HIGH' : 'NORMAL',
        metadata: {
          evaluationId,
          policyId: request.policyId,
          violatedRules: violatedRules.map(r => r.ruleId)
        }
      });
    }

    return {
      evaluationId,
      policyId: request.policyId,
      timestamp: new Date(),
      decision,
      details: {
        matchedRules,
        violatedRules,
        appliedConditions: policy.conditions
      },
      violation,
      auditTrail: {
        evaluatedBy: request.evaluatedBy,
        context: request.context,
        logId
      }
    };
  }

  /**
   * SOC2 Type II固有ルール評価例
   */
  private async evaluateSOC2Rules(
    target: any,
    context: any
  ): Promise<{matched: boolean; violated: boolean}> {

    // CC6.1 - アクセス制御の論理設計
    if (target.entityType === 'PERMISSION') {
      // 最小権限の原則チェック
      const permission = await prisma.permission.findUnique({
        where: { id: target.entityId },
        include: {
          user: true,
          resource: true
        }
      });

      if (permission) {
        // 過剰権限チェック
        const usageStats = await this.getPermissionUsageStats(permission.id, 90);

        if (usageStats.unusedDays > 60) {
          return {
            matched: true,
            violated: true // 60日以上未使用 = SOC2違反
          };
        }
      }
    }

    return { matched: true, violated: false };
  }
}

export const policyEvaluationEngine = new PolicyEvaluationEngine();
```

### 3. 違反検出エンジン実装

```typescript
import { ElasticsearchClient } from '@elastic/elasticsearch';

class ViolationDetectionEngine {
  private esClient: ElasticsearchClient;

  /**
   * 違反検出を実行
   */
  async detectViolations(
    request: ViolationDetectionRequest
  ): Promise<ViolationDetectionResult> {
    const detectionId = generateUUID();
    const violations: DetectedViolation[] = [];

    // 1. ルール別違反検出
    for (const rule of request.rules) {
      if (!rule.enabled) continue;

      const detected = await this.detectByRule(rule, request.scope);
      violations.push(...detected);
    }

    // 2. 深刻度フィルタリング
    const filteredViolations = request.severityFilter
      ? violations.filter(v => request.severityFilter!.includes(v.severity))
      : violations;

    // 3. 統計算出
    const statistics = this.calculateStatistics(filteredViolations);

    // 4. トレンド分析
    const trend = await this.analyzeTrend(request.scope);

    // 5. BC-007通知（設定されている場合）
    let notificationSent = false;
    let notificationRecipients: string[] = [];

    if (request.notificationConfig?.enabled) {
      const criticalViolations = filteredViolations.filter(
        v => v.severity === request.notificationConfig!.severity
      );

      if (criticalViolations.length > 0) {
        await this.sendViolationNotifications(
          criticalViolations,
          request.notificationConfig.recipients
        );
        notificationSent = true;
        notificationRecipients = request.notificationConfig.recipients;
      }
    }

    // 6. 検出結果をデータベースに保存
    await prisma.violationDetection.create({
      data: {
        detectionId,
        timestamp: new Date(),
        scope: request.scope,
        totalViolations: filteredViolations.length,
        violations: {
          create: filteredViolations.map(v => ({
            violationId: v.violationId,
            framework: v.framework,
            category: v.category,
            severity: v.severity,
            details: v.details,
            status: 'NOT_STARTED'
          }))
        }
      }
    });

    return {
      detectionId,
      timestamp: new Date(),
      violations: filteredViolations,
      statistics,
      trend,
      notificationSent,
      notificationRecipients: notificationSent ? notificationRecipients : undefined
    };
  }

  /**
   * Elasticsearchを使用したリアルタイム違反検出
   */
  private async detectByRuleRealtime(
    rule: ViolationRule,
    scope: any
  ): Promise<DetectedViolation[]> {
    const violations: DetectedViolation[] = [];

    // Elasticsearchクエリ構築
    const query = this.buildElasticsearchQuery(rule, scope);

    const result = await this.esClient.search({
      index: 'audit-logs-*',
      body: {
        query,
        size: 1000,
        sort: [{ '@timestamp': 'desc' }]
      }
    });

    // 検出結果の解析
    for (const hit of result.hits.hits) {
      const logEntry = hit._source as any;

      // ルール適用判定
      if (this.matchesRule(logEntry, rule)) {
        const violation = await this.createViolationFromLog(logEntry, rule);
        violations.push(violation);
      }
    }

    return violations;
  }

  /**
   * ISO27001 A.9.2.1 (ユーザー登録・登録解除) 違反検出例
   */
  private async detectISO27001UserAccessViolations(
    scope: any
  ): Promise<DetectedViolation[]> {
    const violations: DetectedViolation[] = [];

    // 退職者のアクセス権が残っている場合
    const inactiveUsersWithAccess = await prisma.user.findMany({
      where: {
        status: 'INACTIVE',
        permissions: {
          some: {
            status: 'ACTIVE'
          }
        }
      },
      include: {
        permissions: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    for (const user of inactiveUsersWithAccess) {
      violations.push({
        violationId: generateUUID(),
        framework: 'ISO27001',
        category: 'access_control',
        severity: 'HIGH',
        details: {
          ruleId: 'ISO27001-A.9.2.1',
          ruleName: 'ユーザーアクセス権の管理',
          description: '退職ユーザーのアクセス権が削除されていません',
          detectedAt: new Date(),
          affectedEntities: [
            {
              entityType: 'USER',
              entityId: user.id,
              entityName: user.name
            }
          ]
        },
        impact: {
          usersAffected: 1,
          businessImpact: '不正アクセスのリスク増大'
        },
        remediationStatus: 'NOT_STARTED',
        evidence: {
          logEntries: user.permissions.map(p => p.id),
          screenshots: [],
          documentRefs: []
        }
      });
    }

    return violations;
  }
}

export const violationDetectionEngine = new ViolationDetectionEngine();
```

### 4. BC-007通知統合

```typescript
/**
 * コンプライアンス違反通知を送信
 */
async function sendComplianceAlert(
  checkId: string,
  violations: any,
  initiatedBy: string
): Promise<void> {

  // 重大度別の通知メッセージ生成
  const criticalCount = violations.bySeverity.critical || 0;
  const highCount = violations.bySeverity.high || 0;

  if (criticalCount > 0 || highCount > 0) {
    await bc007NotificationService.send({
      type: 'COMPLIANCE_ALERT',
      recipientId: initiatedBy,
      title: `🚨 コンプライアンス違反検出 - 緊急対応が必要です`,
      body: `
        コンプライアンスチェック（ID: ${checkId}）で重大な違反が検出されました。

        - 緊急（Critical）: ${criticalCount}件
        - 高（High）: ${highCount}件

        直ちに違反内容を確認し、修復計画を策定してください。
      `,
      priority: 'HIGH',
      metadata: {
        checkId,
        violationCount: violations.total,
        criticalCount,
        highCount
      }
    });
  }
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### 1. コンプライアンスチェックエラー（E-COMP-1xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-COMP-1001 | 400 | 無効なフレームワーク指定 | サポートされていないフレームワーク名 | GDPR/SOC2/ISO27001/HIPAA/PCI_DSSのいずれかを指定 |
| E-COMP-1002 | 400 | 無効なチェック範囲 | scope指定が不正（組織IDとプロジェクトIDが両方指定等） | 1つのスコープタイプのみ指定 |
| E-COMP-1003 | 400 | 無効な期間指定 | 終了日が開始日より前 | period.endDate >= period.startDate を確認 |
| E-COMP-1004 | 404 | スコープエンティティが存在しない | 指定された組織/プロジェクト/ユーザーが存在しない | 有効なIDを指定 |
| E-COMP-1005 | 403 | チェック実行権限がありません | executedByユーザーに監査権限がない | 'AUDITOR'または'ADMIN'ロールが必要 |
| E-COMP-1006 | 409 | 同一スコープのチェックが実行中 | 同じスコープで別のチェックが進行中 | 既存チェック完了後に再実行 |
| E-COMP-1007 | 500 | フレームワークルール取得失敗 | DBまたはルールエンジンの障害 | システム管理者に連絡、ログ確認 |
| E-COMP-1008 | 500 | レポート生成失敗 | PDF/Excel生成エンジンの障害 | レポート形式をJSONに変更して再試行 |

#### 2. ポリシー評価エラー（E-POLICY-2xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-POLICY-2001 | 404 | ポリシーが存在しません | 指定されたpolicyIdが無効 | 有効なポリシーIDを指定 |
| E-POLICY-2002 | 400 | 無効な評価対象 | target.entityTypeが不正 | USER/RESOURCE/PERMISSION/OPERATIONのいずれかを指定 |
| E-POLICY-2003 | 400 | 評価コンテキスト不足 | 必要なcontextフィールドが欠落 | ポリシー定義を確認し、必要なcontext項目を追加 |
| E-POLICY-2004 | 403 | ポリシー評価権限がありません | evaluatedByユーザーに評価権限がない | 'POLICY_ADMIN'ロールが必要 |
| E-POLICY-2005 | 409 | ポリシーが無効化されています | policy.enabled = false | ポリシーを有効化してから評価 |
| E-POLICY-2006 | 500 | ルール評価エンジン障害 | ルールエンジンの内部エラー | システム管理者に連絡、ルールログ確認 |

#### 3. 違反検出エラー（E-VIOLATION-3xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-VIOLATION-3001 | 400 | 無効な検出範囲 | scope.startDate または endDate が不正 | 有効な日時範囲を指定 |
| E-VIOLATION-3002 | 400 | 検出ルールが空です | rules配列が空 | 1つ以上の有効なルールを指定 |
| E-VIOLATION-3003 | 400 | 無効なルールID | 存在しないruleIdが指定されている | 有効なルールIDを指定 |
| E-VIOLATION-3004 | 403 | 違反検出権限がありません | 実行ユーザーに検出権限がない | 'AUDITOR'または'COMPLIANCE_OFFICER'ロールが必要 |
| E-VIOLATION-3005 | 500 | Elasticsearch接続失敗 | Elasticsearchクラスタに接続できない | Elasticsearchの稼働状況確認、接続設定確認 |
| E-VIOLATION-3006 | 500 | ログインデックスが存在しません | audit-logs-*インデックスが見つからない | 監査ログインデックスの作成確認 |
| E-VIOLATION-3007 | 503 | 検出エンジンタイムアウト | 検出処理が制限時間を超過 | スコープ範囲を縮小して再試行 |

#### 4. 修復追跡エラー（E-REMEDIATION-4xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-REMEDIATION-4001 | 404 | 違反が存在しません | 指定されたviolationIdが無効 | 有効な違反IDを指定 |
| E-REMEDIATION-4002 | 400 | 無効な修復計画 | remediationPlanの必須フィールド欠落 | plannedDate, assignedTo, priority, descriptionを指定 |
| E-REMEDIATION-4003 | 400 | 無効な修復ステータス | statusが不正な値 | PLANNED/IN_PROGRESS/COMPLETED/VERIFIED/CLOSEDのいずれかを指定 |
| E-REMEDIATION-4004 | 403 | 修復追跡権限がありません | 修復計画の作成・更新権限がない | 'COMPLIANCE_OFFICER'ロールが必要 |
| E-REMEDIATION-4005 | 409 | 修復が既に完了しています | status='CLOSED'の違反は変更不可 | 違反を再オープンしてから更新 |
| E-REMEDIATION-4006 | 400 | 検証証拠が不足しています | verification.evidenceUrlsが空 | 修復完了の証拠ファイルをアップロード |
| E-REMEDIATION-4007 | 500 | BC-007通知送信失敗 | 通知サービスとの連携エラー | BC-007サービスの稼働状況確認 |

#### 5. レポート生成エラー（E-REPORT-5xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-REPORT-5001 | 400 | サポートされていないレポート形式 | reportFormatが不正 | JSON/PDF/EXCEL/CSVのいずれかを指定 |
| E-REPORT-5002 | 500 | PDF生成失敗 | PDFライブラリの障害 | システム管理者に連絡、ログ確認 |
| E-REPORT-5003 | 500 | S3アップロード失敗 | レポートファイルのS3保存失敗 | S3バケット設定・権限確認 |
| E-REPORT-5004 | 507 | ストレージ容量不足 | S3バケットの容量上限到達 | 古いレポートを削除またはバケット拡張 |
| E-REPORT-5005 | 500 | テンプレートレンダリング失敗 | レポートテンプレートの解析エラー | テンプレートファイルの整合性確認 |

### エラーハンドリング実装例

```typescript
import { NextResponse } from 'next/server';

/**
 * コンプライアンスチェックAPIエラーハンドラー
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. リクエストバリデーション
    const validatedRequest = validateComplianceCheckRequest(body);

    // 2. 権限チェック
    const hasPermission = await checkAuditPermission(validatedRequest.executedBy);
    if (!hasPermission) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E-COMP-1005',
            message: 'チェック実行権限がありません',
            details: 'AUDITORまたはADMINロールが必要です',
            remediation: 'システム管理者にAUDITORロールの付与を依頼してください'
          }
        },
        { status: 403 }
      );
    }

    // 3. 重複実行チェック
    const runningCheck = await prisma.complianceCheck.findFirst({
      where: {
        scope: validatedRequest.scope,
        status: 'RUNNING'
      }
    });

    if (runningCheck) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E-COMP-1006',
            message: '同一スコープのチェックが実行中です',
            details: `チェックID: ${runningCheck.checkId}`,
            remediation: '既存チェックの完了を待つか、キャンセルしてから再実行してください'
          }
        },
        { status: 409 }
      );
    }

    // 4. コンプライアンスチェック実行
    const result = await complianceCheckEngine.executeComplianceCheck(validatedRequest);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    // Zodバリデーションエラー
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E-COMP-1002',
            message: '無効なリクエストパラメータ',
            details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            remediation: 'リクエストパラメータを確認してください'
          }
        },
        { status: 400 }
      );
    }

    // カスタムエラー
    if (error instanceof PolicyNotFoundError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E-POLICY-2001',
            message: 'ポリシーが存在しません',
            details: error.message,
            remediation: '有効なポリシーIDを指定してください'
          }
        },
        { status: 404 }
      );
    }

    // その他の予期しないエラー
    console.error('Compliance check error:', error);
    await auditLogger.log({
      eventType: 'COMPLIANCE_CHECK_ERROR',
      details: {
        error: error.message,
        stack: error.stack
      }
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'E-COMP-1007',
          message: 'コンプライアンスチェック実行中にエラーが発生しました',
          details: 'システム管理者に連絡してください',
          remediation: 'ログを確認し、必要に応じてシステム管理者に連絡してください'
        }
      },
      { status: 500 }
    );
  }
}
```

### エラー通知フロー（BC-007統合）

```typescript
/**
 * 重大エラー発生時のBC-007通知
 */
async function notifyCriticalComplianceError(
  error: {
    code: string;
    message: string;
    checkId?: string;
  },
  userId: string
): Promise<void> {

  await bc007NotificationService.send({
    type: 'COMPLIANCE_ERROR',
    recipientId: userId,
    title: `🚨 コンプライアンスチェックエラー - ${error.code}`,
    body: `
      コンプライアンスチェック実行中にエラーが発生しました。

      エラーコード: ${error.code}
      エラーメッセージ: ${error.message}
      ${error.checkId ? `チェックID: ${error.checkId}` : ''}

      システム管理者に連絡し、ログを確認してください。
    `,
    priority: 'HIGH',
    metadata: {
      errorCode: error.code,
      errorMessage: error.message,
      checkId: error.checkId,
      timestamp: new Date().toISOString()
    }
  });
}
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
> - [services/secure-access-service/capabilities/audit-and-assure-security/operations/compliance-monitoring/](../../../../../../services/secure-access-service/capabilities/audit-and-assure-security/operations/compliance-monitoring/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
