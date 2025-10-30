# パラソル設計v3.0階層構造への移行プラン

## 📋 Issue概要

**タイトル**: パラソル設計をv3.0階層構造（L3 Capability ⊃ Operation）へ移行

**優先度**: High

**タイプ**: Architecture / Refactoring

**マイルストーン**: v3.0 Hierarchy Migration

---

## 🎯 背景・目的

### 問題の発見
v2.0では「**L3 Capability = Business Operation（同じ抽象度）**」と誤って理解していました。

### 正しい理解（v3.0）
- **L3 Capability = What**（何ができるか：能力の定義）
- **Business Operation = How**（どうやるか：能力を実現する操作）
- **L3 ⊃ Operations**（L3能力は複数のOperationを含む親子関係）

### 移行の目的
1. **ビジネスユーザー視点の明確化**: Capability（能力）とOperation（操作）を分離
2. **設計の階層性の確立**: BC → L3 → Operation → UseCaseの明確な階層
3. **Why-What-How責務の適正化**: 各層の責務を明確に定義
4. **ドキュメント構造の最適化**: 情報の重複を排除し、保守性を向上

### 重要な前提：L2 Capability vs Bounded Context

パラソル設計では、**2つの異なる分析アプローチ**を統合します。

#### L2 Capability: トップダウン分析（演繹的）
```
企業戦略・ビジネス価値
  ↓ 分解
ValueStream → ValueStage → L1 → L2 Capability
```
- **Enterprise Architecture**的アプローチ
- ビジネス戦略から演繹的に導出
- 主導：経営層、事業企画部門

#### Bounded Context: ボトムアップ分析（帰納的）
```
実際の業務プロセス
  ↓ ドメイン分析
ユビキタス言語の抽出 → Bounded Context
```
- **Domain-Driven Design**的アプローチ
- 現場の業務から帰納的に発見
- 主導：ドメインエキスパート、アーキテクト

#### 統合プロセス
```
L2 Capability（トップダウン）
  ∩ 照合・統合
Bounded Context（ボトムアップ）
  ↓
パラソル設計における最終的なBC
```

**重要**: L2とBounded Contextは**分析の種類が違う**ため同義ではありません。
- 1対1になる場合もあれば、M:Nの関係になる可能性もある
- 両方の分析結果を照らし合わせて最適な設計境界を決定

---

## ❌ v2.0の問題点

### 誤った階層理解
```
BC (Business Capability)
  └── L3 Capability = Operation ← 同じ抽象度（誤り）
      └── UseCase
```

### 問題点
1. **能力（Capability）と操作（Operation）の区別がない**
   - ビジネスユーザーが「何ができるか」を理解しにくい
   - 実装者が「どうやるか」を見つけにくい

2. **階層が浅すぎる**
   - BC直下にOperationが並び、粒度がバラバラ
   - 1 BC = 7-15 Operationsで管理が困難

3. **ディレクトリ構造の問題**
   ```
   BC-XXX/
   └── operations/
       ├── OP-001/  # L3能力なのか操作なのか不明
       ├── OP-002/
       └── OP-003/
   ```

---

## ✅ v3.0の正しい構造

### 正しい階層理解
```
BC (Business Capability)
├── Why: ビジネス価値
├── What: L3能力一覧
└── How: ドメイン・API・DB設計
    └── L3 Capability（What: 能力の定義）
        ├── What: この能力で実現できること
        └── Operations（How: 能力を実現する操作群）
            └── Operation（How: 具体的な操作）
                └── UseCases（Implementation）
```

### 数量関係
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
└── L3-003: スケジュール計画能力（2 Operations）

合計: 1 BC = 3 L3 = 7 Operations = 11 UseCases
```

### 正しいディレクトリ構造
```
docs/parasol/business-capabilities/
└── BC-001-task-management/
    ├── README.md                      # BC概要（Why-What-How）
    ├── WHY.md                         # ビジネス価値
    ├── WHAT.md                        # L3能力一覧
    ├── HOW.md                         # 設計方針
    ├── domain/                        # How詳細
    ├── api/
    ├── data/
    └── capabilities/                  # ⭐ L3能力層
        └── L3-001-task-decomposition/
            ├── README.md              # 能力定義（What）
            └── operations/            # ⭐ 操作層
                ├── OP-001-create-wbs/
                │   ├── README.md      # 操作定義（How）
                │   └── usecases/
                ├── OP-002-define-dependencies/
                └── OP-003-decompose-tasks/
```

---

## 🚀 移行内容

### Phase 1: ドキュメント整備（完了）

- [x] v3.0階層構造の定義
  - [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) 作成
- [x] 3層ディレクトリ分離戦略
  - [PARASOL_LAYERED_DIRECTORY_STRATEGY.md](PARASOL_LAYERED_DIRECTORY_STRATEGY.md) 作成
- [x] v2.0文書の修正
  - 誤った提案に警告を追加
  - v3.0へのリンク追加
- [x] 主要設計ドキュメントの更新
  - directory-structure-standard-v2.md
  - PARASOL_STRUCTURE.md
  - parasol-design-process-guide.md
  - PARASOL_DEVELOPMENT_GUIDE.md
  - PARASOL_GUIDE_SUMMARY.md

### Phase 2: BC内部構造の再設計（このIssue）

#### 2.1 BCマッピングの作成
- [ ] 既存の7サービス、22ケーパビリティをBCとして整理
- [ ] 各BCのL3能力を特定（1 BC = 3-5 L3）
- [ ] 各L3のOperationをマッピング（1 L3 = 2-4 Ops）

**成果物**: `docs/parasol/BC_L3_OPERATION_MAPPING.md`

#### 2.2 BC設計書テンプレートの作成
- [ ] BC README.mdテンプレート
- [ ] BC WHY.mdテンプレート
- [ ] BC WHAT.mdテンプレート
- [ ] BC HOW.mdテンプレート
- [ ] L3 README.mdテンプレート
- [ ] Operation README.mdテンプレート

**成果物**: `docs/parasol/templates/v3/`

#### 2.3 パイロットBCの移行
- [ ] BC-001: タスク管理BCを選定
- [ ] BC内部にcapabilities/ディレクトリ作成
- [ ] L3-001: タスク分解能力を作成
- [ ] L3配下にoperations/ディレクトリ作成
- [ ] 3つのOperationを再配置

**成果物**: 実際のBC-001ディレクトリ構造

### Phase 3: 全BCの段階的移行（次のIssue）

#### 優先順位
1. **Priority 1**: コアBC（project-success-service）
   - BC-001: タスク管理
   - BC-002: プロジェクト立ち上げ

2. **Priority 2**: 頻繁に変更されるBC
   - BC-003: コラボレーション促進
   - BC-004: ナレッジ共創

3. **Priority 3**: 安定したBC
   - BC-005: 生産性可視化
   - BC-006: タレント最適化
   - BC-007: セキュアアクセス

### Phase 4: サービス実装層の対応（将来）

#### services/配下のディレクトリ構造更新
```
変更前:
services/project-success-service/src/
└── capabilities/
    └── task-management/
        └── operations/
            └── create-wbs/
                └── usecases/

変更後:
services/project-success-service/src/
└── capabilities/
    └── task-management/                    # BC-001
        └── capabilities/                   # L3層追加
            └── task-decomposition/         # L3-001
                └── operations/
                    └── create-wbs/         # OP-001
                        └── usecases/
```

---

## 📊 影響範囲

### ドキュメント
- **docs/parasol/business-capabilities/** 配下の全BC
  - 影響ファイル数: ~100ファイル
  - 新規作成: L3 README.md × 3-5個/BC

### 実装コード（将来対応）
- **services/*/src/capabilities/** 配下
  - ディレクトリ構造の変更
  - import pathの変更

### データベース（将来対応）
- APIインポート時のパス解決
- BC-L3-Operation階層の追加

---

## 📈 成功指標

### Phase 2完了時
- [ ] BC-L3-Operationマッピング完成（7サービス、22BC）
- [ ] v3.0テンプレート整備完了
- [ ] パイロットBC（BC-001）移行完了
- [ ] 移行ガイド作成完了

### 品質指標
- [ ] L3能力定義の明確性: 100%（What: 何ができるかが明確）
- [ ] Operation定義の完全性: 100%（How: どうやるかが明確）
- [ ] ドキュメント参照リンクの正確性: 100%

### ビジネス価値
- **設計理解時間**: 50%削減
  - 現状: BC直下のOperation一覧を見て混乱（15分）
  - 改善: L3能力 → Operation階層で理解容易（7分）

- **実装準備時間**: 40%削減
  - 現状: Operationから実装要素を探索（30分）
  - 改善: L3 → Operation → BC Howへの明確なリンク（18分）

- **保守性**: 60%向上
  - 現状: BC配下に平坦なOperation一覧（保守困難）
  - 改善: L3能力でグルーピング（変更影響の局所化）

---

## 📝 タスクリスト（Phase 2）

### Week 1: BC-L3-Operationマッピング
- [ ] **トップダウン分析**: 既存のL2 Capability（22個）を整理
- [ ] **ボトムアップ分析**: ドメインエキスパートとの対話でBounded Context候補を発見
- [ ] **統合**: L2とBounded Contextを照合し、最終的なBC境界を決定
  - L2とBCが1対1で一致する場合
  - L2とBCがM:Nの関係になる場合の調整
  - 不一致時の判断（戦略vs現場の視点）
- [ ] L3能力の抽出（各BCから3-5個）
- [ ] Operationの再分類（各L3配下に2-4個）
- [ ] マッピング表の作成（L2-BC照合結果を含む）

**担当**: アーキテクト + ドメインエキスパート
**成果物**: `BC_L3_OPERATION_MAPPING.md`（L2-BC照合結果を含む）

### Week 2: テンプレート整備
- [ ] BC READMEテンプレート作成
- [ ] BC WHY/WHAT/HOWテンプレート作成
- [ ] L3 READMEテンプレート作成
- [ ] Operation READMEテンプレート作成
- [ ] テンプレート使用ガイド作成

**担当**: アーキテクト
**成果物**: `docs/parasol/templates/v3/`

### Week 3-4: パイロットBC移行
- [ ] BC-001: タスク管理を選定
- [ ] L3-001: タスク分解能力を定義
- [ ] 3つのOperationを再配置
- [ ] ドキュメント作成
- [ ] レビュー・フィードバック反映

**担当**: アーキテクト + 開発チーム
**成果物**: 移行済みBC-001

### Week 5: 移行ガイド作成
- [ ] ステップバイステップ手順書
- [ ] チェックリスト作成
- [ ] ベストプラクティス文書化
- [ ] FAQ作成

**担当**: アーキテクト
**成果物**: `BC_MIGRATION_GUIDE_V3.md`

---

## 🔗 関連ドキュメント

### v3.0設計ドキュメント
- [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) - v3.0階層構造の詳細
- [PARASOL_LAYERED_DIRECTORY_STRATEGY.md](PARASOL_LAYERED_DIRECTORY_STRATEGY.md) - 3層ディレクトリ分離戦略

### 既存設計ドキュメント
- [directory-structure-standard-v2.md](directory-structure-standard-v2.md) - ディレクトリ構造標準
- [parasol-design-process-guide.md](parasol-design-process-guide.md) - 設計プロセスガイド
- [PARASOL_DEVELOPMENT_GUIDE.md](PARASOL_DEVELOPMENT_GUIDE.md) - 開発ガイド

### v2.0（廃止予定）
- [PARASOL_VALUESTREAM_BC_L3_UNIFIED_PROPOSAL.md](PARASOL_VALUESTREAM_BC_L3_UNIFIED_PROPOSAL.md) - v2.0提案（誤り）

---

## 💬 Discussion Points

### 質問・懸念事項
1. **既存実装への影響**
   - services/配下の実装コードはPhase 4で対応
   - Phase 2-3はドキュメントのみの変更

2. **移行期間中の混在**
   - v2.0とv3.0が一時的に混在する
   - 各ドキュメントにバージョン表記を明記

3. **チーム教育**
   - v3.0階層構造の理解促進
   - 移行ワークショップの開催

### 判断が必要な事項
- [ ] マッピング作業の担当者
- [ ] パイロットBCの最終選定
- [ ] Phase 3の開始タイミング

---

## ✅ 完了条件（Phase 2）

- [ ] BC-L3-Operationマッピング表が完成している
- [ ] v3.0テンプレートが整備され、使用可能である
- [ ] パイロットBC（BC-001）がv3.0構造に完全移行している
- [ ] 移行ガイドが作成され、レビュー済みである
- [ ] チームメンバーがv3.0階層構造を理解している

---

**作成日**: 2025-10-24
**作成者**: Claude (Architecture AI Assistant)
**レビュー**: 待ち
