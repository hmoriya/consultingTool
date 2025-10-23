# パラソル設計書構造提案: ValueStream/BC/L3=Operation統合モデル（改訂版）

**作成日**: 2025-10-23
**バージョン**: 2.0.0（改訂版）
**重要な修正**: L3 Capability = Business Operation（同じ抽象度）
**対象読者**: エンタープライズアーキテクト、サービス設計者、開発者

---

## 🎯 重要な前提認識

### L3 Capability = Business Operation（同じ抽象度）

```
✅ 正しい理解:

L1 Capability (大分類)
  例: プロジェクト管理能力

L2 Capability (中分類) ← BC抽出の基準
  例: プロジェクト計画能力 → BC: プロジェクト計画BC

L3 Capability (小分類) = Business Operation ← 同じ抽象度
  例:
  - L3: WBS作成能力 = Operation: WBSを作成する
  - L3: スケジュール策定能力 = Operation: スケジュールを策定する
  - L3: リソース配分能力 = Operation: リソースを配分する

UseCase (実装単位)
  例:
  - WBSを階層的に作成する
  - WBSを編集する
  - WBSをエクスポートする
```

---

## 📐 修正された階層構造

### 完全な階層マップ

```
ValueStream（価値の流れ）
  ↓ 分解
ValueStage（価値段階）
  ↓ ケーパビリティ分析

L1 Capability（大分類ケーパビリティ）
  例: プロジェクト管理能力
  ↓ 分解

L2 Capability（中分類ケーパビリティ）← BC抽出の基準 ⭐
  例: プロジェクト計画能力
  ↓ BC抽出

Business Capability (BC) ← 設計の中心単位
  = L2 Capabilityから抽出
  例: BC-004: プロジェクト計画BC
  ↓ 含む（1:N）

L3 Capability = Business Operation ← 同じ抽象度 ⭐⭐
  例:
  - L3: WBS作成能力 = Operation: WBSを作成する
  - L3: スケジュール策定能力 = Operation: スケジュールを策定する
  - L3: リソース配分能力 = Operation: リソースを配分する
  ↓ 実装（1:N）

UseCase（ユースケース実装）
  例:
  - WBSを階層的に作成する
  - WBSテンプレートから作成する
  - WBSを編集・更新する
  ↓ 画面（1:1）

Page（ページ実装）
  例: WBS作成ページ

【重要な対応関係】
- 1 BC = 複数 L3/Operation（3-7個程度）
- 1 L3/Operation = 複数 UseCase（2-5個程度）
- 1 UseCase = 1 Page
```

---

## 🏗️ 修正されたディレクトリ構造

```
docs/parasol/
│
├── 1-VALUE-STREAMS/
│   └── [value-stream-name]/
│       ├── value-stream.md
│       └── value-stages/
│           └── [stage-name]/
│               ├── stage.md
│               └── l1-capability-mapping.md
│
├── 2-CAPABILITIES/
│   ├── capability-hierarchy.md        # 全体階層図
│   │
│   └── [l1-capability-name]/         # L1: 大分類
│       ├── l1-capability.md
│       │   ├── § L1概要
│       │   ├── § L2分解戦略
│       │   └── § ValueStageとの関連
│       │
│       └── l2-capabilities/          # L2: 中分類（BC抽出基準）
│           └── [l2-capability-name]/
│               ├── l2-capability.md
│               │   ├── § L2概要
│               │   ├── § BC抽出方針
│               │   └── § L3/Operation一覧 ← ⭐
│               │
│               └── l3-capabilities/  # L3 = Operation定義
│                   └── [l3-capability-name]/
│                       └── l3-capability.md
│                           ├── § L3/Operation定義
│                           ├── § 含まれるBC
│                           └── § UseCase一覧
│
├── 3-BUSINESS-CAPABILITIES/          # BC層（設計の中心）
│   ├── bc-catalog.md
│   │   ├── § BCマップ
│   │   ├── § BC-L2マッピング
│   │   ├── § L3/Operation-BCマッピング ← ⭐
│   │   └── § BC-Serviceマッピング
│   │
│   └── [bc-name]/                    # BC単位の設計
│       ├── README.md                 # BC概要
│       │   ├── § Why: ビジネス価値
│       │   ├── § What: L2から導出
│       │   ├── § 含まれるL3/Operation一覧 ← ⭐
│       │   ├── § How: 実現方法
│       │   └── § 含まれるサービス
│       │
│       ├── domain/                   # BC単位ドメイン言語
│       │   ├── domain-language.md
│       │   ├── ubiquitous-language.md
│       │   └── bounded-context.md
│       │
│       ├── api/                      # BC単位API設計
│       │   ├── api-specification.md
│       │   └── endpoints/
│       │
│       ├── data/                     # BC単位DB設計
│       │   ├── database-design.md
│       │   └── schemas/
│       │
│       ├── operations/               # L3/Operation実装 ← ⭐
│       │   └── [l3-operation-name]/
│       │       ├── operation.md      # L3/Operation定義
│       │       │   ├── § L3/Operationの目的
│       │       │   ├── § ビジネスロジック
│       │       │   ├── § 使用するBCドメイン
│       │       │   ├── § 使用するBC API
│       │       │   ├── § 使用するBC DB
│       │       │   └── § UseCase分解
│       │       │
│       │       └── usecases/         # UseCase実装
│       │           └── [usecase-name]/
│       │               ├── README.md  # Why-What-How-Impl統合
│       │               ├── usecase.md
│       │               ├── page.md
│       │               └── tests/
│       │
│       └── integration/              # BC間連携
│
├── 4-SERVICES/                       # サービス実装層
│   └── [service-name]/
│       ├── service.md
│       │   ├── § 含まれるBC一覧
│       │   ├── § BC統合戦略
│       │   └── § L3/Operation一覧 ← ⭐
│       │
│       └── business-capabilities/    # 含まれるBC実装
│           └── [bc-name]/
│               ├── README.md
│               └── operations/       # L3/Operation実装参照
│
└── 5-CROSS-CUTTING/
```

---

## 🔍 詳細設計: L3/Operation = BC実装単位

### BC定義（L3/Operation含む）

**ファイル**: `3-BUSINESS-CAPABILITIES/[bc-name]/README.md`

```markdown
# Business Capability: プロジェクト計画BC

**BC-ID**: BC-004
**導出元L2**: L2: プロジェクト計画能力
**バージョン**: 2.0.0

---

## 🎯 Why: ビジネス価値

### L2からの導出
**L2 Capability**: プロジェクト計画能力
- **目的**: プロジェクトの実行計画を策定し、成功確率を高める
- **価値**: 計画精度向上によるプロジェクト成功率30%向上

### このBCの責務
- プロジェクト計画の策定・管理
- WBS（Work Breakdown Structure）の作成・維持
- スケジュールの策定・調整
- リソースの配分・最適化

---

## 📋 What: 含まれるL3 Capability / Business Operation

このBC（BC-004: プロジェクト計画BC）には、以下のL3/Operationが含まれます：

| L3 Capability | = | Business Operation | 優先度 | ユースケース数 |
|--------------|---|-------------------|--------|--------------|
| WBS作成能力 | = | WBSを作成する | 高 | 4 |
| スケジュール策定能力 | = | スケジュールを策定する | 高 | 3 |
| リソース配分能力 | = | リソースを配分する | 高 | 4 |
| 依存関係管理能力 | = | 依存関係を管理する | 中 | 3 |
| マイルストーン設定能力 | = | マイルストーンを設定する | 中 | 2 |

**合計**: 5つのL3/Operation、16ユースケース

---

## 🏗️ How: BC実装（ドメイン・API・DB）

### BC共有ドメイン言語

このBCに含まれる全L3/Operationで共有されるドメイン言語：

```typescript
/**
 * BC: プロジェクト計画BC の集約ルート
 *
 * このBCの全L3/Operationで共有される中核エンティティ
 */
class ProjectPlanAggregate {
  private root: ProjectPlan;
  private wbs: WBSStructure;          // L3: WBS作成で使用
  private schedule: ProjectSchedule;   // L3: スケジュール策定で使用
  private resources: ResourceAllocation[]; // L3: リソース配分で使用
  private dependencies: TaskDependency[]; // L3: 依存関係管理で使用
  private milestones: Milestone[];    // L3: マイルストーン設定で使用

  // BC全体の不変条件
  private ensureBCInvariants(): void {
    // 全L3/Operationが守るべき制約
    if (this.wbs.isEmpty() && this.schedule.isSet()) {
      throw new Error("WBSなしでスケジュールは設定できない");
    }

    if (this.resources.length > 0 && this.wbs.isEmpty()) {
      throw new Error("WBSなしでリソース配分はできない");
    }
  }
}

/**
 * BC: プロジェクト計画BC のエンティティ
 */
interface WBSStructure {
  id: UUID;
  tasks: WBSTask[];
  hierarchy: number;  // 階層深度
  // L3: WBS作成で主に操作
}

interface ProjectSchedule {
  id: UUID;
  startDate: Date;
  endDate: Date;
  tasks: ScheduledTask[];
  // L3: スケジュール策定で主に操作
}

interface ResourceAllocation {
  id: UUID;
  resourceId: UUID;
  taskId: UUID;
  allocation: number; // 配分率
  // L3: リソース配分で主に操作
}
```

**📖 詳細**: [domain/domain-language.md](./domain/domain-language.md)

---

### BC共有API設計

このBCに含まれる全L3/OperationのAPI：

```yaml
# BC: プロジェクト計画BC のAPI仕様

paths:
  # L3/Operation: WBSを作成する のAPI
  /api/bc/project-planning/wbs:
    post:
      summary: WBSを作成する
      operationId: createWBS
      tags: [BC-ProjectPlanning, L3-WBS]

  # L3/Operation: スケジュールを策定する のAPI
  /api/bc/project-planning/schedules:
    post:
      summary: スケジュールを策定する
      operationId: createSchedule
      tags: [BC-ProjectPlanning, L3-Schedule]

  # L3/Operation: リソースを配分する のAPI
  /api/bc/project-planning/resource-allocations:
    post:
      summary: リソースを配分する
      operationId: allocateResources
      tags: [BC-ProjectPlanning, L3-Resource]

  # L3/Operation: 依存関係を管理する のAPI
  /api/bc/project-planning/dependencies:
    post:
      summary: タスク依存関係を設定する
      operationId: setDependencies
      tags: [BC-ProjectPlanning, L3-Dependency]

  # L3/Operation: マイルストーンを設定する のAPI
  /api/bc/project-planning/milestones:
    post:
      summary: マイルストーンを設定する
      operationId: setMilestones
      tags: [BC-ProjectPlanning, L3-Milestone]

# BC全体で共有されるスキーマ
components:
  schemas:
    ProjectPlan:
      type: object
      description: BC全体で共有される計画エンティティ

    WBSStructure:
      type: object
      description: L3-WBSで主に使用

    ProjectSchedule:
      type: object
      description: L3-Scheduleで主に使用
```

**📖 詳細**: [api/api-specification.md](./api/api-specification.md)

---

### BC共有DB設計

このBCに含まれる全L3/OperationのDB：

```sql
-- BC: プロジェクト計画BC のデータベーススキーマ

CREATE SCHEMA bc_project_planning;

-- BC集約ルートテーブル
CREATE TABLE bc_project_planning.project_plans (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,

  -- BC全体の整合性管理
  aggregate_version INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- L3/Operation: WBSを作成する のテーブル
CREATE TABLE bc_project_planning.wbs_structures (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES bc_project_planning.project_plans(id),
  task_name VARCHAR(255) NOT NULL,
  parent_task_id UUID REFERENCES bc_project_planning.wbs_structures(id),
  hierarchy_level INTEGER NOT NULL,
  sequence_order INTEGER NOT NULL,

  -- L3-WBS固有のデータ
  estimated_hours DECIMAL(10,2),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- L3/Operation: スケジュールを策定する のテーブル
CREATE TABLE bc_project_planning.project_schedules (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES bc_project_planning.project_plans(id),
  task_id UUID NOT NULL REFERENCES bc_project_planning.wbs_structures(id),

  -- L3-Schedule固有のデータ
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- L3/Operation: リソースを配分する のテーブル
CREATE TABLE bc_project_planning.resource_allocations (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES bc_project_planning.project_plans(id),
  task_id UUID NOT NULL REFERENCES bc_project_planning.wbs_structures(id),
  resource_id UUID NOT NULL,

  -- L3-Resource固有のデータ
  allocation_percentage DECIMAL(5,2) NOT NULL,
  assigned_hours DECIMAL(10,2),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_allocation_percentage CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100)
);

-- L3/Operation: 依存関係を管理する のテーブル
CREATE TABLE bc_project_planning.task_dependencies (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES bc_project_planning.project_plans(id),
  predecessor_task_id UUID NOT NULL REFERENCES bc_project_planning.wbs_structures(id),
  successor_task_id UUID NOT NULL REFERENCES bc_project_planning.wbs_structures(id),

  -- L3-Dependency固有のデータ
  dependency_type VARCHAR(50) NOT NULL, -- FS, SS, FF, SF
  lag_days INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_dependency_type CHECK (dependency_type IN ('FS', 'SS', 'FF', 'SF'))
);

-- L3/Operation: マイルストーンを設定する のテーブル
CREATE TABLE bc_project_planning.milestones (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES bc_project_planning.project_plans(id),
  milestone_name VARCHAR(255) NOT NULL,

  -- L3-Milestone固有のデータ
  target_date DATE NOT NULL,
  criteria TEXT,
  status VARCHAR(50) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_milestone_status CHECK (status IN ('planned', 'achieved', 'missed'))
);

-- BCインデックス戦略
CREATE INDEX idx_bc_pp_wbs_plan ON bc_project_planning.wbs_structures(plan_id);
CREATE INDEX idx_bc_pp_schedule_plan ON bc_project_planning.project_schedules(plan_id);
CREATE INDEX idx_bc_pp_resource_plan ON bc_project_planning.resource_allocations(plan_id);
CREATE INDEX idx_bc_pp_dependency_plan ON bc_project_planning.task_dependencies(plan_id);
CREATE INDEX idx_bc_pp_milestone_plan ON bc_project_planning.milestones(plan_id);
```

**📖 詳細**: [data/database-design.md](./data/database-design.md)

---

## 🔗 L3/Operation詳細

### L3/Operation 1: WBSを作成する

**ファイル**: `operations/create-wbs/operation.md`

```markdown
# L3 Capability / Business Operation: WBSを作成する

**L3-ID**: L3-BC004-001
**所属BC**: BC-004: プロジェクト計画BC
**抽象度**: L3 Capability = Business Operation

---

## 定義

**L3 Capability**: WBS作成能力
**Business Operation**: WBSを作成する

これらは同じ抽象度で、以下を意味します：
- ケーパビリティ視点: プロジェクトをタスクに分解する能力
- オペレーション視点: WBS（Work Breakdown Structure）を作成する操作

---

## 使用するBCドメイン

このL3/Operationは、BC: プロジェクト計画BC のドメイン言語を使用します：

- **集約**: ProjectPlanAggregate
- **エンティティ**: WBSStructure, WBSTask
- **バリューオブジェクト**: TaskHierarchy, EstimatedEffort
- **ドメインサービス**: WBSValidationService

---

## 使用するBC API

このL3/Operationは、以下のBC APIを使用します：

- `POST /api/bc/project-planning/wbs` - WBS作成
- `PUT /api/bc/project-planning/wbs/{id}` - WBS更新
- `GET /api/bc/project-planning/wbs/{id}` - WBS取得

---

## 使用するBC DB

このL3/Operationは、以下のBCテーブルを使用します：

- `bc_project_planning.project_plans` - 計画ルート
- `bc_project_planning.wbs_structures` - WBS構造
- `bc_project_planning.wbs_tasks` - WBSタスク

---

## UseCase分解

このL3/Operationは、以下のユースケースに分解されます：

| UseCase | 説明 | ページ | 優先度 |
|---------|------|--------|--------|
| WBSを階層的に作成する | トップダウンでWBSを作成 | WBS作成ページ | 高 |
| WBSテンプレートから作成する | テンプレートを使用 | テンプレート選択ページ | 中 |
| WBSを編集・更新する | 既存WBSの編集 | WBS編集ページ | 高 |
| WBSをエクスポートする | Excel/PDF出力 | エクスポートページ | 低 |

**合計**: 4ユースケース

---

## ビジネスロジック

```typescript
/**
 * L3/Operation: WBSを作成する のビジネスロジック
 *
 * BC: プロジェクト計画BC のドメイン言語を使用
 */
class CreateWBSOperation {
  async execute(planId: UUID, wbsData: WBSCreationData): Promise<WBSStructure> {
    // 1. BC集約を取得
    const planAggregate = await this.repository.findPlanAggregate(planId);

    // 2. WBSエンティティを作成（BCドメイン言語）
    const wbs = WBSStructure.create({
      tasks: wbsData.tasks,
      hierarchy: wbsData.hierarchy
    });

    // 3. BC不変条件をチェック
    planAggregate.setWBS(wbs);
    planAggregate.ensureBCInvariants();

    // 4. BC DBに永続化
    await this.repository.savePlanAggregate(planAggregate);

    // 5. BCドメインイベント発行
    planAggregate.raiseEvent(new WBSCreated(planId, wbs.id));

    return wbs;
  }
}
```

---

📖 詳細: [usecases/](./usecases/)
```

---

## 📊 具体例: プロジェクト計画BCの完全マッピング

### ValueStream → L1 → L2 → BC → L3/Operation → UseCase

```
ValueStream: コンサルティングプロジェクト価値提供
│
└── ValueStage: 実行段階
    │
    └── L1 Capability: プロジェクト管理能力
        │
        └── L2 Capability: プロジェクト計画能力
            │
            ↓ BC抽出
            │
            BC-004: プロジェクト計画BC
            ├── 共有ドメイン言語: ProjectPlanAggregate, WBSStructure, etc.
            ├── 共有API: /api/bc/project-planning/*
            ├── 共有DB: bc_project_planning スキーマ
            │
            └── 含まれるL3/Operation（5個）:
                │
                ├── L3-1: WBS作成能力 = Operation: WBSを作成する
                │   ├── UseCase-1: WBSを階層的に作成する
                │   │   └── Page: WBS作成ページ
                │   ├── UseCase-2: WBSテンプレートから作成する
                │   │   └── Page: テンプレート選択ページ
                │   ├── UseCase-3: WBSを編集・更新する
                │   │   └── Page: WBS編集ページ
                │   └── UseCase-4: WBSをエクスポートする
                │       └── Page: エクスポートページ
                │
                ├── L3-2: スケジュール策定能力 = Operation: スケジュールを策定する
                │   ├── UseCase-1: スケジュールを自動生成する
                │   │   └── Page: スケジュール生成ページ
                │   ├── UseCase-2: スケジュールを手動調整する
                │   │   └── Page: スケジュール調整ページ
                │   └── UseCase-3: ガントチャートを表示する
                │       └── Page: ガントチャートページ
                │
                ├── L3-3: リソース配分能力 = Operation: リソースを配分する
                │   ├── UseCase-1: リソースを自動配分する
                │   │   └── Page: 自動配分ページ
                │   ├── UseCase-2: リソースを手動配分する
                │   │   └── Page: 手動配分ページ
                │   ├── UseCase-3: 配分状況を可視化する
                │   │   └── Page: 配分状況ページ
                │   └── UseCase-4: 配分の最適化を提案する
                │       └── Page: 最適化提案ページ
                │
                ├── L3-4: 依存関係管理能力 = Operation: 依存関係を管理する
                │   ├── UseCase-1: タスク依存関係を設定する
                │   │   └── Page: 依存関係設定ページ
                │   ├── UseCase-2: クリティカルパスを分析する
                │   │   └── Page: クリティカルパス分析ページ
                │   └── UseCase-3: 依存関係を可視化する
                │       └── Page: 依存関係図ページ
                │
                └── L3-5: マイルストーン設定能力 = Operation: マイルストーンを設定する
                    ├── UseCase-1: マイルストーンを定義する
                    │   └── Page: マイルストーン定義ページ
                    └── UseCase-2: マイルストーン達成状況を追跡する
                        └── Page: マイルストーン追跡ページ

【数量サマリー】
- 1 BC = 5 L3/Operation
- 5 L3/Operation = 16 UseCase
- 16 UseCase = 16 Page
```

---

## 🎨 設計パターン

### Pattern 1: BC境界 = L2 Capability境界

```
✅ 正しい対応:

L2 Capability: プロジェクト計画能力
  ↓ 1:1対応
BC: プロジェクト計画BC
  ├── ドメイン言語: ProjectPlan集約（BC全体で共有）
  ├── API: /api/bc/project-planning/*（BC全体で共有）
  └── DB: bc_project_planning スキーマ（BC全体で共有）

【重要】
- BC境界 = トランザクション境界
- BC内の全L3/Operation = 同一ドメイン言語・API・DBを共有
- BC間 = イベント駆動で連携（強整合性なし）
```

### Pattern 2: L3/Operation = 実装単位

```
✅ L3/Operationの責務:

1. BCドメイン言語を使用
   - BC定義の集約・エンティティを操作
   - BC定義のドメインサービスを利用

2. BC APIを使用
   - BC定義のエンドポイントを呼び出し
   - BC APIスキーマに準拠

3. BC DBを使用
   - BCスキーマのテーブルに読み書き
   - BC内トランザクション整合性を維持

4. UseCaseに分解
   - 1つのL3/Operationは2-5個のUseCaseに分解
   - 各UseCaseは具体的なユーザー操作
```

### Pattern 3: BC共有とL3固有の分離

```
【BC共有部分】（全L3/Operationで共通）
- ドメイン言語: ProjectPlanAggregate（集約ルート）
- API基盤: /api/bc/project-planning/ 配下
- DBスキーマ: bc_project_planning

【L3固有部分】（L3/Operationごとに異なる）
- ドメインエンティティ: WBSStructure（L3-WBS）、ProjectSchedule（L3-Schedule）
- APIエンドポイント: /wbs（L3-WBS）、/schedules（L3-Schedule）
- DBテーブル: wbs_structures（L3-WBS）、project_schedules（L3-Schedule）

【設計原則】
- BC共有部分は先に設計（全L3で共通基盤）
- L3固有部分は各L3で独立設計（ただしBC制約内）
```

---

## 📈 期待効果（修正版）

### 階層構造の明確化

| 指標 | 改訂前 | 改訂後 | 改善効果 |
|------|--------|--------|----------|
| L3とOperationの関係明確性 | 50% | 100% | **+100%** |
| BC-L3対応の明確性 | 60% | 100% | **+67%** |
| ドメイン言語共有範囲の明確性 | 40% | 95% | **+138%** |
| 実装単位の明確性 | 50% | 95% | **+90%** |

### 設計効率

| 指標 | 改訂前 | 改訂後 | 改善効果 |
|------|--------|--------|----------|
| L3/Operation設計時間 | - | 1日/L3 | 標準化 |
| BC設計時間 | 2日 | 3日 | BC=L3統合で精緻化 |
| UseCase導出時間 | 4時間 | 1時間 | L3からの体系的導出 |

---

## 🔄 移行戦略（修正版）

### Phase 1: L3=Operation対応付け（2週間）

```bash
# ステップ1: 現在のOperationをL3にマッピング
1. 既存Operation一覧の抽出
2. 各OperationをL3 Capabilityと対応付け
3. L3-L2-L1階層への整理

# ステップ2: BC再定義
1. L2からBC抽出
2. 各BCに含まれるL3/Operation一覧化
3. BC-L3マッピング表作成

# 成果物:
- L3-Operation対応表
- BC-L3マッピング表
- 修正されたbc-catalog.md
```

### Phase 2: BC共有設計（4週間）

```bash
# Week 1-2: BC共有部分設計
1. BC単位のドメイン言語定義
   - 全L3で共有する集約・エンティティ
   - L3固有のエンティティ
2. BC単位のAPI設計
   - BC共通基盤API
   - L3固有エンドポイント
3. BC単位のDB設計
   - BCスキーマ定義
   - L3固有テーブル

# Week 3-4: L3/Operation詳細設計
1. 各L3/OperationのUseCase分解
2. L3ごとのドメイン言語使用方法
3. L3ごとのAPI/DB使用方法
```

### Phase 3: ディレクトリ構造移行（6週間）

```bash
# Week 1-2: BC構造への移行
1. 3-BUSINESS-CAPABILITIES/ 配下整理
2. BCごとのdomain/api/data/作成
3. operations/ 配下にL3/Operation配置

# Week 3-4: L3/Operation実装整理
1. 各L3/Operation配下にusecases/配置
2. UseCase-Page 1:1構造確認
3. BC共有部分と L3固有部分の分離

# Week 5-6: 検証と文書化
1. BC-L3-UseCase階層の検証
2. ドメイン言語・API・DB共有の検証
3. 移行完了ドキュメント作成
```

---

## 📚 重要な設計原則（まとめ）

### 1. 階層の明確化

```
✅ 絶対に守るべき対応関係:

ValueStage → L1 Capability (1:N)
L1 Capability → L2 Capability (1:N)
L2 Capability → BC (1:1 or 1:N)  ← BC抽出の基準
BC → L3 Capability = Operation (1:N)  ← 同じ抽象度
L3/Operation → UseCase (1:N)
UseCase → Page (1:1)
```

### 2. BC共有の原則

```
✅ BC単位で共有するもの:
- ドメイン言語（集約・エンティティ・ドメインサービス）
- API設計（エンドポイント・スキーマ）
- DB設計（スキーマ・テーブル）

✅ L3固有のもの:
- L3特有のエンティティ詳細
- L3特有のAPIエンドポイント
- L3特有のDBテーブル
（ただし、BC全体の整合性制約内で）
```

### 3. 実装の単位

```
✅ 設計の中心単位: BC
  - ドメイン駆動設計の境界づけられたコンテキスト
  - トランザクション境界
  - チーム責任範囲

✅ 実装の作業単位: L3/Operation
  - 具体的な開発タスク
  - スプリントバックログ項目
  - UseCase分解の基準

✅ 画面実装の単位: UseCase
  - 1 UseCase = 1 Page
  - ユーザーストーリー
  - 受け入れテスト基準
```

---

## 📝 改訂履歴

| バージョン | 日付 | 変更内容 | 理由 |
|-----------|------|---------|------|
| 1.0.0 | 2025-10-23 | 初版作成 | - |
| 2.0.0 | 2025-10-23 | L3=Operation対応付け | ユーザーフィードバック反映 |

**重要な修正点（v2.0.0）**:
- ✅ L3 Capability = Business Operation（同じ抽象度）を明確化
- ✅ BC-L3対応関係を1:N（1つのBCに複数L3）に修正
- ✅ BC共有（ドメイン・API・DB）とL3固有部分の分離を明確化
- ✅ ディレクトリ構造をBC/operations/[l3-name]/に修正
- ✅ 具体例を完全マッピング形式で提示

---

**備考**: この改訂版により、L3 Capability = Business Operationという同じ抽象度の関係が明確になり、BCを中心とした設計書構造がより実践的になりました。
