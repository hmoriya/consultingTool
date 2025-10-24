# パラソル階層別ディレクトリ分離戦略

> ⚠️ **注意**: このドキュメントはBC内部の階層構造（L3/Operation）の詳細は含みません。
>
> **BC内部の階層構造（L3 Capability ⊃ Operation）については**:
> [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) (v3.0) を参照してください。
>
> このドキュメントは、3つのディレクトリ領域（Layer 1/2/3）の分離戦略に焦点を当てています。

## 📋 概要

Value Definition層からUseCase層までを**単一のディレクトリ構造で管理するのは現実的ではない**。

各層の**抽象度、ライフサイクル、管理主体**が異なるため、3つのディレクトリ領域に分離して管理する。

---

## 🎯 基本方針

### 分離の3原則

| 原則 | 説明 |
|------|------|
| **1. 抽象度による分離** | ビジネス価値 → システム設計 → 実装詳細 |
| **2. ライフサイクルによる分離** | 変更頻度：年単位 → 月単位 → 週単位 |
| **3. 管理主体による分離** | 経営/企画 → アーキテクト → 開発チーム |

---

## 📂 3層ディレクトリ構造

```
consultingTool/
├── docs/
│   ├── business-architecture/        ← 🎯 Layer 1: ビジネスアーキテクチャ層
│   │   ├── value-definitions/
│   │   ├── value-streams/
│   │   └── value-stages/
│   │
│   └── parasol/                       ← 🏗️ Layer 2: システム設計層
│       ├── capabilities/              # L1/L2/L3階層マップ
│       └── business-capabilities/     # BC詳細設計
│           └── BC-XXX/
│               ├── domain/api/data/   # BC How詳細
│               └── capabilities/      # L3能力層
│                   └── L3-XXX/
│                       └── operations/ # Operation層
│
└── services/                          ← 💻 Layer 3: サービス実装層
    └── [service-name]/
        └── src/capabilities/[bc-name]/capabilities/[l3-name]/operations/[op-name]/usecases/
```

---

## 🎯 Layer 1: ビジネスアーキテクチャ層

### 目的
**企業全体のビジネス価値とバリューストリームを定義**

### 配置場所
```
docs/business-architecture/
```

### 管理対象

#### 1. Value Definitions（価値定義）
```
docs/business-architecture/value-definitions/
├── README.md                          # 全体概要
├── VD-001-project-success.md          # プロジェクト成功価値
├── VD-002-team-productivity.md        # チーム生産性価値
└── VD-003-risk-mitigation.md          # リスク軽減価値
```

**内容**:
- 企業ミッション・ビジョンとの紐付け
- 測定可能なビジネス成果指標（KPI）
- ステークホルダー価値

#### 2. Value Streams（バリューストリーム）
```
docs/business-architecture/value-streams/
├── README.md                          # ValueStream一覧
├── VS-001-project-delivery.md         # プロジェクト遂行
├── VS-002-team-collaboration.md       # チーム協働
└── VS-003-quality-assurance.md        # 品質保証
```

**内容**:
- Value Definitionへの紐付け
- エンドツーエンドの価値の流れ
- 主要ステークホルダー

#### 3. Value Stages（価値段階）
```
docs/business-architecture/value-stages/
├── VS-001-project-delivery/
│   ├── README.md
│   ├── stage-1-planning.md            # 計画段階
│   ├── stage-2-execution.md           # 実行段階
│   ├── stage-3-monitoring.md          # 監視段階
│   └── stage-4-closure.md             # 完了段階
```

**内容**:
- 段階ごとの価値創出
- 次段階への移行条件
- Capability L1への展開

### 管理主体
- 経営層、事業企画部門
- エンタープライズアーキテクト

### 変更頻度
- **年1～2回**（中期経営計画サイクル）

### Why-What-How
```
✅ Why: Value Definition層で定義
✅ What: ValueStream/ValueStage層で定義
❌ How: この層では定義しない（下位層へ委譲）
```

---

## 🏗️ Layer 2: システム設計層（パラソル設計）

### 目的
**ビジネス価値を実現するためのシステム設計の定義**

### 配置場所
```
docs/parasol/
```

### 管理対象

#### 1. Capability Hierarchy（ケーパビリティ階層）
```
docs/parasol/capabilities/
├── README.md                          # Capability全体マップ
├── L1-CAPABILITIES.md                 # L1一覧（大分類）
├── L2-CAPABILITIES.md                 # L2一覧（中分類）
└── L3-CAPABILITIES.md                 # L3一覧（小分類）
```

**内容**:
- ValueStageからのCapability展開
- L1 → L2 → L3の分解階層
- L2からBC抽出の根拠

#### 2. Business Capabilities（BC：ビジネスケーパビリティ）
```
docs/parasol/business-capabilities/
├── README.md                          # BC全体一覧
├── BC-001-task-management/
│   ├── README.md                      # BC概要
│   ├── WHY.md                         # ビジネス価値 ⭐
│   ├── WHAT.md                        # 機能要件 ⭐
│   ├── HOW.md                         # 設計方針 ⭐
│   ├── domain/
│   │   ├── README.md
│   │   ├── aggregates.md              # 集約
│   │   ├── entities.md                # エンティティ
│   │   └── value-objects.md           # 値オブジェクト
│   ├── api/
│   │   ├── README.md
│   │   ├── endpoints.md               # エンドポイント定義
│   │   └── schemas.md                 # スキーマ定義
│   └── data/
│       ├── README.md
│       ├── database-design.md         # DB設計
│       └── data-flow.md               # データフロー
```

**BCのREADME.md構造**:
```markdown
# BC-001: タスク管理

## 🎯 Why: ビジネス価値
[WHY.mdへのリンク]
- Value Definitionへの紐付け
- このBCが解決するビジネス課題

## 📋 What: 機能要件
[WHAT.mdへのリンク]
- このBCが提供する機能
- 含まれるL3/Operation一覧（3-7個）

## 🏗️ How: 設計方針
[HOW.mdへのリンク]
- ドメインモデル概要
- API設計方針
- データ設計方針

## 📦 BC境界
- トランザクション境界
- 強整合性 vs 結果整合性

## 🔗 関連BC
- 上流BC
- 下流BC
```

#### 3. L3 Capabilities と Operations

> **詳細な階層構造**: [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) (v3.0)

**重要な理解**:
- **L3 Capability = What**（能力の定義）
- **Operation = How**（能力を実現する操作）
- L3 ⊃ Operations（L3能力は複数のOperationを含む）

```
docs/parasol/business-capabilities/BC-XXX/
└── capabilities/                      # L3能力層
    └── L3-XXX-[capability-name]/
        ├── README.md                  # L3能力定義（What）
        └── operations/                # 操作層
            └── OP-XXX-[operation-name]/
                ├── README.md          # Operation定義（How）
                └── usecases/          # → services/へ
```

**詳細構造と数量関係**:
- 1 BC = 3-5 L3 Capabilities
- 1 L3 = 2-4 Operations
- 1 Operation = 1-3 UseCases

詳細は [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) を参照

### 管理主体
- システムアーキテクト
- ドメインエキスパート

### 変更頻度
- **月1～2回**（機能追加・改善サイクル）

### Why-What-How
```
✅ Why: BC層で定義（単一情報源）
✅ What: BC層、Operation層で定義
✅ How: BC層で定義（単一情報源）→ Operation層から参照
```

---

## 💻 Layer 3: サービス実装層

### 目的
**実際のコード実装とその実装ガイド**

### 配置場所
```
services/[service-name]/src/capabilities/[bc-name]/capabilities/[l3-name]/operations/[op-name]/usecases/
```

### 管理対象

#### UseCase実装
```
services/project-success-service/src/
└── capabilities/
    └── task-management/                              # BC-001
        └── capabilities/
            └── task-decomposition/                   # L3-001
                └── operations/
                    └── create-wbs/                   # OP-001
                        └── usecases/
                            ├── create-wbs-manually/  # UC-001
                            │   ├── usecase.md
                            │   ├── page.md
                            │   └── README.md         # 実装ガイド
                            └── create-wbs-from-template/  # UC-002
                                ├── usecase.md
                                ├── page.md
                                └── README.md
```

**README.md構造**:
```markdown
# UC-001: 手動でWBSを作成する - 実装ガイド

## 🔗 設計参照
- **BC** (Why-What-How): [docs/parasol/business-capabilities/BC-001-task-management/](リンク)
- **L3 Capability** (What): [docs/parasol/business-capabilities/BC-001/capabilities/L3-001-task-decomposition/](リンク)
- **Operation** (How): [docs/parasol/business-capabilities/BC-001/capabilities/L3-001/operations/OP-001-create-wbs/](リンク)

## 💻 Implementation: 実装詳細

### ステップ1: コンポーネント実装
[具体的な実装手順]

### ステップ2: API統合
- 使用API: POST /api/tasks/wbs
- BC API仕様: [docs/parasol/business-capabilities/BC-001/api/endpoints.md#create-wbs](リンク)

### ステップ3: 状態管理
[実装コード例]
```

### 管理主体
- 開発チーム

### 変更頻度
- **週1～2回**（スプリント単位）

### Why-What-How
```
❌ Why: 定義しない → BC層へリンク
❌ What: 定義しない → Operation層へリンク
❌ How: 定義しない → BC層へリンク
✅ Implementation: この層で定義（唯一の責務）
```

---

## 🔗 層間連携の仕組み

### 1. トレーサビリティマップ
```
docs/parasol/TRACEABILITY.md

Value Definition → ValueStream → ValueStage → Capability L1/L2/L3 → BC → Operation → UseCase
```

### 2. 参照リンク規約

#### 下位層から上位層への参照（MUST）
```markdown
<!-- UseCase README.md -->
## 🔗 設計参照
- BC: [docs/parasol/business-capabilities/BC-001-task-management/](../../../../../../docs/parasol/business-capabilities/BC-001-task-management/)
- Operation: [docs/parasol/operations/BC-001/OP-001.md](../../../../../../docs/parasol/operations/BC-001/OP-001.md)
```

#### 上位層から下位層への参照（OPTIONAL）
```markdown
<!-- BC WHAT.md -->
## 実装状況
- OP-001: WBSを作成する
  - UC-001: 手動でWBS作成 ✅ 実装済み
  - UC-002: テンプレートから作成 🚧 開発中
```

### 3. 自動生成スクリプト
```bash
# トレーサビリティレポート生成
npm run parasol:trace-report

# 実装カバレッジレポート
npm run parasol:coverage-report
```

---

## 📊 各層の比較表

| 項目 | Layer 1: ビジネスアーキテクチャ | Layer 2: システム設計（パラソル） | Layer 3: サービス実装 |
|------|------|------|------|
| **配置場所** | `docs/business-architecture/` | `docs/parasol/` | `services/[name]/src/` |
| **管理主体** | 経営/企画部門 | アーキテクト/設計チーム | 開発チーム |
| **変更頻度** | 年1～2回 | 月1～2回 | 週1～2回 |
| **抽象度** | ビジネス価値 | システム設計 | 実装詳細 |
| **Why定義** | ✅ Value Definition | ✅ BC層 | ❌ リンクのみ |
| **What定義** | ✅ ValueStream/Stage | ✅ BC/Operation層 | ❌ リンクのみ |
| **How定義** | ❌ なし | ✅ BC層（単一情報源） | ❌ リンクのみ |
| **Implementation定義** | ❌ なし | ❌ なし | ✅ UseCase層 |
| **ファイル数** | ~50ファイル | ~200ファイル | ~500ファイル |
| **ページ数/ファイル** | 10-30ページ | 5-15ページ | 2-5ページ |

---

## 🎯 期待効果

### 1. 責務の明確化
```
各層が明確な責務を持ち、重複を排除
- Layer 1: ビジネス価値の定義
- Layer 2: システム設計の定義
- Layer 3: 実装詳細の定義
```

### 2. 変更影響の局所化
```
ビジネス戦略変更 → Layer 1のみ更新
設計変更 → Layer 2のみ更新
実装変更 → Layer 3のみ更新
```

### 3. チーム自律性の向上
```
各チームが自分の層に集中できる
- 経営/企画 → Layer 1
- アーキテクト → Layer 2
- 開発チーム → Layer 3
```

### 4. ドキュメント管理の最適化
```
変更頻度に応じた管理
- 年単位変更 → docs/business-architecture/
- 月単位変更 → docs/parasol/
- 週単位変更 → services/*/src/
```

---

## 🚀 移行戦略

### Phase 1: Layer 2の整備（現在）
- 既存のパラソル設計書をBC中心に再構成
- BC/Operation層の整備

### Phase 2: Layer 1の新設（3ヶ月後）
- Value Definition文書の作成
- ValueStream/ValueStage文書の作成
- トレーサビリティマップの構築

### Phase 3: Layer 3の最適化（6ヶ月後）
- UseCase README.mdの実装ガイド化
- 上位層への参照リンク整備

### Phase 4: 自動化（9ヶ月後）
- トレーサビリティレポート自動生成
- 実装カバレッジレポート自動生成

---

## 📝 まとめ

### 単一ディレクトリ構造の問題点
❌ 抽象度の異なる情報が混在
❌ 変更頻度の異なるファイルが同居
❌ 管理主体が不明確

### 3層分離構造の利点
✅ 抽象度に応じた配置
✅ ライフサイクルに応じた管理
✅ 管理主体の明確化
✅ チーム自律性の向上
✅ 変更影響の局所化

**次のステップ**: 各層の詳細なディレクトリ構造とテンプレートの整備
