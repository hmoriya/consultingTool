# V2/V3ディレクトリ構造 共存移行戦略

**作成日**: 2025-10-31
**バージョン**: 1.0.0
**目的**: V2とV3の段階的移行を安全に実施するための共存戦略

---

## 🎯 共存戦略の概要

V2（サービスベース）とV3（BCベース）のディレクトリ構造を一定期間共存させ、段階的に移行することで、リスクを最小化しながらスムーズな移行を実現します。

## 📊 共存期間の設計

### 全体スケジュール（推奨: 6-8週間）

| フェーズ | 期間 | V2状態 | V3状態 | アクション |
|---------|------|--------|--------|-----------|
| **Phase 0: 準備** | 1週間 | 🟢 稼働中 | ⚫ 未構築 | V3構造の設計・計画 |
| **Phase 1: 並行構築** | 2-4週間 | 🟢 稼働中 | 🟡 構築中 | V3構造の作成、相互リンク設定 |
| **Phase 2: クロスリファレンス** | 2-3週間 | 🟢 稼働中 | 🟢 部分稼働 | 両構造を参照可能に |
| **Phase 3: 段階的移行** | 1-2週間 | 🟡 参照のみ | 🟢 メイン稼働 | V3へ主要参照を移行 |
| **Phase 4: V2アーカイブ** | 1週間 | 🔴 アーカイブ | 🟢 完全稼働 | V2を読み取り専用化 |

---

## 🗂️ ディレクトリ構造（共存期間）

```
docs/parasol/
│
├── services/                           # V2構造（既存・継続稼働）
│   ├── project-success-service/
│   │   ├── service.md
│   │   ├── domain-language.md
│   │   ├── api-specification.md
│   │   └── capabilities/
│   │       └── plan-and-structure-project/
│   │           └── operations/
│   │               └── decompose-and-define-tasks/
│   │                   └── usecases/
│   │                       └── create-wbs/
│   │                           ├── usecase.md
│   │                           └── page.md
│   └── ...
│
├── business-capabilities/              # V3構造（新規・構築中）
│   ├── BC-001-task-management/
│   │   ├── README.md              # BC概要（Why・What含む）
│   │   ├── domain/                # How詳細: ドメイン設計
│   │   │   ├── README.md
│   │   │   ├── aggregates.md
│   │   │   ├── entities.md
│   │   │   └── value-objects.md
│   │   ├── api/                   # What詳細: API設計
│   │   │   ├── README.md
│   │   │   ├── api-specification.md  # Issue #146対応済み
│   │   │   ├── endpoints.md
│   │   │   └── schemas.md
│   │   ├── data/                  # How詳細: データ設計
│   │   │   ├── README.md
│   │   │   ├── database-design.md
│   │   │   └── data-flow.md
│   │   └── capabilities/
│   │       └── L3-001-task-decomposition/
│   │           ├── README.md
│   │           └── operations/
│   │               └── OP-001-create-wbs/
│   │                   ├── README.md
│   │                   └── usecases/
│   │                       └── create-wbs/
│   │                           ├── usecase.md
│   │                           └── page.md
│   └── ...
│
├── services-registry/                  # サービスレジストリ（新規）
│   └── project-success-service/
│       ├── service.md                  # サービス定義を保持
│       └── bc-mappings.md              # 使用するBC一覧
│
├── MIGRATION_STATUS.md                 # 移行ステータス管理
├── V2_V3_MAPPING.md                    # V2→V3マッピング表
└── V2_TO_V3_REDIRECT.md                # リダイレクト情報
```

---

## 🔗 相互参照の実装

### 1. V2からV3への参照

**services/project-success-service/service.md** に追記：

```markdown
# プロジェクト成功サービス

> ⚠️ **移行のお知らせ**: このサービスはV3構造へ移行中です。
>
> **新しい参照先**:
> - BC-001: タスク管理 → [../../business-capabilities/BC-001-task-management/](../../business-capabilities/BC-001-task-management/)
> - BC-002: リソース最適化 → [../../business-capabilities/BC-002-resource-optimization/](../../business-capabilities/BC-002-resource-optimization/)
>
> V2構造は2025年XX月XX日まで参照可能です。

## サービス概要
[既存の内容]
```

### 2. V3からV2への参照（移行元情報）

**business-capabilities/BC-001-task-management/README.md** に追記：

```markdown
# BC-001: タスク管理

> 📦 **移行元情報**: このBCは以下のV2構造から移行されました。
>
> - services/project-success-service/capabilities/plan-and-structure-project/
>
> 移行履歴: [MIGRATION_STATUS.md](../../MIGRATION_STATUS.md#bc-001)

## BC概要
[V3の内容]
```

---

## 📄 移行管理ドキュメント

### MIGRATION_STATUS.md

```markdown
# V2→V3 移行ステータス

**最終更新**: 2025-10-31

## 📊 移行進捗

| BC# | BC名 | V2移行元 | 移行状態 | 完了日 | 備考 |
|-----|------|----------|----------|--------|------|
| BC-001 | タスク管理 | project-success-service | 🟢 完了 | 2025-11-15 | - |
| BC-002 | リソース最適化 | project-success-service | 🟡 進行中 | - | L3-002作成中 |
| BC-003 | コラボレーション | collaboration-service | 🔴 未着手 | - | - |
| BC-004 | 知識共創 | knowledge-service | 🔴 未着手 | - | - |

### 凡例
- 🟢 完了: V3構造への移行完了、V2参照可能
- 🟡 進行中: V3構造を構築中、V2を継続参照
- 🔴 未着手: V2のみ利用可能

## 🔗 V2構造の利用可能期限

- **Phase 1-3期間中**: 全てのV2構造が利用可能
- **Phase 4以降**: 読み取り専用（アーカイブ）
- **完全削除予定**: 2025年XX月XX日（移行完了の3ヶ月後）
```

### V2_V3_MAPPING.md

```markdown
# V2→V3 マッピング表

## サービス → BC マッピング

| V2サービス | V3 BC | 説明 |
|-----------|-------|------|
| project-success-service | BC-001, BC-002, BC-003 | タスク管理、リソース最適化、進捗可視化 |
| talent-optimization-service | BC-004, BC-005 | タレント開発、スキル最適化 |
| collaboration-facilitation-service | BC-006 | コラボレーション促進 |
| knowledge-co-creation-service | BC-007 | 知識共創 |
| revenue-optimization-service | BC-008, BC-009 | 収益最適化、予算管理 |
| secure-access-service | BC-010 | セキュアアクセス |
| productivity-visualization-service | BC-011 | 生産性可視化 |

## Capability → L3 マッピング

### project-success-service

| V2 Capability | V3 L3 Capability | 親BC |
|--------------|------------------|------|
| plan-and-structure-project | L3-001: タスク分解能力 | BC-001 |
| | L3-002: 工数見積能力 | BC-001 |
| | L3-003: スケジュール計画能力 | BC-001 |
| optimally-allocate-resources | L3-001: リソース配分能力 | BC-002 |
| | L3-002: リソース最適化能力 | BC-002 |

## Operation マッピング

### BC-001: タスク管理

| V2 Operation | V3 Operation | 親L3 |
|-------------|--------------|------|
| decompose-and-define-tasks | OP-001: WBSを作成する | L3-001 |
| | OP-002: タスク依存関係を定義する | L3-001 |
| | OP-003: タスクを分解する | L3-001 |
```

---

## 🛠️ 開発者向けガイド

### Phase 1-2: V2を参照する場合

```markdown
# 既存プロジェクトでの参照

現在進行中のプロジェクトは、引き続きV2構造を参照してください。

**参照パス例**:
- docs/parasol/services/project-success-service/capabilities/...
- docs/parasol/services/talent-optimization-service/capabilities/...

**注意**: V2ドキュメントの先頭に移行先（V3）へのリンクが表示されます。
```

### Phase 2-3: V3を参照する場合

```markdown
# 新規プロジェクトでの参照

新規プロジェクトは、V3構造を参照してください。

**参照パス例**:
- docs/parasol/business-capabilities/BC-001-task-management/...
- docs/parasol/business-capabilities/BC-002-resource-optimization/...

**注意**: V3ドキュメントに移行元（V2）の情報が記載されています。
```

### Phase 3-4: 両方を参照する場合

```markdown
# クロスリファレンス期間

両構造を参照可能な期間です。

**推奨アプローチ**:
1. **新機能開発**: V3構造を参照
2. **既存機能保守**: V2構造を参照（移行先を確認）
3. **ドキュメント作成**: V3構造に作成

**参照優先順位**: V3 > V2
```

---

## 🔍 検証・確認方法

### 共存期間中のチェックリスト

#### 1. ディレクトリ整合性チェック

```bash
#!/bin/bash
# check-coexistence.sh

echo "🔍 V2/V3共存状態チェック"

# V2構造の存在確認
v2_count=$(find docs/parasol/services -name "usecase.md" | wc -l)
echo "V2 UseCases: $v2_count"

# V3構造の存在確認
v3_count=$(find docs/parasol/business-capabilities -name "usecase.md" 2>/dev/null | wc -l)
echo "V3 UseCases: $v3_count"

# 重複チェック（同じUseCaseが両方に存在する場合）
echo ""
echo "🔗 重複確認（同じ内容のUseCaseが両構造に存在）"
# 実装は移行進捗に応じて調整
```

#### 2. リンク整合性チェック

```bash
#!/bin/bash
# check-links.sh

echo "🔗 リンク整合性チェック"

# V2からV3へのリンクチェック
echo "V2→V3リンク確認..."
grep -r "business-capabilities" docs/parasol/services/ | wc -l

# V3からV2へのリンクチェック
echo "V3→V2リンク確認..."
grep -r "services/" docs/parasol/business-capabilities/ | wc -l

# 壊れたリンクの検出
echo "壊れたリンク検出..."
find docs/parasol -name "*.md" -exec markdown-link-check {} \; | grep "✖"
```

#### 3. 移行進捗チェック

```bash
#!/bin/bash
# check-migration-progress.sh

echo "📊 移行進捗チェック"

# BC数のカウント
bc_count=$(find docs/parasol/business-capabilities -maxdepth 1 -type d -name "BC-*" | wc -l)
echo "作成済みBC数: $bc_count"

# L3数のカウント
l3_count=$(find docs/parasol/business-capabilities -type d -name "L3-*" | wc -l)
echo "作成済みL3数: $l3_count"

# 移行完了率の計算
total_services=7
migration_rate=$((bc_count * 100 / total_services))
echo "移行完了率: ${migration_rate}%"

if [ $migration_rate -ge 80 ]; then
  echo "✅ Phase 3（段階的移行）へ進行可能"
elif [ $migration_rate -ge 50 ]; then
  echo "🟡 Phase 2（クロスリファレンス）継続中"
else
  echo "🔵 Phase 1（並行構築）継続中"
fi
```

---

## ⚠️ 注意事項と制約

### 共存期間中の制約

| 項目 | 制約内容 | 対応方法 |
|------|---------|----------|
| **ディスク容量** | 一時的に2倍の容量を使用 | 定期的な不要ファイル削除 |
| **検索の複雑化** | 両構造から検索結果が混在 | 検索パスを明示的に指定 |
| **ドキュメント更新** | 同じ内容を2箇所に更新の可能性 | V3優先、V2は読み取り専用化 |
| **開発者の混乱** | どちらを参照すべきか迷う | MIGRATION_STATUS.mdで明示 |

### リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| **V2とV3で内容が乖離** | 高 | V2を早期に読み取り専用化 |
| **移行の長期化** | 中 | 明確な期限とマイルストーンを設定 |
| **リンク切れ** | 中 | 自動チェックスクリプトを定期実行 |
| **ツール非対応** | 低 | パーサーを段階的に更新 |

---

## 🎯 Phase別の成功基準

### Phase 1: 並行構築期

- [ ] V3のBCディレクトリが全て作成済み
- [ ] V2からV3へのリンクが全て設定済み
- [ ] MIGRATION_STATUS.mdが最新状態
- [ ] 両構造が独立して機能している

### Phase 2: クロスリファレンス期

- [ ] V3のREADME.mdが全て作成済み
- [ ] 新規プロジェクトがV3を参照開始
- [ ] V2とV3の内容が同期している
- [ ] 移行完了率が50%以上

### Phase 3: 段階的移行期

- [ ] 主要な参照がV3に移行済み
- [ ] V2が読み取り専用に設定済み
- [ ] 移行完了率が80%以上
- [ ] V2アーカイブの準備完了

### Phase 4: V2アーカイブ期

- [ ] 全ての新規参照がV3のみ
- [ ] V2がservices-v2-archiveに移動
- [ ] V3が100%稼働
- [ ] ドキュメントが全て更新済み

---

## 📚 関連ドキュメント

- [V3ディレクトリ構造への移行 GitHub Issue](#) - メインのissue
- [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](./PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) - v3.0階層構造
- [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) - リアルタイム移行ステータス
- [V2_V3_MAPPING.md](./V2_V3_MAPPING.md) - 詳細マッピング表

---

## 📝 まとめ

### 共存戦略の利点

1. **リスク最小化**: 段階的移行により、一度に全てを変更するリスクを回避
2. **継続性確保**: 既存プロジェクトへの影響を最小限に抑制
3. **柔軟な移行**: 問題発生時にV2へのロールバックが可能
4. **学習期間**: 開発チームがV3構造に慣れる時間を確保

### 推奨タイムライン

```
Week 1-2:   Phase 0 (準備)
Week 3-6:   Phase 1 (並行構築) ← V2とV3が共存
Week 7-9:   Phase 2 (クロスリファレンス) ← 両方を参照可能
Week 10-11: Phase 3 (段階的移行) ← V3メインに移行
Week 12:    Phase 4 (V2アーカイブ) ← V3のみに統一
```

---

**次のアクション**:
1. MIGRATION_STATUS.mdの作成
2. V2_V3_MAPPING.mdの作成
3. V2ドキュメントへの移行通知追加
4. Phase 1の開始
