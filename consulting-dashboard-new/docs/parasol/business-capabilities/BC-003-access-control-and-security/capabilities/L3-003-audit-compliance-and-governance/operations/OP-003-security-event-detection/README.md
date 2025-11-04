# OP-003: セキュリティイベントを検知する

**作成日**: 2025-10-31
**所属L3**: L3-003-audit-compliance-and-governance: Audit Compliance And Governance
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/audit-and-assure-security/operations/security-event-detection

---

## 📋 How: この操作の定義

### 操作の概要
セキュリティイベントを検知するを実行し、ビジネス価値を創出する。

### 実現する機能
- セキュリティイベントを検知するに必要な情報の入力と検証
- セキュリティイベントを検知するプロセスの実行と進捗管理
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

### 1. セキュリティイベント監視設定

```typescript
interface SecurityMonitoringRequest {
  // 監視範囲
  scope: {
    organizationId?: string;          // 組織ID
    projectId?: string;               // プロジェクトID
    userId?: string;                  // ユーザーID（個人監視時）
    resourceIds?: string[];           // 特定リソース監視
  };

  // 監視ルール
  rules: SecurityRule[];

  // 検出モード
  mode: 'REALTIME' | 'BATCH' | 'SCHEDULED';

  // 監視期間（BATCH/SCHEDULED時）
  period?: {
    startTime: Date;
    endTime: Date;
  };

  // アラート設定
  alertConfig: {
    enabled: boolean;
    severity: ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')[];
    recipients: string[];             // BC-007通知先
    channels: ('EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK')[];
    throttle?: {
      maxAlerts: number;              // 最大アラート数
      windowMinutes: number;          // 時間枠（分）
    };
  };

  // 自動対応設定
  autoResponse?: {
    enabled: boolean;
    actions: AutoResponseAction[];
  };

  // 実行者
  initiatedBy: string;
}

interface SecurityRule {
  ruleId: string;
  category: SecurityCategory;
  pattern: string;                    // 検出パターン（正規表現またはシグネチャ）
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  enabled: boolean;
  threshold?: number;                 // 閾値（該当する場合）
  timeWindow?: number;                // 時間枠（秒）
}

enum SecurityCategory {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',           // 不正アクセス試行
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',         // 権限昇格
  DATA_EXFILTRATION = 'DATA_EXFILTRATION',               // データ流出
  MALWARE = 'MALWARE',                                   // マルウェア
  BRUTE_FORCE = 'BRUTE_FORCE',                           // ブルートフォース攻撃
  SQL_INJECTION = 'SQL_INJECTION',                       // SQLインジェクション
  XSS = 'XSS',                                           // クロスサイトスクリプティング
  DDOS = 'DDOS',                                         // DDoS攻撃
  ANOMALY = 'ANOMALY',                                   // 異常動作
  POLICY_VIOLATION = 'POLICY_VIOLATION'                  // ポリシー違反
}

interface AutoResponseAction {
  actionType: 'BLOCK_IP' | 'SUSPEND_USER' | 'REVOKE_TOKEN' | 'QUARANTINE' | 'NOTIFY';
  triggerCondition: {
    severity: ('CRITICAL' | 'HIGH')[];
    category: SecurityCategory[];
    repeatCount?: number;             // 繰り返し回数
  };
  parameters?: Record<string, any>;
}
```

### 2. 脅威分析リクエスト

```typescript
interface ThreatAnalysisRequest {
  // 分析対象イベント
  eventIds?: string[];                // 特定イベント分析

  // または範囲指定
  scope?: {
    startTime: Date;
    endTime: Date;
    severity?: ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')[];
    categories?: SecurityCategory[];
  };

  // 分析深度
  analysisDepth: 'BASIC' | 'DETAILED' | 'COMPREHENSIVE';

  // 外部脅威インテリジェンス統合
  useThreatIntel?: boolean;

  // 関連イベント検索範囲
  correlationWindow?: {
    before: number;                   // 前後N時間
    after: number;
  };

  // 分析者
  analyzedBy: string;
}
```

### 3. インシデント対応リクエスト

```typescript
interface IncidentResponseRequest {
  // インシデントID
  incidentId?: string;                // 既存インシデント更新時

  // 新規インシデント作成時
  triggerEvent?: {
    eventId: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    category: SecurityCategory;
  };

  // インシデント情報
  incident: {
    title: string;
    description: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
    assignedTo?: string;
    priority: number;                 // 1-5（1が最高優先度）
  };

  // 対応アクション
  actions?: IncidentAction[];

  // エスカレーション設定
  escalation?: {
    enabled: boolean;
    sla: {
      responseMinutes: number;        // 初期対応SLA
      resolutionHours: number;        // 解決SLA
    };
    escalateTo: string[];             // エスカレーション先
  };

  // 対応者
  respondedBy: string;
}

interface IncidentAction {
  actionType: 'INVESTIGATE' | 'CONTAIN' | 'REMEDIATE' | 'RECOVER' | 'DOCUMENT';
  description: string;
  timestamp: Date;
  performedBy: string;
  evidence?: string[];                // 証拠ファイルURL
  outcome?: string;
}
```

### 4. 異常検知設定

```typescript
interface AnomalyDetectionRequest {
  // 検知対象
  target: {
    entityType: 'USER' | 'RESOURCE' | 'NETWORK' | 'APPLICATION';
    entityId?: string;
  };

  // ベースライン期間（通常動作の学習期間）
  baselinePeriod: {
    startDate: Date;
    endDate: Date;
  };

  // 検知パラメータ
  parameters: {
    sensitivity: 'LOW' | 'MEDIUM' | 'HIGH'; // 検知感度

    // 異常検知手法
    methods: (
      'STATISTICAL' |                 // 統計的異常検知
      'MACHINE_LEARNING' |            // 機械学習ベース
      'RULE_BASED' |                  // ルールベース
      'BEHAVIORAL'                    // 行動分析
    )[];

    // メトリクス
    metrics: AnomalyMetric[];
  };

  // アラート設定
  alertOnAnomaly: boolean;
  alertRecipients?: string[];

  // 設定者
  configuredBy: string;
}

interface AnomalyMetric {
  metricName: string;                 // 例: 'login_frequency', 'data_transfer_volume'
  threshold: {
    method: 'STANDARD_DEVIATION' | 'PERCENTILE' | 'ABSOLUTE';
    value: number;
  };
  enabled: boolean;
}
```

### 入力パラメータのバリデーション

```typescript
import { z } from 'zod';

const SecurityMonitoringRequestSchema = z.object({
  scope: z.object({
    organizationId: z.string().uuid().optional(),
    projectId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    resourceIds: z.array(z.string().uuid()).optional()
  }),
  rules: z.array(z.object({
    ruleId: z.string(),
    category: z.nativeEnum(SecurityCategory),
    pattern: z.string().min(1),
    severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    enabled: z.boolean(),
    threshold: z.number().optional(),
    timeWindow: z.number().optional()
  })).min(1),
  mode: z.enum(['REALTIME', 'BATCH', 'SCHEDULED']),
  period: z.object({
    startTime: z.date(),
    endTime: z.date()
  }).optional(),
  alertConfig: z.object({
    enabled: z.boolean(),
    severity: z.array(z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])),
    recipients: z.array(z.string().uuid()),
    channels: z.array(z.enum(['EMAIL', 'SMS', 'PUSH', 'WEBHOOK'])),
    throttle: z.object({
      maxAlerts: z.number().positive(),
      windowMinutes: z.number().positive()
    }).optional()
  }),
  autoResponse: z.object({
    enabled: z.boolean(),
    actions: z.array(z.any())
  }).optional(),
  initiatedBy: z.string().uuid()
});

function validateSecurityMonitoringRequest(request: unknown): SecurityMonitoringRequest {
  return SecurityMonitoringRequestSchema.parse(request);
}
```

---

## 📤 出力仕様

### 1. セキュリティイベント検知結果

```typescript
interface SecurityEventDetectionResult {
  // 検知ID
  detectionId: string;
  timestamp: Date;

  // 検知されたイベント
  events: SecurityEvent[];

  // 統計サマリー
  summary: {
    totalEvents: number;
    bySeverity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    byCategory: Record<SecurityCategory, number>;
    uniqueSourceIPs: number;
    uniqueTargetUsers: number;
  };

  // リアルタイムステータス
  status: {
    monitoring: 'ACTIVE' | 'PAUSED' | 'STOPPED';
    rulesActive: number;
    rulesFailed: number;
    lastUpdate: Date;
  };

  // アラート送信結果
  alerts: {
    sent: number;
    pending: number;
    failed: number;
    throttled: number;
  };

  // 自動対応結果
  autoResponses?: {
    triggered: number;
    successful: number;
    failed: number;
    actions: AutoResponseResult[];
  };
}

interface SecurityEvent {
  eventId: string;
  detectedAt: Date;

  // イベント分類
  category: SecurityCategory;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  // イベント詳細
  details: {
    title: string;
    description: string;
    attackVector?: string;            // MITRE ATT&CK等の分類
    confidence: number;               // 0-100の信頼度スコア
  };

  // ソース情報
  source: {
    ipAddress?: string;
    userId?: string;
    userAgent?: string;
    location?: {
      country: string;
      city?: string;
      coordinates?: [number, number];
    };
  };

  // ターゲット情報
  target: {
    resourceType: string;
    resourceId: string;
    resourceName?: string;
  };

  // 影響範囲
  impact: {
    scope: 'ISOLATED' | 'LIMITED' | 'SIGNIFICANT' | 'WIDESPREAD';
    affectedUsers?: number;
    affectedResources?: number;
    dataAtRisk?: string;              // データ量や種類
    businessImpact: string;
  };

  // 推奨対応
  recommendations: {
    immediate: string[];              // 即時対応
    shortTerm: string[];              // 短期対応
    longTerm: string[];               // 長期対応
  };

  // 関連イベント
  relatedEvents?: string[];           // 関連するeventId

  // 証拠
  evidence: {
    logEntries: string[];
    networkCapture?: string;
    screenshots?: string[];
  };

  // ステータス
  status: 'NEW' | 'INVESTIGATING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'RESOLVED';
  assignedTo?: string;
}

interface AutoResponseResult {
  actionType: string;
  triggeredBy: string;                // eventId
  executedAt: Date;
  success: boolean;
  message: string;
  revertible: boolean;                // 取り消し可能か
  revertedAt?: Date;
}
```

**出力例（JSON）**:

```json
{
  "detectionId": "detect-2025-001",
  "timestamp": "2025-11-04T14:30:00Z",
  "events": [
    {
      "eventId": "event-sec-12345",
      "detectedAt": "2025-11-04T14:29:45Z",
      "category": "BRUTE_FORCE",
      "severity": "HIGH",
      "details": {
        "title": "ブルートフォース攻撃検出",
        "description": "同一IPから15分間に50回のログイン失敗を検出",
        "attackVector": "T1110.001 - Password Guessing",
        "confidence": 95
      },
      "source": {
        "ipAddress": "203.0.113.42",
        "userAgent": "Mozilla/5.0 ...",
        "location": {
          "country": "Unknown",
          "city": null
        }
      },
      "target": {
        "resourceType": "AUTH_SERVICE",
        "resourceId": "auth-endpoint-001",
        "resourceName": "/api/auth/login"
      },
      "impact": {
        "scope": "LIMITED",
        "affectedUsers": 1,
        "affectedResources": 1,
        "dataAtRisk": "ユーザー認証情報",
        "businessImpact": "不正アクセスのリスク"
      },
      "recommendations": {
        "immediate": [
          "送信元IPアドレスを即座にブロック",
          "対象ユーザーアカウントの一時停止検討"
        ],
        "shortTerm": [
          "ログイン失敗回数制限の強化",
          "CAPTCHA導入の検討"
        ],
        "longTerm": [
          "MFA（多要素認証）の必須化",
          "Geo-IP制限の導入"
        ]
      },
      "relatedEvents": [],
      "evidence": {
        "logEntries": ["log-entry-001", "log-entry-002"],
        "networkCapture": "pcap-2025-11-04-143000.pcap",
        "screenshots": []
      },
      "status": "NEW",
      "assignedTo": null
    }
  ],
  "summary": {
    "totalEvents": 1,
    "bySeverity": {
      "critical": 0,
      "high": 1,
      "medium": 0,
      "low": 0
    },
    "byCategory": {
      "BRUTE_FORCE": 1
    },
    "uniqueSourceIPs": 1,
    "uniqueTargetUsers": 1
  },
  "status": {
    "monitoring": "ACTIVE",
    "rulesActive": 25,
    "rulesFailed": 0,
    "lastUpdate": "2025-11-04T14:30:00Z"
  },
  "alerts": {
    "sent": 1,
    "pending": 0,
    "failed": 0,
    "throttled": 0
  },
  "autoResponses": {
    "triggered": 1,
    "successful": 1,
    "failed": 0,
    "actions": [
      {
        "actionType": "BLOCK_IP",
        "triggeredBy": "event-sec-12345",
        "executedAt": "2025-11-04T14:29:50Z",
        "success": true,
        "message": "IPアドレス 203.0.113.42 を24時間ブロックしました",
        "revertible": true,
        "revertedAt": null
      }
    ]
  }
}
```

### 2. 脅威分析結果

```typescript
interface ThreatAnalysisResult {
  analysisId: string;
  timestamp: Date;
  analyzedBy: string;

  // 分析対象
  scope: {
    eventCount: number;
    timeRange: {
      start: Date;
      end: Date;
    };
  };

  // 脅威評価
  threatAssessment: {
    overallRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    riskScore: number;                // 0-100
    confidence: number;               // 0-100

    // 検出された脅威
    threats: DetectedThreat[];

    // 攻撃チェーン分析
    attackChain?: {
      stages: AttackStage[];
      progress: number;               // 攻撃進行度 0-100
    };
  };

  // 相関分析
  correlation: {
    relatedEvents: CorrelatedEvent[];
    patterns: DetectedPattern[];
  };

  // 外部脅威インテリジェンス
  threatIntel?: {
    indicators: ThreatIndicator[];
    campaigns: KnownCampaign[];
  };

  // 推奨対応
  recommendations: {
    priority: 'IMMEDIATE' | 'URGENT' | 'NORMAL';
    actions: RecommendedAction[];
  };
}

interface DetectedThreat {
  threatId: string;
  name: string;
  type: 'APT' | 'RANSOMWARE' | 'PHISHING' | 'INSIDER' | 'SUPPLY_CHAIN' | 'ZERO_DAY';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;

  // MITRE ATT&CK マッピング
  mitreTactics: string[];             // 例: ['Initial Access', 'Execution']
  mitreTechniques: string[];          // 例: ['T1078', 'T1059']

  // 影響範囲
  affectedSystems: string[];
  estimatedDamage: string;

  // IOC (Indicators of Compromise)
  iocs: {
    ipAddresses: string[];
    domains: string[];
    fileHashes: string[];
    urls: string[];
  };
}

interface AttackStage {
  stage: 'RECONNAISSANCE' | 'INITIAL_ACCESS' | 'EXECUTION' | 'PERSISTENCE' | 'PRIVILEGE_ESCALATION' | 'DEFENSE_EVASION' | 'CREDENTIAL_ACCESS' | 'DISCOVERY' | 'LATERAL_MOVEMENT' | 'COLLECTION' | 'EXFILTRATION' | 'IMPACT';
  completed: boolean;
  evidence: string[];
  timestamp?: Date;
}

interface CorrelatedEvent {
  eventId: string;
  correlation: 'SAME_SOURCE' | 'SAME_TARGET' | 'TEMPORAL' | 'BEHAVIORAL';
  strength: number;                   // 相関強度 0-100
}

interface DetectedPattern {
  patternType: string;
  occurrences: number;
  timeRange: {
    start: Date;
    end: Date;
  };
  description: string;
}

interface ThreatIndicator {
  indicatorType: 'IP' | 'DOMAIN' | 'HASH' | 'URL' | 'EMAIL';
  value: string;
  threatLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;                     // 脅威インテリジェンスソース
  lastSeen: Date;
}

interface RecommendedAction {
  priority: number;
  action: string;
  rationale: string;
  estimatedEffort: string;
  impact: string;
}
```

### 3. インシデント対応結果

```typescript
interface IncidentResponseResult {
  incidentId: string;
  createdAt: Date;
  updatedAt: Date;

  // インシデント情報
  incident: {
    title: string;
    description: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
    priority: number;
    assignedTo?: string;
  };

  // タイムライン
  timeline: {
    detected: Date;
    reported: Date;
    responseStarted?: Date;
    contained?: Date;
    resolved?: Date;
    closed?: Date;
  };

  // SLA追跡
  sla: {
    responseTime: {
      target: number;                 // 目標時間（分）
      actual?: number;                // 実際の時間（分）
      met: boolean;
    };
    resolutionTime: {
      target: number;                 // 目標時間（時間）
      actual?: number;                // 実際の時間（時間）
      met: boolean;
    };
  };

  // 対応アクション履歴
  actions: IncidentAction[];

  // 影響評価
  impact: {
    usersAffected: number;
    systemsAffected: number;
    dataCompromised: boolean;
    downtime?: number;                // ダウンタイム（分）
    estimatedCost?: number;
  };

  // 根本原因分析
  rootCause?: {
    identified: boolean;
    description?: string;
    category?: string;
    preventable: boolean;
  };

  // 事後対応
  postIncident?: {
    lessonsLearned: string[];
    improvementActions: string[];
    documentationUpdated: boolean;
    trainingRequired: boolean;
  };

  // BC-007通知履歴
  notifications: {
    sentAt: Date;
    recipientId: string;
    type: string;
    status: 'SENT' | 'DELIVERED' | 'READ';
  }[];
}
```

### 4. 異常検知結果

```typescript
interface AnomalyDetectionResult {
  detectionId: string;
  timestamp: Date;

  // 検知された異常
  anomalies: Anomaly[];

  // ベースライン統計
  baseline: {
    period: {
      start: Date;
      end: Date;
    };
    statistics: Record<string, {
      mean: number;
      stdDev: number;
      min: number;
      max: number;
      percentile95: number;
      percentile99: number;
    }>;
  };

  // 異常スコア
  anomalyScore: {
    overall: number;                  // 0-100
    byMetric: Record<string, number>;
  };

  // トレンド
  trend: {
    direction: 'IMPROVING' | 'STABLE' | 'WORSENING';
    changeRate: number;               // 変化率
  };
}

interface Anomaly {
  anomalyId: string;
  detectedAt: Date;

  // 異常詳細
  metric: string;
  actualValue: number;
  expectedValue: number;
  deviation: number;                  // 標準偏差単位

  // 分類
  type: 'STATISTICAL' | 'BEHAVIORAL' | 'TEMPORAL' | 'VOLUMETRIC';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';

  // コンテキスト
  context: {
    entityType: string;
    entityId: string;
    relatedEvents?: string[];
  };

  // 推奨対応
  recommendation: string;
  autoInvestigate: boolean;
}
```

---

## 🛠️ 実装ガイダンス

### 1. リアルタイムセキュリティ監視エンジン実装

```typescript
import { EventEmitter } from 'events';
import { WebSocket } from 'ws';
import { auditLogger } from '@/lib/audit/winston-elasticsearch';

class SecurityMonitoringEngine extends EventEmitter {
  private wsServer: WebSocket.Server;
  private activeRules: Map<string, SecurityRule> = new Map();
  private eventBuffer: SecurityEvent[] = [];

  /**
   * リアルタイム監視を開始
   */
  async startMonitoring(
    request: SecurityMonitoringRequest
  ): Promise<SecurityEventDetectionResult> {
    const detectionId = generateUUID();

    // 1. ルールのロードと検証
    for (const rule of request.rules) {
      if (rule.enabled) {
        await this.loadRule(rule);
        this.activeRules.set(rule.ruleId, rule);
      }
    }

    // 2. Elasticsearchストリーム接続
    const esStream = await this.connectToElasticsearchStream(request.scope);

    // 3. イベントストリーム処理
    esStream.on('data', async (logEntry) => {
      const events = await this.analyzeLogEntry(logEntry);

      for (const event of events) {
        // イベント保存
        this.eventBuffer.push(event);

        // アラート判定
        if (this.shouldAlert(event, request.alertConfig)) {
          await this.sendAlert(event, request.alertConfig);
        }

        // 自動対応トリガー
        if (request.autoResponse?.enabled) {
          await this.triggerAutoResponse(event, request.autoResponse);
        }

        // WebSocket配信（リアルタイム通知）
        this.emit('security-event', event);
      }
    });

    // 4. BC-007統合（重大イベント通知）
    this.on('security-event', async (event: SecurityEvent) => {
      if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
        await this.notifySecurityTeam(event, request.alertConfig.recipients);
      }
    });

    // 5. 監査ログ記録
    await auditLogger.log({
      eventType: 'SECURITY_MONITORING_STARTED',
      userId: request.initiatedBy,
      details: {
        detectionId,
        rulesCount: this.activeRules.size,
        scope: request.scope
      }
    });

    return {
      detectionId,
      timestamp: new Date(),
      events: this.eventBuffer,
      summary: this.calculateSummary(this.eventBuffer),
      status: {
        monitoring: 'ACTIVE',
        rulesActive: this.activeRules.size,
        rulesFailed: 0,
        lastUpdate: new Date()
      },
      alerts: {
        sent: 0,
        pending: 0,
        failed: 0,
        throttled: 0
      }
    };
  }

  /**
   * ログエントリー分析
   */
  private async analyzeLogEntry(logEntry: any): Promise<SecurityEvent[]> {
    const events: SecurityEvent[] = [];

    for (const [ruleId, rule] of this.activeRules) {
      // パターンマッチング
      if (this.matchesPattern(logEntry, rule.pattern)) {

        // ブルートフォース攻撃検出例
        if (rule.category === SecurityCategory.BRUTE_FORCE) {
          const event = await this.detectBruteForce(logEntry, rule);
          if (event) events.push(event);
        }

        // SQLインジェクション検出例
        if (rule.category === SecurityCategory.SQL_INJECTION) {
          const event = await this.detectSQLInjection(logEntry, rule);
          if (event) events.push(event);
        }

        // データ流出検出例
        if (rule.category === SecurityCategory.DATA_EXFILTRATION) {
          const event = await this.detectDataExfiltration(logEntry, rule);
          if (event) events.push(event);
        }
      }
    }

    return events;
  }

  /**
   * ブルートフォース攻撃検出
   */
  private async detectBruteForce(
    logEntry: any,
    rule: SecurityRule
  ): Promise<SecurityEvent | null> {

    // 過去N分間の同一IPからのログイン失敗を集計
    const timeWindow = rule.timeWindow || 900; // デフォルト15分
    const threshold = rule.threshold || 10;

    const recentFailures = await this.esClient.count({
      index: 'audit-logs-*',
      body: {
        query: {
          bool: {
            must: [
              { term: { 'source.ipAddress': logEntry.source.ipAddress } },
              { term: { eventType: 'LOGIN_FAILED' } },
              {
                range: {
                  '@timestamp': {
                    gte: `now-${timeWindow}s`
                  }
                }
              }
            ]
          }
        }
      }
    });

    if (recentFailures.count >= threshold) {
      // ブルートフォース攻撃を検出
      return {
        eventId: generateUUID(),
        detectedAt: new Date(),
        category: SecurityCategory.BRUTE_FORCE,
        severity: rule.severity,
        details: {
          title: 'ブルートフォース攻撃検出',
          description: `同一IPから${timeWindow / 60}分間に${recentFailures.count}回のログイン失敗を検出`,
          attackVector: 'T1110.001 - Password Guessing',
          confidence: 95
        },
        source: {
          ipAddress: logEntry.source.ipAddress,
          userId: logEntry.userId,
          userAgent: logEntry.userAgent
        },
        target: {
          resourceType: 'AUTH_SERVICE',
          resourceId: 'auth-endpoint-001',
          resourceName: '/api/auth/login'
        },
        impact: {
          scope: 'LIMITED',
          affectedUsers: 1,
          businessImpact: '不正アクセスのリスク'
        },
        recommendations: {
          immediate: [
            '送信元IPアドレスを即座にブロック',
            '対象ユーザーアカウントの一時停止検討'
          ],
          shortTerm: [
            'ログイン失敗回数制限の強化',
            'CAPTCHA導入の検討'
          ],
          longTerm: [
            'MFA（多要素認証）の必須化',
            'Geo-IP制限の導入'
          ]
        },
        evidence: {
          logEntries: [logEntry.id],
          networkCapture: null,
          screenshots: []
        },
        status: 'NEW'
      };
    }

    return null;
  }

  /**
   * SQLインジェクション検出
   */
  private async detectSQLInjection(
    logEntry: any,
    rule: SecurityRule
  ): Promise<SecurityEvent | null> {

    // SQLインジェクションパターン検出
    const sqlInjectionPatterns = [
      /(\bOR\b|\bAND\b)\s+[\w\'"]+\s*=\s*[\w\'"]+/i,
      /UNION\s+SELECT/i,
      /DROP\s+TABLE/i,
      /--\s*$/,
      /;\s*DROP/i,
      /'.*OR.*'.*=.*'/i
    ];

    const requestData = logEntry.request?.body || logEntry.request?.query || '';
    const isSQLInjection = sqlInjectionPatterns.some(pattern =>
      pattern.test(requestData)
    );

    if (isSQLInjection) {
      return {
        eventId: generateUUID(),
        detectedAt: new Date(),
        category: SecurityCategory.SQL_INJECTION,
        severity: 'CRITICAL',
        details: {
          title: 'SQLインジェクション試行検出',
          description: 'リクエストにSQLインジェクションパターンを検出しました',
          attackVector: 'T1190 - Exploit Public-Facing Application',
          confidence: 90
        },
        source: {
          ipAddress: logEntry.source.ipAddress,
          userId: logEntry.userId
        },
        target: {
          resourceType: 'API_ENDPOINT',
          resourceId: logEntry.request.endpoint,
          resourceName: logEntry.request.path
        },
        impact: {
          scope: 'SIGNIFICANT',
          businessImpact: 'データベース不正アクセスのリスク'
        },
        recommendations: {
          immediate: [
            'パラメータ化クエリ（prepared statements）の使用',
            'WAF（Web Application Firewall）の有効化',
            '送信元IPのブロック'
          ],
          shortTerm: [
            '入力バリデーションの強化',
            'ORM使用の徹底'
          ],
          longTerm: [
            'セキュリティコードレビューの実施',
            'SAST（Static Application Security Testing）の導入'
          ]
        },
        evidence: {
          logEntries: [logEntry.id],
          networkCapture: logEntry.request.raw
        },
        status: 'NEW'
      };
    }

    return null;
  }

  /**
   * 自動対応トリガー
   */
  private async triggerAutoResponse(
    event: SecurityEvent,
    config: { enabled: boolean; actions: AutoResponseAction[] }
  ): Promise<AutoResponseResult[]> {
    const results: AutoResponseResult[] = [];

    for (const action of config.actions) {
      // トリガー条件チェック
      if (!this.matchesTriggerCondition(event, action.triggerCondition)) {
        continue;
      }

      let result: AutoResponseResult;

      switch (action.actionType) {
        case 'BLOCK_IP':
          result = await this.blockIP(event.source.ipAddress!);
          break;

        case 'SUSPEND_USER':
          result = await this.suspendUser(event.source.userId!);
          break;

        case 'REVOKE_TOKEN':
          result = await this.revokeTokens(event.source.userId!);
          break;

        case 'QUARANTINE':
          result = await this.quarantineResource(event.target.resourceId);
          break;

        case 'NOTIFY':
          result = await this.notifySecurityTeam(event, action.parameters?.recipients);
          break;

        default:
          continue;
      }

      results.push(result);

      // 自動対応の監査ログ記録
      await auditLogger.log({
        eventType: 'AUTO_RESPONSE_TRIGGERED',
        details: {
          eventId: event.eventId,
          actionType: action.actionType,
          success: result.success
        }
      });
    }

    return results;
  }

  /**
   * IPアドレスブロック
   */
  private async blockIP(ipAddress: string): Promise<AutoResponseResult> {
    try {
      // ファイアウォールルール追加
      await prisma.blockedIP.create({
        data: {
          ipAddress,
          reason: 'Auto-blocked due to security event',
          blockedAt: new Date(),
          expiresAt: addHours(new Date(), 24), // 24時間ブロック
          blockedBy: 'SYSTEM_AUTO_RESPONSE'
        }
      });

      return {
        actionType: 'BLOCK_IP',
        triggeredBy: ipAddress,
        executedAt: new Date(),
        success: true,
        message: `IPアドレス ${ipAddress} を24時間ブロックしました`,
        revertible: true
      };
    } catch (error) {
      return {
        actionType: 'BLOCK_IP',
        triggeredBy: ipAddress,
        executedAt: new Date(),
        success: false,
        message: `IPブロック失敗: ${error.message}`,
        revertible: false
      };
    }
  }

  /**
   * ユーザーアカウント停止
   */
  private async suspendUser(userId: string): Promise<AutoResponseResult> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          status: 'SUSPENDED',
          suspendedAt: new Date(),
          suspendReason: 'Auto-suspended due to security event'
        }
      });

      // BC-007通知
      await bc007NotificationService.send({
        type: 'ACCOUNT_SUSPENDED',
        recipientId: userId,
        title: 'アカウントが一時停止されました',
        body: 'セキュリティイベント検出により、アカウントが一時停止されました。',
        priority: 'HIGH'
      });

      return {
        actionType: 'SUSPEND_USER',
        triggeredBy: userId,
        executedAt: new Date(),
        success: true,
        message: `ユーザーアカウント ${userId} を停止しました`,
        revertible: true
      };
    } catch (error) {
      return {
        actionType: 'SUSPEND_USER',
        triggeredBy: userId,
        executedAt: new Date(),
        success: false,
        message: `アカウント停止失敗: ${error.message}`,
        revertible: false
      };
    }
  }
}

export const securityMonitoringEngine = new SecurityMonitoringEngine();
```

### 2. 脅威分析エンジン実装

```typescript
class ThreatAnalysisEngine {

  /**
   * 包括的脅威分析を実行
   */
  async analyzeThreat(
    request: ThreatAnalysisRequest
  ): Promise<ThreatAnalysisResult> {
    const analysisId = generateUUID();

    // 1. イベント収集
    const events = await this.collectEvents(request);

    // 2. 脅威評価
    const threatAssessment = await this.assessThreats(events);

    // 3. 相関分析
    const correlation = await this.performCorrelationAnalysis(events);

    // 4. 外部脅威インテリジェンス統合（オプション）
    let threatIntel;
    if (request.useThreatIntel) {
      threatIntel = await this.enrichWithThreatIntel(events);
    }

    // 5. 推奨対応生成
    const recommendations = await this.generateRecommendations(
      threatAssessment,
      correlation
    );

    // 6. 監査ログ記録
    await auditLogger.log({
      eventType: 'THREAT_ANALYSIS_COMPLETED',
      userId: request.analyzedBy,
      details: {
        analysisId,
        eventCount: events.length,
        overallRisk: threatAssessment.overallRisk
      }
    });

    return {
      analysisId,
      timestamp: new Date(),
      analyzedBy: request.analyzedBy,
      scope: {
        eventCount: events.length,
        timeRange: request.scope!
      },
      threatAssessment,
      correlation,
      threatIntel,
      recommendations
    };
  }

  /**
   * MITRE ATT&CK フレームワーク統合
   */
  private async mapToMITREATTACK(event: SecurityEvent): Promise<{
    tactics: string[];
    techniques: string[];
  }> {
    const mapping: Record<SecurityCategory, { tactics: string[]; techniques: string[] }> = {
      [SecurityCategory.BRUTE_FORCE]: {
        tactics: ['Credential Access'],
        techniques: ['T1110']
      },
      [SecurityCategory.SQL_INJECTION]: {
        tactics: ['Initial Access'],
        techniques: ['T1190']
      },
      [SecurityCategory.DATA_EXFILTRATION]: {
        tactics: ['Exfiltration'],
        techniques: ['T1041', 'T1048']
      },
      [SecurityCategory.PRIVILEGE_ESCALATION]: {
        tactics: ['Privilege Escalation'],
        techniques: ['T1068', 'T1078']
      },
      // その他のマッピング...
    };

    return mapping[event.category] || { tactics: [], techniques: [] };
  }

  /**
   * 外部脅威インテリジェンス統合
   */
  private async enrichWithThreatIntel(
    events: SecurityEvent[]
  ): Promise<{ indicators: ThreatIndicator[]; campaigns: KnownCampaign[] }> {

    const indicators: ThreatIndicator[] = [];

    // IPアドレスの脅威インテリジェンスチェック
    for (const event of events) {
      if (event.source.ipAddress) {
        const intel = await this.queryThreatIntelAPI(
          'IP',
          event.source.ipAddress
        );

        if (intel) {
          indicators.push({
            indicatorType: 'IP',
            value: event.source.ipAddress,
            threatLevel: intel.threatLevel,
            source: intel.source,
            lastSeen: intel.lastSeen
          });
        }
      }
    }

    return {
      indicators,
      campaigns: []
    };
  }
}

export const threatAnalysisEngine = new ThreatAnalysisEngine();
```

### 3. BC-007通知統合

```typescript
/**
 * セキュリティイベント通知を送信
 */
async function notifySecurityTeam(
  event: SecurityEvent,
  recipients: string[]
): Promise<void> {

  const severityEmoji = {
    CRITICAL: '🔴',
    HIGH: '🟠',
    MEDIUM: '🟡',
    LOW: '🟢'
  };

  await bc007NotificationService.send({
    type: 'SECURITY_EVENT',
    recipientId: recipients[0], // または一括送信
    title: `${severityEmoji[event.severity]} セキュリティイベント検出 - ${event.details.title}`,
    body: `
      ${event.details.description}

      **カテゴリ**: ${event.category}
      **深刻度**: ${event.severity}
      **信頼度**: ${event.details.confidence}%

      **送信元**: ${event.source.ipAddress || 'N/A'}
      **対象**: ${event.target.resourceName || event.target.resourceId}

      **推奨対応**:
      ${event.recommendations.immediate.map(r => `- ${r}`).join('\n')}

      イベントID: ${event.eventId}
    `,
    priority: event.severity === 'CRITICAL' || event.severity === 'HIGH' ? 'HIGH' : 'NORMAL',
    metadata: {
      eventId: event.eventId,
      category: event.category,
      severity: event.severity
    }
  });
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### 1. セキュリティ監視エラー（E-SEC-1xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-SEC-1001 | 400 | 無効な監視ルール | ルール定義が不正 | ルールパターン、カテゴリ、深刻度を確認 |
| E-SEC-1002 | 400 | 監視スコープが空 | scope指定が欠落 | organizationId、projectId、userIdのいずれかを指定 |
| E-SEC-1003 | 403 | セキュリティ監視権限がありません | 監視実行権限がない | 'SECURITY_ADMIN'または'SOC_ANALYST'ロールが必要 |
| E-SEC-1004 | 500 | Elasticsearchストリーム接続失敗 | Elasticsearchとの接続エラー | Elasticsearchの稼働状況確認 |
| E-SEC-1005 | 500 | ルールエンジン障害 | セキュリティルールエンジンのエラー | システム管理者に連絡、ログ確認 |
| E-SEC-1006 | 409 | 同一スコープの監視が既に実行中 | 重複監視実行 | 既存監視を停止してから再実行 |

#### 2. 脅威分析エラー（E-THREAT-2xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-THREAT-2001 | 400 | 無効な分析範囲 | scope指定が不正 | 有効な時間範囲とイベントIDを指定 |
| E-THREAT-2002 | 404 | イベントが存在しません | 指定されたeventIdが無効 | 有効なイベントIDを指定 |
| E-THREAT-2003 | 403 | 脅威分析権限がありません | 分析実行権限がない | 'THREAT_ANALYST'ロールが必要 |
| E-THREAT-2004 | 500 | 外部脅威インテリジェンスAPI接続失敗 | 外部APIとの通信エラー | APIキー確認、ネットワーク接続確認 |
| E-THREAT-2005 | 503 | 分析エンジンタイムアウト | 分析処理が制限時間を超過 | 分析範囲を縮小して再試行 |

#### 3. インシデント対応エラー（E-INCIDENT-3xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-INCIDENT-3001 | 404 | インシデントが存在しません | 指定されたincidentIdが無効 | 有効なインシデントIDを指定 |
| E-INCIDENT-3002 | 400 | 無効なインシデント情報 | 必須フィールドが欠落 | title, description, severity, statusを指定 |
| E-INCIDENT-3003 | 403 | インシデント対応権限がありません | 対応実行権限がない | 'INCIDENT_RESPONDER'ロールが必要 |
| E-INCIDENT-3004 | 409 | インシデントが既にクローズされています | クローズ済みインシデントは変更不可 | インシデントを再オープンしてから更新 |
| E-INCIDENT-3005 | 500 | SLAタイマー設定失敗 | SLA追跡システムのエラー | システム管理者に連絡 |
| E-INCIDENT-3006 | 500 | エスカレーション通知失敗 | BC-007通知サービスのエラー | BC-007サービスの稼働状況確認 |

#### 4. 異常検知エラー（E-ANOMALY-4xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-ANOMALY-4001 | 400 | 無効なベースライン期間 | ベースライン期間が不正 | 有効な開始日と終了日を指定 |
| E-ANOMALY-4002 | 400 | 検知メトリクスが空 | metrics配列が空 | 1つ以上の有効なメトリクスを指定 |
| E-ANOMALY-4003 | 403 | 異常検知設定権限がありません | 設定変更権限がない | 'SECURITY_ADMIN'ロールが必要 |
| E-ANOMALY-4004 | 500 | 機械学習モデルロード失敗 | MLモデルファイルが見つからないまたは破損 | モデルファイルの整合性確認、再トレーニング |
| E-ANOMALY-4005 | 503 | 異常検知エンジンタイムアウト | 検知処理が制限時間を超過 | データ量を削減して再試行 |

#### 5. 自動対応エラー（E-AUTORESPONSE-5xxx）

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 修復方法 |
|-------------|---------------|-----------------|------|---------|
| E-AUTORESPONSE-5001 | 400 | 無効な自動対応アクション | actionTypeが不正 | BLOCK_IP/SUSPEND_USER/REVOKE_TOKEN/QUARANTINE/NOTIFYのいずれかを指定 |
| E-AUTORESPONSE-5002 | 403 | 自動対応設定権限がありません | 自動対応設定変更権限がない | 'SECURITY_ADMIN'ロールが必要 |
| E-AUTORESPONSE-5003 | 500 | IPブロック失敗 | ファイアウォール設定エラー | ファイアウォール設定確認 |
| E-AUTORESPONSE-5004 | 500 | ユーザー停止失敗 | ユーザー管理システムのエラー | ユーザーデータベース接続確認 |
| E-AUTORESPONSE-5005 | 500 | トークン失効失敗 | 認証システムのエラー | 認証サービスの稼働状況確認 |
| E-AUTORESPONSE-5006 | 409 | 対応取り消し不可 | revertible=falseのアクション | 手動での対応が必要 |

### エラーハンドリング実装例

```typescript
/**
 * セキュリティ監視APIエラーハンドラー
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. リクエストバリデーション
    const validatedRequest = validateSecurityMonitoringRequest(body);

    // 2. 権限チェック
    const hasPermission = await checkSecurityPermission(
      validatedRequest.initiatedBy,
      'SECURITY_MONITORING'
    );

    if (!hasPermission) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E-SEC-1003',
            message: 'セキュリティ監視権限がありません',
            details: 'SECURITY_ADMINまたはSOC_ANALYSTロールが必要です',
            remediation: 'システム管理者に権限付与を依頼してください'
          }
        },
        { status: 403 }
      );
    }

    // 3. 重複監視チェック
    const existingMonitoring = await prisma.securityMonitoring.findFirst({
      where: {
        scope: validatedRequest.scope,
        status: 'ACTIVE'
      }
    });

    if (existingMonitoring) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E-SEC-1006',
            message: '同一スコープの監視が既に実行中です',
            details: `監視ID: ${existingMonitoring.detectionId}`,
            remediation: '既存監視を停止してから再実行してください'
          }
        },
        { status: 409 }
      );
    }

    // 4. セキュリティ監視開始
    const result = await securityMonitoringEngine.startMonitoring(validatedRequest);

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
            code: 'E-SEC-1001',
            message: '無効な監視ルール',
            details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            remediation: 'ルール定義を確認してください'
          }
        },
        { status: 400 }
      );
    }

    // Elasticsearchエラー
    if (error.name === 'ConnectionError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E-SEC-1004',
            message: 'Elasticsearchストリーム接続失敗',
            details: 'Elasticsearchクラスタに接続できません',
            remediation: 'Elasticsearchの稼働状況を確認してください'
          }
        },
        { status: 500 }
      );
    }

    // その他の予期しないエラー
    console.error('Security monitoring error:', error);
    await auditLogger.log({
      eventType: 'SECURITY_MONITORING_ERROR',
      details: {
        error: error.message,
        stack: error.stack
      }
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'E-SEC-1005',
          message: 'セキュリティ監視開始中にエラーが発生しました',
          details: 'システム管理者に連絡してください',
          remediation: 'ログを確認し、必要に応じてシステム管理者に連絡してください'
        }
      },
      { status: 500 }
    );
  }
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
> - [services/secure-access-service/capabilities/audit-and-assure-security/operations/security-event-detection/](../../../../../../services/secure-access-service/capabilities/audit-and-assure-security/operations/security-event-detection/)
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
