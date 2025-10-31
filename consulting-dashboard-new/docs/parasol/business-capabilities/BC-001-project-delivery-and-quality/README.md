# BC-001: Project Delivery & Quality Management

**作成日**: 2025-10-31
**バージョン**: 1.0.0 (v3.0)
**移行元**: project-success-service (V2)

---

## 🎯 Why: ビジネス価値

このBCが解決するビジネス課題:
- プロジェクトの遅延や予算超過によるビジネスインパクトの最小化
- 成果物の品質不足による再作業コストの削減
- リスクの見落としによるプロジェクト失敗の防止
- タスクの可視性不足による進捗管理の困難さの解消
- プロジェクト完了後の評価と学習機会の損失

提供するビジネス価値:
- **期限内完遂**: 計画的なプロジェクト実行により、納期遵守率を向上
- **予算内完遂**: リソース最適配分とコスト管理により、予算超過を防止
- **高品質保証**: 体系的な品質管理により、顧客満足度を向上
- **リスク最小化**: 早期のリスク検知と対応により、プロジェクト成功率を向上
- **継続的改善**: プロジェクト評価により、組織の実行力を強化

---

## 📋 What: 機能（L3能力）

このBCが提供する能力:

### L3-001: Project Planning & Structure
**能力**: プロジェクトを実行可能な構造に分解し、計画する
- WBSによるタスク分解
- タスク間の依存関係定義
- リソース配分計画
- 詳細: [capabilities/L3-001-project-planning-and-structure/](capabilities/L3-001-project-planning-and-structure/)

### L3-002: Project Execution & Delivery
**能力**: プロジェクトを円滑に実行し、完了まで導く
- プロジェクトのキックオフと立ち上げ
- プロジェクト実行とモニタリング
- プロジェクト完了と評価
- 詳細: [capabilities/L3-002-project-execution-and-delivery/](capabilities/L3-002-project-execution-and-delivery/)

### L3-003: Task & Work Management
**能力**: 日々のタスクを効率的に管理し、進捗を追跡する
- タスクの割り当てと実行
- 進捗状況の追跡
- ワークロードの可視化
- 詳細: [capabilities/L3-003-task-and-work-management/](capabilities/L3-003-task-and-work-management/)

### L3-004: Deliverable Quality Assurance
**能力**: 成果物の品質を定義し、保証する
- 成果物の定義と作成
- レビューと承認プロセス
- バージョン管理
- 詳細: [capabilities/L3-004-deliverable-quality-assurance/](capabilities/L3-004-deliverable-quality-assurance/)

### L3-005: Risk & Issue Management
**能力**: リスクと課題を早期に特定し、適切に対応する
- リスクの識別と評価
- リスク対応計画の策定
- リスクと課題のモニタリング
- 進捗の可視化と制御
- 詳細: [capabilities/L3-005-risk-and-issue-management/](capabilities/L3-005-risk-and-issue-management/)

---

## 🏗️ How: 設計方針

### ドメイン設計
- [domain/README.md](domain/README.md)
- **主要集約**: Project Aggregate, Task Aggregate, Deliverable Aggregate
- **主要エンティティ**: Project, Task, WBS, Milestone, Deliverable, Risk
- **主要値オブジェクト**: ProjectSchedule, TaskDependency, QualityCriteria

**V2からの移行**:
- `services/project-success-service/domain-language.md` → `domain/`へ分割整理

### API設計
- [api/README.md](api/README.md)
- **API仕様**: [api/api-specification.md](api/api-specification.md) ← Issue #146対応済み
- **エンドポイント**: [api/endpoints/](api/endpoints/)
- **スキーマ**: [api/schemas/](api/schemas/)

**V2からの移行**:
- `services/project-success-service/api/api-specification.md` → `api/api-specification.md`
- Issue #146のWHAT/HOW分離構造を維持

### データ設計
- [data/README.md](data/README.md)
- **データベース設計**: [data/database-design.md](data/database-design.md)
- **主要テーブル**: projects, tasks, wbs_items, deliverables, risks
- **データフロー**: [data/data-flow.md](data/data-flow.md)

**V2からの移行**:
- `services/project-success-service/database-design.md` → `data/database-design.md`

---

## 📦 BC境界

### トランザクション境界
- **BC内のL3/Operation間**: 強整合性
  - Project → Task → Deliverable の一貫性保証
  - Risk → Issue の状態遷移整合性
- **BC間**: 結果整合性（イベント駆動）
  - Financial BC (BC-002) へのコスト情報連携
  - Resource BC (BC-005) へのリソース割当連携

### 他BCとの連携

#### BC-002: Financial Health & Profitability
- **連携内容**: プロジェクトコスト情報、予算消化状況
- **連携方向**: BC-001 → BC-002（コスト発生イベント）
- **連携方式**: イベント駆動（ProjectCostAllocated, BudgetConsumed）

#### BC-005: Team & Resource Optimization
- **連携内容**: リソース割当要求、スキル要件
- **連携方向**: BC-001 ⇄ BC-005（双方向）
- **連携方式**: ユースケース呼び出し型（リソース割当API）

#### BC-006: Knowledge Management & Organizational Learning
- **連携内容**: ベストプラクティス適用、プロジェクト知見の蓄積
- **連携方向**: BC-001 ⇄ BC-006（双方向）
- **連携方式**: ユースケース呼び出し型（知識検索・登録API）

#### BC-007: Team Communication & Collaboration
- **連携内容**: プロジェクト通知、コラボレーション要求
- **連携方向**: BC-001 → BC-007（通知イベント）
- **連携方式**: イベント駆動（プロジェクトマイルストーン通知）

---

## 📊 統計情報

### V2からの移行統計
- **V2 Capabilities**: 6個
- **V3 L3 Capabilities**: 5個（統合により-1）
- **Operations数**: 10-12個（重複削除済み）
- **統合アクション**:
  - ✅ 「decompose-and-define-tasks」重複を統合（L3-001に集約）
  - ✅ 「monitor-and-ensure-quality」をL3-005（Risk Management）に統合

### 規模
- **L3 Capabilities**: 5個（ガイドライン上限）
- **1 L3あたりOperation数**: 2.0-2.4個（ガイドライン準拠）
- **推定UseCase数**: 15-20個

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このBCはV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/project-success-service/](../../services/project-success-service/)
>
> V2構造は2026年1月まで参照可能です（読み取り専用）。

### V2 Capabilityマッピング

| V2 Capability | V3 L3 Capability | 備考 |
|--------------|------------------|------|
| plan-and-structure-project | L3-001: Project Planning & Structure | 移行完了 |
| plan-and-execute-project | L3-002: Project Execution & Delivery | 移行完了 |
| manage-and-complete-tasks | L3-003: Task & Work Management | 移行完了 |
| manage-and-ensure-deliverable-quality | L3-004: Deliverable Quality Assurance | 移行完了 |
| foresee-and-handle-risks | L3-005: Risk & Issue Management | 移行完了 |
| monitor-and-ensure-quality | L3-005: Risk & Issue Management | 統合済み |

---

## ✅ 品質基準

### 成功指標
- [ ] プロジェクト期限遵守率 ≥ 90%
- [ ] プロジェクト予算遵守率 ≥ 85%
- [ ] 成果物品質レビュー合格率 ≥ 95%
- [ ] リスク早期検知率 ≥ 80%
- [ ] プロジェクト完了後評価実施率 = 100%

### アーキテクチャ品質
- [x] L3 Capability数が3-5個の範囲（5個）
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
| 2025-10-31 | BC-001 README初版作成（Phase 1） | Claude |

---

**ステータス**: Phase 1 - 並行構築中
**次のアクション**: L3 Capabilityディレクトリとドキュメントの作成
