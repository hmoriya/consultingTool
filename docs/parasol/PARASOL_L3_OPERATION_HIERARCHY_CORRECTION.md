# L3 Capability-Operation階層構造の修正（v3.0）

## 🚨 重大な構造修正

### 誤った理解（v2.0）
```
❌ L3 Capability = Business Operation（同じ抽象度）
```

### 正しい理解（v3.0）
```
✅ L3 Capability = What（能力の定義）
✅ Business Operation = How（能力を実現する操作）
✅ L3とOperationは別階層（親子関係）
```

---

## 📊 正しい階層構造

```
Value Definition                     Why: 企業価値
  ↓
ValueStream                          What: 価値の流れ
  ↓
ValueStage                           What: 価値段階
  ↓
Capability L1（大分類）              What: 大分類能力
  ↓
Capability L2（中分類）              What: 中分類能力 → BC抽出
  ↓
BC (Business Capability)             Why-What-How: ビジネスケーパビリティ
  ├── Why: BCのビジネス価値
  ├── What: BCが持つL3能力一覧
  └── How: ドメイン・API・DB設計
    ↓
Capability L3（小分類）⭐             What: 具体的能力の定義
  ├── What: この能力で実現できること
  └── Operations: この能力を実現する操作群
    ↓
Business Operation ⭐                How: 能力を実現する操作
  ├── How: この操作の実現方法
  └── UseCases: この操作の実装
    ↓
UseCase                              Implementation: 操作の具体的実装
```

---

## 🎯 L3 Capability vs Operation の違い

### L3 Capability（能力層）= What

**定義**: 「〜できる」という抽象的な能力

**例**:
```
L3: タスク分解能力
- What: プロジェクトを構造化されたタスクに分解できる能力
- 含まれる要素:
  - WBS構造の理解
  - タスクの粒度判断
  - 階層構造の設計
```

### Business Operation（操作層）= How

**定義**: 「〜する」という具体的な操作

**例**:
```
Operation: WBSを作成する
- How: タスク分解能力を使って、WBS構造を作成する操作
- 実現方法:
  - BC Domain: Task, WBS Aggregates
  - BC API: POST /api/tasks/wbs
  - BC Data: tasks, wbs_structures テーブル

Operation: タスク依存関係を定義する
- How: タスク分解能力を使って、タスク間の依存関係を設定する操作
- 実現方法:
  - BC Domain: TaskDependency Entity
  - BC API: POST /api/tasks/{id}/dependencies
  - BC Data: task_dependencies テーブル
```

---

## 📂 ディレクトリ構造（修正版）

### Layer 2: システム設計層（パラソル）

```
docs/parasol/business-capabilities/
└── BC-001-task-management/
    ├── README.md                      # BC概要
    ├── WHY.md                         # BCのビジネス価値
    ├── WHAT.md                        # BCが持つL3能力一覧
    ├── HOW.md                         # BC全体の設計方針
    │
    ├── domain/                        # How詳細: ドメイン設計
    │   ├── README.md
    │   ├── aggregates.md
    │   ├── entities.md
    │   └── value-objects.md
    │
    ├── api/                           # How詳細: API設計
    │   ├── README.md
    │   ├── endpoints.md
    │   └── schemas.md
    │
    ├── data/                          # How詳細: データ設計
    │   ├── README.md
    │   ├── database-design.md
    │   └── data-flow.md
    │
    └── capabilities/                  # ⭐ L3能力層（What）
        │
        ├── L3-001-task-decomposition/ # L3: タスク分解能力
        │   ├── README.md              # この能力の定義（What）
        │   │
        │   └── operations/            # ⭐ 操作層（How）
        │       │
        │       ├── OP-001-create-wbs/
        │       │   ├── README.md      # 操作定義（How）
        │       │   └── usecases/      # → services/ へ
        │       │
        │       ├── OP-002-define-task-dependencies/
        │       │   ├── README.md
        │       │   └── usecases/      # → services/ へ
        │       │
        │       └── OP-003-decompose-tasks/
        │           ├── README.md
        │           └── usecases/      # → services/ へ
        │
        ├── L3-002-effort-estimation/  # L3: 工数見積能力
        │   ├── README.md
        │   └── operations/
        │       ├── OP-004-estimate-effort/
        │       └── OP-005-adjust-estimates/
        │
        └── L3-003-schedule-planning/  # L3: スケジュール計画能力
            ├── README.md
            └── operations/
                ├── OP-006-create-schedule/
                └── OP-007-optimize-schedule/
```

### Layer 3: サービス実装層

```
services/project-success-service/src/
└── capabilities/
    └── task-management/                           # BC-001
        └── capabilities/
            └── task-decomposition/                # L3-001
                └── operations/
                    ├── create-wbs/                # OP-001
                    │   └── usecases/
                    │       ├── create-wbs-manually/
                    │       │   ├── usecase.md
                    │       │   ├── page.md
                    │       │   └── README.md      # 実装ガイド
                    │       └── create-wbs-from-template/
                    │           ├── usecase.md
                    │           ├── page.md
                    │           └── README.md
                    │
                    ├── define-task-dependencies/  # OP-002
                    │   └── usecases/
                    │
                    └── decompose-tasks/           # OP-003
                        └── usecases/
```

---

## 📝 各層のドキュメント構造

### BC層（Business Capability）

**docs/parasol/business-capabilities/BC-001-task-management/README.md**

```markdown
# BC-001: タスク管理

## 🎯 Why: ビジネス価値
[WHY.mdへのリンク]

このBCが解決するビジネス課題:
- プロジェクトの可視化不足
- タスク管理の非効率性

## 📋 What: 機能（L3能力）
[WHAT.mdへのリンク]

このBCが提供する能力:
- **L3-001: タスク分解能力** - プロジェクトを構造化タスクに分解
- **L3-002: 工数見積能力** - タスクの工数を見積もる
- **L3-003: スケジュール計画能力** - タスクをスケジュールに配置

## 🏗️ How: 設計方針
[HOW.mdへのリンク]

- ドメインモデル: [domain/README.md](domain/README.md)
- API設計: [api/README.md](api/README.md)
- データ設計: [data/README.md](data/README.md)

## 📦 BC境界
- トランザクション境界: BC内のL3/Operation間は強整合性
- BC間: 結果整合性（イベント駆動）
```

---

### L3層（Capability L3）

**docs/parasol/business-capabilities/BC-001-task-management/capabilities/L3-001-task-decomposition/README.md**

```markdown
# L3-001: タスク分解能力

## 📋 What: この能力の定義

### 能力の概要
プロジェクトを構造化された実行可能なタスクに分解する能力

### 実現できること
- WBS（Work Breakdown Structure）の作成
- タスク階層構造の設計
- タスク依存関係の定義
- タスク粒度の適切な判断

### 必要な知識
- WBS作成の原則（PMBOK準拠）
- タスク分解のベストプラクティス
- プロジェクト構造の理解

## 🔗 BC設計の参照（How）

この能力は以下のBC設計要素を使用します:

### ドメインモデル
- **Aggregates**: Task, WBS ([BC-001/domain/aggregates.md](../../domain/aggregates.md#task-aggregate))
- **Entities**: Task, TaskDependency
- **Value Objects**: TaskStatus, TaskPriority

### API
- POST /api/tasks/wbs - WBS作成
- POST /api/tasks - タスク作成
- POST /api/tasks/{id}/dependencies - 依存関係設定

詳細: [BC-001/api/endpoints.md](../../api/endpoints.md)

### データ
- **Tables**: tasks, wbs_structures, task_dependencies
- **Relationships**: 階層構造、依存関係

詳細: [BC-001/data/database-design.md](../../data/database-design.md)

## ⚙️ Operations: この能力を実現する操作

この能力は以下の操作（Operation）によって実現されます:

| Operation | 説明 | UseCases |
|-----------|------|----------|
| **OP-001: WBSを作成する** | WBS構造を新規作成 | 2個 |
| **OP-002: タスク依存関係を定義する** | タスク間の依存関係を設定 | 1個 |
| **OP-003: タスクを分解する** | 親タスクを子タスクに分解 | 2個 |

詳細: 各Operationディレクトリ参照
```

---

### Operation層（Business Operation）

**docs/parasol/business-capabilities/BC-001-task-management/capabilities/L3-001-task-decomposition/operations/OP-001-create-wbs/README.md**

```markdown
# OP-001: WBSを作成する

## 🏗️ How: この操作の定義

### 操作の概要
新しいプロジェクトのWBS（Work Breakdown Structure）を作成する操作

### インプット
- プロジェクト情報（ID、名前、目標）
- 初期タスクリスト（オプション）
- WBSテンプレート（オプション）

### アウトプット
- 作成されたWBS構造
- ルートタスクとサブタスク
- タスクID一覧

### プロセス
1. プロジェクト情報の検証
2. WBS構造の初期化
3. ルートタスクの作成
4. テンプレート適用（オプション）
5. WBS構造の保存

## 🔗 BC設計の使い方（How詳細）

### ドメインモデルの使用
```
使用Aggregate: Task, WBS
→ [BC-001/domain/aggregates.md#task-aggregate](../../../../domain/aggregates.md#task-aggregate)

主要操作:
- WBS.create(projectId, rootTask)
- Task.addChild(childTask)
```

### API仕様の使用
```
POST /api/tasks/wbs
→ [BC-001/api/endpoints.md#create-wbs](../../../../api/endpoints.md#create-wbs)

Request Body:
{
  "projectId": "string",
  "name": "string",
  "template": "string?"
}

Response: WBS構造
```

### データ操作
```
テーブル操作:
- INSERT INTO wbs_structures
- INSERT INTO tasks (ルートタスク)

→ [BC-001/data/database-design.md#wbs-tables](../../../../data/database-design.md#wbs-tables)
```

## 💻 UseCases: この操作の実装

| UseCase | 説明 | 実装状況 |
|---------|------|----------|
| **UC-001: 手動でWBSを作成する** | ユーザーが手動で入力してWBS作成 | ✅ 実装済み |
| **UC-002: テンプレートからWBSを作成する** | 事前定義テンプレートからWBS作成 | 🚧 開発中 |

実装ガイド: services/project-success-service/.../usecases/[uc-name]/README.md
```

---

### UseCase層（Implementation）

**services/project-success-service/src/capabilities/task-management/capabilities/task-decomposition/operations/create-wbs/usecases/create-wbs-manually/README.md**

```markdown
# UC-001: 手動でWBSを作成する - 実装ガイド

## 🔗 上位層参照

### L3 Capability (What)
**タスク分解能力**: [docs/parasol/.../L3-001-task-decomposition/README.md](リンク)

### Operation (How)
**WBSを作成する**: [docs/parasol/.../OP-001-create-wbs/README.md](リンク)

### BC 設計 (How詳細)
**BC-001: タスク管理**: [docs/parasol/business-capabilities/BC-001-task-management/](リンク)

## 💻 Implementation: 実装詳細

### ステップ1: コンポーネント実装
```typescript
// CreateWBSManuallyPage.tsx
import { useCreateWBS } from './hooks/useCreateWBS'

export const CreateWBSManuallyPage = () => {
  const { createWBS, loading } = useCreateWBS()
  // ... 実装コード
}
```

### ステップ2: API統合
```typescript
// hooks/useCreateWBS.ts
// BC API仕様: docs/parasol/business-capabilities/BC-001/api/endpoints.md#create-wbs
const createWBS = async (data: CreateWBSRequest) => {
  return await api.post('/api/tasks/wbs', data)
}
```

### ステップ3: 状態管理
```typescript
// BC Domain仕様: docs/parasol/business-capabilities/BC-001/domain/aggregates.md#wbs
interface WBSState {
  wbs: WBS | null
  tasks: Task[]
  // ...
}
```

### ステップ4: テスト
```typescript
describe('UC-001: 手動でWBSを作成する', () => {
  it('should create WBS manually', async () => {
    // テストコード
  })
})
```

## 📋 実装チェックリスト
- [ ] コンポーネント実装
- [ ] API統合
- [ ] 状態管理
- [ ] エラーハンドリング
- [ ] ユニットテスト
- [ ] E2Eテスト
```

---

## 📊 階層別責務マトリクス

| 階層 | Why | What | How | Implementation |
|------|-----|------|-----|----------------|
| **Value Definition** | ✅ 定義 | - | - | - |
| **ValueStream** | - | ✅ 定義 | - | - |
| **ValueStage** | - | ✅ 定義 | - | - |
| **Capability L1** | - | ✅ 定義 | - | - |
| **Capability L2** | - | ✅ 定義 | - | - |
| **BC** | ✅ 定義 | ✅ 定義（L3一覧） | ✅ 定義 | - |
| **Capability L3** ⭐ | - | ✅ 定義 | 🔗 参照（BC How） | - |
| **Operation** ⭐ | - | - | ✅ 定義 | - |
| **UseCase** | 🔗 参照 | 🔗 参照 | 🔗 参照 | ✅ 定義 |

### 記号の意味
- ✅ 定義: この層で定義する（単一情報源）
- 🔗 参照: 上位層へリンク参照のみ
- - : この層では扱わない

---

## 🔄 具体例: BC-001（タスク管理）

### BC層
```
BC-001: タスク管理
├── Why: プロジェクトの可視化とタスク管理効率化
├── What: 3つのL3能力（タスク分解、工数見積、スケジュール計画）
└── How: ドメイン（Task/WBS Aggregates）、API、DB設計
```

### L3層（What）
```
L3-001: タスク分解能力
├── What: プロジェクトを構造化タスクに分解できる能力
├── How参照: BC-001のドメイン・API・DBを使用
└── Operations: 3つの操作
    ├── OP-001: WBSを作成する
    ├── OP-002: タスク依存関係を定義する
    └── OP-003: タスクを分解する
```

### Operation層（How）
```
OP-001: WBSを作成する
├── How: POST /api/tasks/wbs、Task/WBS Aggregates使用
└── UseCases: 2つの実装
    ├── UC-001: 手動でWBS作成
    └── UC-002: テンプレートからWBS作成
```

### UseCase層（Implementation）
```
UC-001: 手動でWBS作成
├── 参照: L3-001（What）、OP-001（How）、BC-001（How詳細）
└── Implementation: 具体的なReactコンポーネント、hooks、tests
```

---

## 🎯 数量関係

```
1 BC = 3-5 L3 Capabilities
1 L3 = 2-4 Operations
1 Operation = 1-3 UseCases

例: BC-001（タスク管理）
├── L3-001: タスク分解能力（3 Operations）
│   ├── OP-001: WBSを作成する（2 UseCases）
│   ├── OP-002: タスク依存関係を定義する（1 UseCase）
│   └── OP-003: タスクを分解する（2 UseCases）
├── L3-002: 工数見積能力（2 Operations）
│   ├── OP-004: 工数を見積もる（2 UseCases）
│   └── OP-005: 見積を調整する（1 UseCase）
└── L3-003: スケジュール計画能力（2 Operations）
    ├── OP-006: スケジュールを作成する（2 UseCases）
    └── OP-007: スケジュールを最適化する（1 UseCase）

合計: 1 BC = 3 L3 = 7 Operations = 11 UseCases
```

---

## 🔍 v2.0からv3.0への変更点

### v2.0（誤り）
```
BC
└── L3 Capability = Operation（同じ階層）⭐ 誤り
    └── UseCase
```

### v3.0（正しい）
```
BC
└── L3 Capability（能力 = What）⭐ 修正
    └── Operation（操作 = How）⭐ 修正
        └── UseCase（実装 = Implementation）
```

### 主な修正内容

| 項目 | v2.0（誤り） | v3.0（正しい） |
|------|-------------|---------------|
| **L3の役割** | Operationと同一 | 能力の定義（What） |
| **Operationの役割** | L3と同一 | 能力を実現する操作（How） |
| **階層関係** | L3 = Operation | L3 ⊃ Operations |
| **ディレクトリ** | operations/ 直下 | capabilities/[l3]/operations/ |
| **数量関係** | 1 BC = 5-7 L3/Operations | 1 BC = 3-5 L3 = 7-15 Operations |

---

## 📝 まとめ

### v3.0の核心

1. **L3 Capability = What**
   - 「〜できる」という能力の定義
   - 抽象的な能力レベル
   - BC Howを参照して、どのドメイン要素を使うか示す

2. **Business Operation = How**
   - 「〜する」という操作の定義
   - 具体的な実現方法
   - BC Howを使って、どう実現するか定義

3. **階層構造**
   ```
   BC (Why-What-How)
     ↓
   L3 Capability (What + How参照)
     ↓
   Operation (How)
     ↓
   UseCase (Implementation)
   ```

4. **情報の一元化**
   - BC層: Why-What-Howの単一情報源
   - L3層: 能力定義 + BC How参照
   - Operation層: 操作定義 + BC How使用方法
   - UseCase層: 実装のみ + 上位層参照

**次のステップ**:
- 既存ドキュメント（v2.0）の修正
- ディレクトリ構造の再設計
- 移行計画の更新
