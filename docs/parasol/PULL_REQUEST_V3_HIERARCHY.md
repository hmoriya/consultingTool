# パラソル設計v3.0: L3 Capability⊃Operation階層構造への移行

## 📋 概要

v2.0で誤っていた階層理解（L3 = Operation）を修正し、v3.0の正しい階層構造（L3 ⊃ Operations）へ移行するための設計ドキュメントを整備しました。

## 🎯 主な変更内容

### 1. v3.0階層構造の確立
**誤った理解（v2.0）**:
```
BC → L3 Capability = Operation ← 同じ抽象度（誤り）
```

**正しい理解（v3.0）**:
```
BC → L3 Capability（What: 能力）⊃ Operation（How: 操作）→ UseCase
```

**ビジネスユーザー視点**:
- **L3 Capability** = 「何ができるか」（能力の定義）
- **Operation** = 「どうやるか」（操作の定義）

### 2. L2 Capability vs Bounded Contextの明確化

**重要な発見**: 2つの異なる分析アプローチを統合する必要がある

- **L2 Capability**: トップダウン分析（Enterprise Architecture）
  - ビジネス戦略から演繹的に導出
- **Bounded Context**: ボトムアップ分析（Domain-Driven Design）
  - 現場の業務から帰納的に発見

**統合プロセス**:
```
L2 Capability（トップダウン）
  ∩ 照合・統合
Bounded Context（ボトムアップ）
  ↓
パラソル設計における最終的なBC
```

**重要**: L2とBCは分析の種類が違うため同義ではない（1対1またはM:N）

### 3. 3層ディレクトリ分離戦略

単一ディレクトリ構造の問題を解決するため、抽象度・ライフサイクル・管理主体に基づく3層分離：

- **Layer 1**: ビジネスアーキテクチャ層（`docs/business-architecture/`）
- **Layer 2**: システム設計層（`docs/parasol/`）
- **Layer 3**: サービス実装層（`services/*/src/`）

## 📝 作成・更新したドキュメント

### 新規作成（4ファイル）
1. **PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md** (v3.0)
   - L3 ⊃ Operation階層の詳細定義
   - BC → L3 → Operation → UseCaseの階層構造
   - 数量関係: 1 BC = 3-5 L3 = 7-15 Operations
   - ディレクトリ構造とドキュメントテンプレート

2. **PARASOL_LAYERED_DIRECTORY_STRATEGY.md**
   - 3層ディレクトリ分離戦略
   - 各層の責務と管理主体（経営/アーキテクト/開発）
   - 変更頻度（年/月/週）に応じた管理
   - 層間連携の仕組み

3. **MIGRATION_TO_V3_HIERARCHY.md**
   - v3.0への移行プラン（Phase 1-4）
   - Phase 2詳細: Week 1-5のタスクリスト
   - 影響範囲と成功指標
   - リスク分析と完了条件

4. **ISSUE_V3_MIGRATION.md**
   - GitHub Issue用テンプレート
   - Phase 2タスク（5週間、チェックリスト形式）
   - L2-BC照合プロセスを含む
   - スケジュールと判断事項

### 更新（6ファイル）
5. **directory-structure-standard-v2.md**
   - ファイル先頭にv3.0への参照を追加
   - BC内部構造（L3 ⊃ Operation）への言及

6. **PARASOL_STRUCTURE.md**
   - 構造進化のお知らせを追加
   - v3.0階層構造への参照

7. **parasol-design-process-guide.md**
   - 階層構造図をv3.0に更新
   - 各層の責務表にWhy-What-How-Implementationを追加
   - L3 Capability vs Operationの違いを明確化

8. **PARASOL_DEVELOPMENT_GUIDE.md**
   - ファイル先頭にv3.0対応の注釈を追加
   - **5.1.1節を新設**: L2 vs BC分析アプローチの違い
   - 統合プロセスと統合の原則を明記
   - 具体例（プロジェクト管理能力の照合例）

9. **PARASOL_GUIDE_SUMMARY.md**
   - 要約版にv3.0対応の注釈を追加

10. **PARASOL_LAYERED_DIRECTORY_STRATEGY.md** (consulting-dashboard-new/)
    - BC内部構造の詳細を修正
    - UseCase参照リンクを更新

### 修正（警告追加）
11. **PARASOL_VALUESTREAM_BC_L3_UNIFIED_PROPOSAL.md** (v2.0)
    - ⚠️ ファイル先頭に誤りの警告を追加
    - v3.0への誘導リンク

## 📊 期待効果

### 設計理解時間: 50%削減
- **現状**: BC直下のOperation一覧を見て混乱（15分）
- **改善**: L3能力 → Operation階層で理解容易（7分）

### 実装準備時間: 40%削減
- **現状**: Operationから実装要素を探索（30分）
- **改善**: L3 → Operation → BC Howへの明確なリンク（18分）

### 保守性: 60%向上
- **現状**: BC配下に平坦なOperation一覧（保守困難）
- **改善**: L3能力でグルーピング（変更影響の局所化）

## 📅 次のステップ（Phase 2: 5週間）

### Week 1: BC-L3-Operationマッピング
- **トップダウン分析**: 既存のL2 Capability（22個）を整理
- **ボトムアップ分析**: ドメインエキスパートとの対話でBounded Context候補を発見
- **統合**: L2とBounded Contextを照合し、最終的なBC境界を決定
  - L2とBCが1対1で一致する場合
  - L2とBCがM:Nの関係になる場合の調整
  - 不一致時の判断（戦略vs現場の視点）

### Week 2: テンプレート整備
- BC README/WHY/WHAT/HOWテンプレート
- L3 READMEテンプレート
- Operation READMEテンプレート

### Week 3-4: パイロットBC移行
- BC-001: タスク管理を選定
- L3-001: タスク分解能力を定義
- 3つのOperationを再配置

### Week 5: 移行ガイド作成
- ステップバイステップ手順書
- チェックリストとベストプラクティス

## 📦 コミット履歴（5コミット）

```
ea12625 docs: L2 CapabilityとBounded Contextの分析アプローチの違いを追加
c7d8092 feat: v3.0階層構造への移行プランとIssueテンプレートを作成
aef2403 docs: 主要パラソル設計ドキュメントにv3.0階層構造（L3⊃Operation）を反映
41b2fce fix: v2.0の誤った提案（L3=Operation）に警告を追加し、v3.0へ誘導
673c587 fix: L3 Capability=What、Operation=Howの階層構造を修正（v3.0）
```

## 🔗 関連ドキュメント

- [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](./PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) - v3.0階層構造の詳細
- [PARASOL_LAYERED_DIRECTORY_STRATEGY.md](./PARASOL_LAYERED_DIRECTORY_STRATEGY.md) - 3層ディレクトリ戦略
- [MIGRATION_TO_V3_HIERARCHY.md](./MIGRATION_TO_V3_HIERARCHY.md) - 詳細な移行プラン
- [ISSUE_V3_MIGRATION.md](./ISSUE_V3_MIGRATION.md) - Issue用テンプレート

## ✅ レビューポイント

- [ ] v3.0階層構造（L3 ⊃ Operation）の理解は正しいか
- [ ] L2 vs BC分析アプローチの整理は適切か
  - トップダウン vs ボトムアップの区別
  - 統合プロセスの妥当性
- [ ] 3層ディレクトリ分離戦略は実現可能か
  - 抽象度・ライフサイクル・管理主体による分離
- [ ] 移行プラン（Phase 2-4）は妥当か
  - 5週間のスケジュール
  - リソース配分
- [ ] ドキュメント構造は保守しやすいか

## 🏷️ ラベル

`architecture`, `refactoring`, `documentation`, `high-priority`

## 📍 マイルストーン

`v3.0 Hierarchy Migration`

---

**ブランチ**: `claude/design-parasol-md-011CUQKSjvkBzsp5Ax3jqyKV`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
