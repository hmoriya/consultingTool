# OP-001: コストを記録し分類する

**作成日**: 2025-10-31
**所属L3**: L3-002-cost-management-and-optimization: Cost Management And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/record-and-categorize-costs

---

## 📋 How: この操作の定義

### 操作の概要
発生したコストを正確に記録し、適切なカテゴリに分類する。コストの可視化と分析の基盤を構築し、コスト管理の最適化を支援する。

### 実現する機能
- コスト発生の記録と登録
- コストカテゴリの分類（人件費、外注費、経費等）
- プロジェクト・部門への配賦
- コストデータの検証と確認

### 入力
- コスト発生情報（金額、日付、内容）
- コストカテゴリ情報
- プロジェクト・部門の紐付け情報
- 承認者情報

### 出力
- 記録されたコストデータ
- カテゴリ別コスト集計
- プロジェクト別コスト配賦
- コスト記録履歴

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| costName | STRING | Yes | - | 最大200文字 | コスト名称 |
| amount | DECIMAL | Yes | - | > 0、Decimal.js使用 | コスト金額 |
| currency | STRING | Yes | JPY | ISO 4217通貨コード | 通貨 |
| category | ENUM | Yes | - | PERSONNEL/EQUIPMENT/OUTSOURCING/OTHER | コストカテゴリ |
| subcategory | STRING | No | - | 最大100文字 | サブカテゴリ |
| occurredDate | DATE | Yes | - | YYYY-MM-DD形式、未来日不可 | 発生日 |
| projectId | UUID | Conditional | - | category=PERSONNELまたはOUTSOURCING時必須 | プロジェクトID |
| budgetItemId | UUID | Yes | - | 有効な承認済み予算項目ID | 配賦先予算項目ID |
| vendor | STRING | Conditional | - | category=OUTSOURCINGまたはEQUIPMENT時推奨 | 仕入先・ベンダー名 |
| description | TEXT | No | - | 最大1000文字 | コスト詳細説明 |
| approvalAmount | DECIMAL | No | - | >= amount | 承認必要金額閾値 |
| attachments | ARRAY | No | - | 最大10ファイル | 証憑書類（請求書、領収書等） |

### バリデーションルール
1. **予算項目確認**: budgetItemId の予算がAPPROVED状態であること
2. **プロジェクト確認**: projectId が有効なプロジェクト（BC-001）であること
3. **金額妥当性**: amount > 0
4. **発生日**: occurredDate ≤ 今日（未来日不可）
5. **予算残高**: 予算項目の未消化額 ≥ amount

## 📤 出力仕様

### 成功レスポンス
**HTTP 201 Created**
```json
{
  "costId": "uuid",
  "costName": "開発外注費（機能A）",
  "amount": "1500000.00",
  "currency": "JPY",
  "category": "OUTSOURCING",
  "occurredDate": "2025-11-04",
  "projectId": "uuid",
  "budgetItemId": "uuid",
  "allocatedToBudget": {
    "budgetId": "uuid",
    "budgetItemCategory": "OUTSOURCING",
    "remainingBudget": "3500000.00"
  },
  "approvalStatus": "APPROVED",
  "createdAt": "2025-11-04T10:00:00Z",
  "createdBy": "uuid"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC002_L3002_OP001_001**: コストカテゴリ不正
- **ERR_BC002_L3002_OP001_002**: 発生日が未来日
- **ERR_BC002_L3002_OP001_003**: 金額がゼロまたは負数

#### HTTP 401 Unauthorized
- **ERR_BC002_L3002_OP001_401**: 認証トークン無効

#### HTTP 403 Forbidden
- **ERR_BC002_L3002_OP001_403**: コスト記録権限なし

#### HTTP 404 Not Found
- **ERR_BC002_L3002_OP001_404**: プロジェクトまたは予算項目が存在しない

#### HTTP 409 Conflict
- **ERR_BC002_L3002_OP001_409**: 予算項目残高不足

#### HTTP 500 Internal Server Error
- **ERR_BC002_L3002_OP001_500**: システムエラー

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Cost Aggregate**: 参照 [../../../../domain/README.md](../../../../domain/README.md)
  - 集約ルート: Cost
  - 包含エンティティ: CostItem, CostAllocation
  - 値オブジェクト: Money (Decimal.js), CostCategory
  - 不変条件: 金額 > 0、予算項目に紐付け必須

#### ドメインメソッド
```typescript
// コスト記録（Decimal.js使用）
const cost = Cost.create({
  name: costName,
  amount: new Money(new Decimal(amount), currency),
  category: new CostCategory(category),
  occurredDate: new Date(occurredDate),
  projectId,
  budgetItemId
});

// 予算配賦
const budget = await budgetRepository.findById(budgetItemId);
budget.allocateCost(cost);
```

### トランザクション境界
- **開始**: リクエスト受信時
- **コミット**: Cost作成 + Budget消化額更新完了時
- **ロールバック**: 予算残高不足時、承認失敗時

### 副作用
- **ドメインイベント発行**: `CostRecorded`, `BudgetConsumed`
- **BC間連携**:
  - BC-001: プロジェクトコスト累計更新
  - BC-003: 承認ワークフロー開始（高額コスト時）
  - BC-007: コスト記録通知配信

### 実装手順
1. **プロジェクト確認**: projectId の有効性確認（BC-001連携）
2. **予算項目確認**: budgetItemId の存在・ステータス確認
3. **残高確認**: 予算項目の未消化額 ≥ amount（Decimal.js使用）
4. **承認判定**: amount が承認閾値超過の場合、承認ワークフロー開始
5. **Cost作成**: Cost集約の生成
6. **予算消化**: BudgetItem.consumedAmount を更新
7. **プロジェクト更新**: プロジェクトコスト累計更新（BC-001連携）
8. **イベント発行**: CostRecorded, BudgetConsumed
9. **通知配信**: BC-007経由でプロジェクト責任者へ通知
10. **トランザクションコミット**: DB永続化

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 | 対処方法 |
|--------|---------------|------|-------------|----------|
| ERR_BC002_L3002_OP001_001 | 400 | カテゴリ不正 | No | 有効なカテゴリを指定 |
| ERR_BC002_L3002_OP001_002 | 400 | 発生日が未来日 | No | 過去または今日の日付を指定 |
| ERR_BC002_L3002_OP001_003 | 400 | 金額不正 | No | 正の金額を指定 |
| ERR_BC002_L3002_OP001_401 | 401 | 認証エラー | No | 再ログイン |
| ERR_BC002_L3002_OP001_403 | 403 | 権限不足 | No | コスト記録権限を申請 |
| ERR_BC002_L3002_OP001_404 | 404 | 対象不存在 | No | 有効なプロジェクト/予算項目を指定 |
| ERR_BC002_L3002_OP001_409 | 409 | 予算残高不足 | No | 予算項目の残高確認または予算増額申請 |
| ERR_BC002_L3002_OP001_500 | 500 | システムエラー | Yes | 管理者に連絡 |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC002_L3002_OP001_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (1s, 2s, 4s)
- **タイムアウト**: 各リクエスト30秒

### ロールバック手順
1. **Cost削除**: 作成したCostレコードを削除
2. **予算消化額復元**: BudgetItem.consumedAmountを元に戻す
3. **イベント補償**: CostRecordCancelled イベント発行
4. **監査ログ記録**: ロールバック理由を記録

### ログ記録要件
- **INFO**: コスト記録成功時（costId, amount, category, projectId）
- **WARN**: 予算残高警告時（残高 < 10%）
- **ERROR**: エラー発生時（エラーコード、スタックトレース）
- **AUDIT**: 全コスト記録操作（誰が・いつ・何を・いくら記録したか）

### コスト記録特有の注意事項
- **Decimal.js必須**: 金額計算でJavaScript number型では精度不足
- **証憑保管**: 10万円以上のコストは証憑書類必須（会計法準拠）
- **承認フロー**: 100万円以上は自動承認不可（マネージャー承認必須）
- **予算アラート**: コスト記録で予算消化率90%超過時、自動アラート発行

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
> - [services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/record-and-categorize-costs/](../../../../../../../services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/record-and-categorize-costs/)
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
