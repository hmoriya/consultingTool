# OP-003: 請求書を発行し回収を管理する

**作成日**: 2025-10-31
**所属L3**: L3-003-revenue-and-cash-flow-management: Revenue And Cash Flow Management
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/issue-invoice-and-manage-collection

---

## 📋 How: この操作の定義

### 操作の概要
適切なタイミングで請求書を発行し、代金回収を管理する。キャッシュフローの最適化と債権管理により、健全な財務状態を維持する。

### 実現する機能
- 請求書の作成と発行
- 支払期限の管理とリマインダー
- 入金確認と消込処理
- 未回収債権の管理とエスカレーション

### 入力
- 認識済み収益データ
- クライアント契約情報
- 支払条件
- 作業完了証明

### 出力
- 発行済み請求書
- 入金ステータス
- 未回収債権レポート
- キャッシュフロー予測

---

## 📥 入力パラメータ

### パラメータ一覧

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|----|----|------|--------------|
| revenueId | UUID | ○ | 収益認識ID | Revenue存在確認、認識済み |
| projectId | UUID | ○ | プロジェクトID | BC-001 Project存在確認 |
| clientId | UUID | ○ | クライアントID | Client存在確認 |
| invoiceAmount | Money | ○ | 請求金額 | Decimal.js、≥0、収益認識額と一致 |
| currency | Currency | ○ | 通貨コード | ISO 4217 (JPY/USD/EUR) |
| invoiceDate | Date | ○ | 請求日 | 収益認識日以降、未来日不可 |
| paymentTerms | PaymentTerms | ○ | 支払条件 | NET30/NET45/NET60/IMMEDIATE |
| dueDate | Date | ○ | 支払期限 | 請求日+支払条件期間 |
| invoiceItems | InvoiceItem[] | ○ | 請求明細 | 1件以上、合計=請求金額 |
| taxRate | Decimal | ○ | 消費税率 | 0-100、通常10% |
| taxAmount | Money | ○ | 消費税額 | Decimal.js計算、請求金額×税率 |
| totalAmount | Money | ○ | 税込合計 | 請求金額+消費税額 |
| billingAddress | Address | ○ | 請求先住所 | 必須項目全て埋まっている |
| paymentMethod | PaymentMethod | △ | 支払方法 | BANK_TRANSFER/CREDIT_CARD/CHECK |
| bankAccount | BankAccount | △ | 振込先口座 | 支払方法=振込時必須 |
| notes | TEXT | △ | 備考 | 最大1000文字 |
| attachments | Attachment[] | △ | 添付書類 | 作業報告書等 |

### 入力例（JSON）
```json
{
  "revenueId": "rev-12345",
  "projectId": "proj-67890",
  "clientId": "cli-11111",
  "invoiceAmount": {
    "value": "5000000.00",
    "currency": "JPY"
  },
  "currency": "JPY",
  "invoiceDate": "2025-03-31",
  "paymentTerms": "NET30",
  "dueDate": "2025-04-30",
  "invoiceItems": [
    {
      "description": "コンサルティング業務（3月分）",
      "quantity": 1,
      "unitPrice": "5000000.00",
      "amount": "5000000.00"
    }
  ],
  "taxRate": 10.0,
  "taxAmount": {
    "value": "500000.00",
    "currency": "JPY"
  },
  "totalAmount": {
    "value": "5500000.00",
    "currency": "JPY"
  },
  "billingAddress": {
    "company": "株式会社サンプル",
    "zip": "100-0001",
    "address1": "東京都千代田区千代田1-1",
    "address2": "サンプルビル5F"
  },
  "paymentMethod": "BANK_TRANSFER",
  "bankAccount": {
    "bankName": "三菱UFJ銀行",
    "branchName": "本店",
    "accountType": "ORDINARY",
    "accountNumber": "1234567",
    "accountName": "カ）コンサルティングファーム"
  }
}
```

### バリデーションルール

1. **金額整合性検証**
   - 請求金額 = 収益認識額（完全一致）
   - 税額 = 請求金額 × 税率（Decimal.js精密計算）
   - 合計 = 請求金額 + 税額
   - 明細合計 = 請求金額

2. **期間整合性検証**
   - 請求日 ≥ 収益認識日
   - 請求日 ≤ 本日
   - 支払期限 = 請求日 + 支払条件期間
   - 支払期限 > 請求日

3. **支払方法別必須項目**
   - BANK_TRANSFER: bankAccount必須
   - CREDIT_CARD: paymentGateway連携情報必須
   - CHECK: 郵送先住所必須

4. **重複発行防止**
   - 同一revenueIdの請求書発行は1回のみ
   - 既発行チェック必須

5. **BC-001連携検証**
   - Project状態 = ACTIVE
   - Project契約有効性確認
   - クライアント情報整合性確認

---

## 📤 出力仕様

### 成功レスポンス (200 OK)

```json
{
  "success": true,
  "data": {
    "invoiceId": "inv-98765",
    "invoiceNumber": "INV-2025-0331-001",
    "revenueId": "rev-12345",
    "projectId": "proj-67890",
    "clientId": "cli-11111",
    "status": "ISSUED",
    "invoiceAmount": {
      "value": "5000000.00",
      "currency": "JPY"
    },
    "taxAmount": {
      "value": "500000.00",
      "currency": "JPY"
    },
    "totalAmount": {
      "value": "5500000.00",
      "currency": "JPY"
    },
    "invoiceDate": "2025-03-31",
    "dueDate": "2025-04-30",
    "paymentTerms": "NET30",
    "paymentStatus": "PENDING",
    "outstandingAmount": {
      "value": "5500000.00",
      "currency": "JPY"
    },
    "agingDays": 0,
    "agingCategory": "CURRENT",
    "reminderSchedule": [
      {
        "reminderDate": "2025-04-23",
        "daysBeforeDue": 7,
        "reminderType": "FIRST_REMINDER"
      },
      {
        "reminderDate": "2025-04-29",
        "daysBeforeDue": 1,
        "reminderType": "FINAL_REMINDER"
      }
    ],
    "invoiceDocumentUrl": "https://storage.example.com/invoices/inv-98765.pdf",
    "createdAt": "2025-03-31T17:00:00Z",
    "createdBy": "user-123",
    "auditTrail": {
      "action": "INVOICE_ISSUED",
      "timestamp": "2025-03-31T17:00:00Z",
      "userId": "user-123",
      "ipAddress": "192.168.1.100",
      "changes": {
        "invoiceCreated": "INV-2025-0331-001",
        "amount": "5500000.00 JPY"
      }
    }
  },
  "message": "請求書が正常に発行されました。"
}
```

### エラーレスポンス

#### 400 Bad Request - バリデーションエラー
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3003_OP003_001",
    "message": "請求金額が収益認識額と一致しません",
    "details": {
      "invoiceAmount": "5000000.00 JPY",
      "revenueAmount": "4800000.00 JPY",
      "difference": "200000.00 JPY"
    }
  }
}
```

#### 409 Conflict - 重複エラー
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3003_OP003_002",
    "message": "この収益に対する請求書は既に発行されています",
    "details": {
      "revenueId": "rev-12345",
      "existingInvoiceId": "inv-88888",
      "existingInvoiceNumber": "INV-2025-0330-005"
    }
  }
}
```

### エラーコード一覧

| エラーコード | HTTP | 説明 | 対処方法 |
|------------|------|------|---------|
| ERR_BC002_L3003_OP003_001 | 400 | 請求金額不一致 | 収益認識額と請求金額の確認 |
| ERR_BC002_L3003_OP003_002 | 409 | 請求書重複発行 | 既存請求書の確認・取消 |
| ERR_BC002_L3003_OP003_003 | 422 | 収益未認識 | 収益認識処理の完了待ち |
| ERR_BC002_L3003_OP003_004 | 422 | 税額計算エラー | 税率・計算方法の確認 |
| ERR_BC002_L3003_OP003_005 | 500 | PDF生成失敗 | リトライまたはサポート連絡 |
| ERR_BC002_L3003_OP003_006 | 500 | メール送信失敗 | 手動送信またはリトライ |

---

## 🛠️ 実装ガイダンス

### ドメイン集約: Invoice Aggregate

```typescript
import Decimal from 'decimal.js';

// Invoice Aggregate Root
class Invoice {
  constructor(
    public id: string,
    public invoiceNumber: string,
    public revenueId: string,
    public totalAmount: Money,
    public invoiceDate: Date,
    public dueDate: Date,
    public status: InvoiceStatus = 'DRAFT',
    public paymentStatus: PaymentStatus = 'PENDING',
    private payments: Payment[] = []
  ) {}

  // 請求書発行（Decimal.js使用）
  issue(issuer: User): InvoiceIssued {
    // ビジネスルール検証
    this.validateIssuanceRules();

    // ステータス更新
    this.status = 'ISSUED';
    this.paymentStatus = 'PENDING';

    // 支払リマインダースケジュール生成
    const reminderSchedule = this.generateReminderSchedule();

    // ドメインイベント発行
    return new InvoiceIssued(
      this.id,
      this.invoiceNumber,
      this.totalAmount,
      this.dueDate,
      reminderSchedule,
      issuer.id
    );
  }

  // 入金記録（部分入金対応）
  recordPayment(payment: Payment): PaymentRecorded {
    // 入金額バリデーション
    const outstandingAmount = this.calculateOutstandingAmount();
    if (payment.amount.value.gt(outstandingAmount.value)) {
      throw new DomainError('入金額が未回収額を超過しています');
    }

    this.payments.push(payment);

    // 支払ステータス更新
    const newOutstanding = this.calculateOutstandingAmount();
    if (newOutstanding.value.eq(new Decimal(0))) {
      this.paymentStatus = 'PAID';
    } else if (newOutstanding.value.lt(this.totalAmount.value)) {
      this.paymentStatus = 'PARTIALLY_PAID';
    }

    return new PaymentRecorded(
      this.id,
      payment.id,
      payment.amount,
      newOutstanding
    );
  }

  // 未回収額計算（Decimal.js使用）
  calculateOutstandingAmount(): Money {
    const totalPaid = this.payments.reduce(
      (sum, p) => sum.plus(p.amount.value),
      new Decimal(0)
    );

    const outstanding = this.totalAmount.value.minus(totalPaid);
    return new Money(outstanding, this.totalAmount.currency);
  }

  // エイジング日数計算
  calculateAgingDays(asOfDate: Date = new Date()): number {
    if (this.paymentStatus === 'PAID') {
      return 0;
    }

    const diffTime = asOfDate.getTime() - this.dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  // エイジング区分判定
  getAgingCategory(): AgingCategory {
    const days = this.calculateAgingDays();

    if (days === 0) return 'CURRENT';
    if (days <= 30) return '1_30_DAYS';
    if (days <= 60) return '31_60_DAYS';
    if (days <= 90) return '61_90_DAYS';
    return 'OVER_90_DAYS';
  }

  // リマインダースケジュール生成
  private generateReminderSchedule(): ReminderSchedule[] {
    const schedule: ReminderSchedule[] = [];
    const dueDateTime = this.dueDate.getTime();

    // 7日前リマインダー
    schedule.push({
      reminderDate: new Date(dueDateTime - 7 * 24 * 60 * 60 * 1000),
      daysBeforeDue: 7,
      reminderType: 'FIRST_REMINDER'
    });

    // 1日前リマインダー
    schedule.push({
      reminderDate: new Date(dueDateTime - 1 * 24 * 60 * 60 * 1000),
      daysBeforeDue: 1,
      reminderType: 'FINAL_REMINDER'
    });

    // 期限後7日経過リマインダー
    schedule.push({
      reminderDate: new Date(dueDateTime + 7 * 24 * 60 * 60 * 1000),
      daysBeforeDue: -7,
      reminderType: 'OVERDUE_REMINDER'
    });

    return schedule;
  }
}

// Domain Service: Invoice Issuance Service
class InvoiceIssuanceService {
  async issueInvoice(
    input: IssueInvoiceInput,
    userId: string
  ): Promise<Invoice> {
    // 1. 収益認識データ取得
    const revenue = await this.revenueRepository.findById(input.revenueId);
    this.validateRevenueRecognized(revenue);

    // 2. 重複発行チェック
    const existingInvoice = await this.invoiceRepository
      .findByRevenueId(input.revenueId);
    if (existingInvoice) {
      throw new DuplicateInvoiceError('ERR_BC002_L3003_OP003_002');
    }

    // 3. 請求番号生成
    const invoiceNumber = await this.generateInvoiceNumber(input.invoiceDate);

    // 4. 税額計算（Decimal.js精密計算）
    const taxAmount = input.invoiceAmount.value
      .mul(input.taxRate.div(100))
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP); // 四捨五入

    const totalAmount = input.invoiceAmount.value.plus(taxAmount);

    // 5. Invoice集約生成
    const invoice = new Invoice(
      generateId('inv-'),
      invoiceNumber,
      input.revenueId,
      new Money(totalAmount, input.currency),
      input.invoiceDate,
      input.dueDate
    );

    // 6. 請求書発行
    const issuer = await this.userRepository.findById(userId);
    const event = invoice.issue(issuer);

    // 7. PDF生成
    const pdfUrl = await this.invoicePDFGenerator.generate(invoice, input);

    // 8. 永続化
    await this.invoiceRepository.save(invoice);

    // 9. ドメインイベント発行
    await this.eventBus.publish(event);

    // 10. BC-007通知: クライアントへメール送信
    await this.sendInvoiceToClient(invoice, pdfUrl, input.clientId);

    return invoice;
  }

  // 入金消込処理
  async recordPayment(
    invoiceId: string,
    paymentInput: PaymentInput,
    userId: string
  ): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findById(invoiceId);

    const payment = new Payment(
      generateId('pmt-'),
      new Money(
        new Decimal(paymentInput.amount.value),
        paymentInput.amount.currency
      ),
      paymentInput.paymentDate,
      paymentInput.paymentMethod,
      paymentInput.transactionReference
    );

    const event = invoice.recordPayment(payment);

    await this.invoiceRepository.save(invoice);
    await this.eventBus.publish(event);

    // 完済の場合、BC-007通知
    if (invoice.paymentStatus === 'PAID') {
      await this.notificationService.send({
        type: 'INVOICE_PAID',
        recipients: ['finance-team@example.com'],
        data: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          paidAmount: invoice.totalAmount
        }
      });
    }

    return invoice;
  }
}

// Aging Analysis Service
class AgingAnalysisService {
  async generateAgingReport(
    asOfDate: Date = new Date()
  ): Promise<AgingReport> {
    const unpaidInvoices = await this.invoiceRepository
      .findByPaymentStatus(['PENDING', 'PARTIALLY_PAID']);

    // エイジング区分別集計（Decimal.js使用）
    const agingBuckets = {
      current: new Decimal(0),
      days1_30: new Decimal(0),
      days31_60: new Decimal(0),
      days61_90: new Decimal(0),
      over90: new Decimal(0)
    };

    unpaidInvoices.forEach(invoice => {
      const category = invoice.getAgingCategory();
      const outstanding = invoice.calculateOutstandingAmount();

      switch (category) {
        case 'CURRENT':
          agingBuckets.current = agingBuckets.current.plus(outstanding.value);
          break;
        case '1_30_DAYS':
          agingBuckets.days1_30 = agingBuckets.days1_30.plus(outstanding.value);
          break;
        case '31_60_DAYS':
          agingBuckets.days31_60 = agingBuckets.days31_60.plus(outstanding.value);
          break;
        case '61_90_DAYS':
          agingBuckets.days61_90 = agingBuckets.days61_90.plus(outstanding.value);
          break;
        case 'OVER_90_DAYS':
          agingBuckets.over90 = agingBuckets.over90.plus(outstanding.value);
          break;
      }
    });

    const totalOutstanding = Object.values(agingBuckets)
      .reduce((sum, amount) => sum.plus(amount), new Decimal(0));

    return new AgingReport(asOfDate, agingBuckets, totalOutstanding);
  }
}
```

### BC統合連携

#### BC-001: Project Management連携
```typescript
// プロジェクト契約情報取得
const project = await projectService.getProject(projectId);
const contractInfo = project.contract;

// 請求可能性検証
if (!contractInfo.isActive) {
  throw new BusinessRuleViolationError('契約が有効ではありません');
}
```

#### BC-007: Notification連携
```typescript
// 請求書発行通知（クライアントへ）
await notificationService.send({
  type: 'INVOICE_ISSUED',
  recipients: [clientEmail],
  data: {
    invoiceNumber,
    totalAmount,
    dueDate,
    pdfUrl
  },
  attachments: [{ url: pdfUrl, filename: `${invoiceNumber}.pdf` }]
});

// 支払期限リマインダー（自動スケジュール）
await notificationService.scheduleReminders(invoice.reminderSchedule);
```

### トランザクション境界

```typescript
async issueInvoiceTransaction(
  input: IssueInvoiceInput,
  userId: string
): Promise<Invoice> {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Invoice作成
    const invoice = await tx.invoice.create({ data: invoiceData });

    // 2. 明細作成
    await tx.invoiceItem.createMany({
      data: input.invoiceItems.map(item => ({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount
      }))
    });

    // 3. Revenue更新（請求済みフラグ）
    await tx.revenue.update({
      where: { id: input.revenueId },
      data: { invoiced: true, invoiceId: invoice.id }
    });

    // 4. 監査ログ記録
    await tx.auditLog.create({
      data: {
        action: 'INVOICE_ISSUED',
        entityType: 'Invoice',
        entityId: invoice.id,
        userId,
        changes: { invoiceNumber, totalAmount: input.totalAmount }
      }
    });

    return invoice;
  });
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

| コード | 分類 | 重大度 | リトライ | 説明 |
|--------|------|--------|---------|------|
| ERR_BC002_L3003_OP003_001 | バリデーション | ERROR | × | 請求金額不一致 |
| ERR_BC002_L3003_OP003_002 | 整合性 | ERROR | × | 請求書重複発行 |
| ERR_BC002_L3003_OP003_003 | ビジネスルール | ERROR | × | 収益未認識 |
| ERR_BC002_L3003_OP003_004 | 計算エラー | ERROR | × | 税額計算エラー |
| ERR_BC002_L3003_OP003_005 | システム | CRITICAL | ○ | PDF生成失敗 |
| ERR_BC002_L3003_OP003_006 | システム | WARNING | ○ | メール送信失敗 |

### リトライ戦略

#### PDF生成失敗時のリトライ
```typescript
const retryConfig = {
  maxRetries: 3,
  backoff: 'exponential',
  retryableErrors: ['ERR_BC002_L3003_OP003_005', 'PDF_GENERATION_TIMEOUT']
};

async function generateInvoicePDFWithRetry(
  invoice: Invoice,
  input: IssueInvoiceInput
): Promise<string> {
  for (let attempt = 0; attempt < retryConfig.maxRetries; attempt++) {
    try {
      return await pdfGenerator.generate(invoice, input);
    } catch (error) {
      if (attempt === retryConfig.maxRetries - 1) {
        // 最終リトライ失敗: 手動生成フラグ設定
        await invoiceRepository.update(invoice.id, {
          pdfGenerationFailed: true,
          manualPDFRequired: true
        });
        throw error;
      }

      const delay = Math.pow(2, attempt) * 1000;
      await sleep(delay);
    }
  }
}
```

### 財務コンプライアンス注意事項

1. **請求書番号の連番管理**
   - 欠番・重複の禁止
   - 年度・月単位の連番体系
   - 監査証跡として連番記録必須

2. **税額計算の精度**
   - Decimal.js使用による精密計算
   - 端数処理ルールの明確化（四捨五入/切り上げ/切り捨て）
   - インボイス制度対応（2023年10月～）

3. **データ保管期間（会計法準拠）**
   - 請求書データ: 10年間保管必須
   - PDF原本: 10年間保管必須
   - 入金記録: 10年間保管必須

4. **印紙税対応**
   - ¥50,000以上の請求書: 印紙税課税対象
   - 電子請求書: 印紙税非課税（電子帳簿保存法対応）

5. **債権管理プロセス**
   - エイジング分析: 月次実施必須
   - 90日超過債権: エスカレーション必須
   - 貸倒引当金設定: 180日超過債権

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
> - [services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/issue-invoice-and-manage-collection/](../../../../../../../services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/issue-invoice-and-manage-collection/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
