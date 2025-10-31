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
