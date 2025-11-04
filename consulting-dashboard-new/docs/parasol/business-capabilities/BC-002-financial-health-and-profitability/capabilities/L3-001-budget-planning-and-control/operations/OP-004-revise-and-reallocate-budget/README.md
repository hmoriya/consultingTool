# OP-004: 予算を改訂し再配分する

**作成日**: 2025-10-31
**所属L3**: L3-001-budget-planning-and-control: Budget Planning And Control
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/revise-and-reallocate-budget

---

## 📋 How: この操作の定義

### 操作の概要
事業環境の変化や予算実績の乖離に応じて、予算を改訂し再配分する。柔軟な財務計画の調整により、変化に適応した予算管理を実現する。

### 実現する機能
- 予算改訂の必要性判定
- 予算再配分案の作成
- 改訂予算の承認ワークフロー
- 予算変更履歴の記録

### 入力
- 現行予算データ
- 予算改訂理由と根拠
- 再配分計画
- 承認者の権限情報

### 出力
- 改訂予算案
- 予算変更履歴
- 再配分計画書
- 関係者への通知

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| budgetId | UUID | Yes | - | UUID形式、承認済み予算存在確認 | 改訂対象予算ID |
| revisionReason | ENUM | Yes | - | BUSINESS_CHANGE/COST_OVERRUN/REVENUE_CHANGE/OTHER | 改訂理由 |
| revisionReasonDetail | TEXT | Yes | - | 最大1000文字 | 改訂理由詳細 |
| reallocationPlan | ARRAY | Yes | - | 最低1項目 | 再配分計画 |
| reallocationPlan[].fromItemId | UUID | Yes | - | 有効な予算項目ID | 配分元項目ID |
| reallocationPlan[].toItemId | UUID | Yes | - | 有効な予算項目ID | 配分先項目ID |
| reallocationPlan[].amount | DECIMAL | Yes | - | > 0、Decimal.js使用 | 再配分金額 |
| reallocationPlan[].justification | TEXT | Yes | - | 最大500文字 | 再配分理由 |
| approvalRequired | BOOLEAN | No | true | - | 承認要否フラグ |
| effectiveDate | DATE | No | 即日 | YYYY-MM-DD形式 | 改訂適用日 |

### バリデーションルール
1. **予算残高確認**: 配分元項目の未消化額 ≥ 再配分金額
2. **同一項目禁止**: fromItemId ≠ toItemId
3. **予算ステータス**: Budget.status が APPROVED であること
4. **金額整合性**: 再配分後も総予算額は不変
5. **重複防止**: 同一fromItemId→toItemIdの重複禁止

## 📤 出力仕様

### 成功レスポンス
**HTTP 200 OK**
```json
{
  "budgetId": "uuid",
  "revisionId": "uuid",
  "revisionReason": "COST_OVERRUN",
  "totalReallocationAmount": "2000000.00",
  "reallocationDetails": [
    {
      "fromItemId": "uuid",
      "fromCategory": "EQUIPMENT",
      "toItemId": "uuid",
      "toCategory": "PERSONNEL",
      "amount": "2000000.00",
      "previousBalance": "5000000.00",
      "newBalance": "3000000.00"
    }
  ],
  "approvalStatus": "PENDING_APPROVAL",
  "effectiveDate": "2025-11-04",
  "revisedAt": "2025-11-04T10:00:00Z",
  "revisedBy": "uuid"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC002_L3001_OP004_001**: 配分元残高不足
- **ERR_BC002_L3001_OP004_002**: 同一項目間の再配分禁止
- **ERR_BC002_L3001_OP004_003**: 再配分計画が空

#### HTTP 401 Unauthorized
- **ERR_BC002_L3001_OP004_401**: 認証トークン無効

#### HTTP 403 Forbidden
- **ERR_BC002_L3001_OP004_403**: 予算改訂権限なし

#### HTTP 404 Not Found
- **ERR_BC002_L3001_OP004_404**: 予算または予算項目が存在しない

#### HTTP 409 Conflict
- **ERR_BC002_L3001_OP004_409**: 予算が未承認（改訂不可）

#### HTTP 500 Internal Server Error
- **ERR_BC002_L3001_OP004_500**: システムエラー

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Budget Aggregate**: 参照 [../../../../domain/README.md](../../../../domain/README.md)
  - 集約ルート: Budget
  - 包含エンティティ: BudgetItem, BudgetAllocation, RevisionHistory
  - 値オブジェクト: Money (Decimal.js), ReallocationPlan
  - 不変条件: 総予算額不変、配分元残高 ≥ 再配分額

#### ドメインメソッド
```typescript
// 予算再配分（Decimal.js使用）
const budget = await budgetRepository.findById(budgetId);
const reallocation = budget.reallocate({
  plan: reallocationPlan.map(p => new ReallocationItem(p)),
  reason: revisionReason,
  reasonDetail: revisionReasonDetail,
  effectiveDate: new Date(effectiveDate)
});

// 承認必要性判定
if (reallocation.requiresApproval()) {
  await approvalWorkflowService.startApproval(reallocation);
}
```

### トランザクション境界
- **開始**: リクエスト受信時
- **コミット**: 予算再配分完了 + 承認ワークフロー開始完了時
- **ロールバック**: 残高不足時、承認ワークフロー開始失敗時

### 副作用
- **ドメインイベント発行**: `BudgetReallocated`, `ApprovalRequested`
- **BC間連携**:
  - BC-001: 影響を受けるプロジェクト予算への通知
  - BC-003: 承認ワークフロー開始
  - BC-007: 予算変更通知配信（関係者へ）

### 実装手順
1. **予算取得**: budgetId で Budget集約を取得
2. **ステータス確認**: Budget.status が APPROVED であることを確認
3. **権限確認**: 予算改訂権限の保有確認（BC-003連携）
4. **残高検証**: 各配分元項目の未消化額確認（Decimal.js使用）
5. **再配分実行**: BudgetItem間で金額を移動
6. **履歴記録**: RevisionHistory に改訂履歴を追加
7. **承認判定**: 承認必要性を判定
8. **承認開始**: 必要時、承認ワークフロー開始（BC-003連携）
9. **イベント発行**: BudgetReallocated, ApprovalRequested
10. **通知配信**: BC-007経由で関係者へ通知
11. **トランザクションコミット**: DB永続化

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 | 対処方法 |
|--------|---------------|------|-------------|----------|
| ERR_BC002_L3001_OP004_001 | 400 | 配分元残高不足 | No | 未消化額を確認し金額調整 |
| ERR_BC002_L3001_OP004_002 | 400 | 同一項目間再配分 | No | 異なる項目を指定 |
| ERR_BC002_L3001_OP004_003 | 400 | 再配分計画が空 | No | 再配分項目を追加 |
| ERR_BC002_L3001_OP004_401 | 401 | 認証エラー | No | 再ログイン |
| ERR_BC002_L3001_OP004_403 | 403 | 権限不足 | No | 予算改訂権限を申請 |
| ERR_BC002_L3001_OP004_404 | 404 | 予算/項目不存在 | No | 有効なIDを指定 |
| ERR_BC002_L3001_OP004_409 | 409 | 予算未承認 | No | 予算承認後に改訂 |
| ERR_BC002_L3001_OP004_500 | 500 | システムエラー | Yes | 管理者に連絡 |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC002_L3001_OP004_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (1s, 2s, 4s)
- **タイムアウト**: 各リクエスト30秒

### ロールバック手順
1. **BudgetItem復元**: 再配分前の金額に戻す
2. **RevisionHistory削除**: 記録した改訂履歴を削除
3. **イベント補償**: BudgetReallocationCancelled イベント発行
4. **監査ログ記録**: ロールバック理由と詳細を記録

### ログ記録要件
- **INFO**: 予算再配分成功時（budgetId, totalAmount, 項目数）
- **WARN**: 大規模再配分警告時（総額が予算の30%超）
- **ERROR**: エラー発生時（エラーコード、スタックトレース）
- **AUDIT**: 全予算改訂操作（誰が・いつ・何を・いくら再配分したか）

### 予算改訂特有の注意事項
- **承認プロセス**: 大規模再配分（総額30%超）は経営層承認必須
- **適用タイミング**: effectiveDateを過去に設定不可（監査証跡の整合性）
- **変更履歴**: 全改訂履歴を永続的に保持（10年間保管、会計法準拠）
- **影響通知**: 予算変更の影響を受けるプロジェクトへ自動通知

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
> - [services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/revise-and-reallocate-budget/](../../../../../../../services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/revise-and-reallocate-budget/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-004 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
