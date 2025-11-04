# OP-001: リスクを識別し評価する

**作成日**: 2025-10-31
**所属L3**: L3-005-risk-and-issue-management: Risk And Issue Management
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: services/project-success-service/capabilities/foresee-and-handle-risks/operations/identify-and-assess-risks

---

## 📋 How: この操作の定義

### 操作の概要
リスクを識別し評価するを実行し、ビジネス価値を創出する。

### 実現する機能
- リスクを識別し評価するに必要な情報の入力と検証
- リスクを識別し評価するプロセスの実行と進捗管理
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

| パラメータ名 | 型 | 必須 | デフォルト | バリデーション | 説明 |
|-------------|-----|------|-----------|--------------|------|
| projectId | UUID | Yes | - | UUID形式 | プロジェクトID |
| riskName | STRING_200 | Yes | - | 1-200文字 | リスク名 |
| impact | STRING_20 | Yes | - | high/medium/low | 影響度 |
| probability | STRING_20 | Yes | - | high/medium/low | 発生確率 |

### バリデーションルール
1. 全UUIDパラメータ: 対応するエンティティが存在すること
2. 文字列パラメータ: 指定文字数範囲内であること
3. Enumパラメータ: 定義された値のいずれかであること

## 📤 出力仕様

### 成功レスポンス
**HTTP 200 OK** / **HTTP 201 Created**
```json
{
  "id": "uuid",
  "status": "success",
  "createdAt": "2025-11-04T10:00:00Z"
}
```

### エラーレスポンス

#### HTTP 400 Bad Request
- **ERR_BC001_L3-005_001_001**: パラメータバリデーションエラー

#### HTTP 404 Not Found
- **ERR_BC001_L3-005_001_404**: リソースが存在しません

#### HTTP 500 Internal Server Error
- **ERR_BC001_L3-005_001_500**: システムエラー

## 🛠️ 実装ガイダンス

### 使用ドメインコンポーネント

#### Aggregate
- **Risk Aggregate**: 参照 [../../../../domain/README.md](../../../../domain/README.md)
  - 主要エンティティ: Risk

#### ドメインメソッド
```typescript
// 操作実行
const entity = await repository.findById(id);
entity.execute(params);
```

### トランザクション境界
- **開始**: リクエスト受信時
- **コミット**: エンティティ更新完了時
- **ロールバック**: バリデーションエラー時

### 副作用
- **ドメインイベント発行**: `RiskIdentified, CriticalRiskDetected`
- **BC間連携**: BC-007（リスク通知・エスカレーション）

### 実装手順
1. エンティティ存在確認
2. バリデーション実行
3. ドメインロジック実行
4. イベント発行
5. トランザクションコミット

## ⚠️ エラー処理プロトコル

### エラーコード一覧

| コード | HTTPステータス | 説明 | リトライ可否 |
|--------|---------------|------|-------------|
| ERR_BC001_L3-005_001_001 | 400 | バリデーションエラー | No |
| ERR_BC001_L3-005_001_404 | 404 | リソース不存在 | No |
| ERR_BC001_L3-005_001_500 | 500 | システムエラー | Yes |

### リトライ戦略
- **リトライ可能エラー**: ERR_BC001_L3-005_001_500
- **リトライ回数**: 3回
- **バックオフ**: Exponential (2s, 4s, 8s)

### ロールバック手順
1. エンティティを元の状態に復元
2. イベントcompensation発行
3. エラーログ記録

### ログ記録要件
- **INFO**: 操作成功時
- **WARN**: ビジネスルール警告時
- **ERROR**: エラー発生時（スタックトレース含む）
- **監査ログ**: 全操作記録

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
> - [services/project-success-service/capabilities/foresee-and-handle-risks/operations/identify-and-assess-risks/](../../../../../../services/project-success-service/capabilities/foresee-and-handle-risks/operations/identify-and-assess-risks/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
