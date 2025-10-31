# タレント最適化サービス

> ⚠️ **V3構造への移行のお知らせ** (2025-10-31更新)
>
> このサービスは、V3.0ビジネスケーパビリティ構造に移行しました。
>
> **新しいV3構造**:
> - **BC-005**: [チームとリソースの最適化](../../business-capabilities/BC-005-team-and-resource-optimization/)
>   - リソース最適配置、スキル育成、チーム編成、パフォーマンス評価
>   - 生産性可視化機能を統合（旧productivity-visualization-service吸収）
>
> **移行ステータス**: Phase 2完了（BC層・L3層構築完了）
>
> **V2構造の利用**:
> - このV2ドキュメントは2026年1月まで参照可能です（読み取り専用）
> - 新規開発は[V3構造](../../business-capabilities/BC-005-team-and-resource-optimization/)を参照してください
>
> 詳細: [MIGRATION_STATUS.md](../../MIGRATION_STATUS.md) | [V2_V3_MAPPING.md](../../V2_V3_MAPPING.md)

---

## サービス概要
**名前**: talent-optimization-service
**表示名**: タレント最適化サービス
**バージョン**: 2.0.0
**更新日**: 2025-10-28
**パラソル設計仕様**: v2.0準拠

### サービスの目的
組織の人的資源を最適に配置し、個々の能力を最大限に発揮させることで、チーム全体の生産性を向上させる。スキルマッチング、リソース配分、パフォーマンス管理を統合的に行い、人材育成とビジネス成果の両立を実現する。

### 解決する課題
- **スキルミスマッチ**: プロジェクト要件と人材スキルの不一致による生産性低下
- **リソース配分の非効率**: 属人的な配置判断による偏りと過負荷
- **スキル可視化の困難**: 組織全体のスキル保有状況が不透明
- **育成計画の不在**: 計画的な人材育成が行われず、スキルギャップが拡大
- **パフォーマンス評価の不統一**: 客観的な評価基準の欠如

### 提供価値
- **生産性向上**: 最適な人材配置によりプロジェクト成功率35%向上
- **スキル可視化**: スキルマトリクスによる適材適所の実現
- **育成効率化**: データ駆動の育成計画により成長速度40%向上
- **稼働率最適化**: リソース配分の可視化により稼働率85%以上を維持
- **離職率低減**: キャリア開発支援により離職率20%削減

### ビジネスケーパビリティ
- **チームの生産性を最大化する能力**: リソース最適配置、スキル育成、チーム編成、パフォーマンス評価

## パラソルドメイン連携

### 🎯 サービスレベル操作エンティティ
- **TalentEntity**（状態更新: 人材情報管理・最適化）- 組織人材の総合管理
- **TeamEntity**（作成・更新: チーム編成・最適化）- チーム構成と最適化管理
- **SkillEntity**（作成・更新: スキル定義・評価）- スキル体系と評価管理
- **PerformanceEntity**（作成・更新: 評価実施・分析）- パフォーマンス評価管理

### 🏗️ サービスレベル集約
- **TalentOptimizationAggregate** - タレント最適化統合管理
  - 集約ルート: TalentOptimization
  - 包含エンティティ: Team, Skill, Performance, ResourceAllocation
  - 不変条件: 人材価値最大化、組織生産性向上

### ⚙️ サービスレベルドメインサービス
- **TalentIntelligenceService**: enhance[OrganizationalCapability]() - 組織能力向上
- **OptimalAllocationService**: strengthen[ResourceEfficiency]() - リソース効率強化
- **SkillEvolutionService**: coordinate[ContinuousLearning]() - 継続学習調整
- **PerformanceMaximizationService**: amplify[TeamProductivity]() - チーム生産性増幅

## ビジネスケーパビリティ詳細

### 1. メンバーを管理し育成する能力 (manage-and-develop-members)
**責務**: 組織メンバーの情報管理、パフォーマンス評価、キャリア開発支援
**オペレーション**: register-and-manage-members, evaluate-performance, develop-and-support-career

### 2. チームを編成し最適化する能力 (form-and-optimize-teams)
**責務**: チーム編成、パフォーマンス監視、構成最適化
**オペレーション**: form-teams, monitor-team-performance, optimize-team-composition

### 3. リソースを最適配分する能力 (optimally-allocate-resources)
**責務**: リソース配分、需要予測、稼働率最適化
**オペレーション**: allocate-resources, forecast-resource-demand, optimize-resource-utilization

### 4. スキルを可視化し育成する能力 (visualize-and-develop-skills)
**責務**: スキルギャップ分析、マトリックス構築、開発実行
**オペレーション**: analyze-skill-gaps, create-skill-matrix, execute-skill-development

## ユースケース・ページ分解マトリックス（サービスレベル）

| ケーパビリティ | オペレーション数 | ユースケース総数 | ページ総数 | 1対1関係 |
|---------------|-----------------|-----------------|-----------|----------|
| manage-and-develop-members | 3 | 12 | 12 | ✅ |
| form-and-optimize-teams | 3 | 9 | 9 | ✅ |
| optimally-allocate-resources | 3 | 9 | 9 | ✅ |
| visualize-and-develop-skills | 3 | 12 | 12 | ✅ |
| **合計** | **12** | **42** | **42** | **✅** |

### 🔗 他サービス連携（サービスレベル）
**責務**: ❌ エンティティ知識不要 ✅ ユースケース利用のみ

[secure-access-service] 基盤サービス利用:
├── 認証・権限・監査機能の統一的利用
└── 全オペレーションで共通利用

[knowledge-co-creation-service] ナレッジ連携:
├── スキルフレームワーク・トレンド情報取得
└── 学習リソース・ベストプラクティス活用

[productivity-visualization-service] 分析可視化:
├── データ分析・ダッシュボード生成
└── パフォーマンス可視化・レポート作成

[collaboration-facilitation-service] コミュニケーション:
├── 通知配信・アラート機能
└── チーム連携・メンター機能
