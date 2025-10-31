# OP-001: 収益性を計算する

**作成日**: 2025-10-31
**所属L3**: L3-004-profitability-analysis-and-optimization: Profitability Analysis And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/calculate-profitability

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトや部門の収益性を計算し、財務パフォーマンスを定量化する。粗利益率、営業利益率などの指標により、収益性の現状を可視化する。

### 実現する機能
- 収益性指標の計算（粗利益率、営業利益率等）
- プロジェクト別・部門別収益性分析
- 収益性レポートの生成
- 収益性ダッシュボードの表示

### 入力
- 収益データ
- コストデータ
- 計算期間の指定
- 計算対象（プロジェクト、部門等）

### 出力
- 収益性指標（粗利益率、営業利益率等）
- プロジェクト別収益性レポート
- 部門別収益性比較
- 収益性ダッシュボード

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
> - [services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/calculate-profitability/](../../../../../../../services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/calculate-profitability/)
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
