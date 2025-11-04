# OP-002: パフォーマンスを評価する

**作成日**: 2025-10-31
**所属L3**: L3-003-talent-development-and-performance: Talent Development And Performance
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/manage-and-develop-members/operations/evaluate-performance

---

## 📋 How: この操作の定義

### 操作の概要
メンバーのパフォーマンスを定期的に評価し、成長と改善を支援する。公正な評価プロセスにより、モチベーション向上と組織力強化を実現する。

### 実現する機能
- パフォーマンス評価の実施
- 目標達成度の測定
- 多面評価（360度評価）の実施
- 評価結果のフィードバック

### 入力
- 評価期間と対象メンバー
- 目標設定データ
- パフォーマンス指標
- 評価者情報

### 出力
- パフォーマンス評価結果
- 目標達成度レポート
- 強み・改善点の分析
- フィードバックレポート

---

## 📥 入力パラメータ

### 必須パラメータ

#### 主要入力データ
```typescript
interface OperationInput {
  // Algorithm: 360° feedback, OKR/SMART goals
  userId: UUID
  targetDate: DATE
  parameters: OperationParameters
  context: OperationContext
}

interface OperationParameters {
  mode: 'standard' | 'advanced' | 'batch'
  options: OperationOptions
  constraints: Constraint[]
}
```

### オプションパラメータ

#### 詳細設定
```typescript
interface OperationOptions {
  // Features: 360度評価, OKR管理, SMART目標, フィードバック集約
  enableValidation: BOOLEAN
  enableOptimization: BOOLEAN
  performanceMode: 'accuracy' | 'speed' | 'balanced'
}
```

### バリデーションルール

1. **入力データ検証**
   - 必須フィールドの存在確認
   - データ型・範囲の妥当性検証
   - ビジネスルール適合性チェック

2. **権限検証**
   - ユーザー権限の確認
   - リソースアクセス権の検証

3. **データ整合性検証**
   - 関連データの存在確認
   - 参照整合性の検証

---

## 📤 出力仕様

### 主要出力

#### 操作結果
```typescript
interface OperationResult {
  success: BOOLEAN
  resultId: UUID
  status: 'completed' | 'partial' | 'failed'
  
  data: ResultData
  metadata: ResultMetadata
  warnings: Warning[]
  recommendations: Recommendation[]
}

interface ResultData {
  // Algorithm output: 360° feedback, OKR/SMART goals
  primaryResults: PrimaryResult[]
  secondaryResults: SecondaryResult[]
  metrics: PerformanceMetrics
}

interface ResultMetadata {
  executedAt: TIMESTAMP
  executionTime: INTEGER
  algorithmsUsed: STRING[]
  dataPoints: INTEGER
  confidenceLevel: DECIMAL
}
```

#### パフォーマンスメトリクス
```typescript
interface PerformanceMetrics {
  processingTime: INTEGER
  accuracy: PERCENTAGE
  efficiency: PERCENTAGE
  qualityScore: DECIMAL
}
```

### 出力フォーマット

#### JSON レスポンス
```json
{
  "success": true,
  "data": {
    "resultId": "uuid",
    "status": "completed",
    "primaryResults": [...],
    "metrics": {
      "processingTime": 1250,
      "accuracy": 94.5,
      "efficiency": 87.3
    }
  },
  "metadata": {
    "executedAt": "2025-11-04T10:30:00Z",
    "algorithmsUsed": ["360° feedback, OKR/SMART goals"]
  }
}
```

---

## 🛠️ 実装ガイダンス

### アーキテクチャ概要

```typescript
/**
 * Operation Engine
 * Algorithm: 360° feedback, OKR/SMART goals
 * Key Features: 360度評価, OKR管理, SMART目標, フィードバック集約
 */
class OperationEngine {
  private validator: InputValidator
  private processor: DataProcessor
  private optimizer: AlgorithmOptimizer
  private repository: DataRepository

  async execute(input: OperationInput): Promise<OperationResult> {
    // 1. Input validation
    await this.validator.validate(input)

    // 2. Data preprocessing
    const preprocessed = await this.preprocessData(input)

    // 3. Core algorithm execution
    const results = await this.processor.process(preprocessed)

    // 4. Result optimization
    const optimized = await this.optimizer.optimize(results)

    // 5. Post-processing
    return await this.postprocess(optimized)
  }
}
```

### コア アルゴリズム実装

```typescript
class AlgorithmProcessor {
  /**
   * Core algorithm: 360° feedback, OKR/SMART goals
   */
  async process(input: PreprocessedData): Promise<RawResults> {
    // Algorithm implementation
    const results = await this.executeAlgorithm(input)

    // Quality validation
    this.validateResults(results)

    // Performance optimization
    return this.optimizeResults(results)
  }

  private async executeAlgorithm(
    input: PreprocessedData
  ): Promise<RawResults> {
    // Implementation of 360° feedback, OKR/SMART goals
    // Key features: 360度評価, OKR管理
    
    const initialState = this.initializeState(input)
    const processed = await this.applyTransformations(initialState)
    return this.aggregateResults(processed)
  }
}
```

### パフォーマンス最適化

```typescript
class PerformanceOptimizer {
  private cache: Map<string, CachedResult> = new Map()
  private readonly TTL = 3600000  // 1 hour

  async optimizeExecution(operation: () => Promise<any>): Promise<any> {
    const cacheKey = this.generateCacheKey()
    const cached = this.cache.get(cacheKey)
    
    if (cached && this.isValidCache(cached)) {
      return cached.result
    }

    const startTime = Date.now()
    const result = await operation()
    const executionTime = Date.now() - startTime

    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now(),
      executionTime
    })

    return result
  }
}
```

### BC統合ポイント

```typescript
/**
 * BC-001 (プロジェクト管理) 統合
 */
class ProjectServiceIntegration {
  async getProjectData(projectId: UUID): Promise<ProjectData> {
    const response = await fetch(
      `/api/v1/project-success-service/usecases/get-project-data`,
      {
        method: 'POST',
        body: JSON.stringify({ projectId }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return response.json()
  }
}

/**
 * BC-002 (財務管理) 統合
 */
class FinanceServiceIntegration {
  async getCostData(resourceId: UUID): Promise<CostData> {
    const response = await fetch(
      `/api/v1/revenue-optimization-service/usecases/get-cost-data`,
      {
        method: 'POST',
        body: JSON.stringify({ resourceId }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return response.json()
  }
}

/**
 * BC-006 (知識管理) 統合
 */
class KnowledgeServiceIntegration {
  async getBestPractices(topic: STRING): Promise<BestPractice[]> {
    const response = await fetch(
      `/api/v1/knowledge-co-creation-service/usecases/search-knowledge`,
      {
        method: 'POST',
        body: JSON.stringify({ topic }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return response.json()
  }
}

/**
 * BC-007 (通知) 統合
 */
class NotificationServiceIntegration {
  async sendNotification(notification: NotificationData): Promise<void> {
    await fetch(
      `/api/v1/collaboration-facilitation-service/usecases/send-notification`,
      {
        method: 'POST',
        body: JSON.stringify(notification),
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
```

---

## ⚠️ エラー処理プロトコル

### エラー分類

#### 1. バリデーションエラー（400系）

```typescript
enum ValidationErrorCode {
  INVALID_INPUT = 'E4001',
  MISSING_REQUIRED_FIELD = 'E4002',
  INVALID_FORMAT = 'E4003',
  OUT_OF_RANGE = 'E4004',
  CONSTRAINT_VIOLATION = 'E4005'
}

interface ValidationError extends Error {
  code: ValidationErrorCode
  field: string
  value: any
  constraint: string
  message: string
}
```

**対処方法:**
```typescript
try {
  await operationEngine.execute(input)
} catch (error) {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: `Field: ${error.field}, Value: ${error.value}`,
        suggestion: this.getSuggestion(error.code)
      }
    }
  }
}
```

#### 2. ビジネスルール違反（422）

```typescript
enum BusinessRuleErrorCode {
  RULE_VIOLATION = 'E4221',
  STATE_CONFLICT = 'E4222',
  AUTHORIZATION_FAILED = 'E4223',
  RESOURCE_UNAVAILABLE = 'E4224'
}

interface BusinessRuleError extends Error {
  code: BusinessRuleErrorCode
  rule: string
  context: any
  suggestedAction: string
}
```

**対処方法:**
```typescript
class BusinessRuleValidator {
  validate(input: OperationInput, context: OperationContext): ValidationResult {
    const violations: BusinessRuleError[] = []

    if (!this.checkRules(input, context)) {
      violations.push({
        code: BusinessRuleErrorCode.RULE_VIOLATION,
        rule: 'Business Rule Check',
        context: { input, context },
        suggestedAction: 'Please adjust input according to business rules'
      })
    }

    return {
      isValid: violations.length === 0,
      violations
    }
  }
}
```

#### 3. 処理失敗エラー（500系）

```typescript
enum ProcessingErrorCode {
  ALGORITHM_FAILURE = 'E5001',
  TIMEOUT = 'E5002',
  RESOURCE_EXHAUSTED = 'E5003',
  EXTERNAL_SERVICE_ERROR = 'E5004'
}

interface ProcessingError extends Error {
  code: ProcessingErrorCode
  stage: string
  partialResults: any
  recoverable: BOOLEAN
}
```

**対処方法:**
```typescript
class ErrorRecoveryManager {
  async handleProcessingError(error: ProcessingError): Promise<RecoveryResult> {
    if (error.recoverable) {
      return await this.attemptRecovery(error)
    } else {
      logger.error('Unrecoverable processing error', {
        code: error.code,
        stage: error.stage,
        message: error.message
      })
      
      return {
        success: false,
        partialResults: error.partialResults,
        requiresManualIntervention: true
      }
    }
  }
}
```

#### 4. データ整合性エラー

```typescript
enum DataIntegrityErrorCode {
  MISSING_DATA = 'E5101',
  INCONSISTENT_STATE = 'E5102',
  CONCURRENT_MODIFICATION = 'E5103',
  STALE_DATA = 'E5104'
}
```

**対処方法:**
```typescript
class DataIntegrityChecker {
  async checkIntegrity(data: OperationData): Promise<IntegrityReport> {
    const issues: DataIntegrityIssue[] = []

    if (!await this.dataExists(data)) {
      issues.push({
        code: DataIntegrityErrorCode.MISSING_DATA,
        severity: 'critical',
        message: 'Required data is missing',
        suggestedAction: 'Verify data sources and retry'
      })
    }

    if (!this.isConsistent(data)) {
      issues.push({
        code: DataIntegrityErrorCode.INCONSISTENT_STATE,
        severity: 'high',
        message: 'Data state is inconsistent',
        suggestedAction: 'Refresh data and revalidate'
      })
    }

    return {
      isHealthy: issues.filter(i => i.severity === 'critical').length === 0,
      issues,
      checkedAt: new Date()
    }
  }
}
```

### リトライ戦略

```typescript
class RetryManager {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries || 3
    const baseDelay = options.baseDelay || 1000

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        if (attempt === maxRetries || !this.isRetryable(error)) {
          throw error
        }

        const delay = baseDelay * Math.pow(2, attempt)
        await this.sleep(delay)
      }
    }

    throw new Error('All retries exhausted')
  }

  private isRetryable(error: any): boolean {
    return (
      error.code === 'TIMEOUT' ||
      error.code === 'RESOURCE_EXHAUSTED' ||
      error.code === 'EXTERNAL_SERVICE_ERROR'
    )
  }
}
```

### ロギング・監視

```typescript
class OperationLogger {
  logExecutionStart(input: OperationInput): void {
    logger.info('Operation execution started', {
      operationType: '360° feedback, OKR/SMART goals',
      userId: input.userId,
      parameters: input.parameters,
      timestamp: new Date().toISOString()
    })
  }

  logExecutionComplete(result: OperationResult, executionTime: INTEGER): void {
    logger.info('Operation execution completed', {
      resultId: result.resultId,
      status: result.status,
      executionTime,
      metrics: result.data.metrics,
      timestamp: new Date().toISOString()
    })
  }

  logExecutionError(error: Error, context: any): void {
    logger.error('Operation execution failed', {
      error: error.message,
      code: (error as any).code,
      context,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
  }
}
```

### アラート通知

```typescript
class AlertManager {
  async notifyOnCriticalError(error: Error, context: any): Promise<void> {
    if (this.isCritical(error)) {
      await this.notificationService.sendImmediate({
        recipientIds: await this.getAdminIds(),
        type: 'critical_error',
        title: 'Operation Execution Error',
        message: `${error.message}

Context: ${JSON.stringify(context, null, 2)}`,
        actionUrl: `/admin/errors/${context.requestId}`
      })
    }
  }

  async notifyOnPerformanceDegradation(metrics: PerformanceMetrics): Promise<void> {
    if (metrics.efficiency < 70) {
      await this.notificationService.sendImmediate({
        recipientIds: await this.getOperationsTeam(),
        type: 'performance_alert',
        title: 'Performance Degradation Detected',
        message: `Efficiency dropped to ${metrics.efficiency}%`,
        actionUrl: '/admin/performance'
      })
    }
  }
}
```

---
## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/capabilities/manage-and-develop-members/operations/evaluate-performance/](../../../../../../../services/talent-optimization-service/capabilities/manage-and-develop-members/operations/evaluate-performance/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
