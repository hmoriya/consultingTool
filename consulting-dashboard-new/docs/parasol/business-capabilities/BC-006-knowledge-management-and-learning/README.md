# BC-006: Knowledge Management & Organizational Learning

**作成日**: 2025-10-31
**バージョン**: 1.0.0 (v3.0)
**移行元**: knowledge-co-creation-service (V2)

---

## 🎯 Why: ビジネス価値

このBCが解決するビジネス課題:
- プロジェクト知見の散逸による知識の損失
- ベストプラクティスの共有不足
- 同じ失敗の繰り返しによる非効率性
- ナレッジ検索の困難さによる情報活用の遅延
- 暗黙知の形式知化不足

提供するビジネス価値:
- **知識の資産化**: 組織の知見を体系的に蓄積し、組織IQを向上
- **迅速な問題解決**: ベストプラクティスの共有により、問題解決時間を短縮
- **品質向上**: 過去の失敗事例から学び、同じミスを防止
- **イノベーション促進**: 知識の組み合わせにより、新たな価値を創造
- **継続的学習**: 組織全体の学習サイクルを確立し、競争力を強化

---

## 📋 What: 機能（L3能力）

このBCが提供する能力:

### L3-001: Knowledge Capture & Organization
**能力**: 知識を捕捉し、整理する
- 知識の記録と保存
- 知識の整理とカテゴライズ
- 知識の検証と品質保証
- 詳細: [capabilities/L3-001-knowledge-capture-and-organization/](capabilities/L3-001-knowledge-capture-and-organization/)

### L3-002: Knowledge Discovery & Application
**能力**: 知識を発見し、活用する
- 知識の検索と発見
- 知識の適用と実践
- 知識の共有と伝播
- 詳細: [capabilities/L3-002-knowledge-discovery-and-application/](capabilities/L3-002-knowledge-discovery-and-application/)

---

## 🏗️ How: 設計方針

### ドメイン設計
- [domain/README.md](domain/README.md)
- **主要集約**: Knowledge Aggregate, KnowledgeCategory Aggregate
- **主要エンティティ**: KnowledgeArticle, Tag, Category, BestPractice, LessonLearned
- **主要値オブジェクト**: KnowledgeMetadata, KnowledgeQuality, SearchCriteria

**V2からの移行**:
- `services/knowledge-co-creation-service/domain-language.md` → `domain/`へ分割整理
- 単一capabilityを2つのL3に分割（作成フェーズと活用フェーズ）

### API設計
- [api/README.md](api/README.md)
- **API仕様**: [api/api-specification.md](api/api-specification.md) ← Issue #146対応済み
- **エンドポイント**: [api/endpoints/](api/endpoints/)
- **スキーマ**: [api/schemas/](api/schemas/)

**V2からの移行**:
- `services/knowledge-co-creation-service/api/api-specification.md` → `api/api-specification.md`
- Issue #146のWHAT/HOW分離構造を維持

### データ設計
- [data/README.md](data/README.md)
- **データベース設計**: [data/database-design.md](data/database-design.md)
- **主要テーブル**: knowledge_articles, tags, categories, article_tags, best_practices
- **データフロー**: [data/data-flow.md](data/data-flow.md)

**V2からの移行**:
- `services/knowledge-co-creation-service/database-design.md` → `data/database-design.md`

---

## 📦 BC境界

### トランザクション境界
- **BC内のL3/Operation間**: 強整合性
  - KnowledgeArticle → Tag → Category の一貫性保証
  - 検証済みナレッジのみ公開可能
- **BC間**: 結果整合性（イベント駆動）
  - 全BCへのナレッジ検索サービス提供

### 他BCとの連携

#### BC-001: Project Delivery & Quality Management
- **連携内容**: プロジェクトベストプラクティス、教訓
- **連携方向**: BC-001 ⇄ BC-006（双方向）
- **連携方式**: ユースケース呼び出し型（知識検索・登録API）

#### BC-002: Financial Health & Profitability
- **連携内容**: 財務ベストプラクティス、コスト削減ノウハウ
- **連携方向**: BC-002 ⇄ BC-006（双方向）
- **連携方式**: ユースケース呼び出し型（知識検索・登録API）

#### BC-005: Team & Resource Optimization
- **連携内容**: スキル開発コンテンツ、トレーニング資料
- **連携方向**: BC-005 ⇄ BC-006（双方向）
- **連携方式**: ユースケース呼び出し型（知識検索・登録API）

#### BC-007: Team Communication & Collaboration
- **連携内容**: 新規ナレッジ公開通知
- **連携方向**: BC-006 → BC-007（通知イベント）
- **連携方式**: イベント駆動（KnowledgePublished）

---

## 📊 統計情報

### V2からの移行統計
- **V2 Capabilities**: 1個
- **V3 L3 Capabilities**: 2-3個（明確化のため分割）
- **Operations数**: 6個
- **統合アクション**:
  - ✅ 単一capabilityを2つのL3に分割（作成フェーズ vs 活用フェーズ）

### 規模
- **L3 Capabilities**: 2-3個（ガイドライン準拠）
- **1 L3あたりOperation数**: 2.0-3.0個（ガイドライン準拠）
- **推定UseCase数**: 8-12個

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このBCはV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/knowledge-co-creation-service/](../../services/knowledge-co-creation-service/)
>
> V2構造は2026年1月まで参照可能です（読み取り専用）。

### V2 Capabilityマッピング

| V2 Capability | V3 L3 Capability | 備考 |
|--------------|------------------|------|
| knowledge-management | L3-001: Knowledge Capture & Organization | 作成フェーズ |
| knowledge-management | L3-002: Knowledge Discovery & Application | 活用フェーズ |

---

## ✅ 品質基準

### 成功指標
- [ ] ナレッジ登録数 ≥ 100件/月
- [ ] ナレッジ検索成功率 ≥ 85%
- [ ] ナレッジ活用率 ≥ 70%
- [ ] ベストプラクティス適用率 ≥ 60%
- [ ] 同じ失敗の再発率 ≤ 10%

### アーキテクチャ品質
- [x] L3 Capability数が3-5個の範囲（2-3個）
- [x] 各L3のOperation数が2-4個の範囲
- [x] BC間依存が適切に定義されている
- [x] Issue #146（API WHAT/HOW分離）に準拠

---

## 📚 関連ドキュメント

### 必須参照
- [V2_V3_MAPPING.md](../../V2_V3_MAPPING.md) - V2→V3詳細マッピング
- [MIGRATION_STATUS.md](../../MIGRATION_STATUS.md) - 移行ステータス
- [V2_V3_COEXISTENCE_STRATEGY.md](../../V2_V3_COEXISTENCE_STRATEGY.md) - 共存戦略

### 設計ガイド
- [parasol-design-process-guide.md](../../parasol-design-process-guide.md) - v3.0対応プロセス

### Issue #146関連
- API WHAT/HOW分離ガイド（Issue #146対応）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | BC-006 README初版作成（Phase 0） | Claude |

---

**ステータス**: Phase 0 - アーキテクチャレビュー準備完了
**次のアクション**: L3 Capabilityディレクトリとドキュメントの作成
