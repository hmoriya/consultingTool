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
