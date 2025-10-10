# パラソル設計ディレクトリ構造標準仕様 v2.0

**バージョン**: 2.0.0
**更新日**: 2025-10-10
**適用範囲**: 全パラソルサービス
**準拠**: パラソル設計v2.0仕様

## 📋 標準ディレクトリ構造

### 完全階層構造
```
docs/parasol/services/
└── [service-name]/                    # サービスレベル
    ├── service.md                     # サービス定義（必須）
    ├── domain-language.md             # ドメイン言語定義（推奨）
    ├── api-specification.md           # API仕様（推奨）
    ├── database-design.md             # DB設計（推奨）
    ├── integration-specification.md   # 統合仕様（推奨）
    └── capabilities/                  # ケーパビリティ群
        └── [capability-name]/         # ケーパビリティレベル
            ├── capability.md          # ケーパビリティ定義（必須）
            └── operations/            # オペレーション群
                └── [operation-name]/  # オペレーションレベル
                    ├── operation.md   # オペレーション定義（必須）
                    ├── usecases/      # ユースケース群（必須）
                    │   └── [usecase-name]/  # ユースケースレベル
                    │       ├── usecase.md  # ユースケース定義（必須）
                    │       └── page.md     # ページ定義（必須・1対1）
                    └── tests/         # テスト定義群（オプション）
                        ├── [test-name].md
                        └── integration-tests.md
```

## 🎯 設計原則

### 1. 1対1関係の強制
```
✅ 正しい構造（v2.0仕様）:
usecases/
├── create-project-proposal/
│   ├── usecase.md    ← 必須
│   └── page.md       ← 必須（1対1関係）
└── obtain-approval/
    ├── usecase.md    ← 必須
    └── page.md       ← 必須（1対1関係）

❌ 禁止構造（v1.0仕様）:
usecases/
├── step-1-action.md     ← 意味のない名前
├── step-2-action.md     ← 1対1関係なし
└── pages/
    ├── page-1.md        ← 分離構造（非推奨）
    └── page-2.md
```

### 2. 意味のある命名規則

#### サービス名
- **形式**: `[value-creation]-service`
- **禁止**: `*-management-service`（「管理」は価値を表現しない）
- **例**:
  - ✅ `project-success-service`（価値：成功支援）
  - ❌ `project-management-service`（CRUD的）

#### ケーパビリティ名
- **形式**: `[action-verb]-[target-object]`
- **例**: `plan-and-execute-project`, `authenticate-and-manage-users`

#### オペレーション名
- **形式**: `[business-value-verb]-[object]`
- **例**: `launch-project`, `facilitate-communication`
- **禁止**: `manage-*`, `process-*`（価値が不明確）

#### ユースケース名
- **形式**: `[action-verb]-[object]`
- **例**: `create-project-proposal`, `obtain-approval`
- **禁止**: `step-[number]-[action]`（シーケンシャル命名）

### 3. 必須ファイル定義

#### サービスレベル（7ファイル）
| ファイル名 | 必須度 | 説明 |
|-----------|--------|------|
| `service.md` | ◎必須 | サービス全体定義・責務・価値 |
| `domain-language.md` | ○推奨 | パラソルドメイン言語定義 |
| `api-specification.md` | ○推奨 | RESTful API仕様定義 |
| `database-design.md` | ○推奨 | データベース設計・ER図 |
| `integration-specification.md` | ○推奨 | 他サービス連携仕様 |

#### ケーパビリティレベル（1ファイル）
| ファイル名 | 必須度 | 説明 |
|-----------|--------|------|
| `capability.md` | ◎必須 | ケーパビリティ定義・価値・責務 |

#### オペレーションレベル（1ファイル）
| ファイル名 | 必須度 | 説明 |
|-----------|--------|------|
| `operation.md` | ◎必須 | ビジネスオペレーション定義・v2.0仕様準拠 |

#### ユースケースレベル（2ファイル・1対1）
| ファイル名 | 必須度 | 説明 |
|-----------|--------|------|
| `usecase.md` | ◎必須 | ユースケース定義・詳細フロー |
| `page.md` | ◎必須 | 対応ページ定義（1対1関係） |

## 📐 v2.0仕様準拠要件

### operation.md 必須セクション
```markdown
# ビジネスオペレーション: [操作名]

## パラソルドメイン連携
**操作エンティティ**: EntityName（状態変更の記述）
**パラソル集約**: AggregateRoot - 集約の責務
**ドメインサービス**:
- ServiceName: enhance[Value]() - 価値向上の説明

## ユースケース・ページ分解マトリックス
| ユースケース | 対応ページ | 1対1関係 |
|-------------|-----------|----------|
| usecase-1   | page-1    | ✅       |
| usecase-2   | page-2    | ✅       |

## 🔗 他サービスユースケース利用（ユースケース呼び出し型）
[service-name] ユースケース利用:
├── UC-XXX-01: ユースケース名 → POST /api/service/usecases/xxx-01
└── UC-XXX-02: ユースケース名 → GET /api/service/usecases/xxx-02
```

### usecase.md 必須セクション
```markdown
# ユースケース: [ユースケース名]

## 🏗️ パラソルドメイン連携
### 操作エンティティ
- **EntityName**: 操作内容（状態変更: state1 → state2）

### 集約操作
- **AggregateRoot**: 集約処理の責務・不変条件

### ドメインサービス利用
- **ServiceName**:
  - `methodName()`: メソッドの責務・ビジネス価値
```

### page.md 必須セクション
```markdown
# ページ定義: [ページ名]

**対応ユースケース**: UC-XXX-XX（ユースケース名）

## 🎯 画面の目的
[ビジネス目的とユーザー価値の記述]

## 👥 利用者
- **主要利用者**: [ロール]（[利用目的]）
- **副次利用者**: [ロール]（[利用目的]）

## 🖥️ 画面構成
### [セクション名]
- [機能・表示内容の記述]
```

## 🚫 禁止事項・廃止事項

### 廃止されたディレクトリ構造
```
❌ 廃止: use-cases/ （ハイフン付きは廃止）
❌ 廃止: pages/ （ユースケースと分離構造）
❌ 廃止: step-[number]-[action]/ （シーケンシャル命名）
```

### 廃止されたファイル命名
```
❌ 廃止: step-1-action.md
❌ 廃止: step-7-send-action.md
❌ 廃止: manage-*.md （価値が不明確）
```

### 禁止されるサービス名
```
❌ 禁止: *-management-service
❌ 禁止: *-processing-service
❌ 禁止: *-system-service
```

## 🔄 移行プロセス

### 1. 構造検証
```bash
# 現在の構造確認
find docs/parasol/services -name "operation.md" | wc -l

# v2.0準拠確認
grep -l "パラソルドメイン連携" docs/parasol/services/*/capabilities/*/operations/*/operation.md | wc -l
```

### 2. 段階的移行
1. **Phase 1**: `use-cases` → `usecases` のディレクトリ名統一
2. **Phase 2**: `step-X` ユースケース名の意味ある名前への変更
3. **Phase 3**: 1対1関係の確立（usecase.md ↔ page.md）
4. **Phase 4**: v2.0仕様（パラソルドメイン連携等）の追加

### 3. 品質チェック
```bash
# 1対1関係の確認
find docs/parasol -path "*/usecases/*/usecase.md" | wc -l
find docs/parasol -path "*/usecases/*/page.md" | wc -l
# 上記2つの数が一致すること

# v2.0仕様準拠率
total_operations=$(find docs/parasol -name "operation.md" | wc -l)
v2_operations=$(grep -l "パラソルドメイン連携" docs/parasol/services/*/capabilities/*/operations/*/operation.md | wc -l)
echo "v2.0準拠率: $((v2_operations * 100 / total_operations))%"
```

## 📊 品質指標

### 目標値
- **v2.0仕様準拠率**: 100%
- **1対1関係達成率**: 100%（ユースケース数 = ページ数）
- **ディレクトリ命名統一率**: 100%（usecases のみ）
- **意味のある命名率**: 100%（step-X ゼロ）

### 監視指標
- v1.0構造残存数: 0件
- 廃止ディレクトリ名使用数: 0件
- step-X ユースケース数: 0件

## 🎯 成功定義

✅ **完全成功の条件**:
1. 全7サービスが標準構造に準拠
2. 全オペレーションがv2.0仕様に準拠
3. 全ユースケースで1対1関係を実現
4. 廃止構造・命名の完全排除

---
*この標準仕様により、パラソル設計の品質・保守性・一貫性が大幅に向上します*