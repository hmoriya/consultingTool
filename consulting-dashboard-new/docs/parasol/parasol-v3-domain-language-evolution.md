# パラソルドメイン言語の進化プロセス

**バージョン**: 1.0.0
**最終更新**: 2025-11-01

> 🌍 **パラソルワールド**: このドキュメントは、パラソルドメイン言語がLayer 1からLayer 3まで段階的に精緻化されていく進化プロセスを説明します。
>
> - **パラソルワールド全体**: [パラソルワールド - 概要](./parasol-world-overview.md)
> - **全体概要**: [パラソルV3設計 - 全体概要](./parasol-v3-design-overview.md)

---

## 📋 目次

1. [ドメイン言語進化の概要](#ドメイン言語進化の概要)
2. [3層における精緻化レベル](#3層における精緻化レベル)
3. [Layer 1: 5%精緻化（戦略レベル）](#layer-1-5精緻化戦略レベル)
4. [Layer 2: 80%精緻化（戦術レベル）](#layer-2-80精緻化戦術レベル)
5. [Layer 3: 100%精緻化（実装レベル）](#layer-3-100精緻化実装レベル)
6. [進化のトリガーとフィードバックループ](#進化のトリガーとフィードバックループ)
7. [バージョン管理とトレーサビリティ](#バージョン管理とトレーサビリティ)
8. [実践例: プロジェクト管理ドメイン](#実践例-プロジェクト管理ドメイン)

---

## ドメイン言語進化の概要

### パラソルドメイン言語とは

**パラソルドメイン言語**は、ビジネスと技術の共通言語であり、パラソルワールド全体で一貫して使用される**実装非依存の形式言語**です。

#### 3要素記法

```
日本語名 [英語名] [SYSTEM_NAME]
```

| 要素 | 説明 | 対象読者 |
|------|------|---------|
| **日本語名** | ビジネス用語 | ビジネスステークホルダー、ドメインエキスパート |
| **英語名** | 技術用語 | 開発者、アーキテクト |
| **SYSTEM_NAME** | システム識別子（UPPER_SNAKE_CASE） | AI、コード生成エンジン、システム |

### なぜ段階的に進化するのか

```
Layer 1 (5%)
  ↓ 詳細化が進むにつれて
Layer 2 (80%)
  ↓ 新しい概念が発見される
Layer 3 (100%)
```

**理由**:
1. **段階的な理解の深化**: ビジネス価値から実装へ降りていく過程で、新しいドメイン概念が発見される
2. **役割による詳細度の違い**: 戦略レベルと実装レベルで必要な用語の粒度が異なる
3. **変更への適応**: 設計が進む中で、用語の調整や追加が必要になる
4. **実装フィードバック**: AI生成やテストの過程で、用語の曖昧さが明らかになり修正される

### 進化の全体像

```
┌────────────────────────────────────────────────────────────┐
│ Layer 1: パラソル価値デザイン                                 │
│ 精緻化レベル: 5%                                             │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 初期ユビキタス言語                                        │ │
│ │ - 主要エンティティ                                        │ │
│ │ - 戦略的概念                                              │ │
│ │ - ビジネス用語                                            │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
                         ↓ 発見・追加・修正
┌────────────────────────────────────────────────────────────┐
│ Layer 2: マイクロサービスデザイン                              │
│ 精緻化レベル: 80%                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ ドメイン言語                                              │ │
│ │ + ドメインモデル用語（Entity, Aggregate, Value Object）   │ │
│ │ + API用語                                                │ │
│ │ + データモデル用語                                        │ │
│ │ + サービス間連携用語                                       │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
                         ↓ 発見・追加・修正
┌────────────────────────────────────────────────────────────┐
│ Layer 3: パラソル開発設計                                     │
│ 精緻化レベル: 100%                                           │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 精緻化ドメイン言語（完成版）                               │ │
│ │ + UI用語                                                 │ │
│ │ + 操作・アクション用語                                     │ │
│ │ + エラーメッセージ用語                                     │ │
│ │ + 画面遷移用語                                            │ │
│ │ + ユーザーインタラクション用語                             │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
                         ↓ AI生成・テスト
                   フィードバックループ
                         ↑ 修正・補正
```

---

## 3層における精緻化レベル

### 精緻化レベルの定義

| Layer | 精緻化レベル | 対象範囲 | 主要成果物 |
|-------|------------|---------|-----------|
| Layer 1 | **5%** | 戦略的概念のみ | `initial-ubiquitous-language.md` |
| Layer 2 | **80%** | ドメインモデル + API | `domain-language.md` |
| Layer 3 | **100%** | 実装レベル全て | `refined-domain-language.md` |

### なぜこの比率なのか

#### Layer 1: 5%
- ビジネス価値レベルでは、詳細な用語は不要
- **戦略的な判断に必要な最小限の概念**のみ定義
- 例: 「プロジェクト」「タスク」「メンバー」など主要概念

#### Layer 2: 80%
- **ドメインモデルが完成**し、API設計が行われるため、用語の大部分が確定
- ただし、UI実装の詳細（ボタンラベル、エラーメッセージなど）はまだ未定義

#### Layer 3: 100%
- **実装可能レベル**まで精緻化
- AI生成に必要なすべての用語が揃う

---

## Layer 1: 5%精緻化（戦略レベル）

### Layer 1での定義範囲

```
初期ユビキタス言語
├─ 主要エンティティ（5-10個）
├─ Value Streamに登場する概念
├─ L1 Capabilityの名称
└─ ビジネスルール用語
```

### 成果物

**ファイル**: `docs/parasol/1-VALUE-DESIGN/domain-concepts/initial-ubiquitous-language.md`

### テンプレート（Layer 1）

```markdown
# 初期ユビキタス言語

**バージョン**: 1.0.0
**精緻化レベル**: 5%（戦略レベル）

---

## 🏗️ 主要エンティティ（Core Entities）

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| [エンティティ1] | [Entity1] | [ENTITY_1] | [ビジネス上の意味] |
| [エンティティ2] | [Entity2] | [ENTITY_2] | [ビジネス上の意味] |

---

## 🎯 ビジネスCapability用語

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| [Capability1] | [Capability1] | [CAPABILITY_1] | [提供する価値] |

---

## 📝 ビジネスルール用語

| 日本語 | 英語 | SYSTEM_NAME | 説明 |
|-------|------|-------------|------|
| [ルール用語1] | [RuleTerm1] | [RULE_TERM_1] | [説明] |

---

## 🔄 次のステップ（Layer 2での拡張予定）

- ドメインモデル詳細化
- API用語追加
- データモデル用語追加
```

### 実例（5%精緻化）

```markdown
## 🏗️ 主要エンティティ

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| プロジェクト | Project | PROJECT | 特定の目標を達成するための活動 |
| タスク | Task | TASK | プロジェクトを構成する作業単位 |
| メンバー | Member | MEMBER | プロジェクトに参加する人 |
| 組織 | Organization | ORGANIZATION | メンバーが所属する組織 |

## 🎯 ビジネスCapability用語

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| プロジェクト管理 | Project Management | PROJECT_MANAGEMENT | プロジェクトの計画と実行を管理 |
| タスク管理 | Task Management | TASK_MANAGEMENT | タスクの割当と進捗を管理 |
```

---

## Layer 2: 80%精緻化（戦術レベル）

### Layer 2での拡張範囲

```
Layer 1 (5%) +
├─ ドメインモデル詳細
│  ├─ Entities（詳細属性）
│  ├─ Aggregates
│  ├─ Value Objects
│  └─ Domain Services
├─ API用語
│  ├─ エンドポイント名
│  ├─ リクエスト/レスポンス用語
│  └─ HTTPメソッド対応
├─ データモデル用語
│  ├─ テーブル名
│  ├─ カラム名
│  └─ リレーション用語
└─ サービス間連携用語
   ├─ イベント名
   └─ メッセージ用語
```

### 成果物

**ファイル**: `docs/parasol/2-MICROSERVICE-DESIGN/bounded-contexts/[bc-name]/domain/domain-language.md`

### Layer 1からの変化

| 観点 | Layer 1 | Layer 2 |
|------|---------|---------|
| エンティティ数 | 5-10個（主要のみ） | 20-50個（詳細含む） |
| 属性定義 | 概念のみ | 詳細属性まで |
| 用語カテゴリ | エンティティ、Capability | + Aggregate, VO, API, Data |
| 精緻化 | 5% | 80% |

### テンプレート（Layer 2）

```markdown
# パラソルドメイン言語

**Bounded Context**: [BC名]
**バージョン**: 1.0.0
**精緻化レベル**: 80%（戦術レベル）

> 📌 **ベース**: Layer 1 初期ユビキタス言語を拡張

---

## 🏗️ エンティティ（Entities）

### 主要エンティティ

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 | ID型 |
|---------|-------|-------------|------|------|
| [エンティティ1] | [Entity1] | [ENTITY_1] | [説明] | UUID |

### エンティティ属性詳細

#### [エンティティ1] [Entity1] [ENTITY_1]

| 日本語属性名 | 英語属性名 | SYSTEM_ATTR_NAME | 型 | 必須 | 説明 |
|------------|----------|-----------------|----|----|------|
| [属性1] | [attr1] | [ATTR_1] | string | ✅ | [説明] |

---

## 📦 集約（Aggregates）

| 日本語名 | 英語名 | SYSTEM_NAME | 集約ルート | 含まれるエンティティ |
|---------|-------|-------------|---------|-------------------|
| [集約1] | [Aggregate1] | [AGG_1] | [Root] | [Entities] |

---

## 💎 値オブジェクト（Value Objects）

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| [VO1] | [ValueObject1] | [VO_1] | [説明] |

---

## 🔌 API用語

### エンドポイント

| 日本語名 | 英語名 | SYSTEM_NAME | メソッド | パス |
|---------|-------|-------------|---------|------|
| [API1] | [GetEntity] | [GET_ENTITY] | GET | `/api/entities/{id}` |

---

## 📊 データモデル用語

### テーブル

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| [テーブル1] | [table1] | [TABLE_1] | [説明] |

---

## 🔄 Layer 1からの変更

### 追加された用語
- [追加用語1]: [理由]

### 修正された用語
- [旧用語] → [新用語]: [理由]
```

### 実例（80%精緻化）

```markdown
## 🏗️ エンティティ（Entities）

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 | ID型 |
|---------|-------|-------------|------|------|
| プロジェクト | Project | PROJECT | 特定の目標を達成するための活動 | UUID |
| タスク | Task | TASK | プロジェクトを構成する作業単位 | UUID |
| メンバー | Member | MEMBER | プロジェクトに参加する人 | UUID |
| プロジェクト状態 | Project Status | PROJECT_STATUS | プロジェクトの進行状態 | String(Enum) |

### エンティティ属性詳細

#### プロジェクト [Project] [PROJECT]

| 日本語属性名 | 英語属性名 | SYSTEM_ATTR_NAME | 型 | 必須 | 説明 |
|------------|----------|-----------------|----|----|------|
| プロジェクトID | projectId | PROJECT_ID | UUID | ✅ | 一意識別子 |
| プロジェクト名 | projectName | PROJECT_NAME | string | ✅ | プロジェクトの名称 |
| 開始日 | startDate | START_DATE | date | ✅ | プロジェクト開始日 |
| 終了日 | endDate | END_DATE | date | ❌ | プロジェクト終了日（予定） |
| 状態 | status | STATUS | ProjectStatus | ✅ | プロジェクトの状態 |
| 予算 | budget | BUDGET | number | ❌ | プロジェクト予算 |

## 📦 集約（Aggregates）

| 日本語名 | 英語名 | SYSTEM_NAME | 集約ルート | 含まれるエンティティ |
|---------|-------|-------------|---------|-------------------|
| プロジェクト集約 | Project Aggregate | PROJECT_AGG | Project | Project, Task, ProjectMember |

## 💎 値オブジェクト（Value Objects）

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| プロジェクト期間 | Project Duration | PROJECT_DURATION | 開始日と終了日のペア |
| メンバー役割 | Member Role | MEMBER_ROLE | プロジェクト内の役割 |

## 🔌 API用語

### エンドポイント

| 日本語名 | 英語名 | SYSTEM_NAME | メソッド | パス |
|---------|-------|-------------|---------|------|
| プロジェクト取得 | Get Project | GET_PROJECT | GET | `/api/projects/{id}` |
| プロジェクト作成 | Create Project | CREATE_PROJECT | POST | `/api/projects` |
| プロジェクト更新 | Update Project | UPDATE_PROJECT | PUT | `/api/projects/{id}` |
| プロジェクト削除 | Delete Project | DELETE_PROJECT | DELETE | `/api/projects/{id}` |
```

---

## Layer 3: 100%精緻化（実装レベル）

### Layer 3での最終拡張範囲

```
Layer 2 (80%) +
├─ UI用語
│  ├─ 画面名
│  ├─ ボタンラベル
│  ├─ フィールドラベル
│  └─ メニュー項目名
├─ 操作・アクション用語
│  ├─ CRUD操作
│  ├─ ビジネスアクション
│  └─ ユーザーインタラクション
├─ エラーメッセージ用語
│  ├─ エラーコード
│  ├─ エラーメッセージ
│  └─ 警告メッセージ
├─ 画面遷移用語
│  └─ 遷移アクション名
└─ 状態・ステータス用語
   ├─ UI状態
   └─ プロセス状態
```

### 成果物

**ファイル**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/domain/refined-domain-language.md`

### Layer 2からの変化

| 観点 | Layer 2 | Layer 3 |
|------|---------|---------|
| 用語総数 | 100-200 | 300-500 |
| UI用語 | なし | 完全定義 |
| エラー用語 | 基本のみ | 全エラーケース |
| 操作用語 | APIレベル | UIアクションレベル |
| 精緻化 | 80% | 100% |

### 実例（100%精緻化）

```markdown
## 🎨 UI用語

### 画面名

| 日本語名 | 英語名 | SYSTEM_NAME | URL |
|---------|-------|-------------|-----|
| プロジェクト一覧画面 | Project List Page | PROJECT_LIST_PAGE | `/projects` |
| プロジェクト作成画面 | Create Project Page | CREATE_PROJECT_PAGE | `/projects/new` |
| プロジェクト詳細画面 | Project Detail Page | PROJECT_DETAIL_PAGE | `/projects/{id}` |

### ボタンラベル

| 日本語 | 英語 | SYSTEM_NAME | 用途 |
|-------|------|-------------|------|
| 保存 | Save | BTN_SAVE | データ保存 |
| キャンセル | Cancel | BTN_CANCEL | 操作キャンセル |
| 削除 | Delete | BTN_DELETE | データ削除 |
| 新規作成 | Create New | BTN_CREATE_NEW | 新規作成 |
| 編集 | Edit | BTN_EDIT | 編集開始 |
| 戻る | Back | BTN_BACK | 前の画面に戻る |

### フィールドラベル

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| プロジェクト名 | Project Name | LBL_PROJECT_NAME |
| 開始日 | Start Date | LBL_START_DATE |
| 終了日 | End Date | LBL_END_DATE |
| 予算 | Budget | LBL_BUDGET |
| 担当者 | Assignee | LBL_ASSIGNEE |

## 🔄 操作・アクション用語

### CRUD操作

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| 作成する | Create | CREATE |
| 読み込む | Read | READ |
| 更新する | Update | UPDATE |
| 削除する | Delete | DELETE |

### ビジネスアクション

| 日本語 | 英語 | SYSTEM_NAME | 説明 |
|-------|------|-------------|------|
| プロジェクトを開始する | Start Project | START_PROJECT | プロジェクトを開始状態にする |
| プロジェクトを完了する | Complete Project | COMPLETE_PROJECT | プロジェクトを完了状態にする |
| タスクを割り当てる | Assign Task | ASSIGN_TASK | メンバーにタスクを割り当てる |
| メンバーを追加する | Add Member | ADD_MEMBER | プロジェクトにメンバーを追加 |

## ⚠️ エラー用語

### エラーコード

| エラーコード | 日本語メッセージ | 英語メッセージ | 説明 |
|------------|----------------|--------------|------|
| ERR_PRJ_001 | プロジェクト名は必須です | Project name is required | プロジェクト名が空 |
| ERR_PRJ_002 | プロジェクト名は100文字以内で入力してください | Project name must be 100 characters or less | 文字数超過 |
| ERR_PRJ_003 | 開始日は終了日より前である必要があります | Start date must be before end date | 日付の整合性エラー |
| ERR_PRJ_004 | このプロジェクトは既に存在します | Project already exists | 重複エラー |
| ERR_PRJ_005 | プロジェクトが見つかりません | Project not found | 存在しないID |

### 警告メッセージ

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| 保存されていない変更があります | You have unsaved changes | WARN_UNSAVED_CHANGES |
| 削除すると元に戻せません | This action cannot be undone | WARN_CANNOT_UNDO |

### 成功メッセージ

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| プロジェクトを作成しました | Project created successfully | MSG_PROJECT_CREATED |
| プロジェクトを更新しました | Project updated successfully | MSG_PROJECT_UPDATED |
| プロジェクトを削除しました | Project deleted successfully | MSG_PROJECT_DELETED |

## 📊 状態・ステータス用語

### プロジェクト状態

| 日本語 | 英語 | SYSTEM_NAME | 説明 |
|-------|------|-------------|------|
| 計画中 | Planning | STATUS_PLANNING | プロジェクト計画段階 |
| 進行中 | In Progress | STATUS_IN_PROGRESS | プロジェクト実行中 |
| 保留中 | On Hold | STATUS_ON_HOLD | 一時停止 |
| 完了 | Completed | STATUS_COMPLETED | プロジェクト完了 |
| キャンセル | Cancelled | STATUS_CANCELLED | プロジェクト中止 |

### UI状態

| 日本語 | 英語 | SYSTEM_NAME | 説明 |
|-------|------|-------------|------|
| 読み込み中 | Loading | UI_LOADING | データ読み込み中 |
| 編集中 | Editing | UI_EDITING | ユーザーが編集中 |
| 保存中 | Saving | UI_SAVING | データ保存中 |
| エラー | Error | UI_ERROR | エラー状態 |
```

---

## 進化のトリガーとフィードバックループ

### 用語追加・修正のトリガー

#### Layer 1 → Layer 2

**トリガー**:
1. **ドメインモデリング**
   - Entityの属性詳細化
   - Aggregateの発見
   - Value Objectの抽出

2. **API設計**
   - エンドポイント定義
   - リクエスト/レスポンス設計

3. **データモデル設計**
   - テーブル設計
   - カラム定義

**対応フロー**:
```
1. 新しい概念の発見
   ↓
2. Layer 1に遡って確認
   ├─ Layer 1で定義されている → Layer 2で詳細化
   └─ Layer 1で未定義 → Layer 1とLayer 2の両方を更新
   ↓
3. domain-language.md に追加
   ↓
4. バージョン更新
```

#### Layer 2 → Layer 3

**トリガー**:
1. **UI設計**
   - 画面設計
   - フォーム設計
   - ボタン・ラベル定義

2. **ユーザーインタラクション設計**
   - 操作フロー
   - エラーハンドリング

3. **AI生成準備**
   - 生成に必要な用語の洗い出し

**対応フロー**:
```
1. UI要素で新しい用語が必要
   ↓
2. Layer 2のdomain-language.mdを確認
   ├─ 存在する → Layer 3で詳細化
   └─ 存在しない → Layer 2とLayer 3の両方を更新
   ↓
3. refined-domain-language.md に追加
   ↓
4. バージョン更新
```

### フィードバックループ（AI生成後）

```
Layer 3: 100%精緻化完了
    ↓
AI Code Generation
    ↓
自動テスト実行
    ↓
  ✅ 成功 → デプロイ
  ❌ 失敗 → AI自動補正
    ↓
用語の曖昧さ検出
    ↓
refined-domain-language.md 更新
    ↓
バージョン更新
    ↓
AI再生成
```

**フィードバックの種類**:

| フィードバック元 | 検出内容 | 対応 |
|----------------|---------|------|
| AI生成エラー | 用語の曖昧さ | 用語を明確化、SYSTEM_NAMEを調整 |
| テストエラー | 用語の不整合 | 関連用語を統一 |
| レビュー | 用語の不適切さ | 用語を修正、旧用語の履歴を記録 |
| 実装フィードバック | 用語の不足 | 新しい用語を追加 |

---

## バージョン管理とトレーサビリティ

### ドメイン言語のバージョン管理

#### セマンティックバージョニング

```
[Major].[Minor].[Patch]

例: 1.2.3
```

| バージョン | 更新内容 |
|----------|---------|
| **Major** | 破壊的変更（SYSTEM_NAMEの変更、概念の削除） |
| **Minor** | 後方互換性のある追加（新しい用語の追加） |
| **Patch** | 後方互換性のある修正（説明の明確化、誤字修正） |

#### バージョン履歴の記録

各ドメイン言語ドキュメントに以下を記録:

```markdown
## 🔄 変更履歴

### v1.2.0 (2025-11-15)
- **追加**: UI用語セクション追加（Layer 3精緻化）
  - 画面名: 5個
  - ボタンラベル: 10個
- **修正**: プロジェクト状態の英語名を "Project State" から "Project Status" に変更

### v1.1.0 (2025-11-10)
- **追加**: API用語セクション追加（Layer 2精緻化）
  - エンドポイント定義: 15個

### v1.0.0 (2025-11-01)
- **初版**: Layer 1 初期ユビキタス言語作成
  - 主要エンティティ: 5個
```

### トレーサビリティマトリクス

#### 用語のトレーサビリティ

各用語がどのLayer、どのドキュメントで使用されているかを追跡:

```markdown
## 用語トレーサビリティ: プロジェクト [Project] [PROJECT]

| Layer | ドキュメント | 使用箇所 |
|-------|------------|---------|
| Layer 1 | `value-streams/project-delivery/value-stream.md` | バリューストリーム名 |
| Layer 1 | `initial-ubiquitous-language.md` | 主要エンティティ |
| Layer 2 | `bounded-contexts/project-mgmt/domain/domain-language.md` | Entity定義 |
| Layer 2 | `bounded-contexts/project-mgmt/api/api-specification.md` | エンドポイント `/projects` |
| Layer 3 | `bounded-contexts/project-mgmt/usecases/create-project/pages/create-project.md` | 画面タイトル |
| Layer 3 | `bounded-contexts/project-mgmt/domain/refined-domain-language.md` | 完全定義 |
```

---

## 実践例: プロジェクト管理ドメイン

### Layer 1: 5%精緻化

**ファイル**: `docs/parasol/1-VALUE-DESIGN/domain-concepts/initial-ubiquitous-language.md`

```markdown
# 初期ユビキタス言語

**バージョン**: 1.0.0
**精緻化レベル**: 5%

## 🏗️ 主要エンティティ

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| プロジェクト | Project | PROJECT | ビジネス目標を達成するための活動 |
| タスク | Task | TASK | プロジェクトを構成する作業 |
| メンバー | Member | MEMBER | プロジェクト参加者 |

（3個の主要概念のみ）
```

### Layer 2: 80%精緻化

**ファイル**: `docs/parasol/2-MICROSERVICE-DESIGN/bounded-contexts/project-mgmt/domain/domain-language.md`

```markdown
# パラソルドメイン言語

**Bounded Context**: Project Management
**バージョン**: 2.0.0
**精緻化レベル**: 80%

## 🏗️ エンティティ（Entities）

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 | ID型 |
|---------|-------|-------------|------|------|
| プロジェクト | Project | PROJECT | ビジネス目標を達成するための活動 | UUID |
| タスク | Task | TASK | プロジェクトを構成する作業 | UUID |
| メンバー | Member | MEMBER | プロジェクト参加者 | UUID |
| プロジェクトメンバー | Project Member | PROJECT_MEMBER | プロジェクトとメンバーの関連 | UUID |
| タスク割当 | Task Assignment | TASK_ASSIGNMENT | タスクとメンバーの割当情報 | UUID |

### プロジェクト [Project] [PROJECT] 属性

| 日本語属性名 | 英語属性名 | SYSTEM_ATTR_NAME | 型 | 必須 |
|------------|----------|-----------------|----|----|
| プロジェクトID | projectId | PROJECT_ID | UUID | ✅ |
| プロジェクト名 | projectName | PROJECT_NAME | string | ✅ |
| 説明 | description | DESCRIPTION | string | ❌ |
| 開始日 | startDate | START_DATE | date | ✅ |
| 終了日 | endDate | END_DATE | date | ❌ |
| 状態 | status | STATUS | ProjectStatus | ✅ |
| 予算 | budget | BUDGET | number | ❌ |
| 作成日時 | createdAt | CREATED_AT | datetime | ✅ |
| 更新日時 | updatedAt | UPDATED_AT | datetime | ✅ |

## 📦 集約（Aggregates）

| 日本語名 | 英語名 | SYSTEM_NAME | 集約ルート |
|---------|-------|-------------|---------|
| プロジェクト集約 | Project Aggregate | PROJECT_AGG | Project |

## 💎 値オブジェクト（Value Objects）

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 |
|---------|-------|-------------|------|
| プロジェクト期間 | Project Duration | PROJECT_DURATION | startDateとendDateのペア |
| メンバー役割 | Member Role | MEMBER_ROLE | プロジェクト内の役割 |

## 🔌 API用語

| 日本語名 | 英語名 | SYSTEM_NAME | メソッド | パス |
|---------|-------|-------------|---------|------|
| プロジェクト一覧取得 | List Projects | LIST_PROJECTS | GET | `/api/projects` |
| プロジェクト取得 | Get Project | GET_PROJECT | GET | `/api/projects/{id}` |
| プロジェクト作成 | Create Project | CREATE_PROJECT | POST | `/api/projects` |
| プロジェクト更新 | Update Project | UPDATE_PROJECT | PUT | `/api/projects/{id}` |
| プロジェクト削除 | Delete Project | DELETE_PROJECT | DELETE | `/api/projects/{id}` |

（20個の概念に拡大、詳細属性、API用語を追加）
```

### Layer 3: 100%精緻化

**ファイル**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/project-mgmt/domain/refined-domain-language.md`

```markdown
# パラソルドメイン言語（100%精緻化版）

**Bounded Context**: Project Management
**バージョン**: 3.0.0
**精緻化レベル**: 100%

## 🏗️ エンティティ（Entities）

（Layer 2の内容を継承）

## 🎨 UI用語

### 画面名

| 日本語名 | 英語名 | SYSTEM_NAME | URL |
|---------|-------|-------------|-----|
| プロジェクト一覧画面 | Project List Page | PROJECT_LIST_PAGE | `/projects` |
| プロジェクト作成画面 | Create Project Page | CREATE_PROJECT_PAGE | `/projects/new` |
| プロジェクト詳細画面 | Project Detail Page | PROJECT_DETAIL_PAGE | `/projects/{id}` |
| プロジェクト編集画面 | Edit Project Page | EDIT_PROJECT_PAGE | `/projects/{id}/edit` |

### ボタンラベル

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| 新しいプロジェクトを作成 | Create New Project | BTN_CREATE_NEW_PROJECT |
| 保存 | Save | BTN_SAVE |
| キャンセル | Cancel | BTN_CANCEL |
| 削除 | Delete | BTN_DELETE |
| 編集 | Edit | BTN_EDIT |
| 戻る | Back | BTN_BACK |
| メンバーを追加 | Add Member | BTN_ADD_MEMBER |
| タスクを追加 | Add Task | BTN_ADD_TASK |

### フィールドラベル

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| プロジェクト名 | Project Name | LBL_PROJECT_NAME |
| 説明 | Description | LBL_DESCRIPTION |
| 開始日 | Start Date | LBL_START_DATE |
| 終了日 | End Date | LBL_END_DATE |
| 予算 | Budget | LBL_BUDGET |
| 状態 | Status | LBL_STATUS |
| 担当者 | Assignee | LBL_ASSIGNEE |
| 優先度 | Priority | LBL_PRIORITY |

## 🔄 操作・アクション用語

### ビジネスアクション

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| プロジェクトを開始する | Start Project | START_PROJECT |
| プロジェクトを完了する | Complete Project | COMPLETE_PROJECT |
| プロジェクトを保留する | Put Project On Hold | HOLD_PROJECT |
| プロジェクトをキャンセルする | Cancel Project | CANCEL_PROJECT |
| タスクを割り当てる | Assign Task | ASSIGN_TASK |
| メンバーを追加する | Add Member | ADD_MEMBER |
| メンバーを削除する | Remove Member | REMOVE_MEMBER |

## ⚠️ エラー用語

### バリデーションエラー

| エラーコード | 日本語メッセージ | 英語メッセージ |
|------------|----------------|--------------|
| ERR_PRJ_001 | プロジェクト名は必須です | Project name is required |
| ERR_PRJ_002 | プロジェクト名は100文字以内で入力してください | Project name must be 100 characters or less |
| ERR_PRJ_003 | 開始日は必須です | Start date is required |
| ERR_PRJ_004 | 開始日は終了日より前である必要があります | Start date must be before end date |
| ERR_PRJ_005 | 予算は0以上の数値を入力してください | Budget must be a positive number |

### システムエラー

| エラーコード | 日本語メッセージ | 英語メッセージ |
|------------|----------------|--------------|
| ERR_SYS_001 | 通信エラーが発生しました | Network error occurred |
| ERR_SYS_002 | サーバーエラーが発生しました | Server error occurred |
| ERR_SYS_003 | プロジェクトが見つかりません | Project not found |
| ERR_SYS_004 | このプロジェクトは既に存在します | Project already exists |
| ERR_SYS_005 | 権限がありません | Permission denied |

### 警告メッセージ

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| 保存されていない変更があります | You have unsaved changes | WARN_UNSAVED_CHANGES |
| 削除すると元に戻せません。本当に削除しますか？ | This action cannot be undone. Are you sure? | WARN_DELETE_CONFIRM |

### 成功メッセージ

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| プロジェクトを作成しました | Project created successfully | MSG_PROJECT_CREATED |
| プロジェクトを更新しました | Project updated successfully | MSG_PROJECT_UPDATED |
| プロジェクトを削除しました | Project deleted successfully | MSG_PROJECT_DELETED |

## 📊 状態・ステータス用語

### プロジェクト状態

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| 計画中 | Planning | STATUS_PLANNING |
| 進行中 | In Progress | STATUS_IN_PROGRESS |
| 保留中 | On Hold | STATUS_ON_HOLD |
| 完了 | Completed | STATUS_COMPLETED |
| キャンセル | Cancelled | STATUS_CANCELLED |

### UI状態

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| 読み込み中 | Loading | UI_LOADING |
| 編集中 | Editing | UI_EDITING |
| 保存中 | Saving | UI_SAVING |
| エラー | Error | UI_ERROR |

（50個以上の概念に拡大、UI用語、エラーメッセージ、操作用語を完全追加）
```

### 進化の可視化

```
Layer 1 (5%):        3個の概念
                    ↓
Layer 2 (80%):      20個の概念（+17個）
                    ├─ エンティティ詳細化
                    ├─ Aggregate, VO追加
                    ├─ API用語追加
                    └─ データモデル用語追加
                    ↓
Layer 3 (100%):     50+個の概念（+30個）
                    ├─ 画面名追加
                    ├─ ボタンラベル追加
                    ├─ フィールドラベル追加
                    ├─ エラーメッセージ追加
                    ├─ ビジネスアクション追加
                    └─ 状態用語追加
```

---

## まとめ

### ドメイン言語進化の原則

1. **段階的精緻化**
   - Layer 1: 戦略的概念（5%）
   - Layer 2: 戦術的詳細（80%）
   - Layer 3: 実装完全（100%）

2. **一貫性の維持**
   - 3要素記法を全レイヤーで統一
   - SYSTEM_NAMEは変更しない（破壊的変更）

3. **トレーサビリティ**
   - 各用語がどのLayerで追加・修正されたかを記録
   - バージョン管理で変更履歴を追跡

4. **フィードバックループ**
   - AI生成やテストのフィードバックを設計に反映
   - 常に最新のドメイン言語を維持

5. **パラソルワールド統合**
   - ドメイン言語がAI生成の入力として機能
   - 自動補正による継続的改善

---

## 🔗 関連ドキュメント

- [パラソルワールド - 概要](./parasol-world-overview.md)
- [Layer 1: パラソル価値デザイン](./parasol-v3-layer1-value-design.md)
- [Layer 2: マイクロサービスデザイン](./parasol-v3-layer2-microservice-design.md)
- [Layer 3: パラソル開発設計](./parasol-v3-layer3-development-design.md)

---

**作成日**: 2025-11-01
**最終更新**: 2025-11-01
**バージョン**: 1.0.0
