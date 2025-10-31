# OP-002: コストトレンドを分析する

**作成日**: 2025-10-31
**所属L3**: L3-002-cost-management-and-optimization: Cost Management And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/analyze-cost-trends

---

## 📋 How: この操作の定義

### 操作の概要
過去のコストデータを分析し、コストトレンドや傾向を可視化する。コスト増加要因の特定や将来予測により、コスト最適化の意思決定を支援する。

### 実現する機能
- 時系列コスト分析とトレンド可視化
- カテゴリ別・プロジェクト別コスト比較
- コスト増加要因の特定
- コスト予測とシミュレーション

### 入力
- 過去のコストデータ
- 分析期間の指定
- 分析軸（カテゴリ、プロジェクト、部門）
- ベンチマークデータ

### 出力
- コストトレンドレポート
- カテゴリ別コスト分析
- コスト増加要因分析
- コスト予測レポート

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
> - [services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/analyze-cost-trends/](../../../../../../../services/revenue-optimization-service/capabilities/control-and-optimize-costs/operations/analyze-cost-trends/)
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
