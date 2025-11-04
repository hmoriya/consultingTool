# OP-002: 予算を承認し確定する

**作成日**: 2025-10-31
**所属L3**: L3-001-budget-planning-and-control: Budget Planning And Control
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/approve-and-finalize-budget

---

## 📋 How: この操作の定義

### 操作の概要
策定された予算案を経営層が審査・承認し、正式な予算として確定する。承認プロセスを通じて財務計画の妥当性を検証し、組織全体の合意を形成する。

### 実現する機能
- 予算案の審査とレビュー
- 承認ワークフローの実行
- 承認者によるコメントと修正要求
- 予算の確定と公開

### 入力
- 策定された予算案
- 承認者の権限情報
- 審査コメントと判定
- 修正要求（必要に応じて）

### 出力
- 承認済み予算（確定版）
- 承認履歴とコメント
- 予算確定通知
- 公開された予算情報

---

## 📥 入力パラメータ

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| budgetId | UUID | Yes | - | UUID形式、予算存在確認 | 承認対象予算ID |
| approvalAction | ENUM | Yes | - | APPROVE/REJECT/REQUEST_REVISION | 承認アクション |
| approverId | UUID | Yes | - | UUID形式、承認者権限確認 | 承認者ID |
| comments | TEXT | No | - | 最大1000文字 | 承認コメント |
| revisionRequests | ARRAY | Conditional | - | approvalAction=REQUEST_REVISION時必須 | 修正要求項目 |
| revisionRequests[].itemId | UUID | Yes | - | 予算項目ID | 修正対象項目 |
| revisionRequests[].requestedChange | TEXT | Yes | - | 最大500文字 | 修正内容 |
| approvalLevel | INTEGER | Yes | - | 1-5、承認階層レベル | 承認レベル |

### バリデーションルール
1. **承認権限確認**: approverId が当該approvalLevelの承認権限を保有すること
2. **予算ステータス**: Budget.status が PENDING_APPROVAL または REVISION_REQUESTED であること
3. **承認順序**: approvalLevel が現在の承認ステップと一致すること
4. **修正要求**: REQUEST_REVISION時はrevisionRequestsが必須

## 📤 出力仕様

### 成功レスポンス（承認時）
**HTTP 200 OK**
```json
{
  "budgetId": "uuid",
  "status": "APPROVED",
  "approvedAt": "2025-11-04T15:30:00Z",
  "approvedBy": "uuid",
  "approvalLevel": 3,
  "finalizedAmount": "10000000.00",
  "nextAction": "BUDGET_FINALIZED"
}
```

### 成功レスポンス（差戻し時）
**HTTP 200 OK**
```json
{
  "budgetId": "uuid",
  "status": "REVISION_REQUESTED",
  "requestedAt": "2025-11-04T15:30:00Z",
  "requestedBy": "uuid",
  "revisionRequests": [
    {
      "itemId": "uuid",
      "requestedChange": "人件費を10%削減してください"
    }
  ],
  "nextAction": "AWAITING_REVISION"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC002_L3001_OP002_001**: 無効な承認アクション
- **ERR_BC002_L3001_OP002_002**: 修正要求が空（REQUEST_REVISION時）

#### HTTP 401 Unauthorized
- **ERR_BC002_L3001_OP002_401**: 認証トークン無効

#### HTTP 403 Forbidden
- **ERR_BC002_L3001_OP002_403**: 承認権限なし（approvalLevel不一致）
- **ERR_BC002_L3001_OP002_004**: 承認順序違反（前段階未承認）

#### HTTP 404 Not Found
- **ERR_BC002_L3001_OP002_404**: 予算が存在しない

#### HTTP 409 Conflict
- **ERR_BC002_L3001_OP002_409**: 予算が既に承認済み/却下済み

#### HTTP 500 Internal Server Error
- **ERR_BC002_L3001_OP002_500**: システムエラー

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Budget Aggregate**: 参照 [../../../../domain/README.md](../../../../domain/README.md)
  - 集約ルート: Budget
  - 包含エンティティ: ApprovalHistory, RevisionRequest
  - 値オブジェクト: ApprovalLevel, ApprovalDecision
  - 不変条件: 承認順序の厳守、承認後の金額変更不可

#### ドメインメソッド
```typescript
// 承認処理
const budget = await budgetRepository.findById(budgetId);
budget.approve({
  approverId,
  approvalLevel,
  comments,
  approvedAt: new Date()
});

// 差戻し処理
budget.requestRevision({
  requesterId: approverId,
  revisionRequests,
  requestedAt: new Date()
});

// 承認完了判定
if (budget.isFullyApproved()) {
  budget.finalize();
}
```

### トランザクション境界
- **開始**: リクエスト受信時
- **コミット**: 承認処理完了 + イベント発行完了時
- **ロールバック**: 権限エラー時、承認順序違反時

### 副作用
- **ドメインイベント発行**: `BudgetApproved`, `BudgetFinalized`, `BudgetRevisionRequested`
- **BC間連携**:
  - BC-003: 承認者権限再確認、ApprovalHistory記録
  - BC-007: 承認通知（承認/差戻し結果を予算作成者へ）

### 実装手順
1. **予算取得**: budgetId で Budget集約を取得
2. **ステータス確認**: PENDING_APPROVAL または REVISION_REQUESTED であることを確認
3. **承認者権限確認**: approverIdが approvalLevel の承認権限を保有することを確認（BC-003連携）
4. **承認順序確認**: approvalLevel が現在の承認ステップと一致することを確認
5. **承認/差戻し実行**: approvalAction に応じた処理
6. **承認完了判定**: 全承認レベルクリア時、Budget.finalize() 実行
7. **イベント発行**: BudgetApproved/BudgetRevisionRequested
8. **通知配信**: BC-007経由で関係者へ通知
9. **トランザクションコミット**: DB永続化

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 | 対処方法 |
|--------|---------------|------|-------------|----------|
| ERR_BC002_L3001_OP002_001 | 400 | 無効な承認アクション | No | APPROVE/REJECT/REQUEST_REVISIONのいずれかを指定 |
| ERR_BC002_L3001_OP002_002 | 400 | 修正要求が空 | No | revisionRequestsを指定 |
| ERR_BC002_L3001_OP002_401 | 401 | 認証エラー | No | 再ログイン |
| ERR_BC002_L3001_OP002_403 | 403 | 承認権限なし | No | 適切な承認レベルの承認者に依頼 |
| ERR_BC002_L3001_OP002_004 | 403 | 承認順序違反 | No | 前段階の承認完了を待つ |
| ERR_BC002_L3001_OP002_404 | 404 | 予算不存在 | No | 有効な予算IDを指定 |
| ERR_BC002_L3001_OP002_409 | 409 | 既に処理済み | No | 最新ステータスを確認 |
| ERR_BC002_L3001_OP002_500 | 500 | システムエラー | Yes | 管理者に連絡 |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC002_L3001_OP002_500（システムエラーのみ）
- **リトライ回数**: 3回
- **バックオフ**: Exponential (1s, 2s, 4s)
- **タイムアウト**: 各リクエスト30秒

### ロールバック手順
1. **ApprovalHistory削除**: 記録した承認履歴の削除
2. **ステータス復元**: Budget.statusを前の状態に戻す
3. **イベント補償**: ApprovalCancelled イベント発行
4. **監査ログ記録**: ロールバック理由と詳細を記録

### ログ記録要件
- **INFO**: 承認成功時（budgetId, approverId, approvalLevel, action）
- **WARN**: 承認順序違反警告時
- **ERROR**: エラー発生時（エラーコード、スタックトレース）
- **AUDIT**: 全承認操作（承認/差戻し/却下）の完全な監査証跡

### 承認プロセス特有の注意事項
- **多段階承認**: 金額に応じた承認レベル（例: 1000万円以上は経営層承認必須）
- **権限厳格化**: 承認者は予算作成者と異なる必要（職務分離）
- **タイムスタンプ精度**: 承認日時は法的証拠となる（ミリ秒精度必須）
- **監査証跡**: すべての承認アクションを永続的に記録（削除不可）

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
> - [services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/approve-and-finalize-budget/](../../../../../../../services/revenue-optimization-service/capabilities/formulate-and-control-budget/operations/approve-and-finalize-budget/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
