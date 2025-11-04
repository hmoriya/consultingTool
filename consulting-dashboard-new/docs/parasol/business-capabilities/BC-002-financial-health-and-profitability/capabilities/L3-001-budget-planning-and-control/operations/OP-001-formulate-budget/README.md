# OP-001: 予算を策定する

**作成日**: 2025-10-31
**所属L3**: L3-001-budget-planning-and-control: Budget Planning And Control
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/formulate-budget

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトおよび組織全体の予算を策定し、財務計画の基盤を構築する。事業目標と整合した予算配分を実現し、収益性の最適化を支援する。

### 実現する機能
- プロジェクト別・部門別予算案の作成
- 過去実績データに基づく予算見積もり
- リソースコストと案件収益の予測
- 予算項目の分類と配分計画

### 入力
- 事業計画と目標収益
- 過去の実績データ（収益・コスト）
- プロジェクト計画情報
- リソース配置計画

### 出力
- 予算案（プロジェクト別・部門別）
- 予算配分計画書
- 予算根拠資料
- 承認待ちステータス

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| fiscalYear | INTEGER | Yes | - | YYYY形式、現在年度±3年以内 | 会計年度 |
| budgetType | ENUM | Yes | - | PROJECT/DEPARTMENT/ORGANIZATION | 予算種別 |
| targetId | UUID | Yes | - | UUID形式、対象エンティティ存在確認 | 対象ID（プロジェクト/部門/組織） |
| totalAmount | DECIMAL | Yes | - | > 0、Decimal.js使用 | 総予算額 |
| currency | STRING | Yes | JPY | ISO 4217通貨コード | 通貨 |
| budgetItems | ARRAY | Yes | - | 最低1項目、合計=totalAmount | 予算項目配列 |
| budgetItems[].category | ENUM | Yes | - | PERSONNEL/EQUIPMENT/OUTSOURCING/OTHER | 費目カテゴリ |
| budgetItems[].amount | DECIMAL | Yes | - | > 0、Decimal.js使用 | 項目金額 |
| budgetItems[].description | STRING | No | - | 最大500文字 | 項目説明 |
| approvalWorkflow | ENUM | No | STANDARD | STANDARD/FAST_TRACK/EXECUTIVE | 承認フロー種別 |
| notes | TEXT | No | - | 最大2000文字 | 備考 |

### バリデーションルール
1. **金額整合性**: budgetItems の合計が totalAmount と一致すること
2. **通貨一貫性**: すべての金額項目で同一通貨を使用すること
3. **権限確認**: budgetType に応じた作成権限を保有すること
4. **年度妥当性**: 過去予算の修正は特別権限が必要

## 📤 出力仕様

### 成功レスポンス
**HTTP 201 Created**
```json
{
  "budgetId": "uuid",
  "fiscalYear": 2025,
  "budgetType": "PROJECT",
  "targetId": "uuid",
  "totalAmount": "10000000.00",
  "currency": "JPY",
  "status": "DRAFT",
  "approvalWorkflow": "STANDARD",
  "createdAt": "2025-11-04T10:00:00Z",
  "createdBy": "uuid",
  "nextApprover": "uuid"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC002_L3001_OP001_001**: 予算項目合計不一致（budgetItems合計 ≠ totalAmount）
- **ERR_BC002_L3001_OP001_002**: 無効な会計年度（範囲外）
- **ERR_BC002_L3001_OP001_003**: 通貨コード不正（ISO 4217違反）

#### HTTP 401 Unauthorized
- **ERR_BC002_L3001_OP001_401**: 認証トークン無効または期限切れ

#### HTTP 403 Forbidden
- **ERR_BC002_L3001_OP001_403**: 予算策定権限なし（budgetType別権限不足）

#### HTTP 404 Not Found
- **ERR_BC002_L3001_OP001_404**: 対象エンティティ（プロジェクト/部門）が存在しない

#### HTTP 409 Conflict
- **ERR_BC002_L3001_OP001_409**: 同一年度の予算が既に存在（重複作成禁止）

#### HTTP 500 Internal Server Error
- **ERR_BC002_L3001_OP001_500**: システムエラー（Decimal.js演算エラー等）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Budget Aggregate**: 参照 [../../../../domain/README.md](../../../../domain/README.md)
  - 集約ルート: Budget
  - 包含エンティティ: BudgetItem, ApprovalHistory
  - 値オブジェクト: Money (Decimal.js), FiscalYear
  - 不変条件: 予算項目合計 = 総予算額

#### ドメインメソッド
```typescript
// 予算策定（Decimal.js使用）
const budget = Budget.create({
  fiscalYear: new FiscalYear(2025),
  budgetType: BudgetType.PROJECT,
  totalAmount: new Money(new Decimal('10000000.00'), 'JPY'),
  items: budgetItems.map(item => new BudgetItem(item))
});

// 金額整合性検証
budget.validateTotalAmount(); // throws if mismatch
```

### トランザクション境界
- **開始**: リクエスト受信時
- **コミット**: Budget作成 + ApprovalWorkflow開始完了時
- **ロールバック**: バリデーションエラー時、承認フロー開始失敗時

### 副作用
- **ドメインイベント発行**: `BudgetDrafted`, `ApprovalRequested`
- **BC間連携**:
  - BC-001: プロジェクト情報取得（予算対象確認）
  - BC-003: 承認者権限確認、承認ワークフロー開始
  - BC-005: リソースコスト見積もり連携
  - BC-007: 予算策定通知配信（承認者へ）

### 実装手順
1. **ターゲット確認**: targetId に対応するプロジェクト/部門の存在確認
2. **重複チェック**: 同一年度予算の存在確認
3. **権限検証**: budgetType別の作成権限確認（BC-003連携）
4. **金額検証**: Decimal.js による高精度計算で合計検証
5. **Budget集約作成**: 不変条件検証含む
6. **承認フロー開始**: ApprovalWorkflow エンティティ作成
7. **イベント発行**: BudgetDrafted, ApprovalRequested
8. **通知配信**: BC-007経由で承認者へ通知
9. **トランザクションコミット**: DB永続化

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 | 対処方法 |
|--------|---------------|------|-------------|----------|
| ERR_BC002_L3001_OP001_001 | 400 | 予算項目合計不一致 | No | 項目金額を再計算 |
| ERR_BC002_L3001_OP001_002 | 400 | 無効な会計年度 | No | 年度を現在±3年以内に修正 |
| ERR_BC002_L3001_OP001_003 | 400 | 通貨コード不正 | No | ISO 4217準拠通貨を指定 |
| ERR_BC002_L3001_OP001_401 | 401 | 認証エラー | No | 再ログイン |
| ERR_BC002_L3001_OP001_403 | 403 | 権限不足 | No | 予算策定権限を申請 |
| ERR_BC002_L3001_OP001_404 | 404 | 対象不存在 | No | 有効なプロジェクト/部門を選択 |
| ERR_BC002_L3001_OP001_409 | 409 | 重複予算 | No | 既存予算を修正または削除 |
| ERR_BC002_L3001_OP001_500 | 500 | システムエラー | Yes | 管理者に連絡 |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC002_L3001_OP001_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (1s, 2s, 4s)
- **タイムアウト**: 各リクエスト30秒

### ロールバック手順
1. **Budget集約削除**: 作成途中のBudgetレコード削除
2. **ApprovalWorkflow削除**: 開始した承認フロー取り消し
3. **イベント補償**: BudgetDraftCancelled イベント発行
4. **監査ログ記録**: エラー内容と原因を詳細記録

### ログ記録要件
- **INFO**: 予算策定成功時（budgetId, fiscalYear, totalAmount, 作成者）
- **WARN**: 金額不一致警告時（計算結果差分）
- **ERROR**: エラー発生時（エラーコード、スタックトレース、入力パラメータ）
- **AUDIT**: 全予算策定操作（成功/失敗問わず、誰が・いつ・何を・結果）

### 財務データ特有の注意事項
- **Decimal.js必須**: JavaScript のnumber型では精度不足（浮動小数点誤差）
- **通貨換算**: 複数通貨対応時は為替レート管理必須
- **監査要件**: 予算データは法的証拠となる可能性（完全な監査ログ必須）
- **承認フロー**: 金額に応じた多段階承認（STANDARD/FAST_TRACK/EXECUTIVE）

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
> - [services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/formulate-budget/](../../../../../../../services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/formulate-budget/)
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
