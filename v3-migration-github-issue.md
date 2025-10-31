# V3ディレクトリ構造への移行

## 📋 概要

パラソル設計フレームワークのv3.0階層構造への移行を実施します。現在の`services/`ベースの構造から、新しい`business-capabilities/`ベースの構造へ移行し、L3 Capability層とOperation層の正しい親子関係を実現します。

## 🎯 背景と目的

### V2.0の誤り
```
❌ L3 Capability = Operation（同じ抽象度・同じ階層）
```

### V3.0の正しい理解
```
✅ L3 Capability = What（能力の定義）
✅ Operation = How（能力を実現する操作）
✅ L3 ⊃ Operations（L3能力は複数のOperationを含む親子関係）
```

### 移行の目的
1. **階層構造の明確化**: L3 Capability層とOperation層の親子関係を正しく表現
2. **設計品質の向上**: Why-What-Howの責務分離を徹底
3. **スケーラビリティの向上**: BC単位での設計情報の一元管理
4. **保守性の向上**: 統一された構造による理解しやすさの実現

## 📊 現状分析

### 対象サービス（7サービス）
- collaboration-facilitation-service
- knowledge-co-creation-service
- productivity-visualization-service
- project-success-service
- revenue-optimization-service
- secure-access-service
- talent-optimization-service

### 現在の構造（V2.0）
```
docs/parasol/services/
└── [service-name]/
    ├── service.md
    ├── domain-language.md
    ├── api-specification.md           # サービスレベル（廃止予定）
    ├── database-design.md
    ├── integration-specification.md
    ├── api/
    │   └── api-specification.md       # Issue #146対応済み（WHAT）
    └── capabilities/                   # ケーパビリティ層
        └── [capability-name]/
            └── operations/             # オペレーション層（Capability直下）
                └── [operation-name]/
                    ├── operation.md
                    └── usecases/
                        └── [usecase-name]/
                            ├── usecase.md
                            ├── page.md
                            └── api-usage.md  # Issue #146対応済み（HOW）
```

### ターゲット構造（V3.0）
```
docs/parasol/business-capabilities/
└── BC-001-[capability-name]/           # BC層（新設）
    ├── README.md                        # BC概要（Why・What概要含む）
    │
    ├── domain/                          # How詳細: ドメイン設計
    │   ├── README.md
    │   ├── aggregates.md
    │   ├── entities.md
    │   └── value-objects.md
    │
    ├── api/                             # What詳細: API設計
    │   ├── README.md
    │   ├── api-specification.md         # Issue #146対応済み
    │   ├── endpoints.md
    │   └── schemas.md
    │
    ├── data/                            # How詳細: データ設計
    │   ├── README.md
    │   ├── database-design.md
    │   └── data-flow.md
    │
    └── capabilities/                    # L3能力層（What）
        ├── L3-001-[capability-name]/
        │   ├── README.md                # 能力の定義（What）
        │   └── operations/              # 操作層（How）
        │       ├── OP-001-[operation-name]/
        │       │   ├── README.md        # 操作定義（How）
        │       │   └── usecases/
        │       │       └── [usecase-name]/
        │       │           ├── usecase.md
        │       │           ├── page.md
        │       │           └── api-usage.md  # Issue #146対応済み
        │       └── OP-002-[operation-name]/
        │           └── ...
        └── L3-002-[capability-name]/
            └── ...
```

## 🔄 主な変更点

### 1. ディレクトリ構造の変更

| 項目 | V2.0 | V3.0 |
|------|------|------|
| **ルートディレクトリ** | `services/` | `business-capabilities/` |
| **BC層** | なし | 新設（README + domain/api/data） |
| **L3層** | Capability = Operation | L3 Capability（What） |
| **Operation層** | Capability直下 | L3 Capability配下 |
| **設計ドキュメント** | サービス直下 | BC層に集約（domain/api/data） |
| **API仕様** | 2箇所（重複） | `api/api-specification.md` (Issue #146) |
| **API利用仕様** | 一部のみ | `api-usage.md` 全ユースケース (Issue #146) |

### 2. 階層別責務の明確化

| 階層 | Why | What | How | Implementation |
|------|-----|------|-----|----------------|
| **BC** | ✅ 定義（README） | ✅ L3一覧（README） | ✅ 定義（domain/api/data） | - |
| **L3 Capability** | - | ✅ 定義 | 🔗 BC参照 | - |
| **Operation** | - | - | ✅ 定義 | - |
| **UseCase** | 🔗 参照 | 🔗 参照 | 🔗 参照 | ✅ 定義 |

### 3. Issue #146対応との整合性

V3移行は、Issue #146で確立されたAPI WHAT/HOW分離構造を踏襲します：

| ファイル | 役割 | Issue #146対応 | V3での配置 |
|---------|------|---------------|-----------|
| **api/api-specification.md** | WHAT（能力定義） | ✅ 対応済み | BC層に移動 |
| **api/endpoints/*.md** | WHAT詳細 | ✅ 対応済み | BC層に移動 |
| **usecases/*/api-usage.md** | HOW（利用方法） | ✅ 対応済み | そのまま維持 |

### 4. 数量関係の設計

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

## 📋 移行手順

### Phase 1: 事前準備（1-2日）

#### Task 1.1: BC（ビジネスケーパビリティ）の特定
- [ ] 各サービスからBCを抽出
- [ ] BC一覧の作成（BC-001～BC-NNN）
- [ ] BCの命名規則確認（価値ベース命名）

#### Task 1.2: L3 Capability の分類
- [ ] 各Capabilityを分析し、L3レベルか確認
- [ ] 同一BCに属するL3をグループ化
- [ ] L3一覧の作成（L3-001～L3-NNN）

#### Task 1.3: Operation の整理
- [ ] 各OperationがどのL3に属するか分類
- [ ] Operation一覧の作成（OP-001～OP-NNN）
- [ ] 1 L3 = 2-4 Operationsの関係性確認

### Phase 2: BC層の構築（3-5日）

#### Task 2.1: BCディレクトリ構造の作成
```bash
mkdir -p docs/parasol/business-capabilities/BC-{001..NNN}-[name]/{domain,api,data,capabilities}
```

#### Task 2.2: BC層ドキュメントの作成
各BCについて以下のファイルを作成：
- [ ] README.md（BC概要 - Why・What・Howの概要を含む）
  - **Why**: このBCが解決するビジネス課題
  - **What**: このBCが提供するL3能力一覧
  - **How**: 設計方針（domain/api/data参照）

#### Task 2.3: BC設計ドキュメントの移行
既存のドメイン・API・DB設計をBC層に集約：
- [ ] domain-language.md → domain/ディレクトリへ分割
- [ ] **api/api-specification.md → BC層api/へ移動**（Issue #146構造維持）
- [ ] api/endpoints → BC層api/へ移動
- [ ] database-design.md → data/ディレクトリへ分割
- [ ] **注意**: api-usage.mdは各ユースケースレベルに配置（Issue #146対応済み）

### Phase 3: L3 Capability層の構築（3-5日）

#### Task 3.1: L3ディレクトリの作成
```bash
# 各BCの配下にL3ディレクトリを作成
for bc in BC-{001..NNN}-[name]; do
  mkdir -p docs/parasol/business-capabilities/$bc/capabilities/L3-{001..NNN}-[name]
done
```

#### Task 3.2: L3 README.mdの作成
各L3について以下を定義：
- [ ] 能力の概要（What）
- [ ] 実現できること
- [ ] 必要な知識
- [ ] BC設計の参照（How） - domain/api/dataへのリンク
- [ ] Operations一覧

#### Task 3.3: Operationの移動
既存のOperationを適切なL3配下に移動：
```bash
mv services/[service]/capabilities/[cap]/operations/[op] \
   business-capabilities/BC-XXX/capabilities/L3-YYY/operations/[op]
```

### Phase 4: Operation・UseCase層の調整（2-3日）

#### Task 4.1: Operation README.mdの更新
各Operationについて：
- [ ] L3 Capabilityへの参照を追加
- [ ] BC設計（domain/api/data）の使い方を明記
- [ ] パラソルドメイン連携セクションの更新

#### Task 4.2: UseCase・Page・API利用仕様の確認
- [ ] usecase.md と page.md の1対1関係を確認
- [ ] **api-usage.md の存在を確認**（Issue #146対応）
- [ ] パラソルドメイン連携セクションの検証
- [ ] BC層への参照リンクの追加

### Phase 5: サービスディレクトリの整理（1-2日）

#### Task 5.1: 旧services/ディレクトリの処理
```bash
# 移行後、旧構造をアーカイブ
mv docs/parasol/services docs/parasol/services-v2-archive
```

#### Task 5.2: サービス定義の保持
サービスレベルの情報は別途管理：
```
docs/parasol/services-registry/
└── [service-name]/
    ├── service.md              # サービス定義（保持）
    └── bc-mappings.md          # このサービスが使うBC一覧
```

### Phase 6: 検証とドキュメント更新（2-3日）

#### Task 6.1: 構造の検証
- [ ] BC数とL3数の関係性確認（1 BC = 3-5 L3）
- [ ] L3数とOperation数の関係性確認（1 L3 = 2-4 Ops）
- [ ] 全てのUseCaseがOperation配下にあることを確認
- [ ] **api-usage.mdの充足率確認**（Issue #146品質基準）

#### Task 6.2: リンク整合性の確認
```bash
# 全てのMarkdownリンクが有効か確認
find docs/parasol/business-capabilities -name "*.md" -exec markdown-link-check {} \;
```

#### Task 6.3: ドキュメントの更新
- [ ] PARASOL_DEVELOPMENT_GUIDE.mdの更新
- [ ] directory-structure-standard.mdの更新（v3.0版）
- [ ] README.mdの更新（新構造の説明）
- [ ] **Issue #146対応ガイドの更新**（V3構造への適合）

## ✅ タスク分解

### 優先度：高（必須）

- [ ] **BC001**: BC層の特定と命名（BC-001～BC-NNN）
- [ ] **BC002**: L3 Capabilityの分類（L3-001～L3-NNN）
- [ ] **BC003**: BCディレクトリ構造の作成
- [ ] **BC004**: BC層ドキュメント（README）の作成
- [ ] **BC005**: L3 READMEの作成
- [ ] **BC006**: Operationの移動とREADME更新

### 優先度：中（推奨）

- [ ] **BC007**: BC設計ドキュメント（domain/api/data）の分割
- [ ] **BC008**: UseCase・Page・API利用仕様の参照リンク追加
- [ ] **BC009**: サービスレジストリの作成
- [ ] **BC010**: リンク整合性の検証

### 優先度：低（オプション）

- [ ] **BC011**: 旧services/ディレクトリのアーカイブ
- [ ] **BC012**: 移行ツールの作成
- [ ] **BC013**: 自動検証スクリプトの作成

## 🎯 成功基準

### 定量的指標

- [ ] **BC数**: 5-10個（適切な粒度で分割）
- [ ] **階層関係**: 1 BC = 3-5 L3 = 7-15 Operations
- [ ] **v3.0準拠率**: 100%（全BCがv3.0構造に準拠）
- [ ] **リンク整合性**: 100%（全Markdownリンクが有効）
- [ ] **API利用仕様充足率**: 100%（Issue #146品質維持）

### 定性的指標

- [ ] **階層の明確性**: L3（What）とOperation（How）が明確に区別されている
- [ ] **情報の一元化**: BC層にドメイン・API・DB設計が集約されている
- [ ] **トレーサビリティ**: UseCase → Operation → L3 → BCの参照が可能
- [ ] **保守性**: 新規開発者が構造を理解しやすい
- [ ] **Issue #146整合性**: WHAT/HOW分離が維持されている

## 📚 参考ドキュメント

### 必須
- [PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md](consulting-dashboard-new/docs/parasol/PARASOL_L3_OPERATION_HIERARCHY_CORRECTION.md) - v3.0階層構造の詳細
- [parasol-design-process-guide.md](consulting-dashboard-new/docs/parasol/parasol-design-process-guide.md) - v3.0対応プロセスガイド
- [V2_V3_COEXISTENCE_STRATEGY.md](consulting-dashboard-new/docs/parasol/V2_V3_COEXISTENCE_STRATEGY.md) - V2/V3共存戦略
- **[api-what-how-separation-guide.md](consulting-dashboard-new/docs/implementation/api-what-how-separation-guide.md) - Issue #146対応ガイド**

### 参考
- [directory-structure-standard-v2.md](consulting-dashboard-new/docs/parasol/directory-structure-standard-v2.md) - v2.0構造（移行元）
- [PARASOL_DIRECTORY_MIGRATION_PLAN.md](consulting-dashboard-new/docs/parasol/PARASOL_DIRECTORY_MIGRATION_PLAN.md) - v2.0移行計画
- [PARASOL_DEVELOPMENT_GUIDE.md](consulting-dashboard-new/docs/parasol/PARASOL_DEVELOPMENT_GUIDE.md) - 開発ガイド

## ⚠️ 注意事項

### V2/V3共存期間について

**推奨**: 6-8週間の共存期間を設けて段階的に移行することを強く推奨します。

詳細は [V2_V3_COEXISTENCE_STRATEGY.md](consulting-dashboard-new/docs/parasol/V2_V3_COEXISTENCE_STRATEGY.md) を参照してください。

#### 共存のメリット
1. **リスク最小化**: 段階的移行により、一度に全てを変更するリスクを回避
2. **継続性確保**: 既存プロジェクトへの影響を最小限に抑制
3. **柔軟な移行**: 問題発生時にV2へのロールバックが可能
4. **学習期間**: 開発チームがV3構造に慣れる時間を確保

#### 共存期間の設計

| フェーズ | 期間 | V2状態 | V3状態 | アクション |
|---------|------|--------|--------|-----------|
| **Phase 1: 並行構築** | 2-4週間 | 🟢 稼働中 | 🟡 構築中 | V3構造の作成、相互リンク設定 |
| **Phase 2: クロスリファレンス** | 2-3週間 | 🟢 稼働中 | 🟢 部分稼働 | 両構造を参照可能に |
| **Phase 3: 段階的移行** | 1-2週間 | 🟡 参照のみ | 🟢 メイン稼働 | V3へ主要参照を移行 |
| **Phase 4: V2アーカイブ** | 1週間 | 🔴 アーカイブ | 🟢 完全稼働 | V2を読み取り専用化 |

### Issue #146との整合性維持

V3移行作業では、Issue #146で確立されたAPI WHAT/HOW分離原則を厳守してください：

| ファイル | 役割 | 配置 | 移行時の注意 |
|---------|------|------|-------------|
| **api-specification.md** | WHAT（能力定義） | BC層api/ | 内容は変更せず移動のみ |
| **api-usage.md** | HOW（利用方法） | ユースケース層 | 配置変更なし |

### リスクと対策

| リスク | 影響 | 対策 |
|--------|------|------|
| リンク切れ | ドキュメント参照不可 | 自動検証スクリプトの実行 |
| BC粒度の誤り | 非効率な構造 | BC定義のレビュー会実施 |
| 移行漏れ | 構造の不整合 | チェックリストによる確認 |
| V2とV3で内容が乖離 | 情報の不整合 | V2を早期に読み取り専用化 |
| Issue #146との不整合 | API仕様の混乱 | Issue #146ガイドの遵守 |

## 📝 移行テンプレート

### BC README.mdテンプレート
```markdown
# BC-XXX: [ビジネスケーパビリティ名]

## 🎯 Why: ビジネス価値

このBCが解決するビジネス課題:
- [課題1]
- [課題2]

提供するビジネス価値:
- [価値1]
- [価値2]

## 📋 What: 機能（L3能力）

このBCが提供する能力:
- **L3-001**: [能力名] - [説明]
- **L3-002**: [能力名] - [説明]
- **L3-003**: [能力名] - [説明]

詳細は各L3のREADME.mdを参照

## 🏗️ How: 設計方針

### ドメイン設計
- [domain/README.md](domain/README.md)
- 主要集約: [Aggregate1], [Aggregate2]
- エンティティ: [Entity1], [Entity2]

### API設計
- [api/README.md](api/README.md)
- **API仕様**: [api/api-specification.md](api/api-specification.md) ← Issue #146対応済み
- エンドポイント: [api/endpoints.md](api/endpoints.md)

### データ設計
- [data/README.md](data/README.md)
- データベース設計: [data/database-design.md](data/database-design.md)

## 📦 BC境界

### トランザクション境界
- BC内のL3/Operation間: 強整合性
- BC間: 結果整合性（イベント駆動）

### 他BCとの連携
- [BC-YYY]: [連携内容]
- [BC-ZZZ]: [連携内容]
```

### L3 README.mdテンプレート
```markdown
# L3-XXX: [能力名]

## 📋 What: この能力の定義

### 能力の概要
[能力の説明]

### 実現できること
- [機能1]
- [機能2]

### 必要な知識
- [知識1]
- [知識2]

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: [名前] ([../../domain/aggregates.md](../../domain/aggregates.md#xxx))
- **Entities**: [エンティティ一覧]
- **Value Objects**: [値オブジェクト一覧]

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md) ← Issue #146対応済み
- [エンドポイント一覧]

詳細: [../../api/endpoints.md](../../api/endpoints.md)

### データ
- **Tables**: [テーブル一覧]

詳細: [../../data/database-design.md](../../data/database-design.md)

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases |
|-----------|------|----------|
| **OP-001**: [操作名] | [説明] | X個 |
| **OP-002**: [操作名] | [説明] | X個 |
```

## 📅 スケジュール（推奨）

### 移行作業のスケジュール

| Phase | 期間 | 内容 |
|-------|------|------|
| Phase 1 | 1-2日 | 事前準備（BC/L3/Operation特定） |
| Phase 2 | 3-5日 | BC層の構築 |
| Phase 3 | 3-5日 | L3層の構築 |
| Phase 4 | 2-3日 | Operation・UseCase調整 |
| Phase 5 | 1-2日 | サービスディレクトリ整理 |
| Phase 6 | 2-3日 | 検証とドキュメント更新 |
| **合計** | **12-20日** | |

### V2/V3共存期間のスケジュール

| フェーズ | 期間 | 説明 |
|---------|------|------|
| Phase 0: 準備 | 1週間 | V3構造の設計・計画 |
| Phase 1: 並行構築 | 2-4週間 | V2稼働継続、V3構築開始 |
| Phase 2: クロスリファレンス | 2-3週間 | 両構造を参照可能 |
| Phase 3: 段階的移行 | 1-2週間 | V3メイン、V2参照のみ |
| Phase 4: V2アーカイブ | 1週間 | V3のみに統一 |
| **合計** | **6-8週間** | |

---

## 💡 次のステップ

1. このissueをプロジェクトボードに追加
2. 共存戦略の確認: [V2_V3_COEXISTENCE_STRATEGY.md](consulting-dashboard-new/docs/parasol/V2_V3_COEXISTENCE_STRATEGY.md)
3. **Issue #146対応の確認**: [api-what-how-separation-guide.md](consulting-dashboard-new/docs/implementation/api-what-how-separation-guide.md)
4. Phase 0（準備）から着手
   - MIGRATION_STATUS.mdの作成
   - V2_V3_MAPPING.mdの作成
   - BC特定会議の実施
5. Phase 1のタスク（BC001-BC003）を開始
6. 各Phaseごとにプルリクエストを作成
7. レビューとフィードバックを経て次Phaseへ進行

---

**ラベル提案**: `enhancement`, `documentation`, `design`, `architecture`
**マイルストーン提案**: V3.0 Directory Migration
**優先度**: Medium-High
**推定工数**: 6-8週間（共存期間含む）
**関連Issue**: #146 (API WHAT/HOW分離)
