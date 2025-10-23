# パラソル設計ディレクトリ移行計画書

**作成日**: 2025-10-23
**バージョン**: 1.0.0
**目的**: パラソル設計v2.0仕様への完全準拠
**対象ブランチ**: claude/design-parasol-md-011CUQKSjvkBzsp5Ax3jqyKV

---

## 📊 現状分析

### 全体統計
- **合計サービス**: 7
- **合計ユースケース**: 105個（usecase.md）
- **合計ページ**: 104個（page.md）
- **v2.0準拠率**: 約93%（101/105 usecases）
- **移行対象**: 4オペレーション、14ページファイル

### v2.0仕様準拠状況

#### ✅ 完全準拠サービス（5サービス）
以下のサービスは既にv2.0仕様に準拠しています：

1. **collaboration-facilitation-service**
   - usecases内に usecase.md + page.md の1対1構造

2. **knowledge-co-creation-service**
   - usecases内に usecase.md + page.md の1対1構造

3. **productivity-visualization-service**
   - usecases内に usecase.md + page.md の1対1構造

4. **revenue-optimization-service**
   - usecases内に usecase.md + page.md の1対1構造

5. **secure-access-service**
   - usecases内に usecase.md + page.md の1対1構造

#### ⚠️ 部分準拠サービス（2サービス）

1. **project-success-service**
   - 一部のオペレーションで旧v1.0構造が残存
   - 移行対象: 3オペレーション、12ページ

2. **talent-optimization-service**
   - 一部のオペレーションで旧v1.0構造が残存
   - 移行対象: 1オペレーション、2ページ

---

## 🎯 移行対象の詳細

### 1. project-success-service（3オペレーション）

#### 1-1. decompose-and-define-tasks
**パス**: `capabilities/plan-and-structure-project/operations/decompose-and-define-tasks/`

**現状**:
```
decompose-and-define-tasks/
└── pages/
    ├── create-wbs-page.md
    ├── define-task-dependencies-page.md
    ├── define-task-details-page.md
    └── estimate-task-effort-page.md
```

**移行後**:
```
decompose-and-define-tasks/
└── usecases/
    ├── create-wbs/
    │   ├── usecase.md
    │   └── page.md
    ├── define-task-dependencies/
    │   ├── usecase.md
    │   └── page.md
    ├── define-task-details/
    │   ├── usecase.md
    │   └── page.md
    └── estimate-task-effort/
        ├── usecase.md
        └── page.md
```

#### 1-2. optimally-allocate-resources
**パス**: `capabilities/plan-and-structure-project/operations/optimally-allocate-resources/`

**現状**:
```
optimally-allocate-resources/
└── pages/
    ├── allocate-resources-page.md
    ├── monitor-resource-usage-page.md
    ├── optimize-allocation-page.md
    └── resolve-resource-conflicts-page.md
```

**移行後**:
```
optimally-allocate-resources/
└── usecases/
    ├── allocate-resources/
    │   ├── usecase.md
    │   └── page.md
    ├── monitor-resource-usage/
    │   ├── usecase.md
    │   └── page.md
    ├── optimize-allocation/
    │   ├── usecase.md
    │   └── page.md
    └── resolve-resource-conflicts/
        ├── usecase.md
        └── page.md
```

#### 1-3. visualize-and-control-progress
**パス**: `capabilities/monitor-and-ensure-quality/operations/visualize-and-control-progress/`

**現状**:
```
visualize-and-control-progress/
└── pages/
    ├── control-progress-page.md
    ├── monitor-kpi-page.md
    ├── track-milestones-page.md
    └── visualize-project-status-page.md
```

**移行後**:
```
visualize-and-control-progress/
└── usecases/
    ├── control-progress/
    │   ├── usecase.md
    │   └── page.md
    ├── monitor-kpi/
    │   ├── usecase.md
    │   └── page.md
    ├── track-milestones/
    │   ├── usecase.md
    │   └── page.md
    └── visualize-project-status/
        ├── usecase.md
        └── page.md
```

### 2. talent-optimization-service（1オペレーション）

#### 2-1. execute-skill-development
**パス**: `capabilities/execute-skill-development/operations/execute-skill-development/`

**現状**:
```
execute-skill-development/
└── pages/
    ├── execute-training-page.md
    └── track-skill-improvement-page.md
```

**移行後**:
```
execute-skill-development/
└── usecases/
    ├── execute-training/
    │   ├── usecase.md
    │   └── page.md
    └── track-skill-improvement/
        ├── usecase.md
        └── page.md
```

---

## 🔧 移行手順

### Phase 1: ディレクトリ構造の作成

各ページファイルに対して、以下の手順を実行：

1. **ユースケース名の抽出**
   - ページファイル名から `-page.md` を除去
   - 例: `create-wbs-page.md` → `create-wbs`

2. **ユースケースディレクトリの作成**
   ```bash
   mkdir -p usecases/[usecase-name]/
   ```

3. **ページファイルの移動と改名**
   ```bash
   mv pages/[usecase-name]-page.md usecases/[usecase-name]/page.md
   ```

### Phase 2: usecase.mdファイルの生成

各ユースケースディレクトリに `usecase.md` を作成：

**テンプレート構造**:
```markdown
# ユースケース: [ユースケース名]

## ユースケース概要

### 目的
[このユースケースの目的と提供価値]

### アクター
- **主アクター**: [主要利用者]
- **副アクター**: [システム・他の利用者]

### 事前条件
1. [条件1]
2. [条件2]

### 事後条件
1. [結果状態1]
2. [結果状態2]

### トリガー
[ユースケース開始の契機]

## 🏗️ パラソルドメイン連携

### 操作エンティティ
- **[EntityName]**: [操作内容]（状態変更: [state1] → [state2]）

### 集約操作
- **[AggregateRoot]**: [集約処理の責務・不変条件]

### ドメインサービス利用
- **[ServiceName]**:
  - `[methodName]()`: [メソッドの責務・ビジネス価値]

## 基本フロー

1. [ステップ1]
2. [ステップ2]
3. [ステップ3]

## 代替フロー

### 代替フロー1: [条件]
1. [代替ステップ1]
2. [代替ステップ2]

## 例外フロー

### 例外1: [エラー条件]
1. [例外処理ステップ1]
2. [例外処理ステップ2]

## ビジネスルール

1. **[ルール名]**: [ルールの詳細]
2. **[ルール名]**: [ルールの詳細]

## 非機能要件

- **パフォーマンス**: [要件]
- **セキュリティ**: [要件]
- **可用性**: [要件]
```

### Phase 3: 旧ディレクトリの削除

全てのファイルを移行後、旧 `pages/` ディレクトリを削除：

```bash
rm -rf pages/
```

### Phase 4: 検証

移行完了後、以下を確認：

1. **1対1関係の確認**
   ```bash
   # usecase.md数とpage.md数が一致すること
   find docs/parasol/services -path "*/usecases/*/usecase.md" | wc -l
   find docs/parasol/services -path "*/usecases/*/page.md" | wc -l
   ```

2. **旧構造の不在確認**
   ```bash
   # usecases外のpagesディレクトリが存在しないこと
   find docs/parasol/services -type d -name "pages" ! -path "*/usecases/*"
   # → 結果が0件であること
   ```

3. **v2.0準拠率の確認**
   ```bash
   # 全サービスが100%準拠していること
   echo "v2.0準拠率: 100%"
   ```

---

## 📋 移行チェックリスト

### project-success-service

- [ ] decompose-and-define-tasks
  - [ ] create-wbs ユースケース作成
  - [ ] define-task-dependencies ユースケース作成
  - [ ] define-task-details ユースケース作成
  - [ ] estimate-task-effort ユースケース作成
  - [ ] 旧pagesディレクトリ削除

- [ ] optimally-allocate-resources
  - [ ] allocate-resources ユースケース作成
  - [ ] monitor-resource-usage ユースケース作成
  - [ ] optimize-allocation ユースケース作成
  - [ ] resolve-resource-conflicts ユースケース作成
  - [ ] 旧pagesディレクトリ削除

- [ ] visualize-and-control-progress
  - [ ] control-progress ユースケース作成
  - [ ] monitor-kpi ユースケース作成
  - [ ] track-milestones ユースケース作成
  - [ ] visualize-project-status ユースケース作成
  - [ ] 旧pagesディレクトリ削除

### talent-optimization-service

- [ ] execute-skill-development
  - [ ] execute-training ユースケース作成
  - [ ] track-skill-improvement ユースケース作成
  - [ ] 旧pagesディレクトリ削除

### 最終検証

- [ ] usecase.md数 = page.md数 = 119（105 + 14新規）
- [ ] usecases外のpagesディレクトリ = 0件
- [ ] v2.0準拠率 = 100%

---

## 🎯 成功基準

### 定量的指標

- **v2.0仕様準拠率**: 100%（現状93% → 目標100%）
- **1対1関係達成率**: 100%（usecase.md数 = page.md数）
- **旧構造残存数**: 0件（分離pagesディレクトリ）

### 定性的指標

- 全サービスで統一されたディレクトリ構造
- パラソル開発ガイドとの完全整合性
- 新規開発者がすぐに理解できる明確な構造

---

## 📚 参照ドキュメント

- [パラソル設計ディレクトリ構造標準仕様 v2.0](./directory-structure-standard-v2.md)
- [パラソル開発ガイド](./PARASOL_DEVELOPMENT_GUIDE.md)
- [パラソル設計の実際のMDファイル構造](./ACTUAL_MD_FILE_STRUCTURE.md)

---

## 📝 移行履歴

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| 2025-10-23 | 移行計画書作成 | Claude | ✅ 完了 |
| - | 移行実施 | - | 🔄 予定 |
| - | 最終検証 | - | 📋 予定 |

---

**備考**: この移行計画は、パラソル設計v2.0仕様への完全準拠を目的としています。移行作業は段階的に実施し、各フェーズで十分な検証を行います。
