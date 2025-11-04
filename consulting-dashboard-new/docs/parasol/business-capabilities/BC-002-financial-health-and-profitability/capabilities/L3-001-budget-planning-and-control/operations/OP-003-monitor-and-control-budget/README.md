# OP-003: 予算を監視し統制する

**作成日**: 2025-10-31
**所属L3**: L3-001-budget-planning-and-control: Budget Planning And Control
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/monitor-and-control-budget

---

## 📋 How: この操作の定義

### 操作の概要
確定した予算に対する実績を継続的に監視し、予算超過や未達成を早期に検知する。予算執行状況を可視化し、適切な財務統制を実現する。

### 実現する機能
- 予算実績の継続的な追跡
- 予算差異分析（予算vs実績）
- 予算超過アラートの発生
- 予算消化率のダッシュボード表示

### 入力
- 確定予算データ
- 実績データ（収益・コスト）
- 監視期間の指定
- アラート閾値設定

### 出力
- 予算実績レポート
- 予算差異分析結果
- 予算超過アラート
- 予算消化率レポート

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| budgetId | UUID | Yes | - | UUID形式、承認済み予算存在確認 | 監視対象予算ID |
| monitoringPeriod | OBJECT | Yes | - | 開始日 < 終了日 | 監視期間 |
| monitoringPeriod.startDate | DATE | Yes | - | YYYY-MM-DD形式 | 監視開始日 |
| monitoringPeriod.endDate | DATE | Yes | - | YYYY-MM-DD形式 | 監視終了日 |
| thresholds | OBJECT | No | 既定値 | 0 < 値 ≤ 100 | アラート閾値 |
| thresholds.warningThreshold | DECIMAL | No | 70.0 | Percentage (0-100) | 警告閾値（消化率%） |
| thresholds.criticalThreshold | DECIMAL | No | 90.0 | Percentage (0-100) | 重大警告閾値（消化率%） |
| thresholds.emergencyThreshold | DECIMAL | No | 100.0 | Percentage (0-100) | 緊急警告閾値（消化率%） |
| includeCategories | ARRAY | No | ALL | PERSONNEL/EQUIPMENT/OUTSOURCING/OTHER | 監視対象カテゴリ |
| notificationSettings | OBJECT | No | - | - | 通知設定 |
| notificationSettings.enabled | BOOLEAN | No | true | - | 通知有効化フラグ |
| notificationSettings.recipients | ARRAY | Conditional | - | enabled=true時必須、有効なユーザーID | 通知受信者リスト |

### バリデーションルール
1. **期間妥当性**: monitoringPeriod.startDate < monitoringPeriod.endDate
2. **予算ステータス**: Budget.status が APPROVED であること
3. **閾値順序**: warningThreshold < criticalThreshold ≤ emergencyThreshold
4. **会計年度整合性**: 監視期間が予算の会計年度内であること

## 📤 出力仕様

### 成功レスポンス
**HTTP 200 OK**
```json
{
  "budgetId": "uuid",
  "fiscalYear": 2025,
  "monitoringPeriod": {
    "startDate": "2025-04-01",
    "endDate": "2025-06-30"
  },
  "budgetSummary": {
    "totalBudget": "10000000.00",
    "consumedAmount": "7500000.00",
    "remainingAmount": "2500000.00",
    "consumptionRate": 75.0,
    "currency": "JPY"
  },
  "categoryBreakdown": [
    {
      "category": "PERSONNEL",
      "budgeted": "5000000.00",
      "consumed": "4000000.00",
      "remaining": "1000000.00",
      "consumptionRate": 80.0
    }
  ],
  "alerts": [
    {
      "alertType": "CRITICAL",
      "category": "PERSONNEL",
      "consumptionRate": 90.5,
      "threshold": 90.0,
      "message": "人件費予算が90%を超過しました"
    }
  ],
  "generatedAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC002_L3001_OP003_001**: 監視期間不正（開始日 ≥ 終了日）
- **ERR_BC002_L3001_OP003_002**: 閾値設定不正（順序違反）
- **ERR_BC002_L3001_OP003_003**: 監視期間が会計年度外

#### HTTP 401 Unauthorized
- **ERR_BC002_L3001_OP003_401**: 認証トークン無効

#### HTTP 403 Forbidden
- **ERR_BC002_L3001_OP003_403**: 予算監視権限なし

#### HTTP 404 Not Found
- **ERR_BC002_L3001_OP003_404**: 予算が存在しない

#### HTTP 409 Conflict
- **ERR_BC002_L3001_OP003_409**: 予算が未承認（ステータス不正）

#### HTTP 500 Internal Server Error
- **ERR_BC002_L3001_OP003_500**: システムエラー（集計計算エラー等）

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Budget Aggregate**: 参照 [../../../../domain/README.md](../../../../domain/README.md)
  - 集約ルート: Budget
  - 包含エンティティ: BudgetItem, BudgetAllocation
  - 値オブジェクト: Money (Decimal.js), ConsumptionRate (Percentage)
  - 不変条件: 消化額 ≤ 配分額

#### ドメインメソッド
```typescript
// 予算監視（Decimal.js使用）
const budget = await budgetRepository.findById(budgetId);
const consumptionAnalysis = budget.analyzeConsumption({
  period: new DateRange(startDate, endDate),
  thresholds: new ConsumptionThresholds(thresholds)
});

// アラート生成
const alerts = consumptionAnalysis.generateAlerts();
if (alerts.length > 0) {
  await alertService.sendAlerts(alerts, recipients);
}
```

### トランザクション境界
- **開始**: リクエスト受信時
- **コミット**: 監視レポート生成完了時
- **ロールバック**: 計算エラー時（読み取り専用のため影響最小）

### 副作用
- **ドメインイベント発行**: `BudgetThresholdExceeded` (閾値超過時)
- **BC間連携**:
  - BC-001: プロジェクト実績コスト取得
  - BC-007: 予算超過アラート通知配信

### 実装手順
1. **予算取得**: budgetId で Budget集約を取得
2. **ステータス確認**: Budget.status が APPROVED であることを確認
3. **実績データ収集**: BC-001からプロジェクト実績コスト取得
4. **消化額計算**: Decimal.js による高精度計算で消化額・消化率算出
5. **カテゴリ別分析**: 各予算項目の消化状況を分析
6. **閾値判定**: 消化率と閾値を比較してアラート生成
7. **イベント発行**: BudgetThresholdExceeded (必要時)
8. **通知配信**: BC-007経由でアラート通知（必要時）
9. **レポート生成**: 監視結果をJSON形式で返却

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 | 対処方法 |
|--------|---------------|------|-------------|----------|
| ERR_BC002_L3001_OP003_001 | 400 | 監視期間不正 | No | 開始日 < 終了日に修正 |
| ERR_BC002_L3001_OP003_002 | 400 | 閾値設定不正 | No | 閾値順序を修正 |
| ERR_BC002_L3001_OP003_003 | 400 | 監視期間が会計年度外 | No | 会計年度内の期間を指定 |
| ERR_BC002_L3001_OP003_401 | 401 | 認証エラー | No | 再ログイン |
| ERR_BC002_L3001_OP003_403 | 403 | 権限不足 | No | 予算監視権限を申請 |
| ERR_BC002_L3001_OP003_404 | 404 | 予算不存在 | No | 有効な予算IDを指定 |
| ERR_BC002_L3001_OP003_409 | 409 | 予算未承認 | No | 予算承認後に監視 |
| ERR_BC002_L3001_OP003_500 | 500 | システムエラー | Yes | 管理者に連絡 |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC002_L3001_OP003_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (1s, 2s, 4s)
- **タイムアウト**: 各リクエスト30秒

### ロールバック手順
- **読み取り専用操作**: ロールバック不要（データ変更なし）
- **イベント補償**: 誤発行アラートの取り消し通知（必要時）

### ログ記録要件
- **INFO**: 予算監視実行時（budgetId, period, 消化率）
- **WARN**: 閾値超過検出時（category, consumptionRate, threshold）
- **ERROR**: エラー発生時（エラーコード、スタックトレース）
- **AUDIT**: 全予算監視操作（誰が・いつ・どの予算を監視したか）

### 予算監視特有の注意事項
- **リアルタイム性**: 実績データは最大1時間遅延の可能性（BC-001同期頻度依存）
- **Decimal.js必須**: 消化率計算でJavaScript number型では精度不足
- **多段階アラート**: 警告(70%)→重大(90%)→緊急(100%)の3段階通知
- **監査要件**: 予算超過検出は監査対象（完全な記録必須）

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
> - [services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/monitor-and-control-budget/](../../../../../../../services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/monitor-and-control-budget/)
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
