# パラソル開発V3 MVP版設計書

## 概要

パラソル開発V3のMVP版（Minimum Viable Product）として、Layer 3（開発設計層）のみに特化したシンプル機能限定版の設計書です。

## MVP版の目標

- **エンジニアが直接設計からコード開発可能**な詳細設計を提供
- **2-3週間の短期間**で実装可能な範囲に限定
- **80%の工数削減**（Layer 1-2除外: 50% + AI生成機能除外: 30%）

## 実装スコープ

### ✅ 含む機能
- **L3 Capability定義**: 操作単位の能力定義（3個）
- **Operation詳細設計**: 業務操作の詳細化（8個）
- **UseCase設計**: 基本フロー＋代替フロー（12個）
- **ページ定義**: UI設計（12個）- MD形式・実装非依存
- **ドメイン言語**: 100%精緻化
- **管理UI簡素版**: パラソル開発ページ参照のみ
- **自動生成基础**: Mermaidクラス図・ER図生成

### ❌ 除外機能
- **Layer 1-2の設計**: 将来フェーズで実装
- **AI生成機能**: 将来フェーズで実装
- **複数BC間連携**: 単一BCに限定
- **品質ダッシュボード**: 将来フェーズで実装
- **API仕様WHAT/HOW分離管理**: 簡素版のみ

## ディレクトリ構造

```
docs/parasol/v3/mvp/
├── README.md                           # 本ファイル（MVP版概要）
├── mvp-implementation-plan.md          # 実装計画とロードマップ
├── templates/                          # V3 MVP版テンプレート
│   ├── l3-capability-template.md      # L3 Capability定義テンプレート
│   ├── operation-template.md           # Operation設計テンプレート
│   ├── usecase-template.md            # UseCase設計テンプレート
│   ├── page-template.md               # ページ定義テンプレート
│   └── domain-language-template.md    # ドメイン言語テンプレート
└── bounded-contexts/                   # Bounded Context別設計
    └── bc-001-task-management/         # BC-001: タスク管理
        ├── README.md                   # BC-001概要
        ├── l3-capabilities/            # L3 Capability定義群
        │   ├── cap-001-task-lifecycle.md
        │   ├── cap-002-task-collaboration.md
        │   └── cap-003-task-monitoring.md
        ├── operations/                 # Operation設計群
        │   ├── op-001-create-task.md
        │   ├── op-002-assign-task.md
        │   ├── op-003-update-progress.md
        │   ├── op-004-complete-task.md
        │   ├── op-005-review-task.md
        │   ├── op-006-collaborate-task.md
        │   ├── op-007-monitor-progress.md
        │   └── op-008-analyze-performance.md
        ├── usecases/                   # UseCase設計群
        │   ├── uc-001-task-creation.md
        │   ├── uc-002-task-assignment.md
        │   ├── uc-003-progress-update.md
        │   ├── uc-004-task-completion.md
        │   ├── uc-005-task-review.md
        │   ├── uc-006-task-collaboration.md
        │   ├── uc-007-progress-monitoring.md
        │   ├── uc-008-performance-analysis.md
        │   ├── uc-009-task-escalation.md
        │   ├── uc-010-dependency-management.md
        │   ├── uc-011-resource-allocation.md
        │   └── uc-012-quality-assurance.md
        ├── pages/                      # ページ定義群
        │   ├── page-001-task-creation.md
        │   ├── page-002-task-list.md
        │   ├── page-003-task-detail.md
        │   ├── page-004-task-assignment.md
        │   ├── page-005-progress-dashboard.md
        │   ├── page-006-collaboration-workspace.md
        │   ├── page-007-review-dashboard.md
        │   ├── page-008-analytics-dashboard.md
        │   ├── page-009-escalation-management.md
        │   ├── page-010-dependency-view.md
        │   ├── page-011-resource-allocation.md
        │   └── page-012-quality-dashboard.md
        ├── domain-language/            # ドメイン言語定義
        │   ├── entities.md            # エンティティ定義
        │   ├── value-objects.md       # 値オブジェクト定義
        │   ├── aggregates.md          # 集約定義
        │   ├── domain-services.md     # ドメインサービス定義
        │   └── domain-events.md       # ドメインイベント定義
        └── templates/                  # BC-001専用テンプレート
            ├── task-operation-template.md
            ├── task-usecase-template.md
            └── task-page-template.md
```

## 対応関係

### L3 Capability ↔ Operation ↔ UseCase ↔ Page (1:N:N:N関係)

| L3 Capability | Operations | UseCases | Pages |
|---------------|------------|----------|-------|
| **cap-001-task-lifecycle** | op-001, op-002, op-004 | uc-001, uc-002, uc-004 | page-001, page-002, page-004 |
| **cap-002-task-collaboration** | op-003, op-005, op-006 | uc-003, uc-005, uc-006 | page-003, page-005, page-006 |
| **cap-003-task-monitoring** | op-007, op-008 | uc-007, uc-008, uc-009, uc-010, uc-011, uc-012 | page-007, page-008, page-009, page-010, page-011, page-012 |

## 実装フェーズ

### Phase 1: 基盤準備（1-2日）
- [x] ディレクトリ構造作成
- [ ] テンプレート作成
- [ ] BC-001概要設計

### Phase 2: L3設計（5-7日）
- [ ] L3 Capability定義（3個）
- [ ] Operation詳細設計（8個）
- [ ] UseCase設計（12個）
- [ ] ページ定義（12個）

### Phase 3: ドメイン言語（2-3日）
- [ ] エンティティ定義
- [ ] 値オブジェクト定義
- [ ] 集約定義
- [ ] ドメインサービス定義

### Phase 4: 検証・完成（2-3日）
- [ ] 1対1対応関係の検証
- [ ] Mermaid図の自動生成テスト
- [ ] 設計書品質チェック
- [ ] 実装可能性検証

## 成功定義

- ✅ BC-001 タスク管理の完全な Layer 3 設計完成
- ✅ 12個のユースケース・ページの1対1対応
- ✅ Mermaidクラス図・ER図の正確な生成
- ✅ パラソル開発UI で参照・ナビゲーション可能
- ✅ 実装エンジニアが直接この設計からコード開発可能

## 関連Issue

- **Issue #199**: パラソル開発V3 MVP版実装（シンプル機能限定版）
- **Issue #198**: パラソル開発V3 UI/DBシステム構築プロジェクト
- **Issue #195**: ケーパビリティの3層構造（L1/L2/L3）を明確化
- **Issue #192**: V3構造ドキュメント整備・品質向上プロジェクト

## 更新履歴

- 2025-11-05: MVP版設計書構造を作成（Issue #199対応）