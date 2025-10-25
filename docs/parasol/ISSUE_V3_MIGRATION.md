# パラソル設計をv3.0階層構造（L3 Capability ⊃ Operation）へ移行

## 📋 概要

v2.0で「L3 Capability = Business Operation（同じ抽象度）」と誤って理解していたため、v3.0の正しい階層構造（L3 ⊃ Operations）へ移行する。

## 🎯 目的

### v2.0の誤り
```
BC → L3 Capability = Operation ← 同じ抽象度（誤り）
```

### v3.0の正しい理解
```
BC → L3 Capability（What: 能力）⊃ Operation（How: 操作）→ UseCase
```

**ビジネスユーザー視点**:
- **L3 Capability** = 「何ができるか」（能力の定義）
- **Operation** = 「どうやるか」（操作の定義）

## 🔍 重要な前提：L2 Capability vs Bounded Context

### 分析アプローチの違い

パラソル設計では、**2つの異なる分析アプローチ**を統合します。

#### L2 Capability: トップダウン分析
```
企業戦略・ビジネス価値
  ↓ 分解
ValueStream → ValueStage
  ↓ 分解
L1 Capability（大分類）
  ↓ 分解
L2 Capability（中分類）← ビジネス戦略起点
```

**特徴**:
- Enterprise Architecture的なアプローチ
- ビジネス価値・戦略から演繹的に導出
- 経営層・事業企画部門が主導

#### Bounded Context: ボトムアップ分析
```
実際の業務プロセス
  ↓ 分析
ドメインエキスパートとの対話
  ↓ 発見
ユビキタス言語の抽出
  ↓ 境界発見
Bounded Context← ドメイン分析起点
```

**特徴**:
- Domain-Driven Design的なアプローチ
- 現場の業務・用語から帰納的に発見
- ドメインエキスパート・アーキテクトが主導

### 統合プロセス

```
トップダウン分析          ボトムアップ分析
（L2 Capability）         （Bounded Context）
       ↓                        ↓
       └──────→ 照合 ←──────┘
                 ↓
      パラソル設計における最終的なBC
                 ↓
            Service（実装単位）
                 ↓
          Microservice（デプロイ単位）
```

**重要**: L2とBounded Contextは**分析の種類が違う**ため同義ではありません。
- 一致する場合もあるが、必然ではない
- M:Nの関係になる可能性がある
- 両方の分析結果を照らし合わせて最適な設計境界を決定

## 📊 移行内容

### Phase 1: ドキュメント整備（✅ 完了）
- ✅ v3.0階層構造の定義
- ✅ 3層ディレクトリ分離戦略
- ✅ v2.0文書の修正
- ✅ 主要設計ドキュメントの更新

**成果物**:
- [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](./PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md)
- [PARASOL_LAYERED_DIRECTORY_STRATEGY.md](./PARASOL_LAYERED_DIRECTORY_STRATEGY.md)

### Phase 2: BC内部構造の再設計（このIssue）

#### 2.1 BCマッピングの作成（Week 1）
- [ ] **トップダウン分析**: 既存のL2 Capabilityを整理
- [ ] **ボトムアップ分析**: ドメインエキスパートとの対話でBounded Context候補を発見
- [ ] **統合**: L2とBounded Contextを照合し、最終的なBC境界を決定
- [ ] 各BCのL3能力を特定（1 BC = 3-5 L3）
- [ ] 各L3のOperationをマッピング（1 L3 = 2-4 Ops）

**担当**: アーキテクト + ドメインエキスパート
**成果物**: `BC_L3_OPERATION_MAPPING.md`（L2-BC照合結果を含む）

#### 2.2 BC設計書テンプレートの作成（Week 2）
- [ ] BC README.mdテンプレート
- [ ] BC WHY/WHAT/HOWテンプレート
- [ ] L3 README.mdテンプレート
- [ ] Operation README.mdテンプレート

**担当**: アーキテクト
**成果物**: `docs/parasol/templates/v3/`

#### 2.3 パイロットBCの移行（Week 3-4）
- [ ] BC-001: タスク管理を選定
- [ ] L3-001: タスク分解能力を定義
- [ ] 3つのOperationを再配置
- [ ] ドキュメント作成・レビュー

**担当**: アーキテクト + 開発チーム
**成果物**: 移行済みBC-001

#### 2.4 移行ガイド作成（Week 5）
- [ ] ステップバイステップ手順書
- [ ] チェックリスト作成
- [ ] ベストプラクティス文書化

**担当**: アーキテクト
**成果物**: `BC_MIGRATION_GUIDE_V3.md`

### Phase 3: 全BCの段階的移行（次のIssue）
優先順位に基づき、22BC全体を段階的に移行

### Phase 4: サービス実装層の対応（将来）
services/配下のディレクトリ構造を更新

## 📈 期待効果

### 設計理解時間: 50%削減
- 現状: BC直下のOperation一覧を見て混乱（15分）
- 改善: L3能力 → Operation階層で理解容易（7分）

### 実装準備時間: 40%削減
- 現状: Operationから実装要素を探索（30分）
- 改善: L3 → Operation → BC Howへの明確なリンク（18分）

### 保守性: 60%向上
- 現状: BC配下に平坦なOperation一覧（保守困難）
- 改善: L3能力でグルーピング（変更影響の局所化）

## 📊 成功指標

### Phase 2完了時
- [ ] BC-L3-Operationマッピング完成（7サービス、22BC）
- [ ] v3.0テンプレート整備完了
- [ ] パイロットBC（BC-001）移行完了
- [ ] 移行ガイド作成完了

### 品質指標
- [ ] L3能力定義の明確性: 100%
- [ ] Operation定義の完全性: 100%
- [ ] ドキュメント参照リンクの正確性: 100%

## 🔗 関連ドキュメント

- [詳細な移行プラン](./MIGRATION_TO_V3_HIERARCHY.md)
- [v3.0階層構造](./PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md)
- [3層ディレクトリ戦略](./PARASOL_LAYERED_DIRECTORY_STRATEGY.md)

## 📅 スケジュール

**開始**: 2025-10-24
**Phase 2完了目標**: 5週間後（2025-11-28）

**マイルストーン**:
- Week 1: BCマッピング完成
- Week 2: テンプレート完成
- Week 3-4: パイロットBC移行
- Week 5: 移行ガイド完成

## 💬 Discussion

### 判断が必要な事項
- [ ] マッピング作業の担当者確定
- [ ] パイロットBCの最終選定（BC-001推奨）
- [ ] Phase 3開始タイミング

---

**ラベル**: `architecture`, `refactoring`, `documentation`, `high-priority`
**マイルストーン**: `v3.0 Hierarchy Migration`
**優先度**: High
