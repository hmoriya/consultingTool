# OP-001: 収益を認識し記録する

**作成日**: 2025-10-31
**所属L3**: L3-003-revenue-and-cash-flow-management: Revenue And Cash Flow Management
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/recognize-and-record-revenue

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトで発生した収益を適切なタイミングで認識し、正確に記録する。収益認識基準に従った適切な会計処理により、財務の透明性を確保する。

### 実現する機能
- 収益認識タイミングの判定
- 収益金額の計算と記録
- プロジェクト別収益の配分
- 収益認識履歴の管理

### 入力
- プロジェクト契約情報
- 作業完了情報
- 請求可能金額
- 収益認識基準

### 出力
- 認識された収益データ
- プロジェクト別収益集計
- 収益認識履歴
- 会計システム連携データ

---

## 📥 入力パラメータ

### パラメータ一覧

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|----|----|------|--------------|
| projectId | UUID | ○ | プロジェクト識別子 | BC-001 Project存在確認 |
| contractId | UUID | ○ | 契約識別子 | Contract存在確認、有効性確認 |
| recognitionAmount | Money | ○ | 認識金額 | Decimal.js、≥0、通貨一致 |
| currency | Currency | ○ | 通貨コード | ISO 4217 (JPY/USD/EUR) |
| recognitionDate | Date | ○ | 収益認識日 | 契約期間内、未来日不可 |
| recognitionBasis | RevenueRecognitionBasis | ○ | 認識基準 | PERCENTAGE_OF_COMPLETION/MILESTONE/DELIVERY |
| completionPercentage | Decimal | △ | 進捗度 | 0-100、認識基準=進捗度の場合必須 |
| milestoneId | UUID | △ | マイルストーン識別子 | 認識基準=マイルストーンの場合必須 |
| deliverableId | UUID | △ | 成果物識別子 | 認識基準=納品の場合必須 |
| invoiceableAmount | Money | △ | 請求可能金額 | Decimal.js、≤認識金額 |
| recognitionJustification | TEXT | ○ | 認識根拠 | 最低100文字、監査要件 |
| projectPhase | STRING_50 | ○ | プロジェクトフェーズ | 計画/実行/完了 |

### 入力例（JSON）
```json
{
  "projectId": "proj-12345",
  "contractId": "cont-67890",
  "recognitionAmount": {
    "value": "5000000.00",
    "currency": "JPY"
  },
  "currency": "JPY",
  "recognitionDate": "2025-03-31",
  "recognitionBasis": "PERCENTAGE_OF_COMPLETION",
  "completionPercentage": 45.5,
  "invoiceableAmount": {
    "value": "4500000.00",
    "currency": "JPY"
  },
  "recognitionJustification": "進捗度45.5%に基づく収益認識。工数実績500時間、計画1100時間に対し45.5%達成。主要成果物「基本設計書」「詳細設計書」完了により妥当性を確認。",
  "projectPhase": "execution"
}
```

### バリデーションルール

1. **金額整合性検証**
   - 認識金額 ≥ 請求可能金額
   - 累積認識金額 ≤ 契約総額
   - 通貨コード一致（認識金額・請求可能金額・契約）

2. **認識基準別必須項目**
   - PERCENTAGE_OF_COMPLETION: completionPercentage必須
   - MILESTONE: milestoneId必須、マイルストーン完了確認
   - DELIVERY: deliverableId必須、成果物検収完了確認

3. **期間整合性検証**
   - 認識日 ∈ [契約開始日, 契約終了日]
   - 認識日 ≤ 本日
   - 同一プロジェクト・同一月の重複認識禁止

4. **監査要件検証**
   - 認識根拠文字数 ≥ 100文字
   - 承認ワークフロー対象: ¥1M以上
   - 証憑書類添付: ¥10M以上

5. **BC-001連携検証**
   - Project状態 = ACTIVE（計画中は収益認識不可）
   - Project予算 ≥ 累積認識金額

---

## 📤 出力仕様

### 成功レスポンス (200 OK)

```json
{
  "success": true,
  "data": {
    "revenueId": "rev-98765",
    "projectId": "proj-12345",
    "contractId": "cont-67890",
    "recognitionAmount": {
      "value": "5000000.00",
      "currency": "JPY"
    },
    "recognitionDate": "2025-03-31",
    "recognitionBasis": "PERCENTAGE_OF_COMPLETION",
    "completionPercentage": 45.5,
    "status": "RECOGNIZED",
    "cumulativeRevenue": {
      "value": "12000000.00",
      "currency": "JPY"
    },
    "remainingContractValue": {
      "value": "14000000.00",
      "currency": "JPY"
    },
    "invoiceableAmount": {
      "value": "4500000.00",
      "currency": "JPY"
    },
    "approvalRequired": true,
    "approvalStatus": "PENDING",
    "approverRole": "FINANCE_MANAGER",
    "recognitionJustification": "進捗度45.5%に基づく収益認識...",
    "createdAt": "2025-03-31T15:30:00Z",
    "createdBy": "user-456",
    "auditTrail": {
      "action": "REVENUE_RECOGNIZED",
      "timestamp": "2025-03-31T15:30:00Z",
      "userId": "user-456",
      "ipAddress": "192.168.1.100",
      "changes": {
        "revenueAdded": "5000000.00 JPY"
      }
    }
  },
  "message": "収益認識が正常に記録されました。承認待ちステータスです。"
}
```

### エラーレスポンス

#### 400 Bad Request - バリデーションエラー
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3003_OP001_001",
    "message": "認識金額が契約残高を超過しています",
    "details": {
      "recognitionAmount": "5000000.00 JPY",
      "remainingContractValue": "3000000.00 JPY",
      "contractId": "cont-67890"
    }
  }
}
```

#### 403 Forbidden - 権限エラー
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3003_OP001_002",
    "message": "収益認識権限がありません",
    "details": {
      "requiredRole": "FINANCE_MANAGER",
      "userRole": "CONSULTANT"
    }
  }
}
```

#### 409 Conflict - 重複エラー
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3003_OP001_003",
    "message": "同一月の収益認識が既に存在します",
    "details": {
      "projectId": "proj-12345",
      "existingRevenueId": "rev-88888",
      "recognitionMonth": "2025-03"
    }
  }
}
```

#### 422 Unprocessable Entity - ビジネスルール違反
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3003_OP001_004",
    "message": "進捗度が前回認識時より減少しています",
    "details": {
      "currentPercentage": 45.5,
      "previousPercentage": 52.0,
      "previousRevenueId": "rev-77777"
    }
  }
}
```

### エラーコード一覧

| エラーコード | HTTP | 説明 | 対処方法 |
|------------|------|------|---------|
| ERR_BC002_L3003_OP001_001 | 400 | 認識金額が契約残高超過 | 契約総額・累積認識額を確認 |
| ERR_BC002_L3003_OP001_002 | 403 | 権限不足 | FINANCE_MANAGER権限取得 |
| ERR_BC002_L3003_OP001_003 | 409 | 同一月重複認識 | 既存認識の修正または削除 |
| ERR_BC002_L3003_OP001_004 | 422 | 進捗度逆行 | 進捗度の妥当性再確認 |
| ERR_BC002_L3003_OP001_005 | 422 | 認識基準不整合 | 必須項目の追加入力 |
| ERR_BC002_L3003_OP001_006 | 422 | 契約期間外認識 | 認識日の修正 |
| ERR_BC002_L3003_OP001_007 | 500 | 会計システム連携失敗 | リトライまたはサポート連絡 |

---

## 🛠️ 実装ガイダンス

### ドメイン集約: Revenue Aggregate

```typescript
import Decimal from 'decimal.js';

// Revenue Aggregate Root
class Revenue {
  constructor(
    public id: string,
    public projectId: string,
    public contractId: string,
    public amount: Money,
    public recognitionDate: Date,
    public recognitionBasis: RevenueRecognitionBasis,
    public completionPercentage?: Decimal,
    public status: RevenueStatus = 'DRAFT'
  ) {}

  // 収益認識実行（Decimal.js使用）
  recognize(justification: string, recognizer: User): RevenueRecognized {
    // ビジネスルール検証
    this.validateRecognitionRules();

    // 承認必要性判定
    const requiresApproval = this.amount.value.gte(new Decimal('1000000'));

    // 収益認識実行
    this.status = requiresApproval ? 'PENDING_APPROVAL' : 'RECOGNIZED';

    // ドメインイベント発行
    return new RevenueRecognized(
      this.id,
      this.amount,
      this.recognitionDate,
      recognizer.id,
      justification,
      requiresApproval
    );
  }

  // 累積収益計算
  static calculateCumulativeRevenue(
    revenues: Revenue[]
  ): Money {
    const total = revenues.reduce(
      (sum, rev) => sum.plus(rev.amount.value),
      new Decimal(0)
    );

    return new Money(total, revenues[0].amount.currency);
  }

  // 進捗度整合性検証
  validateProgressionConsistency(
    previousRevenue?: Revenue
  ): void {
    if (!previousRevenue) return;

    if (this.completionPercentage &&
        previousRevenue.completionPercentage &&
        this.completionPercentage.lt(previousRevenue.completionPercentage)) {
      throw new DomainError('進捗度が前回より減少しています');
    }
  }
}

// Money Value Object
class Money {
  constructor(
    public value: Decimal,
    public currency: Currency
  ) {}

  plus(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('異なる通貨の加算はできません');
    }
    return new Money(this.value.plus(other.value), this.currency);
  }

  toJSON() {
    return {
      value: this.value.toFixed(2),
      currency: this.currency
    };
  }
}

// Domain Service: RevenueRecognitionService
class RevenueRecognitionService {
  async recognizeRevenue(
    input: RecognizeRevenueInput,
    userId: string
  ): Promise<Revenue> {
    // 1. 契約取得・検証
    const contract = await this.contractRepository.findById(input.contractId);
    this.validateContractStatus(contract);

    // 2. 累積収益計算
    const existingRevenues = await this.revenueRepository
      .findByContract(input.contractId);
    const cumulativeRevenue = Revenue.calculateCumulativeRevenue(existingRevenues);

    // 3. 契約残高検証
    const remainingValue = contract.totalAmount.value.minus(cumulativeRevenue.value);
    if (input.recognitionAmount.value.gt(remainingValue)) {
      throw new BusinessRuleViolationError('ERR_BC002_L3003_OP001_001');
    }

    // 4. Revenue集約生成
    const revenue = new Revenue(
      generateId('rev-'),
      input.projectId,
      input.contractId,
      new Money(new Decimal(input.recognitionAmount.value), input.currency),
      input.recognitionDate,
      input.recognitionBasis,
      input.completionPercentage ? new Decimal(input.completionPercentage) : undefined
    );

    // 5. 進捗度整合性検証
    const previousRevenue = existingRevenues[existingRevenues.length - 1];
    revenue.validateProgressionConsistency(previousRevenue);

    // 6. 収益認識実行
    const recognizer = await this.userRepository.findById(userId);
    const event = revenue.recognize(input.recognitionJustification, recognizer);

    // 7. 永続化
    await this.revenueRepository.save(revenue);

    // 8. ドメインイベント発行
    await this.eventBus.publish(event);

    // 9. BC-007通知連携
    if (revenue.amount.value.gte(new Decimal('10000000'))) {
      await this.notificationService.sendHighValueRevenueAlert(revenue);
    }

    return revenue;
  }
}
```

### BC統合連携

#### BC-001: Project Management連携
```typescript
// プロジェクト収益累計の同期
await projectService.updateProjectRevenue(
  projectId,
  cumulativeRevenue
);

// プロジェクト予算との整合性確認
const project = await projectRepository.findById(projectId);
if (cumulativeRevenue.value.gt(project.budget.value)) {
  logger.warn('収益が予算を超過', { projectId, cumulativeRevenue });
}
```

#### BC-003: Access Control連携
```typescript
// 収益認識権限検証
const hasPermission = await accessControlService.checkPermission(
  userId,
  'RECOGNIZE_REVENUE',
  { projectId, amount: recognitionAmount }
);

if (!hasPermission) {
  throw new ForbiddenError('ERR_BC002_L3003_OP001_002');
}
```

#### BC-005: Resource Management連携
```typescript
// 工数実績との整合性検証（進捗度方式の場合）
if (recognitionBasis === 'PERCENTAGE_OF_COMPLETION') {
  const actualHours = await timesheetService.getTotalHours(projectId);
  const plannedHours = await projectService.getPlannedHours(projectId);
  const actualPercentage = new Decimal(actualHours).div(plannedHours).mul(100);

  // 進捗度と工数実績の乖離チェック
  const variance = actualPercentage.minus(completionPercentage).abs();
  if (variance.gt(new Decimal(5))) { // 5%以上の乖離
    logger.warn('進捗度と工数実績の乖離', {
      completionPercentage,
      actualPercentage,
      variance
    });
  }
}
```

#### BC-007: Notification連携
```typescript
// 高額収益認識の通知
if (recognitionAmount.value.gte(new Decimal('10000000'))) {
  await notificationService.send({
    type: 'HIGH_VALUE_REVENUE_RECOGNITION',
    recipients: ['finance-team@example.com', 'cfo@example.com'],
    data: {
      revenueId,
      projectId,
      amount: recognitionAmount,
      recognitionDate
    }
  });
}

// 承認待ち通知
if (requiresApproval) {
  await notificationService.send({
    type: 'REVENUE_APPROVAL_REQUIRED',
    recipients: [approverEmail],
    data: { revenueId, amount: recognitionAmount }
  });
}
```

### トランザクション境界

```typescript
async recognizeRevenueTransaction(
  input: RecognizeRevenueInput,
  userId: string
): Promise<Revenue> {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Revenue作成
    const revenue = await tx.revenue.create({ data: revenueData });

    // 2. 累積収益更新
    await tx.contract.update({
      where: { id: input.contractId },
      data: {
        recognizedRevenue: { increment: input.recognitionAmount.value }
      }
    });

    // 3. プロジェクト収益更新（BC-001連携）
    await tx.project.update({
      where: { id: input.projectId },
      data: {
        totalRevenue: { increment: input.recognitionAmount.value }
      }
    });

    // 4. 監査ログ記録
    await tx.auditLog.create({
      data: {
        action: 'REVENUE_RECOGNIZED',
        entityType: 'Revenue',
        entityId: revenue.id,
        userId,
        changes: { revenueAdded: input.recognitionAmount }
      }
    });

    return revenue;
  }, {
    isolationLevel: 'Serializable', // 最高レベルの分離
    timeout: 10000 // 10秒タイムアウト
  });
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

| コード | 分類 | 重大度 | リトライ | 説明 |
|--------|------|--------|---------|------|
| ERR_BC002_L3003_OP001_001 | ビジネスルール | ERROR | × | 認識金額が契約残高超過 |
| ERR_BC002_L3003_OP001_002 | 権限 | ERROR | × | 収益認識権限不足 |
| ERR_BC002_L3003_OP001_003 | 整合性 | ERROR | × | 同一月重複認識 |
| ERR_BC002_L3003_OP001_004 | ビジネスルール | ERROR | × | 進捗度逆行 |
| ERR_BC002_L3003_OP001_005 | バリデーション | ERROR | × | 認識基準不整合 |
| ERR_BC002_L3003_OP001_006 | バリデーション | ERROR | × | 契約期間外認識 |
| ERR_BC002_L3003_OP001_007 | システム | CRITICAL | ○ | 会計システム連携失敗 |
| ERR_BC002_L3003_OP001_008 | システム | CRITICAL | ○ | トランザクション失敗 |

### リトライ戦略

#### システムエラー（リトライ対象）
```typescript
const retryConfig = {
  maxRetries: 3,
  backoff: 'exponential', // 1s, 2s, 4s
  retryableErrors: [
    'ERR_BC002_L3003_OP001_007', // 会計システム連携失敗
    'ERR_BC002_L3003_OP001_008', // トランザクション失敗
    'ECONNRESET',
    'ETIMEDOUT'
  ]
};

async function recognizeRevenueWithRetry(
  input: RecognizeRevenueInput,
  userId: string
): Promise<Revenue> {
  let lastError: Error;

  for (let attempt = 0; attempt < retryConfig.maxRetries; attempt++) {
    try {
      return await revenueService.recognizeRevenue(input, userId);
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        throw error; // 即座にエラー返却
      }

      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await sleep(delay);

      logger.warn(`収益認識リトライ ${attempt + 1}/${retryConfig.maxRetries}`, {
        revenueId: input.projectId,
        error: error.message,
        nextRetryIn: `${delay}ms`
      });
    }
  }

  throw lastError;
}
```

#### ビジネスルールエラー（リトライ不可）
```typescript
// ビジネスルール違反は即座にエラー返却
if (recognitionAmount.value.gt(remainingContractValue)) {
  throw new BusinessRuleViolationError(
    'ERR_BC002_L3003_OP001_001',
    '認識金額が契約残高を超過しています',
    {
      recognitionAmount,
      remainingContractValue,
      contractId
    }
  );
}
```

### ロールバック手順

#### トランザクション失敗時の自動ロールバック
```typescript
try {
  await prisma.$transaction(async (tx) => {
    // Revenue作成、累積収益更新、プロジェクト収益更新
  });
} catch (error) {
  // Prismaが自動的にロールバック実行
  logger.error('収益認識トランザクション失敗、自動ロールバック実施', {
    error,
    input
  });
  throw error;
}
```

#### 外部システム連携失敗時の補償トランザクション
```typescript
let revenueId: string;
try {
  // 1. Revenue作成成功
  const revenue = await revenueRepository.save(revenueData);
  revenueId = revenue.id;

  // 2. 会計システム連携失敗
  await accountingSystem.postRevenue(revenue);
} catch (error) {
  if (revenueId) {
    // 補償トランザクション: Revenue削除
    await revenueRepository.delete(revenueId);

    logger.error('会計システム連携失敗、Revenueをロールバック', {
      revenueId,
      error
    });
  }
  throw new SystemError('ERR_BC002_L3003_OP001_007');
}
```

### 監査ログ記録

#### 全操作の監査ログ
```typescript
await auditLogRepository.create({
  action: 'REVENUE_RECOGNIZE_ATTEMPT',
  entityType: 'Revenue',
  entityId: revenueId,
  userId,
  timestamp: new Date(),
  ipAddress: request.ip,
  userAgent: request.headers['user-agent'],
  changes: {
    projectId: input.projectId,
    amount: input.recognitionAmount,
    recognitionDate: input.recognitionDate,
    recognitionBasis: input.recognitionBasis,
    completionPercentage: input.completionPercentage
  },
  result: success ? 'SUCCESS' : 'FAILURE',
  errorCode: error?.code,
  errorMessage: error?.message
});
```

#### 高額収益の詳細ログ（¥10M以上）
```typescript
if (recognitionAmount.value.gte(new Decimal('10000000'))) {
  await detailedAuditLogRepository.create({
    revenueId,
    amount: recognitionAmount,
    justification: input.recognitionJustification,
    supportingDocuments: input.attachments,
    approverChain: approvalHistory,
    accountingEntries: journalEntries,
    retentionPeriod: 10 * 365 // 10年保管（会計法準拠）
  });
}
```

### 財務コンプライアンス注意事項

1. **収益認識基準準拠（ASC 606 / IFRS 15）**
   - 5ステップモデルの適用確認
   - 履行義務の特定と分離
   - 取引価格の算定と配分

2. **データ保管期間（会計法準拠）**
   - 収益認識記録: 10年間保管必須
   - 証憑書類: 10年間保管必須
   - 監査ログ: 10年間保管必須

3. **暗号化要件**
   - ¥10M以上の収益データ: AES-256暗号化必須
   - 個人情報含む場合: 追加暗号化層適用

4. **四半期・年度締め処理**
   - 締め後の過去期間収益認識禁止
   - 修正の場合は修正仕訳（Adjusting Entry）必須

5. **外部監査対応**
   - サンプリング監査対応のための詳細ログ
   - 収益認識根拠の文書化徹底
   - 証憑書類の即時提供体制

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
> - [services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/recognize-and-record-revenue/](../../../../../../../services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/recognize-and-record-revenue/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
