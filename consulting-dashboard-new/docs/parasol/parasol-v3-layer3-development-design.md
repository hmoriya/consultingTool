# Layer 3: パラソル開発設計 - 実践ガイド

**バージョン**: 1.0.0
**最終更新**: 2025-11-01

> 🌍 **パラソルワールド**: このドキュメントは、Layer 3（パラソル開発設計）の詳細な実践ガイドです。
>
> - **パラソルワールド全体**: [パラソルワールド - 概要](./parasol-world-overview.md)
> - **全体概要**: [パラソルV3設計 - 全体概要](./parasol-v3-design-overview.md)
> - **完全プロセス**: [パラソルV3完全設計ブレークダウンプロセス](./parasol-v3-complete-design-breakdown-process.md)

---

## 📋 目次

1. [Layer 3の位置づけと目的](#layer-3の位置づけと目的)
2. [成果物の全体像](#成果物の全体像)
3. [L3 Capability定義](#l3-capability定義)
4. [Operation設計](#operation設計)
5. [UseCase詳細設計](#usecase詳細設計)
6. [Page定義（AI生成入力）](#page定義ai生成入力)
7. [ドメイン言語の最終精緻化](#ドメイン言語の最終精緻化)
8. [テンプレート集](#テンプレート集)
9. [チェックリスト](#チェックリスト)

---

## Layer 3の位置づけと目的

### 📊 3層構造における位置

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: パラソル価値デザイン                              │
│ - Value Stream, Value Stage, L1 Capability              │
│ - ビジネス価値の定義                                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: マイクロサービスデザイン                           │
│ - L2 Capability, Bounded Context, Domain Model          │
│ - サービス境界とドメインモデルの定義                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: パラソル開発設計 ← 📍 このレイヤー                │
│ - L3 Capability, Operation, UseCase, Page               │
│ - 実装レベルの詳細設計（AI生成の直接入力）                  │
└─────────────────────────────────────────────────────────┘
                        ↓
                  AI Code Generation
```

### 🎯 Layer 3の目的

| 目的 | 説明 |
|------|------|
| **実装可能レベルへの詳細化** | L2のドメインモデルをUIとAPI操作に落とし込む |
| **AI生成の直接入力** | AIがコード生成可能な詳細度のMDファイルを作成 |
| **ドメイン言語の完成** | 100%精緻化されたパラソルドメイン言語 |
| **画面とAPI操作の定義** | ユーザー操作とバックエンド処理の完全な定義 |

### 🔄 Layer 3のインプット・アウトプット

```
📥 INPUT (Layer 2から)
├─ Bounded Context定義
├─ ドメインモデル（Entities, Aggregates, Value Objects）
├─ API仕様（エンドポイント定義）
├─ 80%精緻化されたドメイン言語
└─ データベース設計

📤 OUTPUT (AI生成へ)
├─ L3 Capability定義（操作単位）
├─ Operation定義（業務操作）
├─ UseCase詳細設計（ステップバイステップ）
├─ Page定義（画面仕様）★AI生成の直接入力
├─ 100%精緻化されたドメイン言語
└─ コンポーネント仕様
```

---

## 📐 成果物の全体像

### ディレクトリ構造

```
docs/parasol/3-DEVELOPMENT-DESIGN/
└── bounded-contexts/
    └── [bc-name]/
        ├── README.md                      # BC内のL3設計概要
        ├── l3-capabilities/
        │   └── [l3-capability-name]/
        │       ├── l3-capability.md       # L3 Capability定義
        │       ├── operations/
        │       │   └── [operation-name]/
        │       │       └── operation.md   # Operation定義
        │       └── usecases/
        │           └── [usecase-name]/
        │               ├── usecase.md     # UseCase詳細設計
        │               └── pages/
        │                   └── [page-name].md  # ★AI生成入力
        ├── domain/
        │   └── refined-domain-language.md  # 100%精緻化ドメイン言語
        ├── components/
        │   ├── ui-components.md           # UIコンポーネント仕様
        │   └── business-components.md     # ビジネスコンポーネント仕様
        └── integration/
            └── component-integration.md   # コンポーネント統合仕様
```

### 成果物一覧

| 成果物 | AI生成入力 | 説明 |
|--------|-----------|------|
| `l3-capability.md` | ⚙️ 間接 | L3 Capability定義（操作単位の機能） |
| `operation.md` | ⚙️ 間接 | Operation定義（業務操作） |
| `usecase.md` | ⚙️ 間接 | UseCase詳細設計（ステップバイステップ） |
| `[page-name].md` | ⭐ **直接** | Page定義（画面仕様）- **AI生成の主要入力** |
| `refined-domain-language.md` | ⭐ **直接** | 100%精緻化ドメイン言語 |
| `ui-components.md` | ⭐ **直接** | UIコンポーネント仕様 |
| `business-components.md` | ⭐ **直接** | ビジネスロジックコンポーネント仕様 |

---

## L3 Capability定義

### L3 Capabilityとは

**L3 Capability**は、ユーザーが実行する**具体的な操作単位**の機能です。

```
L1 Capability（戦略レベル）
  ├─ L2 Capability（戦術レベル、BCの抽出基準）
  │   └─ L3 Capability（操作レベル）← 📍 ここ
  │       ├─ Operation（業務操作）
  │       └─ UseCase（詳細フロー）
  │           └─ Page（画面）
```

### L3 Capabilityの粒度

| L2 Capability | L3 Capability（例） |
|---------------|---------------------|
| プロジェクト管理 [Project Management] [PROJECT_MGMT] | - プロジェクト作成 [Create Project] [CREATE_PROJECT]<br>- プロジェクト編集 [Edit Project] [EDIT_PROJECT]<br>- プロジェクト削除 [Delete Project] [DELETE_PROJECT]<br>- プロジェクト検索 [Search Project] [SEARCH_PROJECT] |
| タスク管理 [Task Management] [TASK_MGMT] | - タスク作成 [Create Task] [CREATE_TASK]<br>- タスク割当 [Assign Task] [ASSIGN_TASK]<br>- タスク進捗更新 [Update Task Progress] [UPDATE_TASK_PROGRESS] |

### L3 Capability定義テンプレート

**ファイル名**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/l3-capabilities/[l3-name]/l3-capability.md`

```markdown
# L3 Capability: [日本語名]

**Bounded Context**: [BC名]
**親L2 Capability**: [L2 Capability名]
**パラソルドメイン言語**: [日本語名] [英語名] [SYSTEM_NAME]
**バージョン**: 1.0.0

---

## 📋 基本情報

| 項目 | 内容 |
|------|------|
| L3 Capability ID | `[SYSTEM_NAME]` |
| 日本語名 | [日本語名] |
| 英語名 | [英語名] |
| 所属BC | [BC名] |
| 親L2 Capability | [L2 Capability名] |
| 操作タイプ | [作成/更新/削除/検索/承認/etc] |

---

## 🎯 目的と責務

### 目的
[このL3 Capabilityが提供する価値を記述]

### 責務
- [責務1]
- [責務2]
- [責務3]

---

## 👥 アクター

| アクター | 役割 | 操作権限 |
|---------|------|---------|
| [アクター1] | [役割説明] | [権限レベル] |
| [アクター2] | [役割説明] | [権限レベル] |

---

## 🔄 Operations（業務操作）

このL3 Capabilityは、以下のOperationsから構成されます。

### Operation一覧

| Operation | 説明 | 詳細ドキュメント |
|-----------|------|-----------------|
| [Operation名1] | [簡潔な説明] | [./operations/[operation-name]/operation.md](./operations/[operation-name]/operation.md) |
| [Operation名2] | [簡潔な説明] | [./operations/[operation-name]/operation.md](./operations/[operation-name]/operation.md) |

---

## 📊 関連ドメインオブジェクト

このL3 Capabilityが操作するドメインオブジェクト（Layer 2で定義）:

| ドメインオブジェクト | タイプ | 操作 |
|-------------------|-------|------|
| [オブジェクト名1] | [Entity/Aggregate/Value Object] | [Create/Read/Update/Delete] |
| [オブジェクト名2] | [Entity/Aggregate/Value Object] | [Create/Read/Update/Delete] |

---

## 🔗 関連API

このL3 Capabilityが使用するAPI（Layer 2で定義）:

| API | メソッド | エンドポイント | 説明 |
|-----|---------|---------------|------|
| [API名1] | POST | `/api/[resource]` | [説明] |
| [API名2] | GET | `/api/[resource]/{id}` | [説明] |

---

## ✅ ビジネスルール

### 前提条件
- [前提条件1]
- [前提条件2]

### 制約
- [制約1]
- [制約2]

### バリデーションルール
- [バリデーション1]
- [バリデーション2]

---

## 🎨 UI要件

### 画面構成
- [画面1]: [説明]
- [画面2]: [説明]

### 主要UIコンポーネント
- [コンポーネント1]: [説明]
- [コンポーネント2]: [説明]

---

## 📝 補足

[追加の補足情報]

---

**関連ドキュメント**:
- Layer 2 BC定義: `docs/parasol/2-MICROSERVICE-DESIGN/bounded-contexts/[bc-name]/README.md`
- 親L2 Capability: `docs/parasol/2-MICROSERVICE-DESIGN/bounded-contexts/[bc-name]/l2-capabilities/[l2-name]/l2-capability.md`
```

---

## Operation設計

### Operationとは

**Operation**は、L3 Capabilityを構成する**業務操作**です。1つのL3 Capabilityは、1つまたは複数のOperationsから構成されます。

### Operationの粒度

```
例: L3 Capability「プロジェクト作成」
  ├─ Operation「プロジェクト基本情報入力」
  ├─ Operation「プロジェクトメンバー設定」
  ├─ Operation「プロジェクト作成確認」
  └─ Operation「プロジェクト作成実行」
```

### Operation定義テンプレート

**ファイル名**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/l3-capabilities/[l3-name]/operations/[operation-name]/operation.md`

```markdown
# Operation: [日本語名]

**L3 Capability**: [L3 Capability名]
**Bounded Context**: [BC名]
**パラソルドメイン言語**: [日本語名] [英語名] [SYSTEM_NAME]
**バージョン**: 1.0.0

---

## 📋 基本情報

| 項目 | 内容 |
|------|------|
| Operation ID | `[SYSTEM_NAME]` |
| 日本語名 | [日本語名] |
| 英語名 | [英語名] |
| 親L3 Capability | [L3 Capability名] |
| 操作タイプ | [入力/確認/実行/検証/etc] |

---

## 🎯 目的

[このOperationの目的を記述]

---

## 📥 入力

### 入力パラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|-------------|----|----|------|---------------|
| [param1] | [型] | ✅/❌ | [説明] | [ルール] |
| [param2] | [型] | ✅/❌ | [説明] | [ルール] |

### 入力元
- [前のOperation/ユーザー入力/API応答/etc]

---

## 📤 出力

### 出力データ

| データ名 | 型 | 説明 |
|---------|----|----|
| [output1] | [型] | [説明] |
| [output2] | [型] | [説明] |

### 出力先
- [次のOperation/API/データストア/etc]

---

## 🔄 処理フロー

```
1. [ステップ1]
   └─ [詳細]

2. [ステップ2]
   ├─ [詳細a]
   └─ [詳細b]

3. [ステップ3]
   └─ [詳細]
```

---

## 🔗 関連API呼び出し

| API | メソッド | エンドポイント | 目的 |
|-----|---------|---------------|------|
| [API名] | [HTTP Method] | `[endpoint]` | [目的] |

---

## ✅ ビジネスルール

### バリデーションルール
- [ルール1]
- [ルール2]

### 制約
- [制約1]
- [制約2]

---

## 🎨 UI要件（該当する場合）

### 画面要素
- [要素1]: [説明]
- [要素2]: [説明]

### ユーザーインタラクション
- [インタラクション1]
- [インタラクション2]

---

## ⚠️ エラー処理

| エラーケース | エラーメッセージ | 処理 |
|-------------|----------------|------|
| [エラー1] | [メッセージ] | [処理内容] |
| [エラー2] | [メッセージ] | [処理内容] |

---

## 📝 補足

[追加の補足情報]
```

---

## UseCase詳細設計

### UseCaseとは

**UseCase**は、L3 Capabilityを実現するための**エンドツーエンドのシナリオ**です。複数のOperationsを組み合わせて、ユーザーの目的を達成します。

### UseCase定義テンプレート

**ファイル名**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/l3-capabilities/[l3-name]/usecases/[usecase-name]/usecase.md`

```markdown
# UseCase: [日本語名]

**L3 Capability**: [L3 Capability名]
**Bounded Context**: [BC名]
**パラソルドメイン言語**: [日本語名] [英語名] [SYSTEM_NAME]
**バージョン**: 1.0.0

---

## 📋 基本情報

| 項目 | 内容 |
|------|------|
| UseCase ID | `[SYSTEM_NAME]` |
| 日本語名 | [日本語名] |
| 英語名 | [英語名] |
| 親L3 Capability | [L3 Capability名] |
| 優先度 | [高/中/低] |

---

## 🎯 目的とゴール

### 目的
[このUseCaseの目的]

### ゴール
[ユーザーが達成したい最終状態]

---

## 👥 アクター

| アクター | 役割 |
|---------|------|
| [主アクター] | [役割説明] |
| [副アクター] | [役割説明] |

---

## ✅ 事前条件

- [条件1]
- [条件2]

---

## ✅ 事後条件（成功時）

- [条件1]
- [条件2]

---

## 🔄 基本フロー

### ステップバイステップ

```
1. [アクター]が[アクション]を実行
   └─ システム: [応答]
   └─ 画面: [Page名]（詳細: ./pages/[page-name].md）

2. [アクター]が[アクション]を実行
   ├─ システム: [応答a]
   └─ システム: [応答b]

3. システムが[処理]を実行
   ├─ API呼び出し: [API名]
   └─ データストア: [操作]

4. [完了状態]
```

### Operations構成

このUseCaseは以下のOperationsを使用します:

| ステップ | Operation | 説明 |
|---------|-----------|------|
| 1 | [Operation名1] | [説明] |
| 2 | [Operation名2] | [説明] |
| 3 | [Operation名3] | [説明] |

---

## 🔀 代替フロー

### 代替フロー1: [名前]

**トリガー**: [ステップX]で[条件]の場合

```
X-1. [処理]
X-2. [処理]
→ [ステップYに戻る/終了]
```

### 代替フロー2: [名前]

**トリガー**: [ステップX]で[条件]の場合

```
X-1. [処理]
X-2. [処理]
→ [ステップYに戻る/終了]
```

---

## ❌ 例外フロー

### 例外1: [名前]

**トリガー**: [条件]

```
1. システムが[エラー]を検出
2. [エラーメッセージ]を表示
3. [処理/ロールバック/etc]
→ [終了/ステップXに戻る]
```

---

## 📱 画面遷移

```
[Page1] → [Page2] → [Page3] → [完了]
   ↓         ↓         ↓
[エラー]  [キャンセル] [確認]
```

### 画面一覧

| 画面名 | 目的 | 詳細ドキュメント |
|-------|------|-----------------|
| [Page1] | [目的] | [./pages/[page1].md](./pages/[page1].md) |
| [Page2] | [目的] | [./pages/[page2].md](./pages/[page2].md) |

---

## 🔗 関連API

| API | 呼び出しタイミング | 目的 |
|-----|------------------|------|
| [API名1] | [ステップX] | [目的] |
| [API名2] | [ステップY] | [目的] |

---

## ✅ ビジネスルール

### バリデーションルール
- [ルール1]
- [ルール2]

### 制約
- [制約1]
- [制約2]

---

## 🎨 UI/UX要件

### レスポンシブ対応
- [要件1]
- [要件2]

### アクセシビリティ
- [要件1]
- [要件2]

---

## ⚡ パフォーマンス要件

- [要件1]
- [要件2]

---

## 🔒 セキュリティ要件

- [要件1]
- [要件2]

---

## 📝 補足

[追加の補足情報]
```

---

## Page定義（AI生成入力）

### 📌 重要: Page定義はAI生成の直接入力

**Page定義**は、Layer 3で最も重要な成果物の1つであり、**AIがUIコードを生成する際の直接的な入力**となります。

```
Page定義（MD）
    ↓
AI Code Generation
    ↓
React/Vue/Angularコンポーネント（自動生成）
```

### Page定義テンプレート

**ファイル名**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/l3-capabilities/[l3-name]/usecases/[usecase-name]/pages/[page-name].md`

```markdown
# Page: [画面名]

**UseCase**: [UseCase名]
**L3 Capability**: [L3 Capability名]
**Bounded Context**: [BC名]
**パラソルドメイン言語**: [日本語名] [英語名] [SYSTEM_NAME]
**バージョン**: 1.0.0

> ⭐ **AI生成入力**: このドキュメントはAI Code Generationの直接入力として使用されます。

---

## 📋 基本情報

| 項目 | 内容 |
|------|------|
| Page ID | `[SYSTEM_NAME]` |
| 日本語名 | [画面日本語名] |
| 英語名 | [Page Name] |
| URL Path | `/[path]` |
| 親UseCase | [UseCase名] |
| 画面タイプ | [一覧/詳細/作成/編集/削除確認/etc] |

---

## 🎯 目的

[この画面の目的を記述]

---

## 👥 アクセス権限

| 役割 | アクセスレベル |
|------|--------------|
| [役割1] | [読取/書込/管理] |
| [役割2] | [読取/書込/管理] |

---

## 🎨 レイアウト構造

### ワイヤーフレーム（テキストベース）

```
┌─────────────────────────────────────────────────────┐
│ Header                                               │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [ページタイトル]                    [アクションボタン]│ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ Main Content                                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Section 1: [セクション名]                         │ │
│ │ ┌─────────────────┐ ┌─────────────────┐         │ │
│ │ │ [フィールド1]    │ │ [フィールド2]    │         │ │
│ │ └─────────────────┘ └─────────────────┘         │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Section 2: [セクション名]                         │ │
│ │ [テーブル/リスト/etc]                             │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ Footer                                               │
│ [保存] [キャンセル]                                  │
└─────────────────────────────────────────────────────┘
```

---

## 🧩 UIコンポーネント構成

### コンポーネント階層

```
Page Component
├─ HeaderComponent
│  ├─ TitleComponent
│  └─ ActionButtonComponent
├─ MainContentComponent
│  ├─ Section1Component
│  │  ├─ Field1Component
│  │  └─ Field2Component
│  └─ Section2Component
│     └─ TableComponent
└─ FooterComponent
   ├─ SaveButtonComponent
   └─ CancelButtonComponent
```

### コンポーネント詳細

#### 1. HeaderComponent

| プロパティ | 型 | デフォルト値 | 説明 |
|-----------|----|-----------|----|
| title | string | - | ページタイトル |
| showActionButton | boolean | true | アクションボタン表示フラグ |

#### 2. Field1Component

| プロパティ | 型 | デフォルト値 | 説明 |
|-----------|----|-----------|----|
| label | string | - | フィールドラベル |
| value | string | "" | フィールド値 |
| required | boolean | false | 必須フラグ |
| validation | function | - | バリデーション関数 |

---

## 📝 フォームフィールド定義

### フィールド一覧

| フィールド名 | ラベル | 型 | 必須 | バリデーション | デフォルト値 | プレースホルダー |
|------------|-------|----|----|---------------|-------------|----------------|
| [field1] | [ラベル1] | text | ✅ | [ルール] | - | [プレースホルダー] |
| [field2] | [ラベル2] | number | ❌ | [ルール] | 0 | [プレースホルダー] |
| [field3] | [ラベル3] | select | ✅ | [ルール] | - | [プレースホルダー] |
| [field4] | [ラベル4] | date | ✅ | [ルール] | today | [プレースホルダー] |

### バリデーションルール詳細

#### field1: [フィールド名]
- **必須チェック**: 空白不可
- **文字数**: 最小[X]文字、最大[Y]文字
- **形式**: [正規表現/ルール]
- **エラーメッセージ**: "[メッセージ]"

#### field2: [フィールド名]
- **数値範囲**: [最小値] ≤ 値 ≤ [最大値]
- **形式**: [整数/小数]
- **エラーメッセージ**: "[メッセージ]"

---

## 🔄 状態管理

### ページ状態

| 状態名 | 型 | 初期値 | 説明 |
|-------|----|----|------|
| isLoading | boolean | false | ローディング状態 |
| formData | object | {} | フォームデータ |
| errors | object | {} | エラー情報 |
| isDirty | boolean | false | 変更フラグ |

### 状態遷移

```
初期状態（Loading）
    ↓
データ取得完了（Ready）
    ↓
ユーザー入力（Editing）
    ↓
バリデーション（Validating）
    ├─ 成功 → 保存中（Saving）→ 完了（Completed）
    └─ 失敗 → エラー表示（Error）→ Editing
```

---

## 🔗 API連携

### 画面初期化時

| API | メソッド | エンドポイント | 目的 | レスポンス |
|-----|---------|---------------|------|-----------|
| [API名] | GET | `/api/[resource]/{id}` | データ取得 | [データ構造] |

### データ保存時

| API | メソッド | エンドポイント | 目的 | リクエスト | レスポンス |
|-----|---------|---------------|------|----------|-----------|
| [API名] | POST | `/api/[resource]` | 新規作成 | [データ構造] | [データ構造] |
| [API名] | PUT | `/api/[resource]/{id}` | 更新 | [データ構造] | [データ構造] |

### APIリクエスト例

```json
// POST /api/[resource]
{
  "field1": "value1",
  "field2": 123,
  "field3": "option1",
  "field4": "2025-11-01"
}
```

### APIレスポンス例

```json
// 成功
{
  "success": true,
  "data": {
    "id": "abc123",
    "field1": "value1",
    "field2": 123,
    "createdAt": "2025-11-01T10:00:00Z"
  }
}

// エラー
{
  "success": false,
  "errors": [
    {
      "field": "field1",
      "message": "必須項目です"
    }
  ]
}
```

---

## 🎭 ユーザーインタラクション

### ボタンアクション

| ボタン | ラベル | アクション | 確認ダイアログ |
|-------|-------|----------|--------------|
| [button1] | [ラベル] | [アクション内容] | ✅/❌ |
| [button2] | [ラベル] | [アクション内容] | ✅/❌ |

### イベントハンドラ

| イベント | トリガー | 処理内容 |
|---------|---------|---------|
| onLoad | ページ読み込み | [処理] |
| onChange | フィールド変更 | [処理] |
| onSubmit | フォーム送信 | [処理] |
| onCancel | キャンセル | [処理] |

---

## ⚠️ エラーハンドリング

### エラー表示

| エラータイプ | 表示方法 | メッセージ例 |
|------------|---------|-------------|
| フィールドエラー | フィールド下に赤文字 | "[フィールド名]は必須項目です" |
| API通信エラー | トースト通知 | "通信エラーが発生しました" |
| 権限エラー | ダイアログ | "この操作を実行する権限がありません" |

### エラーメッセージ一覧

| エラーコード | メッセージ | 表示位置 | アクション |
|------------|----------|---------|-----------|
| ERR_001 | [メッセージ] | [位置] | [アクション] |
| ERR_002 | [メッセージ] | [位置] | [アクション] |

---

## 🎨 スタイリング要件

### レスポンシブ対応

| ブレークポイント | レイアウト |
|----------------|----------|
| Desktop (>1024px) | [レイアウト説明] |
| Tablet (768-1024px) | [レイアウト説明] |
| Mobile (<768px) | [レイアウト説明] |

### カラーパレット

| 要素 | カラー | 用途 |
|------|-------|------|
| Primary | [色コード] | [用途] |
| Secondary | [色コード] | [用途] |
| Error | [色コード] | [用途] |
| Success | [色コード] | [用途] |

### タイポグラフィ

| 要素 | フォント | サイズ | ウェイト |
|------|---------|-------|---------|
| H1 | [フォント] | [サイズ] | [ウェイト] |
| H2 | [フォント] | [サイズ] | [ウェイト] |
| Body | [フォント] | [サイズ] | [ウェイト] |

---

## ♿ アクセシビリティ要件

### WCAG準拠

- [要件1]
- [要件2]

### ARIA属性

| 要素 | ARIA属性 | 値 |
|------|---------|-----|
| [要素1] | aria-label | [値] |
| [要素2] | aria-required | true |

### キーボード操作

| キー | アクション |
|------|----------|
| Tab | [アクション] |
| Enter | [アクション] |
| Esc | [アクション] |

---

## ⚡ パフォーマンス要件

- **初期読み込み**: [X]秒以内
- **API応答待機**: ローディングインジケータ表示
- **画像最適化**: [要件]
- **遅延読み込み**: [要件]

---

## 🔒 セキュリティ要件

- **入力サニタイゼーション**: [要件]
- **XSS対策**: [要件]
- **CSRF対策**: [要件]
- **認証**: [要件]

---

## 📱 画面遷移

### 遷移元

| 遷移元画面 | トリガー |
|----------|---------|
| [画面名1] | [トリガー] |
| [画面名2] | [トリガー] |

### 遷移先

| 遷移先画面 | トリガー |
|----------|---------|
| [画面名1] | [トリガー] |
| [画面名2] | [トリガー] |

---

## 🧪 テストケース

### 基本フロー

| テストケース | 入力 | 期待結果 |
|------------|------|---------|
| TC001 | [入力] | [期待結果] |
| TC002 | [入力] | [期待結果] |

### バリデーション

| テストケース | 入力 | 期待エラー |
|------------|------|-----------|
| TC101 | [入力] | [エラーメッセージ] |
| TC102 | [入力] | [エラーメッセージ] |

### エッジケース

| テストケース | シナリオ | 期待動作 |
|------------|---------|---------|
| TC201 | [シナリオ] | [期待動作] |
| TC202 | [シナリオ] | [期待動作] |

---

## 📝 補足

[追加の補足情報]

---

## 🔗 関連ドキュメント

- UseCase定義: `../usecase.md`
- L3 Capability定義: `../../l3-capability.md`
- UIコンポーネント仕様: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/components/ui-components.md`
- API仕様: `docs/parasol/2-MICROSERVICE-DESIGN/bounded-contexts/[bc-name]/api/api-specification.md`
```

---

## ドメイン言語の最終精緻化

### Layer 3におけるドメイン言語の役割

Layer 3では、Layer 2で80%精緻化されたドメイン言語を**100%完成**させます。

### 精緻化の流れ

```
Layer 1: 5% 精緻化
  ├─ 戦略レベルの概念定義
  └─ 主要エンティティの特定

Layer 2: 80% 精緻化
  ├─ ドメインモデル完成
  ├─ Entities, Aggregates, Value Objects
  └─ API用語の確定

Layer 3: 100% 精緻化 ← 📍 最終完成
  ├─ UI用語の追加
  ├─ 操作・アクション用語
  ├─ エラーメッセージ用語
  └─ 全体の整合性確認
```

### 精緻化されたドメイン言語テンプレート

**ファイル名**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/domain/refined-domain-language.md`

```markdown
# パラソルドメイン言語（100%精緻化版）

**Bounded Context**: [BC名]
**バージョン**: 1.0.0
**最終更新**: 2025-11-01

> ⭐ **AI生成入力**: このドキュメントはAI Code Generationの直接入力として使用されます。
>
> **精緻化レベル**: 100%（実装可能レベル）

---

## 📋 基本方針

### 3要素記法
```
日本語名 [英語名] [SYSTEM_NAME]
```

### 命名規則
- **日本語名**: ビジネス用語（誰でも理解可能）
- **英語名**: 技術用語（開発者向け）
- **SYSTEM_NAME**: システム内部識別子（UPPER_SNAKE_CASE）

---

## 🏗️ エンティティ（Entities）

### 主要エンティティ

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 | ID型 |
|---------|-------|-------------|------|------|
| [エンティティ1] | [Entity1] | [ENTITY_1] | [説明] | UUID/String/Number |
| [エンティティ2] | [Entity2] | [ENTITY_2] | [説明] | UUID/String/Number |

### エンティティ属性

#### [エンティティ1名] [Entity1] [ENTITY_1]

| 日本語属性名 | 英語属性名 | SYSTEM_ATTR_NAME | 型 | 必須 | 説明 |
|------------|----------|-----------------|----|----|------|
| [属性1] | [attribute1] | [ATTRIBUTE_1] | string | ✅ | [説明] |
| [属性2] | [attribute2] | [ATTRIBUTE_2] | number | ❌ | [説明] |

---

## 📦 集約（Aggregates）

| 日本語名 | 英語名 | SYSTEM_NAME | 集約ルート | 含まれるエンティティ |
|---------|-------|-------------|---------|-------------------|
| [集約1] | [Aggregate1] | [AGGREGATE_1] | [ルートエンティティ] | [エンティティリスト] |

---

## 💎 値オブジェクト（Value Objects）

| 日本語名 | 英語名 | SYSTEM_NAME | 説明 | 属性 |
|---------|-------|-------------|------|------|
| [VO1] | [ValueObject1] | [VALUE_OBJ_1] | [説明] | [属性リスト] |

---

## 🎯 L3 Capabilities（操作）

| 日本語名 | 英語名 | SYSTEM_NAME | 操作タイプ | 対象エンティティ |
|---------|-------|-------------|---------|----------------|
| [操作1] | [Operation1] | [OPERATION_1] | Create | [エンティティ] |
| [操作2] | [Operation2] | [OPERATION_2] | Update | [エンティティ] |
| [操作3] | [Operation3] | [OPERATION_3] | Delete | [エンティティ] |

---

## 🔄 アクション・動詞

### CRUD操作

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| 作成する | Create | CREATE |
| 取得する | Get / Retrieve | GET |
| 更新する | Update | UPDATE |
| 削除する | Delete | DELETE |

### ビジネスアクション

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| [アクション1] | [Action1] | [ACTION_1] |
| [アクション2] | [Action2] | [ACTION_2] |

---

## 🎨 UI用語

### 画面要素

| 日本語 | 英語 | SYSTEM_NAME | 用途 |
|-------|------|-------------|------|
| [要素1] | [Element1] | [ELEMENT_1] | [用途] |
| [要素2] | [Element2] | [ELEMENT_2] | [用途] |

### ボタンラベル

| 日本語 | 英語 | SYSTEM_NAME |
|-------|------|-------------|
| 保存 | Save | BTN_SAVE |
| キャンセル | Cancel | BTN_CANCEL |
| 削除 | Delete | BTN_DELETE |
| [カスタムボタン] | [Custom] | [BTN_CUSTOM] |

### メッセージ

| 日本語 | 英語 | SYSTEM_NAME | タイプ |
|-------|------|-------------|-------|
| [メッセージ1] | [Message1] | [MSG_1] | Success/Error/Info |

---

## ⚠️ エラー用語

### エラーコード

| エラーコード | 日本語メッセージ | 英語メッセージ | 説明 |
|------------|----------------|--------------|------|
| ERR_001 | [日本語] | [English] | [説明] |
| ERR_002 | [日本語] | [English] | [説明] |

---

## 🔗 関係性用語

| 日本語 | 英語 | SYSTEM_NAME | 説明 |
|-------|------|-------------|------|
| [関係1] | [Relationship1] | [REL_1] | [説明] |

---

## 📊 状態・ステータス

| 日本語 | 英語 | SYSTEM_NAME | 説明 |
|-------|------|-------------|------|
| [状態1] | [Status1] | [STATUS_1] | [説明] |
| [状態2] | [Status2] | [STATUS_2] | [説明] |

---

## 🔄 変更履歴（Layer 2からの追加・修正）

### 追加された用語

| 日本語 | 英語 | SYSTEM_NAME | 理由 |
|-------|------|-------------|------|
| [用語1] | [Term1] | [TERM_1] | [Layer 3で必要になった理由] |

### 修正された用語

| 旧 | 新 | 理由 |
|----|----|----|
| [旧用語] | [新用語] | [修正理由] |

---

## 📝 補足

[追加の補足情報]
```

---

## テンプレート集

### 1. BC内README（Layer 3概要）

**ファイル名**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/README.md`

```markdown
# Bounded Context: [BC名] - Layer 3 開発設計

**Bounded Context**: [BC名]
**バージョン**: 1.0.0

---

## 📋 概要

このディレクトリには、[BC名]のLayer 3（パラソル開発設計）成果物が格納されています。

---

## 🎯 L3 Capabilities一覧

| L3 Capability | 説明 | 詳細 |
|--------------|------|------|
| [L3-1] | [説明] | [./l3-capabilities/[name]/l3-capability.md](./l3-capabilities/[name]/l3-capability.md) |
| [L3-2] | [説明] | [./l3-capabilities/[name]/l3-capability.md](./l3-capabilities/[name]/l3-capability.md) |

---

## 📐 成果物構成

```
.
├── README.md（このファイル）
├── l3-capabilities/      # L3 Capability定義
├── domain/               # ドメイン言語（100%精緻化）
├── components/           # コンポーネント仕様
└── integration/          # 統合仕様
```

---

## 🔗 関連ドキュメント

- Layer 2 BC定義: `docs/parasol/2-MICROSERVICE-DESIGN/bounded-contexts/[bc-name]/README.md`
- Layer 1 Value Design: `docs/parasol/1-VALUE-DESIGN/`
```

### 2. UIコンポーネント仕様

**ファイル名**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/components/ui-components.md`

```markdown
# UIコンポーネント仕様

**Bounded Context**: [BC名]
**バージョン**: 1.0.0

> ⭐ **AI生成入力**: このドキュメントはAI Code Generationの直接入力として使用されます。

---

## 📋 共通UIコンポーネント一覧

| コンポーネント名 | 説明 | 使用箇所 |
|----------------|------|---------|
| [Component1] | [説明] | [使用箇所] |
| [Component2] | [説明] | [使用箇所] |

---

## 🧩 コンポーネント詳細

### [Component1]

**目的**: [説明]

#### Props

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|-----------|----|----|------------|------|
| [prop1] | string | ✅ | - | [説明] |
| [prop2] | number | ❌ | 0 | [説明] |

#### Events

| イベント名 | パラメータ | 説明 |
|----------|----------|------|
| [event1] | [params] | [説明] |

#### 使用例

```jsx
<Component1
  prop1="value"
  prop2={123}
  onEvent1={handleEvent}
/>
```
```

### 3. ビジネスコンポーネント仕様

**ファイル名**: `docs/parasol/3-DEVELOPMENT-DESIGN/bounded-contexts/[bc-name]/components/business-components.md`

```markdown
# ビジネスコンポーネント仕様

**Bounded Context**: [BC名]
**バージョン**: 1.0.0

> ⭐ **AI生成入力**: このドキュメントはAI Code Generationの直接入力として使用されます。

---

## 📋 ビジネスロジックコンポーネント一覧

| コンポーネント名 | 責務 | 使用箇所 |
|----------------|------|---------|
| [Service1] | [責務] | [使用箇所] |
| [Service2] | [責務] | [使用箇所] |

---

## 🧩 コンポーネント詳細

### [Service1]

**責務**: [説明]

#### メソッド

| メソッド名 | 引数 | 戻り値 | 説明 |
|----------|------|-------|------|
| [method1] | [params] | [return] | [説明] |

#### 依存関係

- [依存コンポーネント1]
- [依存コンポーネント2]
```

---

## チェックリスト

### Layer 3設計完了チェックリスト

#### L3 Capability定義

- [ ] すべてのL2 CapabilityからL3 Capabilityへの分解完了
- [ ] L3 Capability定義MDファイル作成
- [ ] パラソルドメイン言語（3要素記法）記載
- [ ] 責務と目的の明確化
- [ ] アクター定義
- [ ] 関連ドメインオブジェクト明記
- [ ] 関連API明記

#### Operation設計

- [ ] すべてのL3 CapabilityからOperationsへの分解完了
- [ ] Operation定義MDファイル作成
- [ ] 入力/出力パラメータ定義
- [ ] 処理フロー記述
- [ ] バリデーションルール定義
- [ ] エラー処理定義

#### UseCase詳細設計

- [ ] すべてのL3 CapabilityでUseCaseシナリオ作成
- [ ] UseCase定義MDファイル作成
- [ ] 基本フロー記述（ステップバイステップ）
- [ ] 代替フロー記述
- [ ] 例外フロー記述
- [ ] 事前条件・事後条件定義
- [ ] 画面遷移図作成

#### Page定義（AI生成入力）

- [ ] すべての画面でPage定義MD作成
- [ ] レイアウト構造定義（ワイヤーフレーム）
- [ ] UIコンポーネント構成定義
- [ ] フォームフィールド詳細定義
- [ ] バリデーションルール詳細定義
- [ ] 状態管理定義
- [ ] API連携定義（リクエスト/レスポンス例）
- [ ] ユーザーインタラクション定義
- [ ] エラーハンドリング定義
- [ ] レスポンシブ対応要件
- [ ] アクセシビリティ要件
- [ ] パフォーマンス要件
- [ ] セキュリティ要件

#### ドメイン言語精緻化

- [ ] Layer 2ドメイン言語をベースに100%精緻化
- [ ] UI用語追加
- [ ] アクション・動詞追加
- [ ] エラー用語追加
- [ ] 全体の整合性確認
- [ ] `refined-domain-language.md` 作成

#### コンポーネント仕様

- [ ] UIコンポーネント仕様作成
- [ ] ビジネスコンポーネント仕様作成
- [ ] コンポーネント間の依存関係定義

#### AI生成準備

- [ ] すべてのPage定義がAI生成可能な詳細度
- [ ] APIリクエスト/レスポンス例が明確
- [ ] バリデーションルールが実装可能レベル
- [ ] エラーメッセージが具体的
- [ ] UIコンポーネントProps定義が完全

#### レビューと品質保証

- [ ] Layer 2設計との整合性確認
- [ ] パラソルドメイン言語の一貫性確認
- [ ] すべてのMDファイルが命名規則に準拠
- [ ] テンプレート構造に従っている
- [ ] 相互参照リンクが正しい

---

## 🎯 Layer 3設計のゴール

Layer 3設計が完了すると、以下が実現されます:

1. **AI生成可能な詳細設計**
   - すべてのPage定義MDから直接UIコードを生成可能
   - API連携コードを自動生成可能
   - バリデーションロジックを自動生成可能

2. **100%精緻化されたドメイン言語**
   - 実装レベルまで用語が定義完了
   - UI、API、エラーメッセージまで網羅

3. **完全なトレーサビリティ**
   - Layer 1のValue Stream → Layer 3のPageまで追跡可能
   - ビジネス価値から実装までの繋がりが明確

4. **パラソルワールドへの統合**
   - MD → AI生成 → テスト → 自動補正のループが機能
   - 設計書が常にシステムの真実（Source of Truth）

---

## 🔗 関連ドキュメント

- **上位層**: [Layer 2: マイクロサービスデザイン](./parasol-v3-layer2-microservice-design.md)
- **全体概要**: [パラソルV3設計 - 全体概要](./parasol-v3-design-overview.md)
- **完全プロセス**: [パラソルV3完全設計ブレークダウンプロセス](./parasol-v3-complete-design-breakdown-process.md)
- **パラソルワールド**: [パラソルワールド - 概要](./parasol-world-overview.md)

---

**作成日**: 2025-11-01
**最終更新**: 2025-11-01
**バージョン**: 1.0.0
