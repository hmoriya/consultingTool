# BC-005: Team & Resource Optimization

**作成日**: 2025-10-31
**バージョン**: 1.0.0 (v3.0)
**移行元**: talent-optimization-service + productivity-visualization-service (V2)

---

## 🎯 Why: ビジネス価値

このBCが解決するビジネス課題:
- リソース配分の非効率性による生産性の低下
- スキルミスマッチによるプロジェクト品質の低下
- チーム編成の最適化不足
- タレント開発の体系性欠如
- 工数管理の不透明性による稼働率の把握困難

提供するビジネス価値:
- **最適リソース配分**: スキルベースの配分により、プロジェクト成功率を向上
- **高パフォーマンスチーム**: 科学的なチーム編成により、生産性を最大化
- **継続的スキル開発**: 体系的な育成により、組織の競争力を強化
- **稼働率最適化**: リアルタイムな工数管理により、リソース効率を向上
- **データ駆動型人材管理**: 可視化により、戦略的な人材配置を実現

---

## 📋 What: 機能（L3能力）

このBCが提供する能力:

### L3-001: Resource Planning & Allocation
**能力**: リソースを計画し、最適に配分する
- リソース配分の最適化
- リソース需要の予測
- リソース稼働率の最適化
- 工数記録と承認（productivity-visualization統合）
- 稼働率分析（productivity-visualization統合）
- 詳細: [capabilities/L3-001-resource-planning-and-allocation/](capabilities/L3-001-resource-planning-and-allocation/)

### L3-002: Team Formation & Composition
**能力**: チームを編成し、最適化する
- チームの編成
- チーム構成の最適化
- チームパフォーマンスのモニタリング
- 詳細: [capabilities/L3-002-team-formation-and-composition/](capabilities/L3-002-team-formation-and-composition/)

### L3-003: Talent Development & Performance
**能力**: タレントを育成し、パフォーマンスを管理する
- メンバーの登録と管理
- パフォーマンス評価
- キャリア開発とサポート
- 詳細: [capabilities/L3-003-talent-development-and-performance/](capabilities/L3-003-talent-development-and-performance/)

### L3-004: Capability & Skill Development
**能力**: 能力とスキルを育成する
- スキルギャップ分析
- スキルマトリクスの作成
- スキル開発の実行
- 詳細: [capabilities/L3-004-capability-and-skill-development/](capabilities/L3-004-capability-and-skill-development/)

---

## 🏗️ How: 設計方針

### ドメイン設計
- [domain/README.md](domain/README.md)
- **主要集約**: Resource Aggregate, Team Aggregate, Talent Aggregate, Skill Aggregate
- **主要エンティティ**: Resource, Team, TeamMember, Talent, Skill, SkillMatrix, Timesheet
- **主要値オブジェクト**: ResourceAllocation, SkillLevel, PerformanceRating, UtilizationRate

**V2からの移行**:
- `services/talent-optimization-service/domain-language.md` → `domain/`へ分割整理
- `services/productivity-visualization-service/domain-language.md` → `domain/`へ統合

### API設計
- [api/README.md](api/README.md)
- **API仕様**: [api/api-specification.md](api/api-specification.md) ← Issue #146対応済み
- **エンドポイント**: [api/endpoints/](api/endpoints/)
- **スキーマ**: [api/schemas/](api/schemas/)

**V2からの移行**:
- `services/talent-optimization-service/api/api-specification.md` → `api/api-specification.md`
- `services/productivity-visualization-service/api/api-specification.md` → 統合
- Issue #146のWHAT/HOW分離構造を維持

### データ設計
- [data/README.md](data/README.md)
- **データベース設計**: [data/database-design.md](data/database-design.md)
- **主要テーブル**: resources, teams, team_members, talents, skills, skill_matrices, timesheets
- **データフロー**: [data/data-flow.md](data/data-flow.md)

**V2からの移行**:
- `services/talent-optimization-service/database-design.md` → `data/database-design.md`
- `services/productivity-visualization-service/database-design.md` → 統合

---

## 📦 BC境界

### トランザクション境界
- **BC内のL3/Operation間**: 強整合性
  - Resource → Team → TeamMember の一貫性保証
  - Talent → Skill → SkillMatrix の関連性維持
  - Timesheet → Resource の整合性保証
- **BC間**: 結果整合性（イベント駆動）
  - Project BC (BC-001) へのリソース割当
  - Financial BC (BC-002) へのリソースコスト連携

### 他BCとの連携

#### BC-001: Project Delivery & Quality Management
- **連携内容**: プロジェクトへのリソース割当、工数実績
- **連携方向**: BC-001 ⇄ BC-005（双方向）
- **連携方式**: ユースケース呼び出し型（リソース割当API）

#### BC-002: Financial Health & Profitability
- **連携内容**: リソースコスト情報、人件費配分
- **連携方向**: BC-005 → BC-002（リソースコストイベント）
- **連携方式**: イベント駆動（ResourceCostAllocated）

#### BC-004: Organizational Structure & Governance
- **連携内容**: 組織単位情報、メンバー配置
- **連携方向**: BC-005 → BC-004（組織情報照会）
- **連携方式**: ユースケース呼び出し型（組織構造API）

#### BC-006: Knowledge Management & Organizational Learning
- **連携内容**: スキル開発ベストプラクティス、トレーニングコンテンツ
- **連携方向**: BC-005 ⇄ BC-006（双方向）
- **連携方式**: ユースケース呼び出し型（知識検索・登録API）

---

## 📊 統計情報

### V2からの移行統計
- **V2 Capabilities**: 5個（talent） + 1個（productivity） = 6個
- **V3 L3 Capabilities**: 4個（統合により-2）
- **Operations数**: 12-13個（重複削除済み）
- **統合アクション**:
  - ✅ 重複「execute-skill-development」を統合（L3-004に集約）
  - ✅ productivity-visualization-serviceをL3-001に統合

### 規模
- **L3 Capabilities**: 4個（ガイドライン準拠）
- **1 L3あたりOperation数**: 3.0-3.3個（ガイドライン準拠）
- **推定UseCase数**: 16-20個

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このBCはV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/](../../services/talent-optimization-service/)
> - [services/productivity-visualization-service/](../../services/productivity-visualization-service/)
>
> V2構造は2026年1月まで参照可能です（読み取り専用）。

### V2 Capabilityマッピング

| V2 Capability | V3 L3 Capability | 備考 |
|--------------|------------------|------|
| optimally-allocate-resources | L3-001: Resource Planning & Allocation | workload-tracking統合済み |
| form-and-optimize-teams | L3-002: Team Formation & Composition | 移行完了 |
| manage-and-develop-members | L3-003: Talent Development & Performance | skill統合済み |
| visualize-and-develop-skills | L3-004: Capability & Skill Development | execute統合済み |
| execute-skill-development | L3-004に統合 | 統合済み |
| workload-tracking (productivity) | L3-001に統合 | 統合済み |

---

## ✅ 品質基準

### 成功指標
- [ ] リソース配分最適化率 ≥ 85%
- [ ] チームパフォーマンス向上率 ≥ 20% YoY
- [ ] スキルギャップ解消率 ≥ 80%
- [ ] リソース稼働率 = 75-85%（適正範囲）
- [ ] タイムシート入力率 ≥ 95%

### アーキテクチャ品質
- [x] L3 Capability数が3-5個の範囲（4個）
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
| 2025-10-31 | BC-005 README初版作成（Phase 0） | Claude |

---

**ステータス**: Phase 0 - アーキテクチャレビュー準備完了
**次のアクション**: L3 Capabilityディレクトリとドキュメントの作成
