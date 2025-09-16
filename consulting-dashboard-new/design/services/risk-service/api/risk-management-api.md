# リスク管理API

**更新日: 2025-01-13**

## 概要

プロジェクトのリスク識別、評価、対応計画、監視、イシュー管理などのリスク管理機能を提供するAPI。

## エンドポイント一覧

### リスク管理
- `createRisk` - リスク登録
- `updateRisk` - リスク更新
- `deleteRisk` - リスク削除
- `getRisks` - リスク一覧取得
- `getRiskDetails` - リスク詳細取得
- `evaluateRisk` - リスク評価

### リスク対応
- `createMitigationPlan` - 対応計画作成
- `updateMitigationPlan` - 対応計画更新
- `assignRiskOwner` - リスクオーナー割当
- `updateRiskStatus` - リスク状況更新

### イシュー管理
- `createIssue` - イシュー登録
- `updateIssue` - イシュー更新
- `escalateIssue` - イシューエスカレーション
- `resolveIssue` - イシュー解決
- `getIssues` - イシュー一覧取得

### リスク監視・分析
- `getRiskMatrix` - リスクマトリクス取得
- `getRiskTrends` - リスクトレンド分析
- `getRiskDashboard` - リスクダッシュボード
- `getRiskReport` - リスクレポート生成

### 教訓管理
- `createLesson` - 教訓登録
- `getLessons` - 教訓一覧取得
- `searchLessons` - 教訓検索

## API詳細

### createRisk

新規リスクを登録する。

```typescript
async function createRisk(data: CreateRiskInput): Promise<RiskResponse>
```

#### リクエスト
```typescript
interface CreateRiskInput {
  projectId: string
  category: 'technical' | 'schedule' | 'budget' | 'quality' | 'external'
  title: string
  description: string
  probability: number  // 1-5
  impact: number      // 1-5
  detectability: number  // 1-5
  expectedImpact?: {
    schedule?: number  // 遅延日数
    budget?: number    // 金額影響
    quality?: string   // 品質への影響
  }
  triggers?: string[]  // トリガー条件
  relatedRisks?: string[]  // 関連リスクID
}
```

#### レスポンス
```typescript
interface RiskResponse {
  success: boolean
  data?: {
    id: string
    projectId: string
    riskNumber: string  // 自動採番
    category: string
    title: string
    description: string
    probability: number
    impact: number
    detectability: number
    rpn: number  // Risk Priority Number
    level: 'critical' | 'high' | 'medium' | 'low'
    status: 'identified' | 'analyzing' | 'planning' | 'monitoring' | 'closed' | 'materialized'
    owner?: {
      id: string
      name: string
      role: string
    }
    createdAt: Date
    updatedAt: Date
  }
  error?: string
}
```

#### 処理フロー
1. 入力値バリデーション
2. RPN（リスク優先度）計算: probability × impact × detectability
3. リスクレベル判定
4. リスク番号採番
5. リスク登録
6. 関係者への通知

---

### evaluateRisk

リスクの詳細評価を実施する。

```typescript
async function evaluateRisk(
  riskId: string,
  data: EvaluateRiskInput
): Promise<RiskEvaluationResponse>
```

#### リクエスト
```typescript
interface EvaluateRiskInput {
  probability: number
  impact: number
  detectability: number
  financialImpact?: number
  scheduleImpact?: number  // 日数
  qualityImpact?: {
    area: string
    severity: 'critical' | 'major' | 'minor'
  }
  currentControls?: string[]  // 現在の統制
  rootCauses?: string[]      // 根本原因
  affectedStakeholders?: string[]
}
```

#### レスポンス
```typescript
interface RiskEvaluationResponse {
  success: boolean
  data?: {
    riskId: string
    previousLevel: string
    newLevel: string
    rpn: number
    changeReason?: string
    riskMatrix: {
      position: { x: number, y: number }  // probability × impact
      quadrant: 'critical' | 'high' | 'medium' | 'low'
    }
    recommendedActions: string[]
    evaluatedBy: {
      id: string
      name: string
    }
    evaluatedAt: Date
  }
  error?: string
}
```

---

### createMitigationPlan

リスク対応計画を作成する。

```typescript
async function createMitigationPlan(
  data: CreateMitigationPlanInput
): Promise<MitigationPlanResponse>
```

#### リクエスト
```typescript
interface CreateMitigationPlanInput {
  riskId: string
  strategy: 'avoid' | 'transfer' | 'mitigate' | 'accept'
  actions: {
    description: string
    responsiblePerson: string
    dueDate: Date
    estimatedCost?: number
    expectedReduction?: {
      probability?: number
      impact?: number
    }
  }[]
  preventiveMeasures?: string[]  // 予防策
  contingencyPlan?: {            // 発生時対策
    trigger: string
    actions: string[]
    budget?: number
  }
  residualRisk?: {
    probability: number
    impact: number
    acceptanceReason?: string
  }
}
```

#### レスポンス
```typescript
interface MitigationPlanResponse {
  success: boolean
  data?: {
    id: string
    riskId: string
    strategy: string
    actions: MitigationAction[]
    status: 'draft' | 'approved' | 'in_progress' | 'completed'
    totalCost: number
    expectedCompletion: Date
    approvedBy?: {
      id: string
      name: string
      approvedAt: Date
    }
    effectiveness?: {
      plannedReduction: number
      actualReduction?: number
    }
  }
  error?: string
}
```

---

### updateRiskStatus

リスクの状況を更新する（定期監視）。

```typescript
async function updateRiskStatus(
  riskId: string,
  data: UpdateRiskStatusInput
): Promise<RiskStatusResponse>
```

#### リクエスト
```typescript
interface UpdateRiskStatusInput {
  currentStatus: 'stable' | 'increasing' | 'decreasing' | 'materialized'
  observations: string
  triggerProximity?: 'far' | 'near' | 'imminent' | 'triggered'
  mitigationProgress?: {
    completedActions: string[]
    effectiveness: 'effective' | 'partially_effective' | 'ineffective'
  }
  newIndicators?: string[]
  recommendedActions?: string[]
}
```

#### レスポンス
```typescript
interface RiskStatusResponse {
  success: boolean
  data?: {
    riskId: string
    status: string
    trend: 'improving' | 'stable' | 'worsening'
    lastUpdated: Date
    history: {
      date: Date
      status: string
      updatedBy: string
      notes: string
    }[]
    alerts?: {
      type: 'escalation_required' | 'trigger_approaching' | 'mitigation_overdue'
      message: string
    }[]
  }
  error?: string
}
```

---

### createIssue

リスクが顕在化した場合、またはリスク以外の問題が発生した場合にイシューを登録する。

```typescript
async function createIssue(data: CreateIssueInput): Promise<IssueResponse>
```

#### リクエスト
```typescript
interface CreateIssueInput {
  projectId: string
  fromRiskId?: string  // リスクからの変換の場合
  category: 'technical' | 'resource' | 'schedule' | 'quality' | 'stakeholder' | 'other'
  title: string
  description: string
  impact: {
    severity: 'critical' | 'high' | 'medium' | 'low'
    affectedAreas: string[]
    businessImpact: string
  }
  rootCause?: string
  immediateActions?: string[]
  owner?: string
}
```

#### レスポンス
```typescript
interface IssueResponse {
  success: boolean
  data?: {
    id: string
    issueNumber: string
    projectId: string
    category: string
    title: string
    status: 'open' | 'investigating' | 'in_progress' | 'resolved' | 'closed'
    priority: 'critical' | 'high' | 'medium' | 'low'
    owner: {
      id: string
      name: string
    }
    createdAt: Date
    targetResolution?: Date
    escalated: boolean
    relatedRisk?: {
      id: string
      title: string
    }
  }
  error?: string
}
```

---

### getRiskMatrix

プロジェクトのリスクマトリクスを取得する。

```typescript
async function getRiskMatrix(
  projectId: string,
  options?: RiskMatrixOptions
): Promise<RiskMatrixResponse>
```

#### リクエスト
```typescript
interface RiskMatrixOptions {
  includeClosedRisks?: boolean
  category?: string
  timeframe?: {
    start: Date
    end: Date
  }
}
```

#### レスポンス
```typescript
interface RiskMatrixResponse {
  success: boolean
  data?: {
    matrix: {
      cells: Array<{
        probability: number  // 1-5
        impact: number      // 1-5
        risks: Array<{
          id: string
          title: string
          category: string
          owner?: string
          trend: 'new' | 'increasing' | 'stable' | 'decreasing'
        }>
        count: number
      }>
    }
    summary: {
      totalRisks: number
      criticalRisks: number
      highRisks: number
      mediumRisks: number
      lowRisks: number
      unassignedRisks: number
    }
    topRisks: Array<{
      id: string
      title: string
      rpn: number
      owner?: string
      daysOpen: number
    }>
    distribution: {
      byCategory: Record<string, number>
      byStatus: Record<string, number>
      byOwner: Record<string, number>
    }
  }
  error?: string
}
```

---

### getRiskTrends

リスクのトレンド分析データを取得する。

```typescript
async function getRiskTrends(
  projectId: string,
  period: 'weekly' | 'monthly' | 'quarterly'
): Promise<RiskTrendsResponse>
```

#### レスポンス
```typescript
interface RiskTrendsResponse {
  success: boolean
  data?: {
    periods: string[]
    trends: {
      riskCount: {
        total: number[]
        byLevel: {
          critical: number[]
          high: number[]
          medium: number[]
          low: number[]
        }
      }
      newRisks: number[]
      closedRisks: number[]
      materializedRisks: number[]
      averageRPN: number[]
      averageResolutionTime: number[]  // 日数
    }
    insights: {
      trend: 'improving' | 'stable' | 'worsening'
      concerns: string[]
      recommendations: string[]
    }
    forecast?: {
      expectedNewRisks: number
      expectedResolutions: number
      confidenceLevel: number
    }
  }
  error?: string
}
```

---

### createLesson

リスク対応から得られた教訓を登録する。

```typescript
async function createLesson(data: CreateLessonInput): Promise<LessonResponse>
```

#### リクエスト
```typescript
interface CreateLessonInput {
  projectId: string
  riskId?: string
  issueId?: string
  category: 'risk_identification' | 'assessment' | 'mitigation' | 'monitoring' | 'communication'
  title: string
  situation: string
  actions: string
  results: string
  lessons: {
    whatWorked: string[]
    whatDidntWork: string[]
    recommendations: string[]
  }
  applicability: {
    projectTypes?: string[]
    industries?: string[]
    contexts?: string[]
  }
  keywords: string[]
}
```

#### レスポンス
```typescript
interface LessonResponse {
  success: boolean
  data?: {
    id: string
    title: string
    category: string
    project: {
      id: string
      name: string
    }
    createdBy: {
      id: string
      name: string
    }
    createdAt: Date
    status: 'draft' | 'review' | 'approved' | 'published'
    usefulness: {
      views: number
      ratings: number
      averageRating: number
    }
  }
  error?: string
}
```

## エラーハンドリング

### 共通エラー
- `RISK_NOT_FOUND`: リスクが見つかりません
- `ISSUE_NOT_FOUND`: イシューが見つかりません
- `INVALID_RISK_LEVEL`: 無効なリスクレベルです
- `PERMISSION_DENIED`: 権限がありません

### リスク固有エラー
- `RISK_ALREADY_MATERIALIZED`: リスクは既に顕在化しています
- `MITIGATION_PLAN_EXISTS`: 対応計画が既に存在します
- `CANNOT_CLOSE_ACTIVE_RISK`: アクティブなリスクは閉じられません

## パフォーマンス最適化

### インデックス
- projectId, status での複合インデックス
- rpn での降順インデックス
- owner, status での複合インデックス

### キャッシュ戦略
- リスクマトリクス: 1時間キャッシュ
- トレンドデータ: 日次更新
- 教訓検索結果: 24時間キャッシュ

### 通知の最適化
- リスクレベル変更時のみ通知
- 日次サマリーでの一括通知オプション
- 重要度に応じた通知チャネル選択